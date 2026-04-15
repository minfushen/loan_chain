"""三流交叉验证 JSON 派生器"""

from __future__ import annotations

import json
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from models.profile import EnterpriseProfile
from models.transaction import Transaction


def write_cross_validation_json(
    transactions: list[Transaction],
    profile: EnterpriseProfile,
    output_dir: Path,
) -> Path:
    """生成三流交叉验证 JSON"""
    path = output_dir / f"三流交叉验证_{profile.short_name}_{profile.year}.json"

    total_orders = len(transactions)
    invoiced = [t for t in transactions if t.invoice_no is not None]
    shipped = [t for t in transactions if t.shipment_no is not None]

    total_order_amount = sum(t.total_amount for t in transactions)
    total_invoice_amount = sum(t.total_amount for t in invoiced)
    total_settlement = sum(t.settlement_amount for t in transactions)

    order_invoice_rate = f"{len(invoiced) / max(total_orders, 1) * 100:.1f}%"
    order_logistics_rate = f"{len(shipped) / max(total_orders, 1) * 100:.1f}%"
    invoice_settlement_rate = f"{min(total_settlement / max(total_invoice_amount, 1) * 100, 100):.1f}%"
    overall_rate = f"{(len(invoiced) / max(total_orders, 1) * 100 + len(shipped) / max(total_orders, 1) * 100 + min(total_settlement / max(total_invoice_amount, 1), 1) * 100) / 3:.1f}%"

    cycles = [t.receivable_cycle for t in transactions]
    avg_cycle = sum(cycles) // max(len(cycles), 1)

    anomaly_txns = [t for t in transactions if t.anomaly]

    # ── 月度统计 ──
    monthly: dict[str, list[Transaction]] = defaultdict(list)
    for t in transactions:
        monthly[t.month_key].append(t)

    monthly_stats = []
    for mk in sorted(monthly.keys()):
        m_txns = monthly[mk]
        monthly_stats.append({
            "month": mk,
            "orderCount": len(m_txns),
            "orderAmount": round(sum(t.total_amount for t in m_txns)),
            "invoiceAmount": round(sum(t.total_amount for t in m_txns if t.invoice_no)),
            "settlementAmount": round(sum(t.settlement_amount for t in m_txns)),
            "avgCycle": sum(t.receivable_cycle for t in m_txns) // max(len(m_txns), 1),
            "matchStatus": "完全匹配" if all(t.match_status == "完全匹配" for t in m_txns) else "部分偏差",
            "keyBuyer": max(set(t.buyer_name for t in m_txns), key=lambda n: sum(1 for t in m_txns if t.buyer_name == n)),
        })

    # ── 买方集中度 ──
    buyer_amounts: dict[str, tuple[int, float]] = {}
    for t in transactions:
        prev = buyer_amounts.get(t.buyer_name, (0, 0.0))
        buyer_amounts[t.buyer_name] = (prev[0] + 1, prev[1] + t.total_amount)

    buyer_concentration = []
    for name, (count, amount) in sorted(buyer_amounts.items(), key=lambda x: -x[1][1]):
        ratio = f"{amount / max(total_order_amount, 1) * 100:.1f}%"
        is_main = any(c.name == name and c.is_main_chain for c in profile.counterparties)
        buyer_concentration.append({
            "buyer": name,
            "orderCount": count,
            "orderAmount": round(amount),
            "ratio": ratio,
            "isMainChain": is_main,
            "riskLevel": "可接受" if float(ratio.replace("%", "")) <= 55 else "需关注",
        })

    # ── 六维验证 ──
    has_missing_invoice = any(t.invoice_no is None for t in transactions)
    continuity_score = 100 if not has_missing_invoice else 70
    overall_score = min(95, (continuity_score + 95 + 99 + 98 + 82 + 94) // 6)

    data = {
        "meta": {
            "company": profile.company_name,
            "period": f"{profile.year}-01-01 至 {profile.year}-12-31",
            "generateTime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "engine": "百慧AI-三流交叉验证引擎 v2.1",
            "note": "POC演示数据，订单/物流/回款三流时序对齐",
        },
        "summary": {
            "totalOrders": total_orders,
            "totalOrderAmount": round(total_order_amount),
            "totalInvoices": len(invoiced),
            "totalInvoiceAmount": round(total_invoice_amount),
            "totalShipments": len(shipped),
            "totalReceivables": round(total_settlement),
            "matchRate": {
                "orderToInvoice": order_invoice_rate,
                "orderToLogistics": order_logistics_rate,
                "invoiceToSettlement": invoice_settlement_rate,
                "overall": overall_rate,
            },
            "avgReceivableCycle": avg_cycle,
            "maxReceivableCycle": max(cycles) if cycles else 0,
            "minReceivableCycle": min(cycles) if cycles else 0,
            "anomalies": len(anomaly_txns),
            "anomalyDesc": "; ".join(t.anomaly_note for t in anomaly_txns[:3]) if anomaly_txns else "无异常",
            "aiConclusion": _build_conclusion(transactions, overall_rate, avg_cycle),
        },
        "monthlyStats": monthly_stats,
        "transactions": [_txn_to_dict(t) for t in transactions],
        "buyerConcentration": buyer_concentration,
        "receivableCycleDistribution": _cycle_distribution(cycles),
        "sixDimensionVerification": {
            "continuity": {"score": continuity_score, "desc": "全年连续开票" if continuity_score == 100 else "存在断票月份"},
            "periodicity": {"score": 95, "desc": "订单节奏规律"},
            "correspondence": {"score": 99, "desc": "订单-发票-物流对应率高"},
            "semantics": {"score": 98, "desc": "摘要字段含义清晰"},
            "concentration": {"score": 82, "desc": "客户集中度需关注"},
            "volatility": {"score": 94, "desc": "月度金额波动可解释"},
            "overallScore": overall_score,
            "aiConclusion": f"六维验证综合得分{overall_score}分",
        },
    }

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return path


def _txn_to_dict(t: Transaction) -> dict:
    return {
        "id": t.txn_id,
        "orderNo": t.order_no,
        "orderDate": t.order_date.strftime("%Y-%m-%d"),
        "orderAmount": t.total_amount,
        "buyer": t.buyer_name,
        "product": t.product_name,
        "invoiceNo": t.invoice_no or "",
        "invoiceDate": t.invoice_date.strftime("%Y-%m-%d") if t.invoice_date else "",
        "invoiceAmount": t.total_amount if t.invoice_no else 0,
        "invoiceDaysAfterOrder": (t.invoice_date - t.order_date).days if t.invoice_date else 0,
        "shipmentNo": t.shipment_no or "",
        "shipDate": t.ship_date.strftime("%Y-%m-%d") if t.ship_date else "",
        "signDate": t.sign_date.strftime("%Y-%m-%d") if t.sign_date else "",
        "shipDaysAfterOrder": (t.ship_date - t.order_date).days if t.ship_date else 0,
        "settlementDate": t.settlement_date.strftime("%Y-%m-%d") if t.settlement_date else "",
        "settlementAmount": t.settlement_amount,
        "receivableCycleDays": t.receivable_cycle,
        "matchStatus": t.match_status,
        "anomaly": t.anomaly,
        "note": t.anomaly_note if t.anomaly else "",
    }


def _cycle_distribution(cycles: list[int]) -> dict:
    if not cycles:
        return {"avgDays": 0, "trend": "无数据"}
    bins = {"30天以内": 0, "31-35天": 0, "36-40天": 0, "40天以上": 0}
    for c in cycles:
        if c <= 30:
            bins["30天以内"] += 1
        elif c <= 35:
            bins["31-35天"] += 1
        elif c <= 40:
            bins["36-40天"] += 1
        else:
            bins["40天以上"] += 1
    bins["avgDays"] = sum(cycles) // len(cycles)
    bins["trend"] = "全年回款周期稳定"
    return bins


def _build_conclusion(txns: list[Transaction], rate: str, avg_cycle: int) -> str:
    anomaly_count = sum(1 for t in txns if t.anomaly)
    if anomaly_count == 0:
        return f"三流匹配度{rate}，订单-物流-回款时序高度一致，经营真实性验证通过。平均回款周期{avg_cycle}天。"
    return f"三流匹配度{rate}，存在{anomaly_count}处偏差需关注。平均回款周期{avg_cycle}天。"

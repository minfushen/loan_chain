"""异常注入引擎 — 根据配置在交易记录中注入受控偏差"""

from __future__ import annotations

import random
from datetime import timedelta

from models.profile import AnomalyConfig, AnomalyType, EnterpriseProfile
from models.transaction import Transaction


def inject_anomalies(
    transactions: list[Transaction],
    anomalies: list[AnomalyConfig],
    seed: int = 0,
) -> list[Transaction]:
    """按配置列表顺序注入异常，返回修改后的交易列表。

    每种异常类型独立处理，互不干扰。
    """
    rng = random.Random(seed + 99)

    for anomaly in anomalies:
        affected = [
            t for t in transactions
            if anomaly.month_range[0] <= t.order_date.month <= anomaly.month_range[1]
        ]
        if not affected:
            continue

        handler = _HANDLERS.get(anomaly.type)
        if handler:
            handler(affected, anomaly.severity, rng)

    return transactions


def _handle_missing_invoices(
    affected: list[Transaction],
    severity: float,
    rng: random.Random,
) -> None:
    """断票：按严重度删除部分发票"""
    drop_count = max(1, int(len(affected) * severity))
    targets = rng.sample(affected, min(drop_count, len(affected)))
    for t in targets:
        t.invoice_no = None
        t.invoice_date = None
        t.invoice_status = "未开票"
        t.anomaly = True
        t.anomaly_note = "未开具发票"
        t.match_status = "发票缺失"


def _handle_delayed_logistics(
    affected: list[Transaction],
    severity: float,
    rng: random.Random,
) -> None:
    """物流延迟签收"""
    delay_days = max(1, int(severity * 10))
    for t in affected:
        if rng.random() < severity:
            extra = rng.randint(max(1, delay_days - 2), delay_days + 2)
            if t.sign_date and t.ship_date:
                t.sign_date = t.sign_date + timedelta(days=extra)
                t.anomaly = True
                t.anomaly_note = f"签收延迟{extra}天"
                t.match_status = "物流延迟"


def _handle_extended_receivable(
    affected: list[Transaction],
    severity: float,
    rng: random.Random,
) -> None:
    """回款周期拉长"""
    extra_days = max(5, int(severity * 15))
    for t in affected:
        if rng.random() < severity:
            jitter = rng.randint(max(1, extra_days - 3), extra_days + 3)
            t.receivable_cycle += jitter
            if t.settlement_date:
                t.settlement_date = t.settlement_date + timedelta(days=jitter)
            t.settlement_amount = round(t.total_amount * rng.uniform(0.95, 1.0), 2)
            t.anomaly = True
            t.anomaly_note = f"回款周期拉长{jitter}天"
            t.match_status = "回款延迟"


def _handle_net_outflow(
    affected: list[Transaction],
    severity: float,
    rng: random.Random,
) -> None:
    """净流出 — 标记交易，实际影响在银行流水生成器中处理"""
    for t in affected:
        if rng.random() < severity:
            t.anomaly = True
            t.anomaly_note = "账户净流出期间"
            t.match_status = "资金异常"


def _handle_order_decline(
    affected: list[Transaction],
    severity: float,
    rng: random.Random,
) -> None:
    """订单量下滑 — 从受影响月份中删除部分交易"""
    drop_count = max(1, int(len(affected) * severity))
    targets = rng.sample(affected, min(drop_count, len(affected)))
    for t in targets:
        t.anomaly = True
        t.anomaly_note = "订单下滑期（标记，将从最终列表移除）"
        t.match_status = "订单缺失"


def _handle_abnormal_invoice_void(
    affected: list[Transaction],
    severity: float,
    rng: random.Random,
) -> None:
    """异常作废发票"""
    void_count = max(1, int(len(affected) * severity))
    targets = rng.sample(affected, min(void_count, len(affected)))
    for t in targets:
        if t.invoice_no:
            t.invoice_status = "已作废"
            t.anomaly = True
            t.anomaly_note = "发票作废"
            t.match_status = "发票异常"


def _handle_public_private_mix(
    affected: list[Transaction],
    severity: float,
    rng: random.Random,
) -> None:
    """公私账户混用 — 标记"""
    for t in affected:
        if rng.random() < severity:
            t.anomaly = True
            t.anomaly_note = "公私账户混用标记"
            t.match_status = "资金异常"


# ── 标记型异常（仅影响断言，不修改交易数据）──
def _noop(affected: list[Transaction], severity: float, rng: random.Random) -> None:
    """空操作 — 仅影响预期断言生成"""


# 异常处理器注册表
_HANDLERS: dict[AnomalyType, callable] = {
    AnomalyType.MISSING_INVOICES: _handle_missing_invoices,
    AnomalyType.DELAYED_LOGISTICS: _handle_delayed_logistics,
    AnomalyType.EXTENDED_RECEIVABLE: _handle_extended_receivable,
    AnomalyType.NET_OUTFLOW: _handle_net_outflow,
    AnomalyType.HIGH_CONCENTRATION: _noop,
    AnomalyType.ORDER_DECLINE: _handle_order_decline,
    AnomalyType.MATERIAL_MISSING: _noop,
    AnomalyType.ABNORMAL_INVOICE_VOID: _handle_abnormal_invoice_void,
    AnomalyType.PUBLIC_PRIVATE_MIX: _handle_public_private_mix,
    AnomalyType.SHORT_HISTORY: _noop,
}

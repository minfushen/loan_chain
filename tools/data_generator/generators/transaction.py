"""交易真相生成器 — 核心：根据企业画像参数生成全年交易记录列表"""

from __future__ import annotations

import random
from datetime import date, timedelta

from models.profile import EnterpriseProfile
from models.transaction import Transaction
from utils.amount import DEFAULT_TAX_RATES, calc_tax, calc_tax_excluded
from utils.date_utils import add_business_days, random_date_in_month
from utils.naming import NamingGenerator


def _pick_counterparty(profile: EnterpriseProfile, rng: random.Random) -> tuple[str, str, bool]:
    """按权重随机选取买方"""
    r = rng.random()
    cumulative = 0.0
    for cp in profile.counterparties:
        cumulative += cp.weight
        if r <= cumulative:
            return cp.name, cp.code, cp.is_main_chain
    last = profile.counterparties[-1]
    return last.name, last.code, last.is_main_chain


def _pick_product(profile: EnterpriseProfile, rng: random.Random) -> tuple[str, str, float]:
    """随机选取产品，返回 (名称, 规格, 单价)"""
    prod = rng.choice(profile.products)
    unit_price = round(rng.uniform(prod.unit_price_min, prod.unit_price_max), 2)
    return prod.name, prod.spec, unit_price


def _distribute_orders_to_months(
    total_orders: int,
    annual_sales_wan: float,
    year: int,
    rng: random.Random,
) -> list[tuple[int, int, float]]:
    """将全年订单分配到各月，返回 [(月, 本月订单数, 本月金额系数), ...]。

    金额系数模拟淡旺季：Q1 偏低，Q4 偏高，中间平滑。
    """
    # 季节权重（1-12 月）
    seasonal = [0.06, 0.06, 0.07, 0.08, 0.08, 0.09, 0.09, 0.10, 0.10, 0.09, 0.09, 0.09]
    total_w = sum(seasonal)

    months_orders: list[tuple[int, int, float]] = []
    remaining = total_orders

    for m in range(1, 13):
        if m == 12:
            count = remaining
        else:
            fraction = seasonal[m - 1] / total_w
            count = max(1, round(total_orders * fraction + rng.uniform(-0.5, 0.5)))
            count = min(count, remaining - (12 - m))  # 确保后续每月至少 1 单
            remaining -= count

        amount_factor = seasonal[m - 1] / (total_w / 12)  # 相对均值系数
        months_orders.append((m, count, amount_factor))

    return months_orders


def _pick_logistics_details(
    profile: EnterpriseProfile,
    rng: random.Random,
) -> tuple[float, float, str, str, str, str]:
    """生成物流详情: (重量kg, 运费, 司机, 车牌, 地址, 签收人)"""
    weight = round(rng.uniform(2, 20), 1)
    freight = round(weight * rng.uniform(80, 120), 2)

    drivers = ["王建国", "张伟", "刘强", "赵明", "李军"]
    plates = [
        "苏A12345", "苏A23456", "苏A34567", "苏B45678", "苏C56789",
        "苏D67890", "苏E78901", "苏F89012",
    ]
    signers = ["李明", "赵华", "陈刚", "王芳", "张磊"]

    address_map: dict[str, str] = {
        "江苏苏州": "江苏省苏州市吴中区盛拓工业园",
        "江苏无锡": "江苏省无锡市新吴区创达工业园",
        "江苏南京": "江苏省南京市江宁区科技园",
        "江苏常州": "江苏省常州市新北区工业园",
        "江苏徐州": "江苏省徐州市铜山区物流园",
    }
    region = profile.logistics_region or "江苏苏州"
    address = address_map.get(region, f"江苏省{region.replace('江苏', '')}工业园区")

    return (
        weight,
        freight,
        rng.choice(drivers),
        rng.choice(plates),
        address,
        rng.choice(signers),
    )


def _assign_bank_account(
    profile: EnterpriseProfile,
    rng: random.Random,
) -> int:
    """按权重分配回款银行账户"""
    if not profile.bank_accounts:
        return 0
    r = rng.random()
    cumulative = 0.0
    for i, acc in enumerate(profile.bank_accounts):
        cumulative += acc.weight
        if r <= cumulative:
            return i
    return len(profile.bank_accounts) - 1


def generate_transactions(profile: EnterpriseProfile) -> list[Transaction]:
    """根据企业画像生成全年交易记录列表。

    这是整个生成器的核心：先按月分配订单量，再逐笔生成交易详情。
    每笔交易包含完整的时序（下单→开票→发货→签收→回款）和关联编号。
    """
    rng = random.Random(profile.seed)
    prefix = profile.prefix or profile.short_name[:2].upper()
    naming = NamingGenerator(prefix)
    tax_rate = DEFAULT_TAX_RATES.get(profile.vat_type, 0.03)

    months_plan = _distribute_orders_to_months(
        profile.order_count_12m,
        profile.annual_sales,
        profile.year,
        rng,
    )

    transactions: list[Transaction] = []

    for month, order_count, amount_factor in months_plan:
        # 每月订单金额均值 = (年均/12) * 季节系数 / 月订单数
        monthly_sales = profile.annual_sales * 10000 / 12 * amount_factor
        avg_amount_per_order = monthly_sales / max(order_count, 1)

        for _ in range(order_count):
            # ── 买方与产品 ──
            buyer_name, buyer_code, is_main = _pick_counterparty(profile, rng)
            product_name, product_spec, unit_price = _pick_product(profile, rng)

            # 数量：让订单金额围绕月均值波动 ±30%
            target_amount = avg_amount_per_order * rng.uniform(0.7, 1.3)
            quantity = max(1, round(target_amount / unit_price))
            order_amount_excl = round(quantity * unit_price, 2)
            tax_amount = round(order_amount_excl * tax_rate, 2)
            total_amount = round(order_amount_excl + tax_amount, 2)

            # ── 时序 ──
            order_date = random_date_in_month(profile.year, month, rng)
            invoice_days = rng.randint(1, 5)  # 订单后 1-5 个工作日开票
            invoice_date = add_business_days(order_date, invoice_days)

            ship_date = add_business_days(order_date, profile.ship_days_after_order)
            sign_date = ship_date + timedelta(days=profile.logistics_transit_days)

            cycle_jitter = rng.randint(
                -profile.receivable_cycle_jitter,
                profile.receivable_cycle_jitter,
            )
            receivable_cycle = max(15, profile.receivable_cycle_base + cycle_jitter)
            settlement_date = add_business_days(order_date, receivable_cycle)
            settlement_amount = total_amount

            # ── 物流 ──
            weight_kg, freight, driver, plate, address, signer = _pick_logistics_details(profile, rng)

            # ── 银行账户 ──
            bank_idx = _assign_bank_account(profile, rng)

            # ── 编号 ──
            txn_id = naming.next_txn_id()
            order_no = naming.next_order_no(order_date)
            invoice_no = naming.next_invoice_no(invoice_date)
            shipment_no = naming.next_shipment_no(ship_date)

            txn = Transaction(
                txn_id=txn_id,
                order_no=order_no,
                invoice_no=invoice_no,
                shipment_no=shipment_no,
                order_date=order_date,
                invoice_date=invoice_date,
                ship_date=ship_date,
                sign_date=sign_date,
                settlement_date=settlement_date,
                buyer_name=buyer_name,
                buyer_code=buyer_code,
                product_name=product_name,
                product_spec=product_spec,
                quantity=quantity,
                unit_price=unit_price,
                order_amount=order_amount_excl,
                tax_rate=tax_rate,
                tax_amount=tax_amount,
                total_amount=total_amount,
                receivable_cycle=receivable_cycle,
                settlement_amount=settlement_amount,
                carrier=profile.logistics_carrier,
                weight_kg=weight_kg,
                freight=freight,
                driver_name=driver,
                plate_no=plate,
                ship_address=address,
                signer=signer,
                is_main_chain_buyer=is_main,
                bank_index=bank_idx,
            )
            transactions.append(txn)

    # 按订单日期排序
    transactions.sort(key=lambda t: t.order_date)

    # 重新编号确保连续
    for i, txn in enumerate(transactions, 1):
        txn.txn_id = f"TXN-{i:03d}"

    return transactions

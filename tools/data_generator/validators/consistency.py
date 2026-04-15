"""一致性校验器 — 验证生成数据之间的金额/编号/时序一致性"""

from __future__ import annotations

import logging
from datetime import date

from models.transaction import Transaction

logger = logging.getLogger(__name__)


class ValidationResult:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    @property
    def ok(self) -> bool:
        return len(self.errors) == 0

    def error(self, msg: str) -> None:
        self.errors.append(msg)
        logger.error(f"[校验失败] {msg}")

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)
        logger.warning(f"[警告] {msg}")

    def report(self) -> str:
        lines: list[str] = []
        if self.errors:
            lines.append(f"错误 ({len(self.errors)}):")
            lines.extend(f"  - {e}" for e in self.errors)
        if self.warnings:
            lines.append(f"警告 ({len(self.warnings)}):")
            lines.extend(f"  - {w}" for w in self.warnings)
        if not self.errors and not self.warnings:
            lines.append("全部通过，无错误或警告。")
        return "\n".join(lines)


def validate_transactions(transactions: list[Transaction]) -> ValidationResult:
    """对交易列表执行一致性校验"""
    result = ValidationResult()

    if not transactions:
        result.error("交易列表为空")
        return result

    # 1. 时序合法性：下单 ≤ 开票 ≤ 发货 ≤ 签收 ≤ 回款
    for t in transactions:
        if t.invoice_date and t.invoice_date < t.order_date:
            result.error(f"{t.txn_id}: 开票日期 {t.invoice_date} 早于下单日期 {t.order_date}")
        if t.ship_date and t.ship_date < t.order_date:
            result.error(f"{t.txn_id}: 发货日期 {t.ship_date} 早于下单日期 {t.order_date}")
        if t.sign_date and t.ship_date and t.sign_date < t.ship_date:
            result.error(f"{t.txn_id}: 签收日期 {t.sign_date} 早于发货日期 {t.ship_date}")
        if t.settlement_date and t.sign_date and t.settlement_date < t.sign_date:
            result.warn(f"{t.txn_id}: 回款日期 {t.settlement_date} 早于签收日期 {t.sign_date}")

    # 2. 金额合法性
    for t in transactions:
        expected_total = round(t.order_amount + t.tax_amount, 2)
        if abs(t.total_amount - expected_total) > 1:
            result.error(f"{t.txn_id}: 价税合计 {t.total_amount} != 不含税 {t.order_amount} + 税额 {t.tax_amount} = {expected_total}")

    # 3. 编号唯一性
    order_nos = [t.order_no for t in transactions]
    dup_orders = [n for n in order_nos if order_nos.count(n) > 1]
    if dup_orders:
        result.error(f"订单号重复: {set(dup_orders)}")

    invoice_nos = [t.invoice_no for t in transactions if t.invoice_no]
    dup_invoices = [n for n in invoice_nos if invoice_nos.count(n) > 1]
    if dup_invoices:
        result.error(f"发票号重复: {set(dup_invoices)}")

    # 4. 按月统计汇总
    from collections import defaultdict
    monthly: dict[int, float] = defaultdict(float)
    for t in transactions:
        monthly[t.month] += t.total_amount

    total = sum(monthly.values())
    if total <= 0:
        result.error("全年订单总额为零或负数")

    # 5. 月份连续性（非异常情况下不应有空月）
    months_with_orders = sorted(monthly.keys())
    if not any(t.anomaly for t in transactions):
        expected_months = list(range(1, 13))
        missing = [m for m in expected_months if m not in months_with_orders]
        if missing:
            result.warn(f"以下月份无订单: {missing}")

    return result

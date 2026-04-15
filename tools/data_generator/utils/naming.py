"""编号生成器 — 生成订单号/发票号/运单号，格式对齐现有 poc-test-data"""

from __future__ import annotations

from datetime import date


class NamingGenerator:
    """统一编号生成，格式与 poc-test-data 中衡远包装的编号一致。

    订单号: ORD-2025010003  （ORD-{年月}{月内序号4位}）
    发票号: HY2025010001    （{简称前缀}{年月}{月内序号4位}）
    运单号: YUN-HY-20250110-001  （YUN-{简称}-{发货日期}-{日序号}）
    交易ID: TXN-001
    """

    def __init__(self, prefix: str) -> None:
        """prefix: 短称拼音首字母，如衡远包装用 'HY'"""
        self.prefix = prefix.upper()
        self._txn_seq = 0
        self._monthly_ord_seq: dict[str, int] = {}
        self._monthly_inv_seq: dict[str, int] = {}
        self._daily_ship_seq: dict[str, int] = {}

    def next_txn_id(self) -> str:
        self._txn_seq += 1
        return f"TXN-{self._txn_seq:03d}"

    def next_order_no(self, order_date: date) -> str:
        key = f"{order_date.year}{order_date.month:02d}"
        seq = self._monthly_ord_seq.get(key, 0) + 1
        self._monthly_ord_seq[key] = seq
        return f"ORD-{key}{seq:04d}"

    def next_invoice_no(self, invoice_date: date) -> str:
        key = f"{invoice_date.year}{invoice_date.month:02d}"
        seq = self._monthly_inv_seq.get(key, 0) + 1
        self._monthly_inv_seq[key] = seq
        return f"{self.prefix}{key}{seq:04d}"

    def next_shipment_no(self, ship_date: date) -> str:
        key = ship_date.strftime("%Y%m%d")
        seq = self._daily_ship_seq.get(key, 0) + 1
        self._daily_ship_seq[key] = seq
        return f"YUN-{self.prefix}-{key}-{seq:03d}"

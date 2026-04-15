"""订单 CSV 派生器"""

from __future__ import annotations

import csv
from datetime import date
from pathlib import Path
from typing import IO

from models.profile import EnterpriseProfile
from models.transaction import Transaction

# 列头严格对齐 poc-test-data/订单明细_衡远包装_2025.csv
HEADERS = [
    "订单号", "下单日期", "买方名称", "买方代号", "产品名称", "规格型号",
    "数量（件）", "单价（元）", "订单金额（元），含税", "账期（天）",
    "预计交货日", "订单状态", "对应发票号",
]


def _fmt(d: date | None) -> str:
    if d is None:
        return ""
    return d.strftime("%Y/%m/%d")


def write_orders_csv(
    transactions: list[Transaction],
    profile: EnterpriseProfile,
    output_dir: Path,
) -> Path:
    """生成订单明细 CSV，返回文件路径"""
    path = output_dir / f"订单明细_{profile.short_name}_{profile.year}.csv"
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        _write_rows(f, transactions)
    return path


def _write_rows(f: IO, transactions: list[Transaction]) -> None:
    writer = csv.writer(f)
    writer.writerow(HEADERS)
    for t in transactions:
        status = "已完成" if t.sign_date else "待发货"
        writer.writerow([
            t.order_no,
            _fmt(t.order_date),
            t.buyer_name,
            t.buyer_code,
            t.product_name,
            t.product_spec,
            t.quantity,
            f"{t.unit_price:.2f}",
            f"{t.total_amount:.0f}",
            t.receivable_cycle,
            _fmt(t.ship_date),
            status,
            t.invoice_no or "",
        ])

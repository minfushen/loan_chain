"""发票 CSV 派生器"""

from __future__ import annotations

import csv
from pathlib import Path
from typing import IO

from models.profile import EnterpriseProfile
from models.transaction import Transaction

# 列头严格对齐 poc-test-data/发票数据_衡远包装_2025.csv
HEADERS = [
    "企业代号", "发票号码", "开票日期", "购方单位代号", "购方名称",
    "金额", "税额", "价税合计", "发票状态", "对应订单号",
]


def _enterprise_code(profile: EnterpriseProfile) -> str:
    """企业代号，如衡远包装 → 'E-HY'"""
    prefix = profile.prefix or profile.short_name[:2].upper()
    return f"E-{prefix}"


def write_invoices_csv(
    transactions: list[Transaction],
    profile: EnterpriseProfile,
    output_dir: Path,
) -> Path:
    """生成发票数据 CSV，跳过未开票交易（invoice_no=None），返回文件路径"""
    path = output_dir / f"发票数据_{profile.short_name}_{profile.year}.csv"
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(HEADERS)
        e_code = _enterprise_code(profile)
        for t in transactions:
            if t.invoice_no is None:
                continue  # 断票：此笔未开票
            writer.writerow([
                e_code,
                t.invoice_no,
                t.invoice_date.strftime("%Y/%m/%d") if t.invoice_date else "",
                t.buyer_code,
                t.buyer_name,
                f"{t.order_amount:.2f}",
                f"{t.tax_amount:.2f}",
                f"{t.total_amount:.0f}",
                t.invoice_status,
                t.order_no,
            ])
    return path

"""物流签收单 CSV 派生器"""

from __future__ import annotations

import csv
from pathlib import Path
from typing import IO

from models.profile import EnterpriseProfile
from models.transaction import Transaction

# 列头严格对齐 poc-test-data/物流签收单_衡远包装_2025.csv
HEADERS = [
    "运单号", "发货日期", "签收日期", "发货方", "收货方", "收货地址",
    "货物描述", "件数", "重量（kg）", "运费（元）", "承运方",
    "司机姓名", "车牌号", "签收状态", "签收人", "对应订单号", "时效（天）", "备注",
]


def write_logistics_csv(
    transactions: list[Transaction],
    profile: EnterpriseProfile,
    output_dir: Path,
) -> Path:
    """生成物流签收单 CSV，跳过无运单的交易，返回文件路径"""
    path = output_dir / f"物流签收单_{profile.short_name}_{profile.year}.csv"
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(HEADERS)
        for t in transactions:
            if t.shipment_no is None:
                continue
            transit = (t.sign_date - t.ship_date).days if t.sign_date and t.ship_date else 0
            status = "已签收" if t.sign_date else "运输中"
            remark = "正常"
            if transit > 3:
                remark = "延迟签收"
                status = "已签收（延迟）"
            desc = f"{t.product_name}×{t.quantity}件"
            prefix = profile.prefix or profile.short_name[:2].upper()
            expected_prefix = f"YUN-{prefix}-"
            writer.writerow([
                t.shipment_no,
                t.ship_date.strftime("%Y/%m/%d") if t.ship_date else "",
                t.sign_date.strftime("%Y/%m/%d") if t.sign_date else "",
                profile.company_name,
                t.buyer_name,
                t.ship_address,
                desc,
                t.quantity,
                f"{t.weight_kg:.1f}",
                f"{t.freight:.2f}",
                t.carrier,
                t.driver_name,
                t.plate_no,
                status,
                t.signer,
                t.order_no,
                transit,
                remark,
            ])
    return path

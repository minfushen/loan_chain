"""纳税申报记录 CSV + JSON 派生器"""

from __future__ import annotations

import csv
import json
from datetime import datetime
from pathlib import Path

from models.profile import EnterpriseProfile
from models.transaction import Transaction


def write_tax_records(
    transactions: list[Transaction],
    profile: EnterpriseProfile,
    output_dir: Path,
) -> tuple[Path, Path]:
    """生成纳税申报记录 CSV 和纳税申报详情 JSON，返回 (csv_path, json_path)"""
    csv_path = output_dir / f"纳税申报记录_{profile.short_name}_{profile.year}.csv"
    json_path = output_dir / f"纳税申报详情_{profile.short_name}_{profile.year}.json"

    # 按月汇总应税收入
    monthly_sales: dict[int, float] = {}
    for t in transactions:
        if t.invoice_no is not None:
            monthly_sales[t.month] = monthly_sales.get(t.month, 0) + t.total_amount

    # CSV
    csv_headers = ["月份", "应税收入（元）", "增值税额（元）", "附加税（元）", "申报状态", "申报日期"]
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(csv_headers)
        for m in range(1, 13):
            sales = monthly_sales.get(m, 0)
            vat = round(sales * 0.03)
            surcharge = round(vat * 0.12)
            status = "已申报" if sales > 0 else "零申报"
            filing_day = min(15, 28) if m < 12 else 15
            writer.writerow([
                f"{profile.year}-{m:02d}",
                f"{sales:.2f}",
                f"{vat:.2f}",
                f"{surcharge:.2f}",
                status,
                f"{profile.year}-{m + 1 if m < 12 else 12}-{filing_day:02d}",
            ])

    # JSON
    annual_sales = sum(monthly_sales.values())
    annual_vat = round(annual_sales * 0.03)
    details = {
        "meta": {
            "company": profile.company_name,
            "year": profile.year,
            "taxType": profile.vat_type,
        },
        "annual": {
            "totalTaxableIncome": round(annual_sales),
            "totalVAT": annual_vat,
            "totalSurcharge": round(annual_vat * 0.12),
            "incomeTaxEstimate": round(annual_sales * 0.025),
        },
        "monthlyDetails": [
            {
                "month": f"{profile.year}-{m:02d}",
                "taxableIncome": round(monthly_sales.get(m, 0)),
                "vat": round(monthly_sales.get(m, 0) * 0.03),
                "status": "正常" if monthly_sales.get(m, 0) > 0 else "零申报",
            }
            for m in range(1, 13)
        ],
        "compliance": {
            "filingCompliance": "按时申报",
            "taxArrears": False,
            "taxViolation": False,
        },
    }

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(details, f, ensure_ascii=False, indent=2)

    return csv_path, json_path

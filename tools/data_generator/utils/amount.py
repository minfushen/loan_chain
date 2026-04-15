"""金额工具 — 含税/不含税/税额计算"""

from __future__ import annotations


def calc_tax_excluded(amount_with_tax: float, tax_rate: float) -> float:
    """价税合计 → 不含税金额"""
    return round(amount_with_tax / (1 + tax_rate), 2)


def calc_tax(amount_with_tax: float, tax_rate: float) -> float:
    """价税合计 → 税额"""
    return round(amount_with_tax - calc_tax_excluded(amount_with_tax, tax_rate), 2)


def calc_tax_included(amount: float, tax_rate: float) -> float:
    """不含税金额 → 价税合计"""
    return round(amount * (1 + tax_rate), 2)


# 小规模纳税人增值税率 3%，一般纳税人 13%
DEFAULT_TAX_RATES: dict[str, float] = {
    "小规模纳税人": 0.03,
    "一般纳税人": 0.13,
}

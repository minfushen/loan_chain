"""日期工具 — 工作日偏移、随机日期生成"""

from __future__ import annotations

import random
from datetime import date, timedelta


def add_business_days(start: date, days: int) -> date:
    """跳过周末加天数（简化版，不处理法定节假日）"""
    current = start
    added = 0
    while added < days:
        current += timedelta(days=1)
        if current.weekday() < 5:  # 周一至周五
            added += 1
    return current


def random_date_in_month(year: int, month: int, rng: random.Random) -> date:
    """在指定月份内随机选一个工作日"""
    if month == 12:
        last_day = 31
    else:
        last_day = (date(year, month + 1, 1) - timedelta(days=1)).day

    for _ in range(50):
        day = rng.randint(1, last_day)
        d = date(year, month, day)
        if d.weekday() < 5:
            return d

    return date(year, month, min(28, last_day))


def date_range_covered(transactions: list) -> tuple[date, date]:
    """获取交易列表覆盖的日期范围"""
    if not transactions:
        return date(2025, 1, 1), date(2025, 12, 31)
    dates = [t.order_date for t in transactions]
    return min(dates), max(dates)

"""银行流水 CSV 派生器"""

from __future__ import annotations

import csv
import random
from datetime import date, timedelta
from pathlib import Path

from models.profile import BankAccount, EnterpriseProfile
from models.transaction import Transaction
from utils.date_utils import add_business_days


def write_bank_statements(
    transactions: list[Transaction],
    profile: EnterpriseProfile,
    output_dir: Path,
    rng: random.Random | None = None,
) -> list[Path]:
    """为每个银行账户生成流水 CSV。返回生成的文件路径列表。"""
    if rng is None:
        rng = random.Random(profile.seed + 1)

    if not profile.bank_accounts:
        return []

    # 按银行账户分组回款交易
    bank_txns: dict[int, list[Transaction]] = {}
    for t in transactions:
        bank_txns.setdefault(t.bank_index, []).append(t)

    bank_dir = output_dir / "对公流水"
    bank_dir.mkdir(parents=True, exist_ok=True)

    paths: list[Path] = []
    for i, acc in enumerate(profile.bank_accounts):
        txns = bank_txns.get(i, [])
        if not txns:
            continue
        filename = f"{acc.bank_name}流水_{profile.short_name}_{profile.year}.csv"
        path = bank_dir / filename
        _write_bank_csv(path, txns, profile, acc, rng)
        paths.append(path)

    return paths


def _write_bank_csv(
    path: Path,
    txns: list[Transaction],
    profile: EnterpriseProfile,
    account: BankAccount,
    rng: random.Random,
) -> None:
    """生成单个银行账户的流水 CSV"""
    headers = [
        "交易时间", "借方发生额（支出）", "贷方发生额（收入）",
        "账户余额", "对方账号", "对方户名", "摘要",
    ]

    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)

        # 表头（对齐现有格式：查询账号行 + 列头行）
        writer.writerow([
            f"查询账号:,{account.account_masked},,{profile.company_name},,,",
        ])
        writer.writerow(headers)

        balance = round(rng.uniform(5000, 50000), 2)
        sorted_txns = sorted(txns, key=lambda t: t.settlement_date or t.order_date)

        for t in sorted_txns:
            settle_date = t.settlement_date or add_business_days(t.order_date, 30)
            time_str = f"{settle_date} {rng.randint(8,16):02d}:{rng.randint(10,59):02d}:{rng.randint(10,59):02d}"

            # 贷方：回款入账
            credit = t.settlement_amount
            balance = round(balance + credit, 2)
            writer.writerow([
                time_str,
                0,
                f"{credit:.2f}",
                f"{balance:.2f}",
                _mask_account(rng),
                t.buyer_name[:2] + "**",
                "货款",
            ])

            # 借方：随机支出（材料采购、工资等）
            expense_count = rng.randint(0, 2)
            for _ in range(expense_count):
                exp_date = settle_date + timedelta(days=rng.randint(1, 3))
                exp_time = f"{exp_date} {rng.randint(8,16):02d}:{rng.randint(10,59):02d}:{rng.randint(10,59):02d}"
                expense = round(rng.uniform(1000, min(balance * 0.5, 30000)), 2)
                if expense >= balance:
                    continue
                balance = round(balance - expense, 2)
                desc = rng.choice(["材料", "工资", "转账", "房租", "水电"])
                writer.writerow([
                    exp_time,
                    f"{expense:.2f}",
                    0,
                    f"{balance:.2f}",
                    _mask_account(rng),
                    rng.choice(["张*", "李*", "王*", "陈*"]),
                    desc,
                ])


def _mask_account(rng: random.Random) -> str:
    """生成脱敏对方账号"""
    prefix = rng.choice(["6228", "6214", "5183", "1064"])
    stars = "*" * rng.randint(4, 10)
    suffix = f"{rng.randint(1000,9999)}"
    return f"{prefix}{stars}{suffix}"

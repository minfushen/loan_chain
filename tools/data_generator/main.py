"""CLI 入口 — python main.py --config config/profiles/hengyuan.yaml --output ./test-output"""

from __future__ import annotations

import argparse
import json
import logging
import sys
from datetime import datetime
from pathlib import Path

import yaml

from generators.anomaly import inject_anomalies
from generators.bank_statement import write_bank_statements
from generators.business_info import write_business_info_json
from generators.cross_validation import write_cross_validation_json
from generators.invoice import write_invoices_csv
from generators.logistics import write_logistics_csv
from generators.order import write_orders_csv
from generators.tax_record import write_tax_records
from generators.transaction import generate_transactions
from models.profile import EnterpriseProfile
from validators.consistency import validate_transactions

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


def load_profile(config_path: Path) -> EnterpriseProfile:
    """从 YAML 文件加载企业画像配置"""
    with open(config_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return EnterpriseProfile(**data)


def generate_for_profile(profile: EnterpriseProfile, output_base: Path) -> None:
    """为单个企业画像生成全套测试数据"""
    # 输出目录
    ts = datetime.now().strftime("%Y%m%d")
    output_dir = output_base / f"{profile.short_name}_{ts}"
    output_dir.mkdir(parents=True, exist_ok=True)

    logger.info(f"=== 生成 {profile.short_name} ({profile.company_name}) ===")
    logger.info(f"输出目录: {output_dir}")

    # Step 1: 生成交易真相
    logger.info("Step 1: 生成交易真相...")
    transactions = generate_transactions(profile)
    logger.info(f"  生成 {len(transactions)} 笔交易")

    # Step 2: 注入异常
    if profile.anomalies:
        logger.info(f"Step 2: 注入 {len(profile.anomalies)} 种异常...")
        transactions = inject_anomalies(transactions, profile.anomalies, seed=profile.seed)
        anomaly_count = sum(1 for t in transactions if t.anomaly)
        logger.info(f"  标记异常交易 {anomaly_count} 笔")
    else:
        logger.info("Step 2: 无异常配置，跳过")

    # Step 3: 一致性校验
    logger.info("Step 3: 一致性校验...")
    result = validate_transactions(transactions)
    print(result.report())
    if not result.ok:
        logger.error("一致性校验失败，终止生成")
        return

    # Step 4: 派生文件
    logger.info("Step 4: 生成派生文件...")

    order_path = write_orders_csv(transactions, profile, output_dir)
    logger.info(f"  订单: {order_path.name}")

    invoice_path = write_invoices_csv(transactions, profile, output_dir)
    logger.info(f"  发票: {invoice_path.name}")

    logistics_path = write_logistics_csv(transactions, profile, output_dir)
    logger.info(f"  物流: {logistics_path.name}")

    bank_paths = write_bank_statements(transactions, profile, output_dir)
    for p in bank_paths:
        logger.info(f"  流水: {p.name}")

    biz_path = write_business_info_json(transactions, profile, output_dir)
    logger.info(f"  工商: {biz_path.name}")

    tax_csv, tax_json = write_tax_records(transactions, profile, output_dir)
    logger.info(f"  纳税: {tax_csv.name}, {tax_json.name}")

    cross_path = write_cross_validation_json(transactions, profile, output_dir)
    logger.info(f"  三流验证: {cross_path.name}")

    # Step 5: 保存配置快照
    snapshot_path = output_dir / "enterprise_profile.json"
    with open(snapshot_path, "w", encoding="utf-8") as f:
        json.dump(profile.model_dump(mode="json"), f, ensure_ascii=False, indent=2)
    logger.info(f"  配置快照: {snapshot_path.name}")

    # 统计
    total_order_amount = sum(t.total_amount for t in transactions)
    logger.info(f"--- {profile.short_name} 生成完毕 ---")
    logger.info(f"  交易: {len(transactions)} 笔 | 总额: {total_order_amount:,.0f} 元 | 文件: {len(list(output_dir.iterdir()))} 个")


def main() -> None:
    parser = argparse.ArgumentParser(description="百慧测试数据生成器")
    parser.add_argument("--config", type=Path, help="单个企业画像 YAML 配置文件")
    parser.add_argument("--batch", type=Path, help="批量生成配置文件（YAML，包含 profiles 列表）")
    parser.add_argument("--output", type=Path, default=Path("./test-output"), help="输出目录（默认 ./test-output）")
    args = parser.parse_args()

    if args.config:
        profile = load_profile(args.config)
        generate_for_profile(profile, args.output)
    elif args.batch:
        with open(args.batch, "r", encoding="utf-8") as f:
            batch = yaml.safe_load(f)
        for cfg_path in batch.get("profiles", []):
            profile = load_profile(Path(cfg_path))
            generate_for_profile(profile, args.output)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()

"""企业画像输入模型 — 控制生成器的全部行为"""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, model_validator


# ── 异常类型枚举 ──────────────────────────────────────────


class AnomalyType(str, Enum):
    """支持的异常注入类型"""
    MISSING_INVOICES = "missing_invoices"              # 部分月份断票
    DELAYED_LOGISTICS = "delayed_logistics"            # 物流延迟签收
    EXTENDED_RECEIVABLE = "extended_receivable"        # 回款周期拉长
    NET_OUTFLOW = "net_outflow"                        # 账户持续净流出
    HIGH_CONCENTRATION = "high_concentration"          # 客户集中度过高（仅影响断言）
    ORDER_DECLINE = "order_decline"                    # 订单量下滑
    MATERIAL_MISSING = "material_missing"              # 关键材料缺失（仅影响断言）
    ABNORMAL_INVOICE_VOID = "abnormal_invoice_void"    # 异常作废发票
    PUBLIC_PRIVATE_MIX = "public_private_mix"          # 公私账户混用
    SHORT_HISTORY = "short_history"                    # 经营历史短（仅影响断言）


# ── 子模型 ────────────────────────────────────────────────


class Counterparty(BaseModel):
    """交易对手（买方）"""
    name: str                        # 买方全称
    code: str                        # 代号（如 B-ST）
    weight: float = Field(ge=0, le=1)  # 权重 0-1
    is_main_chain: bool = False      # 是否主链核心买方


class Product(BaseModel):
    """产品信息"""
    name: str                        # 产品名称
    spec: str                        # 规格型号
    unit_price_min: float            # 单价下限（元）
    unit_price_max: float            # 单价上限（元）


class BankAccount(BaseModel):
    """银行账户"""
    bank_name: str                   # 银行名称
    account_masked: str              # 脱敏账号
    branch: str = ""                 # 支行名称
    weight: float = Field(ge=0, le=1, default=0.5)


class AnomalyConfig(BaseModel):
    """异常注入配置"""
    type: AnomalyType                # 异常类型
    severity: float = Field(ge=0, le=1, default=0.3)  # 严重度 0-1
    month_range: tuple[int, int] = (1, 12)            # 影响月份区间


# ── 企业画像主模型 ──────────────────────────────────────────


class EnterpriseProfile(BaseModel):
    """企业画像 — 数据生成器的完整输入"""

    # ── 基础信息 ──
    company_name: str
    short_name: str
    credit_code: str
    legal_person: str
    legal_person_id: str = ""        # 法人身份证（脱敏/虚构）
    industry: str
    chain_name: str = "新能源电池产业链"
    role_in_chain: str
    region: str                      # 如 "江苏常州"
    established_date: str            # yyyy-MM-dd
    registered_capital: float        # 万元
    employee_count: int
    company_type: str = "有限责任公司"
    business_scope: str = ""
    vat_type: str = "小规模纳税人"    # 小规模纳税人 / 一般纳税人

    # ── 交易对手 ──
    counterparties: list[Counterparty]

    # ── 产品 ──
    products: list[Product]

    # ── 经营规模 ──
    annual_sales: float              # 年销售额（万元）
    order_count_12m: int             # 12 个月订单总数
    avg_order_amount: float = 0.0    # 平均订单金额（元），0 表示自动计算

    # ── 回款特征 ──
    receivable_cycle_base: int = 30  # 基准回款周期（天）
    receivable_cycle_jitter: int = 3 # 回款周期随机波动（天）

    # ── 物流特征 ──
    logistics_carrier: str = "驰远物流"
    logistics_region: str = ""       # 主发货区域
    ship_days_after_order: int = 5   # 订单后几天发货
    logistics_transit_days: int = 2  # 运输天数

    # ── 银行账户 ──
    bank_accounts: list[BankAccount] = []

    # ── 异常注入 ──
    anomalies: list[AnomalyConfig] = []

    # ── 生成参数 ──
    year: int = 2025                 # 数据年份
    seed: int = 42                   # 随机种子

    # ── 关联企业（产业链节点）──
    main_chain_path: list[str] = []  # 如 ["宁川新能源", "盛拓模组科技", "衡远包装"]
    key_counterparty: str = ""       # 关键交易对手名

    # ── 编号前缀 ──
    prefix: str = ""                 # 编号前缀拼音首字母，如衡远包装用 "HY"

    @model_validator(mode="after")
    def validate_counterparty_weights(self) -> "EnterpriseProfile":
        total = sum(c.weight for c in self.counterparties)
        if abs(total - 1.0) > 0.05:
            raise ValueError(f"交易对手权重之和应为 1.0，当前为 {total:.2f}")
        return self

    @model_validator(mode="after")
    def auto_avg_order_amount(self) -> "EnterpriseProfile":
        if self.avg_order_amount == 0.0 and self.order_count_12m > 0:
            self.avg_order_amount = round(
                self.annual_sales * 10000 / self.order_count_12m, 2
            )
        return self

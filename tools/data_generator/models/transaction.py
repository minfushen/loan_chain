"""交易真相模型 — 内存中的单笔交易记录，所有派生文件的唯一数据源"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import Optional


@dataclass
class Transaction:
    """单笔交易真相 — 由生成器创建，异常注入器修改，各派生器读取"""

    # ── 编号 ──
    txn_id: str                      # TXN-001
    order_no: str                    # ORD-2025010003
    invoice_no: Optional[str]        # HY2025010001（断票时为 None）
    shipment_no: Optional[str]       # YUN-HY-20250110-001（缺失时为 None）

    # ── 时序 ──
    order_date: date                 # 下单日期
    invoice_date: Optional[date]     # 开票日期
    ship_date: Optional[date]        # 发货日期
    sign_date: Optional[date]        # 签收日期
    settlement_date: Optional[date]  # 回款日期

    # ── 交易内容 ──
    buyer_name: str                  # 买方名称
    buyer_code: str                  # 买方代号
    product_name: str                # 产品名称
    product_spec: str                # 规格型号
    quantity: int                    # 数量
    unit_price: float                # 单价（不含税）
    order_amount: float              # 订单金额（不含税）
    tax_rate: float                  # 税率
    tax_amount: float                # 税额
    total_amount: float              # 价税合计

    # ── 回款 ──
    receivable_cycle: int            # 实际回款周期（天）
    settlement_amount: float         # 实际回款金额

    # ── 物流 ──
    carrier: str                     # 承运方
    weight_kg: float                 # 货物重量 kg
    freight: float                   # 运费
    driver_name: str                 # 司机姓名
    plate_no: str                    # 车牌号
    ship_address: str                # 收货地址
    signer: str                      # 签收人

    # ── 发票状态 ──
    invoice_status: str = "有效发票"  # 有效发票 / 已作废

    # ── 标记 ──
    anomaly: bool = False            # 是否为异常交易
    anomaly_note: str = ""           # 异常说明
    match_status: str = "完全匹配"   # 三流匹配状态
    is_main_chain_buyer: bool = False

    # ── 银行账户分配 ──
    bank_index: int = 0              # 回款进入哪个银行账户

    @property
    def month(self) -> int:
        return self.order_date.month

    @property
    def month_key(self) -> str:
        return self.order_date.strftime("%Y-%m")

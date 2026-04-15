# 百慧测试数据生成器

从企业画像参数生成整套测试数据（订单/发票/流水/物流/工商/三流验证）。

## 使用

```bash
# 单个企业
python main.py --config config/profiles/hengyuan.yaml --output ./test-output

# 批量生成
python main.py --batch config/profiles/all_poc.yaml --output ./test-output
```

## 输出结构

```
{output}/{企业简称}_{日期}/
├── 订单明细_{简称}_2025.csv
├── 发票数据_{简称}_2025.csv
├── 对公流水/{银行}流水_{简称}_2025.csv
├── 物流签收单_{简称}_2025.csv
├── 工商信息_{简称}.json
├── 纳税申报记录_{简称}_2025.csv
├── 纳税申报详情_{简称}_2025.json
├── 三流交叉验证_{简称}_2025.json
├── enterprise_profile.json
└── expected_assertions.json
```

"""工商信息 JSON 派生器"""

from __future__ import annotations

import json
from datetime import date, datetime
from pathlib import Path

from models.profile import EnterpriseProfile
from models.transaction import Transaction


def write_business_info_json(
    transactions: list[Transaction],
    profile: EnterpriseProfile,
    output_dir: Path,
) -> Path:
    """生成工商信息 JSON"""
    path = output_dir / f"工商信息_{profile.short_name}.json"

    established = profile.established_date
    est_date = date.fromisoformat(established)
    age_years = (date(profile.year, 12, 31) - est_date).days // 365

    data = {
        "meta": {
            "dataSource": "模拟工商信息（POC演示用）",
            "queryTime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "queryEngine": "百慧AI-外数模拟层",
            "note": f"本数据为POC演示用途。企业名称 {profile.company_name} 为虚构示例。",
        },
        "basicInfo": {
            "companyName": profile.company_name,
            "creditCode": profile.credit_code,
            "companyType": profile.company_type,
            "legalPerson": profile.legal_person,
            "registeredCapital": f"{profile.registered_capital:.0f}万元人民币",
            "paidInCapital": f"{profile.registered_capital:.0f}万元人民币",
            "establishDate": established,
            "approvalDate": f"{profile.year}-03-10",
            "operatingStatus": "存续（在营）",
            "registeredAddress": f"江苏省{profile.region.replace('江苏', '')}工业园区{profile.short_name}路{hash(profile.short_name) % 100}号",
            "businessAddress": f"江苏省{profile.region.replace('江苏', '')}工业园区{profile.short_name}路{hash(profile.short_name) % 100}号",
            "addressConsistent": True,
            "businessScope": profile.business_scope or f"{profile.industry}相关业务",
            "industry": profile.industry,
            "industryCode": "C2290",
            "employeeCount": profile.employee_count,
            "socialInsuranceCount": max(1, profile.employee_count - 3),
            "taxRegistrationStatus": "正常",
            "vatType": profile.vat_type,
        },
        "shareholders": [
            {
                "name": profile.legal_person,
                "type": "自然人",
                "shareholdingRatio": "100%",
                "subscriptionAmount": f"{profile.registered_capital:.0f}万元",
                "paidInAmount": f"{profile.registered_capital:.0f}万元",
                "isActualController": True,
            }
        ],
        "management": [
            {"name": profile.legal_person, "position": "执行董事/总经理", "startDate": established},
        ],
        "branchOffices": [],
        "qualifications": [
            {"name": "营业执照", "issuer": "市场监督管理局", "validUntil": "长期", "status": "有效"},
        ],
        "intellectualProperty": {"trademarks": 1, "patents": 0, "softwareCopyrights": 0},
        "riskInfo": {
            "judicialRisk": {
                "lawsuits": 0, "asDefendant": 0, "asPlaintiff": 0,
                "executionCases": 0, "dishonestExecutee": False,
                "conclusion": "未发现司法风险",
            },
            "administrativePenalty": {
                "count": 0, "taxViolation": False, "environmentalViolation": False,
                "conclusion": "未发现行政处罚记录",
            },
            "abnormalOperation": {"onList": False, "reason": None, "conclusion": "未列入经营异常名录"},
            "seriousViolation": {"onList": False, "conclusion": "未列入严重违法失信名单"},
            "publicSentiment": {"negativeNews": 0, "riskKeywords": [], "conclusion": "未发现负面舆情"},
        },
        "changeHistory": _generate_change_history(profile),
        "annualReports": [
            {"year": profile.year - i, "status": "已公示", "submitDate": f"{profile.year - i + 1}-04-{10 + i % 5:02d}"}
            for i in range(min(5, age_years))
        ],
        "relatedCompanies": [],
        "aiAnalysis": {
            "companyAge": f"{age_years}年",
            "meetsAgeRequirement": age_years >= 3,
            "capitalAdequacy": f"注册资本{profile.registered_capital:.0f}万，实缴到位",
            "shareholderStructure": "单一自然人股东，结构清晰",
            "riskSummary": "无司法风险、无行政处罚、无经营异常、无负面舆情",
            "conclusion": "工商信息完整，企业存续状态正常" + ("，满足授信准入要求" if age_years >= 3 else "，成立年限不足需关注"),
        },
    }

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return path


def _generate_change_history(profile: EnterpriseProfile) -> list[dict]:
    """生成变更历史"""
    changes: list[dict] = []
    est_date = date.fromisoformat(profile.established_date)
    # 增资变更
    if profile.registered_capital >= 500:
        changes.append({
            "date": f"{est_date.year + 3}-06-20",
            "changeType": "注册资本变更",
            "before": f"{profile.registered_capital * 0.4:.0f}万元",
            "after": f"{profile.registered_capital:.0f}万元",
            "remark": "增资扩股，经营规模扩大",
        })
    return changes

import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import CustomerPoolScene from './CustomerPoolScene';
import PartnerManagementScene from './PartnerManagementScene';
import { Camera, CheckCircle2, ClipboardList, FileSearch, FileText, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SAMPLES } from '../../demo/chainLoan/data';
import { useDemo } from '../../demo/DemoContext';
import { MetricCard, WorkbenchPanel } from '../ProductPrimitives';

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function SmartDueDiligenceScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'smart-due-diligence')!;
  const { navigate, currentSample } = useDemo();

  if (activeModule === 'field-entry') {
    return <CustomerPoolScene activeModule="field-flow" onModuleChange={(id) => onModuleChange(id === 'field-flow' ? 'field-entry' : id)} sceneOverride="smart-due-diligence" />;
  }

  if (activeModule === 'dd-report') {
    return <PartnerManagementScene activeModule="due-diligence" onModuleChange={(id) => onModuleChange(id === 'due-diligence' ? 'dd-report' : id)} sceneOverride="smart-due-diligence" />;
  }

  const renderContent = () => {
    switch (activeModule) {
      case 'material':
        return (
          <div className="space-y-5">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center"><Camera size={15} className="text-[#EA580C]" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">材料采集</h3>
                  <p className="text-[11px] text-[#94A3B8]">PAD 端采集的经营资料、营业执照、合同影像等待处理任务</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="待采集" value="8 份" detail="本周任务" icon={Camera} tone="amber" />
              <MetricCard label="待核验" value="12 份" detail="AI 解析完成" icon={CheckCircle2} tone="blue" />
              <MetricCard label="已归档" value="34 份" detail="本月完成" icon={FileText} tone="green" />
              <MetricCard label="异常材料" value="2 份" detail="需人工复核" icon={ClipboardList} tone="red" />
            </div>
            <WorkbenchPanel title="待采集任务">
              <div className="space-y-2">
                {SAMPLES.slice(0, 3).map(s => (
                  <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#E2E8F0] hover:bg-[#FAFBFF] transition-colors">
                    <div><div className="text-[12px] font-medium text-[#0F172A]">{s.shortName}</div><div className="text-[10px] text-[#94A3B8]">需采集：营业执照、近 3 月流水、经营场所照片</div></div>
                    <Badge className="text-[9px] bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]">待采集</Badge>
                  </div>
                ))}
              </div>
            </WorkbenchPanel>
          </div>
        );

      case 'evidence':
        return (
          <div className="space-y-5">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center"><CheckCircle2 size={15} className="text-[#16A34A]" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">证据核验</h3>
                  <p className="text-[11px] text-[#94A3B8]">订单、物流、回款、发票四流交叉验证</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="已核验企业" value="3 户" detail="本周完成" icon={CheckCircle2} tone="green" />
              <MetricCard label="四流匹配率" value="88%" detail="平均值" icon={Sparkles} tone="blue" />
              <MetricCard label="异常发现" value="2 项" detail="需人工确认" icon={ClipboardList} tone="amber" />
              <MetricCard label="数据覆盖" value="76%" detail="证据完整度" icon={FileSearch} tone="slate" />
            </div>
            <WorkbenchPanel title="核验任务队列">
              <div className="space-y-2">
                {SAMPLES.filter(s => s.evidenceCoverage > 70).slice(0, 4).map(s => (
                  <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#E2E8F0] hover:bg-[#FAFBFF] transition-colors">
                    <div>
                      <div className="text-[12px] font-medium text-[#0F172A]">{s.shortName}</div>
                      <div className="text-[10px] text-[#94A3B8]">证据覆盖 {s.evidenceCoverage}% · 订单 {s.orderCount90d} 笔 · 发票连续 {s.invoiceContinuityMonths} 月</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${s.evidenceCoverage}%` }} /></div>
                      <span className="text-[10px] font-medium text-[#0F172A]">{s.evidenceCoverage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </WorkbenchPanel>
          </div>
        );

      case 'report-gen':
        return (
          <div className="space-y-5">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center"><FileText size={15} className="text-[#2563EB]" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">报告生成</h3>
                  <p className="text-[11px] text-[#94A3B8]">AI 尽调报告生成与下载，可作为补审作业附件</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <MetricCard label="已生成报告" value="8 份" detail="本月" icon={FileText} tone="blue" />
              <MetricCard label="平均置信度" value="85%" detail="AI 判断" icon={Sparkles} tone="green" />
              <MetricCard label="平均生成耗时" value="12 秒" detail="含外数调用" icon={Sparkles} tone="slate" />
            </div>
            <WorkbenchPanel title="最近报告">
              <div className="space-y-2">
                {SAMPLES.slice(0, 4).map(s => (
                  <div key={s.id} className="flex items-center justify-between px-4 py-3 rounded-lg border border-[#E2E8F0] hover:bg-[#FAFBFF] transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText size={14} className="text-[#2563EB] shrink-0" />
                      <div><div className="text-[12px] font-medium text-[#0F172A]">{s.shortName} — 尽调报告</div><div className="text-[10px] text-[#94A3B8]">置信度 {s.authenticityScore}% · {s.aiSummary.slice(0, 30)}…</div></div>
                    </div>
                    <Badge className="text-[9px] bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]">已生成</Badge>
                  </div>
                ))}
              </div>
            </WorkbenchPanel>
          </div>
        );

      default:
        onModuleChange('field-entry');
        return null;
    }
  };

  return (
    <SceneLayout title={scene.title} modules={scene.modules} activeModule={activeModule} onModuleChange={onModuleChange}>
      {renderContent()}
    </SceneLayout>
  );
}

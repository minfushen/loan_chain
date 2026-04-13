import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import CustomerPoolScene from './CustomerPoolScene';
import { Upload, FileSpreadsheet, ArrowRight, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SAMPLES } from '../../demo/chainLoan/data';
import { useDemo } from '../../demo/DemoContext';

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function SmartIdentifyScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'smart-identify')!;
  const { navigate } = useDemo();

  const customerPoolModules = ['feed', 'filter-flow', 'list', 'graph', 'linked'];

  if (customerPoolModules.includes(activeModule)) {
    return <CustomerPoolScene activeModule={activeModule} onModuleChange={onModuleChange} sceneOverride="smart-identify" />;
  }

  const renderContent = () => {
    switch (activeModule) {
      case 'import':
      default:
        return (
          <div className="space-y-5">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center"><Upload size={15} className="text-[#2563EB]" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">名单导入</h3>
                  <p className="text-[11px] text-[#94A3B8]">上传外部名单，批量导入候选企业进入识别流程</p>
                </div>
              </div>
              <div className="rounded-lg border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto text-[#94A3B8] mb-2" />
                <p className="text-[12px] font-medium text-[#475569]">拖放文件到此处，或点击选择</p>
                <p className="text-[10px] text-[#94A3B8] mt-1">支持 Excel / CSV，单次最多 500 条</p>
                <Button variant="outline" size="sm" className="mt-3 h-7 text-[11px] gap-1.5 border-[#BFDBFE] text-[#2563EB]">
                  <FileSpreadsheet size={12} /> 选择文件
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '本月导入', value: '126 户', tone: 'blue' },
                { label: '命中率', value: '34%', tone: 'green' },
                { label: '已转化', value: '18 户', tone: 'emerald' },
                { label: '待核验', value: '42 户', tone: 'amber' },
              ].map(m => (
                <div key={m.label} className="rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-3">
                  <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider">{m.label}</div>
                  <div className="mt-1 text-lg font-bold text-[#0F172A]">{m.value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-[#F1F5F9] flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#0F172A]">最近导入记录</span>
              </div>
              <div className="divide-y divide-[#F1F5F9]">
                {[
                  { file: '新能源链三级供应商_202604.xlsx', count: 86, date: '2026-04-08', status: '已完成' },
                  { file: '商圈周边小微名单.csv', count: 40, date: '2026-04-05', status: '已完成' },
                  { file: '涉农经营主体_华东.xlsx', count: 152, date: '2026-04-01', status: '部分命中' },
                ].map(r => (
                  <div key={r.file} className="px-4 py-3 flex items-center justify-between hover:bg-[#FAFBFF] transition-colors">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FileSpreadsheet size={14} className="text-[#64748B] shrink-0" />
                      <div className="min-w-0"><div className="text-[12px] font-medium text-[#0F172A] truncate">{r.file}</div><div className="text-[10px] text-[#94A3B8]">{r.date} · {r.count} 条</div></div>
                    </div>
                    <Badge className="text-[9px] bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]">{r.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <SceneLayout title={scene.title} modules={scene.modules} activeModule={activeModule} onModuleChange={onModuleChange}>
      {renderContent()}
    </SceneLayout>
  );
}

import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  Edit3,
  Eye,
  FileSearch,
  FileText,
  History,
  Layers,
  Lightbulb,
  Plus,
  RefreshCw,
  Search,
  Send,
  Shield,
  Sparkles,
  Star,
  Upload,
  UserCheck,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SAMPLES } from '../../demo/chainLoan/data';
import { useDemo } from '../../demo/DemoContext';
import { MetricCard, WorkbenchPanel } from '../ProductPrimitives';

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function SmartDueDiligenceScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'smart-due-diligence')!;
  const { navigate, currentSample } = useDemo();
  const [selectedTask, setSelectedTask] = React.useState<string | null>(null);
  const [selectedVerifyEntity, setSelectedVerifyEntity] = React.useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = React.useState(0);
  const [selectedReport, setSelectedReport] = React.useState<string | null>(null);

  const renderContent = () => {
    switch (activeModule) {
      case 'material': {
        type MatStatus = '待解析' | '解析中' | '已解析' | '待确认' | '异常';
        type MatPriority = '高' | '中' | '低';
        interface ParseTask {
          id: string; company: string; shortName: string; stage: string; scene: string;
          source: string; types: string[]; totalMat: number; parsedMat: number; createdAt: string;
          status: MatStatus; priority: MatPriority; responsible: string;
          materials: { name: string; type: string; status: MatStatus; fieldCount: number; summary: string; confidence: number; usableForVerify: boolean; needConfirm: boolean }[];
          anomalies: { type: string; material: string; reason: string; impact: string; suggestion: string; blocking: boolean }[];
        }

        const TASKS: ParseTask[] = [
          {
            id: 'pt-1', company: '常州衡远包装材料有限公司', shortName: '衡远包装', stage: '补审中', scene: '订单微贷',
            source: '外勤录入', types: ['营业执照', '法人身份证', '合同影像', '发票材料', '经营场所照片'], totalMat: 7, parsedMat: 5, createdAt: '2026-04-08 14:30',
            status: '待确认', priority: '高', responsible: '王敏',
            materials: [
              { name: '营业执照_衡远包装.jpg', type: '营业执照', status: '已解析', fieldCount: 8, summary: '企业名称与统一社会信用代码已提取', confidence: 96, usableForVerify: true, needConfirm: false },
              { name: '法人身份证_张建华.jpg', type: '法人身份证', status: '已解析', fieldCount: 5, summary: '法人姓名与身份证号码已识别', confidence: 94, usableForVerify: true, needConfirm: false },
              { name: '采购合同_盛拓模组.pdf', type: '合同影像', status: '已解析', fieldCount: 12, summary: '合同金额与签约双方已解析', confidence: 89, usableForVerify: true, needConfirm: false },
              { name: '增值税发票_202603.jpg', type: '发票材料', status: '已解析', fieldCount: 9, summary: '发票金额与开票时间已识别', confidence: 91, usableForVerify: true, needConfirm: false },
              { name: '经营场所_外景.jpg', type: '经营场所照片', status: '已解析', fieldCount: 3, summary: '场所地址与招牌信息已识别', confidence: 82, usableForVerify: true, needConfirm: false },
              { name: '对账单_2026Q1.pdf', type: '对账单', status: '待确认', fieldCount: 6, summary: '部分金额字段识别模糊', confidence: 68, usableForVerify: false, needConfirm: true },
              { name: '物流签收单_batch12.jpg', type: '物流签收单', status: '异常', fieldCount: 2, summary: '图片不清晰，多数字段无法识别', confidence: 32, usableForVerify: false, needConfirm: true },
            ],
            anomalies: [
              { type: '图片不清晰', material: '物流签收单_batch12.jpg', reason: '扫描质量过低', impact: '暂不能进入证据核验', suggestion: '重新拍摄或上传高清版本', blocking: true },
              { type: '字段识别失败', material: '对账单_2026Q1.pdf', reason: '表格结构复杂，部分金额识别模糊', impact: '暂不能生成尽调报告', suggestion: '人工补充关键金额字段', blocking: false },
            ],
          },
          {
            id: 'pt-2', company: '无锡驰远物流服务有限公司', shortName: '驰远物流', stage: '预授信', scene: '运费贷',
            source: '客户上传', types: ['营业执照', '法人身份证', '运单材料'], totalMat: 4, parsedMat: 4, createdAt: '2026-04-09 09:15',
            status: '已解析', priority: '中', responsible: '刘洋',
            materials: [
              { name: '营业执照_驰远物流.jpg', type: '营业执照', status: '已解析', fieldCount: 8, summary: '企业名称与统一社会信用代码已提取', confidence: 95, usableForVerify: true, needConfirm: false },
              { name: '法人身份证_陈志伟.jpg', type: '法人身份证', status: '已解析', fieldCount: 5, summary: '法人姓名与身份证号码已识别', confidence: 93, usableForVerify: true, needConfirm: false },
              { name: '运单汇总_202603.pdf', type: '物流签收单', status: '已解析', fieldCount: 15, summary: '运单号、签收时间与金额已提取', confidence: 88, usableForVerify: true, needConfirm: false },
              { name: '服务合同_盛拓模组.pdf', type: '合同影像', status: '已解析', fieldCount: 10, summary: '合同金额与服务条款已解析', confidence: 86, usableForVerify: true, needConfirm: false },
            ],
            anomalies: [],
          },
          {
            id: 'pt-3', company: '溧阳佳利包装材料有限公司', shortName: '佳利包装', stage: '已识别', scene: '订单微贷',
            source: '批量导入', types: ['营业执照'], totalMat: 2, parsedMat: 1, createdAt: '2026-04-09 11:00',
            status: '待解析', priority: '低', responsible: '—',
            materials: [
              { name: '营业执照_佳利包装.jpg', type: '营业执照', status: '已解析', fieldCount: 8, summary: '企业名称已提取', confidence: 90, usableForVerify: true, needConfirm: false },
              { name: '法人身份证_李明亮.jpg', type: '法人身份证', status: '待解析', fieldCount: 0, summary: '—', confidence: 0, usableForVerify: false, needConfirm: false },
            ],
            anomalies: [
              { type: '材料缺失', material: '—', reason: '缺少合同影像与发票材料', impact: '暂不能进入证据核验', suggestion: '补充合同与发票材料', blocking: true },
            ],
          },
          {
            id: 'pt-4', company: '苏州锐信新材料有限公司', shortName: '锐信新材', stage: '已批准', scene: '订单微贷',
            source: '系统回传', types: ['营业执照', '法人身份证', '合同影像', '发票材料', '对账单'], totalMat: 6, parsedMat: 6, createdAt: '2026-04-07 16:45',
            status: '已解析', priority: '中', responsible: '王敏',
            materials: [
              { name: '营业执照_锐信新材.jpg', type: '营业执照', status: '已解析', fieldCount: 8, summary: '企业名称与统一社会信用代码已提取', confidence: 97, usableForVerify: true, needConfirm: false },
              { name: '法人身份证_周国栋.jpg', type: '法人身份证', status: '已解析', fieldCount: 5, summary: '法人姓名与身份证号码已识别', confidence: 95, usableForVerify: true, needConfirm: false },
              { name: '采购合同_盛拓模组_锐信.pdf', type: '合同影像', status: '已解析', fieldCount: 11, summary: '合同金额与签约双方已解析', confidence: 92, usableForVerify: true, needConfirm: false },
              { name: '增值税发票_12M.pdf', type: '发票材料', status: '已解析', fieldCount: 14, summary: '12个月发票金额与开票时间已识别', confidence: 90, usableForVerify: true, needConfirm: false },
              { name: '银行对账单_2025H2.pdf', type: '对账单', status: '已解析', fieldCount: 18, summary: '半年度收支明细已提取', confidence: 88, usableForVerify: true, needConfirm: false },
              { name: '经营场所_内景.jpg', type: '经营场所照片', status: '已解析', fieldCount: 3, summary: '场所照片已归档', confidence: 85, usableForVerify: true, needConfirm: false },
            ],
            anomalies: [],
          },
          {
            id: 'pt-5', company: '昆山瑞丰辅料有限公司', shortName: '瑞丰辅料', stage: '恢复中', scene: '订单微贷',
            source: '外勤录入', types: ['营业执照', '对账单'], totalMat: 3, parsedMat: 2, createdAt: '2026-04-09 08:00',
            status: '异常', priority: '高', responsible: '张磊',
            materials: [
              { name: '营业执照_瑞丰辅料.jpg', type: '营业执照', status: '已解析', fieldCount: 8, summary: '企业名称已提取', confidence: 91, usableForVerify: true, needConfirm: false },
              { name: '银行对账单_近3月.pdf', type: '对账单', status: '已解析', fieldCount: 10, summary: '近3月收支已提取，存在净流出', confidence: 84, usableForVerify: true, needConfirm: false },
              { name: '发票材料_202602.jpg', type: '发票材料', status: '异常', fieldCount: 1, summary: '主体名称与任务主体不一致', confidence: 22, usableForVerify: false, needConfirm: true },
            ],
            anomalies: [
              { type: '主体不一致', material: '发票材料_202602.jpg', reason: '发票上企业名称与瑞丰辅料不一致', impact: '暂不能进入证据核验', suggestion: '核实发票归属或重新上传', blocking: true },
              { type: '材料缺失', material: '—', reason: '缺少法人身份证与合同影像', impact: '暂不能生成尽调报告', suggestion: '补充法人身份证和合同影像', blocking: true },
            ],
          },
        ];

        const PRIORITY_STYLE: Record<string, string> = { '高': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]', '中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]', '低': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]' };
        const MAT_STATUS_STYLE: Record<string, string> = { '待解析': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]', '解析中': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]', '已解析': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]', '待确认': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]', '异常': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' };
        const SOURCE_STYLE: Record<string, string> = { '外勤录入': 'bg-[#FFF7ED] text-[#C2410C]', '客户上传': 'bg-[#EFF6FF] text-[#2563EB]', '系统回传': 'bg-[#F5F3FF] text-[#7C3AED]', '批量导入': 'bg-[#F8FAFC] text-[#64748B]' };

        if (!selectedTask && TASKS.length > 0) {
          setSelectedTask(TASKS[0].id);
        }
        const activeTask = TASKS.find(t => t.id === selectedTask) ?? TASKS[0];

        const pendingTasks = TASKS.filter(t => t.status === '待解析' || t.status === '解析中').length;
        const parsedTotal = TASKS.reduce((acc, t) => acc + t.parsedMat, 0);
        const confirmCount = TASKS.reduce((acc, t) => acc + t.materials.filter(m => m.needConfirm).length, 0);
        const anomalyTotal = TASKS.reduce((acc, t) => acc + t.anomalies.length, 0);
        const verifyReady = TASKS.filter(t => t.status === '已解析' && t.anomalies.length === 0).length;

        return (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0F172A]">材料解析</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">对经营资料、证件影像与交易材料进行结构化解析，补强尽调证据并支撑后续核验与报告生成。</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Upload size={10} />上传材料</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857]"><Zap size={10} />批量解析</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><FileText size={10} />查看模板要求</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出结果</Button>
              </div>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: '待解析任务', value: pendingTasks, desc: '当前等待进入结构化解析的主体任务数量', icon: Layers, color: 'text-[#475569]' },
                { label: '已解析材料', value: parsedTotal, desc: '系统已完成识别与字段提取的材料数量', icon: CheckCircle2, color: 'text-[#047857]' },
                { label: '待人工确认', value: confirmCount, desc: '解析完成但仍需人工复核的材料数量', icon: UserCheck, color: 'text-[#F59E0B]' },
                { label: '异常材料', value: anomalyTotal, desc: '存在缺失、冲突或识别失败的材料数量', icon: AlertCircle, color: 'text-[#DC2626]' },
                { label: '可进入核验', value: verifyReady, desc: '已具备进入证据核验条件的主体数量', icon: ArrowRight, color: 'text-[#2563EB]' },
              ].map(c => (
                <div key={c.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5"><c.icon size={12} className={c.color} /><span className="text-[10px] text-[#64748B]">{c.label}</span></div>
                  <div className="text-[20px] font-bold text-[#0F172A]">{c.value}</div>
                  <div className="text-[9px] text-[#94A3B8]">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Four-column layout */}
            <div className="grid grid-cols-[210px_1fr_1fr_250px] gap-3" style={{ minHeight: 520 }}>

              {/* COL 1: Task list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">待解析任务</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">高优先级应优先完成解析</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {TASKS.map(task => {
                    const isActive = activeTask?.id === task.id;
                    return (
                      <div key={task.id} onClick={() => setSelectedTask(task.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{task.shortName}</span>
                          <Badge className={cn('text-[7px] border', PRIORITY_STYLE[task.priority])}>{task.priority}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{task.stage} · {task.scene}</div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={cn('text-[7px] px-1 py-0.5 rounded', SOURCE_STYLE[task.source])}>{task.source}</span>
                          <Badge className={cn('text-[7px] border', MAT_STATUS_STYLE[task.status])}>{task.status}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[9px]">
                          <span className="text-[#64748B]">材料 <span className="font-medium text-[#0F172A]">{task.parsedMat}/{task.totalMat}</span></span>
                          <div className="flex-1 h-1 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${(task.parsedMat / task.totalMat) * 100}%` }} /></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COL 2: Parse results */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">材料解析结果</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">请重点关注主体一致性、字段完整度和解析置信度</p>
                </div>
                {activeTask ? (
                  <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                    {activeTask.materials.map((mat, i) => (
                      <div key={i} className={cn('rounded border px-2.5 py-2 text-[10px] space-y-1', mat.status === '异常' ? 'border-[#FCA5A5] bg-[#FEF2F2]' : mat.needConfirm ? 'border-[#FED7AA] bg-[#FFFBEB]' : 'border-[#E2E8F0] bg-white')}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <FileText size={10} className="text-[#64748B] shrink-0" />
                            <span className="font-medium text-[#0F172A] truncate">{mat.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Badge className={cn('text-[7px] border', MAT_STATUS_STYLE[mat.status])}>{mat.status}</Badge>
                            {mat.confidence > 0 && <span className="text-[9px] font-bold" style={{ color: mat.confidence >= 80 ? '#047857' : mat.confidence >= 60 ? '#F59E0B' : '#DC2626' }}>{mat.confidence}%</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] text-[#64748B]">
                          <span>{mat.type}</span>
                          {mat.fieldCount > 0 && <span>识别 {mat.fieldCount} 字段</span>}
                          {mat.usableForVerify && <span className="text-[#047857]">可核验</span>}
                        </div>
                        {mat.summary !== '—' && <div className="text-[9px] text-[#475569]">{mat.summary}</div>}
                        {/* Inline actions */}
                        <div className="flex items-center gap-1 pt-0.5">
                          <button className="text-[8px] text-[#2563EB] hover:underline">查看原件</button>
                          <span className="text-[#CBD5E1]">·</span>
                          <button className="text-[8px] text-[#2563EB] hover:underline">查看字段</button>
                          {mat.status === '异常' && <><span className="text-[#CBD5E1]">·</span><button className="text-[8px] text-[#C2410C] hover:underline">重新解析</button></>}
                          {mat.needConfirm && <><span className="text-[#CBD5E1]">·</span><button className="text-[8px] text-[#F59E0B] hover:underline">标记人工确认</button></>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4 text-center">
                    <div><Search size={20} className="text-[#CBD5E1] mx-auto mb-2" /><div className="text-[10px] text-[#94A3B8]">请选择一个主体查看解析结果</div></div>
                  </div>
                )}
              </div>

              {/* COL 3: Anomaly & missing */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">异常与待补材料</span>
                </div>
                {activeTask ? (
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                    {activeTask.anomalies.length > 0 ? (
                      <>
                        <p className="text-[10px] text-[#475569] leading-4">异常材料会直接影响证据核验结果与尽调报告质量。如关键字段缺失，建议先补充材料再进入下一步。</p>
                        {activeTask.anomalies.map((a, i) => (
                          <div key={i} className={cn('rounded border px-2.5 py-2 text-[10px] space-y-1', a.blocking ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-[#FED7AA] bg-[#FFFBEB]')}>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-[#0F172A] flex items-center gap-1">{a.blocking ? <AlertCircle size={10} className="text-[#DC2626]" /> : <AlertTriangle size={10} className="text-[#F59E0B]" />}{a.type}</span>
                              {a.blocking && <Badge className="text-[7px] bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]">阻塞</Badge>}
                            </div>
                            <div className="text-[9px] text-[#64748B]">涉及: {a.material}</div>
                            <div className="text-[9px] text-[#475569]">原因: {a.reason}</div>
                            <div className="text-[9px]"><span className="text-[#DC2626]">影响: {a.impact}</span></div>
                            <div className="text-[9px] text-[#2563EB]">建议: {a.suggestion}</div>
                          </div>
                        ))}
                        {/* Material completeness check */}
                        <div className="rounded bg-[#F8FAFC] p-2 space-y-1">
                          <div className="text-[10px] font-semibold text-[#0F172A]">材料完整度</div>
                          <div className="grid grid-cols-2 gap-1 text-[9px]">
                            {['营业执照', '法人身份证', '合同影像', '发票材料', '对账单', '物流签收单', '经营场所照片'].map(t => {
                              const has = activeTask.materials.some(m => m.type === t && m.status !== '异常');
                              return (
                                <div key={t} className="flex items-center gap-1">
                                  {has ? <CheckCircle2 size={9} className="text-[#047857]" /> : <AlertCircle size={9} className="text-[#DC2626]" />}
                                  <span className={has ? 'text-[#475569]' : 'text-[#DC2626]'}>{t}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看问题</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Upload size={9} />补充材料</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={9} />下载异常清单</Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle2 size={24} className="text-[#A7F3D0] mx-auto mb-2" />
                        <div className="text-[11px] text-[#047857] font-medium">无异常</div>
                        <div className="text-[9px] text-[#94A3B8] mt-1">当前主体材料解析完整，无异常项。</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4 text-center">
                    <div className="text-[10px] text-[#94A3B8]">请选择主体查看异常项</div>
                  </div>
                )}
              </div>

              {/* COL 4: AI judgment */}
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 判断</span>
                  </div>
                  {activeTask ? (
                    <div className="space-y-2">
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                        <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                          {activeTask.anomalies.length === 0
                            ? `${activeTask.shortName}的基础证照与经营材料已全部解析完成，具备进入证据核验条件。`
                            : `${activeTask.shortName}的材料已完成部分解析，具备初步条件，但仍需对关键异常项进行补充确认。`}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">材料完整度</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${(activeTask.parsedMat / activeTask.totalMat) * 100}%` }} /></div>
                          <span className="text-[10px] font-bold text-[#0F172A]">{activeTask.parsedMat}/{activeTask.totalMat}</span>
                        </div>
                        <p className="text-[9px] text-[#475569] mt-1 leading-4">
                          {activeTask.materials.filter(m => m.status === '已解析').map(m => m.type).filter((v, i, a) => a.indexOf(v) === i).join('、')}已解析完成
                          {activeTask.materials.filter(m => m.status !== '已解析').length > 0 && `，${activeTask.materials.filter(m => m.status !== '已解析').map(m => m.type).join('、')}仍待处理`}。
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">解析可信度</div>
                        {(() => {
                          const parsed = activeTask.materials.filter(m => m.confidence > 0);
                          const avg = parsed.length > 0 ? Math.round(parsed.reduce((s, m) => s + m.confidence, 0) / parsed.length) : 0;
                          return (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${avg}%`, backgroundColor: avg >= 80 ? '#047857' : avg >= 60 ? '#F59E0B' : '#DC2626' }} /></div>
                              <span className="text-[10px] font-bold" style={{ color: avg >= 80 ? '#047857' : avg >= 60 ? '#F59E0B' : '#DC2626' }}>{avg}%</span>
                            </div>
                          );
                        })()}
                      </div>
                      {activeTask.anomalies.length > 0 && (
                        <div>
                          <div className="text-[9px] text-[#94A3B8] mb-0.5">主要异常</div>
                          <div className="rounded bg-[#FEF2F2] px-2 py-1.5 text-[9px] text-[#DC2626] space-y-0.5">
                            {activeTask.anomalies.map((a, i) => <div key={i}>· {a.type}: {a.reason}</div>)}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                        <p className="text-[10px] text-[#7C3AED] font-medium">
                          {activeTask.anomalies.filter(a => a.blocking).length > 0
                            ? '建议先处理异常材料，再进入证据核验。'
                            : activeTask.anomalies.length > 0
                              ? '如关键字段已满足要求，可直接推进尽调报告生成。'
                              : '材料解析完整，建议直接进入证据核验。'}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                        <p className="text-[10px] text-[#475569]">{activeTask.anomalies.length === 0 ? '证据核验 / 尽调报告' : '当前材料解析（补充后推进）'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#94A3B8]">选择主体后查看 AI 判断。</p>
                  )}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full" disabled={!activeTask}><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857] w-full" disabled={!activeTask} onClick={() => onModuleChange('evidence')}><ArrowRight size={10} />进入证据核验</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB] w-full" disabled={!activeTask} onClick={() => onModuleChange('dd-report')}><FileSearch size={10} />进入尽调报告</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full" disabled={!activeTask}><UserCheck size={10} />人工确认</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'evidence': {
        type VerifyResult = '一致' | '基本一致' | '存疑' | '冲突' | '缺失' | '无法判断';
        type EvidenceType = '证照证据' | '合同证据' | '发票证据' | '流水证据' | '回款证据' | '物流履约证据' | '现场采集证据' | '系统回填证据';
        type VerifyType = '主体真实性核验' | '法人与实控人核验' | '经营资质核验' | '交易真实性核验' | '合同与发票一致性核验' | '回款与流水匹配核验' | '公私联动补强核验' | '关系图谱补强核验';

        interface EvidenceItem {
          name: string; type: EvidenceType; verifyItem: VerifyType; source: string;
          field: string; result: VerifyResult; strength: '强' | '中' | '弱';
          confidence: number; citable: boolean; needConfirm: boolean;
        }
        interface VerifyConflict {
          type: string; verifyItem: VerifyType; evidence: string; reason: string;
          conflictField: string; impact: string; suggestion: string; blockReport: boolean;
        }
        interface VerifyEntity {
          id: string; company: string; shortName: string; stage: string; scene: string;
          items: { type: VerifyType; sourceCount: number; fieldCount: number; status: '已核验' | '核验中' | '待核验'; conclusion: VerifyResult; priority: '高' | '中' | '低' }[];
          evidences: EvidenceItem[];
          conflicts: VerifyConflict[];
        }

        const RESULT_STYLE: Record<VerifyResult, string> = {
          '一致': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '基本一致': 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
          '存疑': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '冲突': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '缺失': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
          '无法判断': 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]',
        };
        const STRENGTH_STYLE: Record<string, string> = { '强': 'text-[#047857]', '中': 'text-[#F59E0B]', '弱': 'text-[#DC2626]' };
        const ITEM_STATUS_STYLE: Record<string, string> = { '已核验': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]', '核验中': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]', '待核验': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]' };
        const PRIORITY_STYLE_V: Record<string, string> = { '高': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]', '中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]', '低': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]' };

        const VERIFY_ENTITIES: VerifyEntity[] = [
          {
            id: 've-1', company: '常州衡远包装材料有限公司', shortName: '衡远包装', stage: '补审中', scene: '订单微贷',
            items: [
              { type: '主体真实性核验', sourceCount: 3, fieldCount: 8, status: '已核验', conclusion: '一致', priority: '高' },
              { type: '法人与实控人核验', sourceCount: 2, fieldCount: 5, status: '已核验', conclusion: '一致', priority: '高' },
              { type: '经营资质核验', sourceCount: 2, fieldCount: 6, status: '已核验', conclusion: '基本一致', priority: '中' },
              { type: '交易真实性核验', sourceCount: 4, fieldCount: 12, status: '已核验', conclusion: '基本一致', priority: '高' },
              { type: '合同与发票一致性核验', sourceCount: 3, fieldCount: 9, status: '已核验', conclusion: '存疑', priority: '高' },
              { type: '回款与流水匹配核验', sourceCount: 2, fieldCount: 6, status: '核验中', conclusion: '缺失', priority: '中' },
              { type: '公私联动补强核验', sourceCount: 1, fieldCount: 3, status: '待核验', conclusion: '缺失', priority: '低' },
              { type: '关系图谱补强核验', sourceCount: 2, fieldCount: 4, status: '已核验', conclusion: '一致', priority: '中' },
            ],
            evidences: [
              { name: '营业执照主体信息', type: '证照证据', verifyItem: '主体真实性核验', source: '营业执照_衡远包装.jpg', field: '企业名称/统一信用代码/注册地址', result: '一致', strength: '强', confidence: 96, citable: true, needConfirm: false },
              { name: '法人身份信息', type: '证照证据', verifyItem: '法人与实控人核验', source: '法人身份证_张建华.jpg', field: '法人姓名/身份证号', result: '一致', strength: '强', confidence: 94, citable: true, needConfirm: false },
              { name: '采购合同交易方', type: '合同证据', verifyItem: '交易真实性核验', source: '采购合同_盛拓模组.pdf', field: '签约双方/合同金额/合同期限', result: '基本一致', strength: '中', confidence: 89, citable: true, needConfirm: false },
              { name: '增值税发票核对', type: '发票证据', verifyItem: '合同与发票一致性核验', source: '增值税发票_202603.jpg', field: '发票金额/开票主体/开票时间', result: '存疑', strength: '弱', confidence: 72, citable: false, needConfirm: true },
              { name: '经营场所实地信息', type: '现场采集证据', verifyItem: '经营资质核验', source: '经营场所_外景.jpg', field: '经营地址/招牌信息', result: '基本一致', strength: '中', confidence: 82, citable: true, needConfirm: false },
              { name: '对账单流水匹配', type: '流水证据', verifyItem: '回款与流水匹配核验', source: '对账单_2026Q1.pdf', field: '收支金额/交易对手', result: '缺失', strength: '弱', confidence: 68, citable: false, needConfirm: true },
              { name: '物流签收履约', type: '物流履约证据', verifyItem: '交易真实性核验', source: '物流签收单_batch12.jpg', field: '签收时间/签收方', result: '冲突', strength: '弱', confidence: 32, citable: false, needConfirm: true },
              { name: '链属关系验证', type: '系统回填证据', verifyItem: '关系图谱补强核验', source: '供应链平台回传', field: '链属路径/交易频次', result: '一致', strength: '强', confidence: 91, citable: true, needConfirm: false },
            ],
            conflicts: [
              { type: '金额逻辑异常', verifyItem: '合同与发票一致性核验', evidence: '增值税发票核对', reason: '合同约定金额与近3月发票累计金额偏差超过15%', conflictField: '合同金额 vs 发票累计金额', impact: '暂不能形成强证据结论', suggestion: '补充近6月完整发票或对账确认', blockReport: false },
              { type: '材料与解析结果不一致', verifyItem: '交易真实性核验', evidence: '物流签收履约', reason: '签收单图片模糊，签收方名称与合同买方不一致', conflictField: '签收方名称 vs 合同买方', impact: '暂不能进入报告引用', suggestion: '重新拍摄签收单或调取物流平台记录', blockReport: true },
              { type: '证据链不完整', verifyItem: '回款与流水匹配核验', evidence: '对账单流水匹配', reason: '部分金额字段识别模糊，无法完成回款匹配', conflictField: '回款金额 vs 流水入账', impact: '暂不能形成强证据结论', suggestion: '人工补充关键金额字段或重新解析', blockReport: false },
            ],
          },
          {
            id: 've-2', company: '无锡驰远物流服务有限公司', shortName: '驰远物流', stage: '预授信', scene: '运费贷',
            items: [
              { type: '主体真实性核验', sourceCount: 2, fieldCount: 8, status: '已核验', conclusion: '一致', priority: '高' },
              { type: '法人与实控人核验', sourceCount: 2, fieldCount: 5, status: '已核验', conclusion: '一致', priority: '高' },
              { type: '交易真实性核验', sourceCount: 3, fieldCount: 15, status: '已核验', conclusion: '一致', priority: '高' },
              { type: '合同与发票一致性核验', sourceCount: 2, fieldCount: 10, status: '已核验', conclusion: '一致', priority: '中' },
            ],
            evidences: [
              { name: '营业执照主体信息', type: '证照证据', verifyItem: '主体真实性核验', source: '营业执照_驰远物流.jpg', field: '企业名称/统一信用代码', result: '一致', strength: '强', confidence: 95, citable: true, needConfirm: false },
              { name: '法人身份信息', type: '证照证据', verifyItem: '法人与实控人核验', source: '法人身份证_陈志伟.jpg', field: '法人姓名/身份证号', result: '一致', strength: '强', confidence: 93, citable: true, needConfirm: false },
              { name: '运单履约核验', type: '物流履约证据', verifyItem: '交易真实性核验', source: '运单汇总_202603.pdf', field: '运单号/签收时间/金额', result: '一致', strength: '强', confidence: 88, citable: true, needConfirm: false },
              { name: '服务合同金额核对', type: '合同证据', verifyItem: '合同与发票一致性核验', source: '服务合同_盛拓模组.pdf', field: '合同金额/服务条款', result: '一致', strength: '强', confidence: 86, citable: true, needConfirm: false },
            ],
            conflicts: [],
          },
          {
            id: 've-3', company: '苏州锐信新材料有限公司', shortName: '锐信新材', stage: '已批准', scene: '订单微贷',
            items: [
              { type: '主体真实性核验', sourceCount: 3, fieldCount: 8, status: '已核验', conclusion: '一致', priority: '高' },
              { type: '法人与实控人核验', sourceCount: 2, fieldCount: 5, status: '已核验', conclusion: '一致', priority: '高' },
              { type: '交易真实性核验', sourceCount: 4, fieldCount: 14, status: '已核验', conclusion: '一致', priority: '高' },
              { type: '回款与流水匹配核验', sourceCount: 2, fieldCount: 18, status: '已核验', conclusion: '基本一致', priority: '中' },
              { type: '经营资质核验', sourceCount: 2, fieldCount: 3, status: '已核验', conclusion: '一致', priority: '低' },
            ],
            evidences: [
              { name: '营业执照主体信息', type: '证照证据', verifyItem: '主体真实性核验', source: '营业执照_锐信新材.jpg', field: '企业名称/统一信用代码', result: '一致', strength: '强', confidence: 97, citable: true, needConfirm: false },
              { name: '法人身份信息', type: '证照证据', verifyItem: '法人与实控人核验', source: '法人身份证_周国栋.jpg', field: '法人姓名/身份证号', result: '一致', strength: '强', confidence: 95, citable: true, needConfirm: false },
              { name: '12月发票交叉核验', type: '发票证据', verifyItem: '交易真实性核验', source: '增值税发票_12M.pdf', field: '发票金额/开票时间/开票主体', result: '一致', strength: '强', confidence: 90, citable: true, needConfirm: false },
              { name: '半年度流水匹配', type: '流水证据', verifyItem: '回款与流水匹配核验', source: '银行对账单_2025H2.pdf', field: '收支明细/交易对手', result: '基本一致', strength: '中', confidence: 88, citable: true, needConfirm: false },
              { name: '经营场所核实', type: '现场采集证据', verifyItem: '经营资质核验', source: '经营场所_内景.jpg', field: '场所环境/设备情况', result: '一致', strength: '中', confidence: 85, citable: true, needConfirm: false },
            ],
            conflicts: [],
          },
          {
            id: 've-4', company: '昆山瑞丰辅料有限公司', shortName: '瑞丰辅料', stage: '恢复中', scene: '订单微贷',
            items: [
              { type: '主体真实性核验', sourceCount: 1, fieldCount: 8, status: '已核验', conclusion: '一致', priority: '中' },
              { type: '交易真实性核验', sourceCount: 1, fieldCount: 1, status: '待核验', conclusion: '缺失', priority: '高' },
            ],
            evidences: [
              { name: '营业执照主体信息', type: '证照证据', verifyItem: '主体真实性核验', source: '营业执照_瑞丰辅料.jpg', field: '企业名称/统一信用代码', result: '一致', strength: '强', confidence: 91, citable: true, needConfirm: false },
              { name: '发票主体核对', type: '发票证据', verifyItem: '交易真实性核验', source: '发票材料_202602.jpg', field: '开票主体', result: '冲突', strength: '弱', confidence: 22, citable: false, needConfirm: true },
            ],
            conflicts: [
              { type: '主体信息不一致', verifyItem: '交易真实性核验', evidence: '发票主体核对', reason: '发票上企业名称与瑞丰辅料不一致', conflictField: '发票开票主体 vs 核验主体', impact: '暂不能形成强证据结论', suggestion: '核实发票归属或补充正确发票', blockReport: true },
              { type: '缺少关键佐证', verifyItem: '交易真实性核验', evidence: '—', reason: '缺少法人身份证与合同影像，无法完成交易真实性核验', conflictField: '—', impact: '暂不能生成完整尽调结论', suggestion: '补充法人身份证和合同影像', blockReport: true },
            ],
          },
        ];

        if (!selectedVerifyEntity && VERIFY_ENTITIES.length > 0) {
          setSelectedVerifyEntity(VERIFY_ENTITIES[0].id);
        }
        const activeVE = VERIFY_ENTITIES.find(e => e.id === selectedVerifyEntity) ?? VERIFY_ENTITIES[0];

        const pendingItems = VERIFY_ENTITIES.reduce((a, e) => a + e.items.filter(i => i.status === '待核验' || i.status === '核验中').length, 0);
        const doneItems = VERIFY_ENTITIES.reduce((a, e) => a + e.items.filter(i => i.status === '已核验').length, 0);
        const highConfEvs = VERIFY_ENTITIES.reduce((a, e) => a + e.evidences.filter(ev => ev.strength === '强' && ev.citable).length, 0);
        const needConfirmEvs = VERIFY_ENTITIES.reduce((a, e) => a + e.evidences.filter(ev => ev.needConfirm).length, 0);
        const reportReady = VERIFY_ENTITIES.filter(e => e.conflicts.filter(c => c.blockReport).length === 0 && e.items.every(i => i.status === '已核验')).length;

        return (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0F172A]">证据核验</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">对解析后的材料与结构化字段进行一致性、充分性与可信度核验，形成可引用、可追溯的尽调证据结论。</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新核验结果</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857]"><Zap size={10} />批量核验</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Shield size={10} />查看核验规则</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出核验结论</Button>
              </div>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: '待核验事项', value: pendingItems, desc: '当前等待完成证据判断的核验事项数量', icon: Layers, color: 'text-[#475569]' },
                { label: '已完成核验', value: doneItems, desc: '已完成字段比对与结论确认的核验事项数量', icon: CheckCircle2, color: 'text-[#047857]' },
                { label: '高可信证据', value: highConfEvs, desc: '证据链较完整、可直接支撑结论的证据数量', icon: Shield, color: 'text-[#2563EB]' },
                { label: '待人工确认', value: needConfirmEvs, desc: '存在边界项、冲突项或弱证据判断的事项数量', icon: UserCheck, color: 'text-[#F59E0B]' },
                { label: '可进入报告', value: reportReady, desc: '已具备进入尽调报告条件的主体数量', icon: ArrowRight, color: 'text-[#7C3AED]' },
              ].map(c => (
                <div key={c.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5"><c.icon size={12} className={c.color} /><span className="text-[10px] text-[#64748B]">{c.label}</span></div>
                  <div className="text-[20px] font-bold text-[#0F172A]">{c.value}</div>
                  <div className="text-[9px] text-[#94A3B8]">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Four-column layout */}
            <div className="grid grid-cols-[210px_1fr_1fr_250px] gap-3" style={{ minHeight: 540 }}>

              {/* COL 1: Task & items list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">核验任务与事项</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">优先处理高优先级事项</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {VERIFY_ENTITIES.map(entity => {
                    const isActive = activeVE?.id === entity.id;
                    const done = entity.items.filter(i => i.status === '已核验').length;
                    return (
                      <div key={entity.id} onClick={() => setSelectedVerifyEntity(entity.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{entity.shortName}</span>
                          {entity.conflicts.length > 0
                            ? <Badge className="text-[7px] border bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]">{entity.conflicts.length} 异常</Badge>
                            : <Badge className="text-[7px] border bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]">正常</Badge>}
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{entity.stage} · {entity.scene}</div>
                        <div className="flex items-center gap-2 text-[9px]">
                          <span className="text-[#64748B]">核验 <span className="font-medium text-[#0F172A]">{done}/{entity.items.length}</span></span>
                          <div className="flex-1 h-1 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full rounded-full bg-[#047857]" style={{ width: `${(done / entity.items.length) * 100}%` }} /></div>
                        </div>
                        {/* Sub-items */}
                        {isActive && (
                          <div className="mt-2 space-y-1 border-t border-[#F1F5F9] pt-2">
                            {entity.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[9px]">
                                <span className="text-[#475569] truncate">{item.type.replace('核验', '')}</span>
                                <div className="flex items-center gap-1">
                                  <Badge className={cn('text-[6px] border', ITEM_STATUS_STYLE[item.status])}>{item.status}</Badge>
                                  <Badge className={cn('text-[6px] border', RESULT_STYLE[item.conclusion])}>{item.conclusion}</Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COL 2: Evidence verification results */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">证据核验结果</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">请重点关注一致性、证据强度、字段冲突与报告引用条件</p>
                </div>
                {activeVE ? (
                  <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                    {activeVE.evidences.map((ev, i) => (
                      <div key={i} className={cn('rounded border px-2.5 py-2 text-[10px] space-y-1',
                        ev.result === '冲突' ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ev.result === '存疑' ? 'border-[#FED7AA] bg-[#FFFBEB]' : ev.result === '缺失' ? 'border-[#E2E8F0] bg-[#F8FAFC]' : 'border-[#E2E8F0] bg-white')}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#0F172A] truncate">{ev.name}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <Badge className={cn('text-[7px] border', RESULT_STYLE[ev.result])}>{ev.result}</Badge>
                            <span className={cn('text-[9px] font-bold', STRENGTH_STYLE[ev.strength])}>{ev.strength}</span>
                            <span className="text-[9px] font-bold" style={{ color: ev.confidence >= 80 ? '#047857' : ev.confidence >= 60 ? '#F59E0B' : '#DC2626' }}>{ev.confidence}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] text-[#64748B]">
                          <span>{ev.type}</span>
                          <span>→ {ev.verifyItem.replace('核验', '')}</span>
                          {ev.citable && <span className="text-[#047857]">可引用</span>}
                          {ev.needConfirm && <span className="text-[#F59E0B]">需确认</span>}
                        </div>
                        <div className="text-[9px] text-[#475569]">核验字段: {ev.field}</div>
                        <div className="text-[9px] text-[#94A3B8]">来源: {ev.source}</div>
                        <div className="flex items-center gap-1 pt-0.5">
                          <button className="text-[8px] text-[#2563EB] hover:underline">查看原始材料</button>
                          <span className="text-[#CBD5E1]">·</span>
                          <button className="text-[8px] text-[#2563EB] hover:underline">查看字段明细</button>
                          {(ev.result === '冲突' || ev.result === '存疑') && <><span className="text-[#CBD5E1]">·</span><button className="text-[8px] text-[#C2410C] hover:underline">重新核验</button></>}
                          {ev.citable && <><span className="text-[#CBD5E1]">·</span><button className="text-[8px] text-[#047857] hover:underline">加入报告引用</button></>}
                          {ev.needConfirm && <><span className="text-[#CBD5E1]">·</span><button className="text-[8px] text-[#F59E0B] hover:underline">标记人工确认</button></>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4 text-center">
                    <div><Search size={20} className="text-[#CBD5E1] mx-auto mb-2" /><div className="text-[10px] text-[#94A3B8]">请选择一个主体或核验事项查看结果</div></div>
                  </div>
                )}
              </div>

              {/* COL 3: Conflicts & anomalies */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">冲突与异常处理</span>
                </div>
                {activeVE ? (
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                    {activeVE.conflicts.length > 0 ? (
                      <>
                        <p className="text-[10px] text-[#475569] leading-4">异常项会直接影响核验结论强度与尽调报告的可解释性。如关键结论缺乏充分证据支撑，建议暂不直接进入报告输出。</p>
                        {activeVE.conflicts.map((c, i) => (
                          <div key={i} className={cn('rounded border px-2.5 py-2 text-[10px] space-y-1', c.blockReport ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-[#FED7AA] bg-[#FFFBEB]')}>
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-[#0F172A] flex items-center gap-1">{c.blockReport ? <AlertCircle size={10} className="text-[#DC2626]" /> : <AlertTriangle size={10} className="text-[#F59E0B]" />}{c.type}</span>
                              {c.blockReport && <Badge className="text-[7px] bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]">阻塞报告</Badge>}
                            </div>
                            <div className="text-[9px] text-[#64748B]">核验事项: {c.verifyItem}</div>
                            <div className="text-[9px] text-[#64748B]">涉及证据: {c.evidence}</div>
                            <div className="text-[9px] text-[#475569]">冲突字段: {c.conflictField}</div>
                            <div className="text-[9px] text-[#475569]">原因: {c.reason}</div>
                            <div className="text-[9px] text-[#DC2626]">影响: {c.impact}</div>
                            <div className="text-[9px] text-[#2563EB]">建议: {c.suggestion}</div>
                          </div>
                        ))}
                        {/* Evidence strength summary */}
                        <div className="rounded bg-[#F8FAFC] p-2 space-y-1">
                          <div className="text-[10px] font-semibold text-[#0F172A]">证据强度分布</div>
                          <div className="grid grid-cols-3 gap-1 text-[9px]">
                            {(['强', '中', '弱'] as const).map(s => {
                              const cnt = activeVE.evidences.filter(e => e.strength === s).length;
                              return (
                                <div key={s} className="flex items-center gap-1">
                                  <span className={cn('font-bold', STRENGTH_STYLE[s])}>{cnt}</span>
                                  <span className="text-[#64748B]">{s}证据</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看冲突详情</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Upload size={9} />补充证据</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FED7AA] text-[#C2410C]"><UserCheck size={9} />发起人工确认</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={9} />下载异常清单</Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle2 size={24} className="text-[#A7F3D0] mx-auto mb-2" />
                        <div className="text-[11px] text-[#047857] font-medium">当前未发现明显冲突或关键异常</div>
                        <div className="text-[9px] text-[#94A3B8] mt-1">建议继续查看核验结论，并根据结果决定是否进入尽调报告。</div>
                        <div className="rounded bg-[#F8FAFC] p-2 mt-3 space-y-1 text-left">
                          <div className="text-[10px] font-semibold text-[#0F172A]">证据强度分布</div>
                          <div className="grid grid-cols-3 gap-1 text-[9px]">
                            {(['强', '中', '弱'] as const).map(s => {
                              const cnt = activeVE.evidences.filter(e => e.strength === s).length;
                              return (
                                <div key={s} className="flex items-center gap-1">
                                  <span className={cn('font-bold', STRENGTH_STYLE[s])}>{cnt}</span>
                                  <span className="text-[#64748B]">{s}证据</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4 text-center">
                    <div className="text-[10px] text-[#94A3B8]">请选择主体查看冲突项</div>
                  </div>
                )}
              </div>

              {/* COL 4: AI judgment */}
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 判断</span>
                  </div>
                  {activeVE ? (
                    <div className="space-y-2">
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                        <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                          {activeVE.conflicts.length === 0
                            ? `${activeVE.shortName}的基础证据已全部完成核验，证据链完整，具备进入尽调报告条件。`
                            : `${activeVE.shortName}的基础证据已形成初步核验结论，但关键交易与经营佐证仍需进一步确认。`}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">核验结论摘要</div>
                        <p className="text-[9px] text-[#475569] leading-4">
                          {(() => {
                            const consistent = activeVE.evidences.filter(e => e.result === '一致' || e.result === '基本一致').length;
                            const total = activeVE.evidences.length;
                            return `${consistent}/${total} 项证据一致或基本一致，${activeVE.evidences.filter(e => e.citable).length} 项可直接引用报告${activeVE.conflicts.length > 0 ? `，${activeVE.conflicts.length} 项存在冲突或异常` : ''}。`;
                          })()}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">证据充分性</div>
                        {(() => {
                          const citable = activeVE.evidences.filter(e => e.citable).length;
                          const total = activeVE.evidences.length;
                          const pct = total > 0 ? Math.round((citable / total) * 100) : 0;
                          return (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? '#047857' : pct >= 50 ? '#F59E0B' : '#DC2626' }} /></div>
                              <span className="text-[10px] font-bold" style={{ color: pct >= 80 ? '#047857' : pct >= 50 ? '#F59E0B' : '#DC2626' }}>{pct}%</span>
                            </div>
                          );
                        })()}
                      </div>
                      {activeVE.conflicts.length > 0 && (
                        <div>
                          <div className="text-[9px] text-[#94A3B8] mb-0.5">主要冲突</div>
                          <div className="rounded bg-[#FEF2F2] px-2 py-1.5 text-[9px] text-[#DC2626] space-y-0.5">
                            {activeVE.conflicts.map((c, i) => <div key={i}>· {c.type}: {c.reason.length > 30 ? c.reason.slice(0, 30) + '…' : c.reason}</div>)}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                        <p className="text-[10px] text-[#7C3AED] font-medium">
                          {activeVE.conflicts.filter(c => c.blockReport).length > 0
                            ? '建议优先处理冲突字段与缺失佐证，待关键证据闭环后再进入尽调报告生成。'
                            : activeVE.conflicts.length > 0
                              ? '部分边界项建议人工确认后推进尽调报告。'
                              : '证据核验完整，建议直接进入尽调报告生成。'}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                        <p className="text-[10px] text-[#475569]">{activeVE.conflicts.filter(c => c.blockReport).length === 0 ? '尽调报告 / 报告中心' : '当前证据核验（补充后推进）'}</p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">人工确认提示</div>
                        <p className="text-[9px] text-[#475569]">{activeVE.evidences.filter(e => e.needConfirm).length > 0 ? `${activeVE.evidences.filter(e => e.needConfirm).length} 项证据需人工确认` : '无需人工确认项'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#94A3B8]">选择主体后查看 AI 判断。</p>
                  )}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full" disabled={!activeVE}><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857] w-full" disabled={!activeVE} onClick={() => onModuleChange('dd-report')}><ArrowRight size={10} />进入尽调报告</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB] w-full" disabled={!activeVE} onClick={() => onModuleChange('material')}><ArrowRight size={10} />返回材料解析</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full" disabled={!activeVE}><UserCheck size={10} />人工确认</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'dd-report': {
        type ChapterStatus = '未生成' | '已生成' | '待补充' | '待确认' | '已完成';
        type RefStatus = '已引用' | '可引用' | '待确认' | '暂不建议引用';

        interface Chapter {
          id: number; name: string; type: string; required: boolean;
          status: ChapterStatus; completeness: number; evidenceCount: number;
          pendingCount: number; updatedAt: string;
          body: string; structuredSummary: string;
          references: { name: string; type: string; status: RefStatus; strength: '强' | '中' | '弱'; hasConflict: boolean; pending?: string; impact?: string; blockOutput: boolean }[];
        }

        const CHAPTERS: Chapter[] = [
          {
            id: 1, name: '主体基本情况', type: '主体基本情况', required: true,
            status: '已完成', completeness: 100, evidenceCount: 3, pendingCount: 0, updatedAt: '04/09 14:20',
            body: '常州衡远包装材料有限公司成立于2018年，统一社会信用代码91320400MA1XXXXX，注册资本500万元，法定代表人张建华。主营包装材料生产与销售，注册地址与实际经营地址一致。营业执照、法人身份信息均已通过核验，信息一致。',
            structuredSummary: '企业名称、统一信用代码、注册资本、法人信息均已核验通过',
            references: [
              { name: '营业执照主体信息', type: '证照证据', status: '已引用', strength: '强', hasConflict: false, blockOutput: false },
              { name: '法人身份信息', type: '证照证据', status: '已引用', strength: '强', hasConflict: false, blockOutput: false },
              { name: '链属关系验证', type: '系统回填证据', status: '已引用', strength: '强', hasConflict: false, blockOutput: false },
            ],
          },
          {
            id: 2, name: '股权与实际控制情况', type: '股权与实际控制情况', required: true,
            status: '已完成', completeness: 100, evidenceCount: 2, pendingCount: 0, updatedAt: '04/09 14:20',
            body: '张建华持股80%，为公司实际控制人。其配偶李芳持股20%。股权结构清晰，无代持或多层穿透问题。法人身份证与工商登记信息一致。',
            structuredSummary: '股权结构清晰，实控人为张建华，无代持嫌疑',
            references: [
              { name: '法人身份信息', type: '证照证据', status: '已引用', strength: '强', hasConflict: false, blockOutput: false },
              { name: '公私联动核验', type: '系统回填证据', status: '可引用', strength: '中', hasConflict: false, blockOutput: false },
            ],
          },
          {
            id: 3, name: '经营与业务情况', type: '经营与业务情况', required: true,
            status: '已完成', completeness: 95, evidenceCount: 2, pendingCount: 0, updatedAt: '04/09 13:50',
            body: '衡远包装主要为宁川新能源提供电池模组外包装材料，属于Tier-3供应商。月均产能约80万件，近12月出货稳定。经营场所实地照片已核验，地址与招牌信息与营业执照一致。',
            structuredSummary: '经营场所实地核实一致，Tier-3供应商定位明确',
            references: [
              { name: '经营场所实地信息', type: '现场采集证据', status: '已引用', strength: '中', hasConflict: false, blockOutput: false },
              { name: '链属关系验证', type: '系统回填证据', status: '已引用', strength: '强', hasConflict: false, blockOutput: false },
            ],
          },
          {
            id: 4, name: '交易与上下游情况', type: '交易与上下游情况', required: true,
            status: '待补充', completeness: 70, evidenceCount: 3, pendingCount: 2, updatedAt: '04/09 12:30',
            body: '近90天累计订单32笔，合同金额与签约双方已核验基本一致。主要交易对手为盛拓模组（一级买方）。发票连续9个月保持开票记录。但部分物流签收记录不清晰，签收方名称与合同买方存在偏差，暂未能形成完整交易闭环证据。',
            structuredSummary: '合同与发票基本一致，物流履约证据存在偏差需补充',
            references: [
              { name: '采购合同交易方', type: '合同证据', status: '已引用', strength: '中', hasConflict: false, blockOutput: false },
              { name: '增值税发票核对', type: '发票证据', status: '待确认', strength: '弱', hasConflict: true, pending: '合同金额与发票累计金额偏差超15%', impact: '影响结论可信度', blockOutput: false },
              { name: '物流签收履约', type: '物流履约证据', status: '暂不建议引用', strength: '弱', hasConflict: true, pending: '签收方名称不一致', impact: '影响章节完整性', blockOutput: true },
            ],
          },
          {
            id: 5, name: '财务与资金情况', type: '财务与资金情况', required: true,
            status: '待补充', completeness: 55, evidenceCount: 1, pendingCount: 2, updatedAt: '04/09 11:00',
            body: '近3月银行对账单已部分解析，回款记录与合同金额尚未完全匹配。部分金额字段识别模糊，需人工补充确认。',
            structuredSummary: '对账单已部分解析，回款匹配待补强',
            references: [
              { name: '对账单流水匹配', type: '流水证据', status: '待确认', strength: '弱', hasConflict: false, pending: '部分金额识别模糊', impact: '影响报告输出', blockOutput: true },
            ],
          },
          {
            id: 6, name: '风险与异常情况', type: '风险与异常情况', required: true,
            status: '已生成', completeness: 85, evidenceCount: 2, pendingCount: 1, updatedAt: '04/09 14:00',
            body: '当前未发现重大经营风险。但需注意：(1) 近期物流签收单与合同买方名称存在不一致；(2) 发票金额与合同约定存在一定偏差。上述异常已在证据核验中标记，建议在结论中做风险提示。',
            structuredSummary: '无重大风险，存在物流签收与发票金额两项轻微异常',
            references: [
              { name: '物流签收履约', type: '物流履约证据', status: '已引用', strength: '弱', hasConflict: true, blockOutput: false },
              { name: '增值税发票核对', type: '发票证据', status: '已引用', strength: '弱', hasConflict: true, blockOutput: false },
            ],
          },
          {
            id: 7, name: '尽调结论与建议', type: '尽调结论与建议', required: true,
            status: '待确认', completeness: 80, evidenceCount: 5, pendingCount: 1, updatedAt: '04/09 14:20',
            body: '综合以上尽调内容，衡远包装整体经营真实、主体信息一致、链属关系可验证。主要风险点在于物流履约证据不完整和发票金额偏差。建议：(1) 补充高清物流签收材料；(2) 核实发票金额差异原因；(3) 在上述补强完成后可推进至补审作业。',
            structuredSummary: '整体可信，建议补强物流和发票证据后推进',
            references: [
              { name: '营业执照主体信息', type: '证照证据', status: '已引用', strength: '强', hasConflict: false, blockOutput: false },
              { name: '采购合同交易方', type: '合同证据', status: '已引用', strength: '中', hasConflict: false, blockOutput: false },
              { name: '链属关系验证', type: '系统回填证据', status: '已引用', strength: '强', hasConflict: false, blockOutput: false },
              { name: '增值税发票核对', type: '发票证据', status: '待确认', strength: '弱', hasConflict: true, pending: '金额偏差待确认', impact: '影响审批参考价值', blockOutput: false },
              { name: '物流签收履约', type: '物流履约证据', status: '暂不建议引用', strength: '弱', hasConflict: true, pending: '签收方不一致', impact: '影响结论可信度', blockOutput: false },
            ],
          },
          {
            id: 8, name: '附件与引用材料', type: '附件与引用材料', required: false,
            status: '已生成', completeness: 100, evidenceCount: 8, pendingCount: 0, updatedAt: '04/09 14:20',
            body: '附件列表：营业执照、法人身份证、采购合同、增值税发票、经营场所照片、对账单、物流签收单、供应链平台回传。共计8份材料。',
            structuredSummary: '8份材料已关联，均可在各章节引用',
            references: [],
          },
        ];

        const CH_STATUS_STYLE: Record<ChapterStatus, string> = {
          '未生成': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
          '已生成': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '待补充': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '待确认': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '已完成': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
        };
        const REF_STATUS_STYLE: Record<RefStatus, string> = {
          '已引用': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '可引用': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '待确认': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '暂不建议引用': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
        };
        const STR_STYLE: Record<string, string> = { '强': 'text-[#047857]', '中': 'text-[#F59E0B]', '弱': 'text-[#DC2626]' };

        const ch = CHAPTERS[selectedChapter] ?? CHAPTERS[0];
        const completedCount = CHAPTERS.filter(c => c.status === '已完成').length;
        const pendingChCount = CHAPTERS.filter(c => c.status === '待补充' || c.status === '待确认').length;
        const totalEvRefs = CHAPTERS.reduce((a, c) => a + c.evidenceCount, 0);
        const canOutput = CHAPTERS.filter(c => c.required).every(c => c.status === '已完成' || c.status === '已生成') ? 1 : 0;
        const hasBlocker = CHAPTERS.some(c => c.references.some(r => r.blockOutput));
        const reportStatus = hasBlocker ? '待补充' : completedCount === CHAPTERS.length ? '已完成' : '生成中';

        return (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0F172A]">尽调报告</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">基于材料解析与证据核验结果，自动生成结构化尽调报告，并支持补充、修订与标准化输出。</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857]"><Sparkles size={10} />生成报告</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新内容</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出报告</Button>
                <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Send size={10} />提交报告</Button>
              </div>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: '报告生成状态', value: reportStatus, desc: '当前尽调对象的报告生成与补充进度', icon: FileText, color: reportStatus === '已完成' ? 'text-[#047857]' : 'text-[#F59E0B]' },
                { label: '已完成章节', value: completedCount, desc: '已完成内容生成并满足基础要求的章节', icon: CheckCircle2, color: 'text-[#047857]' },
                { label: '待补充章节', value: pendingChCount, desc: '仍需补充说明、证据或人工判断的章节', icon: Edit3, color: 'text-[#C2410C]' },
                { label: '已引用证据', value: totalEvRefs, desc: '当前已纳入报告引用的证据数量', icon: BookOpen, color: 'text-[#2563EB]' },
                { label: '可输出报告', value: canOutput, desc: '已具备正式输出条件的报告数量', icon: ArrowRight, color: 'text-[#7C3AED]' },
              ].map(c => (
                <div key={c.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5"><c.icon size={12} className={c.color} /><span className="text-[10px] text-[#64748B]">{c.label}</span></div>
                  <div className="text-[20px] font-bold text-[#0F172A]">{c.value}</div>
                  <div className="text-[9px] text-[#94A3B8]">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Four-column layout */}
            <div className="grid grid-cols-[180px_1fr_260px_250px] gap-3" style={{ minHeight: 540 }}>

              {/* COL 1: Chapter navigation */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">章节导航</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">优先处理核心结论章节</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {CHAPTERS.map((chapter, idx) => {
                    const isActive = selectedChapter === idx;
                    return (
                      <div key={chapter.id} onClick={() => setSelectedChapter(idx)}
                        className={cn('px-3 py-2 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-semibold text-[#0F172A] truncate">{chapter.id}. {chapter.name}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <Badge className={cn('text-[6px] border', CH_STATUS_STYLE[chapter.status])}>{chapter.status}</Badge>
                          {chapter.required && <span className="text-[6px] text-[#DC2626]">必填</span>}
                        </div>
                        <div className="flex items-center gap-2 text-[8px]">
                          <span className="text-[#64748B]">{chapter.completeness}%</span>
                          <div className="flex-1 h-1 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${chapter.completeness}%`, backgroundColor: chapter.completeness >= 90 ? '#047857' : chapter.completeness >= 60 ? '#F59E0B' : '#DC2626' }} /></div>
                          <span className="text-[#94A3B8]">{chapter.evidenceCount}引</span>
                          {chapter.pendingCount > 0 && <span className="text-[#DC2626]">{chapter.pendingCount}待</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COL 2: Report content */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">{ch.id}. {ch.name}</span>
                    <p className="text-[9px] text-[#94A3B8] mt-0.5">请重点关注结论表述、证据引用与风险提示</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={cn('text-[7px] border', CH_STATUS_STYLE[ch.status])}>{ch.status}</Badge>
                    <span className="text-[8px] text-[#94A3B8]">{ch.updatedAt}</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* Structured summary */}
                  <div className="rounded bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-2">
                    <div className="text-[9px] text-[#047857] font-medium mb-0.5">结构化摘要</div>
                    <div className="text-[10px] text-[#15803D]">{ch.structuredSummary}</div>
                  </div>
                  {/* Body */}
                  <div className="text-[11px] text-[#1E293B] leading-5 whitespace-pre-wrap">{ch.body}</div>
                  {/* References inline tags */}
                  {ch.references.length > 0 && (
                    <div className="border-t border-[#F1F5F9] pt-2 space-y-1">
                      <div className="text-[9px] text-[#94A3B8] font-medium">引用证据</div>
                      <div className="flex flex-wrap gap-1">
                        {ch.references.map((r, i) => (
                          <span key={i} className={cn('text-[8px] px-1.5 py-0.5 rounded border inline-flex items-center gap-0.5', REF_STATUS_STYLE[r.status])}>
                            {r.hasConflict && <AlertTriangle size={7} />}{r.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Content actions */}
                  <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Edit3 size={9} />编辑内容</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#A7F3D0] text-[#047857]"><Plus size={9} />插入证据引用</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看引用来源</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><RefreshCw size={9} />重新生成本节</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><CheckCircle2 size={9} />保存修改</Button>
                  </div>
                </div>
              </div>

              {/* COL 3: References & pending items */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">引用证据与待补项</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {ch.references.length > 0 ? (
                    <>
                      <p className="text-[9px] text-[#475569] leading-3.5">待补项会直接影响章节完整性与整份报告的可解释性。</p>
                      {ch.references.map((ref, i) => (
                        <div key={i} className={cn('rounded border px-2.5 py-2 text-[10px] space-y-1',
                          ref.hasConflict ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ref.status === '待确认' ? 'border-[#FED7AA] bg-[#FFFBEB]' : 'border-[#E2E8F0] bg-white')}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[#0F172A] truncate flex items-center gap-1">
                              {ref.hasConflict && <AlertTriangle size={9} className="text-[#DC2626] shrink-0" />}
                              {ref.name}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <Badge className={cn('text-[7px] border', REF_STATUS_STYLE[ref.status])}>{ref.status}</Badge>
                              <span className={cn('text-[8px] font-bold', STR_STYLE[ref.strength])}>{ref.strength}</span>
                            </div>
                          </div>
                          <div className="text-[9px] text-[#64748B]">类型: {ref.type}</div>
                          {ref.pending && <div className="text-[9px] text-[#C2410C]">待补: {ref.pending}</div>}
                          {ref.impact && <div className="text-[9px] text-[#DC2626]">影响: {ref.impact}</div>}
                          {ref.blockOutput && <Badge className="text-[7px] bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]">阻塞输出</Badge>}
                          <div className="flex items-center gap-1 pt-0.5">
                            <button className="text-[8px] text-[#2563EB] hover:underline">查看证据</button>
                            <span className="text-[#CBD5E1]">·</span>
                            {ref.status !== '已引用' && <><button className="text-[8px] text-[#047857] hover:underline">加入引用</button><span className="text-[#CBD5E1]">·</span></>}
                            {ref.status === '已引用' && <><button className="text-[8px] text-[#DC2626] hover:underline">移出引用</button><span className="text-[#CBD5E1]">·</span></>}
                            {ref.pending && <><button className="text-[8px] text-[#C2410C] hover:underline">补充内容</button><span className="text-[#CBD5E1]">·</span></>}
                            {ref.hasConflict && <button className="text-[8px] text-[#F59E0B] hover:underline">发起人工确认</button>}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle2 size={24} className="text-[#A7F3D0] mx-auto mb-2" />
                      <div className="text-[11px] text-[#047857] font-medium">当前章节无待补充项</div>
                      <div className="text-[9px] text-[#94A3B8] mt-1">报告内容已满足基础完整性要求。建议复核核心结论与引用依据后，进入报告中心统一管理。</div>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 4: AI judgment */}
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 判断</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                      <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                        {hasBlocker
                          ? '当前尽调报告已形成基础章节内容，能够支撑初步输出，但部分核心结论仍需补充证据与人工确认。'
                          : '当前尽调报告各章节内容已满足输出要求，建议提交至报告中心统一管理。'}
                      </p>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">报告完整度</div>
                      {(() => {
                        const avg = Math.round(CHAPTERS.reduce((a, c) => a + c.completeness, 0) / CHAPTERS.length);
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${avg}%`, backgroundColor: avg >= 80 ? '#047857' : avg >= 60 ? '#F59E0B' : '#DC2626' }} /></div>
                            <span className="text-[10px] font-bold" style={{ color: avg >= 80 ? '#047857' : avg >= 60 ? '#F59E0B' : '#DC2626' }}>{avg}%</span>
                          </div>
                        );
                      })()}
                      <p className="text-[9px] text-[#475569] mt-1 leading-4">
                        {CHAPTERS.filter(c => c.status === '已完成').map(c => c.name).slice(0, 3).join('、')}已完成
                        {pendingChCount > 0 && `，${CHAPTERS.filter(c => c.status === '待补充' || c.status === '待确认').map(c => c.name).join('、')}仍需补强`}。
                      </p>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">核心结论摘要</div>
                      <p className="text-[9px] text-[#475569] leading-4">主体身份与基础资质材料一致，交易与资金层面部分证据待补强。整体可信度中等偏上。</p>
                    </div>
                    {hasBlocker && (
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">主要缺口</div>
                        <div className="rounded bg-[#FEF2F2] px-2 py-1.5 text-[9px] text-[#DC2626] space-y-0.5">
                          {CHAPTERS.flatMap(c => c.references.filter(r => r.blockOutput).map(r => `· ${c.name}: ${r.pending ?? '存在阻塞项'}`)).map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                      <p className="text-[10px] text-[#7C3AED] font-medium">
                        {hasBlocker
                          ? '建议优先补齐关键章节的证据引用与结论说明，待阻塞项清理后再提交至报告中心。'
                          : '报告已满足输出条件，建议提交至报告中心统一管理与归档。'}
                      </p>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                      <p className="text-[10px] text-[#475569]">{hasBlocker ? '当前报告（补强后提交）' : '报告中心'}</p>
                    </div>
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">人工确认提示</div>
                      <p className="text-[9px] text-[#475569]">
                        {CHAPTERS.reduce((a, c) => a + c.references.filter(r => r.status === '待确认').length, 0) > 0
                          ? `${CHAPTERS.reduce((a, c) => a + c.references.filter(r => r.status === '待确认').length, 0)} 项引用需人工确认`
                          : '无需人工确认项'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full"><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857] w-full" onClick={() => onModuleChange('report-center')}><ArrowRight size={10} />进入报告中心</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB] w-full" onClick={() => onModuleChange('evidence')}><ArrowRight size={10} />返回证据核验</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full"><UserCheck size={10} />人工确认</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'report-center': {
        type RptStatus = '草稿中' | '待补充' | '待确认' | '待提交' | '已提交' | '已归档';

        interface ReportItem {
          id: string; company: string; industry: string; region: string; scene: string; stage: string;
          name: string; version: string; status: RptStatus;
          createdAt: string; updatedAt: string; submitTime: string;
          chapterDone: number; chapterTotal: number; evidenceCount: number; pendingCount: number; hasBlocker: boolean;
          conclusion: string; canSubmit: boolean; hasConflict: boolean; needConfirm: boolean;
          handler: string; archiveStatus: string; suggestAction: string;
        }

        const REPORTS: ReportItem[] = [
          { id: 'RPT-0041', company: '常州衡远包装材料有限公司', industry: '包装制造', region: '江苏-常州', scene: '订单微贷', stage: '补审中',
            name: '衡远包装 尽调报告', version: 'v2.1', status: '待提交', createdAt: '04/07 09:00', updatedAt: '04/09 14:20', submitTime: '—',
            chapterDone: 6, chapterTotal: 8, evidenceCount: 18, pendingCount: 2, hasBlocker: true,
            conclusion: '主体身份与基础资质一致，交易与资金层面部分证据待补强。', canSubmit: false, hasConflict: true, needConfirm: true,
            handler: '王敏', archiveStatus: '—', suggestAction: '返回补充关键章节' },
          { id: 'RPT-0040', company: '常州衡远包装材料有限公司', industry: '包装制造', region: '江苏-常州', scene: '订单微贷', stage: '补审中',
            name: '衡远包装 尽调报告', version: 'v1.0', status: '已归档', createdAt: '04/05 10:00', updatedAt: '04/07 16:30', submitTime: '04/07 16:30',
            chapterDone: 8, chapterTotal: 8, evidenceCount: 15, pendingCount: 0, hasBlocker: false,
            conclusion: '已形成完整尽调结论，报告满足输出要求。', canSubmit: false, hasConflict: false, needConfirm: false,
            handler: '王敏', archiveStatus: '已归档', suggestAction: '—' },
          { id: 'RPT-0039', company: '苏州锐信新材料有限公司', industry: '新材料', region: '江苏-苏州', scene: '订单微贷', stage: '已批准',
            name: '锐信新材 尽调报告', version: 'v1.0', status: '已提交', createdAt: '04/06 08:00', updatedAt: '04/08 11:00', submitTime: '04/08 11:00',
            chapterDone: 8, chapterTotal: 8, evidenceCount: 22, pendingCount: 0, hasBlocker: false,
            conclusion: '证据链完整，主体信息与交易均已核验通过。', canSubmit: false, hasConflict: false, needConfirm: false,
            handler: '李四经理', archiveStatus: '—', suggestAction: '归档报告' },
          { id: 'RPT-0038', company: '无锡驰远物流服务有限公司', industry: '物流服务', region: '江苏-无锡', scene: '运费贷', stage: '预授信',
            name: '驰远物流 尽调报告', version: 'v1.0', status: '待确认', createdAt: '04/07 14:00', updatedAt: '04/08 14:10', submitTime: '—',
            chapterDone: 7, chapterTotal: 8, evidenceCount: 12, pendingCount: 1, hasBlocker: false,
            conclusion: '报告已具备初步结论，关键章节仍需人工确认后再提交。', canSubmit: false, hasConflict: false, needConfirm: true,
            handler: '刘洋', archiveStatus: '—', suggestAction: '人工确认后提交' },
          { id: 'RPT-0037', company: '溧阳佳利包装材料有限公司', industry: '包装制造', region: '江苏-溧阳', scene: '订单微贷', stage: '已识别',
            name: '佳利包装 尽调报告', version: 'v1.0', status: '草稿中', createdAt: '04/09 10:20', updatedAt: '04/09 10:20', submitTime: '—',
            chapterDone: 2, chapterTotal: 8, evidenceCount: 3, pendingCount: 5, hasBlocker: true,
            conclusion: '—', canSubmit: false, hasConflict: false, needConfirm: false,
            handler: '系统自动', archiveStatus: '—', suggestAction: '返回补充材料与核验' },
          { id: 'RPT-0036', company: '昆山瑞丰辅料有限公司', industry: '化工辅料', region: '江苏-昆山', scene: '订单微贷', stage: '恢复中',
            name: '瑞丰辅料 尽调报告', version: 'v1.0', status: '待补充', createdAt: '04/06 09:00', updatedAt: '04/09 08:00', submitTime: '—',
            chapterDone: 3, chapterTotal: 8, evidenceCount: 5, pendingCount: 4, hasBlocker: true,
            conclusion: '存在主体信息冲突与关键材料缺失，暂不能输出。', canSubmit: false, hasConflict: true, needConfirm: true,
            handler: '张磊', archiveStatus: '—', suggestAction: '返回证据核验补强' },
        ];

        const RPT_STATUS_STYLE: Record<RptStatus, string> = {
          '草稿中': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
          '待补充': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '待确认': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '待提交': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '已提交': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '已归档': 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
        };

        if (!selectedReport && REPORTS.length > 0) setSelectedReport(REPORTS[0].id);
        const activeRpt = REPORTS.find(r => r.id === selectedReport) ?? REPORTS[0];

        const totalRpts = REPORTS.length;
        const pendingRpts = REPORTS.filter(r => r.status === '待补充' || r.status === '草稿中').length;
        const submitReady = REPORTS.filter(r => r.status === '待提交' || r.status === '待确认').length;
        const doneRpts = REPORTS.filter(r => r.status === '已提交').length;
        const archivedRpts = REPORTS.filter(r => r.status === '已归档').length;

        return (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0F172A]">报告中心</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">统一管理尽调报告的生成状态、补充进度、提交流转与归档结果，提升报告输出与复核效率。</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新列表</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出报告清单</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857]"><Send size={10} />批量提交</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Layers size={10} />批量归档</Button>
              </div>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: '报告总数', value: totalRpts, desc: '当前纳入统一管理的尽调报告总数', icon: FileText, color: 'text-[#2563EB]' },
                { label: '待补充报告', value: pendingRpts, desc: '仍存在缺失内容、弱证据或阻塞项的报告', icon: Edit3, color: 'text-[#C2410C]' },
                { label: '待提交报告', value: submitReady, desc: '已基本完成内容生成，待正式提交', icon: Send, color: 'text-[#7C3AED]' },
                { label: '已完成报告', value: doneRpts, desc: '已完成编制并满足基础要求', icon: CheckCircle2, color: 'text-[#047857]' },
                { label: '已归档报告', value: archivedRpts, desc: '已完成流转并进入归档管理', icon: Layers, color: 'text-[#475569]' },
              ].map(c => (
                <div key={c.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5"><c.icon size={12} className={c.color} /><span className="text-[10px] text-[#64748B]">{c.label}</span></div>
                  <div className="text-[20px] font-bold text-[#0F172A]">{c.value}</div>
                  <div className="text-[9px] text-[#94A3B8]">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Three-column layout */}
            <div className="grid grid-cols-[240px_1fr_250px] gap-3" style={{ minHeight: 520 }}>

              {/* COL 1: Report list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">报告列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">先按状态收敛，再确定优先处理对象</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {REPORTS.map(rpt => {
                    const isActive = activeRpt?.id === rpt.id;
                    const pct = Math.round((rpt.chapterDone / rpt.chapterTotal) * 100);
                    return (
                      <div key={rpt.id} onClick={() => setSelectedReport(rpt.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{rpt.company.replace(/有限公司$/, '').replace(/^(常州|无锡|苏州|溧阳|昆山)/, '')}</span>
                          <Badge className={cn('text-[7px] border', RPT_STATUS_STYLE[rpt.status])}>{rpt.status}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{rpt.industry} · {rpt.region.split('-')[1]} · {rpt.scene}</div>
                        <div className="flex items-center gap-1.5 mb-1 text-[8px]">
                          <span className="text-[#64748B] font-mono">{rpt.version}</span>
                          {rpt.hasBlocker && <span className="text-[#DC2626]">阻塞</span>}
                          {rpt.needConfirm && <span className="text-[#F59E0B]">需确认</span>}
                          {rpt.hasConflict && <span className="text-[#DC2626]">冲突</span>}
                        </div>
                        <div className="flex items-center gap-2 text-[8px]">
                          <span className="text-[#64748B]">{rpt.chapterDone}/{rpt.chapterTotal}</span>
                          <div className="flex-1 h-1 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct >= 90 ? '#047857' : pct >= 50 ? '#F59E0B' : '#DC2626' }} /></div>
                          <span className="text-[#94A3B8]">{rpt.evidenceCount}引</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COL 2: Report detail */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">当前报告详情</span>
                  <div className="flex items-center gap-1">
                    <Badge className={cn('text-[7px] border', RPT_STATUS_STYLE[activeRpt.status])}>{activeRpt.status}</Badge>
                    <span className="text-[8px] text-[#94A3B8] font-mono">{activeRpt.version}</span>
                  </div>
                </div>
                {activeRpt ? (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Entity info */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10px]">
                      <div><span className="text-[#94A3B8]">企业名称</span> <span className="text-[#0F172A] font-medium">{activeRpt.company}</span></div>
                      <div><span className="text-[#94A3B8]">所属行业</span> <span className="text-[#0F172A]">{activeRpt.industry}</span></div>
                      <div><span className="text-[#94A3B8]">所在地区</span> <span className="text-[#0F172A]">{activeRpt.region}</span></div>
                      <div><span className="text-[#94A3B8]">推荐场景</span> <span className="text-[#0F172A]">{activeRpt.scene}</span></div>
                      <div><span className="text-[#94A3B8]">当前阶段</span> <span className="text-[#0F172A]">{activeRpt.stage}</span></div>
                      <div><span className="text-[#94A3B8]">报告版本</span> <span className="text-[#0F172A] font-mono">{activeRpt.version}</span>{activeRpt.version !== 'v1.0' && <History size={9} className="text-[#94A3B8] inline ml-1" />}</div>
                    </div>

                    {/* Conclusion */}
                    <div className="rounded bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-2">
                      <div className="text-[9px] text-[#047857] font-medium mb-0.5">报告结论</div>
                      <div className="text-[10px] text-[#15803D]">{activeRpt.conclusion !== '—' ? activeRpt.conclusion : '当前暂无尽调报告内容。'}</div>
                    </div>

                    {/* Completeness */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-semibold text-[#0F172A]">报告完整度</div>
                      <div className="flex items-center gap-2">
                        {(() => { const pct = Math.round((activeRpt.chapterDone / activeRpt.chapterTotal) * 100); return (
                          <>
                            <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct >= 90 ? '#047857' : pct >= 60 ? '#F59E0B' : '#DC2626' }} /></div>
                            <span className="text-[10px] font-bold" style={{ color: pct >= 90 ? '#047857' : pct >= 60 ? '#F59E0B' : '#DC2626' }}>{pct}%</span>
                          </>
                        ); })()}
                      </div>
                      <div className="text-[9px] text-[#64748B]">已完成 {activeRpt.chapterDone}/{activeRpt.chapterTotal} 章节 · 引用 {activeRpt.evidenceCount} 项证据 · 待补 {activeRpt.pendingCount} 项</div>
                    </div>

                    {/* References & supplementary info */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-semibold text-[#0F172A]">引用与补充</div>
                      <div className="grid grid-cols-2 gap-1 text-[9px]">
                        <div className="flex items-center gap-1">{activeRpt.hasBlocker ? <AlertCircle size={9} className="text-[#DC2626]" /> : <CheckCircle2 size={9} className="text-[#047857]" />}<span>阻塞项: {activeRpt.hasBlocker ? '有' : '无'}</span></div>
                        <div className="flex items-center gap-1">{activeRpt.hasConflict ? <AlertTriangle size={9} className="text-[#F59E0B]" /> : <CheckCircle2 size={9} className="text-[#047857]" />}<span>冲突引用: {activeRpt.hasConflict ? '有' : '无'}</span></div>
                        <div className="flex items-center gap-1">{activeRpt.needConfirm ? <UserCheck size={9} className="text-[#7C3AED]" /> : <CheckCircle2 size={9} className="text-[#047857]" />}<span>人工确认: {activeRpt.needConfirm ? '待确认' : '无需'}</span></div>
                        <div className="flex items-center gap-1">{activeRpt.canSubmit ? <Send size={9} className="text-[#047857]" /> : <Clock size={9} className="text-[#64748B]" />}<span>提交条件: {activeRpt.canSubmit ? '满足' : '未满足'}</span></div>
                      </div>
                    </div>

                    {/* Flow & archive */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-semibold text-[#0F172A]">流转与归档</div>
                      <div className="grid grid-cols-2 gap-1 text-[9px] text-[#64748B]">
                        <div>创建时间: {activeRpt.createdAt}</div>
                        <div>最近更新: {activeRpt.updatedAt}</div>
                        <div>提交时间: {activeRpt.submitTime}</div>
                        <div>处理人: {activeRpt.handler}</div>
                        <div>归档状态: {activeRpt.archiveStatus}</div>
                      </div>
                    </div>

                    {/* Detail actions */}
                    <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]" onClick={() => onModuleChange('dd-report')}><Edit3 size={9} />进入报告编辑</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看引用证据</Button>
                      {activeRpt.status === '已提交' && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={9} />重新提交</Button>}
                      {activeRpt.needConfirm && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />标记人工确认</Button>}
                      {(activeRpt.status === '已提交') && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Layers size={9} />归档报告</Button>}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4 text-center">
                    <div><FileText size={20} className="text-[#CBD5E1] mx-auto mb-2" /><div className="text-[10px] text-[#94A3B8]">请选择一份报告查看详情</div></div>
                  </div>
                )}
              </div>

              {/* COL 3: AI judgment */}
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 建议</span>
                  </div>
                  {activeRpt ? (
                    <div className="space-y-2">
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                        <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                          {activeRpt.status === '已提交' || activeRpt.status === '已归档'
                            ? `${activeRpt.company.replace(/有限公司$/, '')}的报告已完成流转，可进入归档或后续追溯。`
                            : activeRpt.hasBlocker
                              ? `${activeRpt.company.replace(/有限公司$/, '')}的报告仍存在阻塞项，建议补强后再提交。`
                              : `${activeRpt.company.replace(/有限公司$/, '')}的报告已具备提交条件，建议尽快处理。`}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">报告状态摘要</div>
                        <p className="text-[9px] text-[#475569] leading-4">
                          章节完成 {activeRpt.chapterDone}/{activeRpt.chapterTotal}，已引用 {activeRpt.evidenceCount} 项证据
                          {activeRpt.pendingCount > 0 ? `，${activeRpt.pendingCount} 项待补充` : ''}
                          {activeRpt.hasConflict ? '，存在冲突引用' : ''}。
                        </p>
                      </div>
                      {(activeRpt.hasBlocker || activeRpt.hasConflict) && (
                        <div>
                          <div className="text-[9px] text-[#94A3B8] mb-0.5">核心风险提示</div>
                          <div className="rounded bg-[#FEF2F2] px-2 py-1.5 text-[9px] text-[#DC2626] space-y-0.5">
                            {activeRpt.hasBlocker && <div>· 存在阻塞项，暂不能正式提交</div>}
                            {activeRpt.hasConflict && <div>· 存在冲突引用，建议先确认</div>}
                            {activeRpt.needConfirm && <div>· 存在边界判断项，需人工确认</div>}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">提交准备度</div>
                        {(() => {
                          const pct = Math.round((activeRpt.chapterDone / activeRpt.chapterTotal) * 100);
                          const ready = !activeRpt.hasBlocker && pct >= 90;
                          return (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ready ? '#047857' : '#F59E0B' }} /></div>
                              <span className="text-[10px] font-bold" style={{ color: ready ? '#047857' : '#F59E0B' }}>{ready ? '可提交' : '需补强'}</span>
                            </div>
                          );
                        })()}
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                        <p className="text-[10px] text-[#7C3AED] font-medium">
                          {activeRpt.status === '已归档' ? '报告已归档，可用于后续追溯与复查。'
                            : activeRpt.status === '已提交' ? '当前报告已提交，建议进入归档或审批前置。'
                            : activeRpt.hasBlocker ? '建议先处理阻塞章节，再提交报告。'
                            : activeRpt.needConfirm ? '建议完成人工确认后提交报告。'
                            : '当前报告已具备提交条件，建议直接提交。'}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                        <p className="text-[10px] text-[#475569]">
                          {activeRpt.hasBlocker ? '尽调报告（补强后提交）' : activeRpt.status === '已提交' ? '审批前置 / 归档' : '提交后进入审批前置'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#94A3B8]">选择报告后查看 AI 建议。</p>
                  )}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full" disabled={!activeRpt}><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857] w-full" disabled={!activeRpt}><ArrowRight size={10} />进入审批前置</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB] w-full" disabled={!activeRpt} onClick={() => onModuleChange('dd-report')}><ArrowRight size={10} />返回尽调报告</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full" disabled={!activeRpt}><UserCheck size={10} />人工确认</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      default:
        onModuleChange('material');
        return null;
    }
  };

  return (
    <SceneLayout title={scene.title} modules={scene.modules} activeModule={activeModule} onModuleChange={onModuleChange}>
      {renderContent()}
    </SceneLayout>
  );
}

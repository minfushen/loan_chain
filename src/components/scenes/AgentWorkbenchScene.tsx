import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle, Brain, CheckCircle2, ChevronDown, ChevronRight,
  Clock, GitBranch, MessageSquare, Shield, Sparkles, User, Users, Zap,
  TrendingUp, Tag, ShieldCheck, CheckSquare, Terminal, Search,
  FileText, BarChart2, ArrowRightLeft, Lightbulb, CircleDot, Filter,
} from 'lucide-react';
import {
  AGENT_DEMO_CASES,
  type AgentDemoCase,
  type AgentReasoningStep,
  type AgentEvidenceSummary,
  type AgentProgressStage,
} from '../../demo/chainLoan/data';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';

// ── 常量 ──────────────────────────────────────────────────

const TRIGGER_REASON_LABEL: Record<string, string> = {
  public_private_mixing: '公私混用',
  cashflow_negative: '现金流为负',
  concentration_high: '客户集中度超阈值',
};

const TRIGGER_REASON_COLOR: Record<string, string> = {
  public_private_mixing: 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
  cashflow_negative: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
  concentration_high: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
};

const RISK_LEVEL_STYLE = {
  low:    { label: '低风险', bg: 'bg-[#ECFDF3]', text: 'text-[#047857]', border: 'border-[#A7F3D0]', dot: 'bg-[#10B981]', bar: 'bg-[#10B981]' },
  medium: { label: '中风险', bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]', dot: 'bg-[#F59E0B]', bar: 'bg-[#F59E0B]' },
  high:   { label: '高风险', bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]', dot: 'bg-[#DC2626]', bar: 'bg-[#DC2626]' },
};

const PROGRESS_STAGES: {
  id: AgentProgressStage;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  agentLabel: string;
}[] = [
  { id: 'receive',     label: '接收任务',     subtitle: '命中规则，触发智能体介入',     icon: <CircleDot size={13} />,  agentLabel: '决策智能体' },
  { id: 'collect',     label: '收集上下文',   subtitle: '读取流水、合同、行业链路',     icon: <Search size={13} />,     agentLabel: '决策智能体' },
  { id: 'analyze',     label: '交叉分析',     subtitle: '多假设验证，识别关键模式',     icon: <BarChart2 size={13} />,  agentLabel: '决策智能体' },
  { id: 'conclude',    label: '形成建议',     subtitle: '综合判断，输出置信度结论',     icon: <Lightbulb size={13} />,  agentLabel: '审核智能体' },
  { id: 'await_human', label: '等待人工协作', subtitle: '待确认是否采纳智能体建议',     icon: <User size={13} />,       agentLabel: '人工' },
];

const STAGE_ORDER: AgentProgressStage[] = ['receive', 'collect', 'analyze', 'conclude', 'await_human'];

const STAGE_STEP_MAP: Record<AgentProgressStage, { agent: 'decision' | 'review' | 'none'; stepIndices: number[] }> = {
  receive:     { agent: 'decision', stepIndices: [0] },
  collect:     { agent: 'decision', stepIndices: [1, 2] },
  analyze:     { agent: 'decision', stepIndices: [3, 4] },
  conclude:    { agent: 'review',   stepIndices: [0, 1, 2, 3] },
  await_human: { agent: 'none',     stepIndices: [] },
};

const TOOL_ICON: Record<string, React.ReactNode> = {
  task_decompose:     <FileText size={10} />,
  entity_verify:      <Search size={10} />,
  financial_analyze:  <BarChart2 size={10} />,
  risk_scan:          <Shield size={10} />,
  triple_flow_verify: <ArrowRightLeft size={10} />,
  reflect_output:     <Brain size={10} />,
  anomaly_classify:   <Tag size={10} />,
  hypothesis_verify:  <GitBranch size={10} />,
  supplement_request: <FileText size={10} />,
  dual_path_output:   <Lightbulb size={10} />,
};

const EVIDENCE_ICON_MAP: Record<AgentEvidenceSummary['icon'], React.ReactNode> = {
  clock:    <Clock size={11} className="text-[#7C3AED]" />,
  tag:      <Tag size={11} className="text-[#2563EB]" />,
  users:    <Users size={11} className="text-[#047857]" />,
  trending: <TrendingUp size={11} className="text-[#C2410C]" />,
  shield:   <ShieldCheck size={11} className="text-[#64748B]" />,
  check:    <CheckSquare size={11} className="text-[#047857]" />,
};

// ── 子组件：任务卡 ────────────────────────────────────────

function TaskCard({
  c,
  selected,
  onClick,
}: {
  c: AgentDemoCase;
  selected: boolean;
  onClick: () => void;
}) {
  const risk = RISK_LEVEL_STYLE[c.riskLevel];
  const isAwaitHuman = c.anomaly.currentStage === 'await_human';

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-xl border transition-all px-4 py-3 space-y-2',
        selected
          ? 'border-[#7C3AED] bg-[#F5F3FF] shadow-sm shadow-[#7C3AED]/10'
          : 'border-[#E2E8F0] bg-white hover:border-[#C4B5FD] hover:bg-[#FAFBFF]',
      )}
    >
      {/* 第一行：企业名 + 风险等级 */}
      <div className="flex items-center justify-between gap-2">
        <span className={cn('text-[12px] font-bold leading-tight', selected ? 'text-[#7C3AED]' : 'text-[#0F172A]')}>
          {c.shortName}
        </span>
        <div className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded border text-[8px] font-medium flex-shrink-0', risk.bg, risk.text, risk.border)}>
          <div className={cn('w-1 h-1 rounded-full', risk.dot)} />
          {risk.label}
        </div>
      </div>

      {/* 第二行：风险主题 */}
      <div className="flex items-center gap-1.5">
        <span className={cn('text-[9px] px-1.5 py-0.5 rounded border', TRIGGER_REASON_COLOR[c.anomaly.triggerReason])}>
          {TRIGGER_REASON_LABEL[c.anomaly.triggerReason]}
        </span>
        <span className="text-[9px] text-[#64748B]">{c.scene}</span>
      </div>

      {/* 第三行：状态 */}
      <div className={cn(
        'flex items-center gap-1.5 text-[9px] font-medium',
        isAwaitHuman ? 'text-[#7C3AED]' : 'text-[#64748B]',
      )}>
        {isAwaitHuman && <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse flex-shrink-0" />}
        {c.taskStatus}
      </div>

      {/* 第四行：建议摘要（一句话） */}
      <div className="text-[9px] text-[#475569] leading-4 line-clamp-2">
        {c.anomaly.agentAction}
      </div>

      {/* 第五行：置信度 + 时间 */}
      <div className="flex items-center justify-between text-[8px] text-[#94A3B8]">
        <span>置信度 <span className="font-semibold text-[#047857]">{c.anomaly.confidenceAfter}%</span></span>
        <span>申请额度 {c.requestedLimit}</span>
      </div>
    </button>
  );
}

// ── 子组件：详情区空状态 ──────────────────────────────────

function EmptyDetail() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-[#F5F3FF] flex items-center justify-center">
        <Brain size={28} className="text-[#C4B5FD]" />
      </div>
      <div className="space-y-1.5">
        <div className="text-[13px] font-semibold text-[#0F172A]">请选择一个智能体作业任务</div>
        <div className="text-[11px] text-[#64748B] leading-5 max-w-xs">
          点击左侧任务后，可查看该任务的推理过程、关键证据、当前建议与待确认事项
        </div>
      </div>
      <div className="flex items-center gap-4 text-[9px] text-[#94A3B8]">
        <span className="flex items-center gap-1"><Brain size={10} />推理过程</span>
        <span className="flex items-center gap-1"><ShieldCheck size={10} />关键证据</span>
        <span className="flex items-center gap-1"><CheckSquare size={10} />待确认事项</span>
      </div>
    </div>
  );
}

// ── 子组件：Tool 调用行 ───────────────────────────────────

function ToolCallRow({ step, defaultOpen = false }: { step: AgentReasoningStep; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={cn('rounded-lg border overflow-hidden', step.flagged ? 'border-[#FCA5A5]' : 'border-[#E2E8F0]')}>
      <button
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 text-left transition-colors',
          step.flagged ? 'bg-[#FEF2F2] hover:bg-[#FEE2E2]' : 'bg-[#F8FAFC] hover:bg-[#F1F5F9]',
        )}
        onClick={() => setOpen(v => !v)}
      >
        <div className={cn('w-5 h-5 rounded flex items-center justify-center flex-shrink-0',
          step.flagged ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'bg-[#E2E8F0] text-[#64748B]',
        )}>
          {TOOL_ICON[step.tool] ?? <Terminal size={10} />}
        </div>
        <code className={cn('text-[10px] font-mono font-semibold flex-1', step.flagged ? 'text-[#DC2626]' : 'text-[#334155]')}>
          {step.tool}()
        </code>
        <span className="text-[9px] text-[#94A3B8] mr-1">{step.label}</span>
        {step.confidence !== undefined && (
          <span className={cn('text-[9px] font-medium px-1.5 py-0.5 rounded mr-1',
            step.confidence >= 90 ? 'bg-[#ECFDF3] text-[#047857]' :
            step.confidence >= 75 ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#FEF2F2] text-[#DC2626]',
          )}>{step.confidence}%</span>
        )}
        {step.flagged && <span className="text-[8px] bg-[#DC2626] text-white px-1.5 py-0.5 rounded mr-1">异常</span>}
        {open ? <ChevronDown size={12} className="text-[#94A3B8] flex-shrink-0" /> : <ChevronRight size={12} className="text-[#94A3B8] flex-shrink-0" />}
      </button>
      {open && (
        <div className="border-t border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9]">
          <div className="px-3 py-2">
            <div className="text-[8px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">Input</div>
            <div className="text-[10px] text-[#475569] leading-4">{step.input}</div>
          </div>
          <div className="px-3 py-2">
            <div className="text-[8px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-1">Output</div>
            <div className="text-[10px] text-[#0F172A] leading-4 whitespace-pre-line font-mono bg-[#F8FAFC] rounded px-2 py-1.5">
              {step.output}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 子组件：CoT 阶段块 ────────────────────────────────────

function CotStageBlock({ stageIdx, currentIdx, anomaly }: {
  stageIdx: number;
  currentIdx: number;
  anomaly: AgentDemoCase['anomaly'];
}) {
  const stage = PROGRESS_STAGES[stageIdx];
  const isDone    = stageIdx < currentIdx;
  const isActive  = stageIdx === currentIdx;
  const isPending = stageIdx > currentIdx;
  const [open, setOpen] = React.useState(isActive);

  const { agent, stepIndices } = STAGE_STEP_MAP[stage.id];
  const steps: AgentReasoningStep[] = agent === 'decision'
    ? stepIndices.map(i => anomaly.decisionAgentSteps[i]).filter(Boolean)
    : agent === 'review'
    ? stepIndices.map(i => anomaly.reviewAgentSteps[i]).filter(Boolean)
    : [];

  const isAwaitHuman = stage.id === 'await_human';

  return (
    <div className={cn(
      'rounded-xl border overflow-hidden transition-all',
      isActive  ? 'border-[#7C3AED] shadow-sm shadow-[#7C3AED]/10' :
      isDone    ? 'border-[#E2E8F0]' : 'border-[#F1F5F9] opacity-50',
    )}>
      <button
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
          isActive ? 'bg-[#F5F3FF]' : isDone ? 'bg-[#F8FAFC] hover:bg-[#F1F5F9]' : 'bg-[#FAFBFF]',
          isPending ? 'cursor-default' : 'cursor-pointer',
        )}
        onClick={() => !isPending && setOpen(v => !v)}
        disabled={isPending}
      >
        <div className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold border-2',
          isActive  ? 'bg-[#7C3AED] border-[#7C3AED] text-white ring-4 ring-[#7C3AED]/15' :
          isDone    ? 'bg-[#047857] border-[#047857] text-white' :
                      'bg-white border-[#E2E8F0] text-[#CBD5E1]',
        )}>
          {isDone ? <CheckCircle2 size={12} /> : stageIdx + 1}
        </div>
        <div className={cn('flex items-center gap-1.5 flex-shrink-0',
          isActive ? 'text-[#7C3AED]' : isDone ? 'text-[#047857]' : 'text-[#CBD5E1]',
        )}>
          {stage.icon}
          <span className={cn('text-[12px] font-semibold',
            isActive ? 'text-[#7C3AED]' : isDone ? 'text-[#0F172A]' : 'text-[#CBD5E1]',
          )}>{stage.label}</span>
        </div>
        <span className={cn('text-[10px] flex-1 truncate hidden sm:block',
          isActive ? 'text-[#7C3AED]/70' : isDone ? 'text-[#64748B]' : 'text-[#CBD5E1]',
        )}>{stage.subtitle}</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!isPending && steps.length > 0 && (
            <span className={cn('text-[8px] px-1.5 py-0.5 rounded border hidden md:inline',
              agent === 'decision' ? 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]' : 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
            )}>{stage.agentLabel} · {steps.length} 步</span>
          )}
          {isActive && (
            <span className="flex items-center gap-1 text-[8px] text-[#7C3AED]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />进行中
            </span>
          )}
          {!isPending && (open
            ? <ChevronDown size={13} className={isActive ? 'text-[#7C3AED]' : 'text-[#94A3B8]'} />
            : <ChevronRight size={13} className={isActive ? 'text-[#7C3AED]' : 'text-[#94A3B8]'} />
          )}
        </div>
      </button>

      {open && !isPending && (
        <div className="border-t border-[#E2E8F0] bg-white">
          {isAwaitHuman ? (
            <AwaitHumanContent anomaly={anomaly} />
          ) : steps.length > 0 ? (
            <div className="p-3 space-y-2">
              <div className="flex items-start gap-2 px-1 pb-1">
                <Brain size={11} className="text-[#7C3AED] flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#64748B] leading-4 italic">
                  {stage.id === 'receive' && '智能体接收到规则引擎路由请求，开始分解任务目标…'}
                  {stage.id === 'collect' && '智能体正在读取多源数据，构建分析上下文…'}
                  {stage.id === 'analyze' && '智能体对异常信号进行多维度交叉验证，排除干扰假设…'}
                  {stage.id === 'conclude' && '审核智能体对决策结论进行二次核验，输出双路径建议…'}
                </p>
              </div>
              {steps.map((step, i) => (
                <ToolCallRow key={step.step} step={step} defaultOpen={i === 0 && isActive} />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ── 子组件：等待人工协作内容 ──────────────────────────────

function AwaitHumanContent({ anomaly }: { anomaly: AgentDemoCase['anomaly'] }) {
  const [checked, setChecked] = React.useState<boolean[]>(anomaly.pendingConfirms.map(() => false));
  const toggle = (i: number) => setChecked(c => c.map((v, idx) => idx === i ? !v : v));
  return (
    <div className="p-4 space-y-3">
      <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF3] px-4 py-3 flex items-start gap-2">
        <CheckCircle2 size={14} className="text-[#047857] flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-[10px] font-semibold text-[#047857] mb-0.5">智能体建议</div>
          <p className="text-[11px] text-[#064E3B] leading-4 font-medium">{anomaly.finalRecommendation}</p>
          {anomaly.supplementRequired && (
            <div className="mt-1.5 text-[9px] text-[#C2410C] bg-[#FFF7ED] rounded px-2 py-1 border border-[#FED7AA]">
              需补充：{anomaly.supplementRequired}
            </div>
          )}
        </div>
      </div>
      <div className="text-[9px] font-semibold text-[#64748B] uppercase tracking-wide">以下事项需你确认</div>
      {anomaly.pendingConfirms.map((item, i) => (
        <div key={i}
          className={cn('flex items-start gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-all',
            checked[i] ? 'border-[#A7F3D0] bg-[#ECFDF3]' : 'border-[#E2E8F0] bg-white hover:bg-[#FAFBFF]',
          )}
          onClick={() => toggle(i)}
        >
          <div className={cn('w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
            checked[i] ? 'bg-[#047857] border-[#047857]' : 'border-[#CBD5E1]',
          )}>
            {checked[i] && <CheckCircle2 size={9} className="text-white" />}
          </div>
          <span className={cn('text-[10px] leading-4', checked[i] ? 'text-[#047857] line-through' : 'text-[#334155]')}>
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── 子组件：过程头（动态阶段文案）────────────────────────

const PROCESS_STEPS: Record<string, string[]> = {
  'agent-case-chenjihua': [
    '智能体已接手 · 正在分析公私混用疑点',
    '已读取近6个月流水、交易摘要、对手方信息',
    '已完成转账时间分布与语义交叉分析',
    '正在输出归集概率与双路径建议',
    '初判完成 · 等待人工确认',
  ],
  'agent-case-zhangweimin': [
    '智能体已接手 · 正在分析Q3现金流异常',
    '已读取季度流水、纳税记录、行业缴税周期',
    '已完成季节性模式与流出科目交叉验证',
    '正在输出评级维持建议与监控条件',
    '初判完成 · 等待人工确认',
  ],
  'agent-case-lixiufang': [
    '智能体已接手 · 正在分析客户集中度超阈值',
    '已读取合同结构、回款数据、产业链关系',
    '已完成链主绑定稳定性与替代风险评估',
    '正在输出结构性集中判断与附条件建议',
    '初判完成 · 等待人工确认',
  ],
};

function AgentProcessHeader({ c }: { c: AgentDemoCase }) {
  const steps = PROCESS_STEPS[c.id] ?? PROCESS_STEPS['agent-case-chenjihua'];
  const [stepIdx, setStepIdx] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  // 每 1.8s 切换到下一步，到最后一步后停住
  React.useEffect(() => {
    setStepIdx(0);
    setVisible(true);
    let current = 0;
    const timer = setInterval(() => {
      if (current >= steps.length - 1) {
        clearInterval(timer);
        return;
      }
      setVisible(false);
      setTimeout(() => {
        current += 1;
        setStepIdx(current);
        setVisible(true);
      }, 200);
    }, 1800);
    return () => clearInterval(timer);
  }, [c.id]);

  const isDone = stepIdx === steps.length - 1;
  const { anomaly } = c;

  return (
    <div className={cn(
      'flex-shrink-0 border-b px-5 py-3 flex items-center gap-4',
      isDone ? 'bg-[#F5F3FF] border-[#DDD6FE]' : 'bg-[#0F172A] border-[#1E293B]',
    )}>
      {/* 左：智能体标识 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center',
          isDone ? 'bg-[#7C3AED]' : 'bg-[#7C3AED]',
        )}>
          <Brain size={14} className="text-white" />
        </div>
        <div>
          <div className={cn('text-[10px] font-semibold', isDone ? 'text-[#7C3AED]' : 'text-[#94A3B8]')}>
            智能体作业
          </div>
          <div className={cn('text-[11px] font-bold leading-tight', isDone ? 'text-[#0F172A]' : 'text-white')}>
            {c.shortName} / {TRIGGER_REASON_LABEL[anomaly.triggerReason]}
          </div>
        </div>
      </div>

      {/* 中：动态阶段文案 */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <div className={cn(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          isDone ? 'bg-[#7C3AED]' : 'bg-[#4ADE80] animate-pulse',
        )} />
        <span className={cn(
          'text-[11px] font-medium transition-opacity duration-200 truncate',
          visible ? 'opacity-100' : 'opacity-0',
          isDone ? 'text-[#7C3AED]' : 'text-[#E2E8F0]',
        )}>
          {steps[stepIdx]}
        </span>
      </div>

      {/* 右：置信度 + 阶段进度点 */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1">
          {steps.map((_, i) => (
            <div key={i} className={cn(
              'rounded-full transition-all',
              i < stepIdx ? 'w-1.5 h-1.5 bg-[#4ADE80]' :
              i === stepIdx ? 'w-2 h-2 bg-[#7C3AED]' :
              'w-1 h-1 bg-[#334155]',
            )} />
          ))}
        </div>
        <div className={cn(
          'text-[10px] font-semibold px-2 py-1 rounded',
          isDone ? 'bg-[#7C3AED]/10 text-[#7C3AED]' : 'bg-[#1E293B] text-[#4ADE80]',
        )}>
          {anomaly.confidenceAfter}%
        </div>
      </div>
    </div>
  );
}


// ── 子组件：任务详情区（已选态）─────────────────────────

function TaskDetail({ c }: { c: AgentDemoCase }) {
  const risk = RISK_LEVEL_STYLE[c.riskLevel];
  const { anomaly } = c;
  const currentIdx = STAGE_ORDER.indexOf(anomaly.currentStage);
  const [openQA, setOpenQA] = React.useState<number | null>(null);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* 过程头：动态阶段文案 */}
      <AgentProcessHeader c={c} />

      {/* 主体：左主右辅 */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* 左主区：作业概览 + 推理过程 + 关键证据 */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 space-y-4">

            {/* ① 作业概览 */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className={cn('h-1', risk.bar)} />
              <div className="px-4 py-3 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-bold text-[#0F172A]">
                        对「{c.shortName}」{TRIGGER_REASON_LABEL[anomaly.triggerReason]}疑点进行辅助判定
                      </span>
                      <Badge className={cn('text-[8px] border', TRIGGER_REASON_COLOR[anomaly.triggerReason])}>
                        {TRIGGER_REASON_LABEL[anomaly.triggerReason]}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-[#64748B]">
                      {c.companyName} · {c.legalPerson} · {c.roleInChain} · {c.scene} · 申请额度 {c.requestedLimit}
                    </div>
                  </div>
                  <div className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-medium flex-shrink-0', risk.bg, risk.text, risk.border)}>
                    <div className={cn('w-1.5 h-1.5 rounded-full', risk.dot)} />
                    {risk.label}
                  </div>
                </div>
                {/* 状态行 */}
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] px-3 py-1.5 flex items-center gap-2">
                    <div className="text-[8px] text-[#7C3AED] font-semibold flex-shrink-0">当前状态</div>
                    <div className="text-[10px] font-semibold text-[#0F172A]">{c.taskStatus}</div>
                  </div>
                </div>
                {/* 建议 + 介入原因 竖排 */}
                <div className="space-y-1.5">
                  <div className="rounded-lg bg-[#ECFDF3] border border-[#A7F3D0] px-3 py-2 flex items-start gap-2">
                    <div className="text-[8px] text-[#047857] font-semibold flex-shrink-0 mt-0.5">当前建议</div>
                    <div className="text-[9px] font-semibold text-[#064E3B] leading-4 line-clamp-2 flex-1">{anomaly.agentAction}</div>
                  </div>
                  <div className="rounded-lg bg-[#FFFBEB] border border-[#FDE68A] px-3 py-2 flex items-start gap-2">
                    <div className="text-[8px] text-[#92400E] font-semibold flex-shrink-0 mt-0.5">介入原因</div>
                    <div className="text-[9px] text-[#78350F] leading-4 line-clamp-2 flex-1">{c.routeReason}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ② 推理过程（默认高亮当前阶段） */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-[#7C3AED] flex items-center justify-center">
                  <Brain size={11} className="text-white" />
                </div>
                <span className="text-[11px] font-semibold text-[#0F172A]">推理过程</span>
                <span className="text-[9px] text-[#64748B]">点击各阶段查看工具调用详情</span>
              </div>
              {PROGRESS_STAGES.map((_, i) => (
                <CotStageBlock key={i} stageIdx={i} currentIdx={currentIdx} anomaly={anomaly} />
              ))}
            </div>

            {/* ③ 关键证据（默认摘要展示） */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center gap-2">
                <Sparkles size={12} className="text-[#7C3AED]" />
                <span className="text-[11px] font-semibold text-[#0F172A]">关键证据</span>
                <span className="text-[9px] text-[#64748B] ml-1">智能体依据以下证据形成判断</span>
              </div>
              <div className="p-3 space-y-1.5">
                {anomaly.evidenceSummary.map((ev, i) => (
                  <div key={i} className={cn(
                    'flex items-start gap-2.5 rounded-lg border px-3 py-2.5',
                    ev.highlight ? 'border-[#7C3AED]/30 bg-[#F5F3FF]' : 'border-[#E2E8F0] bg-white',
                  )}>
                    <div className={cn('w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5',
                      ev.highlight ? 'bg-[#7C3AED]/10' : 'bg-[#F1F5F9]',
                    )}>
                      {EVIDENCE_ICON_MAP[ev.icon]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-[#0F172A]">{ev.label}</span>
                        {ev.highlight && <span className="text-[8px] px-1 py-0.5 rounded bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">关键</span>}
                      </div>
                      <p className="text-[10px] text-[#475569] leading-4 mt-0.5">{ev.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 右辅区：置信度变化 + 询问智能体 */}
        <div className="w-[200px] flex-shrink-0 border-l border-[#F1F5F9] overflow-y-auto bg-[#FAFBFF]">
          <div className="p-3 space-y-3">

            {/* ④ 置信度变化（辅助位，紧凑） */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-3 space-y-2">
              <div className="text-[10px] font-semibold text-[#0F172A]">置信度变化</div>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-[8px] text-[#94A3B8]">规则引擎</div>
                  <div className="text-[16px] font-bold text-[#DC2626]">{anomaly.confidenceBefore}%</div>
                </div>
                <div className="flex-1 px-2 space-y-1.5">
                  <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div className="h-full rounded-full bg-[#DC2626]" style={{ width: `${anomaly.confidenceBefore}%` }} />
                  </div>
                  <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div className="h-full rounded-full bg-[#047857]" style={{ width: `${anomaly.confidenceAfter}%` }} />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[8px] text-[#94A3B8]">智能体</div>
                  <div className="text-[16px] font-bold text-[#047857]">{anomaly.confidenceAfter}%</div>
                </div>
              </div>
              <div className="text-[8px] text-[#64748B] bg-[#F8FAFC] rounded px-2 py-1.5 leading-4">
                <span className="font-medium text-[#0F172A]">+{anomaly.confidenceAfter - anomaly.confidenceBefore}% </span>
                {anomaly.ruleGapReason.slice(0, 40)}…
              </div>
            </div>

            {/* ⑤ 询问智能体 */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-3 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center gap-1.5">
                <MessageSquare size={11} className="text-[#7C3AED]" />
                <span className="text-[10px] font-semibold text-[#0F172A]">询问智能体</span>
              </div>
              <div className="p-2 space-y-1">
                {anomaly.quickQA.map((qa, i) => (
                  <div key={i} className="rounded-lg border border-[#E2E8F0] overflow-hidden">
                    <button
                      className="w-full flex items-start gap-1.5 px-2.5 py-2 text-left hover:bg-[#FAFBFF] transition-colors"
                      onClick={() => setOpenQA(openQA === i ? null : i)}
                    >
                      <span className="text-[9px] text-[#334155] flex-1 leading-4">{qa.q}</span>
                      {openQA === i
                        ? <ChevronDown size={10} className="text-[#94A3B8] flex-shrink-0 mt-0.5" />
                        : <ChevronRight size={10} className="text-[#94A3B8] flex-shrink-0 mt-0.5" />}
                    </button>
                    {openQA === i && (
                      <div className="px-2.5 pb-2.5 pt-1 bg-[#F5F3FF]/60 border-t border-[#E2E8F0]">
                        <div className="flex items-start gap-1.5">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Brain size={7} className="text-white" />
                          </div>
                          <p className="text-[9px] text-[#334155] leading-4">{qa.a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 固定底部操作栏 */}
      <div className="flex-shrink-0 border-t border-[#E2E8F0] bg-white px-5 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
          <span>智能体初判已完成 · 置信度 {anomaly.confidenceAfter}% · 等待人工确认</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[10px] gap-1.5 border-[#E2E8F0] text-[#475569]">
            <User size={11} />转人工复核
          </Button>
          {anomaly.supplementRequired && (
            <Button variant="outline" size="sm" className="h-8 text-[10px] gap-1.5 border-[#FED7AA] text-[#C2410C]">
              <AlertTriangle size={11} />要求补充材料
            </Button>
          )}
          <Button size="sm" className="h-8 text-[10px] gap-1.5 bg-[#047857] hover:bg-[#065F46] text-white border-0">
            <CheckCircle2 size={11} />采纳建议并进入预审
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── 主组件 ────────────────────────────────────────────────

interface Props {
  activeCase?: string;
  onCaseChange?: (id: string) => void;
  activeModule?: string;
  onModuleChange?: (id: string) => void;
}

export default function AgentWorkbenchScene({ activeCase, onCaseChange, activeModule = 'agent-demo', onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'agent-workbench')!;

  // 未选择任务时为 null（空状态）
  const [selectedId, setSelectedId] = React.useState<string | null>(activeCase ?? null);

  const selectedCase = selectedId ? AGENT_DEMO_CASES.find(c => c.id === selectedId) ?? null : null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onCaseChange?.(id);
  };

  // 统计数据
  const totalTasks = AGENT_DEMO_CASES.length;
  const awaitHuman = AGENT_DEMO_CASES.filter(c => c.anomaly.currentStage === 'await_human').length;
  const highRisk = AGENT_DEMO_CASES.filter(c => c.riskLevel === 'high').length;

  return (
    <SceneLayout
      title={scene.title}
      modules={scene.modules}
      activeModule={activeModule}
      onModuleChange={onModuleChange ?? (() => {})}
      pageSubtitleOverride="规则引擎处理确定性，智能体处理模糊性 — 分工协作，不是替代"
    >
      <div className="flex flex-col h-full overflow-hidden">

        {/* 页面头部：作业台统计 */}
        <div className="flex-shrink-0 px-5 py-3 border-b border-[#F1F5F9] bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-[#7C3AED] flex items-center justify-center">
                <Brain size={11} className="text-white" />
              </div>
              <span className="text-[12px] font-bold text-[#0F172A]">智能体作业台</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
              <span>今日待处理 <span className="font-semibold text-[#0F172A]">{totalTasks}</span> 项</span>
              <span className="text-[#E2E8F0]">|</span>
              <span>待人工确认 <span className="font-semibold text-[#7C3AED]">{awaitHuman}</span> 项</span>
              {highRisk > 0 && (
                <>
                  <span className="text-[#E2E8F0]">|</span>
                  <span>高风险 <span className="font-semibold text-[#DC2626]">{highRisk}</span> 项</span>
                </>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1.5 border-[#E2E8F0] text-[#64748B]">
            <Filter size={10} />筛选
          </Button>
        </div>

        {/* 主体：左侧任务列表 + 右侧详情区 */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* 左侧任务列表（固定宽度） */}
          <div className="w-[240px] flex-shrink-0 border-r border-[#F1F5F9] overflow-y-auto bg-[#FAFBFF] p-3 space-y-2">
            <div className="text-[9px] font-semibold text-[#94A3B8] uppercase tracking-wide px-1 pb-1">
              待处理任务 · {totalTasks} 项
            </div>
            {AGENT_DEMO_CASES.map(c => (
              <TaskCard
                key={c.id}
                c={c}
                selected={selectedId === c.id}
                onClick={() => handleSelect(c.id)}
              />
            ))}
          </div>

          {/* 右侧详情区 */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            {selectedCase ? (
              <TaskDetail c={selectedCase} />
            ) : (
              <EmptyDetail />
            )}
          </div>

        </div>
      </div>
    </SceneLayout>
  );
}

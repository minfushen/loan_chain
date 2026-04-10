import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CHART_COLORS = {
  blue: '#2563EB',
  sky: '#38BDF8',
  violet: '#7C3AED',
  emerald: '#059669',
  amber: '#D97706',
  red: '#DC2626',
  slate: '#64748B',
};

const PALETTE = [
  CHART_COLORS.blue,
  CHART_COLORS.violet,
  CHART_COLORS.emerald,
  CHART_COLORS.amber,
  CHART_COLORS.red,
  CHART_COLORS.sky,
];

const tooltipStyle = {
  contentStyle: {
    background: '#0F172A',
    border: 'none',
    borderRadius: 8,
    fontSize: 11,
    color: '#F1F5F9',
    padding: '6px 10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  itemStyle: { color: '#CBD5E1', fontSize: 11 },
  labelStyle: { color: '#94A3B8', fontSize: 10, marginBottom: 2 },
};

interface MiniAreaProps {
  data: { name: string; value: number }[];
  color?: string;
  height?: number;
}

export function MiniAreaChart({ data, color = CHART_COLORS.blue, height = 48 }: MiniAreaProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#grad-${color.replace('#', '')})`}
          dot={false}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface DistributionBarProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
}

export function DistributionBarChart({ data, height = 180 }: DistributionBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={36} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={600}>
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={entry.color || PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface TrendLineProps {
  data: { name: string; [key: string]: string | number }[];
  lines: { key: string; color: string; label: string; dashed?: boolean }[];
  height?: number;
}

export function TrendLineChart({ data, lines, height = 200 }: TrendLineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={36} />
        <Tooltip {...tooltipStyle} />
        <Legend
          verticalAlign="top"
          align="right"
          height={28}
          iconType="circle"
          iconSize={6}
          wrapperStyle={{ fontSize: 10, color: '#64748B' }}
        />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.label}
            stroke={l.color}
            strokeWidth={l.dashed ? 1.5 : 2}
            strokeDasharray={l.dashed ? '6 3' : undefined}
            dot={{ r: 2, fill: l.color }}
            activeDot={{ r: 4, strokeWidth: 0 }}
            animationDuration={700}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

interface DonutProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, height = 180, innerRadius = 46, outerRadius = 70, centerLabel, centerValue }: DonutProps) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            animationDuration={600}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={entry.color || PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold text-[#0F172A]">{centerValue}</span>
          <span className="text-[10px] text-[#94A3B8]">{centerLabel}</span>
        </div>
      )}
    </div>
  );
}

interface StageFlowProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
}

export function StageFunnelChart({ data, height = 200 }: StageFlowProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} width={72} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={600}>
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={entry.color || PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export { CHART_COLORS, PALETTE };

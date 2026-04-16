import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend, Cell,
} from 'recharts';
import {
  InsightSection, SectionTitle, MetricCard, CMCell, StatCard, ChartTooltip,
} from '../components/cards';
import { TabButton, BadgePill, RankBadge } from '../components/buttons';

// ─── Mock Data (swap with API responses) ──────────────────────────────────────

const performanceMetrics = [
  { label: 'Accuracy',  value: 94.2, color: '#246957', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '🎯' },
  { label: 'Precision', value: 91.8, color: '#2B638A', bg: 'bg-blue-50',    text: 'text-blue-700',    icon: '🔍' },
  { label: 'Recall',    value: 89.5, color: '#8B9659', bg: 'bg-lime-50',    text: 'text-lime-700',    icon: '📡' },
  { label: 'F1 Score',  value: 90.6, color: '#C1CD8A', bg: 'bg-yellow-50',  text: 'text-yellow-700',  icon: '⚡' },
];

const latencyData = [
  { time: '0s',  p50: 12, p90: 28, p99: 45 },
  { time: '10s', p50: 15, p90: 32, p99: 52 },
  { time: '20s', p50: 11, p90: 25, p99: 41 },
  { time: '30s', p50: 18, p90: 38, p99: 60 },
  { time: '40s', p50: 13, p90: 29, p99: 47 },
  { time: '50s', p50: 16, p90: 35, p99: 55 },
  { time: '60s', p50: 10, p90: 22, p99: 38 },
];

const latencySummary = [
  { label: 'P50 Median', value: '13ms',    colorClass: 'bg-lime-50 text-lime-700 border-lime-200' },
  { label: 'P90 Tail',   value: '30ms',    colorClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: 'P99 Worst',  value: '48ms',    colorClass: 'bg-red-50 text-red-700 border-red-200' },
  { label: 'SLA Target', value: '< 100ms', colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

const featureData = [
  { feature: 'Age',          importance: 0.34 },
  { feature: 'Income',       importance: 0.28 },
  { feature: 'Credit Score', importance: 0.21 },
  { feature: 'Tenure',       importance: 0.17 },
  { feature: 'Balance',      importance: 0.13 },
  { feature: 'Products',     importance: 0.09 },
  { feature: 'Activity',     importance: 0.07 },
];

// Confusion matrix: rows = Actual, cols = Predicted  [TN, FP] / [FN, TP]
const confusionMatrix = [[850, 42], [36, 917]];
const cmLabels = ['Negative', 'Positive'];

const cmStats = [
  { label: 'True Negatives',  value: '850', desc: 'Correctly predicted Negative',        valueColor: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  { label: 'True Positives',  value: '917', desc: 'Correctly predicted Positive',        valueColor: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  { label: 'False Positives', value: '42',  desc: 'Predicted Positive, actually Negative', valueColor: 'text-red-600',    bg: 'bg-red-50 border-red-200' },
  { label: 'False Negatives', value: '36',  desc: 'Predicted Negative, actually Positive', valueColor: 'text-red-600',    bg: 'bg-red-50 border-red-200' },
];

const aiReview = {
  headline:    'Model is performing well with minor precision gaps.',
  summary:     'Your Random Forest model achieved 94.2% accuracy on the validation set. Recall at 89.5% suggests some true positives are being missed — consider lowering the classification threshold or adding SMOTE oversampling to address class imbalance. Feature leakage risk is low. Latency spikes around the 30s mark may indicate memory pressure under batch inference.',
  suggestions: [
    { icon: '⚠️', text: 'Lower decision threshold from 0.5 → 0.4 to improve Recall.' },
    { icon: '🔄', text: 'Apply SMOTE on minority class to reduce false negatives.' },
    { icon: '🚀', text: 'Prune low-importance features (Products, Activity) to cut inference time.' },
    { icon: '📊', text: 'Monitor p99 latency — spikes exceed 55ms which may affect SLA.' },
  ],
  verdict: 'Healthy',
};

// ─── Custom Tooltips ──────────────────────────────────────────────────────────

const LatencyTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltip>
      <p className="font-bold text-neutral-700 mb-1">t = {label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}ms</span>
        </p>
      ))}
    </ChartTooltip>
  );
};

const FeatureTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <ChartTooltip>
      <p className="font-bold text-neutral-700">{payload[0]?.payload?.feature}</p>
      <p className="text-primary">
        Importance: <span className="font-semibold">{(payload[0]?.value * 100).toFixed(1)}%</span>
      </p>
    </ChartTooltip>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Insights() {
  const [activeTab, setActiveTab] = useState<'p50' | 'p90' | 'p99'>('p90');

  return (
    <div className="h-full overflow-auto bg-background p-4 md:p-8 font-sans space-y-8">

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">
            Model <span className="text-primary italic">Insights</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Random Forest · Last diagnosed 2 hours ago · v1.4.2
          </p>
        </div>
        <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
          Live Data
        </span>
      </div>

      {/* ── Section 1: Performance Metrics ── */}
      <InsightSection>
        <SectionTitle title="Model Performance" subtitle="Evaluated on held-out validation set (n = 1,845)" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {performanceMetrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </InsightSection>

      {/* ── Section 2: Latency ── */}
      <InsightSection>
        <div className="flex items-start justify-between mb-5">
          <SectionTitle title="Inference Latency" subtitle="Milliseconds over last 60 seconds of production traffic" />
          <div className="flex gap-1">
            {(['p50', 'p90', 'p99'] as const).map((t) => (
              <TabButton
                key={t}
                label={t.toUpperCase()}
                active={activeTab === t}
                onClick={() => setActiveTab(t)}
              />
            ))}
          </div>
        </div>

        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} unit="ms" />
              <Tooltip content={<LatencyTooltip />} />
              {[
                { key: 'p50', name: 'P50', stroke: '#C1CD8A' },
                { key: 'p90', name: 'P90', stroke: '#2B638A' },
                { key: 'p99', name: 'P99', stroke: '#e11d48' },
              ].map(({ key, name, stroke }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={name}
                  stroke={stroke}
                  strokeWidth={activeTab === key ? 3 : 1.5}
                  dot={false}
                  strokeOpacity={activeTab === key ? 1 : 0.35}
                />
              ))}
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {latencySummary.map((p) => (
            <BadgePill key={p.label} {...p} />
          ))}
        </div>
      </InsightSection>

      {/* ── Section 3: Top Feature Importance ── */}
      <InsightSection>
        <SectionTitle
          title="Top Feature Importance"
          subtitle="Relative contribution of each feature to model predictions (SHAP-based)"
        />
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={featureData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }} width={80} />
              <Tooltip content={<FeatureTooltip />} />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {featureData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#246957" fillOpacity={1 - index * 0.1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {featureData.slice(0, 3).map((f, i) => (
            <RankBadge
              key={f.feature}
              rank={i + 1}
              name={f.feature}
              pct={(f.importance * 100).toFixed(0)}
            />
          ))}
        </div>
      </InsightSection>

      {/* ── Section 4: Confusion Matrix ── */}
      <InsightSection>
        <SectionTitle title="Confusion Matrix" subtitle="Actual vs. Predicted classes on validation set" />
        <div className="flex flex-col md:flex-row gap-6 items-start">

          {/* Matrix grid */}
          <div className="w-full md:w-auto">
            <div className="flex gap-3 mb-2 ml-24">
              {cmLabels.map((l) => (
                <div key={l} className="w-32 text-center text-xs font-semibold text-neutral-500">
                  Predicted<br /><span className="text-neutral-800">{l}</span>
                </div>
              ))}
            </div>
            {confusionMatrix.map((row, ri) => (
              <div key={ri} className="flex items-center gap-3 mb-3">
                <div className="w-24 text-right text-xs font-semibold text-neutral-500">
                  Actual<br /><span className="text-neutral-800">{cmLabels[ri]}</span>
                </div>
                {row.map((val, ci) => (
                  <div key={ci} className="w-32">
                    <CMCell value={val} isCorrect={ri === ci} rowLabel={cmLabels[ri]} colLabel={cmLabels[ci]} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Matrix stat cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cmStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </InsightSection>

      {/* ── Section 5: AI Review ── */}
      <section className="rounded-2xl border border-primary/20 shadow-sm overflow-hidden">
        {/* Header bar */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">🤖</div>
            <div>
              <p className="text-white font-bold text-sm">Dr. Cozy AI Review</p>
              <p className="text-white/60 text-xxs">Automated diagnosis · Powered by CozyML Intelligence</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            aiReview.verdict === 'Healthy'
              ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30'
              : 'bg-red-400/20 text-red-200 border-red-400/30'
          }`}>
            {aiReview.verdict === 'Healthy' ? '✓' : '⚠'} {aiReview.verdict}
          </span>
        </div>

        {/* Body */}
        <div className="bg-white px-6 py-5 space-y-5">
          <div>
            <p className="text-sm font-bold text-neutral-800 italic">"{aiReview.headline}"</p>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{aiReview.summary}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-neutral-700 mb-3 uppercase tracking-wide">Recommendations</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiReview.suggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-primary/30 hover:bg-emerald-50/40 transition-colors duration-200"
                >
                  <span className="text-base flex-shrink-0">{s.icon}</span>
                  <p className="text-xs text-neutral-700 leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xxs text-neutral-400 border-t border-neutral-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Analysis generated 2 hours ago · Not a substitute for expert evaluation
          </div>
        </div>
      </section>

    </div>
  );
}

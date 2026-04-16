import React, { ComponentClass, ReactNode } from 'react'
import { ReactComponent as LightBulb } from '../assets/lightbulb.svg';
import { ChevronDown } from 'lucide-react';
import { useCollapsibleItemStore, useSelectedModelStore } from '../store/ui.store';

interface TipCardProps {
  heading: string;
  description: string;
}

interface DiagnosisParameterProps {
  heading: string;
  models: string[];
}

interface SubCardProps {
  svg: ReactNode;
  heading: string;
  description: string;
}

interface CollabsableCardProps {
  
}

export default function TipCard({heading, description}: TipCardProps  ) {
  return (
    <div className='w-full p-4 flex flex-col justify-center gap-2 rounded-lg bg-secondaryBackground/40 text-sm font-semibold shadow-sm'>
      <LightBulb className='w-6 h-6 text-primary' />
      <h3 className='text-sm font-bold'>{heading}</h3>
      <p className='text-xs mt-2'>{description}</p>
    </div>
  )
}

export function DiagnosisCard({heading, models}: DiagnosisParameterProps) {
  const isCollapsed = useCollapsibleItemStore((state) => state.isCollapsed);
  const setCollapsed = useCollapsibleItemStore((state) => state.setCollapsed);
  const selectedModel = useSelectedModelStore((state) => state.selectedModel);
  const setSelectedModel = useSelectedModelStore((state) => state.setSelectedModel);

  return (
    <div className='w-full p-4 flex flex-col gap-3 rounded-lg bg-neutral-100 text-sm text-left font-semibold shadow-sm relative'>
      <h3 className='text-sm text-neutral-700 font-bold'>{heading}</h3>
      
      <div className='flex flex-col gap-1'>
        <span className='text-xs text-neutral-500 italic'>Model Architecture:</span>
        
        {/* The Trigger Button */}
        <button 
          onClick={() => setCollapsed(!isCollapsed)}
          className='flex items-center justify-between w-full bg-white border border-neutral-200 p-2 rounded-md text-xs text-neutral-800'
        >
          {selectedModel}
          <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>

        {/* The Collapsible Scrollable List */}
        {isCollapsed && (
          <div className='absolute left-4 right-4 top-[calc(100%-10px)] z-10 mt-1 bg-white border border-neutral-200 rounded-md shadow-lg max-h-40 overflow-y-auto custom-scrollbar'>
            {models.map((model, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedModel(model);
                  setCollapsed(false);
                }}
                className={`px-3 py-2 text-xs cursor-pointer hover:bg-emerald-50 hover:text-primary transition-colors
                  ${selectedModel === model ? 'bg-emerald-50 text-primary' : 'text-neutral-600'}
                `}
              >
                {model}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function SubCard({svg , heading, description}: SubCardProps) {
  return (
    <div className='w-full p-4 flex flex-col items-start gap-3 rounded-lg 
     font-semibold shadow-sm'>
      {svg}
      <h3 className='text-sm font-bold'>{heading}</h3>
      <p className='text-xs mt-2'>{description}</p>
    </div>
  )
}

// ─── Insight Primitives ───────────────────────────────────────────────────────

/** White card wrapper used for every section on the Insights page */
export function InsightSection({ children, className = '', noPad = false }: { children: ReactNode; className?: string; noPad?: boolean }) {
  return (
    <section className={`bg-white rounded-2xl border border-neutral-100 shadow-sm ${noPad ? '' : 'p-6'} ${className}`}>
      {children}
    </section>
  );
}

/** Heading + optional subtitle at the top of each InsightSection */
export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-neutral-800">{title}</h2>
      {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

/** Animated SVG ring gauge card for performance metrics */
export function MetricCard({ label, value, color, bg, text, icon }: { label: string; value: number; color: string; bg: string; text: string; icon: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl p-5 border border-neutral-100 shadow-sm bg-white">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-3 ${bg}`}>
        {icon}
      </div>
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15.915" fill="none"
            stroke={color} strokeWidth="3"
            strokeDasharray={`${value} ${100 - value}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-neutral-800">{value}</span>
          <span className="text-xxs text-neutral-400">%</span>
        </div>
      </div>
      <p className={`mt-3 text-xs font-semibold ${text}`}>{label}</p>
    </div>
  );
}

/** Single cell of a confusion matrix — green for correct, red for error */
export function CMCell({ value, isCorrect, rowLabel, colLabel }: { value: number; isCorrect: boolean; rowLabel: string; colLabel: string }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl p-4 border ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
      <span className="text-2xl font-bold">{value.toLocaleString()}</span>
      <span className="text-xxs mt-1 text-center font-medium opacity-70">
        Actual: {rowLabel}<br />Pred: {colLabel}
      </span>
      <span className={`mt-2 text-xxs font-semibold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-700'}`}>
        {isCorrect ? '✓ Correct' : '✗ Error'}
      </span>
    </div>
  );
}

/** Stat summary card used in the confusion matrix side panel */
export function StatCard({ label, value, desc, valueColor, bg }: { label: string; value: string; desc: string; valueColor: string; bg: string }) {
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs font-semibold text-neutral-700 mt-0.5">{label}</p>
      <p className="text-xxs text-neutral-500 mt-1 leading-tight">{desc}</p>
    </div>
  );
}

/** Shared tooltip shell — wraps children for consistent recharts custom tooltips */
export function ChartTooltip({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-md px-4 py-3 text-xs">
      {children}
    </div>
  );
}



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


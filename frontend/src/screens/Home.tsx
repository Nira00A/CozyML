import React from 'react'
import TipCard, { DiagnosisCard } from '../components/cards'
import StandardButton from '../components/buttons'
import Dropdown from '../components/dropdown'
import {ReactComponent as Graph} from '../assets/finance_mode.svg';
import api from '../api/axios';

export default function DashboardScreen() {
  // const handleFileUpload = (file: File) => {
  //   // Implement the logic to upload the file to the backend
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   const response = api.post('/upload', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  // };

  return (
    <div className="h-full overflow-auto bg-background p-3 md:p-8 font-sans">
        <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:basis-3/4">
                <h2 className="text-4xl font-bold mb-4">
                  <span className='text-neutral-700'>Begin your model</span>
                  <span className="text-primary italic"> wellness check.</span>
                </h2>
                <p className="text-gray-600 mb-6 text-sm">Upload your performance metrics and let CozyML analyze them for you. Identify potential issues before they become problems in your ML model. </p>

                <Dropdown />
            </div>

            <div className="lg:basis-1/4 flex flex-col gap-4">
              <TipCard 
              heading='Pro Tip: Data Hygiene'
              description='Ensure your Csv uses UTF-8 encoding and includes
              timestamp for the most accurate drift analysis.'/>

              <DiagnosisCard
                heading='Supported Models'
                models={['Random Forest', 'XGBoost', 'Neural Networks', 'SVM']}
              />

              <StandardButton 
                text='Start Diagnosis' 
                color='bg-primary hover:bg-green-600' 
                padding='px-6 py-4' 
                textSize='text-sm' 
              />
            </div>

        </div>

        <div className='w-full flex lg:flex-row flex-col gap-3 mt-5'>
          {[
            { title: "Item 1", description: "Description for Item 1", svg: Graph, color: "bg-blue-100 text-blue-600" }, 
            { title: "Item 2", description: "Description for Item 2", svg: Graph, color: "bg-emerald-100 text-emerald-600" },
            { title: "Item 3", description: "Description for Item 3", svg: Graph, color: "bg-purple-100 text-purple-600" }
          ].map((item) => {
            const Icon = item.svg;
            return (
              <div className='flex flex-1 flex-row items-center gap-3 bg-white p-3 rounded-xl border border-neutral-100 shadow-sm' key={item.title}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className='flex flex-col'>
                  <p className='text-sm font-bold text-neutral-800'>{item.title}</p>
                  <p className='text-xs text-neutral-500 leading-tight'>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
    </div>
  )
}

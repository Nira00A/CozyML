import React from 'react'
import { useDragStateStore, useFileUploadStateStore } from '../store/ui.store';
import { ReactComponent as UploadIcon } from '../assets/cloud_upload.svg';
import { SecondaryButton } from './buttons';

export default function Dropdown() {
    const isDragging = useDragStateStore((state) => state.isDragging);
    const setDragging = useDragStateStore((state) => state.setDragging);
    const setFileUploaded = useFileUploadStateStore((state) => state.setFileUploaded);

    const HandleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(true);
    }

    const HandleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);
    }

    const HandleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragging(false);

        const files = event.dataTransfer.files;
        
        if (files && files.length > 0) {
            // Handle the uploaded files here
            console.log(files);
        }
   }

  return (
    <div 
        className={`flex flex-col gap-1 py-[68px] justify-center items-center w-full rounded-lg border border-dotted transition-colors duration-200 ${isDragging ? 'bg-emerald-50 border-emerald-500' : 'bg-gray-100 border-text'}`}
        onDragOver={HandleDragOver}
        onDragLeave={HandleDragLeave}
        onDrop={HandleDrop}
    >
        <div className='w-14 h-14 mb-6 flex justify-center items-center bg-white rounded-full'>
            <UploadIcon color='green' className='w-1/2 h-1/2 text-primary' />
        </div>
        <p className='text-sm font-semibold text-neutral-700'>Drag and drop your CSV file here</p>
        <p className='text-xs text-gray-500'>Accpts CSV , Json and Excel files (Max 20 MB)</p>
        
        <div className='relative'>
            <SecondaryButton text="Browse Files" />
            <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/json"
                className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                onChange={(event) => {
                    const uploadedFiles = event.target.files;
                    
                    // 2. USE THE EXTRACTED FUNCTION HERE
                    setFileUploaded(uploadedFiles && uploadedFiles.length > 0 ? uploadedFiles[0] : null);
                    
                    if (uploadedFiles && uploadedFiles.length > 0) {
                        // Handle the uploaded files here
                        console.log("File Selected via Click:", uploadedFiles[0]);
                    }
                }}
            />
        </div>
    </div>
  )
}
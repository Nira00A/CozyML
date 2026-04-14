import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import './index.css'
import Sidebar from './components/sidebar'

export default function GlobalLayout() {
  return (
    <div className='flex flex-col h-screen w-screen bg-background text-text'>
        <div className='w-full'>
            <Header />
        </div>
        <div className="flex flex-row h-screen w-full overflow-hidden">
          <div className="w-[250px] h-full border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <Sidebar />
          </div>

          <div className="w-full h-full overflow-y-auto bg-white">
            <Outlet />
          </div>
        </div>
      </div>
  )
}

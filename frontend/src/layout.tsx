import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './screens/Header'
import './index.css'

export default function GlobalLayout() {
  return (
    <div className='flex flex-col h-screen w-screen bg-background text-text'>
        <div className='w-full'>
            <Header />
        </div>
        <div className='flex-1 w-full'>
            <Outlet />
        </div>
    </div>
  )
}

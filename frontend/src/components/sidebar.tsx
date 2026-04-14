import { useActiveSidebarStore } from '../store/ui.store';
import { ReactComponent as AddCicle } from '../assets/add_circle.svg';
import { ReactComponent as RecentChecks } from '../assets/history.svg';
import { ReactComponent as Settings } from '../assets/settings.svg';

export default function Sidebar() {
    const activeTab = useActiveSidebarStore((state) => state.activeItem);
    const setActiveTab = useActiveSidebarStore((state) => state.setActiveItem);

  return (
    <div className='flex flex-col h-full bg-neutral-100 p-4 gap-8'>
        <div className='flex flex-row items-center text-lg font-semibold text-primary'>
            <img src="/assets/icons/dashboard.svg" alt="dashboard" className='w-5 h-5 mr-2' />

            <div className='flex flex-col text-sm'>
                <span>Dr Cozy</span>
                <span className='text-xs text-gray-500'>Clinical Lab Alpha</span>
            </div>
        </div>

        <div className='flex flex-col gap-1 text-sm font-semibold'>
            {[{name: "New Scan" , icon: AddCicle} , {name: "Recent Checks", icon: RecentChecks} , {name: "Settings", icon: Settings}].map((item, index) => {
                const Icon = item.icon;
                return (
                <div 
                    key={index} 
                    className={`flex flex-row text-xs items-center gap-4 cursor-pointer transition-colors duration-300 
                        p-3 rounded-xl
                        ${activeTab === item.name ? "text-primary shadow-sm bg-white" : "text-neutral-500 hover:text-primary"
                    }`}
                    onClick={() => setActiveTab(item.name)}
                >
                    <Icon className={`w-4 h-4 ${activeTab === item.name ? "text-primary" : "text-neutral-500"}`} />
                    <span>{item.name}</span>
                </div>
            )})}
        </div>
    </div>
  )
}

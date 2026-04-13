import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useActiveTabStore } from "../store/ui.store";

export default function Header() {
  const location = useLocation()
  const activeTab = useActiveTabStore((state) => state.activeTab);
  const setActiveTab = useActiveTabStore((state) => state.setActiveTab);

  useEffect(() => {
    const path = location.pathname === "/" ? "dashboard" : location.pathname.slice(1);
    setActiveTab(path);
  }, [location.pathname, setActiveTab]);

  return (
    <div className="bg-background text-2xl">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-4 p-4">
          <span className="font-bold mr-10 text-primary text-2xl">CozyML</span>

          {[{"name": "dashboard", "to": "/"}, {"name": "insights", "to": "/insights"}, {"name": "history", "to": "/history"}].map((item) => (
            <Link
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              to={item.to}
              className={`relative pb-1 group text-base font-semibold transition-colors duration-300
                ${activeTab === item.name 
                  ? "text-primary"   
                  : "text-text hover:text-primary" 
                }`}
            >
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              <span 
                className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full
                ${activeTab === item.name ? "w-full" : "w-0"}`}
              ></span>
            </Link>
          ))}
        </div>
        <div className="flex flex-row items-center gap-4 p-4">
          <button className="bg-primary text-background hover:bg-primary/90 text-base font-semibold px-2 rounded-full transition-colors duration-300">
            ?
          </button>
        </div>
      </div>
    </div>
  );
}

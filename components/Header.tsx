import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">InsurClear</h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">AI-Powered Policy Analyst</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it works</a>
             <button className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-slate-800 transition-colors">
                Support
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

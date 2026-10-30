import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';

export default function Header({ pageTitle, onLaunchPos }) {
  const { role, user, logout } = useAuth();
  const { settings } = useInventory();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-20">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{pageTitle}</h1>
        <span className="text-slate-300">|</span>
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Store: <b className="text-slate-700">{settings.name}</b></span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User Info Badge (Clean & Non-editable) */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-slate-800 leading-tight">{user?.name || 'User'}</div>
            <div className="text-[10px] text-slate-500 capitalize">{role}</div>
          </div>
        </div>

        {/* Quick Launch POS Button */}
        {role !== 'manager' && (
          <button
            onClick={onLaunchPos}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all">
            <span>⚡ Launch POS (F2)</span>
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign Out"
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-xs font-semibold border border-slate-200 transition-colors">
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}

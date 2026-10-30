import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register, quickLogin, isLoading, authError } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('cashier');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'login') {
      if (!email || !password) {
        setErrorMessage('Please enter both email and password.');
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.message || 'Invalid credentials');
      }
    } else {
      if (!name || !email || !password) {
        setErrorMessage('Please complete all required fields.');
        return;
      }
      const res = await register(name, email, password, role);
      if (!res.success) {
        setErrorMessage(res.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Decorative ambient background blur lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 text-white font-black text-2xl shadow-xl shadow-indigo-500/25 mb-3">
          ⚡
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          ApexStock
          <span className="text-[10px] uppercase font-mono font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">
            PRO
          </span>
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Smart Inventory & POS Billing Management System
        </p>
      </div>

      {/* Main Card Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="flex bg-slate-900/80 p-1 rounded-xl mb-6 border border-slate-700/60">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}>
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}>
              Create Account
            </button>
          </div>

          {/* Error Message Box */}
          {(errorMessage || authError) && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage || authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@apexstock.com"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Password *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Demo accounts use default password: password123')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 text-xs">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select User Role *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cashier', label: 'Cashier' },
                    { id: 'manager', label: 'Manager' },
                    { id: 'admin', label: 'Admin' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                        role === r.id
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-bold'
                          : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-xs transition-all disabled:opacity-60">
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <span>{mode === 'login' ? 'Sign In to Workspace' : 'Create & Access Account'}</span>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login Section */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              ⚡ Instant 1-Click Demo Access
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => quickLogin('admin')}
                className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-700 hover:border-indigo-500/50 text-slate-300 hover:text-white flex flex-col items-center gap-1 transition-all">
                <span className="text-base">👑</span>
                <span className="font-bold text-[11px]">Admin</span>
                <span className="text-[9px] text-slate-500">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('cashier')}
                className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white flex flex-col items-center gap-1 transition-all">
                <span className="text-base">💳</span>
                <span className="font-bold text-[11px]">Cashier</span>
                <span className="text-[9px] text-slate-500">POS Billing</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('manager')}
                className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-white flex flex-col items-center gap-1 transition-all">
                <span className="text-base">📦</span>
                <span className="font-bold text-[11px]">Manager</span>
                <span className="text-[9px] text-slate-500">Inventory</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-4 text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <span>🔒 Secured with JWT & MongoDB</span>
          <span>&bull;</span>
          <span>Role-Based Access Control</span>
        </div>
      </div>
    </div>
  );
}

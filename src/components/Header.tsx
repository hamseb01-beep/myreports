import React from 'react';
import { StaffUser } from '../types';
import { STAFF_USERS } from '../data/sampleData';
import { Stethoscope, FlaskConical, Calculator, Plus, RotateCcw, ShieldCheck } from 'lucide-react';
import { ClinicLogo } from './ClinicLogo';

interface HeaderProps {
  currentUser: StaffUser;
  onSelectUser: (user: StaffUser) => void;
  onOpenNewScan: () => void;
  onOpenCalculators: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  onOpenNewScan,
  onOpenCalculators,
  onResetData,
}) => {
  return (
    <header className="bg-gradient-to-r from-[#0a6b2f] via-[#0e8f3e] to-[#0a6b2f] text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Clinic Brand */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0">
              <ClinicLogo variant="emerald" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg leading-tight tracking-wide font-sans">BEERGEEL CLINIC</h1>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold text-emerald-100 hidden md:inline-block">
                  OBGYN & Lab Center
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium">
                Obstetrics, Gynecology & Ultrasound Reporting System
              </p>
            </div>
          </div>

          {/* Controls & Role Selection */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            
            {/* Calculators Button */}
            <button
              onClick={onOpenCalculators}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
              title="Open OBGYN Clinical Calculators"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">OBGYN</span> Calculators
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs px-2.5 py-1.5 rounded-lg transition-all"
              title="Reset sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Role Switcher Select */}
            <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-white/30 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const user = STAFF_USERS.find((u) => u.id === e.target.value);
                  if (user) onSelectUser(user);
                }}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer pr-1"
              >
                {STAFF_USERS.map((u) => (
                  <option key={u.id} value={u.id} className="text-slate-900 bg-white font-sans">
                    {u.name} ({u.role === 'doctor' ? 'OBGYN Doctor' : 'Lab Tech'})
                  </option>
                ))}
              </select>
            </div>

            {/* Action for Doctor */}
            {currentUser.role === 'doctor' && (
              <button
                onClick={onOpenNewScan}
                className="flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-950 text-white border border-emerald-400/40 font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 text-emerald-300" />
                <span>New Patient Scan</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { calculateGAAndEDDFromLMP, calculateHadlockEFW, calculateTwinDiscordance, calculateBPPScore } from '../utils/calculators';
import { X, Calculator, Calendar, Scale, Users, Activity, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface CalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorsModal: React.FC<CalculatorsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'lmp' | 'efw' | 'discordance' | 'bpp'>('lmp');

  // Tab 1: LMP Calculator
  const [lmpInput, setLmpInput] = useState('');
  const lmpResult = calculateGAAndEDDFromLMP(lmpInput);

  // Tab 2: Hadlock EFW
  const [bpd, setBpd] = useState('');
  const [hc, setHc] = useState('');
  const [ac, setAc] = useState('');
  const [fl, setFl] = useState('');
  const efwResult = calculateHadlockEFW(
    parseFloat(bpd),
    parseFloat(hc),
    parseFloat(ac),
    parseFloat(fl)
  );

  // Tab 3: Twin Discordance
  const [efwA, setEfwA] = useState('');
  const [efwB, setEfwB] = useState('');
  const discordanceResult = calculateTwinDiscordance(parseFloat(efwA), parseFloat(efwB));

  // Tab 4: BPP Score
  const [breathing, setBreathing] = useState<number>(2);
  const [movement, setMovement] = useState<number>(2);
  const [tone, setTone] = useState<number>(2);
  const [afScore, setAfScore] = useState<number>(2);
  const bppResult = calculateBPPScore(breathing, movement, tone, afScore);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d2350] to-[#132a5e] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base tracking-wide">OBGYN Clinical Calculators</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('lmp')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'lmp'
                ? 'border-emerald-600 text-emerald-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            LMP / GA & EDD
          </button>
          <button
            onClick={() => setActiveTab('efw')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'efw'
                ? 'border-emerald-600 text-emerald-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-600" />
            Hadlock EFW
          </button>
          <button
            onClick={() => setActiveTab('discordance')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'discordance'
                ? 'border-emerald-600 text-emerald-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            Twin Discordance %
          </button>
          <button
            onClick={() => setActiveTab('bpp')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition-colors shrink-0 ${
              activeTab === 'bpp'
                ? 'border-emerald-600 text-emerald-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            BPP Score
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-4">

          {/* TAB 1: LMP / GA & EDD */}
          {activeTab === 'lmp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Menstrual Period (LMP) Date
                </label>
                <input
                  type="date"
                  value={lmpInput}
                  onChange={(e) => setLmpInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {lmpResult ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs text-emerald-800 font-medium">
                    <span>Gestational Age Today:</span>
                    <span className="text-base font-bold text-emerald-900">{lmpResult.formattedGA}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-emerald-800 font-medium">
                    <span>Estimated Date of Delivery (EDD):</span>
                    <span className="text-base font-bold text-emerald-900">{lmpResult.eddDate}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Select a valid LMP date above to calculate current Gestational Age and Estimated Date of Delivery.
                </p>
              )}
            </div>
          )}

          {/* TAB 2: Hadlock EFW */}
          {activeTab === 'efw' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Enter biometry measurements in <strong>centimeters (cm)</strong> using the 4-parameter Hadlock formula.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">BPD (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 7.2"
                    value={bpd}
                    onChange={(e) => setBpd(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">HC (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 26.5"
                    value={hc}
                    onChange={(e) => setHc(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">AC (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 24.1"
                    value={ac}
                    onChange={(e) => setAc(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">FL (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 5.3"
                    value={fl}
                    onChange={(e) => setFl(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {efwResult !== null ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-emerald-800 font-medium uppercase tracking-wider">Estimated Fetal Weight (Hadlock)</p>
                  <p className="text-2xl font-black text-emerald-900 mt-1">{efwResult} grams</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">({(efwResult / 1000).toFixed(2)} kg)</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Enter BPD, HC, AC, and FL in cm to calculate Hadlock EFW.</p>
              )}
            </div>
          )}

          {/* TAB 3: Twin Discordance */}
          {activeTab === 'discordance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Twin A EFW (grams)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1150"
                    value={efwA}
                    onChange={(e) => setEfwA(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Twin B EFW (grams)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1080"
                    value={efwB}
                    onChange={(e) => setEfwB(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {discordanceResult ? (
                <div className={`border rounded-xl p-4 space-y-2 ${
                  discordanceResult.percent >= 25 
                    ? 'bg-rose-50 border-rose-200 text-rose-900' 
                    : discordanceResult.percent >= 15 
                    ? 'bg-amber-50 border-amber-200 text-amber-900' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold">Growth Discordance:</span>
                    <span className="text-xl font-bold">{discordanceResult.percent}%</span>
                  </div>
                  <p className="text-xs font-medium">{discordanceResult.interpretation}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Enter EFW in grams for Twin A and Twin B to calculate growth discordance percentage.</p>
              )}
            </div>
          )}

          {/* TAB 4: BPP Score */}
          {activeTab === 'bpp' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 font-medium">Select 0 or 2 points for each biophysical variable:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Breathing */}
                <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Fetal Breathing (&ge; 30s)</span>
                  <select
                    value={breathing}
                    onChange={(e) => setBreathing(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium"
                  >
                    <option value={2}>Present (2)</option>
                    <option value={0}>Absent (0)</option>
                  </select>
                </div>

                {/* Gross Movement */}
                <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Gross Body Movements (&ge; 3)</span>
                  <select
                    value={movement}
                    onChange={(e) => setMovement(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium"
                  >
                    <option value={2}>Present (2)</option>
                    <option value={0}>Absent (0)</option>
                  </select>
                </div>

                {/* Tone */}
                <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Fetal Tone (Flexion/Extension)</span>
                  <select
                    value={tone}
                    onChange={(e) => setTone(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium"
                  >
                    <option value={2}>Normal (2)</option>
                    <option value={0}>Abnormal (0)</option>
                  </select>
                </div>

                {/* Amniotic Fluid */}
                <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Amniotic Fluid (SDP &gt; 2cm)</span>
                  <select
                    value={afScore}
                    onChange={(e) => setAfScore(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium"
                  >
                    <option value={2}>Normal (&gt; 2cm, 2)</option>
                    <option value={0}>Decreased (&le; 2cm, 0)</option>
                  </select>
                </div>
              </div>

              {/* BPP Result Box */}
              <div className={`border rounded-xl p-4 flex items-start gap-3 ${
                bppResult.status === 'Reassuring'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : bppResult.status === 'Equivocal'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {bppResult.status === 'Reassuring' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold">{bppResult.score} / {bppResult.maxScore}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/60 shadow-2xs">
                      {bppResult.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium mt-1">{bppResult.recommendation}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-lg transition-colors"
          >
            Close Calculator
          </button>
        </div>

      </div>
    </div>
  );
};

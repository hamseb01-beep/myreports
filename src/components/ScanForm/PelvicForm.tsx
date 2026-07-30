import React from 'react';
import { PelvicData } from '../../types';

interface PelvicFormProps {
  data: PelvicData;
  onChange: (updated: PelvicData) => void;
}

export const PelvicForm: React.FC<PelvicFormProps> = ({ data, onChange }) => {
  const updateField = (field: keyof PelvicData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Uterus</label>
          <textarea
            rows={2}
            value={data.uterus}
            onChange={(e) => updateField('uterus', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Endometrium</label>
          <textarea
            rows={2}
            value={data.endometrium}
            onChange={(e) => updateField('endometrium', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Right Ovary</label>
          <textarea
            rows={2}
            value={data.rightOvary}
            onChange={(e) => updateField('rightOvary', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Left Ovary</label>
          <textarea
            rows={2}
            value={data.leftOvary}
            onChange={(e) => updateField('leftOvary', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Urinary Bladder</label>
          <textarea
            rows={2}
            value={data.bladder}
            onChange={(e) => updateField('bladder', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Pouch of Douglas (CUL-DE-SAC)</label>
          <textarea
            rows={2}
            value={data.pouchOfDouglas}
            onChange={(e) => updateField('pouchOfDouglas', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white"
          />
        </div>
      </div>
    </div>
  );
};

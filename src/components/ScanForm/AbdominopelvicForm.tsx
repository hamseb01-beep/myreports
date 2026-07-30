import React from 'react';
import { AbdominopelvicData } from '../../types';

interface AbdominopelvicFormProps {
  data: AbdominopelvicData;
  onChange: (updated: AbdominopelvicData) => void;
}

export const AbdominopelvicForm: React.FC<AbdominopelvicFormProps> = ({ data, onChange }) => {
  const updateField = (field: keyof AbdominopelvicData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Liver</label>
          <textarea
            rows={2}
            value={data.liver}
            onChange={(e) => updateField('liver', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Gallbladder</label>
          <textarea
            rows={2}
            value={data.gallbladder}
            onChange={(e) => updateField('gallbladder', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Spleen</label>
          <textarea
            rows={2}
            value={data.spleen}
            onChange={(e) => updateField('spleen', e.target.value)}
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
          <label className="block font-bold text-slate-700 mb-1">Right Kidney</label>
          <textarea
            rows={2}
            value={data.rightKidney}
            onChange={(e) => updateField('rightKidney', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Left Kidney</label>
          <textarea
            rows={2}
            value={data.leftKidney}
            onChange={(e) => updateField('leftKidney', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:bg-white"
          />
        </div>

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
      </div>
    </div>
  );
};

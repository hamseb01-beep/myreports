import React, { useState } from 'react';
import { LAB_TEST_REFERENCE_RANGES, TestRangeInfo } from '../../data/labRanges';
import { FlaskConical, Plus, Check } from 'lucide-react';

interface LabRequestSelectorProps {
  selectedTests: string[];
  onChangeSelectedTests: (tests: string[]) => void;
  otherText: string;
  onChangeOtherText: (text: string) => void;
}

export const LabRequestSelector: React.FC<LabRequestSelectorProps> = ({
  selectedTests,
  onChangeSelectedTests,
  otherText,
  onChangeOtherText,
}) => {
  const toggleTest = (testName: string) => {
    if (selectedTests.includes(testName)) {
      onChangeSelectedTests(selectedTests.filter((t) => t !== testName));
    } else {
      onChangeSelectedTests([...selectedTests, testName]);
    }
  };

  // Group tests by category
  const categories: Record<string, TestRangeInfo[]> = {};
  Object.values(LAB_TEST_REFERENCE_RANGES).forEach((item) => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-800 text-sm">Laboratory Requests (Optional)</h3>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
          {selectedTests.length} selected
        </span>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {Object.entries(categories).map(([catName, tests]) => (
          <div key={catName} className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-2">
            <h4 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider border-b border-slate-200 pb-1">
              {catName}
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {tests.map((test) => {
                const isChecked = selectedTests.includes(test.name);
                return (
                  <button
                    key={test.name}
                    type="button"
                    onClick={() => toggleTest(test.name)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left font-medium transition-all text-[11px] ${
                      isChecked
                        ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate mr-1">{test.name}</span>
                    {isChecked ? (
                      <Check className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Other specific request text */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Other Specific Investigations or Culture Requests:
        </label>
        <input
          type="text"
          value={otherText}
          onChange={(e) => onChangeOtherText(e.target.value)}
          placeholder="e.g. HBA1c, Blood Culture, High Vaginal Swab (HVS)..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

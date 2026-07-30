import React, { useState } from 'react';
import { LabRequest, LabTestItem, StaffUser } from '../types';
import { LAB_TEST_REFERENCE_RANGES } from '../data/labRanges';
import { FlaskConical, CheckCircle2, Clock, Upload, Trash2, ZoomIn, Save, Search, Filter, AlertCircle, FileSpreadsheet, X } from 'lucide-react';

interface LabDashboardProps {
  labRequests: LabRequest[];
  onSaveLabResults: (reqId: string, updatedTests: LabTestItem[]) => void;
  onDeleteLabRequest: (reqId: string) => void;
  onOpenLightbox: (imageUrl: string, title?: string) => void;
  currentUser: StaffUser;
}

export const LabDashboard: React.FC<LabDashboardProps> = ({
  labRequests,
  onSaveLabResults,
  onDeleteLabRequest,
  onOpenLightbox,
  currentUser,
}) => {
  const [selectedReqId, setSelectedReqId] = useState<string | null>(labRequests[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Active selected request
  const selectedReq = labRequests.find((r) => r.id === selectedReqId) || labRequests[0];

  // Editable test entries for selected request
  const [editingTests, setEditingTests] = useState<LabTestItem[]>(selectedReq?.tests || []);

  // When selection changes
  const handleSelectRequest = (req: LabRequest) => {
    setSelectedReqId(req.id);
    setEditingTests(req.tests);
  };

  // Update result text
  const handleResultChange = (testId: string, value: string) => {
    setEditingTests((prev) =>
      prev.map((t) => {
        if (t.id === testId) {
          return { ...t, result: value };
        }
        return t;
      })
    );
  };

  // Update Flag
  const handleFlagChange = (testId: string, flag: 'normal' | 'high' | 'low' | 'abnormal') => {
    setEditingTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, flag } : t))
    );
  };

  // Image Upload handler for CBC / Urinalysis
  const handleImageUpload = (testId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readers: Promise<string>[] = Array.from(files).map((file: File) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newImages) => {
      setEditingTests((prev) =>
        prev.map((t) => {
          if (t.id === testId) {
            const existing = t.images || [];
            return {
              ...t,
              images: [...existing, ...newImages],
              result: t.result || 'Image Attachment Uploaded'
            };
          }
          return t;
        })
      );
    });
  };

  // Remove attached image
  const handleRemoveImage = (testId: string, imgIdx: number) => {
    setEditingTests((prev) =>
      prev.map((t) => {
        if (t.id === testId && t.images) {
          const updated = t.images.filter((_, idx) => idx !== imgIdx);
          return { ...t, images: updated };
        }
        return t;
      })
    );
  };

  // Save Results Button
  const handleSave = () => {
    if (!selectedReq) return;
    const completed = editingTests.map((t) => ({
      ...t,
      completedAt: t.result ? new Date().toISOString() : t.completedAt,
      completedBy: t.result ? currentUser.name : t.completedBy
    }));

    onSaveLabResults(selectedReq.id, completed);
    alert(`✅ Results saved for patient: ${selectedReq.patientName}`);
  };

  // Filter requests
  const filteredRequests = labRequests.filter((r) => {
    const matchesSearch = r.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const isCompleted = r.tests.every((t) => t.result);
    if (statusFilter === 'pending' && isCompleted) return false;
    if (statusFilter === 'completed' && !isCompleted) return false;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d2350] via-[#132a5e] to-[#0d2350] text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-400/30">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg">Laboratory Technician Workstation</h2>
            <p className="text-xs text-slate-300">
              Logged in as <strong className="text-emerald-300">{currentUser.name}</strong> ({currentUser.title})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
            Total Requests: <strong className="text-white font-bold">{labRequests.length}</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Requests List, Right Result Entry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Queue & Filter */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm h-fit">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Patient Lab Queue
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {filteredRequests.length}
            </span>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex rounded-lg bg-slate-100 p-0.5 font-semibold text-[11px]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 py-1 rounded-md transition-all ${
                  statusFilter === 'all' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`flex-1 py-1 rounded-md transition-all ${
                  statusFilter === 'pending' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-500'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`flex-1 py-1 rounded-md transition-all ${
                  statusFilter === 'completed' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500'
                }`}
              >
                Done
              </button>
            </div>
          </div>

          {/* List of Requests */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredRequests.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6 italic">No lab requests match filter.</p>
            ) : (
              filteredRequests.map((req) => {
                const total = req.tests.length;
                const done = req.tests.filter((t) => t.result).length;
                const isComplete = done === total;
                const isSelected = selectedReq?.id === req.id;

                return (
                  <div
                    key={req.id}
                    onClick={() => handleSelectRequest(req)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-extrabold text-xs text-slate-900">{req.patientName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isComplete
                          ? 'bg-emerald-100 text-emerald-800'
                          : done > 0
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isComplete ? 'Complete' : `${done}/${total} Done`}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate">
                      {req.tests.map((t) => t.name).join(', ')}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Age: {req.patientAge || '—'} yrs</span>
                      <span>{new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Results Entry Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
          {selectedReq ? (
            <>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-base text-[#0d2350]">
                    Results Entry — {selectedReq.patientName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Patient Age: {selectedReq.patientAge || '—'} yrs | Requested by: {selectedReq.requestedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteLabRequest(selectedReq.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    title="Delete lab request"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Results</span>
                  </button>
                </div>
              </div>

              {/* Tests Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 text-[11px] uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-2.5">Investigation</th>
                      <th className="p-2.5">Reference Range</th>
                      <th className="p-2.5">Result Value</th>
                      <th className="p-2.5">Flag</th>
                      <th className="p-2.5 text-center">Attach Photo (CBC/Urine)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {editingTests.map((t) => {
                      const refInfo = LAB_TEST_REFERENCE_RANGES[t.name];
                      const isPhotoTest = t.name === 'CBC' || t.name === 'Urinalysis' || t.name === 'Others';

                      return (
                        <tr key={t.id} className="hover:bg-slate-50/80">
                          <td className="p-2.5 font-bold text-slate-900">{t.name}</td>
                          <td className="p-2.5 text-slate-500 text-[11px]">
                            {refInfo?.normalRange || t.normalRange || '—'}
                          </td>
                          <td className="p-2.5 min-w-[160px]">
                            <input
                              type="text"
                              value={t.result || ''}
                              onChange={(e) => handleResultChange(t.id, e.target.value)}
                              placeholder="Enter value..."
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                            />
                          </td>
                          <td className="p-2.5">
                            <select
                              value={t.flag || 'normal'}
                              onChange={(e) => handleFlagChange(t.id, e.target.value as any)}
                              className={`px-2 py-1 rounded text-[11px] font-bold border focus:outline-none ${
                                t.flag === 'high' || t.flag === 'abnormal'
                                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                                  : t.flag === 'low'
                                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              }`}
                            >
                              <option value="normal">Normal</option>
                              <option value="high">High</option>
                              <option value="low">Low</option>
                              <option value="abnormal">Abnormal</option>
                            </select>
                          </td>
                          <td className="p-2.5 text-center">
                            <div className="flex flex-col items-center gap-1.5">
                              <label className="cursor-pointer flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg border border-slate-300 transition-colors">
                                <Upload className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleImageUpload(t.id, e)}
                                  className="hidden"
                                />
                              </label>

                              {/* Attached Thumbnails */}
                              {t.images && t.images.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap justify-center mt-1">
                                  {t.images.map((img, idx) => (
                                    <div key={idx} className="relative group border border-slate-300 rounded overflow-hidden">
                                      <img
                                        src={img}
                                        alt="Attachment"
                                        onClick={() => onOpenLightbox(img, `${t.name} Attachment`)}
                                        className="w-10 h-10 object-cover cursor-pointer"
                                      />
                                      <button
                                        onClick={() => handleRemoveImage(t.id, idx)}
                                        className="absolute top-0 right-0 bg-rose-600 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Action */}
              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Laboratory Results</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <FlaskConical className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">Select a patient from the queue to enter lab results.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

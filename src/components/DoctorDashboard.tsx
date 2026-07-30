import React, { useState } from 'react';
import { PatientReport, LabRequest, StaffUser } from '../types';
import { Stethoscope, Plus, Search, FileText, FlaskConical, Clock, CheckCircle2, Trash2, Eye, Calendar, Sparkles, Filter, ShieldCheck, ChevronRight } from 'lucide-react';

interface DoctorDashboardProps {
  reports: PatientReport[];
  labRequests: LabRequest[];
  onOpenNewScan: () => void;
  onViewReport: (report: PatientReport) => void;
  onEditReport: (report: PatientReport) => void;
  onDeleteReport: (reportId: string) => void;
  currentUser: StaffUser;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  reports,
  labRequests,
  onOpenNewScan,
  onViewReport,
  onEditReport,
  onDeleteReport,
  currentUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Obstetric' | 'Abdominopelvic' | 'Pelvic'>('All');

  // Filter reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate Metrics
  const totalReportsCount = reports.length;
  const totalLabsCount = labRequests.length;
  const pendingLabsCount = labRequests.filter((l) => l.tests.some((t) => !t.result)).length;
  const completedLabsCount = totalLabsCount - pendingLabsCount;

  return (
    <div className="space-y-6">
      
      {/* Welcome & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Patient Reports</span>
            <span className="text-2xl font-black text-slate-900">{totalReportsCount}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Lab Requests</span>
            <span className="text-2xl font-black text-slate-900">{totalLabsCount}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Labs</span>
            <span className="text-2xl font-black text-amber-900">{pendingLabsCount}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Completed Labs</span>
            <span className="text-2xl font-black text-emerald-900">{completedLabsCount}</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Patient Registry & Lab Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Saved Reports (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-[#0d2350] text-base">Patient Report Registry</h3>
            </div>

            <button
              onClick={onOpenNewScan}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Scan Report</span>
            </button>
          </div>

          {/* Search & Scan Type Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by patient name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto text-[11px] font-semibold">
              {(['All', 'Obstetric', 'Abdominopelvic', 'Pelvic'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1 rounded-md transition-all shrink-0 ${
                    typeFilter === t
                      ? 'bg-white text-emerald-800 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* List of Reports */}
          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs italic">No reports found matching your criteria.</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                // Find matching lab request
                const labReq = labRequests.find((l) => l.reportId === report.id || l.patientName === report.patientName);
                let labStatusLabel = 'No Lab Ordered';
                let labStatusClass = 'bg-slate-100 text-slate-600';

                if (labReq) {
                  const total = labReq.tests.length;
                  const done = labReq.tests.filter((t) => t.result).length;
                  if (done === total) {
                    labStatusLabel = '✅ Lab Complete';
                    labStatusClass = 'bg-emerald-100 text-emerald-800 font-bold';
                  } else if (done > 0) {
                    labStatusLabel = `⏳ ${done}/${total} Lab Done`;
                    labStatusClass = 'bg-blue-100 text-blue-800 font-bold';
                  } else {
                    labStatusLabel = '⏳ Lab Pending';
                    labStatusClass = 'bg-amber-100 text-amber-800 font-bold';
                  }
                }

                return (
                  <div
                    key={report.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-900">{report.patientName}</h4>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          {report.type}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${labStatusClass}`}>
                          {labStatusLabel}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Age: {report.patientAge || '—'} yrs</span>
                        {report.lmp && <span>LMP: {report.lmp}</span>}
                        <span>Date: {new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onViewReport(report)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#0d2350] hover:bg-[#132a5e] text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => onEditReport(report)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => onDeleteReport(report.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Laboratory Status Tracker Summary */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              Laboratory Status Tracker
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {labRequests.length} Total
            </span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 text-xs">
            {labRequests.length === 0 ? (
              <p className="text-slate-400 italic text-center py-6">No laboratory requests currently ordered.</p>
            ) : (
              labRequests.map((lr) => {
                const total = lr.tests.length;
                const done = lr.tests.filter((t) => t.result).length;
                const isComplete = done === total;

                return (
                  <div
                    key={lr.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{lr.patientName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isComplete ? '✅ Complete' : `⏳ ${done}/${total}`}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 truncate">
                      {lr.tests.map((t) => t.name).join(', ')}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Requested: {new Date(lr.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

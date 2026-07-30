import React, { useRef, useState } from 'react';
import { PatientReport, LabRequest } from '../types';
import html2canvas from 'html2canvas';
import { Download, Printer, Copy, Save, ArrowLeft, Image as ImageIcon, ZoomIn, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { ClinicLogo } from './ClinicLogo';

interface ReportViewerProps {
  report: PatientReport;
  labRequest?: LabRequest | null;
  onBack: () => void;
  onSaveReport: (updatedReport: PatientReport) => void;
  onOpenLightbox: (imageUrl: string, title?: string) => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  report,
  labRequest,
  onBack,
  onSaveReport,
  onOpenLightbox,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Editable fields local state
  const [findingsHtml, setFindingsHtml] = useState(report.findingsHtml);
  const [additionalNotes, setAdditionalNotes] = useState(report.additionalNotesHtml || '');
  const [commentText, setCommentText] = useState(report.commentText || '');
  const [impressionHtml, setImpressionHtml] = useState(report.impressionHtml);

  // Download Report as High-Res PNG Image
  const handleDownloadImage = async () => {
    if (!sheetRef.current) return;
    try {
      setIsCapturing(true);
      const canvas = await html2canvas(sheetRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      const safeName = report.patientName.replace(/[^a-z0-9]/gi, '_') || 'patient_report';
      const link = document.createElement('a');
      link.download = `Beergeel_Clinic_${safeName}_${report.type}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Image capture failed', err);
      alert('Could not export report image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Print layout
  const handlePrint = () => {
    window.print();
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    const text = `BEERGEEL CLINIC REPORT
Patient: ${report.patientName} (${report.patientAge} yrs)
Date: ${new Date(report.createdAt).toLocaleDateString()}
Scan: ${report.type} Ultrasound

Impression:
${impressionHtml.replace(/<[^>]*>?/gm, '')}

Consultant: ${report.doctorName}`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Save changes
  const handleSave = () => {
    const updated: PatientReport = {
      ...report,
      findingsHtml,
      additionalNotesHtml: additionalNotes,
      commentText,
      impressionHtml
    };
    onSaveReport(updated);
    alert('✅ Report updated and saved successfully!');
  };

  // Check if lab results exist and are completed
  const hasLabResults = labRequest && labRequest.tests && labRequest.tests.some((t) => t.result || (t.images && t.images.length > 0));

  return (
    <div className="space-y-4 pb-12">
      
      {/* Top Action Toolbar (Hidden during Print) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isCapturing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0e8f3e] hover:bg-[#0a6b2f] text-white text-xs font-bold rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isCapturing ? 'Generating...' : 'Download Image'}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0d2350] hover:bg-[#132a5e] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* MEDICAL REPORT SHEET CARD */}
      <div
        ref={sheetRef}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-4xl mx-auto overflow-hidden print:shadow-none print:border-none print:m-0 print:w-full print:rounded-none"
      >
        
        {/* REPORT HERO HEADER */}
        <div className="bg-gradient-to-r from-[#0d2350] via-[#132a5e] to-[#0d2350] text-white p-6 relative overflow-hidden">
          <div className="absolute top-[-30px] right-[-30px] w-36 h-36 bg-[#e8637a]/80 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center shrink-0">
                <ClinicLogo variant="navy" className="w-full h-full" />
              </div>
              <div>
                <h1 className="font-extrabold text-2xl tracking-wide font-sans leading-none">BEERGEEL CLINIC</h1>
                <p className="text-xs text-emerald-200 font-semibold mt-1">Obstetrics & Gynecology Center</p>
                <p className="text-[11px] text-white/80 mt-0.5">Ultrasonography & Diagnostic Laboratory</p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs space-y-0.5 border-t sm:border-t-0 border-white/20 pt-2 sm:pt-0 w-full sm:w-auto">
              <p className="font-extrabold text-sm text-white">{report.doctorName}</p>
              <p className="text-emerald-200 font-medium">{report.doctorTitle}</p>
              <p className="text-[10px] text-white/70">M.B.Ch.B, Specialist OBGYN Scan</p>
            </div>
          </div>
        </div>

        {/* REPORT SHEET BODY */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800">

          {/* Title & Decorative Line */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold uppercase tracking-wider text-[#0d2350]">
              {report.findingsTitle || `${report.type} Ultrasound Report`}
            </h2>
            <div className="flex items-center justify-center gap-2 text-[#e8637a] text-xs">
              <span className="w-12 h-px bg-slate-200" />
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span className="w-12 h-px bg-slate-200" />
            </div>
          </div>

          {/* Patient Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Patient Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{report.patientName}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Age / Sex</span>
                <span className="font-bold text-slate-800">{report.patientAge ? `${report.patientAge} Years` : '—'} / Female</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">LMP Date & EDD</span>
                <span className="font-bold text-slate-800">{report.lmp || '—'} {report.edd ? `(EDD: ${report.edd})` : ''}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Scan Date</span>
                <span className="font-bold text-slate-800">
                  {new Date(report.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Obstetric History Bar if Obstetric Scan */}
            {report.type === 'Obstetric' && (
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-2 text-slate-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200/80">
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold block">Gravida (G)</span>
                  <span className="font-extrabold text-emerald-950">{report.gravida || report.obstetricData?.gravida || '1'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold block">Parity (P)</span>
                  <span className="font-extrabold text-emerald-950">{report.parity || report.obstetricData?.parity || '0'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold block">Abortion (A)</span>
                  <span className="font-extrabold text-emerald-950">{report.abortion || report.obstetricData?.abortion || '0'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 font-bold block">Alive (L)</span>
                  <span className="font-extrabold text-emerald-950">{report.alive || report.obstetricData?.alive || '0'}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-emerald-800 font-bold block">Others</span>
                  <span className="font-semibold text-emerald-950">{report.obsOthers || report.obstetricData?.obsOthers || 'None'}</span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION BAR: Ultrasound Findings */}
          <div className="bg-[#0d2350] text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-lg flex items-center justify-between">
            <span>Ultrasound Findings</span>
            <span className="text-[10px] font-normal text-emerald-300 italic">Click content to edit</span>
          </div>

          {/* Findings Body */}
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setFindingsHtml(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: findingsHtml }}
            className="text-xs leading-relaxed text-slate-800 bg-white p-3 rounded-lg border border-slate-100 focus:outline-emerald-500 focus:bg-emerald-50/20 transition-all min-h-[100px]"
          />

          {/* Additional Notes */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Additional Notes / Measurements
            </span>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setAdditionalNotes(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: additionalNotes || '<em>Click to type additional observations or organ dimensions...</em>' }}
              className="text-xs leading-relaxed text-slate-700 bg-slate-50/50 p-2.5 rounded-lg border border-slate-200 focus:outline-emerald-500 min-h-[40px]"
            />
          </div>

          {/* SECTION BAR: Impression */}
          <div className="bg-[#e8637a] text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-lg">
            Clinical Impression
          </div>

          {/* Impression Box */}
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setImpressionHtml(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: impressionHtml }}
            className="bg-amber-50 border-l-4 border-amber-500 text-amber-950 p-4 rounded-r-xl font-bold text-sm leading-snug focus:outline-emerald-500 shadow-2xs"
          />

          {/* Doctor Comment */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Doctor Recommendation / Comment
            </span>
            <textarea
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="e.g. Follow-up scan recommended in 3 weeks. Correlate with hormonal blood tests."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-emerald-500"
            />
          </div>

          {/* SECTION BAR & TABLE: Laboratory Investigations (If Requested) */}
          {(hasLabResults || (report.requestedLabNames && report.requestedLabNames.length > 0)) && (
            <div className="space-y-3 pt-2">
              <div className="bg-[#0e8f3e] text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-lg flex items-center justify-between">
                <span>Laboratory Diagnostic Results</span>
                <span className="text-[10px] font-normal text-emerald-100">Mr. Mohamed Omer (Lab Tech)</span>
              </div>

              {hasLabResults ? (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#0d2350] text-white text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="px-3 py-2 font-bold">Investigation</th>
                        <th className="px-3 py-2 font-bold">Reference Range</th>
                        <th className="px-3 py-2 font-bold">Result Value</th>
                        <th className="px-3 py-2 font-bold text-center">Attachment / Photo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {labRequest?.tests.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/80">
                          <td className="px-3 py-2.5 font-bold text-slate-900">{t.name}</td>
                          <td className="px-3 py-2.5 text-slate-500 text-[11px]">{t.normalRange || '—'}</td>
                          <td className="px-3 py-2.5">
                            <span className={`font-bold ${
                              t.flag === 'high' || t.flag === 'abnormal'
                                ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded'
                                : t.flag === 'low'
                                ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded'
                                : 'text-emerald-700 font-semibold'
                            }`}>
                              {t.result || 'Pending'}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {t.images && t.images.length > 0 ? (
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                {t.images.map((img, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => onOpenLightbox(img, `${t.name} Attachment`)}
                                    className="relative group border border-slate-300 rounded-lg overflow-hidden shrink-0"
                                  >
                                    <img src={img} alt="Lab Attachment" className="h-10 w-14 object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                      <ZoomIn className="w-3.5 h-3.5" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px]">No Photo</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 italic">
                  Laboratory requested tests: <strong>{report.requestedLabNames?.join(', ')}</strong> (Results pending from laboratory).
                </div>
              )}
            </div>
          )}

          {/* SIGNATURE BLOCK */}
          <div className="pt-8 flex items-end justify-between border-t border-slate-200">
            {/* Lab Tech Signature if Lab tests exist */}
            {hasLabResults ? (
              <div className="text-left space-y-1">
                <div className="h-10 border-b border-slate-800 w-48 mb-1 flex items-end">
                  <span className="text-[10px] text-slate-400 italic">Signed electronically</span>
                </div>
                <p className="font-extrabold text-xs text-[#0d2350]">Mr. Mohamed Omer</p>
                <p className="text-[10px] text-slate-500 font-medium">Laboratory Technician</p>
              </div>
            ) : <div />}

            {/* Doctor Signature */}
            <div className="text-right space-y-1">
              <div className="h-10 border-b border-slate-800 w-52 ml-auto mb-1 flex items-end justify-end">
                <span className="text-[10px] text-emerald-800 font-bold italic">Beergeel OBGYN Verified</span>
              </div>
              <p className="font-extrabold text-xs text-[#0d2350]">{report.doctorName}</p>
              <p className="text-[10px] text-slate-500 font-medium">{report.doctorTitle}</p>
            </div>
          </div>

        </div>

        {/* REPORT FOOTER */}
        <div className="bg-[#0d2350] text-white px-6 py-4 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-emerald-500/30">
          <div>📍 Xero awr kasoo horjeedka Ayuub Restaurant, inyar ka xiga dhanka Masjid Nuur</div>
          <div className="font-semibold text-emerald-300">📞 063 4026635 | ✉️ beergeelobgyclinic@gmail.com</div>
        </div>

      </div>

    </div>
  );
};

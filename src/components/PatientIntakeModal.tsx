import React, { useState } from 'react';
import { 
  PatientReport, 
  UltrasoundType, 
  ObstetricData, 
  AbdominopelvicData, 
  PelvicData, 
  StaffUser 
} from '../types';
import { ObstetricForm } from './ScanForm/ObstetricForm';
import { AbdominopelvicForm } from './ScanForm/AbdominopelvicForm';
import { PelvicForm } from './ScanForm/PelvicForm';
import { LabRequestSelector } from './ScanForm/LabRequestSelector';
import { X, Baby, HeartPulse, Activity, ArrowRight, UserPlus, Calendar, Phone, MessageSquare } from 'lucide-react';
import { ClinicLogo } from './ClinicLogo';
import { calculateGAAndEDDFromLMP, calculateBPPScore } from '../utils/calculators';

interface PatientIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReport: (report: PatientReport, requestedLabNames: string[]) => void;
  currentUser: StaffUser;
  initialReport?: PatientReport | null;
}

const DEFAULT_OB: ObstetricData = {
  trimester: 'Second',
  gestationCount: 'Single',
  fetalHeartRate: 'Positive',
  gravida: '1',
  parity: '0',
  abortion: '0',
  alive: '0',
  obsOthers: 'None',
  firstTriPole: 'Yes',
  crlCm: '4.8',
  msdCm: '2.5',
  gaWeeks1: '11',
  gaDays1: '3',
  gaWeeks2: '24',
  gaDays2: '2',
  efwSingle: '680',
  presentationSingle: 'Cephalic',
  placentaLocationSingle: 'Fundal anterior',
  afMethodSingle: 'SDP',
  afValueSingle: '4.2',
  flAcRatio: '21%',
  anatomicSurvey: 'Yes',
  anatomyScanText: 'Detailed fetal anatomy survey appears morphologically within normal limits.',
  bppSingle: {
    breathing: 2,
    movement: 2,
    tone: 2,
    afScore: 2,
    sdp: '4.2'
  }
};

const DEFAULT_ABDO: AbdominopelvicData = {
  liver: 'Normal size, smooth capsule. Homogeneous parenchymal echotexture. No focal mass or intrahepatic biliary dilatation.',
  gallbladder: 'Distended with smooth thin wall. No gallstones, sludge, or mass lesion.',
  spleen: 'Normal size and architecture.',
  rightKidney: 'Normal size (10.1 cm) and cortex thickness. No hydronephrosis or stone.',
  leftKidney: 'Normal size (10.4 cm) and cortex thickness. No hydronephrosis or stone.',
  bladder: 'Smooth wall outline with clear urine contents.',
  uterus: 'Anteverted, normal size and smooth contour. Homogeneous myometrium.',
  endometrium: 'Regular, central, triple-layer appearance measuring 7.5 mm.',
  rightOvary: 'Normal size and follicular activity.',
  leftOvary: 'Normal size and follicular activity.',
  freeFluid: 'No fluid in pouch of Douglas'
};

const DEFAULT_PELVIC: PelvicData = {
  uterus: 'Anteverted, normal size (7.6 x 4.1 x 3.9 cm) with smooth contour and homogeneous myometrium.',
  endometrium: 'Central, regular, measuring 8.0 mm in thickness, within normal limits.',
  rightOvary: 'Normal size (3.0 x 2.1 cm) and volume. Normal follicular pattern. No cyst.',
  leftOvary: 'Normal size (2.9 x 1.9 cm) and volume. Normal follicular pattern. No cyst.',
  bladder: 'Adequately distended with thin smooth wall.',
  pouchOfDouglas: 'Clear, no free pelvic fluid collection.'
};

export const PatientIntakeModal: React.FC<PatientIntakeModalProps> = ({
  isOpen,
  onClose,
  onSaveReport,
  currentUser,
  initialReport
}) => {
  const [entryMode, setEntryMode] = useState<'both' | 'ultrasound_only' | 'lab_only'>('both');
  
  const [patientName, setPatientName] = useState(initialReport?.patientName || '');
  const [patientAge, setPatientAge] = useState(initialReport?.patientAge || '');
  const [patientPhone, setPatientPhone] = useState(initialReport?.patientPhone || '');
  const [lmp, setLmp] = useState(initialReport?.lmp || '');
  
  // Obstetric History
  const [gravida, setGravida] = useState(initialReport?.gravida || initialReport?.obstetricData?.gravida || '1');
  const [parity, setParity] = useState(initialReport?.parity || initialReport?.obstetricData?.parity || '0');
  const [abortion, setAbortion] = useState(initialReport?.abortion || initialReport?.obstetricData?.abortion || '0');
  const [alive, setAlive] = useState(initialReport?.alive || initialReport?.obstetricData?.alive || '0');
  const [obsOthers, setObsOthers] = useState(initialReport?.obsOthers || initialReport?.obstetricData?.obsOthers || '');

  const [commentText, setCommentText] = useState(initialReport?.commentText || '');

  const [scanType, setScanType] = useState<UltrasoundType>(initialReport?.type || 'Obstetric');

  const [obData, setObData] = useState<ObstetricData>(initialReport?.obstetricData || DEFAULT_OB);
  const [abdoData, setAbdoData] = useState<AbdominopelvicData>(initialReport?.abdominopelvicData || DEFAULT_ABDO);
  const [pelvicData, setPelvicData] = useState<PelvicData>(initialReport?.pelvicData || DEFAULT_PELVIC);

  const [selectedLabs, setSelectedLabs] = useState<string[]>(initialReport?.requestedLabNames || []);
  const [otherLabText, setOtherLabText] = useState<string>('');

  if (!isOpen) return null;

  // Auto-calculated Gestational Age & EDD from LMP
  const lmpCalculation = lmp ? calculateGAAndEDDFromLMP(lmp) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Please enter patient full name.');
      return;
    }

    const reportId = initialReport?.id || `rep_${Date.now()}`;
    
    // Combine selected labs
    const finalLabNames = (entryMode === 'ultrasound_only') ? [] : [...selectedLabs];
    if (entryMode !== 'ultrasound_only' && otherLabText.trim() && !finalLabNames.includes(otherLabText.trim())) {
      finalLabNames.push(otherLabText.trim());
    }

    // Handle Laboratory Only mode
    if (entryMode === 'lab_only') {
      if (finalLabNames.length === 0) {
        alert('Please select at least one laboratory test to request.');
        return;
      }

      const labReport: PatientReport = {
        id: reportId,
        patientName,
        patientAge,
        patientPhone,
        lmp,
        edd: lmpCalculation?.eddDate,
        createdAt: initialReport?.createdAt || new Date().toISOString(),
        type: 'Obstetric', // Default container
        requestedLabNames: finalLabNames,
        findingsTitle: 'Diagnostic Laboratory Test Requisition',
        findingsHtml: `<div class="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <p class="font-bold text-emerald-900">Laboratory Tests Requested:</p>
          <ul class="list-disc list-inside mt-1 text-slate-700">
            ${finalLabNames.map((t) => `<li>${t}</li>`).join('')}
          </ul>
        </div>`,
        impressionHtml: 'Laboratory tests requested. Pending lab analysis.',
        commentText: commentText || 'Laboratory requisition issued.',
        doctorName: currentUser.name,
        doctorTitle: currentUser.title
      };

      onSaveReport(labReport, finalLabNames);
      return;
    }

    // Prepare updated obstetric data object
    const finalObData: ObstetricData = {
      ...obData,
      gravida,
      parity,
      abortion,
      alive,
      obsOthers
    };

    // Generate Findings & Impression HTML according to exact user prompt requirements
    let findingsTitle = `${scanType} Ultrasound Report`;
    let findingsHtml = '';
    let impressionHtml = '';

    if (scanType === 'Obstetric') {
      const tri = finalObData.trimester;
      const gest = finalObData.gestationCount;
      const fhr = finalObData.fetalHeartRate === 'Positive' ? 'FHR positive' : 'FHR negative';

      findingsTitle = `${tri} Trimester ${gest === 'Multiple' ? 'Twin' : 'Single'} Obstetric Ultrasound Report`;

      // 1ST TRIMESTER SINGLETON
      if (tri === 'First' && gest === 'Single') {
        const gaStr = finalObData.gaWeeks1 ? `${finalObData.gaWeeks1} weeks + ${finalObData.gaDays1 || '0'} days` : '11 weeks + 2 days';
        const msdStr = finalObData.msdCm ? `MSD: ${finalObData.msdCm} cm` : '';
        const crlStr = finalObData.crlCm ? `CRL: ${finalObData.crlCm} cm` : '';
        const msdCrl = [msdStr, crlStr].filter(Boolean).join(' or ') || 'CRL: 4.8 cm';

        findingsHtml = `<div class="space-y-2">
          <p><strong>Gestational Scan:</strong> Single intrauterine pregnancy.</p>
          <p><strong>Fetal Heart Activity:</strong> ${fhr}.</p>
          <p><strong>Biometry:</strong> ${msdCrl}.</p>
          <p><strong>Gestational Age:</strong> ${gaStr}.</p>
          <p class="text-xs text-slate-500 font-medium"><em>Note: Max gestational age of first trimester ultrasound is 13 weeks + 6 days.</em></p>
        </div>`;

        impressionHtml = `normal first trimester pregnancy`;
      } 
      // 1ST TRIMESTER TWIN
      else if (tri === 'First' && gest === 'Multiple') {
        const chor = finalObData.chorionicity || 'DCDA';
        const sign = finalObData.twinSignSeen || 'Two members separated';
        const fhrA = finalObData.twinA?.fhrPositive !== false ? 'FHR positive' : 'FHR negative';
        const fhrB = finalObData.twinB?.fhrPositive !== false ? 'FHR positive' : 'FHR negative';
        const twinA_mCrl = finalObData.twinA?.crlCm ? `CRL: ${finalObData.twinA.crlCm} cm` : (finalObData.twinA?.msdCm ? `MSD: ${finalObData.twinA.msdCm} cm` : 'CRL: 4.6 cm');
        const twinB_mCrl = finalObData.twinB?.crlCm ? `CRL: ${finalObData.twinB.crlCm} cm` : (finalObData.twinB?.msdCm ? `MSD: ${finalObData.twinB.msdCm} cm` : 'CRL: 4.5 cm');

        findingsHtml = `<div class="space-y-2.5">
          <p><strong>Gestational Scan:</strong> Twin intrauterine pregnancy.</p>
          <p><strong>Membrane & Sign:</strong> ${sign}. Chorionicity: ${chor}.</p>
          <p><strong>Twin A:</strong> ${fhrA}. ${twinA_mCrl}. Gestational age: ${finalObData.twinA?.ga || '11w 3d'}.</p>
          <p><strong>Twin B:</strong> ${fhrB}. ${twinB_mCrl}. Gestational age: ${finalObData.twinB?.ga || '11w 2d'}.</p>
          <p class="text-xs text-slate-500 font-medium"><em>Note: Max gestational age of first trimester ultrasound is 13 weeks + 6 days.</em></p>
        </div>`;

        impressionHtml = `normal first trimester twin pregnancy (${chor})`;
      }
      // SECOND TRIMESTER SINGLETON
      else if (tri === 'Second' && gest === 'Single') {
        const gaStr = finalObData.gaWeeks2 ? `${finalObData.gaWeeks2} weeks + ${finalObData.gaDays2 || '0'} days` : '22 weeks + 4 days';
        const efwStr = finalObData.efwSingle ? `${finalObData.efwSingle} grams` : '520 grams';
        const placLoc = finalObData.placentaLocationSingle || 'Fundal anterior';
        const pres = finalObData.presentationSingle || 'Cephalic';
        const afStr = `${finalObData.afMethodSingle || 'SDP'}: ${finalObData.afValueSingle || '4.5'} cm`;

        let dopplerHtml = '';
        if (finalObData.dopplerEnabled) {
          dopplerHtml = `<p><strong>Doppler Study:</strong> UAD: ${finalObData.dopplerUAD || 'Normal'}, MCAD: ${finalObData.dopplerMCAD || 'Normal'}. Indices: ${finalObData.dopplerIndices || 'Normal indices'}.</p>`;
        }

        let anatHtml = '';
        if (finalObData.anatomicSurvey !== 'No') {
          anatHtml = `<p><strong>Anatomy Scan:</strong> ${finalObData.anatomyScanText || 'Detailed fetal anatomy survey normal.'}</p>`;
        }

        findingsHtml = `<div class="space-y-2">
          <p><strong>Gestational Scan:</strong> Single intrauterine pregnancy.</p>
          <p><strong>Fetal Cardiac Activity:</strong> ${fhr}.</p>
          <p><strong>Gestational Age:</strong> ${gaStr} (Max GA for 2nd trimester is 27 weeks + 6 days).</p>
          <p><strong>Estimated Fetal Weight (EFW):</strong> ${efwStr}.</p>
          <p><strong>Placenta Location:</strong> ${placLoc}.</p>
          <p><strong>Presentation:</strong> ${pres}.</p>
          <p><strong>Amniotic Fluid:</strong> ${afStr}.</p>
          ${anatHtml}
          ${dopplerHtml}
        </div>`;

        impressionHtml = `normal second trimester pregnancy`;
      }
      // SECOND TRIMESTER TWIN
      else if (tri === 'Second' && gest === 'Multiple') {
        const chor = finalObData.chorionicity || 'DCDA';
        const placType = finalObData.twinPlacentaType || 'Two separate placentas';
        const placLoc = finalObData.twinPlacentaLocation || 'Fundal anterior';
        const mem = finalObData.twinMembrane || 'Dividing membrane is seen';
        const fhrA = finalObData.twinA?.fhrPositive !== false ? 'FHR positive' : 'FHR negative';
        const fhrB = finalObData.twinB?.fhrPositive !== false ? 'FHR positive' : 'FHR negative';

        let dopplerHtml = '';
        if (finalObData.dopplerEnabled) {
          dopplerHtml = `<p><strong>Doppler Study:</strong> UAD: ${finalObData.dopplerUAD || 'Normal'}, MCAD: ${finalObData.dopplerMCAD || 'Normal'}. Indices: ${finalObData.dopplerIndices || 'Normal indices'}.</p>`;
        }

        findingsHtml = `<div class="space-y-2.5">
          <p><strong>Gestational Scan:</strong> Twin intrauterine pregnancy.</p>
          <p><strong>Membrane & Placenta:</strong> ${mem}. Chorionicity: ${chor}. Placenta structure: ${placType}. Location: ${placLoc}.</p>
          <p><strong>Twin A:</strong> ${fhrA}. Presentation: ${finalObData.twinA?.presentation || 'Cephalic'}. SDP: ${finalObData.twinA?.sdpCm || '4.2'} cm. EFW: ${finalObData.twinA?.efw || '1100'} grams. Anatomic scan normal.</p>
          <p><strong>Twin B:</strong> ${fhrB}. Presentation: ${finalObData.twinB?.presentation || 'Breech'}. SDP: ${finalObData.twinB?.sdpCm || '4.0'} cm. EFW: ${finalObData.twinB?.efw || '1050'} grams. Anatomic scan normal.</p>
          ${finalObData.twinDiscordancePercent ? `<p><strong>Twin Discordance:</strong> ${finalObData.twinDiscordancePercent}</p>` : ''}
          ${dopplerHtml}
        </div>`;

        impressionHtml = `normal second trimester twin pregnancy (${chor})`;
      }
      // THIRD TRIMESTER SINGLETON
      else if (tri === 'Third' && gest === 'Single') {
        const gaStr = finalObData.gaWeeks2 ? `${finalObData.gaWeeks2} weeks + ${finalObData.gaDays2 || '0'} days` : '32 weeks + 1 day';
        const efwStr = finalObData.efwSingle ? `${finalObData.efwSingle} grams` : '1950 grams';
        const placLoc = finalObData.placentaLocationSingle || 'Fundal anterior';
        const pres = finalObData.presentationSingle || 'Cephalic';
        const afStr = `${finalObData.afMethodSingle || 'SDP'}: ${finalObData.afValueSingle || '4.2'} cm`;
        const flAcStr = finalObData.flAcRatio || '21%';

        const bpp = finalObData.bppSingle || { breathing: 2, movement: 2, tone: 2, afScore: 2, sdp: '4.2' };
        const bppCalc = calculateBPPScore(bpp.breathing, bpp.movement, bpp.tone, bpp.afScore);

        let dopplerHtml = '';
        if (finalObData.dopplerEnabled) {
          dopplerHtml = `<p><strong>Doppler Study:</strong> UAD: ${finalObData.dopplerUAD || 'Normal'}, MCAD: ${finalObData.dopplerMCAD || 'Normal'}. Indices: ${finalObData.dopplerIndices || 'Normal indices'}.</p>`;
        }

        let anatHtml = '';
        if (finalObData.anatomicSurvey !== 'No') {
          anatHtml = `<p><strong>Anatomy Scan:</strong> ${finalObData.anatomyScanText || 'Fetal anatomy scan morphologically normal.'}</p>`;
        }

        findingsHtml = `<div class="space-y-2">
          <p><strong>Gestational Scan:</strong> Single intrauterine pregnancy.</p>
          <p><strong>Fetal Cardiac Activity:</strong> ${fhr}.</p>
          <p><strong>Gestational Age:</strong> ${gaStr}.</p>
          <p><strong>Placenta Location:</strong> ${placLoc}.</p>
          <p><strong>Presentation:</strong> ${pres}.</p>
          <p><strong>Amniotic Fluid (SDP/AFI):</strong> ${afStr}.</p>
          <p><strong>FL / AC Ratio:</strong> ${flAcStr}.</p>
          <p><strong>Estimated Fetal Weight (EFW):</strong> ${efwStr}.</p>
          ${anatHtml}
          <p><strong>Biophysical Profile (BPP):</strong> Fetal Tone (${bpp.tone}), Gross Body Movement (${bpp.movement}), Fetal Breathing Movement (${bpp.breathing}), SDP > 1cm (${bpp.afScore}) &rarr; Total BPP Score: <strong>${bppCalc.score}/8</strong>.</p>
          ${dopplerHtml}
        </div>`;

        impressionHtml = `third trimester pregnancy + reassuring biophysical profile (${bppCalc.score}/8)`;
      }
      // THIRD TRIMESTER TWIN
      else {
        const chor = finalObData.chorionicity || 'DCDA';
        const placType = finalObData.twinPlacentaType || 'Two separate placentas';
        const placLoc = finalObData.twinPlacentaLocation || 'Fundal anterior';
        const mem = finalObData.twinMembrane || 'Dividing membrane is seen';
        const fhrA = finalObData.twinA?.fhrPositive !== false ? 'FHR positive' : 'FHR negative';
        const fhrB = finalObData.twinB?.fhrPositive !== false ? 'FHR positive' : 'FHR negative';

        const bppA = finalObData.twinA?.bpp || { breathing: 2, movement: 2, tone: 2, afScore: 2, sdp: '4.2' };
        const bppB = finalObData.twinB?.bpp || { breathing: 2, movement: 2, tone: 2, afScore: 2, sdp: '4.0' };

        const scoreA = calculateBPPScore(bppA.breathing, bppA.movement, bppA.tone, bppA.afScore).score;
        const scoreB = calculateBPPScore(bppB.breathing, bppB.movement, bppB.tone, bppB.afScore).score;

        let dopplerHtml = '';
        if (finalObData.dopplerEnabled) {
          dopplerHtml = `<p><strong>Doppler Study:</strong> UAD: ${finalObData.dopplerUAD || 'Normal'}, MCAD: ${finalObData.dopplerMCAD || 'Normal'}. Indices: ${finalObData.dopplerIndices || 'Normal indices'}.</p>`;
        }

        findingsHtml = `<div class="space-y-2.5">
          <p><strong>Gestational Scan:</strong> Twin intrauterine pregnancy.</p>
          <p><strong>Membrane & Placenta:</strong> ${mem}. Chorionicity: ${chor}. Placenta: ${placType}. Location: ${placLoc}.</p>
          <p><strong>Twin A:</strong> ${fhrA}. Presentation: ${finalObData.twinA?.presentation || 'Cephalic'}. SDP: ${finalObData.twinA?.sdpCm || '4.2'} cm. Anatomic scan normal. BPP Score: <strong>${scoreA}/8</strong> (Tone: ${bppA.tone}, Movement: ${bppA.movement}, Breathing: ${bppA.breathing}, SDP: ${bppA.afScore}). FL/AC Ratio: ${finalObData.twinA?.flAcRatio || '21%'}. EFW: ${finalObData.twinA?.efw || '1850'} grams.</p>
          <p><strong>Twin B:</strong> ${fhrB}. Presentation: ${finalObData.twinB?.presentation || 'Breech'}. SDP: ${finalObData.twinB?.sdpCm || '4.0'} cm. Anatomic scan normal. BPP Score: <strong>${scoreB}/8</strong> (Tone: ${bppB.tone}, Movement: ${bppB.movement}, Breathing: ${bppB.breathing}, SDP: ${bppB.afScore}). FL/AC Ratio: ${finalObData.twinB?.flAcRatio || '21%'}. EFW: ${finalObData.twinB?.efw || '1780'} grams.</p>
          ${finalObData.twinDiscordancePercent ? `<p><strong>Twin Discordance:</strong> ${finalObData.twinDiscordancePercent}</p>` : ''}
          ${dopplerHtml}
        </div>`;

        impressionHtml = `3rd trimester twin pregnancy + ${chor} + reassuring biophysical profile for both`;
      }

    } else if (scanType === 'Abdominopelvic') {
      findingsTitle = 'Abdomino-Pelvic Ultrasound Examination';
      findingsHtml = `<div class="space-y-2">
        <p><strong>Liver:</strong> ${abdoData.liver}</p>
        <p><strong>Gallbladder:</strong> ${abdoData.gallbladder}</p>
        <p><strong>Spleen:</strong> ${abdoData.spleen}</p>
        <p><strong>Right Kidney:</strong> ${abdoData.rightKidney}</p>
        <p><strong>Left Kidney:</strong> ${abdoData.leftKidney}</p>
        <p><strong>Urinary Bladder:</strong> ${abdoData.bladder}</p>
        <p><strong>Uterus & Endometrium:</strong> ${abdoData.uterus} Endometrium: ${abdoData.endometrium}</p>
        <p><strong>Ovaries:</strong> Right: ${abdoData.rightOvary} Left: ${abdoData.leftOvary}</p>
      </div>`;
      impressionHtml = 'Normal abdominopelvic ultrasound survey. No organomegaly, hydronephrosis, or pelvic mass.';
    } else {
      findingsTitle = 'Female Pelvic Ultrasound Examination';
      findingsHtml = `<div class="space-y-2">
        <p><strong>Uterus:</strong> ${pelvicData.uterus}</p>
        <p><strong>Endometrium:</strong> ${pelvicData.endometrium}</p>
        <p><strong>Right Ovary:</strong> ${pelvicData.rightOvary}</p>
        <p><strong>Left Ovary:</strong> ${pelvicData.leftOvary}</p>
        <p><strong>Urinary Bladder:</strong> ${pelvicData.bladder}</p>
        <p><strong>Pouch of Douglas:</strong> ${pelvicData.pouchOfDouglas}</p>
      </div>`;
      impressionHtml = 'Normal pelvic ultrasound scan. Uterus and ovaries are morphologically within normal limits.';
    }

    const report: PatientReport = {
      id: reportId,
      patientName,
      patientAge,
      patientPhone,
      lmp,
      edd: lmpCalculation?.eddDate,
      gravida,
      parity,
      abortion,
      alive,
      obsOthers,
      createdAt: initialReport?.createdAt || new Date().toISOString(),
      type: scanType,
      obstetricData: scanType === 'Obstetric' ? finalObData : undefined,
      abdominopelvicData: scanType === 'Abdominopelvic' ? abdoData : undefined,
      pelvicData: scanType === 'Pelvic' ? pelvicData : undefined,
      requestedLabNames: finalLabNames,
      findingsTitle,
      findingsHtml,
      impressionHtml,
      commentText,
      doctorName: currentUser.name,
      doctorTitle: currentUser.title
    };

    onSaveReport(report, finalLabNames);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a6b2f] via-[#0e8f3e] to-[#0a6b2f] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-white p-0.5 shadow-xs flex items-center justify-center shrink-0">
              <ClinicLogo variant="emerald" className="w-full h-full" />
            </div>
            <h2 className="font-bold text-base tracking-wide">
              {initialReport ? 'Edit Patient Record & Requisition' : 'New Patient Intake & Order Entry'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Entry Mode Selector Tabs */}
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 shrink-0 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setEntryMode('both')}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
              entryMode === 'both'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Ultrasound & Laboratory
          </button>
          <button
            type="button"
            onClick={() => setEntryMode('ultrasound_only')}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
              entryMode === 'ultrasound_only'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Ultrasound Scan Only
          </button>
          <button
            type="button"
            onClick={() => setEntryMode('lab_only')}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all ${
              entryMode === 'lab_only'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Laboratory Request Only
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">

          {/* Section 1: Patient Demographics & LNMP */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              Patient Demographics & LNMP Dating
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Patient Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayan Axmed xasan"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  placeholder="e.g. 28"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp</label>
                <input
                  type="text"
                  placeholder="e.g. 063 4000000"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* LNMP and Auto EDD / GA */}
              <div className="sm:col-span-4 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">LNMP (Last Normal Menstrual Period)</label>
                    <input
                      type="date"
                      value={lmp}
                      onChange={(e) => setLmp(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-emerald-900"
                    />
                  </div>

                  {lmpCalculation ? (
                    <div className="sm:col-span-2 flex items-center justify-around bg-white p-2 rounded-lg border border-emerald-200 text-xs">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">GA by LNMP</span>
                        <span className="font-extrabold text-emerald-700 text-sm">{lmpCalculation.formattedGA}</span>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 block uppercase font-semibold">EDD (Estimated Due Date)</span>
                        <span className="font-extrabold text-indigo-700 text-sm">{lmpCalculation.eddDate}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="sm:col-span-2 text-slate-500 text-xs italic text-center py-1">
                      Enter LNMP date above to auto-calculate Gestational Age & EDD
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Sections for Ultrasound Scan (Only if entryMode is 'both' or 'ultrasound_only') */}
          {entryMode !== 'lab_only' && (
            <>
              {/* Section 2: Ultrasound Scan Type Selection */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Select Scan Category
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  {/* Obstetric */}
                  <button
                    type="button"
                    onClick={() => setScanType('Obstetric')}
                    className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      scanType === 'Obstetric'
                        ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Baby className={`w-6 h-6 ${scanType === 'Obstetric' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-xs">Obstetric</span>
                  </button>

                  {/* Abdominopelvic */}
                  <button
                    type="button"
                    onClick={() => setScanType('Abdominopelvic')}
                    className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      scanType === 'Abdominopelvic'
                        ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <HeartPulse className={`w-6 h-6 ${scanType === 'Abdominopelvic' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-xs">Abdomino-Pelvic</span>
                  </button>

                  {/* Pelvic */}
                  <button
                    type="button"
                    onClick={() => setScanType('Pelvic')}
                    className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      scanType === 'Pelvic'
                        ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Activity className={`w-6 h-6 ${scanType === 'Pelvic' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-xs">Pelvic</span>
                  </button>
                </div>
              </div>

              {/* Section 3: Dynamic Scan Specific Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h3 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>{scanType} Ultrasound Clinical Measurements</span>
                  <span className="text-xs font-normal text-slate-500">Edit fields below</span>
                </h3>

                {scanType === 'Obstetric' && (
                  <ObstetricForm data={obData} onChange={setObData} />
                )}

                {scanType === 'Abdominopelvic' && (
                  <AbdominopelvicForm data={abdoData} onChange={setAbdoData} />
                )}

                {scanType === 'Pelvic' && (
                  <PelvicForm data={pelvicData} onChange={setPelvicData} />
                )}
              </div>

              {/* Section 4: Extra Space for Clinical Comments & Recommendations */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Additional Comments & Doctor's Recommendations
                </h3>
                <textarea
                  rows={3}
                  placeholder="Enter any additional clinical notes, patient advice, or specific ultrasound observations..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </>
          )}

          {/* Section 5: Laboratory Requests (Only if entryMode is 'both' or 'lab_only') */}
          {entryMode !== 'ultrasound_only' && (
            <LabRequestSelector
              selectedTests={selectedLabs}
              onChangeSelectedTests={setSelectedLabs}
              otherText={otherLabText}
              onChangeOtherText={setOtherLabText}
            />
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <span>{entryMode === 'lab_only' ? 'Send Lab Requisition' : 'Generate Patient Report'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

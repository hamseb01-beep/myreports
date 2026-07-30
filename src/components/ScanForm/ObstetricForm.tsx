import React, { useEffect } from 'react';
import { 
  ObstetricData, 
  Trimester, 
  GestationCount, 
  Chorionicity, 
  FetalPresentation, 
  PlacentaLocation,
  TwinPlacentaType,
  DopplerIndicesOption,
  TwinDetails, 
  BPPData 
} from '../../types';
import { calculateTwinDiscordance, calculateBPPScore } from '../../utils/calculators';
import { Baby, Heart, Sparkles, Activity, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface ObstetricFormProps {
  data: ObstetricData;
  onChange: (updated: ObstetricData) => void;
}

const DEFAULT_BPP: BPPData = {
  breathing: 2,
  movement: 2,
  tone: 2,
  afScore: 2,
  sdp: '4.0'
};

const DEFAULT_TWIN: TwinDetails = {
  presentation: 'Cephalic',
  efw: '1100',
  ga: '28w0d',
  msdCm: '4.5',
  crlCm: '6.2',
  fhrPositive: true,
  anatomic: 'Normal',
  flAcRatio: '21%',
  sdpCm: '4.2',
  bpp: { ...DEFAULT_BPP }
};

export const ObstetricForm: React.FC<ObstetricFormProps> = ({ data, onChange }) => {
  
  // Ensure default fields are present
  useEffect(() => {
    if (data.gestationCount === 'Multiple') {
      if (!data.twinA) {
        onChange({
          ...data,
          twinA: { ...DEFAULT_TWIN, presentation: 'Cephalic' },
          twinB: { ...DEFAULT_TWIN, presentation: 'Breech' }
        });
      }
    }
  }, [data.gestationCount]);

  const updateTwin = (twinKey: 'twinA' | 'twinB', field: keyof TwinDetails, value: any) => {
    const currentTwin = data[twinKey] || { ...DEFAULT_TWIN };
    const updatedTwin = { ...currentTwin, [field]: value };
    
    // Auto calculate twin discordance if both EFWs exist
    const otherTwinKey = twinKey === 'twinA' ? 'twinB' : 'twinA';
    const otherEfw = data[otherTwinKey]?.efw ? parseFloat(data[otherTwinKey]!.efw) : 0;
    const thisEfw = updatedTwin.efw ? parseFloat(updatedTwin.efw) : 0;
    
    let discordanceText = data.twinDiscordancePercent || '';
    if (thisEfw > 0 && otherEfw > 0) {
      const disc = calculateTwinDiscordance(thisEfw, otherEfw);
      if (disc) discordanceText = `${disc.percent}% (${disc.interpretation})`;
    }

    onChange({
      ...data,
      [twinKey]: updatedTwin,
      twinDiscordancePercent: discordanceText
    });
  };

  const updateTwinBPP = (twinKey: 'twinA' | 'twinB', field: keyof BPPData, value: any) => {
    const currentTwin = data[twinKey] || { ...DEFAULT_TWIN };
    const currentBPP = currentTwin.bpp || { ...DEFAULT_BPP };
    const updatedBPP = { ...currentBPP, [field]: value };

    onChange({
      ...data,
      [twinKey]: {
        ...currentTwin,
        bpp: updatedBPP
      }
    });
  };

  const updateSingleBPP = (field: keyof BPPData, value: any) => {
    const currentBPP = data.bppSingle || { ...DEFAULT_BPP };
    const updatedBPP = { ...currentBPP, [field]: value };
    onChange({
      ...data,
      bppSingle: updatedBPP
    });
  };

  const PRESENTATION_OPTIONS: FetalPresentation[] = [
    'Cephalic',
    'Breech',
    'Transverse lie',
    'Oblique cephalic',
    'Oblique breech'
  ];

  const PLACENTA_LOCATION_OPTIONS: PlacentaLocation[] = [
    'Fundal anterior',
    'Fundal posterior',
    'Anterior not low lying',
    'Posterior not low lying',
    'Low lying (within 2 cm to cervix)'
  ];

  return (
    <div className="space-y-6 text-xs">

      {/* SECTION 1: OBSTETRIC HISTORY (G, P, A, L, Others) */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-emerald-900 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <Baby className="w-4 h-4 text-emerald-700" />
            Obstetric History (G, P, A, L)
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">Standard Clinic Header</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Gravida (G)</label>
            <input
              type="text"
              placeholder="e.g. 2"
              value={data.gravida || ''}
              onChange={(e) => onChange({ ...data, gravida: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Parity (P)</label>
            <input
              type="text"
              placeholder="e.g. 1"
              value={data.parity || ''}
              onChange={(e) => onChange({ ...data, parity: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Abortion (A)</label>
            <input
              type="text"
              placeholder="e.g. 0"
              value={data.abortion || ''}
              onChange={(e) => onChange({ ...data, abortion: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Alive (L)</label>
            <input
              type="text"
              placeholder="e.g. 1"
              value={data.alive || ''}
              onChange={(e) => onChange({ ...data, alive: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800 text-xs"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block font-bold text-slate-700 mb-1">Others (History Notes)</label>
            <input
              type="text"
              placeholder="e.g. Prev C-Section"
              value={data.obsOthers || ''}
              onChange={(e) => onChange({ ...data, obsOthers: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800 text-xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: TRIMESTER, GESTATION & FHR CONTROLS */}
      <div className={`grid grid-cols-1 ${data.gestationCount === 'Single' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200`}>
        
        {/* Trimester */}
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
            Trimester Stage
          </label>
          <div className="flex gap-2">
            {(['First', 'Second', 'Third'] as Trimester[]).map((tri) => (
              <button
                key={tri}
                type="button"
                onClick={() => onChange({ ...data, trimester: tri })}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-xs border transition-all ${
                  data.trimester === tri
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {tri}
              </button>
            ))}
          </div>
        </div>

        {/* Gestation Count */}
        <div>
          <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
            Gestation
          </label>
          <div className="flex gap-2">
            {(['Single', 'Multiple'] as GestationCount[]).map((gest) => (
              <button
                key={gest}
                type="button"
                onClick={() => onChange({ ...data, gestationCount: gest })}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-xs border transition-all ${
                  data.gestationCount === gest
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {gest === 'Multiple' ? 'Twin Pregnancy' : 'Single Pregnancy'}
              </button>
            ))}
          </div>
        </div>

        {/* Fetal Heart Rate (Only shown in Single Pregnancy since Twin A and B have individual FHRs) */}
        {data.gestationCount === 'Single' && (
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
              Fetal Heart Rate (FHR)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...data, fetalHeartRate: 'Positive' })}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-xs border transition-all ${
                  data.fetalHeartRate === 'Positive'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                FHR Positive
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...data, fetalHeartRate: 'Negative' })}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-xs border transition-all ${
                  data.fetalHeartRate === 'Negative'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                FHR Negative
              </button>
            </div>
          </div>
        )}

      </div>

      {/* SECTION 3: FIRST TRIMESTER (SINGLE OR TWIN) */}
      {data.trimester === 'First' && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
            <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              First Trimester Ultrasound Details
            </h4>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Max GA: 13 weeks + 6 days
            </span>
          </div>

          {/* If 1st Trimester SINGLE */}
          {data.gestationCount === 'Single' ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">MSD (cm)</label>
                <input
                  type="text"
                  placeholder="e.g. 2.4"
                  value={data.msdCm || ''}
                  onChange={(e) => onChange({ ...data, msdCm: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CRL (cm)</label>
                <input
                  type="text"
                  placeholder="e.g. 4.8"
                  value={data.crlCm || ''}
                  onChange={(e) => onChange({ ...data, crlCm: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GA (Weeks)</label>
                <input
                  type="number"
                  placeholder="e.g. 11"
                  value={data.gaWeeks1 || ''}
                  onChange={(e) => onChange({ ...data, gaWeeks1: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GA (Days)</label>
                <input
                  type="number"
                  placeholder="e.g. 4"
                  value={data.gaDays1 || ''}
                  onChange={(e) => onChange({ ...data, gaDays1: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                />
              </div>
            </div>
          ) : (
            /* If 1st Trimester TWIN */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-emerald-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Membrane / Sign Seen</label>
                  <select
                    value={data.twinSignSeen || 'Two members separated'}
                    onChange={(e) => onChange({ ...data, twinSignSeen: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="Two members separated">Two members separated</option>
                    <option value="Lambda sign">Lambda sign seen (DCDA)</option>
                    <option value="T sign">T sign seen (MCDA)</option>
                    <option value="Dividing membrane seen">Dividing membrane seen</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chorionicity</label>
                  <select
                    value={data.chorionicity || 'DCDA'}
                    onChange={(e) => onChange({ ...data, chorionicity: e.target.value as Chorionicity })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-indigo-900"
                  >
                    <option value="DCDA">DCDA (Dichorionic Diamniotic)</option>
                    <option value="MCDA">MCDA (Monochorionic Diamniotic)</option>
                    <option value="MCMA">MCMA (Monochorionic Monoamniotic)</option>
                    <option value="Unknown">Unknown Chorionicity</option>
                  </select>
                </div>
              </div>

              {/* Twin A & Twin B First Trimester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Twin A */}
                <div className="bg-white border-2 border-emerald-300 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between border-b pb-1 font-extrabold text-emerald-800 text-xs">
                    <span>TWIN A (1st Trimester)</span>
                    <select
                      value={data.twinA?.fhrPositive === false ? 'false' : 'true'}
                      onChange={(e) => updateTwin('twinA', 'fhrPositive', e.target.value === 'true')}
                      className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 rounded px-1.5 py-0.5"
                    >
                      <option value="true">FHR Positive</option>
                      <option value="false">FHR Negative</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600">MSD (cm)</label>
                      <input
                        type="text"
                        placeholder="e.g. 2.5"
                        value={data.twinA?.msdCm || ''}
                        onChange={(e) => updateTwin('twinA', 'msdCm', e.target.value)}
                        className="w-full border rounded p-1"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600">CRL (cm)</label>
                      <input
                        type="text"
                        placeholder="e.g. 4.6"
                        value={data.twinA?.crlCm || ''}
                        onChange={(e) => updateTwin('twinA', 'crlCm', e.target.value)}
                        className="w-full border rounded p-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-600">Gestational Age (weeks+days)</label>
                      <input
                        type="text"
                        placeholder="e.g. 11w 3d"
                        value={data.twinA?.ga || ''}
                        onChange={(e) => updateTwin('twinA', 'ga', e.target.value)}
                        className="w-full border rounded p-1 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Twin B */}
                <div className="bg-white border-2 border-indigo-300 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between border-b pb-1 font-extrabold text-indigo-800 text-xs">
                    <span>TWIN B (1st Trimester)</span>
                    <select
                      value={data.twinB?.fhrPositive === false ? 'false' : 'true'}
                      onChange={(e) => updateTwin('twinB', 'fhrPositive', e.target.value === 'true')}
                      className="text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-300 rounded px-1.5 py-0.5"
                    >
                      <option value="true">FHR Positive</option>
                      <option value="false">FHR Negative</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600">MSD (cm)</label>
                      <input
                        type="text"
                        placeholder="e.g. 2.4"
                        value={data.twinB?.msdCm || ''}
                        onChange={(e) => updateTwin('twinB', 'msdCm', e.target.value)}
                        className="w-full border rounded p-1"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600">CRL (cm)</label>
                      <input
                        type="text"
                        placeholder="e.g. 4.5"
                        value={data.twinB?.crlCm || ''}
                        onChange={(e) => updateTwin('twinB', 'crlCm', e.target.value)}
                        className="w-full border rounded p-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-600">Gestational Age (weeks+days)</label>
                      <input
                        type="text"
                        placeholder="e.g. 11w 2d"
                        value={data.twinB?.ga || ''}
                        onChange={(e) => updateTwin('twinB', 'ga', e.target.value)}
                        className="w-full border rounded p-1 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* SECTION 4: SECOND / THIRD TRIMESTER SINGLE PREGNANCY */}
      {data.trimester !== 'First' && data.gestationCount === 'Single' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="font-bold text-slate-800 text-xs">
              {data.trimester} Trimester Singleton Fetal Biometry & Placenta
            </h4>
            <span className="text-[11px] font-semibold text-slate-600">
              {data.trimester === 'Second' ? 'Max GA: 27 weeks + 6 days' : 'GA: 28+ weeks'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Gestational Age */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gestational Age (weeks + days)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Wks"
                  value={data.gaWeeks2 || ''}
                  onChange={(e) => onChange({ ...data, gaWeeks2: e.target.value })}
                  className="w-1/2 bg-white border border-slate-300 rounded p-2 text-xs font-bold"
                />
                <input
                  type="number"
                  placeholder="Days"
                  value={data.gaDays2 || ''}
                  onChange={(e) => onChange({ ...data, gaDays2: e.target.value })}
                  className="w-1/2 bg-white border border-slate-300 rounded p-2 text-xs"
                />
              </div>
            </div>

            {/* Estimated Fetal Weight */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Fetal Weight (EFW in grams)</label>
              <input
                type="number"
                placeholder="e.g. 1850"
                value={data.efwSingle || ''}
                onChange={(e) => onChange({ ...data, efwSingle: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-bold text-emerald-800"
              />
            </div>

            {/* Presentation */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Presentation</label>
              <select
                value={data.presentationSingle || 'Cephalic'}
                onChange={(e) => onChange({ ...data, presentationSingle: e.target.value as FetalPresentation })}
                className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-semibold text-slate-800"
              >
                {PRESENTATION_OPTIONS.map((pres) => (
                  <option key={pres} value={pres}>{pres}</option>
                ))}
              </select>
            </div>

            {/* Placenta Location */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Placenta Location</label>
              <select
                value={data.placentaLocationSingle || 'Fundal anterior'}
                onChange={(e) => onChange({ ...data, placentaLocationSingle: e.target.value as PlacentaLocation })}
                className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-semibold text-slate-800"
              >
                {PLACENTA_LOCATION_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* SDP or AFI */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">SDP or AFI (in cm)</label>
              <div className="flex gap-2">
                <select
                  value={data.afMethodSingle || 'SDP'}
                  onChange={(e) => onChange({ ...data, afMethodSingle: e.target.value as 'SDP' | 'AFI' })}
                  className="w-20 bg-white border border-slate-300 rounded p-2 text-xs font-bold"
                >
                  <option value="SDP">SDP</option>
                  <option value="AFI">AFI</option>
                </select>
                <input
                  type="text"
                  placeholder="e.g. 4.5"
                  value={data.afValueSingle || ''}
                  onChange={(e) => onChange({ ...data, afValueSingle: e.target.value })}
                  className="flex-1 bg-white border border-slate-300 rounded p-2 text-xs font-semibold"
                />
              </div>
            </div>

            {/* FL / AC Ratio */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">FL / AC Ratio</label>
              <input
                type="text"
                placeholder="e.g. 21% (Normal 20-24%)"
                value={data.flAcRatio || ''}
                onChange={(e) => onChange({ ...data, flAcRatio: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
              />
            </div>
          </div>

          {/* Biophysical Profile (BPP) for 3rd Trimester Single */}
          {data.trimester === 'Third' && (
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3">
              <h5 className="font-extrabold text-slate-800 text-xs flex items-center justify-between border-b pb-1.5">
                <span>Biophysical Profile (BPP) Assessment</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Score: {calculateBPPScore(
                    data.bppSingle?.breathing ?? 2,
                    data.bppSingle?.movement ?? 2,
                    data.bppSingle?.tone ?? 2,
                    data.bppSingle?.afScore ?? 2
                  ).score} / 8
                </span>
              </h5>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Fetal Tone (2 if seen)</label>
                  <select
                    value={data.bppSingle?.tone ?? 2}
                    onChange={(e) => updateSingleBPP('tone', Number(e.target.value))}
                    className="w-full bg-slate-50 border rounded p-1.5"
                  >
                    <option value={2}>Present (2)</option>
                    <option value={0}>Absent (0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Gross Movement (2 if seen)</label>
                  <select
                    value={data.bppSingle?.movement ?? 2}
                    onChange={(e) => updateSingleBPP('movement', Number(e.target.value))}
                    className="w-full bg-slate-50 border rounded p-1.5"
                  >
                    <option value={2}>Present (2)</option>
                    <option value={0}>Absent (0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Fetal Breathing (2 if seen)</label>
                  <select
                    value={data.bppSingle?.breathing ?? 2}
                    onChange={(e) => updateSingleBPP('breathing', Number(e.target.value))}
                    className="w-full bg-slate-50 border rounded p-1.5"
                  >
                    <option value={2}>Present (2)</option>
                    <option value={0}>Absent (0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">SDP (&gt;1cm score 2)</label>
                  <select
                    value={data.bppSingle?.afScore ?? 2}
                    onChange={(e) => updateSingleBPP('afScore', Number(e.target.value))}
                    className="w-full bg-slate-50 border rounded p-1.5"
                  >
                    <option value={2}>Normal &gt;1cm (2)</option>
                    <option value={0}>Decreased &le;1cm (0)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SECTION 5: SECOND / THIRD TRIMESTER TWIN PREGNANCY */}
      {data.trimester !== 'First' && data.gestationCount === 'Multiple' && (
        <div className="space-y-4">
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-indigo-900 text-xs flex items-center justify-between border-b border-indigo-200 pb-2">
              <span className="flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-indigo-600" />
                {data.trimester} Trimester Twin Membrane, Placenta & Chorionicity
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
                Twin Gestation
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chorionicity</label>
                <select
                  value={data.chorionicity || 'DCDA'}
                  onChange={(e) => onChange({ ...data, chorionicity: e.target.value as Chorionicity })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-indigo-900"
                >
                  <option value="DCDA">DCDA (Dichorionic Diamniotic)</option>
                  <option value="MCDA">MCDA (Monochorionic Diamniotic)</option>
                  <option value="MCMA">MCMA (Monochorionic Monoamniotic)</option>
                  <option value="Unknown">Unknown Chorionicity</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Placenta Structure</label>
                <select
                  value={data.twinPlacentaType || 'Two separate placentas'}
                  onChange={(e) => onChange({ ...data, twinPlacentaType: e.target.value as TwinPlacentaType })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                >
                  <option value="Two separate placentas">Two separate placentas</option>
                  <option value="Single fused placenta">Single fused placenta</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Placenta Location</label>
                <select
                  value={data.twinPlacentaLocation || 'Fundal anterior'}
                  onChange={(e) => onChange({ ...data, twinPlacentaLocation: e.target.value as PlacentaLocation })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                >
                  {PLACENTA_LOCATION_OPTIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dividing Membrane</label>
                <input
                  type="text"
                  value={data.twinMembrane || 'Dividing membrane is seen'}
                  onChange={(e) => onChange({ ...data, twinMembrane: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Twin A & Twin B Details Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* TWIN A */}
            <div className="bg-white border-2 border-emerald-300 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-extrabold text-emerald-800 text-xs">TWIN A (Presenting)</span>
                <select
                  value={data.twinA?.fhrPositive === false ? 'false' : 'true'}
                  onChange={(e) => updateTwin('twinA', 'fhrPositive', e.target.value === 'true')}
                  className="text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md px-2 py-0.5 cursor-pointer"
                >
                  <option value="true">FHR Positive</option>
                  <option value="false">FHR Negative</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600">Presentation</label>
                  <select
                    value={data.twinA?.presentation || 'Cephalic'}
                    onChange={(e) => updateTwin('twinA', 'presentation', e.target.value)}
                    className="w-full border rounded p-1.5 font-semibold text-xs"
                  >
                    {PRESENTATION_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600">EFW (Grams)</label>
                  <input
                    type="number"
                    value={data.twinA?.efw || ''}
                    onChange={(e) => updateTwin('twinA', 'efw', e.target.value)}
                    className="w-full border rounded p-1.5 font-bold text-emerald-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600">SDP (cm)</label>
                  <input
                    type="text"
                    value={data.twinA?.sdpCm || ''}
                    onChange={(e) => updateTwin('twinA', 'sdpCm', e.target.value)}
                    className="w-full border rounded p-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600">FL / AC Ratio</label>
                  <input
                    type="text"
                    value={data.twinA?.flAcRatio || '21%'}
                    onChange={(e) => updateTwin('twinA', 'flAcRatio', e.target.value)}
                    className="w-full border rounded p-1.5 text-xs"
                  />
                </div>
              </div>

              {/* Twin A BPP Score if 3rd Trimester */}
              {data.trimester === 'Third' && (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-2.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 border-b border-emerald-200 pb-1">
                    <span>Twin A BPP Profile</span>
                    <span>
                      {calculateBPPScore(
                        data.twinA?.bpp?.breathing ?? 2,
                        data.twinA?.bpp?.movement ?? 2,
                        data.twinA?.bpp?.tone ?? 2,
                        data.twinA?.bpp?.afScore ?? 2
                      ).score} / 8
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div>
                      <label className="text-slate-600">Tone (2)</label>
                      <select
                        value={data.twinA?.bpp?.tone ?? 2}
                        onChange={(e) => updateTwinBPP('twinA', 'tone', Number(e.target.value))}
                        className="w-full bg-white border rounded p-1"
                      >
                        <option value={2}>Present (2)</option>
                        <option value={0}>Absent (0)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600">Movement (2)</label>
                      <select
                        value={data.twinA?.bpp?.movement ?? 2}
                        onChange={(e) => updateTwinBPP('twinA', 'movement', Number(e.target.value))}
                        className="w-full bg-white border rounded p-1"
                      >
                        <option value={2}>Present (2)</option>
                        <option value={0}>Absent (0)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600">Breathing (2)</label>
                      <select
                        value={data.twinA?.bpp?.breathing ?? 2}
                        onChange={(e) => updateTwinBPP('twinA', 'breathing', Number(e.target.value))}
                        className="w-full bg-white border rounded p-1"
                      >
                        <option value={2}>Present (2)</option>
                        <option value={0}>Absent (0)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600">SDP (&gt;1cm = 2)</label>
                      <select
                        value={data.twinA?.bpp?.afScore ?? 2}
                        onChange={(e) => updateTwinBPP('twinA', 'afScore', Number(e.target.value))}
                        className="w-full bg-white border rounded p-1"
                      >
                        <option value={2}>Normal &gt;1cm (2)</option>
                        <option value={0}>Decreased (0)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TWIN B */}
            <div className="bg-white border-2 border-indigo-300 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-extrabold text-indigo-800 text-xs">TWIN B (Upper)</span>
                <select
                  value={data.twinB?.fhrPositive === false ? 'false' : 'true'}
                  onChange={(e) => updateTwin('twinB', 'fhrPositive', e.target.value === 'true')}
                  className="text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-md px-2 py-0.5 cursor-pointer"
                >
                  <option value="true">FHR Positive</option>
                  <option value="false">FHR Negative</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600">Presentation</label>
                  <select
                    value={data.twinB?.presentation || 'Breech'}
                    onChange={(e) => updateTwin('twinB', 'presentation', e.target.value)}
                    className="w-full border rounded p-1.5 font-semibold text-xs"
                  >
                    {PRESENTATION_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600">EFW (Grams)</label>
                  <input
                    type="number"
                    value={data.twinB?.efw || ''}
                    onChange={(e) => updateTwin('twinB', 'efw', e.target.value)}
                    className="w-full border rounded p-1.5 font-bold text-indigo-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600">SDP (cm)</label>
                  <input
                    type="text"
                    value={data.twinB?.sdpCm || ''}
                    onChange={(e) => updateTwin('twinB', 'sdpCm', e.target.value)}
                    className="w-full border rounded p-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600">FL / AC Ratio</label>
                  <input
                    type="text"
                    value={data.twinB?.flAcRatio || '21%'}
                    onChange={(e) => updateTwin('twinB', 'flAcRatio', e.target.value)}
                    className="w-full border rounded p-1.5 text-xs"
                  />
                </div>
              </div>

              {/* Twin B BPP Score if 3rd Trimester */}
              {data.trimester === 'Third' && (
                <div className="bg-indigo-50/60 border border-indigo-200 rounded-lg p-2.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900 border-b border-indigo-200 pb-1">
                    <span>Twin B BPP Profile</span>
                    <span>
                      {calculateBPPScore(
                        data.twinB?.bpp?.breathing ?? 2,
                        data.twinB?.bpp?.movement ?? 2,
                        data.twinB?.bpp?.tone ?? 2,
                        data.twinB?.bpp?.afScore ?? 2
                      ).score} / 8
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div>
                      <label className="text-slate-600">Tone (2)</label>
                      <select
                        value={data.twinB?.bpp?.tone ?? 2}
                        onChange={(e) => updateTwinBPP('twinB', 'tone', Number(e.target.value))}
                        className="w-full bg-white border rounded p-1"
                      >
                        <option value={2}>Present (2)</option>
                        <option value={0}>Absent (0)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600">Movement (2)</label>
                      <select
                        value={data.twinB?.bpp?.movement ?? 2}
                        onChange={(e) => updateTwinBPP('twinB', 'movement', Number(e.target.value))}
                        className="w-full bg-white border rounded p-1"
                      >
                        <option value={2}>Present (2)</option>
                        <option value={0}>Absent (0)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600">Breathing (2)</label>
                      <select
                        value={data.twinB?.bpp?.breathing ?? 2}
                        onChange={(e) => updateTwinBPP('twinB', 'breathing', Number(e.target.value))}
                        className="w-full bg-white border rounded p-1"
                      >
                        <option value={2}>Present (2)</option>
                        <option value={0}>Absent (0)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600">SDP (&gt;1cm = 2)</label>
                      <select
                        value={data.twinB?.bpp?.afScore ?? 2}
                        onChange={(e) => updateTwinBPP('twinB', 'afScore', Number(e.target.value))}
                        className="w-full bg-white border rounded p-1"
                      >
                        <option value={2}>Normal &gt;1cm (2)</option>
                        <option value={0}>Decreased (0)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SECTION 6: OPTIONAL DOPPLER STUDY MODULE (2ND & 3RD TRIMESTER) */}
      {data.trimester !== 'First' && (
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-sky-900 text-xs">
              <input
                type="checkbox"
                checked={!!data.dopplerEnabled}
                onChange={(e) => onChange({ ...data, dopplerEnabled: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
              <span>Include Feto-Maternal Doppler Study (Optional)</span>
            </label>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded">
              MCAD & UAD
            </span>
          </div>

          {data.dopplerEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-sky-200">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Umbilical Artery Doppler (UAD)</label>
                <input
                  type="text"
                  placeholder="e.g. RI: 0.58, PI: 0.92 (Normal forward diastolic flow)"
                  value={data.dopplerUAD || ''}
                  onChange={(e) => onChange({ ...data, dopplerUAD: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">MCA Doppler (MCAD)</label>
                <input
                  type="text"
                  placeholder="e.g. PSV: 42 cm/s, Normal resistance"
                  value={data.dopplerMCAD || ''}
                  onChange={(e) => onChange({ ...data, dopplerMCAD: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doppler Indices Findings</label>
                <select
                  value={data.dopplerIndices || 'Normal indices'}
                  onChange={(e) => onChange({ ...data, dopplerIndices: e.target.value as DopplerIndicesOption })}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-bold text-sky-900"
                >
                  <option value="Normal indices">Normal indices</option>
                  <option value="Raised EDF">Raised EDF</option>
                  <option value="AEDF (Absent End-Diastolic Flow)">AEDF (Absent End-Diastolic Flow)</option>
                  <option value="REDV (Reverse End-Diastolic Velocity)">REDV (Reverse End-Diastolic Velocity)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 7: ANATOMY SCAN (OPTIONAL) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 text-xs">
          <input
            type="checkbox"
            checked={data.anatomicSurvey !== 'No'}
            onChange={(e) => onChange({ ...data, anatomicSurvey: e.target.checked ? 'Yes' : 'No' })}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
          <span>Include Detailed Fetal Anatomy Survey</span>
        </label>
        {data.anatomicSurvey !== 'No' && (
          <input
            type="text"
            placeholder="e.g. Calvarium, brain structures, 4-chamber heart, spine, stomach bubble, kidneys & 4 extremities visualized and morphologically normal."
            value={data.anatomyScanText || 'Fetal anatomy survey appears morphologically normal for gestational age.'}
            onChange={(e) => onChange({ ...data, anatomyScanText: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-800"
          />
        )}
      </div>

    </div>
  );
};

import { PatientReport, LabRequest, StaffUser } from '../types';

export const STAFF_USERS: StaffUser[] = [
  {
    id: 'dr_khalid',
    name: 'Dr. Khalid Beergeel',
    role: 'doctor',
    title: 'Consultant OBGYN'
  },
  {
    id: 'mr_mohamed',
    name: 'Mr. Mohamed Omer',
    role: 'lab',
    title: 'Laboratory Technician'
  }
];

export const INITIAL_REPORTS: PatientReport[] = [
  {
    id: 'rep_twin_001',
    patientName: 'Ayan Axmed xasan',
    patientAge: '28',
    patientPhone: '063 4451234',
    lmp: '12 Nov 2025',
    edd: '19 Aug 2026',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    type: 'Obstetric',
    obstetricData: {
      trimester: 'Second',
      gestationCount: 'Multiple',
      fetalHeartRate: 'Positive',
      chorionicity: 'DCDA',
      twinPlacenta: 'Two separate placentas seen',
      twinMembrane: 'Inter-twin membrane clearly visualized (thick > 2mm)',
      placentalLocation: 'Twin A Anterior, Twin B Posterior Fundal',
      twinA: {
        presentation: 'Cephalic',
        efw: '1150',
        ga: '28w 2d',
        anatomic: 'Normal',
        doppler: 'Normal',
        bpp: {
          breathing: 2,
          movement: 2,
          tone: 2,
          afScore: 2,
          sdp: '4.5'
        }
      },
      twinB: {
        presentation: 'Breech',
        efw: '1080',
        ga: '27w 5d',
        anatomic: 'Normal',
        doppler: 'Normal',
        bpp: {
          breathing: 2,
          movement: 2,
          tone: 2,
          afScore: 2,
          sdp: '4.1'
        }
      },
      twinDiscordancePercent: '6.1%'
    },
    requestedLabNames: ['CBC', 'Urinalysis', 'OGTT', 'TSH', 'Vit D'],
    findingsTitle: 'Second Trimester Twin Obstetric Ultrasound',
    findingsHtml: `<div class="space-y-3">
      <p><strong>Number of Gestations:</strong> Dichorionic Diamniotic (DCDA) Twin Gestation. Inter-twin membrane identified.</p>
      <p><strong>Twin A (Lower / Presenting):</strong> Cephalic presentation. Fetal heart activity positive (142 bpm). EFW: 1150g (GA 28w2d). Normal fetal anatomy survey. Umbilical artery Doppler shows normal end-diastolic flow. SDP: 4.5 cm. BPP: 8/8 (Reassuring).</p>
      <p><strong>Twin B (Upper):</strong> Breech presentation. Fetal heart activity positive (148 bpm). EFW: 1080g (GA 27w5d). Normal fetal anatomy survey. Umbilical artery Doppler normal. SDP: 4.1 cm. BPP: 8/8 (Reassuring).</p>
      <p><strong>Growth Discordance:</strong> 6.1% (Concordant twin growth).</p>
    </div>`,
    impressionHtml: 'Viable Dichorionic Diamniotic (DCDA) Twin Gestation at ~28 weeks with reassuring biophysical profiles and concordant fetal growth.',
    commentText: 'Routine follow-up ultrasound scan recommended in 3 weeks to monitor twin fetal growth velocity.',
    doctorName: 'Dr. Khalid Beergeel',
    doctorTitle: 'Consultant OBGYN'
  },
  {
    id: 'rep_pelvic_002',
    patientName: 'Khadra Cismaan',
    patientAge: '32',
    patientPhone: '063 4128890',
    lmp: '02 Jul 2026',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    type: 'Pelvic',
    pelvicData: {
      uterus: 'Normal in size, anteverted, contour smooth. Myometrium exhibits homogeneous echotexture. No uterine leiomyoma or adenomyosis.',
      endometrium: 'Central, regular, triple-line appearance measuring 8.4 mm in thickness, within normal limits for proliferative phase.',
      rightOvary: 'Measures 3.1 x 2.2 cm (vol 7.8 mL). Multiple small peripheral follicles noted (< 10mm). No dominant cyst.',
      leftOvary: 'Measures 3.0 x 2.0 cm (vol 6.5 mL). Normal follicular pattern.',
      bladder: 'Well distended with smooth mucosal lining. No calculus, mass, or intraluminal debris.',
      pouchOfDouglas: 'No free fluid in the cul-de-sac.'
    },
    requestedLabNames: ['LH', 'FSH', 'Prolactin', 'AMH', 'TSH'],
    findingsTitle: 'Female Pelvic Ultrasound Survey',
    findingsHtml: `<div class="space-y-2">
      <p><strong>Uterus:</strong> Anteverted, measuring 7.5 x 4.2 x 3.8 cm. Homogeneous myometrium with no focal masses.</p>
      <p><strong>Endometrium:</strong> Central, triple-layer appearance measuring 8.4 mm.</p>
      <p><strong>Ovaries:</strong> Both ovaries normal in position, volume, and echotexture. Bilateral mild polyfollicular appearance.</p>
      <p><strong>Pouch of Douglas:</strong> Clear, no free fluid.</p>
    </div>`,
    impressionHtml: 'Normal pelvic ultrasound. Mild polyfollicular ovarian morphology; correlate clinically with hormone profile.',
    commentText: 'Hormone panel requested (LH, FSH, AMH, Prolactin, TSH).',
    doctorName: 'Dr. Khalid Beergeel',
    doctorTitle: 'Consultant OBGYN'
  },
  {
    id: 'rep_abdo_003',
    patientName: 'Caasha Cabdi Maxamed',
    patientAge: '41',
    patientPhone: '063 4889911',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    type: 'Abdominopelvic',
    abdominopelvicData: {
      liver: 'Normal in size and shape. Homogeneous parenchymal echotexture. No focal hepatic lesion or biliary dilatation.',
      gallbladder: 'Distended with thin wall (< 3mm). No gallstones, sludge, or pericholecystic fluid.',
      spleen: 'Normal size (9.8 cm) and homogeneous architecture.',
      rightKidney: 'Measures 10.2 cm in length. Normal corticomedullary differentiation. No hydronephrosis or renal calculus.',
      leftKidney: 'Measures 10.5 cm in length. Normal parenchyma and collecting system.',
      bladder: 'Adequately filled. Smooth wall outline.',
      uterus: 'Normal size, 8.0 x 4.5 cm. Smooth contour.',
      endometrium: 'Homogeneous, 6.2 mm thickness.',
      rightOvary: 'Normal appearance, 2.8 x 1.8 cm.',
      leftOvary: 'Normal appearance, 2.9 x 1.7 cm.',
      freeFluid: 'None'
    },
    requestedLabNames: ['sCr', 'BUN', 'GOT', 'GPT', 'Lipid panel', 'RBS'],
    findingsTitle: 'Abdomino-Pelvic Ultrasound Examination',
    findingsHtml: `<div class="space-y-2">
      <p><strong>Abdominal Organs:</strong> Liver, Gallbladder, Spleen, and Bilateral Kidneys are all within normal limits for age and morphology.</p>
      <p><strong>Pelvic Organs:</strong> Uterus and ovaries demonstrate normal ultrasound features. No pelvic masses or pelvic fluid collection.</p>
    </div>`,
    impressionHtml: 'Normal abdominopelvic ultrasound scan.',
    commentText: 'Renal and Liver Function Tests requested.',
    doctorName: 'Dr. Khalid Beergeel',
    doctorTitle: 'Consultant OBGYN'
  }
];

export const INITIAL_LAB_REQUESTS: LabRequest[] = [
  {
    id: 'lab_req_001',
    reportId: 'rep_twin_001',
    patientName: 'Ayan Axmed xasan',
    patientAge: '28',
    requestedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    requestedBy: 'Dr. Khalid Beergeel',
    tests: [
      {
        id: 't_cbc_1',
        name: 'CBC',
        result: 'Hb 12.4 g/dL, WBC 7.2k, PLT 240k',
        normalRange: 'Hb 12-16 g/dL, WBC 4-10, PLT 150-450k',
        flag: 'normal',
        completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        completedBy: 'Mr. Mohamed Omer'
      },
      {
        id: 't_uri_1',
        name: 'Urinalysis',
        result: 'Yellow, Clear, pH 6.0, Protein Neg, Leukocytes Neg, Nitrite Neg',
        normalRange: 'Normal urine analysis',
        flag: 'normal',
        completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        completedBy: 'Mr. Mohamed Omer'
      },
      {
        id: 't_ogtt_1',
        name: 'OGTT',
        result: 'Fasting 84, 1h 142, 2h 118 (Normal 75g OGTT)',
        normalRange: 'Fast <92, 1h <180, 2h <153 mg/dL',
        flag: 'normal',
        completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        completedBy: 'Mr. Mohamed Omer'
      },
      {
        id: 't_tsh_1',
        name: 'TSH',
        result: '1.85 mIU/L',
        normalRange: '0.4 – 4.0 mIU/L',
        flag: 'normal',
        completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        completedBy: 'Mr. Mohamed Omer'
      },
      {
        id: 't_vitd_1',
        name: 'Vit D',
        result: '18.4 ng/mL (Mild Deficiency)',
        normalRange: '30.0 – 100.0 ng/mL',
        flag: 'low',
        completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        completedBy: 'Mr. Mohamed Omer'
      }
    ]
  },
  {
    id: 'lab_req_002',
    reportId: 'rep_pelvic_002',
    patientName: 'Khadra Cismaan',
    patientAge: '32',
    requestedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    requestedBy: 'Dr. Khalid Beergeel',
    tests: [
      {
        id: 't_lh_2',
        name: 'LH',
        result: '14.2 IU/L (Elevated ratio)',
        normalRange: '2.0 – 12.0 IU/L',
        flag: 'high',
        completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        completedBy: 'Mr. Mohamed Omer'
      },
      {
        id: 't_fsh_2',
        name: 'FSH',
        result: '5.1 IU/L',
        normalRange: '3.0 – 10.0 IU/L',
        flag: 'normal',
        completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        completedBy: 'Mr. Mohamed Omer'
      },
      {
        id: 't_prl_2',
        name: 'Prolactin',
        result: '14.8 ng/mL',
        normalRange: '5.0 – 25.0 ng/mL',
        flag: 'normal',
        completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        completedBy: 'Mr. Mohamed Omer'
      },
      {
        id: 't_amh_2',
        name: 'AMH',
        result: '5.8 ng/mL (High ovarian reserve / PCO pattern)',
        normalRange: '1.0 – 4.0 ng/mL',
        flag: 'high',
        completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        completedBy: 'Mr. Mohamed Omer'
      },
      {
        id: 't_tsh_2',
        name: 'TSH',
        result: '2.10 mIU/L',
        normalRange: '0.4 – 4.0 mIU/L',
        flag: 'normal',
        completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        completedBy: 'Mr. Mohamed Omer'
      }
    ]
  },
  {
    id: 'lab_req_003',
    reportId: 'rep_abdo_003',
    patientName: 'Caasha Cabdi Maxamed',
    patientAge: '41',
    requestedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    requestedBy: 'Dr. Khalid Beergeel',
    tests: [
      { id: 't_scr_3', name: 'sCr', result: null, normalRange: '0.5 – 1.0 mg/dL' },
      { id: 't_bun_3', name: 'BUN', result: null, normalRange: '7 – 20 mg/dL' },
      { id: 't_got_3', name: 'GOT', result: null, normalRange: '10 – 40 U/L' },
      { id: 't_gpt_3', name: 'GPT', result: null, normalRange: '7 – 35 U/L' },
      { id: 't_lip_3', name: 'Lipid panel', result: null, normalRange: 'Chol <200, Trig <150' },
      { id: 't_rbs_3', name: 'RBS', result: null, normalRange: '70 – 140 mg/dL' }
    ]
  }
];

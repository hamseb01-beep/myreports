export type Role = 'doctor' | 'lab';

export interface StaffUser {
  id: string;
  name: string;
  role: Role;
  title: string;
}

export type UltrasoundType = 'Obstetric' | 'Abdominopelvic' | 'Pelvic';

export type Trimester = 'First' | 'Second' | 'Third';
export type GestationCount = 'Single' | 'Multiple';
export type Chorionicity = 'DCDA' | 'MCDA' | 'MCMA' | 'Unknown';
export type FetalPresentation = 
  | 'Cephalic' 
  | 'Breech' 
  | 'Transverse lie' 
  | 'Oblique cephalic' 
  | 'Oblique breech';

export type PlacentaLocation = 
  | 'Fundal anterior'
  | 'Fundal posterior'
  | 'Anterior not low lying'
  | 'Posterior not low lying'
  | 'Low lying (within 2 cm to cervix)';

export type TwinPlacentaType = 
  | 'Two separate placentas'
  | 'Single fused placenta';

export type DopplerIndicesOption = 
  | 'Normal indices'
  | 'Raised EDF'
  | 'AEDF (Absent End-Diastolic Flow)'
  | 'REDV (Reverse End-Diastolic Velocity)';

export interface BPPData {
  breathing: number; // 0 or 2
  movement: number; // 0 or 2
  tone: number; // 0 or 2
  afScore: number; // 0 or 2
  sdp: string; // e.g., "3.2"
}

export interface TwinDetails {
  presentation: FetalPresentation;
  efw: string; // grams
  ga: string; // e.g., "28w3d"
  msdCm?: string;
  crlCm?: string;
  fhrPositive?: boolean;
  anatomic: 'Normal' | 'Abnormal';
  doppler?: string;
  flAcRatio?: string;
  sdpCm?: string;
  bpp: BPPData;
}

export interface ObstetricData {
  trimester: Trimester;
  gestationCount: GestationCount;
  fetalHeartRate: 'Positive' | 'Negative';
  fhrBpm?: string;
  
  // Obstetric History
  gravida?: string;
  parity?: string;
  abortion?: string;
  alive?: string;
  obsOthers?: string;

  // First trimester
  firstTriPole?: 'Yes' | 'No';
  crlCm?: string;
  msdCm?: string;
  gaWeeks1?: string;
  gaDays1?: string;
  
  // First trimester Twin
  twinSignSeen?: 'Lambda sign' | 'T sign' | 'Two members separated' | 'Dividing membrane seen';
  
  // Second/Third Trimester Single
  gaWeeks2?: string;
  gaDays2?: string;
  efwSingle?: string;
  presentationSingle?: FetalPresentation;
  placentaLocationSingle?: PlacentaLocation;
  afMethodSingle?: 'SDP' | 'AFI';
  afValueSingle?: string;
  flAcRatio?: string;
  bppSingle?: BPPData;
  anatomicSurvey?: 'Yes' | 'No';
  anatomyScanText?: string;
  
  // Doppler Option
  dopplerEnabled?: boolean;
  dopplerUAD?: string;
  dopplerMCAD?: string;
  dopplerIndices?: DopplerIndicesOption;

  // Twin Scan
  chorionicity?: Chorionicity;
  twinPlacentaType?: TwinPlacentaType;
  twinPlacentaLocation?: PlacentaLocation;
  twinMembrane?: string;
  twinA?: TwinDetails;
  twinB?: TwinDetails;
  twinDiscordancePercent?: string;
}

export interface AbdominopelvicData {
  liver: string;
  gallbladder: string;
  spleen: string;
  rightKidney: string;
  leftKidney: string;
  bladder: string;
  uterus: string;
  endometrium: string;
  rightOvary: string;
  leftOvary: string;
  freeFluid?: string;
}

export interface PelvicData {
  uterus: string;
  endometrium: string;
  rightOvary: string;
  leftOvary: string;
  bladder: string;
  pouchOfDouglas: string;
}

export interface LabTestItem {
  id: string;
  name: string;
  result: string | null;
  unit?: string;
  normalRange?: string;
  flag?: 'normal' | 'high' | 'low' | 'abnormal';
  images?: string[]; // Base64 or URLs
  completedAt?: string;
  completedBy?: string;
}

export interface LabRequest {
  id: string;
  reportId: string;
  patientName: string;
  patientAge: string;
  requestedAt: string;
  requestedBy: string;
  tests: LabTestItem[];
  otherNotes?: string;
}

export interface PatientReport {
  id: string;
  patientName: string;
  patientAge: string;
  patientPhone?: string;
  lmp?: string;
  edd?: string;
  gravida?: string;
  parity?: string;
  abortion?: string;
  alive?: string;
  obsOthers?: string;
  createdAt: string;
  type: UltrasoundType;
  
  obstetricData?: ObstetricData;
  abdominopelvicData?: AbdominopelvicData;
  pelvicData?: PelvicData;
  
  labRequestIds?: string[];
  requestedLabNames?: string[];
  
  findingsTitle?: string;
  findingsHtml: string;
  additionalNotesHtml?: string;
  impressionHtml: string;
  commentText?: string;
  
  doctorName: string;
  doctorTitle: string;
}

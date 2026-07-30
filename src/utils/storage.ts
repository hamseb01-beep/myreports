import { PatientReport, LabRequest } from '../types';
import { INITIAL_REPORTS, INITIAL_LAB_REQUESTS } from '../data/sampleData';

const STORAGE_KEY_REPORTS = 'beergeel_clinic_reports_v2';
const STORAGE_KEY_LABS = 'beergeel_clinic_labs_v2';

export function getSavedReports(): PatientReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REPORTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse reports from localStorage', e);
  }
  // Fallback to initial sample data
  saveReports(INITIAL_REPORTS);
  return INITIAL_REPORTS;
}

export function saveReports(reports: PatientReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports to localStorage', e);
  }
}

export function getSavedLabRequests(): LabRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LABS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse lab requests from localStorage', e);
  }
  saveLabRequests(INITIAL_LAB_REQUESTS);
  return INITIAL_LAB_REQUESTS;
}

export function saveLabRequests(labs: LabRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LABS, JSON.stringify(labs));
  } catch (e) {
    console.error('Failed to save lab requests to localStorage', e);
  }
}

export function resetToSampleData(): { reports: PatientReport[]; labRequests: LabRequest[] } {
  saveReports(INITIAL_REPORTS);
  saveLabRequests(INITIAL_LAB_REQUESTS);
  return { reports: INITIAL_REPORTS, labRequests: INITIAL_LAB_REQUESTS };
}

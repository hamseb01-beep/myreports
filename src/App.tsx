import React, { useState, useEffect } from 'react';
import { StaffUser, PatientReport, LabRequest, LabTestItem } from './types';
import { STAFF_USERS } from './data/sampleData';
import { getSavedReports, saveReports, getSavedLabRequests, saveLabRequests, resetToSampleData } from './utils/storage';
import { Header } from './components/Header';
import { DoctorDashboard } from './components/DoctorDashboard';
import { LabDashboard } from './components/LabDashboard';
import { PatientIntakeModal } from './components/PatientIntakeModal';
import { ReportViewer } from './components/ReportViewer';
import { CalculatorsModal } from './components/CalculatorsModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { ClinicLogo } from './components/ClinicLogo';

export default function App() {
  // Staff Role State
  const [currentUser, setCurrentUser] = useState<StaffUser>(STAFF_USERS[0]); // Default Dr. Khalid

  // Patient Reports & Labs State
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);

  // Navigation & Modals
  const [activeReport, setActiveReport] = useState<PatientReport | null>(null);
  const [isNewScanModalOpen, setIsNewScanModalOpen] = useState<boolean>(false);
  const [editingReport, setEditingReport] = useState<PatientReport | null>(null);
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState<boolean>(false);

  // Lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>('');

  // Initial Load from LocalStorage / Sample Data
  useEffect(() => {
    const loadedReports = getSavedReports();
    const loadedLabs = getSavedLabRequests();
    setReports(loadedReports);
    setLabRequests(loadedLabs);
  }, []);

  // Save changes to storage whenever reports or lab requests update
  const handleUpdateReports = (updatedReports: PatientReport[]) => {
    setReports(updatedReports);
    saveReports(updatedReports);
  };

  const handleUpdateLabs = (updatedLabs: LabRequest[]) => {
    setLabRequests(updatedLabs);
    saveLabRequests(updatedLabs);
  };

  // Reset Sample Data
  const handleResetData = () => {
    if (confirm('Reset application data to initial sample clinic records?')) {
      const { reports: r, labRequests: l } = resetToSampleData();
      setReports(r);
      setLabRequests(l);
      setActiveReport(null);
      setIsNewScanModalOpen(false);
      alert('✅ Clinic records reset to default sample data.');
    }
  };

  // Save new or updated patient scan report
  const handleSaveReportFromIntake = (newReport: PatientReport, requestedLabNames: string[]) => {
    // Check if updating existing
    const existingIndex = reports.findIndex((r) => r.id === newReport.id);
    let updatedReportsList: PatientReport[];

    if (existingIndex >= 0) {
      updatedReportsList = [...reports];
      updatedReportsList[existingIndex] = newReport;
    } else {
      updatedReportsList = [newReport, ...reports];
    }

    handleUpdateReports(updatedReportsList);

    // If laboratory tests were requested, add or update a LabRequest
    if (requestedLabNames && requestedLabNames.length > 0) {
      const existingLabIndex = labRequests.findIndex((l) => l.reportId === newReport.id);
      
      const newTests: LabTestItem[] = requestedLabNames.map((name) => {
        // preserve existing result if test was already created
        const prevTest = existingLabIndex >= 0 ? labRequests[existingLabIndex].tests.find((t) => t.name === name) : null;
        return {
          id: prevTest?.id || `t_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name,
          result: prevTest?.result || null,
          normalRange: prevTest?.normalRange,
          images: prevTest?.images || [],
          flag: prevTest?.flag || 'normal'
        };
      });

      const labReqItem: LabRequest = {
        id: existingLabIndex >= 0 ? labRequests[existingLabIndex].id : `lab_${Date.now()}`,
        reportId: newReport.id,
        patientName: newReport.patientName,
        patientAge: newReport.patientAge,
        requestedAt: new Date().toISOString(),
        requestedBy: currentUser.name,
        tests: newTests
      };

      let updatedLabList: LabRequest[];
      if (existingLabIndex >= 0) {
        updatedLabList = [...labRequests];
        updatedLabList[existingLabIndex] = labReqItem;
      } else {
        updatedLabList = [labReqItem, ...labRequests];
      }

      handleUpdateLabs(updatedLabList);
    }

    setIsNewScanModalOpen(false);
    setEditingReport(null);
    setActiveReport(newReport);
  };

  // Doctor updates report directly from report viewer
  const handleSaveEditedReport = (updatedReport: PatientReport) => {
    const updatedList = reports.map((r) => (r.id === updatedReport.id ? updatedReport : r));
    handleUpdateReports(updatedList);
    setActiveReport(updatedReport);
  };

  // Doctor deletes report
  const handleDeleteReport = (reportId: string) => {
    if (confirm('Delete this report permanently?')) {
      const updatedReports = reports.filter((r) => r.id !== reportId);
      const updatedLabs = labRequests.filter((l) => l.reportId !== reportId);
      handleUpdateReports(updatedReports);
      handleUpdateLabs(updatedLabs);
      if (activeReport?.id === reportId) setActiveReport(null);
    }
  };

  // Lab Tech updates lab test results
  const handleSaveLabResults = (reqId: string, updatedTests: LabTestItem[]) => {
    const updatedLabs = labRequests.map((l) => {
      if (l.id === reqId) {
        return { ...l, tests: updatedTests };
      }
      return l;
    });
    handleUpdateLabs(updatedLabs);
  };

  // Lab Tech deletes lab request
  const handleDeleteLabRequest = (reqId: string) => {
    if (confirm('Delete this lab request?')) {
      const updatedLabs = labRequests.filter((l) => l.id !== reqId);
      handleUpdateLabs(updatedLabs);
    }
  };

  // Open Lightbox
  const handleOpenLightbox = (imageUrl: string, title?: string) => {
    setLightboxImage(imageUrl);
    setLightboxTitle(title || 'Attachment Preview');
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] font-sans text-slate-800 flex flex-col antialiased">
      
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        onOpenNewScan={() => {
          setEditingReport(null);
          setIsNewScanModalOpen(true);
        }}
        onOpenCalculators={() => setIsCalculatorsOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Screen Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* If viewing a report */}
        {activeReport ? (
          <ReportViewer
            report={activeReport}
            labRequest={labRequests.find((l) => l.reportId === activeReport.id || l.patientName === activeReport.patientName)}
            onBack={() => setActiveReport(null)}
            onSaveReport={handleSaveEditedReport}
            onOpenLightbox={handleOpenLightbox}
          />
        ) : (
          /* Role View: Doctor vs Lab Tech */
          currentUser.role === 'doctor' ? (
            <DoctorDashboard
              reports={reports}
              labRequests={labRequests}
              onOpenNewScan={() => {
                setEditingReport(null);
                setIsNewScanModalOpen(true);
              }}
              onViewReport={setActiveReport}
              onEditReport={(rep) => {
                setEditingReport(rep);
                setIsNewScanModalOpen(true);
              }}
              onDeleteReport={handleDeleteReport}
              currentUser={currentUser}
            />
          ) : (
            <LabDashboard
              labRequests={labRequests}
              onSaveLabResults={handleSaveLabResults}
              onDeleteLabRequest={handleDeleteLabRequest}
              onOpenLightbox={handleOpenLightbox}
              currentUser={currentUser}
            />
          )
        )}

      </main>

      {/* Patient Intake / Edit Scan Modal */}
      <PatientIntakeModal
        isOpen={isNewScanModalOpen}
        onClose={() => {
          setIsNewScanModalOpen(false);
          setEditingReport(null);
        }}
        onSaveReport={handleSaveReportFromIntake}
        currentUser={currentUser}
        initialReport={editingReport}
      />

      {/* Clinical Calculators Modal */}
      <CalculatorsModal
        isOpen={isCalculatorsOpen}
        onClose={() => setIsCalculatorsOpen(false)}
      />

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        imageUrl={lightboxImage}
        title={lightboxTitle}
        onClose={() => setLightboxImage(null)}
      />

      {/* App Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-6 border-t border-slate-800 text-center mt-auto print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center justify-center gap-2">
            <ClinicLogo variant="light" className="w-4 h-4 text-emerald-400" />
            <span>&copy; {new Date().getFullYear()} Beergeel Clinic — OBGYN Ultrasound & Diagnostic Laboratory System</span>
          </div>
          <span className="text-slate-500 font-medium">Dr. Khalid Beergeel (OBGYN) | Mr. Mohamed Omer (Lab)</span>
        </div>
      </footer>

    </div>
  );
}

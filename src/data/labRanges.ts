export interface TestRangeInfo {
  name: string;
  category: 'Hematology' | 'Endocrine' | 'Renal' | 'Hepatic' | 'Pregnancy/Serology' | 'Metabolic/Lipid' | 'General';
  normalRange: string;
  unit?: string;
}

export const LAB_TEST_REFERENCE_RANGES: Record<string, TestRangeInfo> = {
  'CBC': { name: 'CBC', category: 'Hematology', normalRange: 'WBC 4-10, Hb 12-16 g/dL, PLT 150-450k', unit: 'Various' },
  'Urinalysis': { name: 'Urinalysis', category: 'General', normalRange: 'Yellow, Clear, pH 5-8, Protein Neg, Gluc Neg', unit: 'Qualitative' },
  'LH': { name: 'LH', category: 'Endocrine', normalRange: '2.0 – 12.0', unit: 'IU/L' },
  'FSH': { name: 'FSH', category: 'Endocrine', normalRange: '3.0 – 10.0', unit: 'IU/L' },
  'TSH': { name: 'TSH', category: 'Endocrine', normalRange: '0.4 – 4.0', unit: 'mIU/L' },
  'E2': { name: 'E2', category: 'Endocrine', normalRange: '30 – 120 (Follicular)', unit: 'pg/mL' },
  'T3': { name: 'T3', category: 'Endocrine', normalRange: '2.3 – 4.2', unit: 'pg/mL' },
  'T4': { name: 'T4', category: 'Endocrine', normalRange: '0.8 – 1.8', unit: 'ng/dL' },
  'BHCT': { name: 'BHCT', category: 'Pregnancy/Serology', normalRange: '< 5 Non-pregnant; > 25 Positive', unit: 'mIU/mL' },
  'Urine pregnancy': { name: 'Urine pregnancy', category: 'Pregnancy/Serology', normalRange: 'Negative', unit: 'Qualitative' },
  'Serum pregnancy': { name: 'Serum pregnancy', category: 'Pregnancy/Serology', normalRange: 'Negative', unit: 'Qualitative' },
  'Prolactin': { name: 'Prolactin', category: 'Endocrine', normalRange: '5.0 – 25.0', unit: 'ng/mL' },
  'Progesterone': { name: 'Progesterone', category: 'Endocrine', normalRange: '< 1.5 Follicular; > 10.0 Mid-luteal', unit: 'ng/mL' },
  'Testosterone': { name: 'Testosterone', category: 'Endocrine', normalRange: '15 – 70', unit: 'ng/dL' },
  'AMH': { name: 'AMH', category: 'Endocrine', normalRange: '1.0 – 4.0', unit: 'ng/mL' },
  'sCr': { name: 'sCr', category: 'Renal', normalRange: '0.5 – 1.0', unit: 'mg/dL' },
  'BUN': { name: 'BUN', category: 'Renal', normalRange: '7 – 20', unit: 'mg/dL' },
  'GOT': { name: 'GOT', category: 'Hepatic', normalRange: '10 – 40', unit: 'U/L' },
  'GPT': { name: 'GPT', category: 'Hepatic', normalRange: '7 – 35', unit: 'U/L' },
  'Bilirubin total': { name: 'Bilirubin total', category: 'Hepatic', normalRange: '0.3 – 1.2', unit: 'mg/dL' },
  'Bilirubin indirect': { name: 'Bilirubin indirect', category: 'Hepatic', normalRange: '0.2 – 0.8', unit: 'mg/dL' },
  'Vit D': { name: 'Vit D', category: 'Metabolic/Lipid', normalRange: '30.0 – 100.0', unit: 'ng/mL' },
  'Lipid panel': { name: 'Lipid panel', category: 'Metabolic/Lipid', normalRange: 'Chol <200, Trig <150, HDL >50', unit: 'mg/dL' },
  'Total cholesterol': { name: 'Total cholesterol', category: 'Metabolic/Lipid', normalRange: '< 200', unit: 'mg/dL' },
  'LDH': { name: 'LDH', category: 'Hepatic', normalRange: '140 – 280', unit: 'U/L' },
  'Triglyceride': { name: 'Triglyceride', category: 'Metabolic/Lipid', normalRange: '< 150', unit: 'mg/dL' },
  'Stool examination': { name: 'Stool examination', category: 'General', normalRange: 'No ova, parasites, or RBCs', unit: 'Qualitative' },
  'RBS': { name: 'RBS', category: 'Metabolic/Lipid', normalRange: '70 – 140', unit: 'mg/dL' },
  'OGTT': { name: 'OGTT', category: 'Metabolic/Lipid', normalRange: 'Fast <92, 1h <180, 2h <153', unit: 'mg/dL' },
  'HBA1c': { name: 'HBA1c', category: 'Metabolic/Lipid', normalRange: '< 5.7% Normal; 5.7-6.4% Prediabetes', unit: '%' }
};

export const ALL_LAB_OPTIONS = Object.keys(LAB_TEST_REFERENCE_RANGES);

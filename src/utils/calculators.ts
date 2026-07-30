/**
 * Clinical OBGYN Calculators for Beergeel Clinic
 */

export interface GAFromLMPResult {
  weeks: number;
  days: number;
  eddDate: string; // ISO or formatted
  formattedGA: string;
}

export function calculateGAAndEDDFromLMP(lmpDateStr: string): GAFromLMPResult | null {
  if (!lmpDateStr) return null;
  const lmp = new Date(lmpDateStr);
  if (isNaN(lmp.getTime())) return null;

  const today = new Date();
  const diffTime = today.getTime() - lmp.getTime();
  if (diffTime < 0) return null;

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  // EDD is LMP + 280 days
  const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
  const eddDateStr = edd.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return {
    weeks,
    days,
    eddDate: eddDateStr,
    formattedGA: `${weeks}w ${days}d`
  };
}

/**
 * Calculates Estimated Fetal Weight (Hadlock formula using BPD, HC, AC, FL in cm or mm)
 * Hadlock 4: Log10(EFW) = 1.3596 - (0.00386 * AC * FL) + (0.0064 * HC) + (0.00061 * BPD * AC) + (0.0424 * AC) + (0.174 * FL)
 */
export function calculateHadlockEFW(bpdCm: number, hcCm: number, acCm: number, flCm: number): number | null {
  if (!bpdCm || !hcCm || !acCm || !flCm) return null;
  const logEFW = 
    1.3596 - 
    (0.00386 * acCm * flCm) + 
    (0.0064 * hcCm) + 
    (0.00061 * bpdCm * acCm) + 
    (0.0424 * acCm) + 
    (0.174 * flCm);

  const efwGrams = Math.pow(10, logEFW);
  return Math.round(efwGrams);
}

/**
 * Calculates Twin Growth Discordance Percentage:
 * Discordance % = ((EFW_Larger - EFW_Smaller) / EFW_Larger) * 100
 */
export function calculateTwinDiscordance(efwAGrams: number, efwBGrams: number): {
  percent: number;
  largerTwin: 'Twin A' | 'Twin B' | 'Equal';
  interpretation: string;
} | null {
  if (!efwAGrams || !efwBGrams || efwAGrams <= 0 || efwBGrams <= 0) return null;

  const maxEfw = Math.max(efwAGrams, efwBGrams);
  const minEfw = Math.min(efwAGrams, efwBGrams);
  const diff = maxEfw - minEfw;
  const percent = Math.round((diff / maxEfw) * 1000) / 10;

  let largerTwin: 'Twin A' | 'Twin B' | 'Equal' = 'Equal';
  if (efwAGrams > efwBGrams) largerTwin = 'Twin A';
  else if (efwBGrams > efwAGrams) largerTwin = 'Twin B';

  let interpretation = 'Concordant growth (< 15%)';
  if (percent >= 25) {
    interpretation = 'Severe discordance (≥ 25%) - High risk for TTTS or selective IUGR';
  } else if (percent >= 15) {
    interpretation = 'Mild-moderate discordance (15% - 24%) - Monitor growth every 2 weeks';
  }

  return {
    percent,
    largerTwin,
    interpretation
  };
}

/**
 * Calculates Biophysical Profile (BPP) Score out of 8 (or 10 with NST)
 */
export function calculateBPPScore(breathing: number, movement: number, tone: number, afScore: number): {
  score: number;
  maxScore: number;
  status: 'Reassuring' | 'Equivocal' | 'Non-reassuring';
  recommendation: string;
} {
  const score = (breathing || 0) + (movement || 0) + (tone || 0) + (afScore || 0);
  const maxScore = 8;

  if (score >= 8) {
    return {
      score,
      maxScore,
      status: 'Reassuring',
      recommendation: 'Low risk of fetal asphyxia. Repeat testing per clinical protocol.'
    };
  } else if (score === 6) {
    return {
      score,
      maxScore,
      status: 'Equivocal',
      recommendation: 'Possible fetal compromise. Repeat test in 24 hours or evaluate delivery if term.'
    };
  } else {
    return {
      score,
      maxScore,
      status: 'Non-reassuring',
      recommendation: 'High risk of fetal hypoxia. Immediate obstetric consultation & management required.'
    };
  }
}

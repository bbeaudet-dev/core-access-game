export interface InfectionStep {
  glitchLevel: number;
  terminalText: string;
  delay: number;
  action?: 'tower-defense' | 'emergency-mode';
}

export const INFECTION_STEPS: InfectionStep[] = [
  {
    glitchLevel: 1,
    terminalText: '',
    delay: 0
  },
  {
    glitchLevel: 2,
    terminalText: 'Booting in emergency mode...',
    delay: 1000
  },
  {
    glitchLevel: 3,
    terminalText: 'Booting in emergency mode...\nDoing a self-analysis...',
    delay: 2500
  },
  {
    glitchLevel: 4,
    terminalText: 'Booting in emergency mode...\nDoing a self-analysis...\nSystem Status: INFECTED',
    delay: 4000
  },
  {
    glitchLevel: 5,
    terminalText: 'Booting in emergency mode...\n[SYSTEM] Self-analyzing...\n[SYSTEM] Status: INFECTED\nSeverity: CRITICAL',
    delay: 5500
  },
  {
    glitchLevel: 6,
    terminalText: 'Booting in emergency mode...\nDoing a self-analysis...\nSystem Status: INFECTED\nSeverity: CRITICAL\nSource: fake DOWNLOAD button, device infected with Spartan virus',
    delay: 7000
  },
  {
    glitchLevel: 0,
    terminalText: '',
    delay: 8000,
    action: 'tower-defense'
  }
];

export const TOTAL_INFECTION_TIME = 8000;

export function startInfectionSequence(
  setGlitchLevel: (level: number) => void,
  setTerminalText: (text: string) => void,
  onComplete: () => void
) {
  // Start infection
  setGlitchLevel(1);
  
  // Schedule each step
  INFECTION_STEPS.forEach((step, index) => {
    if (index === 0) return; // Skip the first step (already set)
    
    setTimeout(() => {
      setGlitchLevel(step.glitchLevel);
      setTerminalText(step.terminalText);
      
      // If this is the last step, schedule completion
      if (index === INFECTION_STEPS.length - 1) {
        setTimeout(() => {
          onComplete();
        }, TOTAL_INFECTION_TIME - step.delay);
      }
    }, step.delay);
  });
}

// Default export to satisfy Expo Router
export default INFECTION_STEPS;
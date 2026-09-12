import { useState, useEffect, useRef } from 'react';
import { 
  Footprints, Pause, Play, SkipForward, SkipBack, X, AlertTriangle, 
  CheckCircle2, Volume2, ShieldAlert, Navigation, ArrowLeft, ArrowRight, ArrowUp,
  Camera, Eye, Sparkles, Brain, Info
} from 'lucide-react';
import type { Route, Venue, AccessibilityProfile, Detection } from '@/types';
import { formatDistance, formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { VoiceGuidanceService } from '@/services/voice-guidance';
import { ACCESSIBILITY_PROFILES } from '@/data/profiles';

interface ActiveWalkingModeProps {
  route: Route;
  venue: Venue;
  profile: AccessibilityProfile;
  onEndWalking: () => void;
  onFloorChange: (floor: number) => void;
  onStepChange?: (stepIndex: number) => void;
}

interface ActiveAlert {
  severity: 'clear' | 'caution' | 'obstacle';
  headline: string;
  detail: string;
  direction?: 'LEFT' | 'RIGHT' | 'CENTER';
  distanceMeters?: number;
  objectName?: string;
}

const voiceService = new VoiceGuidanceService();

export function ActiveWalkingMode({
  route,
  venue,
  profile,
  onEndWalking,
  onFloorChange,
  onStepChange,
}: ActiveWalkingModeProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoWalking, setIsAutoWalking] = useState(true);
  const [simulatedObstacle, setSimulatedObstacle] = useState<Detection | null>(null);

  const currentStep = route.steps[currentStepIndex] || route.steps[0];
  const profileInfo = ACCESSIBILITY_PROFILES.find(p => p.id === profile);

  // Set voice service profile
  useEffect(() => {
    voiceService.setProfile(profile);
  }, [profile]);

  // Sync floor view with current step floor
  useEffect(() => {
    if (currentStep) {
      onFloorChange(currentStep.floor);
    }
  }, [currentStepIndex, currentStep, onFloorChange]);

  // Report step change to parent
  useEffect(() => {
    onStepChange?.(currentStepIndex);
  }, [currentStepIndex, onStepChange]);

  const distanceRemaining = route.steps
    .slice(currentStepIndex)
    .reduce((acc, step) => acc + (step.distance || 0), 0);
  const totalDistance = route.steps.reduce((acc, step) => acc + (step.distance || 0), 0);
  const progressPercent = totalDistance > 0 ? ((totalDistance - distanceRemaining) / totalDistance) * 100 : 0;

  // Simulated CV Obstacles trigger depending on step index
  useEffect(() => {
    if (currentStepIndex === 1) {
      setSimulatedObstacle({
        id: 'cv-det-1',
        label: 'Cleaning Cart',
        confidence: 0.94,
        bbox: { x: 300, y: 200, width: 150, height: 150 },
        accessibilityImpact: 'negative',
        impactDescription: 'Corridor partially obstructed 2m ahead in center.'
      });
    } else if (currentStepIndex === 2 && profile === 'visual_impairment') {
      setSimulatedObstacle({
        id: 'cv-det-2',
        label: 'Wet Floor Sign',
        confidence: 0.91,
        bbox: { x: 400, y: 250, width: 100, height: 120 },
        accessibilityImpact: 'negative',
        impactDescription: 'Slippery hazard detected directly in path.'
      });
    } else {
      setSimulatedObstacle(null);
    }
  }, [currentStepIndex, profile]);

  // Speak step whenever it changes if auto-walking or profile is visual/cognitive
  useEffect(() => {
    if (currentStep) {
      const alert = getAlertForCurrentState();
      const speakText = profile === 'visual_impairment' || profile === 'cognitive'
        ? `${alert.headline}. ${currentStep.instruction}`
        : currentStep.instruction;
      
      voiceService.speak(speakText);
    }
  }, [currentStepIndex]);

  // Auto-walk timer
  useEffect(() => {
    let timer: any = null;
    if (isAutoWalking) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < route.steps.length - 1) {
            return prev + 1;
          } else {
            setIsAutoWalking(false);
            return prev;
          }
        });
      }, 5000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoWalking, route.steps.length]);

  // Dynamic Profile-Adapted Alert Generator
  const getAlertForCurrentState = (): ActiveAlert => {
    // If a CV obstacle is detected
    if (simulatedObstacle) {
      if (profile === 'visual_impairment') {
        return {
          severity: 'obstacle',
          headline: `${simulatedObstacle.label.toUpperCase()} DETECTED`,
          detail: '2 m ahead • CENTER — Move slightly LEFT',
          direction: 'LEFT',
          distanceMeters: 2,
          objectName: simulatedObstacle.label
        };
      } else if (profile === 'wheelchair') {
        return {
          severity: 'obstacle',
          headline: `PATH OBSTRUCTED: ${simulatedObstacle.label.toUpperCase()}`,
          detail: 'Pathway width reduced (<90cm) — Reroute suggested or proceed with caution',
          direction: 'LEFT',
          distanceMeters: 2,
          objectName: simulatedObstacle.label
        };
      } else if (profile === 'hearing_impairment') {
        return {
          severity: 'obstacle',
          headline: `⚠️ VISUAL ALERT: ${simulatedObstacle.label.toUpperCase()}`,
          detail: 'Hazard in center path at 2 meters. Shift to left lane.',
          direction: 'LEFT',
          distanceMeters: 2,
          objectName: simulatedObstacle.label
        };
      } else if (profile === 'cognitive') {
        return {
          severity: 'obstacle',
          headline: `STOP: ${simulatedObstacle.label} Ahead`,
          detail: 'Step 1: Stop. Step 2: Pass safely on your LEFT.',
          direction: 'LEFT',
          distanceMeters: 2,
          objectName: simulatedObstacle.label
        };
      } else {
        return {
          severity: 'obstacle',
          headline: `Obstacle Ahead: ${simulatedObstacle.label}`,
          detail: '2 m ahead in center corridor',
          direction: 'LEFT',
          distanceMeters: 2,
          objectName: simulatedObstacle.label
        };
      }
    }

    // Step type specific cautions
    if (currentStep.type === 'elevator') {
      return {
        severity: 'caution',
        headline: 'ELEVATOR TRANSITION',
        detail: profile === 'wheelchair' 
          ? 'Accessible elevator ahead. Door width: 110cm.' 
          : profile === 'cognitive' 
          ? 'Enter elevator when doors open. Select destination floor.'
          : 'Elevator transition ahead. Audio chime & tactile buttons available.'
      };
    }

    if (currentStep.type === 'ramp') {
      return {
        severity: 'caution',
        headline: 'ACCESSIBLE RAMP AHEAD',
        detail: profile === 'wheelchair' 
          ? 'Gentle incline (5%). Handrails available on both sides.'
          : profile === 'elderly'
          ? 'Ramp incline ahead. Take your time, rest rail available.'
          : 'Proceed up the accessible ramp.'
      };
    }

    if (currentStep.type === 'stairs') {
      if (profile === 'wheelchair') {
        return {
          severity: 'obstacle',
          headline: 'INACCESSIBLE STAIRWAY DETECTED',
          detail: 'Wheelchair routing active. Bypassing stairs via elevator.',
        };
      }
      return {
        severity: 'caution',
        headline: 'STAIRWAY AHEAD',
        detail: 'Handrails available. Step carefully.',
      };
    }

    // Default clear path
    return {
      severity: 'clear',
      headline: 'PATH CLEAR',
      detail: `Continue straight for approx. ${Math.round(currentStep.distance || 15)} m`,
      direction: 'CENTER',
      distanceMeters: Math.round(currentStep.distance || 15)
    };
  };

  const alert = getAlertForCurrentState();

  const handleNext = () => {
    if (currentStepIndex < route.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-700 animate-fade-in-up space-y-5">
      {/* Top Banner Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-emerald-400 uppercase tracking-wider">LIVE NAVIGATION ACTIVE</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                {profileInfo?.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Step {currentStepIndex + 1} of {route.steps.length} • Floor {currentStep.floor} • {Math.round(distanceRemaining)}m remaining
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoWalking(!isAutoWalking)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors",
              isAutoWalking ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40" : "bg-slate-800 text-slate-300"
            )}
          >
            {isAutoWalking ? <Pause size={14} /> : <Play size={14} />}
            {isAutoWalking ? 'Auto Walk (Simulating)' : 'Resume Auto Walk'}
          </button>
          
          <button
            onClick={onEndWalking}
            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold flex items-center gap-1"
          >
            <X size={14} /> Exit Mode
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
        <div 
          className="bg-emerald-500 h-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* DISABILITY-ADAPTED LIVE ALERT PANEL */}
      <div className={cn(
        "p-4 rounded-xl border transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
        alert.severity === 'obstacle' 
          ? "bg-rose-950/80 border-rose-500 text-rose-100 shadow-lg shadow-rose-950/50 animate-pulse" 
          : alert.severity === 'caution'
          ? "bg-amber-950/80 border-amber-500 text-amber-100"
          : "bg-emerald-950/60 border-emerald-500/50 text-emerald-100"
      )}>
        <div className="flex items-start gap-3.5">
          <div className={cn(
            "p-2.5 rounded-xl shrink-0 mt-0.5",
            alert.severity === 'obstacle' ? "bg-rose-500 text-white" :
            alert.severity === 'caution' ? "bg-amber-500 text-slate-950" :
            "bg-emerald-500 text-slate-950"
          )}>
            {alert.severity === 'obstacle' ? <AlertTriangle size={24} /> :
             alert.severity === 'caution' ? <ShieldAlert size={24} /> :
             <CheckCircle2 size={24} />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg tracking-wide">{alert.headline}</span>
              {simulatedObstacle && (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/30 border border-rose-400/40 text-rose-200 flex items-center gap-1">
                  <Camera size={10} /> CV DETECTED
                </span>
              )}
            </div>
            <p className="text-sm opacity-90 mt-1 font-medium leading-relaxed">{alert.detail}</p>
          </div>
        </div>

        {/* Direction Indicator Recommendation */}
        {alert.direction && (
          <div className="shrink-0 flex items-center gap-2 bg-slate-900/90 px-4 py-2.5 rounded-lg border border-slate-700/80 self-stretch md:self-auto justify-center">
            {alert.direction === 'LEFT' && <ArrowLeft size={20} className="text-amber-400 animate-bounce" />}
            {alert.direction === 'RIGHT' && <ArrowRight size={20} className="text-amber-400 animate-bounce" />}
            {alert.direction === 'CENTER' && <ArrowUp size={20} className="text-emerald-400" />}
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              RECOMMENDED: {alert.direction === 'CENTER' ? 'STRAIGHT' : `SHIFT ${alert.direction}`}
            </span>
          </div>
        )}
      </div>

      {/* Profile-Specific Guidance Box */}
      {profile === 'cognitive' ? (
        /* Cognitive Single Action Focus UI */
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Brain size={16} /> Cognitive Guidance • Single Next Step Focus
          </div>
          <p className="text-lg font-extrabold text-amber-100">
            👉 {currentStep.instruction}
          </p>
          <p className="text-xs text-amber-300/80">
            Focus only on this step. The app will prompt you before any turn.
          </p>
        </div>
      ) : profile === 'hearing_impairment' ? (
        /* Hearing High Contrast Visual Banner */
        <div className="p-3 bg-cyan-950/80 border border-cyan-500/40 rounded-xl flex items-center gap-3 text-cyan-200 text-xs font-semibold">
          <Info size={18} className="text-cyan-400 shrink-0" />
          <span>VISUAL NAVIGATION MODE: High contrast indicators active. Audio tones converted to screen alerts.</span>
        </div>
      ) : profile === 'visual_impairment' ? (
        /* Visual Impairment Audio + Obstacle Priority Box */
        <div className="p-3 bg-purple-950/80 border border-purple-500/40 rounded-xl flex items-center justify-between gap-3 text-purple-200 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Volume2 size={18} className="text-purple-400 animate-pulse shrink-0" />
            <span>Voice navigation active with spatial obstacle callouts.</span>
          </div>
          <button 
            onClick={() => voiceService.speak(`${alert.headline}. ${currentStep.instruction}`)}
            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold"
          >
            Replay Audio
          </button>
        </div>
      ) : null}

      {/* Main Instruction Display */}
      <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Current Navigation Instruction
          </span>
          <p className="text-xl font-bold text-white leading-snug">
            {currentStep.instruction}
          </p>
          {currentStep.accessibilityNote && (
            <p className="text-xs text-emerald-400 font-medium mt-1">
              ✓ {currentStep.accessibilityNote}
            </p>
          )}
        </div>

        {/* Step controls */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
            title="Previous Step"
          >
            <SkipBack size={18} />
          </button>
          
          <span className="text-xs font-mono px-3 py-1 bg-slate-900 rounded text-slate-300 font-bold">
            {currentStepIndex + 1} / {route.steps.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === route.steps.length - 1}
            className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
            title="Next Step"
          >
            <SkipForward size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

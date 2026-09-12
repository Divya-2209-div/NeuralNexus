import { useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, AlertTriangle, ArrowRight, ArrowUpRight, CheckCircle2, Sparkles, Bot } from 'lucide-react';
import type { Route } from '@/types';
import { formatDistance, formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { VoiceGuidanceService } from '@/services/voice-guidance';
import { GeminiService } from '@/services/gemini-service';

interface RouteInstructionsProps {
  route: Route;
  activeStepIndex: number;
}

const voiceService = new VoiceGuidanceService();
const geminiService = new GeminiService();

export function RouteInstructions({ route, activeStepIndex }: RouteInstructionsProps) {
  const { state } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    if (state.selectedProfile) {
      voiceService.setProfile(state.selectedProfile);
    }
  }, [state.selectedProfile]);

  useEffect(() => {
    if (route && state.selectedProfile) {
      setIsLoadingAi(true);
      geminiService.explainRoute(route, state.selectedProfile)
        .then(res => setAiExplanation(res.text))
        .catch(() => setAiExplanation(null))
        .finally(() => setIsLoadingAi(false));
    }
  }, [route, state.selectedProfile]);

  const speak = (text: string) => {
    voiceService.speak(text);
  };

  const playAll = () => {
    if (isPlaying) {
      voiceService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      voiceService.speakRoute(route.steps);
      const approxDuration = Math.min(30000, route.steps.length * 4000);
      setTimeout(() => setIsPlaying(false), approxDuration);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Header Summary */}
      <div className="p-4 bg-primary-600 text-white flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Route Details</h2>
          <button 
            onClick={playAll}
            className={cn(
              "p-2 rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5",
              isPlaying ? "bg-amber-500 text-white animate-pulse" : "bg-white/20 hover:bg-white/30"
            )}
            title="Read full route aloud"
          >
            {isPlaying ? (
              <>
                <VolumeX size={16} /> Stop Voice
              </>
            ) : (
              <>
                <Play size={16} /> Read Route Aloud
              </>
            )}
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-medium bg-primary-700/50 p-3 rounded-lg">
          <div>
            <div className="text-primary-200 text-xs uppercase tracking-wider mb-0.5">Distance</div>
            <div>{formatDistance(route.totalDistance)}</div>
          </div>
          <div className="w-px h-8 bg-primary-500/50" />
          <div>
            <div className="text-primary-200 text-xs uppercase tracking-wider mb-0.5">Est. Time</div>
            <div>{formatTime(route.estimatedTime)}</div>
          </div>
          <div className="w-px h-8 bg-primary-500/50" />
          <div>
            <div className="text-primary-200 text-xs uppercase tracking-wider mb-0.5">Accessibility</div>
            <div className="flex items-center gap-1">
              {route.accessibilityScore}%
            </div>
          </div>
        </div>

        {route.warnings.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {route.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm bg-amber-500/20 text-amber-100 p-2 rounded border border-amber-500/30">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gemini AI Route Explanation Card */}
      {aiExplanation && (
        <div className="p-3 bg-indigo-50/80 border-b border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
          <Sparkles size={16} className="text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-indigo-700 block mb-0.5">Gemini AI Route Insight</span>
            <p className="leading-relaxed">{aiExplanation.replace('**DEMO MODE**: ', '')}</p>
          </div>
        </div>
      )}

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar max-h-[420px]">
        <div className="space-y-2">
          {route.steps.map((step, index) => {
            const isActive = index === activeStepIndex;
            return (
              <div 
                key={index}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200 flex gap-3",
                  isActive 
                    ? "bg-primary-50 border-primary-200 shadow-sm" 
                    : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  isActive ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-500"
                )}>
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", isActive ? "text-slate-900" : "text-slate-700")}>
                    {step.instruction}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    {step.distance > 0 && (
                      <span className="flex items-center gap-1">
                        <ArrowRight size={12} /> {formatDistance(step.distance)}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <ArrowUpRight size={12} /> Floor {step.floor}
                    </span>
                  </div>

                  {step.accessibilityNote && (
                    <div className="mt-2 text-xs text-primary-700 bg-primary-100/50 p-2 rounded flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                      {step.accessibilityNote}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => speak(step.instruction)}
                  className="flex-shrink-0 p-1.5 rounded-full text-slate-400 hover:text-primary-600 hover:bg-primary-50 self-start transition-colors"
                  title="Read step aloud"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


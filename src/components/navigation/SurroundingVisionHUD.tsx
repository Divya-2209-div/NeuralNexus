import { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Detection } from '@/types';
import { YOLOService } from '@/services/yolo-service';

interface SurroundingVisionHUDProps {
  onObstacleDetected: (detection: Detection) => void;
  onClose: () => void;
}

const yoloService = new YOLOService();

export function SurroundingVisionHUD({ onObstacleDetected, onClose }: SurroundingVisionHUDProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [activeHazard, setActiveHazard] = useState<Detection | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (err) {
      console.error("Camera access denied or failed", err);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  useEffect(() => {
    if (!hasPermission) return;

    let scanInterval: ReturnType<typeof setInterval>;
    
    const scanVideo = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          const result = await yoloService.detectFromElement(videoRef.current);
          setDetections(result.detections);
          
          const hazard = result.detections.find(d => d.accessibilityImpact === 'negative');
          if (hazard) {
            setActiveHazard(hazard);
            onObstacleDetected(hazard);
          } else {
            setActiveHazard(null);
          }
        } catch (err) {
          console.error("YOLO detection error:", err);
        }
      }
    };

    scanInterval = setInterval(scanVideo, 1200);

    return () => {
      clearInterval(scanInterval);
    };
  }, [hasPermission, onObstacleDetected]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  if (hasPermission === false) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-64 bg-slate-900/90 border border-rose-500/50 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <AlertTriangle size={18} /> Camera Error
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-slate-300">Camera permission denied. Cannot enable live vision.</p>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "fixed z-50 transition-all duration-300 ease-in-out bg-slate-950/80 border border-slate-700/60 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col",
        isMinimized 
          ? "bottom-4 right-4 w-48 h-32" 
          : "bottom-4 right-4 md:bottom-8 md:right-8 w-72 md:w-96 aspect-[3/4]"
      )}
    >
      {/* Header */}
      <div className="px-3 py-2 bg-slate-900/80 flex items-center justify-between border-b border-slate-700/50">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          {isMinimized ? 'Live' : 'Live Vision'}
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <button onClick={toggleCamera} className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors" title="Switch Camera">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors" title={isMinimized ? "Expand" : "Minimize"}>
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button onClick={onClose} className="p-1.5 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors" title="Close">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative flex-1 bg-black overflow-hidden">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted
          className="w-full h-full object-cover"
        />

        {/* Detections Overlay */}
        {!isMinimized && detections.map(det => {
          // BBox coordinates are relative (0-1)
          const left = `${det.bbox.x * 100}%`;
          const top = `${det.bbox.y * 100}%`;
          const width = `${det.bbox.width * 100}%`;
          const height = `${det.bbox.height * 100}%`;
          const isHazard = det.accessibilityImpact === 'negative';

          return (
            <div 
              key={det.id}
              className={cn(
                "absolute border-2 rounded",
                isHazard ? "border-rose-500 bg-rose-500/20" : "border-emerald-500 bg-emerald-500/20"
              )}
              style={{ left, top, width, height }}
            >
              <span className={cn(
                "absolute -top-5 left-0 px-1 text-[10px] font-bold text-white whitespace-nowrap rounded",
                isHazard ? "bg-rose-500" : "bg-emerald-600"
              )}>
                {det.label} ({Math.round(det.confidence * 100)}%)
              </span>
            </div>
          );
        })}

        {/* Hazard Warning Overlay */}
        {activeHazard && !isMinimized && (
          <div className="absolute bottom-2 left-2 right-2 bg-rose-600/90 backdrop-blur-sm p-2 rounded-lg border border-rose-400 text-white shadow-lg animate-pulse flex items-start gap-2">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-0.5">
                OBSTACLE DETECTED: {activeHazard.label}
              </p>
              <p className="text-[10px] opacity-90 leading-tight">
                {activeHazard.impactDescription}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

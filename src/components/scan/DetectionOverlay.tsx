import type { Detection } from '@/types';
import { cn } from '@/lib/utils';

interface DetectionOverlayProps {
  imageSrc: string;
  detections: Detection[];
  isScanning: boolean;
}

export function DetectionOverlay({ imageSrc, detections, isScanning }: DetectionOverlayProps) {
  // Convert 0-1 relative bbox coordinates to percentage for CSS
  const toPct = (val: number) => `${Math.max(0, Math.min(100, val * 100))}%`;

  const getBorderColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'border-emerald-500 bg-emerald-500/10';
      case 'negative': return 'border-rose-500 bg-rose-500/10';
      default: return 'border-slate-400 bg-slate-400/10';
    }
  };
  
  const getLabelColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'bg-emerald-500';
      case 'negative': return 'bg-rose-500';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="relative w-full h-full">
      <img 
        src={imageSrc} 
        alt="Camera view" 
        className={cn(
          "w-full h-full object-contain transition-opacity duration-300",
          isScanning ? "opacity-50 blur-sm" : "opacity-100"
        )}
      />
      
      {/* Scanning effect */}
      {isScanning && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-1 bg-primary-500 shadow-[0_0_15px_3px_rgba(99,102,241,0.5)] animate-[scan_2s_ease-in-out_infinite]" 
               style={{ animationName: 'scan' }} />
          <style>{`
            @keyframes scan {
              0% { transform: translateY(0); }
              50% { transform: translateY(384px); } /* Approx height */
              100% { transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      {/* Detections */}
      {!isScanning && detections.map((det) => (
        <div 
          key={det.id}
          className={cn(
            "absolute border-2 pointer-events-none transition-all duration-300 animate-scale-in",
            getBorderColor(det.accessibilityImpact)
          )}
          style={{
            left: toPct(det.bbox.x),
            top: toPct(det.bbox.y),
            width: toPct(det.bbox.width),
            height: toPct(det.bbox.height),
          }}
        >
          <div className={cn(
            "absolute -top-6 left-0 -left-0.5 px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap shadow-sm",
            getLabelColor(det.accessibilityImpact)
          )}>
            {det.label.toUpperCase()} {Math.round(det.confidence * 100)}%
          </div>
        </div>
      ))}
    </div>
  );
}

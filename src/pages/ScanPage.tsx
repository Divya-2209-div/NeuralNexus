import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Camera, Upload, Image as ImageIcon, Info, AlertTriangle, CheckCircle2, Sparkles, Eye, FileText, CameraOff, XCircle, RefreshCw } from 'lucide-react';
import { YOLOService } from '@/services/yolo-service';
import { GeminiService } from '@/services/gemini-service';
import type { ScanResult, Detection, GeminiResponse } from '@/types';
import { DetectionOverlay } from '@/components/scan/DetectionOverlay';

const yoloService = new YOLOService();
const geminiService = new GeminiService();

type CameraState = 'idle' | 'streaming' | 'captured' | 'permission_denied' | 'no_camera';

export default function ScanPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiResponse | null>(null);
  const [geminiSignage, setGeminiSignage] = useState<GeminiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'yolo' | 'gemini'>('yolo');
  
  const [cameraState, setCameraState] = useState<CameraState>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCamera(); // Cleanup on unmount
  }, [stopCamera]);

  const startCamera = async () => {
    setImageSrc(null);
    setResult(null);
    setGeminiAnalysis(null);
    setGeminiSignage(null);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('no_camera');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraState('streaming');
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setCameraState('permission_denied');
      } else {
        setCameraState('no_camera');
      }
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        
        stopCamera();
        setCameraState('captured');
        processImage(dataUrl);
      }
    }
  };

  const closeCamera = () => {
    stopCamera();
    setImageSrc(null);
    setResult(null);
    setGeminiAnalysis(null);
    setGeminiSignage(null);
    setCameraState('idle');
  };

  const processImage = async (base64Url: string) => {
    setImageSrc(base64Url);
    setIsScanning(true);
    setResult(null);
    setGeminiAnalysis(null);
    setGeminiSignage(null);

    try {
      const [scanRes, aiAnalysis, aiSignage] = await Promise.all([
        yoloService.detectObjects(base64Url, 800, 600),
        geminiService.analyzeAccessibility(base64Url),
        geminiService.readSignage(base64Url),
      ]);
      setResult(scanRes);
      setGeminiAnalysis(aiAnalysis);
      setGeminiSignage(aiSignage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          stopCamera();
          setCameraState('captured');
          processImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getImpactIcon = (impact: Detection['accessibilityImpact']) => {
    switch (impact) {
      case 'positive': return <CheckCircle2 size={20} className="text-emerald-500" />;
      case 'negative': return <AlertTriangle size={20} className="text-rose-500" />;
      default: return <Info size={20} className="text-slate-400" />;
    }
  };

  const getImpactClass = (impact: Detection['accessibilityImpact']) => {
    switch (impact) {
      case 'positive': return 'bg-emerald-50 border-emerald-200';
      case 'negative': return 'bg-rose-50 border-rose-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Scan My Path</h1>
          <p className="text-slate-600">Upload a photo or use camera to detect obstacles and read signage.</p>
        </div>
        <div className="flex gap-2">
          <span className="demo-badge px-3 py-1 text-sm shadow-sm bg-primary-100 text-primary-700">
            <Camera size={14} /> DEMO CV MODE
          </span>
          <span className="demo-badge px-3 py-1 text-sm shadow-sm bg-indigo-100 text-indigo-700">
            <Sparkles size={14} /> GEMINI AI
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Upload / Camera / Image View */}
        <div className="space-y-4">
          <div className="card overflow-hidden">
            {cameraState === 'idle' && (
              <div className="h-80 md:h-96 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 bg-slate-50">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <Camera size={32} />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">Scan Your Surroundings</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-xs">
                  Use your camera to analyze your path in real-time or upload an existing photo.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button onClick={startCamera} className="btn-primary w-full justify-center">
                    <Camera size={18} /> Open Camera
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="btn-secondary w-full justify-center">
                    <ImageIcon size={18} /> Upload Image
                  </button>
                </div>
              </div>
            )}

            {cameraState === 'streaming' && (
              <div className="relative h-80 md:h-96 bg-black flex flex-col">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
                  <button onClick={captureFrame} className="btn-primary shadow-lg scale-110 px-6">
                    <Camera size={20} /> Capture & Scan
                  </button>
                  <button onClick={closeCamera} className="bg-white/20 hover:bg-white/30 text-white rounded-xl p-3 backdrop-blur-sm transition-all">
                    <XCircle size={24} />
                  </button>
                </div>
              </div>
            )}

            {cameraState === 'permission_denied' && (
              <div className="h-80 md:h-96 flex flex-col items-center justify-center p-8 text-center bg-rose-50 border-2 border-rose-200 rounded-xl">
                <CameraOff size={48} className="text-rose-400 mb-4" />
                <h3 className="font-bold text-lg text-slate-800 mb-2">Camera Permission Denied</h3>
                <p className="text-sm text-slate-600 mb-6 max-w-sm">
                  We need access to your camera to scan the environment. Please enable camera permissions in your browser settings and try again.
                </p>
                <button onClick={() => fileInputRef.current?.click()} className="btn-primary">
                  <Upload size={18} /> Fallback to Upload
                </button>
              </div>
            )}

            {cameraState === 'no_camera' && (
              <div className="h-80 md:h-96 flex flex-col items-center justify-center p-8 text-center bg-slate-50 border-2 border-slate-200 rounded-xl">
                <CameraOff size={48} className="text-slate-400 mb-4" />
                <h3 className="font-bold text-lg text-slate-800 mb-2">No Camera Found</h3>
                <p className="text-sm text-slate-600 mb-6 max-w-sm">
                  We couldn't detect a camera on your device. You can still upload images to use the scanner.
                </p>
                <button onClick={() => fileInputRef.current?.click()} className="btn-primary">
                  <Upload size={18} /> Upload Image
                </button>
              </div>
            )}

            {cameraState === 'captured' && imageSrc && (
              <div className="relative h-80 md:h-96 bg-black">
                <DetectionOverlay 
                  imageSrc={imageSrc} 
                  detections={activeTab === 'yolo' ? (result?.detections || []) : []} 
                  isScanning={isScanning} 
                />
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />

          {cameraState === 'captured' && (
            <div className="flex gap-4">
              <button 
                className="btn-primary flex-1 justify-center"
                onClick={startCamera}
              >
                <RefreshCw size={18} /> Scan Again
              </button>
              <button 
                className="btn-secondary flex-1 justify-center"
                onClick={closeCamera}
              >
                <XCircle size={18} /> Close Camera
              </button>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Right Col: Results with Tabs */}
        <div>
          <div className="card h-full flex flex-col">
            {/* Header Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button
                onClick={() => setActiveTab('yolo')}
                className={cn(
                  "flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors",
                  activeTab === 'yolo' ? "border-primary-600 text-primary-700 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Eye size={16} /> YOLO Detection ({result?.detections.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('gemini')}
                className={cn(
                  "flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors",
                  activeTab === 'gemini' ? "border-indigo-600 text-indigo-700 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Sparkles size={16} /> Gemini AI Analysis
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {(!imageSrc && cameraState !== 'streaming') ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon size={48} className="mb-4 opacity-20" />
                  <p>Capture or upload an image to see vision analysis</p>
                </div>
              ) : cameraState === 'streaming' ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Camera size={48} className="mb-4 opacity-20 animate-pulse" />
                  <p>Point camera and capture to analyze</p>
                </div>
              ) : isScanning ? (
                <div className="h-full flex flex-col items-center justify-center text-primary-600 space-y-4">
                  <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                  <p className="font-medium animate-pulse">Analyzing with YOLO & Gemini AI...</p>
                </div>
              ) : activeTab === 'yolo' ? (
                result?.detections.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                    <CheckCircle2 size={48} className="mb-4 text-emerald-400" />
                    <p className="font-medium text-lg text-slate-700">Path looks clear!</p>
                    <p className="text-sm">No physical obstacles detected by YOLO in this view.</p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fade-in-up">
                    {result?.detections.map(det => (
                      <div key={det.id} className={cn("p-4 rounded-xl border flex gap-4", getImpactClass(det.accessibilityImpact))}>
                        <div className="mt-1 flex-shrink-0">
                          {getImpactIcon(det.accessibilityImpact)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-800 capitalize">{det.label}</h4>
                            <span className="text-xs font-mono bg-white/50 px-2 py-0.5 rounded">
                              {Math.round(det.confidence * 100)}%
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">{det.impactDescription}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* Gemini Tab */
                <div className="space-y-4 animate-fade-in-up">
                  {geminiAnalysis && (
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                        <Sparkles size={18} className="text-indigo-600" />
                        AI Accessibility Scene Assessment
                      </div>
                      <p className="text-sm text-indigo-950 leading-relaxed whitespace-pre-wrap">
                        {geminiAnalysis.text.replace('**DEMO MODE**: ', '')}
                      </p>
                    </div>
                  )}

                  {geminiSignage && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                        <FileText size={18} className="text-purple-600" />
                        OCR & Signage Reader
                      </div>
                      <p className="text-sm text-purple-950 leading-relaxed whitespace-pre-wrap">
                        {geminiSignage.text.replace('**DEMO MODE**: ', '')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  MessageSquare, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Volume2, 
  RefreshCw, 
  Flag, 
  Users, 
  Building2, 
  Layers, 
  Check, 
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  LocateFixed,
  Loader2,
  Navigation,
  Crosshair,
  Radio,
  Square,
  Play,
  Languages,
  Globe,
  RotateCcw,
  VolumeX
} from 'lucide-react';
import { 
  CitizenRequest, 
  InfrastructureCategory, 
  ALL_CATEGORIES, 
  IndianLanguage, 
  SUPPORTED_LANGUAGES,
  LocationData 
} from '../types';
import { INDIAN_DISTRICTS } from '../data/districtsData';
import { RealLeafletMap } from './RealLeafletMap';

export interface SpeechLanguageOption {
  code: string;
  langCode: IndianLanguage;
  name: string;
  nativeName: string;
  samplePrompt: string;
}

export const SPEECH_LANGUAGES: SpeechLanguageOption[] = [
  {
    code: 'ta-IN',
    langCode: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    samplePrompt: 'எங்கள் பகுதியில் அரசு ஆரம்ப சுகாதார நிலையம் வேண்டும், அவசர சிகிச்சைக்கு 25 கி.மீ செல்ல வேண்டியுள்ளது.',
  },
  {
    code: 'hi-IN',
    langCode: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    samplePrompt: 'हमारे गांव को मुख्य सड़क से जोड़ने वाली पुलिया पिछले बाढ़ में टूट गई है, कृपया पक्की सड़क बनवाएं।',
  },
  {
    code: 'te-IN',
    langCode: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    samplePrompt: 'మా గ్రామంలో తాగునీటి సమస్య తీవ్రంగా ఉంది, పైపులైన్ మరమ్మత్తు చేసి ఓవర్ హెడ్ ట్యాంక్ నిర్మించండి.',
  },
  {
    code: 'kn-IN',
    langCode: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    samplePrompt: 'ನಮ್ಮ ಹಳ್ಳಿಯಲ್ಲಿ ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್ ಲೈನ್ ಕೆಟ್ಟುಹೋಗಿದೆ, ತಕ್ಷಣ ಶುದ್ಧ ಕುಡಿಯುವ ನೀರಿನ ವ್ಯವಸ್ಥೆ ಮಾಡಿ.',
  },
  {
    code: 'ml-IN',
    langCode: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    samplePrompt: 'ഞങ്ങളുടെ പ്രദേശത്ത് പ്രാഥമിക ആരോഗ്യ കേന്ദ്രം അടിയന്തിരമായി അനുവദിക്കണം.',
  },
  {
    code: 'bn-IN',
    langCode: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    samplePrompt: 'আমাদের গ্রামে পানীয় জলের তীব্র সংকট, গভীর নলকূপ ও পাইপলাইনের জলের ব্যবস্থা করুন।',
  },
  {
    code: 'mr-IN',
    langCode: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    samplePrompt: 'आमच्या गावातील मुख्य रस्त्यावर मोठे खड्डे पडले आहेत, पावसाळ्यात वाहतूक पूर्णपणे ठप्प होते.',
  },
  {
    code: 'en-IN',
    langCode: 'en',
    name: 'English (India)',
    nativeName: 'English',
    samplePrompt: 'Our village urgently requires an upgraded government primary health center as the nearest hospital is 25 km away.',
  },
];

interface CitizenPortalProps {
  requests: CitizenRequest[];
  onNewRequest: (req: CitizenRequest) => void;
  selectedLanguage: IndianLanguage;
  initialPinnedLocation?: {
    lat: number;
    lng: number;
    state?: string;
    district?: string;
    villageOrCity?: string;
  } | null;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  requests,
  onNewRequest,
  selectedLanguage,
  initialPinnedLocation = null,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'messaging' | 'track'>('text');
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState('Dharmapuri');
  const [talukOrVillage, setTalukOrVillage] = useState('Pennagaram Taluk');
  const [customCoords, setCustomCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  const [showMapPicker, setShowMapPicker] = useState(true);

  // Input states
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [latestAnalysis, setLatestAnalysis] = useState<any | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState<string>(requests[0]?.id || 'JNS-000001');
  const [flagFeedbackSent, setFlagFeedbackSent] = useState(false);

  // Messaging chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string; structured?: any }>>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to JanaSetu Citizen Desk. You can report any public infrastructure issue (Roads, Water, Hospital, Electricity) in your native language via text or voice. You can also click "Use My Location" to detect your real GPS coordinates.',
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const timerRef = useRef<any>(null);

  // Browser Microphone & Speech Recognition States
  const [speechLanguageCode, setSpeechLanguageCode] = useState<string>('ta-IN');
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [micState, setMicState] = useState<'idle' | 'recording' | 'processing' | 'denied' | 'unsupported'>('idle');
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [hasVoiceResult, setHasVoiceResult] = useState<boolean>(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Check speech recognition support on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, []);

  // Cleanup microphone resources on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {}
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  // Available districts for chosen state
  const stateDistricts = INDIAN_DISTRICTS.filter((d) => d.state === selectedState);

  // Handle external pinned location if provided
  useEffect(() => {
    if (initialPinnedLocation) {
      setCustomCoords({ lat: initialPinnedLocation.lat, lng: initialPinnedLocation.lng });
      if (initialPinnedLocation.state) setSelectedState(initialPinnedLocation.state);
      if (initialPinnedLocation.district) setSelectedDistrict(initialPinnedLocation.district);
      if (initialPinnedLocation.villageOrCity) setTalukOrVillage(initialPinnedLocation.villageOrCity);
      setLocationSuccessMsg(`Location set to: ${initialPinnedLocation.villageOrCity || ''} ${initialPinnedLocation.district || ''}`);
    }
  }, [initialPinnedLocation]);

  // Real Browser Geolocation Access
  const handleDetectUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationErrorMsg(null);
    setLocationSuccessMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCustomCoords({ lat: latitude, lng: longitude });

        try {
          // Reverse geocode with OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );

          if (res.ok) {
            const data = await res.json();
            const address = data.address || {};
            const state = address.state || '';
            const district =
              address.state_district || address.county || address.district || address.city || '';
            const locality =
              address.village || address.suburb || address.town || address.city || address.neighbourhood || '';

            if (state) {
              const matchedState = INDIAN_DISTRICTS.find(
                (d) => d.state.toLowerCase() === state.toLowerCase()
              );
              if (matchedState) setSelectedState(matchedState.state);
            }

            if (district) {
              const matchedDistrict = INDIAN_DISTRICTS.find(
                (d) =>
                  d.name.toLowerCase().includes(district.toLowerCase()) ||
                  district.toLowerCase().includes(d.name.toLowerCase())
              );
              if (matchedDistrict) {
                setSelectedDistrict(matchedDistrict.name);
                setSelectedState(matchedDistrict.state);
              }
            }

            if (locality) {
              setTalukOrVillage(locality);
            }

            setLocationSuccessMsg(
              `Real GPS Detected: ${locality ? `${locality}, ` : ''}${district ? `${district}, ` : ''}${state || 'India'}`
            );
          } else {
            setLocationSuccessMsg(`GPS Coordinates: ${latitude.toFixed(5)}°N, ${longitude.toFixed(5)}°E`);
          }
        } catch (err) {
          console.warn('Geocoding error:', err);
          setLocationSuccessMsg(`GPS Coordinates: ${latitude.toFixed(5)}°N, ${longitude.toFixed(5)}°E`);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationErrorMsg('Browser location permission was denied. Please allow location access or select manually.');
        } else {
          setLocationErrorMsg(`GPS lookup failed: ${err.message}`);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Sample templates to try in 1-click
  const SAMPLE_COMPLAINTS = [
    {
      lang: 'Tamil',
      code: 'ta',
      text: 'எங்கள் கிராமத்திற்கு அருகே அரசு ஆரம்ப சுகாதார நிலையம் தேவை. அவசர சிகிச்சைக்கு 25 கி.மீ தர்மபுரி செல்ல வேண்டியுள்ளது.',
      state: 'Tamil Nadu',
      district: 'Dharmapuri',
      category: 'Healthcare',
    },
    {
      lang: 'Hindi',
      code: 'hi',
      text: 'हमारे गांव को मुख्य सड़क से जोड़ने वाली पुलिया पिछले बाढ़ में टूट गई है। बच्चे स्कूल नहीं जा पा रहे हैं।',
      state: 'Uttar Pradesh',
      district: 'Bahraich',
      category: 'Roads',
    },
    {
      lang: 'Kannada',
      code: 'kn',
      text: 'ನಮ್ಮ ಹಳ್ಳಿಯಲ್ಲಿ ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್ ಲೈನ್ ಕೆಟ್ಟುಹೋಗಿ 3 ವಾರಗಳಾಗಿವೆ, ಟ್ಯಾಂಕರ್ ನೀರು ಸಹ ಬರುತ್ತಿಲ್ಲ.',
      state: 'Karnataka',
      district: 'Raichur',
      category: 'Water',
    },
    {
      lang: 'Telugu',
      code: 'te',
      text: 'కొండ ప్రాంతాల్లో రోడ్డు లేకపోవడం వల్ల గర్భిణీ స్త్రీలను డోలీలలో మోసుకుని 12 కి.மீ నడవాల్సి వస్తుంది.',
      state: 'Andhra Pradesh',
      district: 'Alluri Sitharama Raju',
      category: 'Roads',
    },
    {
      lang: 'Bengali',
      code: 'bn',
      text: 'গ্রীষ্মকালে নলকূপের জল শুকিয়ে যায়। গভীর নলকূপ এবং পাইপলাইনের পানীয় জল প্রয়োজন।',
      state: 'West Bengal',
      district: 'Purulia',
      category: 'Water',
    },
  ];

  // Pipeline execution animation
  const runPipelineAnimation = async (rawText: string, mode: 'text' | 'voice' | 'messaging') => {
    setIsAnalyzing(true);
    setPipelineStep(1); // Language Detection

    const stepTimer = (step: number, ms: number) =>
      new Promise((res) =>
        setTimeout(() => {
          setPipelineStep(step);
          res(null);
        }, ms)
      );

    try {
      await stepTimer(2, 400); // Translation & Normalisation
      await stepTimer(3, 400); // Intent & Entity Extraction

      const targetDistrictObj =
        INDIAN_DISTRICTS.find((d) => d.name === selectedDistrict && d.state === selectedState) ||
        INDIAN_DISTRICTS[0];

      const lat = customCoords ? customCoords.lat : targetDistrictObj.lat;
      const lng = customCoords ? customCoords.lng : targetDistrictObj.lng;

      // Call server-side Gemini API
      const res = await fetch('/api/analyze-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rawText,
          inputMode: mode,
          userLocation: {
            state: selectedState,
            district: selectedDistrict,
            talukOrVillage: talukOrVillage || 'Local Block',
            lat,
            lng,
          },
        }),
      });

      const data = await res.json();
      await stepTimer(4, 300); // Category & Location Extraction
      await stepTimer(5, 300); // Duplicate & Cluster Match
      await stepTimer(6, 300); // Severity & Priority Score

      if (data.analysis) {
        setLatestAnalysis(data.analysis);

        const newReq: CitizenRequest = {
          id: `JNS-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          originalText: rawText,
          originalLanguage: data.analysis.detectedLanguage || 'Tamil',
          languageCode: data.analysis.languageCode || 'ta',
          inputMode: mode,
          translatedTextEn: data.analysis.englishTranslation || rawText,
          category: (data.analysis.category as InfrastructureCategory) || 'Healthcare',
          location: {
            state: selectedState,
            district: selectedDistrict,
            talukOrVillage: talukOrVillage || 'Local Village',
            lat,
            lng,
          },
          severity: data.analysis.severity || 'Critical',
          urgency: data.analysis.urgency || 'Immediate (0-7 days)',
          estimatedPeopleAffected: data.analysis.estimatedPeopleAffected || 1200,
          infrastructureType: data.analysis.infrastructureType || 'Public Infrastructure',
          requiredDevelopmentType: data.analysis.requiredDevelopmentType || 'New Construction',
          sentimentContext: data.analysis.sentimentContext || 'Citizen appeal',
          keyEntities: data.analysis.keyEntities || ['Local community', 'Access route'],
          status: 'AI Categorised',
          explainableReasoning: data.analysis.explainableReasoning || 'Identified via semantic intent extraction.',
        };

        onNewRequest(newReq);
        setTrackingId(newReq.id);
        setSubmittedSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Browser Microphone & Voice-to-Text Implementation
  const startVoiceRecording = async () => {
    setMicErrorMessage(null);
    setMicState('idle');
    setInterimTranscript('');
    audioChunksRef.current = [];

    // 1. Request real microphone access via navigator.mediaDevices.getUserMedia
    let stream: MediaStream;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported by your browser environment.');
      }

      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setMicState('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicErrorMessage(
          'Microphone permission was denied. Please allow microphone access in your browser address bar to speak your need.'
        );
      } else if (err.name === 'NotFoundError') {
        setMicErrorMessage('No microphone input device found on this system.');
      } else {
        setMicErrorMessage(`Could not access microphone: ${err.message || err.name}`);
      }
      return;
    }

    // 2. Setup Web Audio API volume / equalizer analyzer
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const measure = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(measure);
        };
        measure();
      }
    } catch (e) {
      console.warn('Audio analyzer error:', e);
    }

    // 3. Setup MediaRecorder to capture live audio stream
    try {
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setRecordedAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
      };

      recorder.start(250);
    } catch (e) {
      console.warn('MediaRecorder setup error:', e);
    }

    // 4. Setup SpeechRecognition (Web Speech API)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    setIsRecording(true);
    setMicState('recording');
    setRecordingSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = speechLanguageCode;

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const part = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              currentFinal += part + ' ';
            } else {
              currentInterim += part;
            }
          }

          if (currentFinal) {
            setTranscript((prev) => (prev ? prev.trim() + ' ' + currentFinal.trim() : currentFinal.trim()));
            setHasVoiceResult(true);
          }
          setInterimTranscript(currentInterim);
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          if (event.error === 'not-allowed') {
            setMicState('denied');
            setMicErrorMessage('Microphone access was blocked by browser.');
          } else if (event.error === 'no-speech') {
            // Normal brief pause
          } else {
            setMicErrorMessage(`Speech recognition note: ${event.error}`);
          }
        };

        recognition.onend = () => {
          // completed or paused
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err: any) {
        console.warn('SpeechRecognition start failed, falling back to MediaRecorder:', err);
      }
    }
  };

  const stopVoiceRecording = async (autoAnalyze = false) => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Stop recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    // Stop analyzer animation
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAudioLevel(0);

    // Close audio context
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }

    // Stop recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    // Stop all media stream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    setMicState('processing');

    let finalText = transcript.trim();
    if (!finalText && interimTranscript.trim()) {
      finalText = interimTranscript.trim();
      setTranscript(finalText);
    }

    // Fallback: If no transcript was captured by Web Speech API, try server transcription if audio exists
    if (!finalText && audioChunksRef.current.length > 0) {
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string)?.split(',')[1];
          if (base64Audio) {
            try {
              const res = await fetch('/api/transcribe-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  audioData: base64Audio,
                  mimeType: 'audio/webm',
                  languageHint: speechLanguageCode,
                }),
              });
              const data = await res.json();
              if (data.text) {
                finalText = data.text;
                setTranscript(data.text);
                setHasVoiceResult(true);
                setTextInput(data.text);
                if (autoAnalyze) {
                  runPipelineAnimation(data.text, 'voice');
                }
              }
            } catch (err) {
              console.warn('Server audio transcription error:', err);
            }
          }
          setMicState('idle');
        };
      } catch (e) {
        console.warn('Audio reader error:', e);
        setMicState('idle');
      }
    } else {
      setMicState('idle');
      if (finalText) {
        setHasVoiceResult(true);
        setTextInput(finalText);
        if (autoAnalyze) {
          runPipelineAnimation(finalText, 'voice');
        }
      }
    }
  };

  const handleVoiceSubmit = () => {
    const textToSubmit = transcript.trim() || textInput.trim();
    if (!textToSubmit) return;
    runPipelineAnimation(textToSubmit, 'voice');
  };

  const handleClearVoiceTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setHasVoiceResult(false);
    setTextInput('');
    setRecordedAudioUrl(null);
  };

  const handleLoadVoiceSample = (sample: SpeechLanguageOption) => {
    setSpeechLanguageCode(sample.code);
    setTranscript(sample.samplePrompt);
    setInterimTranscript('');
    setHasVoiceResult(true);
    setTextInput(sample.samplePrompt);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    runPipelineAnimation(textInput, 'text');
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Just now' },
    ]);

    await runPipelineAnimation(userMsg, 'messaging');

    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'bot',
        text: `Thank you. Your request has been acknowledged and categorized under ${latestAnalysis?.category || 'Healthcare'} for ${selectedDistrict}. Real live reference generated.`,
        time: 'Just now',
      },
    ]);
  };

  // Current tracked request
  const trackedRequest = requests.find((r) => r.id === trackingId) || requests[0];

  const PIPELINE_STAGES = [
    'Submitted',
    'AI Categorised',
    'Verified / Under Review',
    'Clustered',
    'Forwarded for Review',
    'Action Planned',
    'Resolved',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header banner */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Citizen Development Gateway
            </span>
            <span className="text-xs text-slate-500">· Digital Public Good</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Report a Development Need
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Submit public infrastructure gaps in your mother tongue using text, voice recording, or messaging. 
            Use your real GPS coordinates to map issues on the real OpenStreetMap layer.
          </p>
        </div>

        {/* Real Location Access & Selector Bar */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col gap-2 text-xs self-start md:self-auto min-w-[300px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> Real Location:
            </span>
            {/* Real Browser Geolocation Button */}
            <button
              onClick={handleDetectUserLocation}
              disabled={isDetectingLocation}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors"
              title="Detect real latitude & longitude from browser GPS"
            >
              {isDetectingLocation ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Locating GPS...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="w-3 h-3 text-blue-200" />
                  <span>Use My Location</span>
                </>
              )}
            </button>
          </div>

          {locationSuccessMsg && (
            <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{locationSuccessMsg}</span>
            </div>
          )}

          {locationErrorMsg && (
            <div className="text-[11px] text-red-700 bg-red-50 px-2 py-1 rounded border border-red-200 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="truncate">{locationErrorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-slate-500 text-[10px] block font-semibold">State:</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  const firstDist = INDIAN_DISTRICTS.find((d) => d.state === e.target.value);
                  if (firstDist) {
                    setSelectedDistrict(firstDist.name);
                    setCustomCoords({ lat: firstDist.lat, lng: firstDist.lng });
                  }
                }}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-medium text-slate-800 text-[11px]"
              >
                {Array.from(new Set(INDIAN_DISTRICTS.map((d) => d.state))).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-500 text-[10px] block font-semibold">District:</label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  const dist = INDIAN_DISTRICTS.find((d) => d.name === e.target.value);
                  if (dist) setCustomCoords({ lat: dist.lat, lng: dist.lng });
                }}
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-medium text-slate-800 text-[11px]"
              >
                {stateDistricts.map((d) => (
                  <option key={d.districtId} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-500 text-[10px] block font-semibold">Village / Locality / Street:</label>
            <input
              type="text"
              value={talukOrVillage}
              onChange={(e) => setTalukOrVillage(e.target.value)}
              placeholder="e.g. Pennagaram, Market Street, Ward 4"
              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-[11px]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Modes & Real Map Picker */}
        <div className="lg:col-span-7 space-y-6">
          {/* Input Mode Tabs */}
          <div className="flex border-b border-slate-200 space-x-4 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('text')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'text'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Text Input</span>
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'voice'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Voice Microphone</span>
            </button>
            <button
              onClick={() => setActiveTab('messaging')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'messaging'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messaging (WhatsApp Style)</span>
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all ml-auto ${
                activeTab === 'track'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Track Request</span>
            </button>
          </div>

          {/* Quick Multilingual Sample Selector */}
          <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200/80 text-xs">
            <span className="font-semibold text-amber-900 block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Click to test realistic multilingual citizen requests:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_COMPLAINTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTextInput(item.text);
                    setSelectedState(item.state);
                    setSelectedDistrict(item.district);
                  }}
                  className="px-2.5 py-1 bg-white border border-amber-300/80 hover:bg-amber-100 rounded text-slate-800 text-[11px] font-medium transition-colors"
                >
                  <span className="font-bold text-amber-700">{item.lang}</span>: {item.category}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: TEXT FORM */}
          {activeTab === 'text' && (
            <form onSubmit={handleTextSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  Describe the Infrastructure Need (Any Indian Language)
                </label>
                <textarea
                  rows={4}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="e.g. எங்கள் பகுதியில் அரசு மருத்துவமனை வேண்டும்... / हमारे गांव में सड़क और पुलिया की आवश्यकता है..."
                  className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Gemini automatically preserves original text & detects language
                </span>

                <button
                  type="submit"
                  disabled={isAnalyzing || !textInput.trim()}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-all shadow-sm"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing AI Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit for AI Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: VOICE MICROPHONE (BROWSER MICROPHONE API) */}
          {activeTab === 'voice' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              {/* Top Language & Microphone Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Browser Microphone Voice-to-Text</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        LIVE API
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Speak your infrastructure need into your microphone in any Indian language
                    </p>
                  </div>
                </div>

                {/* Spoken Language Dropdown */}
                <div className="flex items-center gap-2">
                  <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <label className="text-[11px] font-semibold text-slate-600 shrink-0">Speaking in:</label>
                  <select
                    value={speechLanguageCode}
                    onChange={(e) => {
                      setSpeechLanguageCode(e.target.value);
                      if (isRecording) {
                        // restart with new language if active
                        stopVoiceRecording();
                      }
                    }}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-300 text-slate-800 focus:ring-1 focus:ring-amber-500 outline-none"
                  >
                    {SPEECH_LANGUAGES.map((sl) => (
                      <option key={sl.code} value={sl.code}>
                        {sl.nativeName} ({sl.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Error / Permission Notices */}
              {micErrorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{micErrorMessage}</p>
                    <p className="text-[11px] text-red-700 mt-0.5">
                      Tip: You can still test with the 1-click voice speech samples below if microphone hardware is unavailable.
                    </p>
                  </div>
                </div>
              )}

              {/* Main Microphone Console */}
              <div className="bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-2xl p-6 border border-slate-200/80 text-center relative overflow-hidden">
                {/* Background pulse when recording */}
                {isRecording && (
                  <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
                )}

                <div className="relative z-10 max-w-lg mx-auto space-y-4">
                  {/* Central Mic Button */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      {isRecording && (
                        <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                      )}
                      <button
                        type="button"
                        onClick={isRecording ? () => stopVoiceRecording(false) : startVoiceRecording}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${
                          isRecording
                            ? 'bg-gradient-to-tr from-red-600 to-rose-500 text-white ring-8 ring-red-500/20 shadow-red-500/30'
                            : 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white ring-8 ring-amber-500/10 shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400'
                        }`}
                        title={isRecording ? 'Click to stop recording' : 'Click to start speaking'}
                      >
                        {isRecording ? (
                          <Square className="w-8 h-8 fill-current" />
                        ) : (
                          <Mic className="w-9 h-9" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Status & Timer */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {isRecording 
                        ? 'Listening to your microphone...' 
                        : micState === 'processing'
                        ? 'Processing voice transcription...'
                        : 'Tap the Microphone to Start Speaking'}
                    </h4>

                    {isRecording ? (
                      <div className="flex items-center justify-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-600 bg-red-100/80 px-2.5 py-0.5 rounded-full border border-red-200">
                          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                          <span>REC 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
                        </span>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Audio Input: {audioLevel > 5 ? `${audioLevel}% (Speaking)` : 'Detecting audio...'}</span>
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 mt-1">
                        Browser SpeechRecognition will transcribe your spoken words in real time
                      </p>
                    )}
                  </div>

                  {/* Live Audio Equalizer Waveform */}
                  <div className="py-2 flex items-center justify-center gap-1.5 h-12">
                    {[12, 24, 38, 55, 78, 62, 45, 90, 72, 85, 40, 68, 52, 88, 60, 32, 20, 14].map((baseHeight, idx) => {
                      // Dynamically scale based on real microphone volume
                      const activeHeight = isRecording
                        ? Math.max(8, Math.min(48, Math.round((baseHeight * (audioLevel || 20)) / 45)))
                        : 6;
                      return (
                        <div
                          key={idx}
                          className={`w-1.5 rounded-full transition-all duration-75 ${
                            isRecording
                              ? activeHeight > 24
                                ? 'bg-gradient-to-t from-red-600 to-amber-400'
                                : 'bg-red-400'
                              : 'bg-slate-300'
                          }`}
                          style={{ height: `${activeHeight}px` }}
                        />
                      );
                    })}
                  </div>

                  {/* Mic Control Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {isRecording ? (
                      <button
                        type="button"
                        onClick={() => stopVoiceRecording(false)}
                        className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop Speaking</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startVoiceRecording}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-102"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Start Microphone Recording</span>
                      </button>
                    )}

                    {(transcript || textInput) && !isRecording && (
                      <button
                        type="button"
                        onClick={handleClearVoiceTranscript}
                        className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Real-time Live Transcribed Output Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>Real-Time Transcribed Speech (Editable)</span>
                    {isRecording && (
                      <span className="text-[10px] text-red-600 font-mono animate-pulse">
                        ● Transcribing live...
                      </span>
                    )}
                  </label>
                  {(transcript || textInput) && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {(transcript || textInput).length} characters captured
                    </span>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    value={transcript || textInput}
                    onChange={(e) => {
                      setTranscript(e.target.value);
                      setTextInput(e.target.value);
                    }}
                    placeholder={
                      isRecording
                        ? 'Listening... Start speaking in your mother tongue now...'
                        : 'Your spoken speech will appear here automatically. You can edit or refine it before submitting.'
                    }
                    className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-slate-900 leading-relaxed bg-white shadow-inner"
                  />

                  {/* Interim streaming text preview overlay when speaking */}
                  {isRecording && interimTranscript && (
                    <div className="mt-1 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs italic flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                      <span>Interim stream: "{interimTranscript}"</span>
                    </div>
                  )}
                </div>

                {/* Submit to AI Pipeline Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Gemini preserves original Indian speech text & extracts structured infrastructure data</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleVoiceSubmit}
                    disabled={isAnalyzing || isRecording || !(transcript.trim() || textInput.trim())}
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Processing AI Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Voice Need to AI Pipeline</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 1-Click Indian Voice Prompts (Fallback / Demonstration) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>1-Click Voice Speech Samples (Test in Any Indian Language)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Click to load instantly</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {SPEECH_LANGUAGES.slice(0, 4).map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLoadVoiceSample(lang)}
                      className="p-2.5 rounded-lg bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-400 text-left transition-all text-xs group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 group-hover:text-amber-800">
                          {lang.nativeName} ({lang.name})
                        </span>
                        <Play className="w-3 h-3 text-amber-500 group-hover:scale-110" />
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                        "{lang.samplePrompt}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MESSAGING CONVERSATIONAL UI */}
          {activeTab === 'messaging' && (
            <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[460px]">
              <div className="bg-emerald-800 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                    JS
                  </div>
                  <div>
                    <span className="font-bold text-xs block leading-tight">JanaSetu Citizen Bot</span>
                    <span className="text-[10px] text-emerald-200">Official Multilingual DPG Service</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded text-emerald-100">
                  Verified Bot
                </span>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-xs leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-emerald-100 text-emerald-950 rounded-tr-none'
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block text-right">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleChatSubmit} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type a development need or complaint..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: TRANSPARENCY TRACKING */}
          {activeTab === 'track' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              {trackedRequest ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-xs text-slate-500 block">Tracking Request ID:</span>
                      <span className="text-base font-bold font-mono text-slate-900">{trackedRequest.id}</span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      {trackedRequest.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-700 block uppercase tracking-wider">
                      Request Lifecycle Progress
                    </span>
                    <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {PIPELINE_STAGES.map((st, i) => {
                        const isCompleted = PIPELINE_STAGES.indexOf(trackedRequest.status) >= i;
                        const isCurrent = trackedRequest.status === st;
                        return (
                          <div key={st} className="relative flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 -ml-6 border-2 ${
                                isCompleted
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : isCurrent
                                  ? 'bg-amber-500 border-amber-500 text-white ring-4 ring-amber-100'
                                  : 'bg-white border-slate-300 text-slate-400'
                              }`}
                            >
                              {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
                            </div>
                            <div>
                              <span
                                className={`text-xs font-semibold ${
                                  isCurrent
                                    ? 'text-amber-700 font-bold'
                                    : isCompleted
                                    ? 'text-slate-800'
                                    : 'text-slate-400'
                                }`}
                              >
                                {st}
                              </span>
                              {isCurrent && (
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  Aggregated into district demand indicators for policymaker decision-support.
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No requests submitted yet to track. Submit your first development request above!
                </div>
              )}
            </div>
          )}

          {/* Real Leaflet Map Picker Component */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Real Map: Pin Exact Issue Coordinates
              </span>
              <span className="text-[10px] text-slate-500">
                Click on the real map to set exact issue location
              </span>
            </div>

            <RealLeafletMap
              center={customCoords ? [customCoords.lat, customCoords.lng] : [12.1211, 78.1582]}
              zoom={customCoords ? 13 : 8}
              height="280px"
              requests={requests}
              selectedLocation={customCoords}
              onLocationSelect={(loc) => {
                setCustomCoords({ lat: loc.lat, lng: loc.lng });
                if (loc.state) setSelectedState(loc.state);
                if (loc.district) setSelectedDistrict(loc.district);
                if (loc.villageOrCity) setTalukOrVillage(loc.villageOrCity);
                setLocationSuccessMsg(
                  `Pinned Location: ${loc.villageOrCity || ''} ${loc.district || ''} (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`
                );
              }}
              allowClickToPin={true}
            />
          </div>
        </div>

        {/* Right Column: AI Extraction Output & Real Community Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Pipeline Stepper during analysis */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AI Request Intelligence Pipeline
              </span>
              {isAnalyzing && (
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded animate-pulse">
                  Step {pipelineStep} of 6
                </span>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div
                className={`p-2 rounded border transition-all ${
                  pipelineStep >= 1
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                1. Language Detection
              </div>
              <div
                className={`p-2 rounded border transition-all ${
                  pipelineStep >= 2
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                2. Translation & Normalisation
              </div>
              <div
                className={`p-2 rounded border transition-all ${
                  pipelineStep >= 3
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                3. Intent & Entity Extraction
              </div>
              <div
                className={`p-2 rounded border transition-all ${
                  pipelineStep >= 4
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                4. Category & Location Mapping
              </div>
              <div
                className={`p-2 rounded border transition-all ${
                  pipelineStep >= 5
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                5. Duplicate & Cluster Match
              </div>
              <div
                className={`p-2 rounded border transition-all ${
                  pipelineStep >= 6
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                6. Priority Scoring
              </div>
            </div>
          </div>

          {/* Structured Intelligence Card (Latest Extraction) */}
          {latestAnalysis ? (
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md border border-amber-200/90 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Extracted Intelligence
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {latestAnalysis.detectedLanguage}
                </span>
              </div>

              {/* Original vs English Translation */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-amber-500/10 border border-amber-300/40">
                  <span className="text-[10px] font-semibold text-amber-800 block uppercase">
                    Preserved Citizen Input ({latestAnalysis.detectedLanguage}):
                  </span>
                  <p className="text-slate-900 italic mt-0.5">"{textInput || 'Voice Input'}"</p>
                </div>

                <div className="p-2.5 rounded bg-slate-100 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-600 block uppercase">
                    Normalised English Interpretation:
                  </span>
                  <p className="text-slate-800 font-medium mt-0.5">
                    {latestAnalysis.englishTranslation}
                  </p>
                </div>
              </div>

              {/* Structured Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-slate-500 text-[10px] block">Category:</span>
                  <span className="font-bold text-slate-900">{latestAnalysis.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Infrastructure Type:</span>
                  <span className="font-bold text-slate-900">{latestAnalysis.infrastructureType}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Severity & Urgency:</span>
                  <span className="font-bold text-red-600">
                    {latestAnalysis.severity} · {latestAnalysis.urgency}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Est. Citizens Affected:</span>
                  <span className="font-bold text-slate-900">
                    {latestAnalysis.estimatedPeopleAffected?.toLocaleString('en-IN') || '1,200'}
                  </span>
                </div>
              </div>

              {/* Explainable AI Reasoning */}
              <div className="p-3 rounded bg-blue-50/80 border border-blue-200 text-xs">
                <span className="text-[10px] font-bold text-blue-900 block uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" /> Explainable AI Classification:
                </span>
                <p className="text-blue-950 mt-1 leading-snug">
                  {latestAnalysis.explainableReasoning}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500">
                <span className="text-[11px]">Human-in-the-loop oversight</span>
                <button
                  onClick={() => setFlagFeedbackSent(true)}
                  disabled={flagFeedbackSent}
                  className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-red-600"
                >
                  <Flag className="w-3 h-3" />
                  <span>{flagFeedbackSent ? 'Correction Feedback Flagged' : 'Flag Incorrect Category'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500 space-y-2">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-medium text-slate-700">No input analyzed yet</p>
              <p>Type, speak, or select one of the multilingual templates on the left to see the AI pipeline extract structured needs.</p>
            </div>
          )}

          {/* Actual Recorded Requests in Database */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                Actual Submissions in Database ({requests.length})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Live Data Feed</span>
            </div>

            {requests.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {requests.slice(0, 5).map((req) => (
                  <div
                    key={req.id}
                    onClick={() => {
                      setTrackingId(req.id);
                      setActiveTab('track');
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-amber-50/50 cursor-pointer transition-colors text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{req.category}</span>
                      <span className="text-[10px] text-slate-400">{req.timestamp}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2">
                      {req.translatedTextEn || req.originalText}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{req.location.talukOrVillage || req.location.district}, {req.location.state}</span>
                      <span className="text-amber-700 font-semibold">{req.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                0 requests recorded so far. Use the form above to submit your first real request!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

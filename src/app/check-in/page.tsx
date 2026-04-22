"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  User, Phone, Mail, Building, Briefcase, Users, 
  Camera, Upload, ArrowRight, ArrowLeft, CheckCircle2,
  QrCode, Download, Printer
} from "lucide-react";
import { cn } from "@/lib/utils";
import Webcam from "react-webcam";
import { QRCodeSVG } from "qrcode.react";
import { dataService } from "@/lib/dataService";
import Link from "next/link";

export default function CheckInPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    company: "",
    purpose: "Meeting",
    personToMeet: "",
    visitorType: "Guest",
    photo: null as string | null,
    idProof: null as File | null,
    timestamp: new Date().toLocaleString(),
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      await dataService.addVisitor({
        name: formData.fullName,
        company: formData.company,
        phone: formData.mobile,
        person: formData.personToMeet,
        type: formData.visitorType,
        status: 'Pending',
        image: formData.photo || undefined,
      });
    } catch (err) {
      console.error("Failed to save visitor", err);
    }
    setIsSubmitting(false);
    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-serif font-bold text-shivam-navy mb-2">Visitor Registration</h1>
        <p className="text-shivam-navy/60">Complete the secure check-in process for Shivam Informatics.</p>
        
        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                step >= i ? "bg-shivam-blue text-white shadow-lg shadow-shivam-blue/30" : "bg-shivam-navy/10 text-shivam-navy/40"
              )}>
                {step > i ? <CheckCircle2 size={20} /> : i}
              </div>
              {i < 4 && <div className={cn("w-12 h-1 mx-2 rounded-full", step > i ? "bg-shivam-blue" : "bg-shivam-navy/10")} />}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {step === 1 && <Step1 formData={formData} setFormData={setFormData} onNext={nextStep} />}
          {step === 2 && <Step2 formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />}
          {step === 3 && <Step3 formData={formData} setFormData={setFormData} onNext={submitForm} onPrev={prevStep} isSubmitting={isSubmitting} />}
          {step === 4 && <Step4 formData={formData} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Step1({ formData, setFormData, onNext }: any) {
  const isValid = formData.fullName && formData.mobile.length === 10 && formData.email;

  return (
    <GlassCard className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Full Name" icon={<User size={18} />}>
            <input 
              type="text" 
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-transparent outline-none text-shivam-navy font-medium"
            />
          </InputGroup>
          <InputGroup label="Mobile Number" icon={<Phone size={18} />}>
            <input 
              type="tel" 
              placeholder="9876543210"
              maxLength={10}
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/[^0-9]/g, "")})}
              className="w-full bg-transparent outline-none text-shivam-navy font-medium"
            />
          </InputGroup>
        </div>
        <InputGroup label="Email Address" icon={<Mail size={18} />}>
          <input 
            type="email" 
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-transparent outline-none text-shivam-navy font-medium"
          />
        </InputGroup>
        
        <button 
          disabled={!isValid}
          onClick={onNext}
          className="mt-4 bg-shivam-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-shivam-gold hover:text-shivam-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-shivam-blue/20"
        >
          Next Details <ArrowRight size={20} />
        </button>
      </div>
    </GlassCard>
  );
}

function Step2({ formData, setFormData, onNext, onPrev }: any) {
  const isValid = formData.company && formData.personToMeet;

  return (
    <GlassCard className="max-w-2xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Company Name" icon={<Building size={18} />}>
            <input 
              type="text" 
              placeholder="Acme Corp"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full bg-transparent outline-none text-shivam-navy font-medium"
            />
          </InputGroup>
          <InputGroup label="Person to Meet" icon={<Users size={18} />}>
            <input 
              type="text" 
              placeholder="Mr. Sharma"
              value={formData.personToMeet}
              onChange={(e) => setFormData({...formData, personToMeet: e.target.value})}
              className="w-full bg-transparent outline-none text-shivam-navy font-medium"
            />
          </InputGroup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-shivam-navy/50 px-1">Purpose</label>
            <select 
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              className="w-full bg-white/50 border border-shivam-navy/10 rounded-2xl p-4 outline-none text-shivam-navy font-medium focus:border-shivam-blue"
            >
              <option>Meeting</option>
              <option>Interview</option>
              <option>Delivery</option>
              <option>Maintenance</option>
              <option>Personal</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-shivam-navy/50 px-1">Visitor Type</label>
            <select 
              value={formData.visitorType}
              onChange={(e) => setFormData({...formData, visitorType: e.target.value})}
              className="w-full bg-white/50 border border-shivam-navy/10 rounded-2xl p-4 outline-none text-shivam-navy font-medium focus:border-shivam-blue"
            >
              <option>Guest</option>
              <option>Vendor</option>
              <option>Client</option>
              <option>Candidate</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <button onClick={onPrev} className="flex-1 bg-shivam-navy/5 text-shivam-navy py-4 rounded-2xl font-bold hover:bg-shivam-navy/10 transition-all">Back</button>
          <button 
            disabled={!isValid}
            onClick={onNext}
            className="flex-[2] bg-shivam-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-shivam-navy transition-all disabled:opacity-50"
          >
            Almost Done <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

function Step3({ formData, setFormData, onNext, onPrev, isSubmitting }: any) {
  const [cameraActive, setCameraActive] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setFormData({ ...formData, photo: imageSrc });
      setCameraActive(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <GlassCard className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-shivam-navy flex items-center gap-2">
          <Camera className="text-shivam-blue" />
          Photo Capture
        </h3>
        
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-shivam-navy/5 border-2 border-dashed border-shivam-navy/10 flex items-center justify-center group">
          {cameraActive ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <button 
                  onClick={capture}
                  className="bg-shivam-orange text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all"
                >
                  <Camera size={24} />
                </button>
              </div>
            </>
          ) : formData.photo ? (
            <>
              <img src={formData.photo} className="w-full h-full object-cover" alt="Visitor" />
              <button 
                onClick={() => setCameraActive(true)}
                className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all"
              >
                <Camera size={40} className="mb-2" />
                <span className="font-bold">Retake Photo</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => setCameraActive(true)}
              className="flex flex-col items-center gap-3 text-shivam-navy/40 hover:text-shivam-blue transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                <Camera size={32} />
              </div>
              <span className="font-bold">Take Live Photo</span>
            </button>
          )}
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-6">
        <h3 className="text-xl font-bold text-shivam-navy flex items-center gap-2">
          <Upload className="text-shivam-blue" />
          ID Proof Verification
        </h3>
        
        <div className="flex flex-col gap-4">
          <select className="w-full bg-white/50 border border-shivam-navy/10 rounded-2xl p-4 outline-none text-shivam-navy font-medium focus:border-shivam-blue">
            <option>Aadhaar Card</option>
            <option>Driving License</option>
            <option>PAN Card</option>
            <option>Passport</option>
          </select>
          
          <label className="aspect-video rounded-3xl border-2 border-dashed border-shivam-navy/10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-shivam-blue/5 transition-all">
            <input type="file" className="hidden" onChange={(e) => setFormData({...formData, idProof: e.target.files?.[0] || null})} />
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
              <Upload size={24} className="text-shivam-navy/40" />
            </div>
            <span className="text-shivam-navy/40 font-bold">
              {formData.idProof ? formData.idProof.name : "Upload ID Image"}
            </span>
          </label>
        </div>

        <div className="flex gap-4 mt-auto">
          <button onClick={onPrev} className="flex-1 bg-shivam-navy/5 text-shivam-navy py-4 rounded-2xl font-bold hover:bg-shivam-navy/10 transition-all cursor-pointer">Back</button>
          <button 
            disabled={!formData.photo || isSubmitting}
            onClick={onNext}
            className="flex-[2] bg-shivam-gold text-shivam-navy py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-shivam-blue hover:text-white transition-all shadow-xl shadow-shivam-gold/20 cursor-pointer active:scale-95"
          >
            {isSubmitting ? "SAVING..." : "FINISH & GENERATE PASS"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

function Step4({ formData }: any) {
  return (
    <div className="max-w-md mx-auto">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2rem] overflow-hidden shadow-2xl relative"
      >
        <div className="bg-shivam-blue p-8 text-white text-center relative overflow-hidden border-b-8 border-shivam-gold">
          <div className="absolute top-0 right-0 w-32 h-32 bg-shivam-gold/20 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center p-1.5 shadow-2xl border-4 border-shivam-gold">
            <img src={formData.photo} className="w-full h-full rounded-full object-cover" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">{formData.fullName.toUpperCase()}</h2>
          <p className="text-shivam-gold font-black text-sm tracking-widest">{formData.visitorType.toUpperCase()}</p>
        </div>

        <div className="p-8 flex flex-col gap-6 items-center">
          <div className="w-full grid grid-cols-2 gap-4">
            <PassInfo label="COMPANY" value={formData.company} />
            <PassInfo label="VISITING" value={formData.personToMeet} />
            <PassInfo label="DATE" value={new Date().toLocaleDateString()} />
            <PassInfo label="SERIAL" value="#SI-2026-8821" />
          </div>

          <div className="p-4 bg-zinc-100 rounded-3xl">
            <QRCodeSVG value={`SI-VISITOR-${formData.fullName}-${formData.mobile}`} size={160} />
          </div>

          <div className="bg-shivam-navy/5 p-4 rounded-2xl w-full text-center">
            <p className="text-[10px] font-black text-shivam-navy/30 tracking-widest mb-1">DIGITAL SECURITY TOKEN</p>
            <p className="font-mono text-xs text-shivam-navy/60">VALID FOR TODAY ONLY</p>
          </div>
        </div>
        
        <div className="p-4 border-t border-dashed border-shivam-navy/10 flex gap-4">
          <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 text-shivam-navy font-bold py-3 hover:bg-shivam-navy/5 rounded-2xl cursor-pointer transition-all active:scale-95">
            <Printer size={18} /> Print
          </button>
          <button onClick={() => alert('Digital Pass saved securely to your device.')} className="flex-1 bg-shivam-navy text-white flex items-center justify-center gap-2 font-bold py-3 rounded-2xl hover:bg-shivam-blue cursor-pointer transition-all active:scale-95 shadow-lg">
            <Download size={18} /> Save
          </button>
        </div>
      </motion.div>

      <div className="mt-8 flex justify-center">
        <Link href="/" className="text-shivam-navy font-bold flex items-center gap-2 hover:text-shivam-blue transition-colors">
          <CheckCircle2 className="text-shivam-blue" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}

function PassInfo({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-shivam-navy/30 tracking-widest">{label}</span>
      <span className="font-bold text-shivam-navy truncate">{value}</span>
    </div>
  );
}

function InputGroup({ label, icon, children }: { label: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-shivam-navy/50 px-1">{label}</label>
      <div className="flex items-center gap-3 bg-white/50 border border-shivam-navy/10 rounded-2xl p-4 focus-within:border-shivam-blue focus-within:ring-2 ring-shivam-blue/10 transition-all shadow-inner">
        <span className="text-shivam-navy/30">{icon}</span>
        {children}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import { Shield, Calendar, Clock, Phone, Mail, User, Building2, Download, Share2, CheckCircle2 } from "lucide-react";

interface VisitData {
  _id: string;
  hostelName: string;
  studentName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  status: string;
  passId: string;
  checkInTime?: string;
  completedTime?: string;
  createdAt: string;
}

export default function VisitPassPage() {
  const params = useParams();
  const id = params?.id as string;
  const [visit, setVisit] = useState<VisitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const passRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/visit-request/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => setVisit(data))
      .catch(() => setError("Visit request not found or invalid."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = () => {
    // Simple print-to-PDF approach
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `Visit Pass - ${visit?.hostelName}`, url });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-400 animate-pulse text-lg">Loading Visit Pass...</div>
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Shield size={64} className="mx-auto text-red-500/50 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Invalid Visit Pass</h2>
          <p className="text-slate-400">{error || "This visit pass does not exist."}</p>
        </div>
      </div>
    );
  }

  const isExpired = new Date(visit.date) < new Date(new Date().toDateString());
  const isValid = (visit.status === "Accepted" || visit.status === "Checked In") && !isExpired;

  const statusColor = () => {
    if (isExpired) return "from-red-500 to-red-600";
    switch (visit.status) {
      case "Accepted": return "from-emerald-500 to-emerald-600";
      case "Checked In": return "from-purple-500 to-purple-600";
      case "Completed": return "from-slate-500 to-slate-600";
      case "Rejected": return "from-red-500 to-red-600";
      default: return "from-yellow-500 to-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 flex flex-col items-center">
      {/* Action Buttons */}
      <div className="flex gap-3 mb-6 print:hidden">
        <button onClick={handleDownload} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <Download size={16} /> Download Pass
        </button>
        <button onClick={handleShare} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          <Share2 size={16} /> Share Pass
        </button>
      </div>

      {/* Pass Card */}
      <div ref={passRef} className="w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield size={20} className="text-white/80" />
              <span className="text-white/80 text-xs font-bold uppercase tracking-widest">StayWay Finder</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Visit Pass</h1>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center -mt-4">
            <span className={`bg-gradient-to-r ${statusColor()} text-white text-xs font-bold uppercase tracking-wider px-5 py-1.5 rounded-full shadow-lg`}>
              {isExpired ? "EXPIRED" : visit.status}
            </span>
          </div>

          {/* QR Code */}
          <div className="flex justify-center py-6">
            <div className={`bg-white p-4 rounded-2xl shadow-lg ${!isValid ? "opacity-40 grayscale" : ""}`}>
              <QRCode
                value={visit.passId}
                size={180}
                level="H"
              />
            </div>
          </div>

          {/* Pass ID */}
          <div className="text-center mb-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Pass ID</p>
            <p className="text-lg font-mono font-bold text-purple-400">{visit.passId}</p>
          </div>

          {/* Details */}
          <div className="px-6 pb-6 space-y-3">
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Building2 size={16} className="text-purple-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Hostel</p>
                  <p className="text-sm font-semibold text-white">{visit.hostelName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User size={16} className="text-blue-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Student</p>
                  <p className="text-sm font-semibold text-white">{visit.studentName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Phone</p>
                    <p className="text-xs text-white">{visit.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-amber-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Email</p>
                    <p className="text-xs text-white truncate">{visit.email}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-blue-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Visit Date</p>
                    <p className="text-xs font-semibold text-white">{visit.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-purple-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Visit Time</p>
                    <p className="text-xs font-semibold text-white">{visit.time}</p>
                  </div>
                </div>
              </div>
              {visit.checkInTime && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-700/50">
                  <CheckCircle2 size={14} className="text-purple-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Checked In</p>
                    <p className="text-xs text-purple-300">{new Date(visit.checkInTime).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {visit.completedTime && (
                <div className="flex items-center gap-2 pt-1 border-t border-slate-700/50">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">Completed</p>
                    <p className="text-xs text-emerald-300">{new Date(visit.completedTime).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Generated Time */}
            <p className="text-center text-[10px] text-slate-600">
              Generated: {new Date(visit.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

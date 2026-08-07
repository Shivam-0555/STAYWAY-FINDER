"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CalendarCheck, Eye, Download, Share2, Clock, CheckCircle2, XCircle, CalendarClock, QrCode } from "lucide-react";

interface VisitReq {
  _id: string;
  hostelName: string;
  studentName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  message?: string;
  status: string;
  passId: string;
  checkInTime?: string;
  completedTime?: string;
}

export default function MyVisitRequestsPage() {
  return (
    <ProtectedRoute>
      <MyVisitRequests />
    </ProtectedRoute>
  );
}

function MyVisitRequests() {
  const [requests, setRequests] = useState<VisitReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);

  const fetchRequests = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/visit-request?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "Pending": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Accepted": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Rejected": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "Rescheduled": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Checked In": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Completed": return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case "Pending": return <Clock size={14} />;
      case "Accepted": return <CheckCircle2 size={14} />;
      case "Rejected": return <XCircle size={14} />;
      case "Rescheduled": return <CalendarClock size={14} />;
      case "Checked In": return <QrCode size={14} />;
      case "Completed": return <CheckCircle2 size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 flex items-center gap-3">
          <CalendarCheck className="text-emerald-400" />
          My Visit Requests
        </h1>
        <p className="text-slate-400 mt-2">Track your hostel visit bookings and view QR passes.</p>
      </div>

      {/* Email Search */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur-xl flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1">Your Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRequests()}
            placeholder="Enter the email you used to book"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
          />
        </div>
        <button onClick={fetchRequests} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors shrink-0">
          Search
        </button>
      </div>

      {/* Results */}
      {!searched ? (
        <div className="text-center py-16">
          <CalendarCheck size={56} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-500">Enter your email to view your visit requests.</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16">
          <CalendarCheck size={56} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-400">No visit requests found for this email.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((vr) => (
            <div key={vr._id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-white">🏠 {vr.hostelName}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider flex items-center gap-1 ${statusColor(vr.status)}`}>
                      {statusIcon(vr.status)} {vr.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-400">
                    <span>📅 {vr.date}</span>
                    <span>🕐 {vr.time}</span>
                    <span>🎫 {vr.passId}</span>
                  </div>
                  {vr.message && <p className="text-xs text-slate-500 italic">Owner message: "{vr.message}"</p>}
                  {vr.checkInTime && <p className="text-xs text-purple-400">Checked in: {new Date(vr.checkInTime).toLocaleString()}</p>}
                  {vr.completedTime && <p className="text-xs text-emerald-400">Completed: {new Date(vr.completedTime).toLocaleString()}</p>}
                </div>

                {/* Pass Actions */}
                {(vr.status === "Accepted" || vr.status === "Checked In") && (
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={`/visit-pass/${vr._id}`}
                      target="_blank"
                      className="flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Eye size={14} /> View Pass
                    </a>
                    <a
                      href={`/visit-pass/${vr._id}`}
                      target="_blank"
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Download size={14} /> Download
                    </a>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: "Visit Pass", url: `${window.location.origin}/visit-pass/${vr._id}` });
                        } else {
                          navigator.clipboard.writeText(`${window.location.origin}/visit-pass/${vr._id}`);
                          alert("Link copied!");
                        }
                      }}
                      className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Share2 size={14} /> Share
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

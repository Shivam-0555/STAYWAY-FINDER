"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Building2, Save, Wifi, Wind, Coffee, Car, Shirt, CalendarCheck, CheckCircle2, XCircle, CalendarClock, ScanLine, Clock } from "lucide-react";
import toast from "react-hot-toast";

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

export default function OwnerDashboard() {
  return (
    <ProtectedRoute>
      <OwnerDashboardContent />
    </ProtectedRoute>
  );
}

function OwnerDashboardContent() {
  const searchParams = useSearchParams();
  const placeId = searchParams?.get("placeId");

  const [activeTab, setActiveTab] = useState<"property" | "visits">("property");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    availableRooms: "",
    totalRooms: "",
    rent: "",
    wifi: false,
    laundry: false,
    parking: false,
    mess: false,
    ac: false,
    phone: "",
    hostelType: "coed",
    images: "",
  });

  // Visit Requests
  const [visitRequests, setVisitRequests] = useState<VisitReq[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState<{ id: string; date: string; time: string; reason: string } | null>(null);
  const [scanInput, setScanInput] = useState("");
  const [showScanModal, setShowScanModal] = useState(false);

  useEffect(() => {
    fetchVisitRequests();
  }, []);

  const fetchVisitRequests = async () => {
    setLoadingVisits(true);
    try {
      const res = await fetch("/api/owner/visit-request");
      if (res.ok) {
        const data = await res.json();
        setVisitRequests(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingVisits(false);
    }
  };

  const updateVisitStatus = async (id: string, status: string, extra?: any) => {
    try {
      const res = await fetch(`/api/owner/visit-request/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extra }),
      });
      if (!res.ok) throw new Error("Failed");
      const statusMessages: Record<string, string> = {
        "Accepted": "Visit request accepted!",
        "Rejected": "Visit request rejected.",
        "Rescheduled": "Visit rescheduled successfully.",
        "Completed": "Visit completed!",
        "Checked In": "Student checked in!",
      };
      toast.success(statusMessages[status] || "Updated!");
      fetchVisitRequests();
    } catch (e) {
      toast.error("Error updating request");
    }
  };

  const handleScanQR = async () => {
    if (!scanInput.trim()) return;
    try {
      const res = await fetch(`/api/visit-request/${scanInput.trim()}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      
      // Check if the visit date has expired
      const visitDate = new Date(data.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (visitDate < today) {
        toast.error("This visit pass has expired.");
        setShowScanModal(false);
        setScanInput("");
        return;
      }

      if (data.status === "Accepted") {
        await updateVisitStatus(data._id, "Checked In");
        toast.success(`Student ${data.studentName} checked in!`);
      } else if (data.status === "Checked In") {
        toast("Student already checked in.");
      } else {
        toast.error(`Cannot check in. Status: ${data.status}`);
      }
      setShowScanModal(false);
      setScanInput("");
    } catch {
      toast.error("Invalid or expired QR code.");
      setScanInput("");
    }
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleModal) return;
    updateVisitStatus(rescheduleModal.id, "Rescheduled", {
      date: rescheduleModal.date,
      time: rescheduleModal.time,
      message: rescheduleModal.reason,
    });
    setRescheduleModal(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeId) {
      toast.error("No Place ID specified.");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        availableRooms: Number(formData.availableRooms),
        totalRooms: Number(formData.totalRooms),
        rent: Number(formData.rent),
        images: formData.images.split(",").map(i => i.trim()).filter(Boolean),
      };
      const res = await fetch(`/api/owner/place`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId, ...payload })
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Listing updated successfully!");
    } catch (error) {
      toast.error("Error updating listing");
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 flex items-center gap-3">
          <Building2 className="text-purple-400" />
          Owner Dashboard
        </h1>
        <p className="text-slate-400 mt-2">Manage your property, amenities, and visit requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab("property")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "property" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
          Property Details
        </button>
        <button onClick={() => setActiveTab("visits")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === "visits" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
          <CalendarCheck size={16} />
          Visit Requests
          {visitRequests.filter(v => v.status === "Pending").length > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{visitRequests.filter(v => v.status === "Pending").length}</span>
          )}
        </button>
      </div>

      {/* Property Tab */}
      {activeTab === "property" && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Availability & Pricing</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Available Rooms</label>
                  <input type="number" name="availableRooms" value={formData.availableRooms} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="e.g. 5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Total Rooms</label>
                  <input type="number" name="totalRooms" value={formData.totalRooms} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="e.g. 50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Monthly Rent (₹)</label>
                  <input type="number" name="rent" value={formData.rent} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="e.g. 6500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Hostel Type</label>
                  <select name="hostelType" value={formData.hostelType} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none">
                    <option value="coed">Co-ed</option>
                    <option value="boys">Boys Only</option>
                    <option value="girls">Girls Only</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Amenities & Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer"><input type="checkbox" name="wifi" checked={formData.wifi} onChange={handleChange} className="rounded border-slate-700 bg-slate-900 text-purple-500" /><Wifi size={16} className="text-slate-500" /> WiFi</label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer"><input type="checkbox" name="ac" checked={formData.ac} onChange={handleChange} className="rounded border-slate-700 bg-slate-900 text-purple-500" /><Wind size={16} className="text-slate-500" /> AC</label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer"><input type="checkbox" name="mess" checked={formData.mess} onChange={handleChange} className="rounded border-slate-700 bg-slate-900 text-purple-500" /><Coffee size={16} className="text-slate-500" /> Mess</label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer"><input type="checkbox" name="laundry" checked={formData.laundry} onChange={handleChange} className="rounded border-slate-700 bg-slate-900 text-purple-500" /><Shirt size={16} className="text-slate-500" /> Laundry</label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer"><input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} className="rounded border-slate-700 bg-slate-900 text-purple-500" /><Car size={16} className="text-slate-500" /> Parking</label>
                </div>
                <div className="pt-2">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Contact Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="+91..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Image URLs (comma separated)</label>
                  <input type="text" name="images" value={formData.images} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none" placeholder="https://...jpg" />
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button type="submit" disabled={isLoading || !placeId} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-purple-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                <Save size={18} />
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Visits Tab */}
      {activeTab === "visits" && (
        <div className="space-y-4">
          {/* Scan QR Button */}
          <div className="flex justify-end">
            <button onClick={() => setShowScanModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/25 transition-all">
              <ScanLine size={16} /> Scan QR Code
            </button>
          </div>

          {loadingVisits ? (
            <div className="text-center py-12 text-slate-400">Loading visit requests...</div>
          ) : visitRequests.length === 0 ? (
            <div className="text-center py-12">
              <CalendarCheck size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No visit requests yet.</p>
            </div>
          ) : (
            visitRequests.map((vr) => (
              <div key={vr._id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{vr.studentName}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${statusColor(vr.status)}`}>{vr.status}</span>
                    </div>
                    <p className="text-sm text-slate-400">🏠 {vr.hostelName}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-400">
                      <span>📞 {vr.phone}</span>
                      <span>📧 {vr.email}</span>
                      <span>📅 {vr.date}</span>
                      <span>🕐 {vr.time}</span>
                      <span>🎫 {vr.passId}</span>
                    </div>
                    {vr.message && <p className="text-xs text-slate-500 italic">"{vr.message}"</p>}
                    {vr.checkInTime && <p className="text-xs text-purple-400">Checked in: {new Date(vr.checkInTime).toLocaleString()}</p>}
                    {vr.completedTime && <p className="text-xs text-emerald-400">Completed: {new Date(vr.completedTime).toLocaleString()}</p>}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {vr.status === "Pending" && (
                      <>
                        <button onClick={() => updateVisitStatus(vr._id, "Accepted")} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                          <CheckCircle2 size={14} /> Accept
                        </button>
                        <button onClick={() => updateVisitStatus(vr._id, "Rejected")} className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                          <XCircle size={14} /> Reject
                        </button>
                        <button onClick={() => setRescheduleModal({ id: vr._id, date: vr.date, time: vr.time, reason: "" })} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                          <CalendarClock size={14} /> Reschedule
                        </button>
                      </>
                    )}
                    {(vr.status === "Accepted" || vr.status === "Checked In") && (
                      <button onClick={() => updateVisitStatus(vr._id, "Completed")} className="flex items-center gap-1 bg-slate-600 hover:bg-slate-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        <CheckCircle2 size={14} /> Complete Visit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Reschedule Visit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">New Date *</label>
                <input type="date" value={rescheduleModal.date} onChange={(e) => setRescheduleModal({ ...rescheduleModal, date: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">New Time *</label>
                <input type="time" value={rescheduleModal.time} onChange={(e) => setRescheduleModal({ ...rescheduleModal, time: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Reason</label>
                <textarea rows={2} value={rescheduleModal.reason} onChange={(e) => setRescheduleModal({ ...rescheduleModal, reason: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setRescheduleModal(null)} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors">Cancel</button>
                <button onClick={handleRescheduleSubmit} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan QR Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><ScanLine size={20} /> Verify QR Code</h3>
            <p className="text-xs text-slate-400 mb-4">Enter the Pass ID or Visit Request ID from the student's QR code.</p>
            <input type="text" value={scanInput} onChange={(e) => setScanInput(e.target.value)} placeholder="e.g. VP-A1B2C3D4 or ObjectId" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-purple-500 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setShowScanModal(false); setScanInput(""); }} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors">Cancel</button>
              <button onClick={handleScanQR} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-colors">Verify</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

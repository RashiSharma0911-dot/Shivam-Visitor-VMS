"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Search, Filter, Download, 
  Trash2, CheckCircle, XCircle, MoreVertical,
  ChevronLeft, ChevronRight, UserPlus, X
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { dataService } from "@/lib/dataService";

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visitors, setVisitors] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVisitor, setNewVisitor] = useState({ name: "", company: "", type: "Guest", person: "" });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchVisitors = async () => {
    try {
      const data = await dataService.getVisitors();
      setVisitors([...data].reverse()); // Latest first
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 5000); // Poll for real-time vibe
    return () => clearInterval(interval);
  }, []);

  const handleAddVisitor = async (e: any) => {
    e.preventDefault();
    try {
      await dataService.addVisitor({
        ...newVisitor,
        status: 'Pending'
      });
      setIsModalOpen(false);
      setNewVisitor({ name: "", company: "", type: "Guest", person: "" });
      fetchVisitors();
    } catch(err) { console.error(err); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await dataService.updateVisitorStatus(id, status);
      fetchVisitors();
    } catch(err) { console.error(err); }
  };

  const handleDeleteVisitor = async (id: string) => {
    try {
      await dataService.deleteVisitor(id);
      fetchVisitors();
    } catch(err) { console.error(err); }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Company", "Type", "Meeting With", "Status", "Date", "Time"];
    const csvContent = [
      headers.join(","),
      ...visitors.map(v => `"${v.name}","${v.company}","${v.type}","${v.person}","${v.status}","${v.date}","${v.time||""}"`)
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `shivam_visitors_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.max(1, Math.ceil(visitors.length / itemsPerPage));
  const displayedVisitors = visitors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-black text-shivam-navy tracking-tight">Admin Console</h1>
          <p className="text-shivam-navy/50">Manage entries, approvals, and employee directory.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-shivam-navy/30 group-focus-within:text-shivam-blue transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/50 border border-shivam-navy/10 rounded-2xl py-3 pl-12 pr-6 outline-none focus:border-shivam-blue focus:ring-4 ring-shivam-blue/10 min-w-[300px] transition-all"
            />
          </div>
          <button className="glass p-3 rounded-2xl text-shivam-navy/40 hover:text-shivam-blue transition-colors">
            <Filter size={20} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-shivam-navy text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-shivam-gold hover:text-shivam-navy cursor-pointer transition-all active:scale-95 shadow-lg"
          >
            <UserPlus size={20} /> Add Visitor
          </button>
        </div>
      </div>

      <div className="flex gap-8 mb-8 overflow-x-auto pb-4">
        <TabButton label="All Visitors" count={visitors.length} active />
        <TabButton label="Pending Approvals" count={visitors.filter(v => v.status === "Pending").length} />
        <TabButton label="Active Currently" count={visitors.filter(v => v.status === "Checked In").length} />
        <TabButton label="Blacklisted" count={0} />
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-shivam-navy/[0.02]">
              <tr className="border-b border-shivam-navy/5">
                <th className="p-6 text-xs font-black text-shivam-navy/30 uppercase tracking-widest">Name & Company</th>
                <th className="p-6 text-xs font-black text-shivam-navy/30 uppercase tracking-widest">Type</th>
                <th className="p-6 text-xs font-black text-shivam-navy/30 uppercase tracking-widest">Meeting With</th>
                <th className="p-6 text-xs font-black text-shivam-navy/30 uppercase tracking-widest">Date</th>
                <th className="p-6 text-xs font-black text-shivam-navy/30 uppercase tracking-widest">Status</th>
                <th className="p-6 text-xs font-black text-shivam-navy/30 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-shivam-navy/5">
              {displayedVisitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-shivam-navy/40 font-bold">No visitors found.</td>
                </tr>
              ) : displayedVisitors.map((v) => (
                <tr key={v.id} className="group hover:bg-shivam-blue/[0.02] transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-shivam-navy/5 border border-shivam-navy/10 flex items-center justify-center font-bold text-shivam-blue uppercase">
                        {v.name ? v.name.charAt(0) : '?'}
                      </div>
                      <div>
                        <p className="font-bold text-shivam-navy">{v.name}</p>
                        <p className="text-sm text-shivam-navy/40">{v.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-shivam-navy/60 font-medium">{v.type}</td>
                  <td className="p-6 font-bold text-shivam-navy">{v.person}</td>
                  <td className="p-6 text-shivam-navy/60 font-mono text-sm">{v.date}</td>
                  <td className="p-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold ring-1",
                      v.status === "Approved" ? "bg-green-50 text-green-600 ring-green-100" :
                      v.status === "Pending" ? "bg-amber-50 text-amber-600 ring-amber-100 animate-pulse" :
                      v.status === "Checked In" ? "bg-shivam-blue/5 text-shivam-blue ring-shivam-blue/20" :
                      v.status === "Rejected" ? "bg-red-50 text-red-600 ring-red-100" :
                      "bg-zinc-50 text-zinc-500 ring-zinc-200"
                    )}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleUpdateStatus(v.id, "Approved")} className="p-2 rounded-xl text-green-600 hover:bg-green-50 transition-colors" title="Approve"><CheckCircle size={20} /></button>
                      <button onClick={() => handleUpdateStatus(v.id, "Rejected")} className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors" title="Reject"><XCircle size={20} /></button>
                      <button onClick={() => handleDeleteVisitor(v.id)} className="p-2 rounded-xl text-shivam-navy/40 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-shivam-navy/5 flex items-center justify-between">
          <button onClick={exportToCSV} className="text-sm text-shivam-navy/40 font-bold hover:text-shivam-blue flex items-center gap-2 cursor-pointer transition-all active:scale-95 bg-shivam-navy/5 px-4 py-2 rounded-xl">
            <Download size={14} /> Export to Excel
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-shivam-navy/10 text-shivam-navy/40 hover:bg-shivam-navy/5 hover:text-shivam-navy disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold text-shivam-navy border border-shivam-navy/10 px-4 py-1.5 rounded-lg bg-white">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-shivam-navy/10 text-shivam-navy/40 hover:bg-shivam-navy/5 hover:text-shivam-navy disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Add Visitor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-shivam-navy/40 hover:text-shivam-navy"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-shivam-navy mb-6">Quick Add Visitor</h2>
            <form onSubmit={handleAddVisitor} className="flex flex-col gap-4">
              <input 
                type="text" placeholder="Full Name" required
                value={newVisitor.name} onChange={e => setNewVisitor({...newVisitor, name: e.target.value})}
                className="w-full bg-shivam-navy/5 rounded-xl p-4 outline-none focus:ring-2 ring-shivam-blue/20"
              />
              <input 
                type="text" placeholder="Company" required
                value={newVisitor.company} onChange={e => setNewVisitor({...newVisitor, company: e.target.value})}
                className="w-full bg-shivam-navy/5 rounded-xl p-4 outline-none focus:ring-2 ring-shivam-blue/20"
              />
              <input 
                type="text" placeholder="Meeting With" required
                value={newVisitor.person} onChange={e => setNewVisitor({...newVisitor, person: e.target.value})}
                className="w-full bg-shivam-navy/5 rounded-xl p-4 outline-none focus:ring-2 ring-shivam-blue/20"
              />
              <select 
                value={newVisitor.type} onChange={e => setNewVisitor({...newVisitor, type: e.target.value})}
                className="w-full bg-shivam-navy/5 rounded-xl p-4 outline-none focus:ring-2 ring-shivam-blue/20"
              >
                <option>Guest</option>
                <option>Vendor</option>
                <option>Client</option>
                <option>Candidate</option>
              </select>
              <button type="submit" className="w-full bg-shivam-blue text-white py-4 rounded-xl font-bold hover:bg-shivam-gold hover:text-shivam-navy transition-colors mt-2">
                CREATE VISITOR
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function TabButton({ label, count, active = false }: { label: string, count: number, active?: boolean }) {
  return (
    <button className={cn(
      "flex items-center gap-3 whitespace-nowrap px-2 py-1 transition-all relative group cursor-pointer",
      active ? "text-shivam-navy" : "text-shivam-navy/40 hover:text-shivam-navy/60"
    )}>
      <span className="font-bold text-lg">{label}</span>
      <span className={cn(
        "px-2 py-0.5 rounded-lg text-xs font-black",
        active ? "bg-shivam-blue text-white" : "bg-shivam-navy/5 text-shivam-navy/40 group-hover:bg-shivam-navy/10"
      )}>
        {count}
      </span>
      {active && (
        <motion.div 
          layoutId="tab" 
          className="absolute -bottom-1 left-0 right-0 h-1 bg-shivam-blue rounded-full" 
        />
      )}
    </button>
  );
}

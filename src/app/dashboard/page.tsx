"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { 
  Users, UserCheck, UserMinus, Clock, 
  TrendingUp, Calendar, Search, Filter,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { dataService } from "@/lib/dataService";

export default function Dashboard() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showSearch, setShowSearch] = useState(false);

  const fetchVisitors = async () => {
    try {
      const data = await dataService.getVisitors();
      setVisitors([...data].reverse()); // Latest first
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 5000); 
    return () => clearInterval(interval);
  }, []);

  const totalVisitors = 1200 + visitors.length;
  const checkedIn = visitors.filter(v => v.status === "Checked In").length;

  const stats = [
    { title: "Total Visitors", value: totalVisitors.toLocaleString(), unit: "Today", icon: <Users />, trend: "+12%", up: true },
    { title: "Checked In", value: checkedIn, unit: "Active", icon: <UserCheck />, trend: "+5%", up: true },
    { title: "Checked Out", value: "118", unit: "Today", icon: <UserMinus />, trend: "-2%", up: false },
    { title: "Avg. Duration", value: "45m", unit: "per visitor", icon: <Clock />, trend: "+3%", up: true },
  ];

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = (v.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (v.person || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const exportReportCSV = () => {
    const headers = ["Name", "Company", "Purpose", "Status", "Time"];
    const csvContent = [
      headers.join(","),
      ...visitors.map((v: any) => `"${v.name || ''}","${v.company || ''}","${v.type || ''}","${v.status || ''}","${v.time || ''}"`)
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `shivam_dashboard_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const lineData = {
    labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM'],
    datasets: [{
      label: 'Visitor Traffic',
      data: [12, 19, 45, 60, 35, 48, 82, 55, 30, 10],
      fill: true,
      borderColor: '#0099D5',
      backgroundColor: 'rgba(0, 153, 213, 0.1)',
      tension: 0.4,
    }]
  };

  const barData = {
    labels: ['Guest', 'Vendor', 'Client', 'Candidate'],
    datasets: [{
      label: 'Visitor Types',
      data: [65, 25, 45, 30],
      backgroundColor: ['#0099D5', '#5DB0DA', '#F26522', '#0A2540'],
      borderRadius: 12,
    }]
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-shivam-navy tracking-tight">Enterprise Overview</h1>
          <p className="text-shivam-navy/50">Real-time visitor analytics for Shivam Informatics Headquarters.</p>
        </div>
        <div className="flex gap-3">
          <button className="glass px-4 py-2 rounded-2xl flex items-center gap-2 text-shivam-navy/60 dark:text-gray-400 font-semibold hover:border-shivam-gold transition-colors">
            <Calendar size={18} /> Last 24 Hours
          </button>
          <button onClick={exportReportCSV} className="bg-shivam-gold text-shivam-navy px-6 py-2 rounded-2xl font-black hover:bg-shivam-blue hover:text-white cursor-pointer transition-all active:scale-95 shadow-lg shadow-shivam-gold/20">
            DOWNLOAD REPORT
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <GlassCard key={i} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-shivam-navy/5 flex items-center justify-center text-shivam-blue">
                {s.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${s.up ? 'text-green-500' : 'text-red-500'}`}>
                {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {s.trend}
              </div>
            </div>
            <div>
              <p className="text-4xl font-black text-shivam-navy dark:text-white">{s.value}</p>
              <p className="text-sm font-black text-shivam-gold uppercase tracking-widest">{s.title}</p>
            </div>
            <div className="h-1 bg-shivam-navy/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-shivam-gold shadow-[0_0_10px_rgba(249,199,79,0.5)] transition-all duration-1000" 
                style={{ width: `${Math.random() * 60 + 20}%` }} 
              />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <GlassCard className="lg:col-span-2">
          <h3 className="text-xl font-bold text-shivam-navy mb-6 flex items-center gap-2">
            <TrendingUp className="text-shivam-blue" />
            Live Traffic Flow
          </h3>
          <div className="h-[300px]">
             <Line 
               data={lineData} 
               options={{
                 responsive: true,
                 maintainAspectRatio: false,
                 scales: {
                   y: { beginAtZero: true, grid: { display: false } },
                   x: { grid: { display: false } }
                 },
                 plugins: { legend: { display: false } }
               }} 
             />
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-bold text-shivam-navy mb-6 flex items-center gap-2">
            <Users className="text-shivam-orange" />
            Visitor Demographics
          </h3>
          <div className="h-[300px]">
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity Mini Table */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-shivam-navy">Recent Activity</h3>
          <div className="flex gap-2 items-center">
            {showSearch && (
              <input 
                type="text" 
                placeholder="Search name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shivam-blue focus:border-transparent transition-all"
                autoFocus
              />
            )}
            <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-xl bg-shivam-navy/5 text-shivam-navy/40 hover:bg-shivam-blue/10 hover:text-shivam-blue cursor-pointer transition-all">
              <Search size={18} />
            </button>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 px-3 text-sm font-semibold border-none bg-shivam-navy/5 text-shivam-navy/60 rounded-xl hover:bg-shivam-blue/10 hover:text-shivam-blue cursor-pointer transition-all focus:outline-none focus:ring-0 appearance-none"
            >
              <option value="All">Filter: All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Checked In">Checked In</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-shivam-navy/5">
                <th className="py-4 text-xs font-black text-shivam-navy/30 uppercase tracking-widest">Visitor</th>
                <th className="py-4 text-xs font-black text-shivam-navy/30 uppercase tracking-widest">Purpose</th>
                <th className="py-4 text-xs font-black text-shivam-navy/30 uppercase tracking-widest">Person to Meet</th>
                <th className="py-4 text-xs font-black text-shivam-navy/30 uppercase tracking-widest">Status</th>
                <th className="py-4 text-xs font-black text-shivam-navy/30 uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-shivam-navy/5">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-shivam-navy/40 font-bold">Waiting for entries...</td>
                </tr>
              ) : filteredVisitors.slice(0, 5).map((row, i) => (
                <tr key={i} className="group hover:bg-shivam-blue/5 transition-colors">
                  <td className="py-4 font-bold text-shivam-navy">{row.name}</td>
                  <td className="py-4 text-shivam-navy/60">{row.type}</td>
                  <td className="py-4 text-shivam-navy/60 font-semibold">{row.person}</td>
                  <td className="py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold ring-1",
                      row.status === "Checked In" ? "bg-shivam-blue/5 text-shivam-blue ring-shivam-blue/20" :
                      row.status === "Pending" ? "bg-amber-50 text-amber-600 ring-amber-100" :
                      row.status === "Approved" ? "bg-green-50 text-green-600 ring-green-100" :
                      "bg-zinc-50 text-zinc-500 ring-zinc-200"
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 font-mono text-sm text-shivam-navy/40">{row.time || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

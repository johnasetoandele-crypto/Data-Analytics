import { useState, useEffect, useMemo, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ComposedChart, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
  Plus, X, TrendingUp, TrendingDown, Users, DollarSign,
  Clock, Truck, FlaskConical, ChevronDown, Search,
  Calendar, BarChart2, Activity, UserCheck, AlertCircle,
  CheckCircle2, FileText, ChevronUp, Minus, Bug, Shield,
  Edit2, Trash2, Eye, Download
} from "lucide-react";

// ─── Google Fonts ─────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ─── Constants ────────────────────────────────────────────────────────────────
const PEST_TYPES = ["Cockroaches", "Rodents", "Bedbugs", "Termites", "Ants", "Flies", "Mosquitoes", "Spiders", "Wasps", "General"];
const FOLLOW_UP_REASONS = ["Product Failure", "Client Complaint", "Warranty Callback", "Re-infestation", "Missed Area", "Preventive Check", "Other"];
const SERVICE_STATUS = ["Completed", "Pending", "In Progress", "Escalated"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const COLORS = {
  green: "#22c55e", greenDark: "#15803d", greenGlow: "rgba(34,197,94,0.15)",
  amber: "#f59e0b", amberDark: "#b45309",
  red: "#ef4444", blue: "#3b82f6", purple: "#a855f7",
  cyan: "#06b6d4", orange: "#f97316",
  bg: "#080d0f", surface: "#0e1518", card: "#131d20",
  border: "#1e2e32", borderLight: "#243438",
  text: "#e8f4f0", textMuted: "#6b8f85", textDim: "#3d5a54"
};

const CHART_COLORS = ["#22c55e","#f59e0b","#3b82f6","#a855f7","#ef4444","#06b6d4","#f97316","#ec4899"];

// ─── Sample Seed Data ─────────────────────────────────────────────────────────
const SEED_DATA = [
  { id:"1", date:"2025-10-05", clientName:"Westlands Hotel", location:"Westlands", serviceType:"Hotel", pestType:"Cockroaches", technicianInitials:"JM", technicianName:"James Mutua", chemicals:[{name:"Demand CS",qty:100,unit:"ml",cost:850},{name:"Cislin",qty:50,unit:"ml",cost:430}], timeTaken:2.5, labourCost:2400, transportCost:600, followUpReason:"Product Failure", status:"Completed", notes:"Heavy re-infestation in kitchen drains", satisfaction:3 },
  { id:"2", date:"2025-10-12", clientName:"Nairobi Butchery", location:"CBD", serviceType:"Food Processing", pestType:"Rodents", technicianInitials:"AK", technicianName:"Agnes Kamau", chemicals:[{name:"Brodifacoum Bait",qty:500,unit:"g",cost:1200},{name:"Ditrac",qty:200,unit:"g",cost:600}], timeTaken:3, labourCost:2800, transportCost:400, followUpReason:"Re-infestation", status:"Completed", notes:"Entry points not sealed after last visit", satisfaction:2 },
  { id:"3", date:"2025-10-18", clientName:"Karen Residence - Ochieng", location:"Karen", serviceType:"Residential", pestType:"Bedbugs", technicianInitials:"PM", technicianName:"Peter Mwangi", chemicals:[{name:"K-Othrine",qty:200,unit:"ml",cost:1800},{name:"Temprid SC",qty:100,unit:"ml",cost:1400}], timeTaken:4, labourCost:3600, transportCost:1200, followUpReason:"Client Complaint", status:"Completed", notes:"Second treatment required", satisfaction:4 },
  { id:"4", date:"2025-10-25", clientName:"Upperhill Office Complex", location:"Upperhill", serviceType:"Commercial", pestType:"Ants", technicianInitials:"JM", technicianName:"James Mutua", chemicals:[{name:"Advion Gel",qty:30,unit:"g",cost:900}], timeTaken:1.5, labourCost:1500, transportCost:350, followUpReason:"Missed Area", status:"Completed", notes:"Ant trails in server room area missed", satisfaction:4 },
  { id:"5", date:"2025-11-03", clientName:"Westlands Hotel", location:"Westlands", serviceType:"Hotel", pestType:"Flies", technicianInitials:"AK", technicianName:"Agnes Kamau", chemicals:[{name:"Aqua Reslin",qty:150,unit:"ml",cost:650}], timeTaken:2, labourCost:2000, transportCost:600, followUpReason:"Client Complaint", status:"Completed", notes:"Fly problem in buffet area", satisfaction:3 },
  { id:"6", date:"2025-11-09", clientName:"Greenfield School", location:"Gigiri", serviceType:"School", pestType:"Cockroaches", technicianInitials:"RN", technicianName:"Ruth Njoroge", chemicals:[{name:"Demand CS",qty:80,unit:"ml",cost:680},{name:"Dupont Advion",qty:20,unit:"g",cost:600}], timeTaken:3.5, labourCost:3200, transportCost:900, followUpReason:"Warranty Callback", status:"Completed", notes:"Kitchen area follow-up within warranty", satisfaction:5 },
  { id:"7", date:"2025-11-15", clientName:"Nairobi Butchery", location:"CBD", serviceType:"Food Processing", pestType:"Rodents", technicianInitials:"PM", technicianName:"Peter Mwangi", chemicals:[{name:"Brodifacoum Bait",qty:300,unit:"g",cost:720}], timeTaken:2, labourCost:1800, transportCost:400, followUpReason:"Preventive Check", status:"Completed", notes:"Monitoring visit - bait replenishment", satisfaction:5 },
  { id:"8", date:"2025-11-22", clientName:"Lavington Spa", location:"Lavington", serviceType:"Commercial", pestType:"Mosquitoes", technicianInitials:"JM", technicianName:"James Mutua", chemicals:[{name:"Icon 10CS",qty:100,unit:"ml",cost:1100}], timeTaken:2.5, labourCost:2200, transportCost:800, followUpReason:"Re-infestation", status:"Completed", notes:"Breeding sites found in drainage", satisfaction:3 },
  { id:"9", date:"2025-11-28", clientName:"Karen Residence - Ochieng", location:"Karen", serviceType:"Residential", pestType:"Bedbugs", technicianInitials:"AK", technicianName:"Agnes Kamau", chemicals:[{name:"Temprid SC",qty:150,unit:"ml",cost:2100},{name:"Phantom",qty:100,unit:"ml",cost:1600}], timeTaken:5, labourCost:4500, transportCost:1200, followUpReason:"Re-infestation", status:"Escalated", notes:"Severe re-infestation - furniture may need disposal", satisfaction:1 },
  { id:"10", date:"2025-12-04", clientName:"Upperhill Office Complex", location:"Upperhill", serviceType:"Commercial", pestType:"Cockroaches", technicianInitials:"RN", technicianName:"Ruth Njoroge", chemicals:[{name:"Demand CS",qty:120,unit:"ml",cost:1020},{name:"Cislin",qty:60,unit:"ml",cost:516}], timeTaken:2, labourCost:2000, transportCost:350, followUpReason:"Product Failure", status:"Completed", notes:"German cockroach resistance suspected", satisfaction:3 },
  { id:"11", date:"2025-12-10", clientName:"Westlands Hotel", location:"Westlands", serviceType:"Hotel", pestType:"Rodents", technicianInitials:"PM", technicianName:"Peter Mwangi", chemicals:[{name:"Ditrac",qty:400,unit:"g",cost:1200},{name:"Rodent Glue Boards",qty:10,unit:"pcs",cost:500}], timeTaken:3, labourCost:2800, transportCost:600, followUpReason:"Re-infestation", status:"Completed", notes:"New rodent entry via rear loading bay", satisfaction:2 },
  { id:"12", date:"2025-12-17", clientName:"Greenfield School", location:"Gigiri", serviceType:"School", pestType:"Termites", technicianInitials:"JM", technicianName:"James Mutua", chemicals:[{name:"Termidor SC",qty:5,unit:"L",cost:4500}], timeTaken:6, labourCost:5400, transportCost:900, followUpReason:"Client Complaint", status:"Completed", notes:"New termite activity on east wing", satisfaction:4 },
  { id:"13", date:"2025-12-23", clientName:"Lavington Spa", location:"Lavington", serviceType:"Commercial", pestType:"Ants", technicianInitials:"AK", technicianName:"Agnes Kamau", chemicals:[{name:"Advion Gel",qty:40,unit:"g",cost:1200}], timeTaken:1, labourCost:900, transportCost:800, followUpReason:"Missed Area", status:"Completed", notes:"Garden area missed in initial treatment", satisfaction:4 },
  { id:"14", date:"2026-01-07", clientName:"Nairobi Butchery", location:"CBD", serviceType:"Food Processing", pestType:"Flies", technicianInitials:"RN", technicianName:"Ruth Njoroge", chemicals:[{name:"Aqua Reslin",qty:200,unit:"ml",cost:870},{name:"IBI Fly Bait",qty:100,unit:"g",cost:430}], timeTaken:2.5, labourCost:2200, transportCost:400, followUpReason:"Product Failure", status:"Completed", notes:"Fly pressure from neighboring restaurant", satisfaction:3 },
  { id:"15", date:"2026-01-14", clientName:"Karen Residence - Ochieng", location:"Karen", serviceType:"Residential", pestType:"Bedbugs", technicianInitials:"JM", technicianName:"James Mutua", chemicals:[{name:"Temprid SC",qty:200,unit:"ml",cost:2800},{name:"K-Othrine",qty:100,unit:"ml",cost:900}], timeTaken:6, labourCost:5400, transportCost:1200, followUpReason:"Re-infestation", status:"In Progress", notes:"Third treatment, recommending heat treatment", satisfaction:2 },
  { id:"16", date:"2026-01-20", clientName:"Westlands Hotel", location:"Westlands", serviceType:"Hotel", pestType:"Cockroaches", technicianInitials:"AK", technicianName:"Agnes Kamau", chemicals:[{name:"Demand CS",qty:150,unit:"ml",cost:1275},{name:"Dupont Advion",qty:40,unit:"g",cost:1200}], timeTaken:4, labourCost:3600, transportCost:600, followUpReason:"Re-infestation", status:"Completed", notes:"Kitchen & bar areas treated comprehensively", satisfaction:3 },
  { id:"17", date:"2026-01-27", clientName:"Upperhill Office Complex", location:"Upperhill", serviceType:"Commercial", pestType:"Rodents", technicianInitials:"PM", technicianName:"Peter Mwangi", chemicals:[{name:"Brodifacoum Bait",qty:200,unit:"g",cost:480}], timeTaken:1.5, labourCost:1500, transportCost:350, followUpReason:"Preventive Check", status:"Completed", notes:"Monthly station check", satisfaction:5 },
  { id:"18", date:"2026-02-03", clientName:"Greenfield School", location:"Gigiri", serviceType:"School", pestType:"Cockroaches", technicianInitials:"RN", technicianName:"Ruth Njoroge", chemicals:[{name:"Demand CS",qty:100,unit:"ml",cost:850},{name:"Advion Gel",qty:25,unit:"g",cost:750}], timeTaken:3, labourCost:2800, transportCost:900, followUpReason:"Client Complaint", status:"Completed", notes:"Cafeteria outbreak before term starts", satisfaction:4 },
  { id:"19", date:"2026-02-10", clientName:"Lavington Spa", location:"Lavington", serviceType:"Commercial", pestType:"Mosquitoes", technicianInitials:"JM", technicianName:"James Mutua", chemicals:[{name:"Icon 10CS",qty:150,unit:"ml",cost:1650},{name:"Aqua Reslin",qty:80,unit:"ml",cost:348}], timeTaken:3, labourCost:2700, transportCost:800, followUpReason:"Client Complaint", status:"Completed", notes:"Rainy season increased mosquito pressure", satisfaction:4 },
  { id:"20", date:"2026-02-14", clientName:"Nairobi Butchery", location:"CBD", serviceType:"Food Processing", pestType:"Rodents", technicianInitials:"AK", technicianName:"Agnes Kamau", chemicals:[{name:"Ditrac",qty:500,unit:"g",cost:1500},{name:"Brodifacoum Bait",qty:200,unit:"g",cost:480}], timeTaken:2.5, labourCost:2200, transportCost:400, followUpReason:"Re-infestation", status:"Completed", notes:"Fresh rodent droppings in cold room", satisfaction:2 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const computeTotal = (entry) => {
  const chemCost = (entry.chemicals || []).reduce((s,c)=>s+(c.cost||0),0);
  return chemCost + (entry.labourCost||0) + (entry.transportCost||0);
};

const getMonthKey = (date) => {
  const d = new Date(date);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const formatKES = (n) => `KES ${Number(n||0).toLocaleString("en-KE",{maximumFractionDigits:0})}`;
const formatKESShort = (n) => n>=1000 ? `${(n/1000).toFixed(1)}K` : n;

const trendIcon = (val) => val > 0
  ? <TrendingUp size={14} color={COLORS.red} />
  : val < 0
  ? <TrendingDown size={14} color={COLORS.green} />
  : <Minus size={14} color={COLORS.textMuted} />;

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"10px 14px", fontFamily:"Outfit,sans-serif", fontSize:12 }}>
      <p style={{ color: COLORS.textMuted, marginBottom:6, fontWeight:600 }}>{label}</p>
      {payload.map((p,i)=>(
        <p key={i} style={{ color: p.color||COLORS.text, margin:"2px 0" }}>
          {p.name}: <span style={{ fontFamily:"JetBrains Mono,monospace", fontWeight:500 }}>KES {Number(p.value||0).toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children, wide }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)" }}
         onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:16, width:"100%", maxWidth: wide?"900px":"600px", maxHeight:"90vh", overflowY:"auto", margin:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px", borderBottom:`1px solid ${COLORS.border}`, position:"sticky", top:0, background:COLORS.card, zIndex:1 }}>
          <h2 style={{ fontFamily:"Bebas Neue,sans-serif", fontSize:22, color:COLORS.text, letterSpacing:"0.05em", margin:0 }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${COLORS.border}`, borderRadius:8, color:COLORS.textMuted, cursor:"pointer", padding:"4px 8px", display:"flex", alignItems:"center" }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  );
};

// ─── Form Input ───────────────────────────────────────────────────────────────
const Input = ({ label, ...props }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:600, color:COLORS.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</label>}
    <input style={{ width:"100%", background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"10px 14px", color:COLORS.text, fontFamily:"Outfit,sans-serif", fontSize:14, outline:"none", boxSizing:"border-box" }}
           {...props} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:600, color:COLORS.textMuted, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</label>}
    <select style={{ width:"100%", background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"10px 14px", color:COLORS.text, fontFamily:"Outfit,sans-serif", fontSize:14, outline:"none", boxSizing:"border-box" }}
            {...props}>
      {children}
    </select>
  </div>
);

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KPICard = ({ title, value, sub, icon: Icon, color, trend, trendLabel }) => (
  <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:14, padding:"20px 22px", position:"relative", overflow:"hidden", flex:1, minWidth:0 }}>
    <div style={{ position:"absolute", right:-10, top:-10, opacity:0.06, transform:"rotate(-15deg)" }}>
      <Icon size={90} color={color} />
    </div>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
      <div style={{ background:`${color}20`, borderRadius:8, padding:6, display:"flex" }}>
        <Icon size={16} color={color} />
      </div>
      <span style={{ fontSize:11, fontWeight:600, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</span>
    </div>
    <div style={{ fontFamily:"Bebas Neue,sans-serif", fontSize:28, color:COLORS.text, letterSpacing:"0.02em", lineHeight:1 }}>{value}</div>
    {sub && <div style={{ fontSize:12, color:COLORS.textMuted, marginTop:6 }}>{sub}</div>}
    {trend !== undefined && (
      <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:8, fontSize:12 }}>
        {trendIcon(trend)}
        <span style={{ color: trend>0?COLORS.red:trend<0?COLORS.green:COLORS.textMuted, fontFamily:"JetBrains Mono,monospace" }}>
          {trend>0?"+":""}{trend}%
        </span>
        <span style={{ color:COLORS.textMuted }}>{trendLabel}</span>
      </div>
    )}
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SCard = ({ title, children, action, span1 }) => (
  <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:14, overflow:"hidden", gridColumn: span1 ? undefined : "span 2" }}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:`1px solid ${COLORS.border}` }}>
      <span style={{ fontFamily:"Bebas Neue,sans-serif", fontSize:17, color:COLORS.text, letterSpacing:"0.05em" }}>{title}</span>
      {action && <span style={{ fontSize:12, color:COLORS.textMuted }}>{action}</span>}
    </div>
    <div style={{ padding:20 }}>{children}</div>
  </div>
);

// ─── Entry Form ───────────────────────────────────────────────────────────────
const EntryForm = ({ onSave, onClose, initial }) => {
  const blank = initial || {
    date: new Date().toISOString().split("T")[0],
    clientName:"", location:"", serviceType:"", pestType:"Cockroaches",
    technicianInitials:"", technicianName:"",
    chemicals:[{name:"",qty:"",unit:"ml",cost:""}],
    timeTaken:"", labourCost:"", transportCost:"",
    followUpReason:"Product Failure", status:"Completed", notes:"", satisfaction:4
  };
  const [form, setForm] = useState(blank);
  const set = (k,v)=>setForm(f=>({...f,[k]:v}));
  const setChem = (i,k,v)=>{
    const c=[...form.chemicals]; c[i]={...c[i],[k]:v}; set("chemicals",c);
  };

  const totalChemCost = form.chemicals.reduce((s,c)=>s+(Number(c.cost)||0),0);
  const grandTotal = totalChemCost+(Number(form.labourCost)||0)+(Number(form.transportCost)||0);

  const handleSave = ()=>{
    if(!form.clientName||!form.date||!form.technicianInitials) return alert("Please fill required fields: Client, Date, Technician.");
    onSave({
      ...form,
      id: initial?.id||String(Date.now()),
      timeTaken: Number(form.timeTaken)||0,
      labourCost: Number(form.labourCost)||0,
      transportCost: Number(form.transportCost)||0,
      satisfaction: Number(form.satisfaction)||4,
      chemicals: form.chemicals.filter(c=>c.name).map(c=>({...c,qty:Number(c.qty)||0,cost:Number(c.cost)||0}))
    });
    onClose();
  };

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
        <Input label="Date *" type="date" value={form.date} onChange={e=>set("date",e.target.value)} />
        <Input label="Client Name *" placeholder="e.g. Westlands Hotel" value={form.clientName} onChange={e=>set("clientName",e.target.value)} />
        <Input label="Location / Area" placeholder="e.g. Westlands, Nairobi" value={form.location} onChange={e=>set("location",e.target.value)} />
        <Input label="Service Type" placeholder="e.g. Hotel, Residential, School" value={form.serviceType} onChange={e=>set("serviceType",e.target.value)} />
        <Select label="Pest Type" value={form.pestType} onChange={e=>set("pestType",e.target.value)}>
          {PEST_TYPES.map(p=><option key={p}>{p}</option>)}
        </Select>
        <Select label="Follow-up Reason" value={form.followUpReason} onChange={e=>set("followUpReason",e.target.value)}>
          {FOLLOW_UP_REASONS.map(r=><option key={r}>{r}</option>)}
        </Select>
        <Input label="Technician Initials *" placeholder="e.g. JM" value={form.technicianInitials} onChange={e=>set("technicianInitials",e.target.value.toUpperCase())} />
        <Input label="Technician Full Name" placeholder="e.g. James Mutua" value={form.technicianName} onChange={e=>set("technicianName",e.target.value)} />
        <Input label="Time Taken (hours)" type="number" step="0.5" placeholder="e.g. 2.5" value={form.timeTaken} onChange={e=>set("timeTaken",e.target.value)} />
        <Select label="Status" value={form.status} onChange={e=>set("status",e.target.value)}>
          {SERVICE_STATUS.map(s=><option key={s}>{s}</option>)}
        </Select>
        <Input label="Labour Cost (KES)" type="number" placeholder="0" value={form.labourCost} onChange={e=>set("labourCost",e.target.value)} />
        <Input label="Transport Cost (KES)" type="number" placeholder="0" value={form.transportCost} onChange={e=>set("transportCost",e.target.value)} />
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <label style={{ fontSize:11, fontWeight:600, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.08em" }}>Chemicals Used</label>
          <button onClick={()=>set("chemicals",[...form.chemicals,{name:"",qty:"",unit:"ml",cost:""}])}
                  style={{ background:COLORS.greenGlow, border:`1px solid ${COLORS.green}`, borderRadius:6, color:COLORS.green, fontSize:11, padding:"4px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
            <Plus size={12} /> Add Chemical
          </button>
        </div>
        {form.chemicals.map((c,i)=>(
          <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr auto", gap:8, marginBottom:8, alignItems:"center" }}>
            <input style={{ background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"8px 12px", color:COLORS.text, fontFamily:"Outfit,sans-serif", fontSize:13, outline:"none" }}
                   placeholder="Chemical name" value={c.name} onChange={e=>setChem(i,"name",e.target.value)} />
            <input style={{ background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"8px 12px", color:COLORS.text, fontFamily:"Outfit,sans-serif", fontSize:13, outline:"none" }}
                   placeholder="Qty" type="number" value={c.qty} onChange={e=>setChem(i,"qty",e.target.value)} />
            <select style={{ background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"8px 12px", color:COLORS.text, fontFamily:"Outfit,sans-serif", fontSize:13, outline:"none" }}
                    value={c.unit} onChange={e=>setChem(i,"unit",e.target.value)}>
              {["ml","L","g","kg","pcs"].map(u=><option key={u}>{u}</option>)}
            </select>
            <input style={{ background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"8px 12px", color:COLORS.text, fontFamily:"Outfit,sans-serif", fontSize:13, outline:"none" }}
                   placeholder="Cost KES" type="number" value={c.cost} onChange={e=>setChem(i,"cost",e.target.value)} />
            <button onClick={()=>{ const arr=[...form.chemicals]; arr.splice(i,1); set("chemicals",arr.length?arr:[{name:"",qty:"",unit:"ml",cost:""}]); }}
                    style={{ background:"none", border:"none", color:COLORS.red, cursor:"pointer", padding:4 }}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom:16 }}>
        <label style={{ display:"block", fontSize:11, fontWeight:600, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Client Satisfaction (1-5)</label>
        <div style={{ display:"flex", gap:8 }}>
          {[1,2,3,4,5].map(n=>(
            <button key={n} onClick={()=>set("satisfaction",n)}
                    style={{ flex:1, padding:"8px 0", borderRadius:8, border:`1px solid ${form.satisfaction>=n?COLORS.amber:COLORS.border}`, background:form.satisfaction>=n?"rgba(245,158,11,0.15)":"none", color:form.satisfaction>=n?COLORS.amber:COLORS.textMuted, fontSize:14, cursor:"pointer" }}>
              {"★"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:20 }}>
        <label style={{ display:"block", fontSize:11, fontWeight:600, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Notes</label>
        <textarea rows={2} style={{ width:"100%", background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:8, padding:"10px 14px", color:COLORS.text, fontFamily:"Outfit,sans-serif", fontSize:14, outline:"none", boxSizing:"border-box", resize:"vertical" }}
                  placeholder="Observations, recommendations..." value={form.notes} onChange={e=>set("notes",e.target.value)} />
      </div>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", background:COLORS.surface, borderRadius:10, marginBottom:20 }}>
        <span style={{ fontSize:13, color:COLORS.textMuted }}>Total Follow-up Cost</span>
        <span style={{ fontFamily:"Bebas Neue,sans-serif", fontSize:24, color:COLORS.green }}>{formatKES(grandTotal)}</span>
      </div>

      <div style={{ display:"flex", gap:12, justifyContent:"flex-end" }}>
        <button onClick={onClose} style={{ padding:"10px 24px", borderRadius:8, border:`1px solid ${COLORS.border}`, background:"none", color:COLORS.textMuted, cursor:"pointer", fontFamily:"Outfit,sans-serif", fontSize:14 }}>Cancel</button>
        <button onClick={handleSave} style={{ padding:"10px 28px", borderRadius:8, border:"none", background:COLORS.green, color:"#000", cursor:"pointer", fontFamily:"Outfit,sans-serif", fontSize:14, fontWeight:700 }}>Save Entry</button>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function QzoneIPMDashboard() {
  const [entries, setEntries] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAdd, setShowAdd] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [viewEntry, setViewEntry] = useState(null);
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("All");
  const [loading, setLoading] = useState(true);

  // Load from storage
  useEffect(()=>{
    (async()=>{
      try {
        const res = await window.storage.get("qzone_entries");
        if(res?.value) setEntries(JSON.parse(res.value));
        else setEntries(SEED_DATA);
      } catch { setEntries(SEED_DATA); }
      setLoading(false);
    })();
  },[]);

  // Save to storage
  const saveEntries = useCallback(async(newEntries)=>{
    setEntries(newEntries);
    try { await window.storage.set("qzone_entries", JSON.stringify(newEntries)); } catch {}
  },[]);

  const addEntry = (e)=>{
    if(editEntry) saveEntries(entries.map(x=>x.id===editEntry.id?e:x));
    else saveEntries([...entries, e]);
    setEditEntry(null);
  };

  const deleteEntry = (id)=>{ if(confirm("Delete this follow-up record?")) saveEntries(entries.filter(e=>e.id!==id)); };

  // Compute totals
  const enriched = useMemo(()=>entries.map(e=>({...e, total:computeTotal(e), monthKey:getMonthKey(e.date)})),[entries]);

  // Available months
  const allMonths = useMemo(()=>{
    const keys = [...new Set(enriched.map(e=>e.monthKey))].sort((a,b)=>new Date(a)-new Date(b));
    return ["All",...keys];
  },[enriched]);

  // Filter
  const filtered = useMemo(()=>{
    let arr = enriched;
    if(filterMonth!=="All") arr=arr.filter(e=>e.monthKey===filterMonth);
    if(search) arr=arr.filter(e=>
      e.clientName.toLowerCase().includes(search.toLowerCase())||
      e.technicianInitials.toLowerCase().includes(search.toLowerCase())||
      e.pestType.toLowerCase().includes(search.toLowerCase())
    );
    return arr.sort((a,b)=>new Date(b.date)-new Date(a.date));
  },[enriched,filterMonth,search]);

  // Monthly aggregates (for charts)
  const monthlyData = useMemo(()=>{
    const map={};
    enriched.forEach(e=>{
      if(!map[e.monthKey]) map[e.monthKey]={month:e.monthKey,labour:0,transport:0,chemicals:0,total:0,count:0};
      const chemCost=(e.chemicals||[]).reduce((s,c)=>s+(c.cost||0),0);
      map[e.monthKey].labour+=e.labourCost||0;
      map[e.monthKey].transport+=e.transportCost||0;
      map[e.monthKey].chemicals+=chemCost;
      map[e.monthKey].total+=e.total;
      map[e.monthKey].count+=1;
    });
    return Object.values(map).sort((a,b)=>new Date(a.month)-new Date(b.month));
  },[enriched]);

  // Client aggregates
  const clientData = useMemo(()=>{
    const map={};
    enriched.forEach(e=>{
      if(!map[e.clientName]) map[e.clientName]={client:e.clientName,total:0,count:0,avgSat:0,satSum:0,techs:new Set()};
      map[e.clientName].total+=e.total;
      map[e.clientName].count+=1;
      map[e.clientName].satSum+=(e.satisfaction||0);
      map[e.clientName].techs.add(e.technicianInitials);
    });
    return Object.values(map).map(c=>({...c,avgSat:(c.satSum/c.count).toFixed(1),techs:[...c.techs].join(", ")})).sort((a,b)=>b.total-a.total);
  },[enriched]);

  // Technician aggregates
  const techData = useMemo(()=>{
    const map={};
    enriched.forEach(e=>{
      const k=e.technicianInitials;
      if(!map[k]) map[k]={initials:k,name:e.technicianName||k,total:0,count:0,hours:0,avgSat:0,satSum:0};
      map[k].total+=e.total;
      map[k].count+=1;
      map[k].hours+=e.timeTaken||0;
      map[k].satSum+=(e.satisfaction||0);
    });
    return Object.values(map).map(t=>({...t,avgSat:(t.satSum/t.count).toFixed(1),avgCost:Math.round(t.total/t.count)})).sort((a,b)=>b.count-a.count);
  },[enriched]);

  // Pest type pie
  const pestPie = useMemo(()=>{
    const map={};
    enriched.forEach(e=>{ map[e.pestType]=(map[e.pestType]||0)+1; });
    return Object.entries(map).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  },[enriched]);

  // Reason breakdown
  const reasonData = useMemo(()=>{
    const map={};
    enriched.forEach(e=>{ map[e.followUpReason]=(map[e.followUpReason]||0)+1; });
    return Object.entries(map).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  },[enriched]);

  // KPIs
  const totalCost = enriched.reduce((s,e)=>s+e.total,0);
  const thisMonth = MONTHS[new Date().getMonth()]+" "+new Date().getFullYear();
  const lastMonth = (()=>{ const d=new Date(); d.setMonth(d.getMonth()-1); return MONTHS[d.getMonth()]+" "+d.getFullYear(); })();
  const thisMonthCost = enriched.filter(e=>e.monthKey===thisMonth).reduce((s,e)=>s+e.total,0);
  const lastMonthCost = enriched.filter(e=>e.monthKey===lastMonth).reduce((s,e)=>s+e.total,0);
  const momTrend = lastMonthCost ? Math.round(((thisMonthCost-lastMonthCost)/lastMonthCost)*100) : 0;
  const avgSat = enriched.length ? (enriched.reduce((s,e)=>s+(e.satisfaction||0),0)/enriched.length).toFixed(1) : 0;
  const totalHours = enriched.reduce((s,e)=>s+(e.timeTaken||0),0);
  const uniqueClients = new Set(enriched.map(e=>e.clientName)).size;

  const tabStyle = (t) => ({
    padding:"10px 20px", borderRadius:8, border:"none", cursor:"pointer",
    fontFamily:"Outfit,sans-serif", fontWeight:600, fontSize:14,
    background: activeTab===t ? COLORS.green : "none",
    color: activeTab===t ? "#000" : COLORS.textMuted,
    transition:"all 0.2s"
  });

  if(loading) return (
    <div style={{ minHeight:"100vh", background:COLORS.bg, display:"flex", alignItems:"center", justifyContent:"center", color:COLORS.green, fontFamily:"Bebas Neue,sans-serif", fontSize:24, letterSpacing:"0.1em" }}>
      Loading QZone IPM...
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:COLORS.bg, color:COLORS.text, fontFamily:"Outfit,sans-serif" }}>
      {/* Global styles */}
      <style>{`
        * { box-sizing:border-box; scrollbar-width:thin; scrollbar-color:${COLORS.border} transparent; }
        input::placeholder, textarea::placeholder { color:${COLORS.textDim}; }
        input:focus, select:focus, textarea:focus { border-color:${COLORS.green}!important; box-shadow:0 0 0 3px ${COLORS.greenGlow}; }
        select option { background:${COLORS.surface}; color:${COLORS.text}; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Header */}
      <div style={{ background:COLORS.surface, borderBottom:`1px solid ${COLORS.border}`, padding:"0 24px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:1400, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ background:COLORS.green, borderRadius:10, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Bug size={20} color="#000" />
            </div>
            <div>
              <div style={{ fontFamily:"Bebas Neue,sans-serif", fontSize:20, letterSpacing:"0.08em", color:COLORS.text, lineHeight:1 }}>QZONE IPM</div>
              <div style={{ fontSize:10, color:COLORS.textMuted, letterSpacing:"0.12em", textTransform:"uppercase" }}>Follow-up Cost Tracker</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            {["dashboard","records","clients","technicians"].map(t=>(
              <button key={t} style={tabStyle(t)} onClick={()=>setActiveTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>
          <button onClick={()=>setShowAdd(true)} style={{ display:"flex", alignItems:"center", gap:8, background:COLORS.green, border:"none", borderRadius:10, padding:"10px 18px", color:"#000", fontFamily:"Outfit,sans-serif", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            <Plus size={16} /> New Follow-up
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth:1400, margin:"0 auto", padding:24 }}>

        {/* ── DASHBOARD ── */}
        {activeTab==="dashboard" && (
          <div>
            {/* KPI Row */}
            <div style={{ display:"flex", gap:14, marginBottom:20, flexWrap:"wrap" }}>
              <KPICard title="Total Follow-up Costs" value={formatKES(totalCost)} sub={`Across ${enriched.length} follow-ups`} icon={DollarSign} color={COLORS.green} />
              <KPICard title={`${thisMonth} Costs`} value={formatKES(thisMonthCost)} sub="Current month" icon={Calendar} color={COLORS.amber} trend={momTrend} trendLabel="vs last month" />
              <KPICard title="Active Clients" value={uniqueClients} sub={`${enriched.length} total follow-ups`} icon={Users} color={COLORS.blue} />
              <KPICard title="Avg Satisfaction" value={`${avgSat} / 5`} sub={`${enriched.filter(e=>e.status==="Escalated").length} escalated`} icon={AlertCircle} color={COLORS.purple} />
              <KPICard title="Field Hours Logged" value={`${totalHours}h`} sub={`${(totalHours/enriched.length||0).toFixed(1)}h avg/visit`} icon={Clock} color={COLORS.cyan} />
            </div>

            {/* Charts Grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

              {/* Monthly Cost Trend */}
              <SCard title="Monthly Cost Trend" action="Labour + Transport + Chemicals">
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={monthlyData}>
                    <defs>
                      <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.3}/>
                        <stop offset="100%" stopColor={COLORS.green} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="month" tick={{ fill:COLORS.textMuted, fontSize:11, fontFamily:"Outfit" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:COLORS.textMuted, fontSize:11, fontFamily:"JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={formatKESShort} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="total" name="Total" fill="url(#totalGrad)" stroke={COLORS.green} strokeWidth={2} dot={{ fill:COLORS.green, r:3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </SCard>

              {/* Cost Breakdown Stacked Bar */}
              <SCard title="Cost Breakdown by Month" action="Stacked by category">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="month" tick={{ fill:COLORS.textMuted, fontSize:11, fontFamily:"Outfit" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:COLORS.textMuted, fontSize:11, fontFamily:"JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={formatKESShort} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize:12, color:COLORS.textMuted }} />
                    <Bar dataKey="labour" name="Labour" stackId="a" fill={COLORS.blue} radius={[0,0,0,0]} />
                    <Bar dataKey="transport" name="Transport" stackId="a" fill={COLORS.amber} />
                    <Bar dataKey="chemicals" name="Chemicals" stackId="a" fill={COLORS.green} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </SCard>

              {/* Top Clients by Cost */}
              <SCard title="Top Clients by Follow-up Cost" action="All time">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={clientData.slice(0,6)} layout="vertical" barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
                    <XAxis type="number" tick={{ fill:COLORS.textMuted, fontSize:11, fontFamily:"JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={formatKESShort} />
                    <YAxis type="category" dataKey="client" width={110} tick={{ fill:COLORS.text, fontSize:11, fontFamily:"Outfit" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total" name="Total Cost" fill={COLORS.green} radius={[0,4,4,0]}>
                      {clientData.slice(0,6).map((_,i)=>(
                        <Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </SCard>

              {/* Pest Type Distribution */}
              <SCard title="Follow-ups by Pest Type" action="All time">
                <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                  <ResponsiveContainer width="50%" height={200}>
                    <PieChart>
                      <Pie data={pestPie} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                        {pestPie.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v,n)=>[v+" visits",n]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex:1 }}>
                    {pestPie.map((p,i)=>(
                      <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${COLORS.border}` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:8, height:8, borderRadius:"50%", background:CHART_COLORS[i%CHART_COLORS.length] }} />
                          <span style={{ fontSize:12, color:COLORS.text }}>{p.name}</span>
                        </div>
                        <span style={{ fontSize:12, fontFamily:"JetBrains Mono,monospace", color:COLORS.textMuted }}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SCard>

              {/* Follow-up Reasons */}
              <SCard title="Follow-up Root Causes" action="Why clients call back" span1>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={reasonData} barSize={30}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="name" tick={{ fill:COLORS.textMuted, fontSize:10, fontFamily:"Outfit" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:COLORS.textMuted, fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v)=>[v+" incidents"]} />
                    <Bar dataKey="value" name="Count" radius={[4,4,0,0]}>
                      {reasonData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </SCard>

              {/* Technician Performance Radar */}
              <SCard title="Technician Cost Distribution" action="By visits" span1>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={techData} barSize={35}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="initials" tick={{ fill:COLORS.text, fontSize:13, fontFamily:"JetBrains Mono", fontWeight:600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:COLORS.textMuted, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={formatKESShort} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total" name="Total Cost" radius={[6,6,0,0]}>
                      {techData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </SCard>

              {/* Avg Cost per Visit Trend */}
              <SCard title="Average Cost Per Visit — Monthly Trend">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlyData.map(m=>({...m,avg:m.count?Math.round(m.total/m.count):0}))}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="month" tick={{ fill:COLORS.textMuted, fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:COLORS.textMuted, fontSize:11, fontFamily:"JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={formatKESShort} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="avg" name="Avg Cost / Visit" stroke={COLORS.amber} strokeWidth={2.5} dot={{ fill:COLORS.amber, r:4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </SCard>

              {/* Visit Count Trend */}
              <SCard title="Follow-up Visit Volume — Monthly">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="month" tick={{ fill:COLORS.textMuted, fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:COLORS.textMuted, fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v)=>[v+" visits"]} />
                    <Bar dataKey="count" name="Visits" radius={[4,4,0,0]} fill={COLORS.purple} />
                  </BarChart>
                </ResponsiveContainer>
              </SCard>

            </div>
          </div>
        )}

        {/* ── RECORDS ── */}
        {activeTab==="records" && (
          <div>
            <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"center" }}>
              <div style={{ flex:1, position:"relative" }}>
                <Search size={16} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:COLORS.textMuted }} />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search client, technician, pest…"
                       style={{ width:"100%", background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"10px 14px 10px 40px", color:COLORS.text, fontFamily:"Outfit,sans-serif", fontSize:14, outline:"none" }} />
              </div>
              <select value={filterMonth} onChange={e=>setFilterMonth(e.target.value)}
                      style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"10px 14px", color:COLORS.text, fontFamily:"Outfit,sans-serif", fontSize:14, outline:"none" }}>
                {allMonths.map(m=><option key={m}>{m}</option>)}
              </select>
              <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:13, color:COLORS.textMuted, background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:10, padding:"10px 16px" }}>
                {filtered.length} records · {formatKES(filtered.reduce((s,e)=>s+e.total,0))}
              </div>
            </div>

            <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:14, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:COLORS.surface }}>
                    {["Date","Client","Pest","Tech","Labour","Transport","Chemicals","Total","Status","Sat",""].map(h=>(
                      <th key={h} style={{ padding:"12px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", borderBottom:`1px solid ${COLORS.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e,i)=>{
                    const chemCost=(e.chemicals||[]).reduce((s,c)=>s+(c.cost||0),0);
                    const statusColor = {Completed:COLORS.green,Pending:COLORS.amber,"In Progress":COLORS.blue,Escalated:COLORS.red}[e.status]||COLORS.textMuted;
                    return (
                      <tr key={e.id} style={{ borderBottom:`1px solid ${COLORS.border}`, background:i%2===0?"transparent":"rgba(255,255,255,0.01)" }}
                          onMouseEnter={ev=>ev.currentTarget.style.background="rgba(34,197,94,0.04)"}
                          onMouseLeave={ev=>ev.currentTarget.style.background=i%2===0?"transparent":"rgba(255,255,255,0.01)"}>
                        <td style={{ padding:"10px 14px", fontSize:12, color:COLORS.textMuted, fontFamily:"JetBrains Mono,monospace", whiteSpace:"nowrap" }}>{e.date}</td>
                        <td style={{ padding:"10px 14px" }}>
                          <div style={{ fontSize:13, fontWeight:600, color:COLORS.text }}>{e.clientName}</div>
                          <div style={{ fontSize:11, color:COLORS.textMuted }}>{e.location}</div>
                        </td>
                        <td style={{ padding:"10px 14px", fontSize:12, color:COLORS.text }}>{e.pestType}</td>
                        <td style={{ padding:"10px 14px" }}>
                          <span style={{ background:COLORS.greenGlow, border:`1px solid ${COLORS.green}40`, borderRadius:6, padding:"3px 8px", fontSize:12, fontFamily:"JetBrains Mono,monospace", fontWeight:700, color:COLORS.green }}>{e.technicianInitials}</span>
                        </td>
                        <td style={{ padding:"10px 14px", fontSize:12, fontFamily:"JetBrains Mono,monospace", color:COLORS.text }}>{(e.labourCost||0).toLocaleString()}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, fontFamily:"JetBrains Mono,monospace", color:COLORS.text }}>{(e.transportCost||0).toLocaleString()}</td>
                        <td style={{ padding:"10px 14px", fontSize:12, fontFamily:"JetBrains Mono,monospace", color:COLORS.text }}>{chemCost.toLocaleString()}</td>
                        <td style={{ padding:"10px 14px", fontSize:13, fontFamily:"JetBrains Mono,monospace", fontWeight:700, color:COLORS.green }}>{e.total.toLocaleString()}</td>
                        <td style={{ padding:"10px 14px" }}>
                          <span style={{ background:`${statusColor}20`, border:`1px solid ${statusColor}40`, borderRadius:6, padding:"3px 10px", fontSize:11, color:statusColor, whiteSpace:"nowrap" }}>{e.status}</span>
                        </td>
                        <td style={{ padding:"10px 14px", fontSize:13, color:COLORS.amber }}>{"★".repeat(e.satisfaction||0)}<span style={{ color:COLORS.border }}>{"★".repeat(5-(e.satisfaction||0))}</span></td>
                        <td style={{ padding:"10px 14px" }}>
                          <div style={{ display:"flex", gap:6 }}>
                            <button onClick={()=>setViewEntry(e)} style={{ background:"none", border:`1px solid ${COLORS.border}`, borderRadius:6, color:COLORS.textMuted, cursor:"pointer", padding:"4px 7px" }} title="View"><Eye size={13} /></button>
                            <button onClick={()=>{ setEditEntry(e); setShowAdd(true); }} style={{ background:"none", border:`1px solid ${COLORS.border}`, borderRadius:6, color:COLORS.textMuted, cursor:"pointer", padding:"4px 7px" }} title="Edit"><Edit2 size={13} /></button>
                            <button onClick={()=>deleteEntry(e.id)} style={{ background:"none", border:`1px solid ${COLORS.red}40`, borderRadius:6, color:COLORS.red, cursor:"pointer", padding:"4px 7px" }} title="Delete"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length===0 && (
                    <tr><td colSpan={11} style={{ padding:40, textAlign:"center", color:COLORS.textMuted, fontSize:14 }}>No records found. Add your first follow-up!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CLIENTS ── */}
        {activeTab==="clients" && (
          <div>
            <div style={{ marginBottom:16, fontSize:13, color:COLORS.textMuted }}>{clientData.length} clients tracked</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:14, marginBottom:24 }}>
              {clientData.map((c,i)=>{
                const clientEntries=enriched.filter(e=>e.clientName===c.client).sort((a,b)=>new Date(b.date)-new Date(a.date));
                const lastVisit=clientEntries[0];
                const satNum=Number(c.avgSat);
                return (
                  <div key={i} style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:14, padding:20, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${CHART_COLORS[i%8]}, transparent)` }} />
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:COLORS.text, marginBottom:2 }}>{c.client}</div>
                        <div style={{ fontSize:11, color:COLORS.textMuted }}>{lastVisit?.location} · {lastVisit?.serviceType}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"Bebas Neue,sans-serif", fontSize:20, color:COLORS.green }}>{formatKES(c.total)}</div>
                        <div style={{ fontSize:11, color:COLORS.textMuted }}>{c.count} follow-up{c.count!==1?"s":""}</div>
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
                      <div style={{ background:COLORS.surface, borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                        <div style={{ fontSize:18, fontFamily:"Bebas Neue,sans-serif", color:COLORS.text }}>{formatKES(Math.round(c.total/c.count))}</div>
                        <div style={{ fontSize:10, color:COLORS.textMuted }}>Avg/visit</div>
                      </div>
                      <div style={{ background:COLORS.surface, borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                        <div style={{ fontSize:18, fontFamily:"Bebas Neue,sans-serif", color:satNum>=4?COLORS.green:satNum>=3?COLORS.amber:COLORS.red }}>{c.avgSat}★</div>
                        <div style={{ fontSize:10, color:COLORS.textMuted }}>Satisfaction</div>
                      </div>
                      <div style={{ background:COLORS.surface, borderRadius:8, padding:"8px 10px", textAlign:"center" }}>
                        <div style={{ fontSize:13, fontFamily:"JetBrains Mono,monospace", fontWeight:700, color:COLORS.cyan, wordBreak:"break-all" }}>{c.techs}</div>
                        <div style={{ fontSize:10, color:COLORS.textMuted }}>Technicians</div>
                      </div>
                    </div>
                    <div style={{ fontSize:11, color:COLORS.textMuted, display:"flex", justifyContent:"space-between" }}>
                      <span>Last visit: <span style={{ color:COLORS.text, fontFamily:"JetBrains Mono,monospace" }}>{lastVisit?.date}</span></span>
                      <span>Reason: <span style={{ color:COLORS.amber }}>{lastVisit?.followUpReason}</span></span>
                    </div>
                    {/* Mini trend */}
                    <div style={{ marginTop:12 }}>
                      <ResponsiveContainer width="100%" height={50}>
                        <AreaChart data={clientEntries.slice().reverse().map(e=>({date:e.date.slice(5),v:e.total}))}>
                          <defs>
                            <linearGradient id={`cg${i}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={CHART_COLORS[i%8]} stopOpacity={0.3}/>
                              <stop offset="100%" stopColor={CHART_COLORS[i%8]} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="v" stroke={CHART_COLORS[i%8]} fill={`url(#cg${i})`} strokeWidth={1.5} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TECHNICIANS ── */}
        {activeTab==="technicians" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14, marginBottom:24 }}>
              {techData.map((t,i)=>{
                const techEntries=enriched.filter(e=>e.technicianInitials===t.initials);
                const byPest={};
                techEntries.forEach(e=>{ byPest[e.pestType]=(byPest[e.pestType]||0)+1; });
                const topPest=Object.entries(byPest).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—";
                return (
                  <div key={i} style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:14, padding:24, position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", right:-20, bottom:-20, opacity:0.05 }}>
                      <UserCheck size={120} color={CHART_COLORS[i%8]} />
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                      <div style={{ width:52, height:52, borderRadius:14, background:`${CHART_COLORS[i%8]}20`, border:`2px solid ${CHART_COLORS[i%8]}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Bebas Neue,sans-serif", fontSize:22, color:CHART_COLORS[i%8] }}>
                        {t.initials}
                      </div>
                      <div>
                        <div style={{ fontSize:15, fontWeight:700, color:COLORS.text }}>{t.name}</div>
                        <div style={{ fontSize:11, color:COLORS.textMuted }}>Field Technician</div>
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                      {[
                        {l:"Total Jobs",v:t.count},
                        {l:"Hours Logged",v:`${t.hours}h`},
                        {l:"Total Cost",v:formatKES(t.total)},
                        {l:"Avg Cost/Visit",v:formatKES(t.avgCost)},
                        {l:"Avg Satisfaction",v:`${t.avgSat}★`},
                        {l:"Top Pest",v:topPest},
                      ].map(({l,v},j)=>(
                        <div key={j} style={{ background:COLORS.surface, borderRadius:8, padding:"10px 12px" }}>
                          <div style={{ fontSize:10, color:COLORS.textMuted, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>{l}</div>
                          <div style={{ fontSize:13, fontWeight:700, color:COLORS.text, fontFamily:"JetBrains Mono,monospace" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {/* Month by month */}
                    <ResponsiveContainer width="100%" height={60}>
                      <BarChart data={monthlyData.map(m=>({month:m.month.split(" ")[0],cost:techEntries.filter(e=>e.monthKey===m.month).reduce((s,e)=>s+e.total,0)}))}>
                        <Bar dataKey="cost" fill={CHART_COLORS[i%8]} radius={[3,3,0,0]} />
                        <Tooltip content={<CustomTooltip />} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ textAlign:"center", fontSize:10, color:COLORS.textDim, marginTop:4 }}>Monthly cost distribution</div>
                  </div>
                );
              })}
            </div>

            {/* Tech comparison table */}
            <SCard title="Technician Performance Comparison">
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr>
                    {["Technician","Initials","Jobs","Hours","Total Cost","Avg/Visit","Avg Satisfaction"].map(h=>(
                      <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, fontWeight:700, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", borderBottom:`1px solid ${COLORS.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {techData.map((t,i)=>(
                    <tr key={i} style={{ borderBottom:`1px solid ${COLORS.border}` }}>
                      <td style={{ padding:"12px 14px", fontSize:14, fontWeight:600, color:COLORS.text }}>{t.name}</td>
                      <td style={{ padding:"12px 14px" }}>
                        <span style={{ background:`${CHART_COLORS[i%8]}20`, border:`1px solid ${CHART_COLORS[i%8]}40`, borderRadius:6, padding:"3px 10px", fontSize:13, fontFamily:"JetBrains Mono,monospace", fontWeight:700, color:CHART_COLORS[i%8] }}>{t.initials}</span>
                      </td>
                      <td style={{ padding:"12px 14px", fontSize:13, fontFamily:"JetBrains Mono,monospace", color:COLORS.text }}>{t.count}</td>
                      <td style={{ padding:"12px 14px", fontSize:13, fontFamily:"JetBrains Mono,monospace", color:COLORS.text }}>{t.hours}h</td>
                      <td style={{ padding:"12px 14px", fontSize:13, fontFamily:"JetBrains Mono,monospace", fontWeight:700, color:COLORS.green }}>{formatKES(t.total)}</td>
                      <td style={{ padding:"12px 14px", fontSize:13, fontFamily:"JetBrains Mono,monospace", color:COLORS.text }}>{formatKES(t.avgCost)}</td>
                      <td style={{ padding:"12px 14px", fontSize:13, color:Number(t.avgSat)>=4?COLORS.green:Number(t.avgSat)>=3?COLORS.amber:COLORS.red }}>
                        {"★".repeat(Math.round(Number(t.avgSat)))} {t.avgSat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SCard>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={showAdd} onClose={()=>{ setShowAdd(false); setEditEntry(null); }} title={editEntry?"Edit Follow-up Record":"Log New Follow-up"} wide>
        <EntryForm onSave={addEntry} onClose={()=>{ setShowAdd(false); setEditEntry(null); }} initial={editEntry} />
      </Modal>

      {/* View Modal */}
      <Modal open={!!viewEntry} onClose={()=>setViewEntry(null)} title="Follow-up Details" wide>
        {viewEntry && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
              {[
                {l:"Client",v:viewEntry.clientName},
                {l:"Date",v:viewEntry.date},
                {l:"Location",v:viewEntry.location||"—"},
                {l:"Pest Type",v:viewEntry.pestType},
                {l:"Service Type",v:viewEntry.serviceType||"—"},
                {l:"Follow-up Reason",v:viewEntry.followUpReason},
                {l:"Technician",v:`${viewEntry.technicianName||""} (${viewEntry.technicianInitials})`},
                {l:"Time Taken",v:`${viewEntry.timeTaken}h`},
                {l:"Status",v:viewEntry.status},
                {l:"Labour Cost",v:formatKES(viewEntry.labourCost)},
                {l:"Transport Cost",v:formatKES(viewEntry.transportCost)},
                {l:"Client Satisfaction",v:`${"★".repeat(viewEntry.satisfaction||0)} (${viewEntry.satisfaction}/5)`},
              ].map(({l,v},i)=>(
                <div key={i} style={{ background:COLORS.surface, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:14, color:COLORS.text, fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background:COLORS.surface, borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
              <div style={{ fontSize:11, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Chemicals Used</div>
              {viewEntry.chemicals?.length ? viewEntry.chemicals.map((c,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:i<viewEntry.chemicals.length-1?`1px solid ${COLORS.border}`:"none", fontSize:13 }}>
                  <span style={{ color:COLORS.text }}>{c.name} — {c.qty}{c.unit}</span>
                  <span style={{ fontFamily:"JetBrains Mono,monospace", color:COLORS.green }}>{formatKES(c.cost)}</span>
                </div>
              )) : <span style={{ color:COLORS.textMuted, fontSize:13 }}>No chemicals recorded</span>}
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:`${COLORS.green}15`, border:`1px solid ${COLORS.green}40`, borderRadius:10, padding:"14px 18px" }}>
              <span style={{ fontSize:14, color:COLORS.text, fontWeight:600 }}>TOTAL FOLLOW-UP COST</span>
              <span style={{ fontFamily:"Bebas Neue,sans-serif", fontSize:28, color:COLORS.green }}>{formatKES(viewEntry.total)}</span>
            </div>
            {viewEntry.notes && (
              <div style={{ marginTop:14, background:COLORS.surface, borderRadius:10, padding:"12px 16px", fontSize:13, color:COLORS.textMuted, lineHeight:1.6 }}>
                <strong style={{ color:COLORS.text }}>Notes: </strong>{viewEntry.notes}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

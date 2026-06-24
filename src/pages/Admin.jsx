// src/pages/Admin.jsx – full admin dashboard
import { useState } from "react";
import INITIAL_WORKERS from "../data/workers.js";

const NAV = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "workers",   icon: "👷", label: "Workers" },
  { id: "bookings",  icon: "📋", label: "All Bookings" },
  { id: "addworker", icon: "➕", label: "Add Worker" },
];

export default function Admin({ bookings, addToast }) {
  const [section, setSection] = useState("dashboard");
  const [workers, setWorkers] = useState(INITIAL_WORKERS);
  const [workerFilter, setWorkerFilter] = useState("all");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [form, setForm] = useState({ name:"",phone:"",email:"",category:"Cleaning Services",skills:"",status:"active" });
  const [formErr, setFormErr] = useState({});

  function setF(k,v) { setForm(f=>({...f,[k]:v})); setFormErr(e=>({...e,[k]:""})); }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalRevenue = bookings.filter(b=>b.status==="confirmed").reduce((a,b)=>a+(b.total||b.price||0),0);
  const activeWorkers = workers.filter(w=>w.status==="active").length;
  const avgRating = workers.length ? (workers.reduce((a,w)=>a+w.rating,0)/workers.length).toFixed(1) : "—";

  // ── Add worker ─────────────────────────────────────────────────────────────
  function addWorker() {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "10 digits";
    if (!form.email.includes("@")) e.email = "Valid email";
    if (!form.skills.trim()) e.skills = "Required";
    setFormErr(e);
    if (Object.keys(e).length) return;
    const w = {
      id: Date.now(),
      name: form.name, phone: form.phone, email: form.email,
      category: form.category, status: form.status,
      skills: form.skills.split(",").map(s=>s.trim()).filter(Boolean),
      tasks: 0, completedServices: 0, rating: 0,
      joined: new Date().toISOString().split("T")[0],
      avatar: form.name.split(" ").map(p=>p[0]).join("").toUpperCase().slice(0,2),
    };
    setWorkers(prev => [w, ...prev]);
    setForm({ name:"",phone:"",email:"",category:"Cleaning Services",skills:"",status:"active" });
    addToast("Worker added successfully! 👷", "success");
    setSection("workers");
  }

  function toggleStatus(id) {
    setWorkers(prev => prev.map(w => w.id===id ? {...w, status: w.status==="active"?"inactive":"active"} : w));
  }

  function removeWorker(id) {
    if (!confirm("Remove this worker?")) return;
    setWorkers(prev => prev.filter(w => w.id!==id));
    addToast("Worker removed.", "info");
  }

  // ── Renders ────────────────────────────────────────────────────────────────
  function renderDashboard() {
    const recentBookings = [...bookings].slice(0,5);
    const topWorkers = [...workers].sort((a,b)=>b.rating-a.rating).slice(0,5);
    return (
      <div>
        <h2 style={{fontFamily:"var(--font-display)",fontSize:"1.4rem",fontWeight:800,marginBottom:20}}>Dashboard Overview</h2>
        {/* Stat cards */}
        <div className="admin-stat-grid">
          {[
            {icon:"📋",label:"Total Bookings",value:bookings.length,color:"#eff6ff"},
            {icon:"✅",label:"Confirmed",value:bookings.filter(b=>b.status==="confirmed").length,color:"#f0fdf4"},
            {icon:"❌",label:"Cancelled",value:bookings.filter(b=>b.status==="cancelled").length,color:"#fef2f2"},
            {icon:"💰",label:"Total Revenue",value:`₹${totalRevenue.toLocaleString()}`,color:"#fefce8"},
            {icon:"👷",label:"Total Workers",value:workers.length,color:"#f5f3ff"},
            {icon:"🟢",label:"Active Workers",value:activeWorkers,color:"#f0fdf4"},
            {icon:"⭐",label:"Avg Rating",value:avgRating,color:"#fffbeb"},
          ].map((s,i) => (
            <div key={i} className="stat-card" style={{borderTop:`3px solid var(--blue)`}}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{gap:24,marginTop:8}}>
          {/* Recent bookings */}
          <div>
            <h3 className="section-title">Recent Bookings</h3>
            {recentBookings.length === 0 ? <p style={{color:"var(--gray-400)",fontSize:".87rem"}}>No bookings yet.</p> : (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {recentBookings.map(b => (
                  <div key={b.id} style={{background:"#fff",border:"1.5px solid var(--gray-200)",borderRadius:10,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:".88rem"}}>{b.serviceName}</div>
                      <div style={{fontSize:".76rem",color:"var(--gray-400)"}}>{b.date} · ₹{b.total||b.price}</div>
                    </div>
                    <span className={`badge ${b.status==="confirmed"?"badge-green":"badge-red"}`}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top workers */}
          <div>
            <h3 className="section-title">Top Rated Workers</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {topWorkers.map(w => (
                <div key={w.id} style={{background:"#fff",border:"1.5px solid var(--gray-200)",borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
                  <div className="worker-avatar">{w.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:".88rem"}}>{w.name}</div>
                    <div style={{fontSize:".75rem",color:"var(--gray-400)"}}>{w.category}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:".88rem",fontWeight:700,color:"#f59e0b"}}>⭐ {w.rating}</div>
                    <div style={{fontSize:".74rem",color:"var(--gray-400)"}}>{w.completedServices} jobs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderWorkers() {
    const list = workers.filter(w => workerFilter === "all" || w.status === workerFilter);
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <h2 style={{fontFamily:"var(--font-display)",fontSize:"1.4rem",fontWeight:800}}>Workers ({list.length})</h2>
          <div style={{display:"flex",gap:8}}>
            {[["all","All"],["active","🟢 Active"],["inactive","🔴 Inactive"]].map(([v,l]) => (
              <button key={v} onClick={() => setWorkerFilter(v)}
                style={{padding:"7px 14px",borderRadius:50,border:`2px solid ${workerFilter===v?"var(--blue)":"var(--gray-200)"}`,background:workerFilter===v?"var(--blue)":"#fff",color:workerFilter===v?"#fff":"var(--gray-500)",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:".8rem",cursor:"pointer",transition:"all .18s"}}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{overflowX:"auto"}}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Worker</th>
                <th>Category</th>
                <th>Skills</th>
                <th>Tasks</th>
                <th>Done</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(w => (
                <tr key={w.id}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div className="worker-avatar">{w.avatar}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:".88rem"}}>{w.name}</div>
                        <div style={{fontSize:".74rem",color:"var(--gray-400)"}}>{w.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{fontSize:".83rem"}}>{w.category}</span></td>
                  <td>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {w.skills.slice(0,2).map((s,i) => <span key={i} className="badge badge-blue">{s}</span>)}
                      {w.skills.length > 2 && <span className="badge badge-gray">+{w.skills.length-2}</span>}
                    </div>
                  </td>
                  <td><strong>{w.tasks}</strong></td>
                  <td><span style={{color:"var(--green)",fontWeight:600}}>{w.completedServices}</span></td>
                  <td>
                    <span style={{display:"inline-flex",alignItems:"center",gap:4,fontWeight:700,color:"#f59e0b"}}>
                      ⭐ {w.rating > 0 ? w.rating.toFixed(1) : "—"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${w.status==="active"?"badge-green":"badge-red"}`}>
                      {w.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                    </span>
                  </td>
                  <td style={{fontSize:".8rem",color:"var(--gray-500)"}}>{w.joined}</td>
                  // FIXED PART ONLY (important section)

<td>
  <div style={{ display: "flex", gap: 6 }}>
    <button
      className="btn btn-sm btn-ghost"
      onClick={() => toggleStatus(w.id)}
    >
      {w.status === "active" ? "Deactivate" : "Activate"}
    </button>

    <button
      className="btn btn-sm btn-danger"
      onClick={() => removeWorker(w.id)}
    >
      Remove
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <div className="empty-state"><div className="empty-icon">👷</div><p className="empty-title">No workers found</p></div>}
        </div>
      </div>
    );
  }

  function renderBookings() {
    const list = bookings.filter(b => bookingFilter === "all" || b.status === bookingFilter);
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <h2 style={{fontFamily:"var(--font-display)",fontSize:"1.4rem",fontWeight:800}}>All Bookings ({list.length})</h2>
          <div style={{display:"flex",gap:8}}>
            {[["all","All"],["confirmed","✅ Confirmed"],["cancelled","❌ Cancelled"]].map(([v,l]) => (
              <button key={v} onClick={() => setBookingFilter(v)}
                style={{padding:"7px 14px",borderRadius:50,border:`2px solid ${bookingFilter===v?"var(--blue)":"var(--gray-200)"}`,background:bookingFilter===v?"var(--blue)":"#fff",color:bookingFilter===v?"#fff":"var(--gray-500)",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:".8rem",cursor:"pointer",transition:"all .18s"}}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table className="data-table">
            <thead>
              <tr><th>Service</th><th>Category</th><th>Date</th><th>Time</th><th>Price</th><th>GST</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {list.map(b => {
                const gst = Math.round((b.price||0)*0.18);
                return (
                  <tr key={b.id}>
                    <td><strong style={{fontSize:".88rem"}}>{b.serviceName}</strong></td>
                    <td style={{fontSize:".82rem"}}>{b.category}</td>
                    <td style={{fontSize:".83rem"}}>{b.date}</td>
                    <td style={{fontSize:".83rem"}}>{b.time}</td>
                    <td>₹{b.price}</td>
                    <td style={{color:"var(--gray-400)"}}>₹{gst}</td>
                    <td><strong>₹{b.total||b.price+gst}</strong></td>
                    <td><span className={`badge ${b.status==="confirmed"?"badge-green":"badge-red"}`}>{b.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {list.length === 0 && <div className="empty-state"><div className="empty-icon">📋</div><p className="empty-title">No bookings yet</p></div>}
        </div>
      </div>
    );
  }

  function renderAddWorker() {
    const cats = ["Cleaning Services","Repair Services","Plumbing & Electrical","Installation Services","Maintenance Services","Beauty & Salon","Men's Grooming","Relaxation & Wellness"];
    return (
      <div style={{maxWidth:560}}>
        <h2 style={{fontFamily:"var(--font-display)",fontSize:"1.4rem",fontWeight:800,marginBottom:20}}>Add New Worker</h2>
        <div className="card card-pad">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" placeholder="Ravi Kumar" value={form.name} onChange={e=>setF("name",e.target.value)} />
              {formErr.name && <p className="form-error">⚠ {formErr.name}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input className="form-input" placeholder="9876543210" maxLength={10} value={form.phone} onChange={e=>setF("phone",e.target.value)} />
              {formErr.phone && <p className="form-error">⚠ {formErr.phone}</p>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input type="email" className="form-input" placeholder="worker@servicio.in" value={form.email} onChange={e=>setF("email",e.target.value)} />
            {formErr.email && <p className="form-error">⚠ {formErr.email}</p>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={e=>setF("category",e.target.value)}>
                {cats.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e=>setF("status",e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Skills (comma-separated) *</label>
            <input className="form-input" placeholder="Deep Cleaning, Sofa Cleaning, Carpet Steam" value={form.skills} onChange={e=>setF("skills",e.target.value)} />
            {formErr.skills && <p className="form-error">⚠ {formErr.skills}</p>}
          </div>
          <button className="btn btn-primary btn-full btn-lg" onClick={addWorker} style={{marginTop:8}}>
            ➕ Add Worker
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-brand">🛡️ Admin<span>Panel</span></div>
        {NAV.map(n => (
          <div key={n.id} className={`admin-nav-item ${section===n.id?"active":""}`} onClick={() => setSection(n.id)}>
            <span>{n.icon}</span> {n.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="admin-content">
        {section === "dashboard" && renderDashboard()}
        {section === "workers"   && renderWorkers()}
        {section === "bookings"  && renderBookings()}
        {section === "addworker" && renderAddWorker()}
      </div>
    </div>
  );
}

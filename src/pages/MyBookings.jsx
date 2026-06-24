// src/pages/MyBookings.jsx
import { useState } from "react";
import { TIME_SLOTS } from "../data/services.js";

export default function MyBookings({ bookings, onCancel, setPage }) {
  const [filter, setFilter] = useState("all");

  const list = bookings.filter(b => filter === "all" || b.status === filter);
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const cancelled = bookings.filter(b => b.status === "cancelled").length;

  return (
    <div className="page-wrap">
      <button className="back-btn" onClick={() => setPage("home")}>← Back to Home</button>
      <h1 className="page-title">My Bookings</h1>
      <p className="page-sub">{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</p>

      {/* Filter tabs */}
      {bookings.length > 0 && (
        <div style={{display:"flex",gap:8,marginBottom:24}}>
          {[["all","All",bookings.length],["confirmed","✅ Confirmed",confirmed],["cancelled","❌ Cancelled",cancelled]].map(([v,l,c]) => (
            <button key={v} onClick={() => setFilter(v)}
              style={{padding:"8px 16px",borderRadius:50,border:`2px solid ${filter===v?"var(--blue)":"var(--gray-200)"}`,background:filter===v?"var(--blue)":"#fff",color:filter===v?"#fff":"var(--gray-500)",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:".83rem",cursor:"pointer",transition:"all .18s"}}>
              {l} ({c})
            </button>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗓️</div>
          <p className="empty-title">No bookings yet</p>
          <p className="empty-body">Head to home and book a service</p>
          <button className="btn btn-primary" onClick={() => setPage("home")}>Browse Services</button>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {list.map(b => {
            const timeLabel = TIME_SLOTS.find(s => s.id === b.time)?.label || b.time;
            return (
              <div key={b.id} className="card fade-up"
                style={{padding:"20px 24px",display:"flex",alignItems:"center",gap:16,opacity:b.status==="cancelled"?.65:1}}>
                <div style={{width:48,height:48,borderRadius:12,background:b.catColor||"var(--blue-light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",flexShrink:0}}>
                  {b.catIcon}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:"1rem",marginBottom:4}}>{b.serviceName}</div>
                  <div style={{display:"flex",gap:14,fontSize:".82rem",color:"var(--gray-500)",flexWrap:"wrap"}}>
                    <span>📅 {b.date}</span>
                    <span>🕐 {timeLabel}</span>
                    <span>💰 ₹{b.total || b.price}</span>
                    <span>🏷 {b.subcategory}</span>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                  <span className={`badge ${b.status==="confirmed"?"badge-green":"badge-red"}`}>
                    {b.status === "confirmed" ? "✅ Confirmed" : "❌ Cancelled"}
                  </span>
                  {b.status === "confirmed" && (
                    <button className="btn btn-sm" style={{background:"var(--red-light)",color:"var(--red)",border:"none",fontWeight:600}} onClick={() => onCancel(b.id)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

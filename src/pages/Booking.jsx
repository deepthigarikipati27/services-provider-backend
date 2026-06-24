// src/pages/Booking.jsx – date + time slot picker before payment
import { useState } from "react";
import { TIME_SLOTS } from "../data/services.js";

export default function Booking({ service, bookings, onConfirm, setPage }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [err, setErr] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Count confirmed bookings for this service+date+time
  function slotCount(tid) {
    return bookings.filter(b => b.serviceName === service.serviceName && b.date === date && b.time === tid && b.status === "confirmed").length;
  }

  function slotStatus(tid) {
    const c = slotCount(tid);
    if (c >= 4) return { label: "Booked ❌", css: "slot-booked", disabled: true };
    if (c >= 2) return { label: "Filling Fast 🔥", css: "slot-filling", disabled: false };
    return { label: "Available ✓", css: "slot-available", disabled: false };
  }

  function isDupe() {
    return bookings.some(b => b.serviceName === service.serviceName && b.date === date && b.time === time && b.status === "confirmed");
  }

  function proceed() {
    setErr("");
    if (!date) return setErr("Please select a date.");
    if (!time) return setErr("Please select a time slot.");
    if (isDupe()) return setErr("You already have this slot booked!");
    onConfirm({ ...service, date, time });
  }

  if (!service) return (
    <div className="page-wrap">
      <p>No service selected. <button className="bc-link" onClick={() => setPage("home")}>← Home</button></p>
    </div>
  );

  const selSlot = TIME_SLOTS.find(s => s.id === time);
  const aiMsg = selSlot ? (selSlot.period === "morning" ? "☀️ Morning slots are less crowded – great choice!" : selSlot.period === "afternoon" ? "🌤️ Afternoon – moderate demand." : "🔥 Evening slots are in high demand. Book fast!") : null;

  return (
    <div className="page-wrap">
      <button className="back-btn" onClick={() => setPage("home")}>← Back to Services</button>
      <h1 className="page-title">Book Your Service</h1>
      <p className="page-sub">Choose date & time to confirm your slot</p>

      <div className="booking-layout">
        {/* ── Left form ── */}
        <div className="card card-pad fade-up">
          {/* Service preview */}
          <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:service.catColor||"var(--blue-light)",borderRadius:10,marginBottom:24}}>
            <span style={{fontSize:"2rem"}}>{service.catIcon}</span>
            <div>
              <div style={{fontWeight:700,fontSize:"1rem",color:"var(--gray-900)"}}>{service.serviceName}</div>
              <div style={{fontSize:".83rem",color:"var(--gray-500)"}}>{service.subcategory} · {service.category}</div>
            </div>
            <div style={{marginLeft:"auto",fontFamily:"var(--font-display)",fontSize:"1.3rem",fontWeight:800,color:service.catAccent||"var(--blue)"}}>₹{service.price}</div>
          </div>

          {/* Date picker */}
          <div className="form-group">
            <label className="form-label">📅 Select Date</label>
            <input type="date" className="form-input" min={today} value={date}
              onChange={e => { setDate(e.target.value); setTime(""); setErr(""); }} />
          </div>

          {/* Time slots */}
          {date && (
            <div>
              <label className="form-label" style={{marginBottom:10}}>🕐 Select Time Slot</label>
              <div className="time-grid">
                {TIME_SLOTS.map(slot => {
                  const st = slotStatus(slot.id);
                  const sel = time === slot.id;
                  return (
                    <button key={slot.id}
                      className={`time-slot ${sel ? "selected" : ""}`}
                      disabled={st.disabled}
                      onClick={() => { setTime(slot.id); setErr(""); }}
                    >
                      <span className="slot-label">{slot.label}</span>
                      <span className={`slot-status ${sel ? "" : st.css}`}>
                        {sel ? "Selected ✓" : st.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* AI suggestion */}
              {aiMsg && (
                <div style={{background:"#eff6ff",border:"1.5px solid #bfdbfe",borderRadius:10,padding:"12px 16px",fontSize:".87rem",color:"#1e40af",marginBottom:18}}>
                  <strong>AI Tip:</strong> {aiMsg}
                </div>
              )}
            </div>
          )}

          {err && <p className="form-error" style={{marginBottom:12}}>⚠ {err}</p>}

          <button className="btn btn-primary btn-full btn-lg" onClick={proceed} disabled={!date || !time}>
            Proceed to Payment →
          </button>
        </div>

        {/* ── Right summary ── */}
        <div className="summary-sticky fade-up" style={{animationDelay:".1s"}}>
          <div className="card card-pad">
            <h3 style={{fontFamily:"var(--font-display)",fontWeight:700,marginBottom:18}}>Booking Summary</h3>
            <div className="summary-row"><span className="summary-label">Service</span><span className="summary-value">{service.serviceName}</span></div>
            <div className="summary-row"><span className="summary-label">Category</span><span className="summary-value">{service.category}</span></div>
            <div className="summary-row"><span className="summary-label">Date</span><span className="summary-value">{date || "—"}</span></div>
            <div className="summary-row"><span className="summary-label">Time</span><span className="summary-value">{time ? TIME_SLOTS.find(s=>s.id===time)?.label : "—"}</span></div>
            <hr className="divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span style={{color:"var(--blue)"}}>₹{service.price}</span>
            </div>
            <div style={{marginTop:14,padding:"10px 14px",background:"var(--green-light)",borderRadius:8,fontSize:".8rem",color:"var(--green)"}}>
              ✅ Free cancellation up to 2 hours before appointment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

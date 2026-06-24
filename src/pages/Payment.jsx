// src/pages/Payment.jsx – payment summary + Pay Now
import { useState } from "react";
import { TIME_SLOTS } from "../data/services.js";

const METHODS = [
  { id: "upi", label: "UPI / GPay / PhonePe", icon: "📱" },
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
  { id: "cod", label: "Cash on Delivery", icon: "💵" },
];

export default function Payment({ booking, onSuccess, setPage }) {
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [err, setErr] = useState("");

  if (!booking) return (
    <div className="page-wrap">
      <p>No booking found. <button className="bc-link" onClick={() => setPage("home")}>← Home</button></p>
    </div>
  );

  const timeLabel = TIME_SLOTS.find(s => s.id === booking.time)?.label || booking.time;
  const gst = Math.round(booking.price * 0.18);
  const total = booking.price + gst;

  function pay() {
    setErr("");
    if (method === "upi" && !upiId.includes("@")) return setErr("Enter a valid UPI ID (e.g. name@upi)");
    if (method === "card" && cardNum.replace(/\s/g,"").length < 16) return setErr("Enter a valid 16-digit card number");
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); onSuccess({ ...booking, total }); }, 1400);
  }

  if (done) return (
    <div className="page-wrap">
      <div className="card card-pad" style={{maxWidth:480,margin:"0 auto",textAlign:"center"}}>
        <div className="success-wrap">
          <span className="success-icon">✅</span>
          <h2 style={{fontFamily:"var(--font-display)",fontSize:"1.9rem",marginBottom:8}}>Payment Successful!</h2>
          <p style={{color:"var(--gray-500)",marginBottom:6}}>Booking confirmed for</p>
          <p style={{fontWeight:700,fontSize:"1.1rem",color:"var(--gray-900)",marginBottom:4}}>{booking.serviceName}</p>
          <p style={{color:"var(--gray-500)",marginBottom:20}}>📅 {booking.date} at 🕐 {timeLabel}</p>
          <div style={{background:"var(--green-light)",borderRadius:10,padding:"12px 18px",marginBottom:24,fontSize:".88rem",color:"var(--green)",fontWeight:600}}>
            Amount Paid: ₹{total}
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn btn-primary" onClick={() => setPage("mybookings")}>View My Bookings</button>
            <button className="btn btn-ghost" onClick={() => setPage("home")}>Book Another</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrap">
      <button className="back-btn" onClick={() => setPage("booking")}>← Back to Booking</button>
      <h1 className="page-title">Complete Payment</h1>
      <p className="page-sub">Review and pay to confirm your booking</p>

      <div className="booking-layout">
        {/* ── Payment form ── */}
        <div className="fade-up">
          {/* Method selector */}
          <div className="card card-pad" style={{marginBottom:16}}>
            <h3 className="section-title">Choose Payment Method</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {METHODS.map(m => (
                <label key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",border:`2px solid ${method===m.id?"var(--blue)":"var(--gray-200)"}`,borderRadius:10,cursor:"pointer",background:method===m.id?"var(--blue-light)":"#fff",transition:"all .2s"}}>
                  <input type="radio" name="method" value={m.id} checked={method===m.id} onChange={()=>{setMethod(m.id);setErr("");}} style={{accentColor:"var(--blue)"}} />
                  <span style={{fontSize:"1.2rem"}}>{m.icon}</span>
                  <span style={{fontWeight:600,fontSize:".9rem",color:"var(--gray-800)"}}>{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Method details */}
          {method === "upi" && (
            <div className="card card-pad" style={{marginBottom:16}}>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="form-label">UPI ID</label>
                <input className="form-input" placeholder="yourname@upi" value={upiId} onChange={e=>setUpiId(e.target.value)} />
              </div>
            </div>
          )}
          {method === "card" && (
            <div className="card card-pad" style={{marginBottom:16}}>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19}
                  value={cardNum}
                  onChange={e=>setCardNum(e.target.value.replace(/[^\d]/g,"").replace(/(.{4})/g,"$1 ").trim())} />
              </div>
              <div className="form-row">
                <div className="form-group" style={{marginBottom:0}}>
                  <label className="form-label">Expiry</label>
                  <input className="form-input" placeholder="MM/YY" maxLength={5} />
                </div>
                <div className="form-group" style={{marginBottom:0}}>
                  <label className="form-label">CVV</label>
                  <input className="form-input" placeholder="•••" maxLength={3} type="password" />
                </div>
              </div>
            </div>
          )}
          {method === "netbanking" && (
            <div className="card card-pad" style={{marginBottom:16}}>
              <label className="form-label">Select Bank</label>
              <select className="form-input">
                <option>State Bank of India</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {err && <p className="form-error" style={{marginBottom:12}}>⚠ {err}</p>}

          <button className="btn btn-green btn-full btn-lg" onClick={pay} disabled={processing}>
            {processing ? "⏳ Processing Payment…" : `Pay ₹${total} Now →`}
          </button>
          <p style={{textAlign:"center",marginTop:10,fontSize:".78rem",color:"var(--gray-400)"}}>🔒 256-bit SSL encrypted · Secure payment</p>
        </div>

        {/* ── Order summary ── */}
        <div className="summary-sticky fade-up" style={{animationDelay:".1s"}}>
          <div className="card card-pad">
            <h3 style={{fontFamily:"var(--font-display)",fontWeight:700,marginBottom:18}}>Order Summary</h3>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px",background:booking.catColor||"var(--blue-light)",borderRadius:10,marginBottom:16}}>
              <span style={{fontSize:"1.6rem"}}>{booking.catIcon}</span>
              <div>
                <div style={{fontWeight:700,fontSize:".92rem"}}>{booking.serviceName}</div>
                <div style={{fontSize:".78rem",color:"var(--gray-500)"}}>{booking.subcategory}</div>
              </div>
            </div>
            <div className="summary-row"><span className="summary-label">Date</span><span className="summary-value">{booking.date}</span></div>
            <div className="summary-row"><span className="summary-label">Time</span><span className="summary-value">{timeLabel}</span></div>
            <hr className="divider" />
            <div className="summary-row"><span className="summary-label">Service Price</span><span className="summary-value">₹{booking.price}</span></div>
            <div className="summary-row"><span className="summary-label">GST (18%)</span><span className="summary-value">₹{gst}</span></div>
            <hr className="divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span style={{color:"var(--green)",fontSize:"1.2rem"}}>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

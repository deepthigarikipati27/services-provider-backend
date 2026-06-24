// src/App.jsx – root component: global state + page routing
import { useState } from "react";
import Navbar     from "./components/Navbar.jsx";
import Toast      from "./components/Toast.jsx";
import Home       from "./pages/Home.jsx";
import Auth       from "./pages/Auth.jsx";
import Booking    from "./pages/Booking.jsx";
import Payment    from "./pages/Payment.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Admin      from "./pages/Admin.jsx";

export default function App() {
  // ── Navigation ─────────────────────────────────────────────────────────────
  const [page, setPage] = useState("home");   // home | auth | booking | payment | mybookings | admin

  // ── Auth ───────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);

  // ── Booking flow ───────────────────────────────────────────────────────────
  const [selService, setSelService]   = useState(null);  // service chosen from home
  const [pendingBook, setPendingBook] = useState(null);  // after date+time picked, before payment
  const [bookings, setBookings]       = useState([]);    // all confirmed/cancelled bookings

  // ── Toasts ─────────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);
  function addToast(msg, type = "info") {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
  }
  function removeToast(id) { setToasts(prev => prev.filter(t => t.id !== id)); }

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleAuth(userData) {
    setUser(userData);
    // Auto-route admin to admin page
    setPage(userData.role === "admin" ? "admin" : "home");
  }

  function handleLogout() {
    setUser(null);
    setSelService(null);
    setPendingBook(null);
    setPage("home");
    addToast("Logged out successfully.", "info");
  }

  // Called from Home when user clicks "Book Now"
  function handleSelectService(svc) {
    setSelService(svc);
    setPage("booking");
  }

  // Called from Booking page after date+time chosen
  function handleBookingConfirm(bookingData) {
    setPendingBook(bookingData);
    setPage("payment");
  }

  // Called from Payment after Pay Now succeeds
  function handlePaymentSuccess(paidBooking) {
    const newB = { ...paidBooking, id: Date.now(), status: "confirmed" };
    setBookings(prev => [newB, ...prev]);
    setPendingBook(null);
    addToast("Booking confirmed! 🎉", "success");
  }

  // Cancel a booking
  function handleCancel(id) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    addToast("Booking cancelled.", "info");
  }

  // Smart setPage – guard protected routes
  function navigate(p) {
    if ((p === "mybookings" || p === "booking" || p === "payment") && !user) {
      setPage("auth");
      return;
    }
    if (p === "admin" && (!user || user.role !== "admin")) return;
    setPage(p);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  function renderPage() {
    switch (page) {
      case "auth":
        return <Auth onAuth={handleAuth} addToast={addToast} />;

      case "home":
        return <Home onBook={handleSelectService} user={user} setPage={navigate} />;

      case "booking":
        return <Booking service={selService} bookings={bookings} onConfirm={handleBookingConfirm} setPage={navigate} />;

      case "payment":
        return <Payment booking={pendingBook} onSuccess={handlePaymentSuccess} setPage={navigate} />;

      case "mybookings":
        return <MyBookings bookings={bookings} onCancel={handleCancel} setPage={navigate} />;

      case "admin":
        return <Admin bookings={bookings} addToast={addToast} />;

      default:
        return <Home onBook={handleSelectService} user={user} setPage={navigate} />;
    }
  }

  // Auth page gets no navbar
  if (page === "auth") return (
    <>
      {renderPage()}
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );

  // Admin gets no standard navbar (uses sidebar)
  const showNavbar = page !== "admin";

  return (
    <div className="app-shell">
      {showNavbar && <Navbar page={page} setPage={navigate} user={user} onLogout={handleLogout} />}
      {page === "admin" && (
        <div style={{background:"#1e2235",color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 24px",fontSize:".85rem"}}>
          <span style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:"1rem"}}>🛡️ Admin Panel – Servicío</span>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <span style={{color:"rgba(255,255,255,.6)"}}>Logged in as <strong style={{color:"#60a5fa"}}>{user?.name}</strong></span>
            <button onClick={() => navigate("home")} style={{background:"rgba(255,255,255,.1)",border:"none",color:"#fff",padding:"6px 14px",borderRadius:6,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:".82rem"}}>← Back to App</button>
            <button onClick={handleLogout} style={{background:"rgba(220,38,38,.2)",border:"1px solid rgba(220,38,38,.4)",color:"#fca5a5",padding:"6px 14px",borderRadius:6,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:".82rem"}}>Logout</button>
          </div>
        </div>
      )}
      {renderPage()}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

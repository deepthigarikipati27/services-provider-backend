// src/components/Navbar.jsx
export default function Navbar({ page, setPage, user, onLogout }) {

  // 🔥 Universal Home Navigation (works everywhere)
  const goHome = () => {
    if (typeof setPage === "function") {
      setPage("home");
      window.scrollTo(0, 0); // optional smooth UX
    } else {
      window.location.reload(); // fallback
    }
  };

  return (
    <nav className="navbar">

      {/* 🔥 BRAND CLICK */}
     <div 
  className="nav-brand" 
  onClick={() => window.location.href = "/"}
>
  <span>Servicio</span>
</div>

      <div className="nav-links">
        {user ? (
          <>
            <button
              className={`nav-btn ${page==="home"?"active":""}`}
              onClick={goHome}
            >
              Home
            </button>

            <button
              className={`nav-btn ${page==="mybookings"?"active":""}`}
              onClick={() => setPage("mybookings")}
            >
              My Bookings
            </button>

            {user.role === "admin" && (
              <button
                className={`nav-btn ${page==="admin"?"active":""}`}
                onClick={() => setPage("admin")}
              >
                Admin
              </button>
            )}

            <div className="nav-user">
              <div className="nav-avatar" title={user.name}>
                {user.name?.[0]?.toUpperCase()}
              </div>

              <span>
                Hi, <strong>{user.name.split(" ")[0]}</strong>
              </span>

              <button className="nav-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              className={`nav-btn ${page==="home"?"active":""}`}
              onClick={goHome}
            >
              Home
            </button>

            <button
              className="nav-btn"
              onClick={() => setPage ? setPage("auth") : window.location.reload()}
            >
              Login
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setPage ? setPage("auth") : window.location.reload()}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
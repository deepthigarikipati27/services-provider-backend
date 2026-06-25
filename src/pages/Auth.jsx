// src/pages/Auth.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = "https://services-provider-backend-1.onrender.com/api/auth";

export default function Auth({ onAuth, addToast, setPage, user }) {

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("user"); // 👈 UI role
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    phone: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  }

  // ✅ VALIDATION
  function validate() {
    const e = {};

    if (mode === "register") {
      if (!form.name.trim()) e.name = "Name required";
      else if (form.name.length < 3) e.name = "Min 3 chars";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in|org)$/;
    if (!emailRegex.test(form.email)) {
      e.email = "Enter valid email (.com/.in/.org)";
    }

    if (!form.password) e.password = "Password required";
    else if (form.password.length < 6) e.password = "Min 6 chars";
    else if (!/(?=.*[A-Z])/.test(form.password)) e.password = "1 uppercase needed";
    else if (!/(?=.*\d)/.test(form.password)) e.password = "1 number needed";

    if (mode === "register" && form.password !== form.confirm) {
      e.confirm = "Passwords not match";
    }

    if (mode === "register") {
      if (!/^\d{10}$/.test(form.phone)) {
        e.phone = "10 digits only";
      }
    }

    return e;
  }

  async function submit() {
  const e = validate();
  setErrors(e);

  if (Object.keys(e).length) return;

  setLoading(true);

  try {
    // LOGIN
    if (mode === "login") {
      const response = await fetch(
        "https://services-provider-backend-1.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("token", data.token);

      onAuth(data.user);

      if (
        role === "admin" &&
        data.user.role === "admin" &&
        data.user.email === "keerthisreevelamuri@gmail.com"
      ) {
        setPage("admin");
      } else {
        setPage("home");
      }

      addToast("Login Successful 🎉", "success");
    }

    // REGISTER
    else {
      const response = await fetch(
        "https://services-provider-backend-1.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone,
            role: role
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      onAuth(data.user);

      addToast("Signup Successful 🎉", "success");

      setPage("home");
    }
  } catch (error) {
    console.log(error);
    addToast(error.message, "error");
  }

  setLoading(false);
}

  return (
    <>
      <Navbar page="auth" setPage={setPage} user={user} onLogout={() => {}} />

      <div className="auth-page">
        <div className="auth-card scale-in">

          <div className="auth-logo">Servicio</div>

          <button
            onClick={() => setPage("home")}
            style={{ marginBottom:10, background:"none", border:"none", color:"#007bff", cursor:"pointer" }}
          >
            ← Back to Home
          </button>

          <p className="auth-sub">
            {mode === "login" ? "Sign in to your account" : "Create a new account"}
          </p>

          {/* Role (UI SAME) */}
          <div className="role-toggle">
            <button className={`role-btn ${role==="user"?"active":""}`} onClick={()=>setRole("user")}>👤 User</button>
            <button className={`role-btn ${role==="admin"?"active":""}`} onClick={()=>setRole("admin")}>🛡️ Admin</button>
          </div>

          {/* Name */}
          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={(e)=>set("name",e.target.value)} />
              {errors.name && <p className="form-error">⚠ {errors.name}</p>}
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={form.email} onChange={(e)=>set("email",e.target.value.toLowerCase())} />
            {errors.email && <p className="form-error">⚠ {errors.email}</p>}
          </div>

          {/* Phone */}
          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={(e)=>set("phone",e.target.value)} />
              {errors.phone && <p className="form-error">⚠ {errors.phone}</p>}
            </div>
          )}

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={form.password} onChange={(e)=>set("password",e.target.value)} />
            {errors.password && <p className="form-error">⚠ {errors.password}</p>}
          </div>

          {/* Confirm */}
          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" value={form.confirm} onChange={(e)=>set("confirm",e.target.value)} />
              {errors.confirm && <p className="form-error">⚠ {errors.confirm}</p>}
            </div>
          )}

          <button className="btn btn-primary btn-full btn-lg" onClick={submit} disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div className="auth-switch">
            {mode === "login"
              ? <>Don't have an account? <button onClick={()=>setMode("register")}>Register</button></>
              : <>Already have an account? <button onClick={()=>setMode("login")}>Login</button></>}
          </div>

        </div>
      </div>
    </>
  );
}
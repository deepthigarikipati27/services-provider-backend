// src/pages/Auth.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";

// 🔥 Firebase
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

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

  // 🔥 MAIN SUBMIT
  async function submit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);

    try {
      let userCredential;

      // 🔐 LOGIN
      if (mode === "login") {
        userCredential = await signInWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

        const docRef = doc(db, "users", userCredential.user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();

          onAuth({
            id: userCredential.user.uid,
            ...userData
          });

          // 🔐 STRICT ADMIN CHECK
          if (
            role === "admin" &&
            userData.role === "admin" &&
            form.email === "keerthisreevelamuri@gmail.com"
          ) {
            setPage("admin");   // 🛡️ ONLY real admin
          } else {
            setPage("home");    // 👤 everyone else
          }

        } else {
          addToast("User data not found ❌", "error");
        }
      }

      // 🆕 SIGNUP
      else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: role, // 👈 still allow (UI unchanged)
        });

        onAuth({
          id: userCredential.user.uid,
          name: form.name,
          email: form.email,
          role: role,
        });

        addToast("Signup Successful 🎉", "success");

        setPage("home");
      }

    } catch (error) {
      console.log(error.message);
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
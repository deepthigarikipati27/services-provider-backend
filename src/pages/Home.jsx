// src/pages/Home.jsx – 3-level navigation: Category → Subcategory → Services
import { useState, useMemo } from "react";
import SERVICES, { getPrice } from "../data/services.js";

export default function Home({ onBook, user, setPage }) {
  const [view, setView] = useState("cats"); // cats | subs | svcs
  const [selCat, setSelCat] = useState(null);
  const [selSub, setSelSub] = useState(null);
  const [q, setQ] = useState("");

  // Flat list for global search
  const flat = useMemo(() => {
    const r = [];
    SERVICES.forEach(cat => cat.subcategories.forEach(sub => sub.services.forEach(svc => r.push({ svc, cat, sub }))));
    return r;
  }, []);

  const searching = q.trim().length > 0;
  const ql = q.toLowerCase();

  const globalHits = useMemo(() => searching
    ? flat.filter(({svc,cat,sub}) => svc.toLowerCase().includes(ql) || cat.category.toLowerCase().includes(ql) || sub.title.toLowerCase().includes(ql))
    : [], [q, flat]);

  function openCat(cat) { setSelCat(cat); setSelSub(null); setView("subs"); setQ(""); }
  function openSub(sub) { setSelSub(sub); setView("svcs"); setQ(""); }
  function back() {
    if (view === "svcs") { setView("subs"); setSelSub(null); }
    else { setView("cats"); setSelCat(null); }
    setQ("");
  }
  function goHome() { setView("cats"); setSelCat(null); setSelSub(null); setQ(""); }

  function handleBook(svc, cat, sub) {
    if (!user) { setPage("auth"); return; }
    onBook({ serviceName: svc, category: cat.category, subcategory: sub.title, price: getPrice(svc), catIcon: cat.icon, catColor: cat.color, catAccent: cat.accent });
  }

  // ── Hero ──
  const totalSvcs = flat.length;

  // ── Render sections ──
  function renderBreadcrumb() {
    if (view === "cats" && !searching) return null;
    return (
      <div className="breadcrumb fade-up">
        <button className="bc-link" onClick={goHome}>🏠 All Categories</button>
        {selCat && <><span className="bc-sep">›</span>
          {view === "subs"
            ? <span className="bc-current">{selCat.category}</span>
            : <button className="bc-link" onClick={() => { setView("subs"); setSelSub(null); }}>{selCat.category}</button>}
        </>}
        {selSub && <><span className="bc-sep">›</span><span className="bc-current">{selSub.title}</span></>}
        {searching && <><span className="bc-sep">›</span><span className="bc-current">Search "{q}"</span></>}
      </div>
    );
  }

  function renderSearch() {
    if (globalHits.length === 0) return (
      <div className="empty-state"><div className="empty-icon">🔍</div><p className="empty-title">No results for "{q}"</p><p className="empty-body">Try another keyword</p></div>
    );
    return (
      <div>
        <p style={{marginBottom:14,color:"var(--gray-500)",fontSize:".85rem"}}>{globalHits.length} results</p>
        <div className="grid-auto-lg">
          {globalHits.map(({svc,cat,sub},i) => (
            <ServiceCard key={i} svc={svc} cat={cat} sub={sub} onBook={() => handleBook(svc,cat,sub)} />
          ))}
        </div>
      </div>
    );
  }

  function renderCats() {
    return (
      <div>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:20}}>
          <h2 className="section-title" style={{margin:0}}>All Categories</h2>
          <span className="badge badge-blue">{SERVICES.length} categories</span>
        </div>
        <div className="grid-auto">
          {SERVICES.map((cat,i) => (
            <div key={i} className="cat-card fade-up" style={{background:cat.color,animationDelay:`${i*0.04}s`}}
              onClick={() => openCat(cat)}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=cat.accent;e.currentTarget.style.boxShadow=`0 8px 32px ${cat.accent}30`}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.boxShadow="var(--shadow)"}}
            >
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-name">{cat.category}</div>
              <div className="cat-meta">{cat.subcategories.length} subcategories · {cat.subcategories.reduce((a,s)=>a+s.services.length,0)} services</div>
              <span className="cat-arrow">›</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderSubs() {
    const list = selCat.subcategories.filter(s => !q || s.title.toLowerCase().includes(ql) || s.services.some(sv=>sv.toLowerCase().includes(ql)));
    return (
      <div>
        <button className="back-btn" onClick={back}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <span style={{fontSize:"2rem"}}>{selCat.icon}</span>
          <div>
            <h2 className="section-title" style={{margin:0}}>{selCat.category}</h2>
            <span className="badge badge-blue">{list.length} subcategories</span>
          </div>
        </div>
        {list.length === 0
          ? <div className="empty-state"><div className="empty-icon">🔍</div><p className="empty-title">Nothing matches</p></div>
          : <div className="grid-auto">
              {list.map((sub,i) => (
                <div key={i} className="sub-card fade-up" style={{animationDelay:`${i*0.04}s`}} onClick={() => openSub(sub)}>
                  <div className="sub-icon">{sub.icon}</div>
                  <div className="sub-title">{sub.title}</div>
                  <div className="sub-count">{sub.services.length} services</div>
                </div>
              ))}
            </div>
        }
      </div>
    );
  }

  function renderSvcs() {
    const list = selSub.services.filter(s => !q || s.toLowerCase().includes(ql));
    return (
      <div>
        <button className="back-btn" onClick={back}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <span style={{fontSize:"2rem"}}>{selSub.icon}</span>
          <div>
            <h2 className="section-title" style={{margin:0}}>{selSub.title}</h2>
            <span className="badge badge-blue">{list.length} services</span>
          </div>
        </div>
        {list.length === 0
          ? <div className="empty-state"><div className="empty-icon">🔍</div><p className="empty-title">No services match</p></div>
          : <div className="grid-auto-lg">
              {list.map((svc,i) => (
                <ServiceCard key={i} svc={svc} cat={selCat} sub={selSub} onBook={() => handleBook(svc,selCat,selSub)} />
              ))}
            </div>
        }
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="hero-bar">
        <div className="hero-inner">
          <h1 className="hero-title">Book Any Home Service</h1>
          <p className="hero-sub">{SERVICES.length} categories · {totalSvcs}+ services · Instant booking</p>
          <div className="search-box">
            <span style={{fontSize:"1.1rem",color:"var(--blue)"}}>🔍</span>
            <input className="search-input" placeholder="Search Deep Cleaning, Beard Trim, AC Repair…" value={q} onChange={e=>setQ(e.target.value)} />
            {q && <button className="search-clear" onClick={() => setQ("")}>✕</button>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-wrap">
        {renderBreadcrumb()}
        {searching ? renderSearch() : view === "cats" ? renderCats() : view === "subs" ? renderSubs() : renderSvcs()}
      </div>
    </div>
  );
}

// ── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ svc, cat, sub, onBook }) {
  return (
    <div className="svc-card"
      onMouseEnter={e=>{e.currentTarget.style.borderColor=cat.accent;e.currentTarget.style.background=cat.color}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--gray-200)";e.currentTarget.style.background="#fff"}}
    >
      <div className="svc-thumb" style={{background:cat.color}}>{sub.icon}</div>
      <div className="svc-info">
        <div className="svc-name">{svc}</div>
        <div className="svc-tag">{sub.title}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
        <span className="svc-price">₹{getPrice(svc)}</span>
        <button
          className="btn btn-primary btn-sm"
          onClick={e => { e.stopPropagation(); onBook(); }}
          style={{background:cat.accent,border:"none"}}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

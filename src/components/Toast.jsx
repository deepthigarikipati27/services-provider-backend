// src/components/Toast.jsx
import { useEffect } from "react";
export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} remove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}
function ToastItem({ toast, remove }) {
  useEffect(() => { const id = setTimeout(remove, 3200); return () => clearTimeout(id); }, []);
  return (
    <div className={`toast toast-${toast.type}`} onClick={remove} style={{cursor:"pointer"}}>
      <span>{toast.type==="success"?"✅":toast.type==="error"?"❌":"ℹ️"}</span>
      {toast.msg}
    </div>
  );
}

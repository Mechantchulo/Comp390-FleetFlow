import { Routes, Route } from "react-router-dom"
import RoleSelectionPage from "./pages/RoleSelectionPage";
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"

function DashboardPlaceholder() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-slate-800">
        Dashboard placeholder
      </h1>
    </main>
  );
}

export default function App() {
  return(
    <Routes>
      <Route path="/" element={<RoleSelectionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<DashboardPlaceholder />} />
    </Routes>
  )
}

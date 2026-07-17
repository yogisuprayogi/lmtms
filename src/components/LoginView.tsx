import React, { useEffect, useState } from "react";
import { GraduationCap, AlertCircle, BookOpen, PenTool, Calculator, Globe, Sparkles, Brain, Award, Book } from "lucide-react";

interface LoginViewProps {
  usernameInput: string;
  setUsernameInput: (val: string) => void;
  passwordInput: string;
  setPasswordInput: (val: string) => void;
  loginError: string;
  isLoadingAuth: boolean;
  handleLogin: (e: React.FormEvent) => void;
  quickLogin: (role: "GURU" | "SISWA" | "ADMIN") => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  usernameInput,
  setUsernameInput,
  passwordInput,
  setPasswordInput,
  loginError,
  isLoadingAuth,
  handleLogin,
  quickLogin,
}) => {
  const [identitas, setIdentitas] = useState({
    nama: "SMAN 1 Informatika",
    logo: ""
  });

  useEffect(() => {
    fetch("/api/academic/identitas")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.identitas) {
          setIdentitas(data.identitas);
        }
      })
      .catch((err) => console.error("Error loading identitas in login:", err));
  }, []);

  const floatingIcons = [
    { Icon: BookOpen, left: "4%", size: 28, delay: "-3s", duration: "24s", color: "text-indigo-500/40" },
    { Icon: GraduationCap, left: "12%", size: 36, delay: "-15s", duration: "28s", color: "text-blue-500/45" },
    { Icon: PenTool, left: "22%", size: 22, delay: "-8s", duration: "21s", color: "text-purple-500/40" },
    { Icon: Calculator, left: "32%", size: 26, delay: "-20s", duration: "26s", color: "text-rose-500/35" },
    { Icon: Globe, left: "42%", size: 34, delay: "-5s", duration: "29s", color: "text-sky-500/45" },
    { Icon: Sparkles, left: "52%", size: 20, delay: "-12s", duration: "19s", color: "text-amber-500/40" },
    { Icon: Brain, left: "64%", size: 30, delay: "-25s", duration: "32s", color: "text-violet-500/45" },
    { Icon: Award, left: "74%", size: 32, delay: "-2s", duration: "25s", color: "text-indigo-500/40" },
    { Icon: Book, left: "84%", size: 26, delay: "-18s", duration: "27s", color: "text-blue-500/40" },
    { Icon: GraduationCap, left: "94%", size: 34, delay: "-10s", duration: "30s", color: "text-purple-500/45" },
    { Icon: BookOpen, left: "17%", size: 24, delay: "-14s", duration: "23s", color: "text-indigo-500/35" },
    { Icon: Brain, left: "47%", size: 24, delay: "-7s", duration: "25s", color: "text-sky-500/45" },
    { Icon: Calculator, left: "80%", size: 28, delay: "-22s", duration: "31s", color: "text-rose-500/40" },
    { Icon: Award, left: "90%", size: 24, delay: "-11s", duration: "26s", color: "text-amber-500/45" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans overflow-hidden" id="login-view-container">
      {/* Floating Educational Icons Background */}
      <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        {floatingIcons.map((item, index) => {
          const IconComponent = item.Icon;
          return (
            <div
              key={index}
              className={`absolute bottom-0 floating-edu-icon ${item.color || "text-indigo-500/40"}`}
              style={{
                left: item.left,
                animationDelay: item.delay,
                animationDuration: item.duration,
              }}
            >
              <IconComponent size={item.size} strokeWidth={1.5} />
            </div>
          );
        })}
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex flex-col items-center mb-5">
          {identitas.logo ? (
            <div className="relative group transition-all duration-300 hover:scale-105" id="login-logo-wrapper">
              {/* Soft modern glow effect behind the logo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 rounded-2xl blur-md opacity-20 group-hover:opacity-35 transition duration-300"></div>
              
              {/* Premium white card for the school logo */}
              <div className="relative h-24 w-24 rounded-2xl bg-white border border-slate-150/80 p-3.5 flex items-center justify-center shadow-lg shadow-slate-100">
                <img
                  src={identitas.logo}
                  alt="Logo Sekolah"
                  className="max-h-full max-w-full object-contain rounded-xl select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-xl shadow-indigo-100 transition-transform duration-300 hover:scale-105">
              <GraduationCap className="h-9 w-9 animate-pulse" />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-800 tracking-tight px-4 leading-tight">
          LMTMS
        </h2>
        <p className="mt-2 text-xs text-slate-500 font-medium whitespace-nowrap">
          Learning Management & Teaching Management System
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/95 backdrop-blur-sm py-8 px-4 shadow-xl border border-slate-100 rounded-2xl sm:px-10">


          <form className="space-y-4" onSubmit={handleLogin} id="credential-login-form">
            <div>
              <label className="block text-sm font-medium text-slate-700">Nama Pengguna (Username)</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder=""
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Kata Sandi (Password)</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder=""
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {loginError && (
              <div className="p-2 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2" id="login-error-display">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoadingAuth}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              id="btn-login-submit"
            >
              {isLoadingAuth ? "Menghubungkan..." : "Masuk ke Dashboard"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400 font-medium">
              INFORMATIKA [at] {identitas.nama}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

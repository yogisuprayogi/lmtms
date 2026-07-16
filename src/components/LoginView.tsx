import React from "react";
import { GraduationCap, AlertCircle } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans" id="login-view-container">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-100 mb-4 animate-bounce">
          <GraduationCap className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
          LMTMS
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Learning Management & Teaching Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 rounded-2xl sm:px-10">


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
            <p className="text-xs text-slate-400">
              informatika@smandacis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

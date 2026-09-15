import React, { useState } from 'react';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { CurrentView, UserPersona } from '../../types';
import { AuthTestModal, AuthTestMode } from './AuthTestModal';

interface HomePageProps {
  currentUser: UserPersona;
  onNavigate: (view: CurrentView) => void;
  onOpenCreateInquiry: () => void;
}

export const HomePage: React.FC<HomePageProps> = (_props) => {
  const [authMode, setAuthMode] = useState<AuthTestMode | null>(null);

  return (
    <div id="home-page-container" className="w-full min-h-[calc(100vh-80px)] bg-white">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
        <div className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-indigo-700">
          Khu vực thử nghiệm
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Đăng nhập &amp; đăng ký FlexGO
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Kiểm tra giao diện và các trường thông tin trước khi kết nối vào hệ thống chính.
        </p>
        <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/15"
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/25"
          >
            <UserPlus className="h-4 w-4" />
            Đăng ký
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-6 text-xs text-slate-400">
          Dữ liệu nhập trong form sẽ không được lưu hoặc dùng để thay đổi tài khoản hiện tại.
        </p>
      </section>

      <AuthTestModal
        isOpen={authMode !== null}
        mode={authMode || 'login'}
        onClose={() => setAuthMode(null)}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

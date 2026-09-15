import React from 'react';
import { CurrentView, UserPersona } from '../../types';

interface HomePageProps {
  currentUser: UserPersona;
  onNavigate: (view: CurrentView) => void;
  onOpenCreateInquiry: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  onNavigate,
  onOpenCreateInquiry,
}) => {
  return (
    <div id="home-page-container" className="w-full min-h-[calc(100vh-80px)] bg-white">
      {/* Vùng trang trắng - Bạn có thể ghép mã nguồn giao diện Home đã phát triển vào đây */}
    </div>
  );
};

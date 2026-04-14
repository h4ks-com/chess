import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Header from "../components/shared/Header";
import useLatency from "../utils/hooks/useLatency";

const AppLayout = () => {
  const { isAuthenticated, loginAsGuest } = useAuthStore();

  useLatency();

  if (!isAuthenticated) {
    loginAsGuest();
    return null;
  }

  return (
    <div className="flex h-screen">
      <div className="w-20 h-full">
        <Header />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;

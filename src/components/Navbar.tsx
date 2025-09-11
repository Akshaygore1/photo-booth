import { useAuth } from "../hooks/useAuth";
import { LogOut, Home, CheckSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [{ path: "/dashboard", label: "Dashboard", icon: Home }];

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="w-full max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 group text-white text-2xl font-bold hover:text-primary transition-colors"
            >
              Textie
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-6">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 rounded-full p-2 hover:bg-red-600 cursor-pointer transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4 relative z-10 group-hover:rotate-12 transition duration-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

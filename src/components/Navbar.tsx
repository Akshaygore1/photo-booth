import { useAuth } from "../hooks/useAuth";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="w-full bg-background">
      <div className="w-full max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 group text-white text-2xl font-bold">
            Textie
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-6">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 rounded-full p-2 hover:bg-red-600 cursor-pointer"
            >
              {/* <span className="relative z-10">Logout</span> */}
              <LogOut className="h-4 w-4 relative z-10 group-hover:rotate-12 transition duration-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

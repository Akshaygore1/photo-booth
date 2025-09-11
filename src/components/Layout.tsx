import React, { type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main>{children || <Outlet />}</main>
    </div>
  );
};

export default Layout;

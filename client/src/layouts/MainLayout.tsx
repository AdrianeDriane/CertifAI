import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/SideBar";

const MainLayout = () => {
  const [active, setActive] = useState("documents");

  return (
    <div className="flex h-screen w-screen overflow-hidden relative bg-gray-50">
      {/* Sidebar separated */}
      <Sidebar active={active} setActive={setActive} />

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto relative">
        <Outlet />

        {/* Background accents */}
        <div className="absolute top-10 right-10 h-40 w-40 bg-[#aa6bfe] rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-10 left-20 h-32 w-32 bg-[#d0f600] rounded-full blur-3xl opacity-10"></div>
      </div>
    </div>
  );
};

export default MainLayout;

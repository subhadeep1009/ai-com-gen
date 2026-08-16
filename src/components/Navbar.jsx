import React from "react";
import { LuSun } from "react-icons/lu";
import { FaUserAlt } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
const Navbar = () => {
  return (
    <>
      <div className="nav flex items-center justify-between px-20 h-[90px] border-b-[1px] border-cyan-700 ">
        <div className="logo">
          <h3 className="text-[25px] sp-text">GenUI</h3>
        </div>
        <div className="icons flex items-center gap-[15px]">
          <div className="icon"><LuSun /></div>
          <div className="icon"><FaUserAlt /></div>
          <div className="icon"><SlSettings /></div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { BsGrid1X2Fill, BsCalendarEventFill, BsPeopleFill, BsBroadcast } from 'react-icons/bs';
import { IoLogOut } from "react-icons/io5";
import { MdDesignServices } from "react-icons/md";
import { IoShareSocial } from "react-icons/io5";
import { FaPeopleArrows } from "react-icons/fa";
import { FaRobot } from "react-icons/fa6";
import { IoIosStats, IoIosArrowDown } from "react-icons/io";
import { LogOut, reset } from "../../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import logoPlastic from "../../images/plasticque_logo.png";

function SideBar({ openSidebarToggle, OpenSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isBotSubMenuOpen, setBotSubMenuOpen] = useState(false);

  const toggleBotSubMenu = () => {
    setBotSubMenuOpen(!isBotSubMenuOpen);
  };

  const closeBotSubMenu = () => {
    setBotSubMenuOpen(false);
  };

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='fix'>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <img src={logoPlastic} alt="Plasticque Logo" className='image is-64x64'/>
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>
      <ul className="sidebar-list">
        <NavLink to="/dashboard">
          <li className="sidebar-list-item">
            <BsGrid1X2Fill className="icon-sidebar" /> Dashboard
          </li>
        </NavLink>
        <NavLink to="/events">
          <li className="sidebar-list-item">
            <BsCalendarEventFill className="icon-sidebar" /> Events
          </li>
        </NavLink>
        <NavLink to="/crewdesigner">
          <li className="sidebar-list-item">
            <MdDesignServices className="icon-sidebar" /> Crew Designer
          </li>
        </NavLink>
        <NavLink to="/adsos">
          <li className="sidebar-list-item">
            <IoShareSocial className="icon-sidebar" /> Social Media
          </li>
        </NavLink>
        <li className={`sidebar-list-item ${isBotSubMenuOpen ? 'has-submenu-open' : 'has-submenu'}`} onClick={toggleBotSubMenu}>
          <div className="menu-item">
            <span>
              <FaRobot className="icon-sidebar" />
            </span>
            <span className={`arrow-icon ${isBotSubMenuOpen ? 'open' : ''}`}>
              <IoIosArrowDown />
            </span>
            <span className="menu-text">Bot</span>
          </div>
          <ul className={`submenu ${isBotSubMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <NavLink to="/bot/stats" onClick={closeBotSubMenu}>
              <li className="sidebar-list-item">
                <IoIosStats className="icon-sidebar" /> Stats
              </li>
            </NavLink>
            <NavLink to="/bot/broadcast" onClick={closeBotSubMenu}>
              <li className="sidebar-list-item">
                <BsBroadcast className="icon-sidebar" /> Broadcast
              </li>
            </NavLink>
            <NavLink to="/bot/admin" onClick={closeBotSubMenu}>
              <li className="sidebar-list-item">
                <BsBroadcast className="icon-sidebar" /> Admin
              </li>
            </NavLink>
          </ul>
        </li>
        {user && user.role === "admin" && (
        <NavLink to="/users">
          <li className="sidebar-list-item">
            <BsPeopleFill className="icon-sidebar" /> User
          </li>
        </NavLink>
        )}
        {user && user.role === "admin" && (
          <NavLink to="/client">
            <li className="sidebar-list-item">
              <FaPeopleArrows className="icon-sidebar" /> Client
            </li>
          </NavLink>
        )}
        <NavLink to="/" onClick={logout} className="logout-link">
          <li className="sidebar-list-item">
            <IoLogOut className="icon-logout" /> Logout
          </li>
        </NavLink>
      </ul>
      </div>
    </aside>
  );
}

export default SideBar;

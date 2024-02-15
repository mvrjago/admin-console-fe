import React, { useState } from "react";
import '../../styles/Fully.css'
import Header from "../../components/Navbar/Header";
import SideBars from "../../components/Navbar/SideBar";

const Layout = ({ children }) => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
          <SideBars openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
        <div className="column has-background-white-ter is-full margin">
          <main>{children}</main>
        </div>
    </div>
  );
};

export default Layout;

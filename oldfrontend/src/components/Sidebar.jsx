import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBriefcase,
  FaUser,
  FaFileAlt,
  FaCog,
  FaChartBar
} from "react-icons/fa";

import "./../styles/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <h2 className="sidebar-logo">
        🚀 AI Portal
      </h2>

      <ul>

       <li>
  <NavLink to="/">
    <FaHome />
    <span>Home</span>
  </NavLink>
</li>

        <li>
          <FaChartBar />
          <span>Dashboard</span>
        </li>

        <li>
  <NavLink to="/jobs">
    <FaBriefcase />
    <span>Jobs</span>
  </NavLink>
</li>

       <li>
  <NavLink to="/resume">
    <FaFileAlt />
    <span>Resume</span>
  </NavLink>
</li>

        <li>
  <NavLink to="/profile">
    <FaUser />
    <span>Profile</span>
  </NavLink>
</li>

       <li>
  <NavLink to="/settings">
    <FaCog />
    <span>Settings</span>
  </NavLink>
</li>

      </ul>

    </div>
  );
}

export default Sidebar;
import {
  FaBell,
  FaMoon,
  FaSearch,
  FaUserCircle
} from "react-icons/fa";

import "../styles/Navbar.css";

function Navbar() {
  return (
    <div className="navbar">

      <div className="navbar-left">

        <h2>Dashboard</h2>

      </div>

      <div className="navbar-right">

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search jobs..."
          />

        </div>

        <button className="icon-btn">
          <FaBell />
        </button>

        <button className="icon-btn">
          <FaMoon />
        </button>

        <div className="profile">

          <FaUserCircle className="profile-icon"/>

          <span>Vishnu</span>

        </div>

      </div>

    </div>
  );
}

export default Navbar;
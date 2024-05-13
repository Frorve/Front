import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";

const NavbarContact = () => {
  return (
    <div id="nav" className="navbar bg-base-100">
      <div className="flex-1">
        <Link to={`/login`} className="btn btn-ghost">
          <img className="logo-nav" src={logo} alt="" />
        </Link>
      </div>
    </div>
  );
};

export default NavbarContact;

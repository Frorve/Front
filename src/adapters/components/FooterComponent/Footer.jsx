import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-page">
      <div className="foot">
        <Link to={"/about"}>
          <p>Copyright © 2024 - All right reserved by Fran Ortega Velasco</p>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

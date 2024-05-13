import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";

const Navbar = ({
  username,
  handleCancel,
  handleSearchChangeVar,
  handleClienteFormToggle,
}) => {
  return (
    <div id="nav" className="navbar bg-base-100">
      <div className="flex-1">
        <Link
          to={`/main/${username}`}
          className="btn btn-ghost"
          onClick={handleCancel}
        >
          <img className="logo-nav" src={logo} alt="" />
        </Link>
      </div>
      <div className="flex-none gap-2 flex items-center">
        <button className="btn" onClick={handleClienteFormToggle}>
          Gestionar clientes
        </button>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="input sm:w-28 md:w-45 lg:w-60 xl:w-80"
            placeholder="Buscar"
            onChange={handleSearchChangeVar}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <button className="btn btn-ghost">
          <div className="flex items-center">
            {username}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src="https://cdn-icons-png.freepik.com/512/64/64572.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </button>
        <div className="navbar-end">
          <Link to="/login" className="btn btn-error">
            Cerrar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

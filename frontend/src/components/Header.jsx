import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `relative px-3 py-2 text-sm font-medium tracking-wide transition-all duration-200
     ${
       location.pathname === path
         ? "text-amber-600 font-semibold after:w-full"
         : "text-gray-700 hover:text-amber-600"
     }
     after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 
     after:h-[2px] after:bg-amber-500 after:transition-all after:duration-300
     hover:after:w-full`;

  const mobileNavLinkClass = (path) =>
    `block px-4 py-3 rounded-md text-base font-medium transition-all duration-200
     ${
       location.pathname === path
         ? "bg-amber-100 text-amber-700"
         : "text-gray-700 hover:bg-amber-50 hover:text-amber-600"
     }`;

  const renderNavLinks = (mobile = false) => {
    const linkClass = mobile ? mobileNavLinkClass : navLinkClass;

    return (
      <>
        <Link to="/" className={linkClass("/")}>Home</Link>

        {!user && (
          <>
            <Link to="/login" className={linkClass("/login")}>Login</Link>
            <Link to="/signup" className={linkClass("/signup")}>Signup</Link>
          </>
        )}

        {user && user.role === "customer" && (
          <>
            <Link to="/menu" className={linkClass("/menu")}>Menu</Link>
            <Link to="/cart" className={linkClass("/cart")}>Cart</Link>
            <Link to="/orders" className={linkClass("/orders")}>My Orders</Link>
            <Link to="/profile" className={linkClass("/profile")}>Profile</Link>
          </>
        )}

        {user && user.role === "admin" && (
          <>
            <Link to="/admin/dashboard" className={linkClass("/admin/dashboard")}>
              Dashboard
            </Link>
            <Link to="/admin/menu" className={linkClass("/admin/menu")}>
              Menu Items
            </Link>
            <Link to="/admin/orders" className={linkClass("/admin/orders")}>
              Manage Orders
            </Link>
            <Link to="/admin/stats" className={linkClass("/admin/stats")}>
              Stats
            </Link>
          </>
        )}
      </>
    );
  };

  return (
    <header className="backdrop-blur-xl bg-white/80 shadow-sm sticky top-0 z-50 border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold text-amber-600 hover:text-amber-700 transition-transform duration-300 hover:scale-105"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
            alt="Zaika Logo"
            className="w-8 h-8 drop-shadow-md hover:rotate-6 transition-transform duration-300"
          />
          <span>
            Zaika<span className="text-gray-800">Restro</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {renderNavLinks(false)}

          {user && (
            <button
              onClick={handleLogout}
              className="ml-4 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium
                         hover:bg-amber-700 transition-transform duration-300 hover:scale-105"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Mobile Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-amber-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition-transform duration-200 hover:rotate-90"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white/95 shadow-lg border-t border-amber-100 animate-slideDown">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {renderNavLinks(true)}

            {user && (
              <button
                onClick={handleLogout}
                className="w-full text-left bg-amber-600 text-white px-4 py-3 rounded-lg text-base font-medium hover:bg-amber-700 transition-transform duration-300 hover:scale-[1.02]"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("user"));
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <div className="profile-box">

      {/* HEADER */}
      <div className="profile-header">
        <FaUserCircle className="profile-icon" />
        <h2>MY ACCOUNT</h2>
      </div>

      {/* IF NOT LOGGED IN */}
      {!user ? (
        <div className="profile-empty">
          <h3>Please Login</h3>
        </div>
      ) : (
        <>
          {/* WELCOME */}
          <h3 className="welcome-text">
            Welcome, Mr {user.name || "User"}!
          </h3>

          {/* MENU */}
          <div className="profile-menu">

            <p className="menu-item active">My Profile</p>

            <p className="menu-item">
              My online orders and returns
            </p>

            <p className="menu-item">
              Customer Service
            </p>

            <p
              className="menu-item logout"
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
            >
              LOGOUT
            </p>

          </div>
        </>
      )}
    </div>
  );
}
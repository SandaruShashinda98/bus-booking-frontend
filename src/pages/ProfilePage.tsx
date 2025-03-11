import { NavLink, Outlet } from "react-router-dom";

const ProfilePage = () => {
  const pages = [1, 2, 3, 4];
  return (
    <div>
      {pages.map((profile) => (
        <NavLink
          key={profile}
          to={`/profile/${profile}`}
          className={({ isActive }) => {
            return isActive ? "text-red-700" : "";
          }}
        >
          profile - {profile}
        </NavLink>
      ))}
      <Outlet></Outlet>
    </div>
  );
};

export default ProfilePage;

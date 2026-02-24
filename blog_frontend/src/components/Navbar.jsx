import React, { useState } from "react";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();
  const user_data = localStorage.getItem("user");
  const user = user_data ? JSON.parse(user_data) : null;
  const [mobile, setMobile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  return (
    <div className=" top-0 w-full ">
      <nav className="flex top-0 p-3 items-center justify-between border-2 bg-slate-300 shadow-2xl z-10">
        <div className=" flex tracking-wide font-bold">
          {user ? <div>Hi, {user.name}</div> : <div>Welcome</div>}
        </div>
        <div>

        <div className="hidden lg:flex items-enter justify-center mr-4">
          <ul className=" flex items-center justify-center list-none space-x-6 cursor-pointer font-semibold">
            <li
              className="hover:underline transition-all hover:ease-linear"
              onClick={() => navigate("/")}
              >
              Home
            </li>
            <li
              className="hover:underline"
              onClick={() => navigate("create-post")}
              >
              Create Post
            </li>
            <li className="flex items-center justify-center ml-2 hover:underline cursor-pointer"
          onClick={user ? handleLogout : () => navigate("/login")}><span className="mr-2">
            <IoMdLogOut />
          </span>
          {user ? "Logout" : "Login/Signup"}</li>
          </ul>
          
        </div>
          </div>
          <div className="sm:flex lg:hidden">
            <button onClick={()=>setMobile(!mobile)}>{mobile ?  <IoClose />: <IoMenu /> }</button>
          </div>
          
      </nav>
      {mobile && <div className=" m-3 flex items-center justify-center">
  <ul className=" space-y-2  cursor-pointer font-semibold">
<li
  className="hover:underline transition-all hover:ease-linear"
  onClick={() => navigate("/")}
  >
  Home
</li>
<li
  className="hover:underline"
  onClick={() => navigate("create-post")}
  >
  Create Post
</li>
<li className="hover:underline flex items-center justify-center" onClick={user ? handleLogout : () => navigate("/login")}>

{user ? "Logout" : "Login/Signup"}
<span className="ml-3">
<IoMdLogOut />
</span>
</li>
</ul>

</div>}
    </div>
  );
};

export default Navbar;

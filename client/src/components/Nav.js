import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Nav = () => {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();

  const handlelogout = () => {
    localStorage.clear();
    console.log("logout");
    navigate("/signup");
    toast.success("User successfully Logged Out", {
      position: "top-center",
      autoClose: 800,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    // alert("User successfully Logged Out");
  };
  return (
    <div className="  top-0 text-white  bg-red-500 ">
      {auth ? (
        <div className="grid grid-flow-col text-2xl">
          <ul className="flex justify-start gap-5 py-3 px-5">
            <li className="hover:hover:scale-110 duration-200 ">
              <Link to="/">Products</Link>
            </li>
            <li className="hover:hover:scale-110 duration-200 ">
              <Link to="/add">Add Product</Link>
            </li>
          </ul>
          <ul className="flex justify-end  gap-5 py-3 px-5">
            <li className="hover:scale-110 duration-200 ">
              <Link onClick={handlelogout} to="/signup">
                Logout ( {JSON.parse(auth).name} )
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <ul className="grid-cols-2 gap-5 flex justify-end py-5 px-5 text-2xl ">
          <li className="hover:scale-110 duration-200 ">
            <Link to="/signup">SignUp</Link>
          </li>
          <li className="hover:scale-110 duration-200 ">
            <Link to="/login">Login</Link>
          </li>
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default Nav;

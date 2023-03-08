import React, { useContext, useState, useEffect } from "react";
import AuthForms from "./AuthForms";
import { useRouter } from "next/router";
import Link from "next/link";
import Context from "@/context/context";
import { toast } from "react-toastify";
import useComponentVisible from "./helpers/useComponentVisible";
import Wishlist from "./Wishlist";
import Head from "next/head";

function Navbar() {
  const router = useRouter();
  const { isAuth, setIsAuth } = useContext(Context);
  const context = useContext(Context);
  const [status, setStatus] = useState<Boolean>(false);
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  // const { userRef, isDropdownVisible, setIsDropDownVisible } = useComponentVisible(false);
   


  const clickHandler = (e: any) => {
    if (e.target.id === "signin") {
      setStatus((status) => true);
    }else {
      setStatus((status) => false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    toast.success("You've been logged out successfully");
  };

  return (
    <>
      <div className="bg-white drop-shadow flex fixed z-50 place-items-center w-full px-8 text-red-700 h-12 flex-row justify-between">
        {isAuth ? (
          <>
            <div className="flex flex-row space-x-4 list-none">
              <Link href="/" className=" btn">
                Home
              </Link>
              <Link href="/movie" className="drawer-button btn">
                Movies
              </Link>
            </div>
            <div className="flex flex-row list-none">
              <li className="btn btn--link">Cart</li>
              <li className="btn btn--link ">
                <button
                  id="wishlist"
                  onClick={() => setIsComponentVisible(true)}
                  type="button"
                >
                <i className="fa-solid fa-heart"></i>
                </button>
                <div ref={ref}>
                  {isComponentVisible && <Wishlist/>
                  }
                </div>
              </li>
              <li className="btn btn--link">My profile</li>
              <li className="btn btn--link" onClick={logoutHandler}>
                Logout
              </li>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-row space-x-4 list-none">
              <Link href="/" className="drawer-button btn">
                Home
              </Link>
              <Link href="/movie" className="drawer-button btn">
                Movies
              </Link>
            </div>
            <div className="flex flex-row space-x-4 list-none">
              <button
                type="button"
                id="signin"
                onClick={clickHandler}
                data-drawer-target="drawer-right-example"
                data-drawer-show="drawer-right-example"
                data-drawer-placement="right"
                aria-controls="drawer-right-example"
              >
                Signin
              </button>
              <button
                type="button"
                id="register"
                onClick={clickHandler}
                data-drawer-target="drawer-right-example"
                data-drawer-show="drawer-right-example"
                data-drawer-placement="right"
                aria-controls="drawer-right-example"
              >
                Signup
              </button>
            </div>
          </>
        )}
      </div>
      <AuthForms status={status} />
      {/* {<Wishlist wishlist={showWishlist} />} */}
    </>
  );
}

export default Navbar;

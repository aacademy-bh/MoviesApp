import React, { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Spinner from "./spinner";
import { useAuth } from "@/context/auth";

function Wishlist() {
  const router = useRouter();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: userDetails, isLoading: userDetailsLoading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: () =>
      axios.get("/api/user/details", {
        headers: { Authorization: token },
      }),
  });

  const { mutate: handleAddToCartClick, isLoading: handleAddToCartLoading } =
    useMutation({
      mutationFn: (movieID: any) =>
        axios.post(
          "/api/cart/add",
          { moviesIDs: [movieID.toString()] },
          { headers: { Authorization: token } }
        ),
      onSuccess: (res) => {
        queryClient.invalidateQueries(["userDetails"]);
        toast.success(res.data.message);
      },
      onError: (err) => {
        console.log(err);
        toast.error(`${err?.response?.data?.message}`);
      },
    });

  const { mutate: removeHandler, isLoading: removeHandlerLoading } =
    useMutation({
      mutationFn: (movieID: any) =>
        axios.post(
          "/api/wishlist/remove",
          { moviesIDs: [movieID.toString()] },
          { headers: { Authorization: token } }
        ),
      onSuccess: (res, movieID) => {
        queryClient.invalidateQueries(["userDetails"]);
        toast.success("Movie removed successfully from your wishlist!!");
      },
    });

  // console.log("userDetails", userDetails);
  const wishlistItems = userDetails?.data?.wishlist.map((movie) => (
    <li
      key={movie.id}
      className="flex p-4 items-center justify-between"
      onClick={(e) => {
        // /// Why do you need to prevent default and stop propagation?
        e.preventDefault();
        e.stopPropagation();
        router.push(`/movie/${movie.id}`);
        // router.refresh();
      }}
    >
      <div className="flex items-center">
        <img
          className="h-20 w-20 object-fill rounded-md mr-4"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
              : "https://www.altavod.com/assets/images/poster-placeholder.png"
          }
        />
        <span className="truncate w-56">{movie.title}</span>
      </div>
      <div className="flex space-x-4">
        <i
          className="fa-solid fa-heart cursor-pointer hover:text-red-900"
          onClick={(e) => {
            // /// Why do you need to prevent default and stop propagation?
            e.preventDefault();
            e.stopPropagation();
            removeHandler(movie.id);
          }}
        ></i>
        <i
          className="fa-solid fa-cart-plus cursor-pointer"
          onClick={(e) => {
            // /// Why do you need to prevent default and stop propagation?
            e.preventDefault();
            e.stopPropagation();
            handleAddToCartClick(movie.id);
          }}
        ></i>
      </div>
    </li>
  ));
  
  /* //// Instead of doing it this way, you can have 2 return statements:
   
      if(userDetailsLoading) return null;

      return (...)

      //// This is a bit cleaner and easier to read.
  */
  return (
    <div className="z-50 w-110 absolute top-12 right-20 mt-1 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 overflow-auto max-h-128">
      {!userDetailsLoading ? (
        userDetails?.data?.wishlist.length > 0 ? (
          wishlistItems
        ) : (
          <p className="min-w-110 p-5 text-dark-grey">
            You have nothing in your wishlist!{" "}
          </p>
        )
      ) : (
        <div className="flex items-center justify-center min-w-110 p-5">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default Wishlist;

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LandingPage, Movie } from "@/types";
import MovieComponent from "./MovieComponent";
// //// This file does not exist
import Spinner from "../components/spinner";

function HomePage() {
  const queryClient = useQueryClient();
  type Response = { data: LandingPage };
  const query = (): Promise<Response> =>
    // //// API calls should be cleaned up using an axios instance (custom hook)
    // //// API URL should be an environment variable, in Next.js case, http://localhost:8000 is not needed.
    axios.get("http://localhost:8000/api/landingpage", {
      // //// Headers should be set in an axios instance
      headers: { Authorization: localStorage.getItem("token") },
    });

  const { data, isLoading } = useQuery<Response, Error>(["categories"], query, {
    refetchOnWindowFocus: false,
  });

  // //// console logs should be removed
  console.log("data", data);
  // //// unused variables should be removed
  const loading = !data || isLoading;

  // //// TYPES!! && camelCase
  // //// Should be named better, like movieCategories
  const HomePageContent = data?.data?.map(
    (category) =>
      category.movies && (
        // //// <>...</> is not needed
        <>
          <div key={category.id}>
            <h1 className="p-7 text-red-700 font-bold text-2xl">
              {category.title}
            </h1>
            <div className="flex flex-row overflow-x-scroll space-x-3 pl-5 pb-5 pt-5 ">
              {category.movies?.map((movie) => (
                <MovieComponent movie={movie} page="home"/>
              ))}
            </div>
          </div>
        </>
      )
  );

  /* //// Instead of doing it this way, you can have 2 return statements:
   
      if(isLoading) return null;

      return (...)

      //// This is a bit cleaner and easier to read.
  */
  return (
    <div className="pt-12">
      {isLoading ? (
        <div className="flex w-full h-[calc(100vh-45px)] justify-center items-center">
          {" "}
        </div>
      ) : (
        HomePageContent
      )}
    </div>
  );
}

export default HomePage;

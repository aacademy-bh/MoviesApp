// //// Why is this page href /Purchases instead of /purchases?
// //// It is always preferred to use index.tsx inside a folder called purchases instead of a file directly called purchases.tsx

import MovieComponent from "@/components/MovieComponent";
import Spinner from "@/components/spinner";
import { useAuth } from "@/context/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

function Purchases() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { data: previousPurchases, isLoading: userDetailsLoading } = useQuery({
    queryKey: ["previousPurchases"],
    queryFn: () =>
      axios.get("/api/user/details", {
        headers: { Authorization: token },
      }),
    enabled: !!token,
  });

  // const userDetail = queryClient.getQueryData('userDetails');
  return (
    <div className="p-12">
      <h1 className="text-2xl font-bold pl-10 pt-10">Previously purchased</h1>
      {previousPurchases?.data.purchases.length > 0 ? (
        <div className="w-fit mx-auto my-auto flex flex-col p-10">
          {userDetailsLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-4 gap-4 max-w-fit">
              {previousPurchases?.data?.purchases.map((movie) => (
                <MovieComponent movie={movie} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-10 text-lg text-center italic font-bold text-dark-grey">
          You don't have any movies yet!
        </div>
      )}
    </div>
  );
}

export default Purchases;

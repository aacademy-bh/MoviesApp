import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import MovieComponent from "@/components/MovieComponent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "use-debounce";
import { useAuth } from "@/context/auth";
import Spinner from "@/components/spinner";
import { Genre, Movie } from "@/types";

function index() {
  const { ref, inView } = useInView();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [value] = useDebounce(search, 1000);
  const { token } = useAuth();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["movies", value, genre],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await axios.get(
          `/api/movie/test?page=${pageParam}&search=${value}&genre=${genre}`,
          { headers: { Authorization: token } }
        );
        return res.data;
      },
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.total_pages === pages.length) return;
        else return pages.length + 1;
      },
      refetchOnWindowFocus: false,
    });

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: () => axios.get("/api/movie/genres"),
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  // //// No need to use a function here, call setSearch directly.
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // //// No need to use a function here, call setGenre directly.
  const handleGenre = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenre(e.target.value);
  };

  return (
    <div className="pt-12">
      <div className="w-fit mx-auto my-auto flex flex-col p-10">
        <div className="w-full pb-5 flex">
          <input
            type="text"
            name="searchBar"
            id="searchBar"
            placeholder="Search for a movie"
            className="w-3/4 bg-gray-100 border-2 border-gray-200 rounded  py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-red-700"
            onChange={changeHandler}
          />
          <div className="flex-1 ml-4">
            <select
              id="genre"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleGenre}
            >
              <option selected>Choose a genre</option>
              {genres?.data?.map((genre: Genre) => (
                <option value={genre.id}>{genre.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 max-w-fit">
          {/* //// There is a cleaner way to do this using a reducer */}
          {data?.pages?.map((page) => (
            <React.Fragment key={page.page}>
              {page?.results?.map((movie: Movie) => (
                <MovieComponent movie={movie} />
              ))}
            </React.Fragment>
          ))}
          <div className="">
            <button
              className="justify-center self-center"
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {/* A cleaner way would be to say isFetchingNextPage || hasNextPage ? ... : ... */}
              {isFetchingNextPage ? (
                <Spinner />
              ) : hasNextPage ? (
                <Spinner />
              ) : (
                "Nothing more to load"
              )}
            </button>
          </div>
          {/* //// {isFetching && !isFetchingNextPage ? <div><Spinner /></div> : null} */}
          <div>{isFetching && !isFetchingNextPage ? <Spinner /> : null}</div>
        </div>
      </div>
    </div>
  );
}

export default index;

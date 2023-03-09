import React, {useContext} from 'react'
import Movie from '@/types' ;
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Context from "@/context/context";
import { toast } from 'react-toastify';

function MovieComponent(props) {
  const {movie} = props
  const {data,setData} = useContext(Context);

  const { mutate: handleLikeClick, isLoading: handleSubmitTodoLoading } =
  useMutation({
    mutationFn: (movieID: any) => axios.post('/api/createwishlist',{movieID :[movieID.toString()]}, {headers: {"Authorization" : localStorage.getItem("token") }}),
    onSuccess: (res) =>{
      console.log('movie', res.data.movie)
      console.log('data context', data)
      setData((data) => {
        return {...data, wishlist:[...data.wishlist, res.data.movie]}})
      toast.success("Movie Added successfully to your wishlist!!")
    },
  })
  return (
    <div className="h-96 min-w-fit max-w-fit rounded-md relative drop-shadow-md" key={movie.id} >
    <img
      className="h-96 w-60 object-fill rounded-md"
      src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : 'https://www.altavod.com/assets/images/poster-placeholder.png'}
      alt=""
    />
    <div className="absolute bottom-0 bg-white w-60 h-20 rounded-br-md rounded-bl-md p-4 flex justify-between">
      <span className="text-red-700">{movie.title? movie.title : movie.name}</span>
      <span>{movie.vote_average}</span>
    </div>
    <div className="absolute bottom-0 bg-red w-60 h-10 rounded-br-md rounded-bl-md p-4 flex justify-between">
      {/* <span className="text-red-700"></span> */}
      {/* <span>{movie.vote_average}</span> */}
      <button className='' onClick={() => handleLikeClick(movie.id)}><i className="fa-regular fa-heart"></i></button>
    </div>
  </div>
  )
}

export default MovieComponent
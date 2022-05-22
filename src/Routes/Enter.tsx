import { useQuery } from "react-query";
import { getMovies } from "../api";
import Loader from "../Components/Loader";

function Enter() {
  const { data, isLoading } = useQuery(["moviex", "nowPlaying"], getMovies);
  console.log(data, isLoading);
  return (
    <>{!isLoading ? <Loader /> : <div style={{ height: "200vh" }}></div>}</>
  );
}

export default Enter;

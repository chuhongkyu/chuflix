import { useQuery } from "react-query";
import { getMovies } from "../api";

function Enter() {
  const { data, isLoading } = useQuery(["moviex", "nowPlaying"], getMovies);
  console.log(data, isLoading);
  return <div style={{ height: "200vh" }}></div>;
}

export default Enter;

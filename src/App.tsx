import { BrowserRouter, Routes, Route } from "react-router-dom";
import Enter from "./Routes/Enter";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Enter />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/movies/:type/:id" element={<Home />} />
          <Route path="/tv" element={<Tv />} />
          <Route path="/tv/:type/:tvid" element={<Tv />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

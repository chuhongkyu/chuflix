import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Loader from "../Components/Loader";
import Header from "../Components/Header";
import { getSearch, ISearchResult } from "../api";
import { useQuery } from "react-query";
import { makeImagePath } from "../Utils/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  height: 100vh;
  overflow-x: hidden;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0)
    ),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-repeat: no-repeat;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 15px;
  font-weight: 800;
`;

const MovieDetail = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  h2 {
    font-size: 20px;
  }
`;

const TopIcon = styled.div`
  padding: 5px 10px;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-right: 10px;
  span {
    font-size: 15px;
  }
`;

const Overview = styled.p`
  margin-top: 10px;
  font-size: 20px;
  color: ${(props) => props.theme.white.darker};
  width: 50%;
  opacity: 0.8;
`;

const Slider = styled.div`
  position: relative;
  margin-left: 60px;
  top: -100px;
  h1 {
    margin-bottom: 10px;
    font-size: 25px;
  }
`;

const Row = styled(motion.div)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
`;

const Movie = styled(motion.div)<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  height: 200px;
  position: relative;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const rowVariant = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5,
  },
};

const movieVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    zIndex: 2,
    transition: {
      delay: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const [search, setSearch] = useState(keyword);
  useEffect(() => {
    setSearch(keyword);
  }, [keyword]);
  const { data, isLoading } = useQuery<ISearchResult>(["multi", search], () =>
    getSearch(search)
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Header></Header>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].original_title}</Title>
            <MovieDetail>
              <TopIcon>
                <span>{data?.results[0].media_type.toUpperCase()}</span>
              </TopIcon>
              <h2>
                {data?.results[0].media_type === "movie"
                  ? "Now Playing"
                  : "Air Playing"}
              </h2>
            </MovieDetail>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>

          <Slider>
            <h1>Results : {keyword?.toUpperCase()}</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Movie
                      layoutId={movie.id + ""}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={movieVariants}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w400" || "")}
                    ></Movie>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Search;

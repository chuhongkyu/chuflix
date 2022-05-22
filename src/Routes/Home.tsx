import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies,
  getTopRatedM,
  getUpComingM,
  IGetMoviesResult,
} from "../api";
import Header from "../Components/Header";
import Loader from "../Components/Loader";
import { makeImagePath } from "../Utils/utils";
import MovieHover from "../Components/MovieHover";
import { useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  height: 200vh;
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
  height: 300px;
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

const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: -100px;
  width: 100%;
  height: 100px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 5;
`;

const ModalMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  overflow: hidden;
  border-radius: 15px;
  z-index: 5;
  hr {
    margin: 0px 10px;
  }
`;

const ModalCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  position: relative;
`;

const ModalTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 25px;
  margin: 30px 10px 10px 20px;
`;

const ModalOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  margin: 0px 10px 10px 20px;
`;

const ModalBtn = styled.span`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px 50px;
  border-radius: 5px;
  position: absolute;
  bottom: 30px;
  left: 30px;
  background-color: red;
`;

const ModalCloseBtn = styled.span`
  color: ${(props) => props.theme.white.darker};
  padding: 5px 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid ${(props) => props.theme.white.darker};
  border-radius: 50%;
  position: absolute;
  top: 10px;
  right: 10px;
  &:hover {
    background-color: white;
    color: ${(props) => props.theme.black.lighter};
    transition: 0.5s;
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

const infoVariants = {
  hover: {
    opacity: 1,
  },
};

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();

  const { data: nowPlayingData, isLoading: nowPlayingLoading } =
    useQuery<IGetMoviesResult>(["movie", "nowPlaying"], getMovies);
  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<IGetMoviesResult>(["movie", "topRated"], getTopRatedM);
  const { data: upcomingData, isLoading: upcomingLoading } =
    useQuery<IGetMoviesResult>(["movie", "upcoming"], getUpComingM);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (nowPlayingData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowPlayingData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onMovieClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => {
    navigate("/");
  };
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    nowPlayingData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  const clickedTopMovie =
    bigMovieMatch?.params.movieId &&
    topRatedData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  const clickedUpComMovie =
    bigMovieMatch?.params.movieId &&
    upcomingData?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );

  return (
    <Wrapper>
      {nowPlayingLoading || topRatedLoading || upcomingLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Header></Header>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <MovieDetail>
              <TopIcon>
                <span>TOP 20</span>
              </TopIcon>
              <h2>Now Playing</h2>
            </MovieDetail>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>

          <Slider>
            <h1>Now Playing</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {nowPlayingData?.results
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
                      onClick={() => onMovieClicked(movie.id)}
                    >
                      <Info variants={infoVariants}>
                        <MovieHover
                          title={
                            movie.title.length < 20
                              ? movie.title
                              : movie.title.substring(0, 20) + "..."
                          }
                          date={movie.release_date.substring(0, 4)}
                          adult={movie.adult}
                        />
                      </Info>
                    </Movie>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <ModalMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <ModalCover
                        style={{
                          backgroundImage: `url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      >
                        <ModalBtn>▶️ Play</ModalBtn>
                        <ModalCloseBtn onClick={onOverlayClick}>
                          ✖️
                        </ModalCloseBtn>
                      </ModalCover>
                      <ModalTitle>{clickedMovie.title}</ModalTitle>
                      <ModalOverview>
                        {clickedMovie.overview.length < 300
                          ? clickedMovie.overview
                          : clickedMovie.overview.substring(0, 300) + "..."}
                      </ModalOverview>
                      <hr />
                    </>
                  )}
                </ModalMovie>
              </>
            ) : null}
          </AnimatePresence>

          <Slider>
            <h1>Top Rated</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {topRatedData?.results
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
                      onClick={() => onMovieClicked(movie.id)}
                    >
                      <Info variants={infoVariants}>
                        <MovieHover
                          title={
                            movie.title.length < 20
                              ? movie.title
                              : movie.title.substring(0, 20) + "..."
                          }
                          date={movie.release_date.substring(0, 4)}
                          adult={movie.adult}
                        />
                      </Info>
                    </Movie>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <ModalMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedTopMovie && (
                    <>
                      <ModalCover
                        style={{
                          backgroundImage: `url(${makeImagePath(
                            clickedTopMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      >
                        <ModalBtn>▶️ Play</ModalBtn>
                        <ModalCloseBtn onClick={onOverlayClick}>
                          ✖️
                        </ModalCloseBtn>
                      </ModalCover>
                      <ModalTitle>{clickedTopMovie.title}</ModalTitle>
                      <ModalOverview>
                        {clickedTopMovie.overview.length < 300
                          ? clickedTopMovie.overview
                          : clickedTopMovie.overview.substring(0, 300) + "..."}
                      </ModalOverview>
                      <hr />
                    </>
                  )}
                </ModalMovie>
              </>
            ) : null}
          </AnimatePresence>

          <Slider>
            <h1>Up Coming</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {upcomingData?.results
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
                      onClick={() => onMovieClicked(movie.id)}
                    >
                      <Info variants={infoVariants}>
                        <MovieHover
                          title={
                            movie.title.length < 20
                              ? movie.title
                              : movie.title.substring(0, 20) + "..."
                          }
                          date={movie.release_date.substring(0, 4)}
                          adult={movie.adult}
                        />
                      </Info>
                    </Movie>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <ModalMovie
                  layoutId={bigMovieMatch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedUpComMovie && (
                    <>
                      <ModalCover
                        style={{
                          backgroundImage: `url(${makeImagePath(
                            clickedUpComMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      >
                        <ModalBtn>▶️ Play</ModalBtn>
                        <ModalCloseBtn onClick={onOverlayClick}>
                          ✖️
                        </ModalCloseBtn>
                      </ModalCover>
                      <ModalTitle>{clickedUpComMovie.title}</ModalTitle>
                      <ModalOverview>
                        {clickedUpComMovie.overview.length < 300
                          ? clickedUpComMovie.overview
                          : clickedUpComMovie.overview.substring(0, 300) +
                            "..."}
                      </ModalOverview>
                      <hr />
                    </>
                  )}
                </ModalMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;

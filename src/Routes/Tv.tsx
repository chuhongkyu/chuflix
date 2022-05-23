import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getTv,
  getAirTv,
  getPopularTv,
  getTopRatedTv,
  ITvResult,
  ITv,
} from "../api";
import Header from "../Components/Header";
import Loader from "../Components/Loader";
import { makeImagePath } from "../Utils/utils";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import MovieHover from "../Components/MovieHover";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

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

const TvProgramDetail = styled.div`
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

const TvProgram = styled(motion.div)<{ bgPhoto: string }>`
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

const ModalTvProgram = styled(motion.div)`
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

const TvProgramVariants = {
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

function Tv() {
  const navigate = useNavigate();
  const bigTvProgramMatch: PathMatch<"type" | "tvid"> | null =
    useMatch("/tv/:type/:tvid");

  const { scrollY } = useViewportScroll();

  const { data: lastestData, isLoading: lastestLoading } = useQuery<ITvResult>(
    ["tv", "lastest"],
    getTv
  );
  const { data: airData, isLoading: airLoading } = useQuery<ITvResult>(
    ["tv", "airPlaying"],
    getAirTv
  );
  const { data: popularData, isLoading: popularLoading } = useQuery<ITvResult>(
    ["tv", "popular"],
    getPopularTv
  );
  const { data: topRatedData, isLoading: topRatedLoading } =
    useQuery<ITvResult>(["tv", "topRated"], getTopRatedTv);

  const [tvData, setTvData] = useState<ITv | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (lastestData) {
      if (leaving) return;
      toggleLeaving();
      const totalTvPrograms = lastestData?.results.length - 1;
      const maxIndex = Math.floor(totalTvPrograms / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onTvProgramClicked = (type: string, tvId: number) => {
    navigate(`/tv/${type}/${tvId}`);
  };
  const onOverlayClick = () => {
    navigate("/tv");
  };

  useEffect(() => {
    let result: ITv | undefined;

    if (bigTvProgramMatch?.params.type === "lastest") {
      result = lastestData?.results.find(
        (tv: ITv) => String(tv.id) === bigTvProgramMatch?.params.tvid
      );
    } else if (bigTvProgramMatch?.params.type === "airPlaying") {
      result = airData?.results.find(
        (tv: ITv) => String(tv.id) === bigTvProgramMatch?.params.tvid
      );
    } else if (bigTvProgramMatch?.params.type === "popular") {
      result = popularData?.results.find(
        (tv: ITv) => String(tv.id) === bigTvProgramMatch?.params.tvid
      );
    } else if (bigTvProgramMatch?.params.type === "topRated") {
      result = topRatedData?.results.find(
        (tv: ITv) => String(tv.id) === bigTvProgramMatch?.params.tvid
      );
    }

    setTvData(result);
  }, [
    bigTvProgramMatch,
    lastestData?.results,
    airData?.results,
    popularData?.results,
    topRatedData?.results,
  ]);

  return (
    <Wrapper>
      <Header></Header>
      {lastestLoading || airLoading || popularLoading || topRatedLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Header></Header>
          <Helmet>
            <title>NEFLIX TV</title>
          </Helmet>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(lastestData?.results[0].backdrop_path || "")}
          >
            <Title>{lastestData?.results[0].name}</Title>
            <TvProgramDetail>
              <TopIcon>
                <span>TOP 20</span>
              </TopIcon>
              <h2>Air Playing</h2>
            </TvProgramDetail>
            <Overview>{lastestData?.results[0].overview}</Overview>
          </Banner>

          <Slider>
            <h1>Lastest Shows</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {lastestData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <TvProgram
                      layoutId={`lastest/${tv.id}`}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={TvProgramVariants}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w400" || "")}
                      onClick={() => onTvProgramClicked("lastest", tv.id)}
                    >
                      <Info variants={infoVariants}>
                        <MovieHover
                          title={
                            tv.name.length < 20
                              ? tv.name
                              : tv.name.substring(0, 20) + "..."
                          }
                          date={"Air Playing"}
                          adult={false}
                        />
                      </Info>
                    </TvProgram>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <Slider>
            <h1>Air Playing</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {airData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <TvProgram
                      layoutId={`airPlaying/${tv.id}`}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={TvProgramVariants}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w400" || "")}
                      onClick={() => onTvProgramClicked("airPlaying", tv.id)}
                    >
                      <Info variants={infoVariants}>
                        <MovieHover
                          title={
                            tv.name.length < 20
                              ? tv.name
                              : tv.name.substring(0, 20) + "..."
                          }
                          date={"Air Playing"}
                          adult={false}
                        />
                      </Info>
                    </TvProgram>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <Slider>
            <h1>Popular</h1>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {popularData?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <TvProgram
                      layoutId={`popular/${tv.id}`}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={TvProgramVariants}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w400" || "")}
                      onClick={() => onTvProgramClicked("popular", tv.id)}
                    >
                      <Info variants={infoVariants}>
                        <MovieHover
                          title={
                            tv.name.length < 20
                              ? tv.name
                              : tv.name.substring(0, 20) + "..."
                          }
                          date={"Air Playing"}
                          adult={false}
                        />
                      </Info>
                    </TvProgram>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <Slider>
            <h1>TopRated</h1>
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
                  .map((tv) => (
                    <TvProgram
                      layoutId={`topRated/${tv.id}`}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={TvProgramVariants}
                      transition={{ type: "tween" }}
                      bgPhoto={makeImagePath(tv.backdrop_path, "w400" || "")}
                      onClick={() => onTvProgramClicked("topRated", tv.id)}
                    >
                      <Info variants={infoVariants}>
                        <MovieHover
                          title={
                            tv.name.length < 20
                              ? tv.name
                              : tv.name.substring(0, 20) + "..."
                          }
                          date={"Air Playing"}
                          adult={false}
                        />
                      </Info>
                    </TvProgram>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigTvProgramMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <ModalTvProgram
                  layoutId={bigTvProgramMatch.params.tvid}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {tvData && (
                    <>
                      <ModalCover
                        style={{
                          backgroundImage: `url(${makeImagePath(
                            tvData.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      >
                        <ModalBtn>▶️ Play</ModalBtn>
                        <ModalCloseBtn onClick={onOverlayClick}>
                          ✖️
                        </ModalCloseBtn>
                      </ModalCover>
                      <ModalTitle>{tvData.name}</ModalTitle>
                      <ModalOverview>
                        {tvData.overview.length < 300
                          ? tvData.overview
                          : tvData.overview.substring(0, 300) + "..."}
                      </ModalOverview>
                      <hr />
                    </>
                  )}
                </ModalTvProgram>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;

import styled from "styled-components";
import { motion } from "framer-motion";

const LoaderContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled(motion.svg)``;

const logoVariants = {
  initial: {
    pathLength: 0,
    fill: "rgba(216, 31, 38, 0)",
  },
  animate: {
    pathLength: 1,
    fill: "rgba(216, 31, 38, 1)",
  },
};

function Loader() {
  return (
    <LoaderContainer>
      <Logo
        variants={logoVariants}
        initial="inital"
        animate="animate"
        transition={{ duration: 5 }}
        width="222px"
        height="222px"
        strokeWidth="2"
        stroke="rgba(216, 31, 38, 1)"
        viewBox="-49.6 0 222 222"
        id="svg2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="layer1" transform="translate(12.495 6.756)">
          <g id="g4182">
            <g id="g5747" transform="translate(81.631 113.771) scale(.29074)">
              <motion.path
                id="path4155"
                d="M-52.5-412.3l-.3 168-.3 168-13.8-39v-.1l-17.9 374c17.6 49.6 27 76.1 27.1 76.2.1.1 10.1.7 22.2 1.3 36.6 1.8 82 5.7 116.5 10 8 1 14.8 1.5 15.3 1.1s.6-171.4.5-380.1l-.3-379.4h-149z"
              />
              <motion.path
                id="path4157"
                d="M-322-412.8V-33c0 208.9.2 380 .5 380.3.3.3 13.2-1 28.8-2.7 15.6-1.7 37.1-3.9 47.8-4.8 16.4-1.4 65.6-4.5 71.2-4.6 1.7 0 1.8-8.5 2-160.9l.3-160.9 11.9 33.6c1.8 5.2 2.4 6.8 4.2 11.9l17.9-373.9c-3.8-10.7-1.8-5.1-6.1-17.3-14.6-41.3-27-76.2-27.5-77.8l-1-2.8h-150z"
              />
              <motion.path
                id="path5715"
                d="M-52.5-412.3l-.3 168-.3 168-13.8-39v-.1l-17.9 374c17.6 49.6 27 76.1 27.1 76.2.1.1 10.1.7 22.2 1.3 36.6 1.8 82 5.7 116.5 10 8 1 14.8 1.5 15.3 1.1s.6-171.4.5-380.1l-.3-379.4h-149z"
              />
              <motion.path
                id="path5717"
                d="M-322-412.8V-33c0 208.9.2 380 .5 380.3.3.3 13.2-1 28.8-2.7 15.6-1.7 37.1-3.9 47.8-4.8 16.4-1.4 65.6-4.5 71.2-4.6 1.7 0 1.8-8.5 2-160.9l.3-160.9 11.9 33.6c1.8 5.2 2.4 6.8 4.2 11.9l17.9-373.9c-3.8-10.7-1.8-5.1-6.1-17.3-14.6-41.3-27-76.2-27.5-77.8l-1-2.8h-150z"
              />
              <radialGradient
                id="path5719_1_"
                cx="18038.016"
                cy="-146.44"
                r="368.717"
                gradientTransform="matrix(.07072 -.02449 -.897 -2.5906 -1526.665 25.194)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" />
                <stop offset="1" stop-opacity="0" />
              </radialGradient>
              <motion.path
                id="path5719"
                d="M-322-412.8v213.2l150.2 398.4c0-9.1 0-14.1.1-24.5l.3-160.9 11.9 33.6C-93.5 234.2-58 334.6-57.8 334.8c.1.1 10.1.7 22.2 1.3 36.6 1.8 82 5.7 116.5 10 8 1 14.8 1.5 15.3 1.1.3-.3.5-84.1.5-202.4L-52.7-285l-.1 40.7-.3 168-13.8-39c-13.5-38.1-22.5-63.6-76.8-217-14.6-41.3-27-76.2-27.5-77.8l-1-2.8H-322v.1z"
              />
              <motion.path
                id="path5721"
                d="M-322-412.8l150.5 426.5v-.2l11.9 33.6C-93.5 234.2-58 334.6-57.8 334.8c.1.1 10.1.7 22.2 1.3 36.6 1.8 82 5.7 116.5 10 7.9 1 14.8 1.5 15.2 1.1L-53.1-76.4v.1l-13.8-39c-13.5-38.1-22.5-63.6-76.8-217-14.6-41.3-27-76.2-27.5-77.8l-1-2.8h-74.9l-74.9.1z"
              />
            </g>
          </g>
        </g>
      </Logo>
    </LoaderContainer>
  );
}

export default Loader;

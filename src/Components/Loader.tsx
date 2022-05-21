import styled from "styled-components";
import { motion } from "framer-motion";

const LoaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Loader() {
  return <LoaderContainer>Loading</LoaderContainer>;
}

export default Loader;

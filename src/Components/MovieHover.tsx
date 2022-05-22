import { motion } from "framer-motion";
import styled from "styled-components";

interface IMovieHover {
  title: string;
  date: string;
  adult: boolean;
}

const BtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Btn = styled(motion.span)`
  padding: 5px 7px;
  border-radius: 50%;
  border: 2px solid white;
  margin-right: 5px;
  &:first-child {
    background-color: white;
  }
`;

const Title = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: white;
  font-size: 11px;
  h2:first-child {
    color: #19a419;
    margin-right: 5px;
    font-size: 11px;
  }
`;

const AdultMark = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  background-color: red;
  color: white;
  border-radius: 5%;
  font-weight: 800;
  font-size: 15px;
`;

function MovieHover({ title, date, adult }: IMovieHover) {
  return (
    <>
      <BtnContainer>
        <div>
          <Btn>▶️</Btn>
          <Btn>➕</Btn>
        </div>
        <Btn>⬇️</Btn>
      </BtnContainer>
      <Title>
        <h2>{date}</h2>
        {adult === true ? <AdultMark>18</AdultMark> : null}
        <h2>{title}</h2>
      </Title>
    </>
  );
}

export default MovieHover;

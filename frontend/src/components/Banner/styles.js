import styled from "styled-components/macro";

export const Container = styled.div`
  display: flex;
  overflow: auto;
`;
export const Entity = styled.div`
  color: #FFFFFF;
  border: 1px solid #070707;
  max-width: 690px;
  width: 99%;
  margin-bottom: 10px;
  margin: auto;
  &:first-of-type {
    margin-top: 1.5em;
  }
`;
export const Inner = styled.div`
  padding: 75px 40px;
  max-width: 800px;
  margin: auto;
  flex-direction: column;
  display: flex;
`;
export const Question = styled.div`
  color: var(--text-main);
  font-size: 24px;
  justify-content: space-between;
  cursor: pointer;
  margin-bottom: 2px;
  display: flex;
  font-weight: 500;
  background: rgba(255, 255, 255, 0);
  padding: 0.75em 1.12em;
  align-items: center;
`;
export const Text = styled.p`
  color: var(--text-main);
  max-height: 1190px;
  font-size: 20px;
  font-weight: normal;
  line-height: normal;
  transition: max-height 0.23s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.9em 2.1em 0.7em 1.4em;
  user-select: none;
  white-space: pre-wrap;

  @media (max-width: 550px) {
    font-size: 15px;
    line-height: 25px;
  }
`;
export const Header = styled.h1`
  color: var(--text-main);
  line-height: 7;
  margin-top: 0 !important;
  font-size: 45px;
  margin-bottom: 9px;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 33px;
  }
`;
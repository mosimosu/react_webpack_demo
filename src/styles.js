import styled from "styled-components";
import { Button } from "antd";

export const StyledButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.primary};
  border-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.secondary};
  font-size: ${(props) => props.theme.fontSize.small};

  &&&:hover {
    background-color: ${(props) => props.theme.colors.primary};
  }

  &&&:active {
    background-color: ${(props) => props.theme.colors.primary};
    border-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  background-color: aliceblue;
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Title = styled.div`
  & > h1 {
    color: red;
    text-align: center;
  }
`;

export const InputSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

export const RadioSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${(props) => props.theme.gap};
`;

export const Lists = styled.div`
  width: 100%;
  padding: ${(props) => props.theme.padding.small};
  & > ul {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: ${(props) => props.theme.gap};

    //* item
    & > li {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: ${(props) => props.theme.gap};
      border: 2px solid #000;
      padding: ${(props) => props.theme.padding.small};
      border-radius: ${(props) => props.theme.borderRadius};

      //* button section
      & > div {
        display: flex;
        gap: ${(props) => props.theme.gap};
      }
    }
  }
`;

import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  &.clickable {
    cursor: pointer;
  }

  h1 {
    font-size: 2rem;
    font-weight: 200;
    line-height: 1;
    margin: 5px 0;
    opacity: 1;

    b {
        color: #d12656;
    }

    @media screen and (max-width: 1000px) {
        font-size: 1.5rem;
        line-height: 1.2;
        margin-bottom: 20px;
    }
  }
`;

interface PropType {
  number: string;
  title: string;
  children: any;
  className?: string;
  onClick?: () => void;
}

export default function Step(props: PropType) {
  let classes = "step";
  classes = `${classes} ${props.onClick ? "clickable" : ""}`.trim();
  classes = `${classes} ${props.className}`.trim();

  return (
    <Container className={classes} onClick={props.onClick}>
      <h1><b>Step {props.number}:</b> {props.title}</h1>
      {props.children}
    </Container>
  );
}

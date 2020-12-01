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

export default function Step({ className, onClick, number, title, children } ) {
  let classes = "step";
  classes = `${classes} ${onClick ? "clickable" : ""}`.trim();
  classes = `${classes} ${className}`.trim();

  return (
    <Container className={classes} onClick={onClick}>
      <h1><b>Step {number}:</b> {title}</h1>
      {children}
    </Container>
  );
}

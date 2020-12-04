import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  font-size: 1rem;
  padding-top: 20px;
  transition: all 0.5s ease;

  @media screen and (max-width: 1000px) {
    opacity: 1;
  }

  b {
    color: #faa919;
    font-weight: normal;

    .click {
      display: inline;

      @media screen and (max-width: 1000px) {
          display: none;
      }
    }

    .tap {
      display: none;

      @media screen and (max-width: 1000px) {
          display: inline;
      }
    }
  }
`;

export default function ClickTap(props: { children: any }) {
  return (
    <Container className="click-tap">
      <b><span className="click">Click</span><span className="tap">Tap</span></b> {props.children}
    </Container>
  );
}
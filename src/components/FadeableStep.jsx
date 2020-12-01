import React from "react";
import styled from "@emotion/styled";

import Step from "./Step";

const Wrapper = styled.div`
  .fadeable
    > * {
      opacity: 1;
      transition: all 0.5s ease;
    }

    .fade {
      > * {
        opacity: 0.2;
      }
  }
`;

export default function FadeableStep({ className, onClick, number, title, children } ) {
  const props = {
    className: `fadeable ${className}`.trim(),
    onClick, 
    number, 
    title, 
    children
  }

  return (
    <Wrapper>
      <Step {...props} />
    </Wrapper>
  );
}

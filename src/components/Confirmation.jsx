import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  font-size: 0.75rem;
  color: #0f0;
  transition: all 0.5s ease;
`;

export default function Confirmation({ className, children }) {
  return (
    <Container className={`confirmation ${className}`.trim()}>
      ✓ {children}
    </Container>
  );
}
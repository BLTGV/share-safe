import React from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  font-size: 0.75rem;
  color: #0f0;
  transition: all 0.5s ease;
`;

export default function Confirmation(props: { children: any, className?: string }) {
  return (
    <Container className={`confirmation ${props.className}`.trim()}>
      ✓ {props.children}
    </Container>
  );
}
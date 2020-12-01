import React from "react";

import styled from "@emotion/styled";

const Container = styled.div`
  width: 50vw;
  min-width: 1000px;
  height: 100vh;
  margin: auto;

  @media screen and (max-width: 1000px) {
    width: 90vw;
    min-width: unset;
  }

  .logo {
		display: block;
		width: 100vw;
		height: 50px;
		position: fixed;
		top: 0px;
		left: 0px;
		background-image: url("./logos/BLT Safe Share.svg");
		background-repeat: no-repeat;
		background-position: 50px 30px;
		background-size: auto 20px;
		background-color: #333;
		z-index: 1;
		box-shadow: 0px 0px 50px 50px #333;

		@media screen and (max-width: 1000px) {
			background-position: 5vw 30px;
		}
	}  
`;

export default function Main({ children }) {
  return (
    <Container>
        <div class="logo" />
        {children}
    </Container>
  );
}

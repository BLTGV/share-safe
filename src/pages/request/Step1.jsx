import React, { useState } from "react";
import styled from "@emotion/styled";

import Click from "../../components/ClickTap";
import FadeableStep from "../../components/FadeableStep";
import Confirmation from "../../components/Confirmation";

const Wrapper = styled.div`
  padding-top: 0.1px;

  .step {
    margin-top: 40vh;
    transition: all 0.5s ease;

    &:hover {
      .click-tap {
        opacity: 1;
      }
    }

    &.copied {
      margin-top: 25vh;
      cursor: default;

      @media screen and (max-width: 1000px) {
        margin-top: 15vh;
      }

      @media screen and (max-height: 500px) {
        margin-top: 0vh;
      }

      .click-tap {
        display: none;
      }

      .confirmation {
        display: block;
        opacity: 1;
      }
    }    

    .url {
      font-size: 0.75rem;
      word-break: break-all;
    }

    .click-tap {
      opacity: 0;
    }

    .confirmation {
      opacity: 0;
    }
  }
`;

export default function Step1({ url, onUrlClicked }) {
  const [classes, setClasses] = useState("");

  return (
    <Wrapper>
      <FadeableStep number="1" title="Send this link to the secret holder" className={`request ${classes}`} onClick={(e) => { setClasses(`$(classes) fade copied`.trim()); onUrlClicked(e); }}>
        <div className="url">{url}</div>
        <Click>to copy the link to your clipboard</Click>
        <Confirmation>Link copied to your clipboard</Confirmation>
      </FadeableStep>
    </Wrapper>
  );
}
import React from "react";
import styled from "@emotion/styled";

import Click from "../../components/ClickTap";
import Step from "../../components/Step";
import Confirmation from "../../components/Confirmation";

const Wrapper = styled.div`
  .step {
    &.url-copied {
      cursor: default;
    }

    > * {
      transition: opacity 0.5s ease;
    }

    &.url-copied > * {
      opacity: 0.2;
    }  

    .url {
      font-size: 0.75rem;
      word-break: break-all;
    }

    .click-tap {
      opacity: 0;
    }

    &:hover .click-tap {
      opacity: 1;
    }

    &.url-copied .click-tap {
      display: none;
    }

    .confirmation {
      display: none;
      opacity: 0;
    }

    &.url-copied .confirmation {
      display: block;
      opacity: 1;
    }
  }
`;

export default function Step1({ url, urlCopied, onUrlClicked }) {
  let classes = "request";
  classes += urlCopied ? " url-copied" : "";
  classes = classes.trim();
  
  return (
    <Wrapper>
      <Step number="1" title="Send this link to the secret holder" className={classes} onClick={onUrlClicked}>
        <div className="url">{url}</div>
        <Click>to copy the link to your clipboard</Click>
        <Confirmation>Link copied to your clipboard</Confirmation>
      </Step>
    </Wrapper>
  );
}
import React, { useContext } from "react";
import styled from "@emotion/styled";

import Context from "./_context"
import { ProgressFlags } from "./_interfaces"

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

interface PropType {
  url: string;
  onUrlClicked: () => void;
}

export default function Step1(props: PropType) {
  const progress = useContext(Context) as ProgressFlags;

  let classes = "request";
  classes += progress.urlCopied ? " url-copied" : "";
  classes = classes.trim();
  
  return (
    <Wrapper>
      <Step number="1" title="Send this link to the secret holder" className={classes} onClick={props.onUrlClicked}>
        <div className="url">{props.url}</div>
        <Click>to copy the link to your clipboard</Click>
        <Confirmation>Link copied to your clipboard</Confirmation>
      </Step>
    </Wrapper>
  );
}
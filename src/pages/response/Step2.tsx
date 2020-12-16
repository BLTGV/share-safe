import React, { useState, useEffect, useContext } from "react";
import styled from "@emotion/styled";

import { ProgressContext } from "../_contexts"
import { ProgressFlags } from "./_interfaces"

import Click from "../../components/ClickTap";
import Step from "../../components/Step";
import Confirmation from "../../components/Confirmation";

const Wrapper = styled.div`
  .step {
    opacity: 0.2;
    transition: opacity 0.5s ease;

    &.has-input {
      opacity: 1;
    }

    .response-url {
      display: block;
      border-radius: 5px;
      padding: 10px 20px;
      margin: 12px -7px;
      color: #fff;
      background-color: #444;
      transition: all 0.5s ease;

      .url-placeholder {
        display: block;
        height: calc(20px + 0.75rem);
        font-size: 0.75rem;
        padding: 10px 0px;
      }

      .url {
        display: none;
        font-size: 0.75rem;
        word-break: break-all;
        padding: 10px 0px 20px 0px;
        border-bottom: 1px solid #333;
      }

      .click-tap {
        display: none;
        font-size: 0.75rem;
        padding-top: 10px;
      }
    }

    &.has-input .response-url {
      cursor: pointer;

      &:hover {
        background-color: #555;
      }
    }

    &.input-encoded .response-url {
      .url-placeholder {
        display: none;
      }

      .url {
        display: block;
      }

      .click-tap {
        display: block;
      }
    }

    .confirmation.copied {
      display: none;
      opacity: 0;
      transition: opacity 0.5s;
    }

    &.url-copied .confirmation.copied {
      display: block;
      opacity: 1;
      transition: opacity 0.5s ease;
    }
  }
`;

interface PropType {
  responseUrl: string;
  onResponseUrlClicked: () => void;
}

export default function Step2(props: PropType) {
  const progress = useContext(ProgressContext) as ProgressFlags;
  
  const urlPlaceholderInitialState = "Waiting for the message ";
  const [urlPlaceholder, setUrlPlaceholder] = useState(urlPlaceholderInitialState);

  useEffect(() => {
    if (!progress.isAwaitingInputCompletion) {
      setUrlPlaceholder(urlPlaceholderInitialState);
      return;
    }
    
    const interval = setInterval(() => {
      setUrlPlaceholder(previous => {
        if (previous.length <= 32)
          return `${previous}. `;
        else
          return urlPlaceholderInitialState;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [progress.isAwaitingInputCompletion]);

  let classes = "response";
  classes += progress.hasInput ? " has-input" : "";
  classes += progress.isAwaitingInputCompletion ? " awaiting-input-completion" : "";
  classes += progress.isInputEncoded ? " input-encoded" : "";
  classes += progress.isUrlCopied ? " url-copied" : "";
  classes = classes.trim();

  return (
    <Wrapper>
      <Step number="2" title="Send this encoded message link to the requester" className={classes}>
        <div className="response-url" onClick={props.onResponseUrlClicked}>
          <div className="url-placeholder">{urlPlaceholder}</div>
          <div className="url">{props.responseUrl}</div>
          <Click>to copy the link to your clipboard</Click>
        </div>
        <Confirmation className="copied">Link copied to your clipboard</Confirmation>
      </Step>
    </Wrapper>
  );
}
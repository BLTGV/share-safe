import React, { useEffect, useContext, useRef } from "react";
import styled from "@emotion/styled";

import { ProgressContext } from "../_contexts"
import { ProgressFlags } from "./_interfaces"

import Click from "../../components/ClickTap";
import Step from "../../components/Step";
import Confirmation from "../../components/Confirmation";

const Wrapper = styled.div`
  .step {
    .textarea-wrapper {
      opacity: 1;
      height: unset;
      transition: opacity 0.5s ease;

      textarea {
        margin-top: 10px;
        width: 100%;
        height: calc(20px + 1rem);
        padding: 10px 20px;
        border: 0;
        border-radius: 5px;
        background-color: #444;
        color: #fff;
        font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        font-size: 0.75rem;
        line-height: 1rem;
        resize: none;
        overflow: hidden;
      } 
    }

    &.encoded-message-pasted .textarea-wrapper {
      opacity: 0;
      height: 0;
      overflow: hidden;
    }

    .confirmation.decoded {
      display: none;
    }

    &.encoded-message-decoded .confirmation.decoded {
      display: block;
    }

    .decoded-message {
      display: none;
      opacity: 0;
      border-radius: 5px;
      padding: 10px 20px;
      margin: 12px -7px;
      color: #fff;
      background-color: #444;
      cursor: pointer;
      transition: all 0.5s ease;

      &:hover {
        background-color: #555;
      }

      .message {
        display: block;
        font-size: 1rem;
        padding: 10px 0px 20px 0px;
        border-bottom: 1px solid #333;
      }

      .click-tap {
        font-size: 0.75rem;
        padding-top: 10px;
      }
    }

    &.encoded-message-decoded .decoded-message {
      display: block;
      opacity: 1;
    }

    &.decoded-message-copied .decoded-message {
      display: none;
    }

    .confirmation.copied {
      display: none;
      opacity: 0;
      transition: opacity 0.5s;
    }

    &.decoded-message-copied .confirmation.copied {
      display: block;
      opacity: 1;
      transition: opacity 0.5s ease;
    }

    .reset {
      display: none;
      opacity: 0;
      padding: 5px 0px;
      cursor: pointer;
      transition: opacity 0.5s ease;

      @media screen and (max-width: 1000px) {
        margin-top: 20px;
      }

      &:hover {
        .click-tap {
          width: 100px;
          opacity: 1;
        }
      }

      .click-tap {
        display: inline-block;
        width: 0;
        opacity: 0;
        white-space: nowrap;
        overflow: hidden;
        vertical-align: bottom;						
        transition: all 0.5s ease;

        @media screen and (max-width: 1000px) {
          display: inline;
          opacity: 1;
        }
      }
    }
  
    &.encoded-message-decoded .reset {
      display: block;
      opacity: 1;
    }

    &.decoded-message-copied .reset {
      display: block;
      opacity: 1;
    }
  }
`;

interface PropType {
  encodedMessage: string;
  decodedMessage: string;
  onEncodedMessagePasted: (m: string) => boolean;
  onDecodedMessageClicked: () => void;
  onReset: () => void;
}

export default function Step2(props: PropType) {
  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (!props.onEncodedMessagePasted(e.currentTarget.value)) {
      // activate error message
    }
  };

  const progress = useContext(ProgressContext) as ProgressFlags;

  let classes = "response";
  classes += progress.encodedMessagePasted ? " encoded-message-pasted" : "";
  classes += progress.encodedMessageDecoded ? " encoded-message-decoded" : "";
  classes += progress.decodedMessageCopied ? " decoded-message-copied" : "";
  classes = classes.trim();

  const response = useRef(null) as any;
  
  useEffect(() => {
    if (progress.urlCopied && !progress.encodedMessagePasted) 
      response.current.focus();
  });

  return (
    <Wrapper>
      <Step number="2" title="Paste the response from the secret holder here" className={classes}>
        <div className="textarea-wrapper">
          <textarea ref={response} value={props.encodedMessage} onChange={handleChange} />
        </div>
        <Confirmation className="decoded">Response pasted and decoded</Confirmation>
        <div className="decoded-message" onClick={props.onDecodedMessageClicked}>
          <div className="message">{props.decodedMessage}</div>
          <Click>to copy the link to your clipboard</Click>
        </div>
        <Confirmation className="copied">Message copied to your clipboard</Confirmation>
        <div className="reset" onClick={props.onReset}>Got another response to decode? <Click>here</Click></div>
      </Step>
    </Wrapper>
  );
}
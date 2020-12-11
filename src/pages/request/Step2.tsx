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

    &.key-mismatched,
    &.decoding-erred {
     .textarea-wrapper {
        opacity: 0;
        height: 0;
        overflow: hidden;
      }
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

    .error {
      display: none;
      opacity: 0;
      border-radius: 5px;
      padding: 10px 20px;
      margin: 12px -7px;
      color: #fff;
      background-color: #772d2d;
      transition: all 0.5s ease;

      h2 {
        display: none;
        font-size: 1rem;
        font-weight: normal;
      }

      .pasted-response {
        display: none;
        font-size: 0.75rem;
        word-break: break-all;
        padding-bottom: 10px;
      }
    }

    &.decoding-erred .error {
      display: block;
      opacity: 1;

      .decoding-error {
        display: block;
      }
    }

    &.key-mismatched .error {
      display: block;
      opacity: 1;

      .key-error {
        display: block;
      }
    }

    .reset {
      display: none;
      opacity: 0;
      padding: 5px 0px;
      cursor: pointer;
      transition: opacity 0.5s ease;

      @media screen and (max-width: 1000px) {
        margin-top: 20px;

        & + .reset {
          margin-top: 0px;
        }
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
  
    &.encoded-message-decoded,
    &.decoded-message-copied,
    &.key-mismatched,
    &.decoding-erred { 
      .reset {
        display: block;
        opacity: 1;
      }
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
  classes += progress.keyMismatched ? " key-mismatched" : "";
  classes += progress.decodingErred ? " decoding-erred" : "";
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
        <Confirmation className="decoded">Response pasted and decrypted</Confirmation>
        <div className="decoded-message" onClick={props.onDecodedMessageClicked}>
          <div className="message">{props.decodedMessage}</div>
          <Click>to copy the message to your clipboard</Click>
        </div>
        <Confirmation className="copied">Message copied to your clipboard</Confirmation>
        <div className="error">
          <h2 className="key-error">Please paste this response to where you sent the original request. If this is the correct place, then the response window has expired. You will need to resend the request link to the secret holder by selecting "Start over completely" below.</h2>
          <h2 className="decoding-error">This response cannot be decrypted. Please check to make sure it is identical to what was sent to you:</h2>
          <div className="decoding-error pasted-response">{props.encodedMessage}</div>
        </div>
        <div className="reset" onClick={props.onReset}>Got another response to decrypt? <Click>here</Click></div>
        <div className="reset" onClick={() => { window.location.href = window.origin; }}>Start over completely? <Click>here</Click></div>
      </Step>
    </Wrapper>
  );
}
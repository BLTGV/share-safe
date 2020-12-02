import React from "react";
import styled from "@emotion/styled";

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
        height: calc(20px + 0.75rem);
        padding: 10px 20px;
        border: 0;
        border-radius: 5px;
        background-color: #444;
        color: #fff;
        font-family: Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        font-size: 0.75rem;
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

export default function Step2({ encodedMessage, decodedMessage, encodedMessagePasted, encodedMessageDecoded, decodedMessageCopied, onEncodedMessagePasted, onDecodedMessageClicked, onReset }) {
  const handleChange = () => {
    // Do nothing. We are ignoring all inputs on the textarea, except for paste
  };

  const handlePaste = () => {
    if (!onEncodedMessagePasted(encodedMessage)) {
      // activate error message
    }
  };

  const handleCopy = () => {
    onDecodedMessageClicked();
  };

  const handleReset = () => {
    onReset();
  };

  let classes = "response";
  classes += encodedMessagePasted ? " encoded-message-pasted" : "";
  classes += encodedMessageDecoded ? " encoded-message-decoded" : "";
  classes += decodedMessageCopied ? " decoded-message-copied" : "";
  classes = classes.trim();

  return (
    <Wrapper>
      <Step number="2" title="Paste the response from the secret holder here" className={classes}>
        <div className="textarea-wrapper">
          <textarea id="response-input" value={encodedMessage} onChange={handleChange} onPaste={handlePaste} />
        </div>
        <Confirmation className="decoded">Response pasted and decoded</Confirmation>
        <div className="decoded-message" onClick={handleCopy}>
          <div className="message">{decodedMessage}</div>
          <Click>to copy the link to your clipboard</Click>
        </div>
        <Confirmation className="copied">Message copied to your clipboard</Confirmation>
        <div className="reset" onClick={handleReset}>Got another response to decode? <Click>here</Click></div>
      </Step>
    </Wrapper>
  );
}
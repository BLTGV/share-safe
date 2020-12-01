import React, { useState } from "react";
import styled from "@emotion/styled";

import Click from "../../components/ClickTap";
import Step from "../../components/Step";
import Confirmation from "../../components/Confirmation";

const Wrapper = styled.div`
  .step {
    margin-top: 50px;
    margin-bottom: 20vh;

    @media screen and (max-height: 500px) {
      margin-top: 20px;
    }

    &.pasted {
      textarea {
        display: none;
        opacity: 0;
      }
    }

    &.decoded {
      .confirmation.decoded {
        display: block;
      }

      .decoded-message {
        opacity: 1;
      }
    }

    &.copied {
      .decoded-message {
        display: none;
      }

      .confirmation.copied {
        opacity: 1;
      }

      .reset {
        display: block;
      }
    }    

    textarea {
      opacity: 1;
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
    }  
    
    .confirmation.decoded {
      display: none;
    }

    .decoded-message {
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

    .confirmation.copied {
      opacity: 0;
    }

    .reset {
      display: none;
      margin-top: 20px;
      padding: 5px 0px;
      cursor: pointer;

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
  }
`;

export default function Step2({ onEncodedMessagePasted, decodedMessage, onDecodedMessageClicked }) {
  const [encodedMessagePasted, setEncodedMessagePasted] = useState(false);
  const [encodedMessageDecoded, setEncodedMessageDecoded] = useState(false);
  const [decodedMessageCopied, setDecodedMessageCopied] = useState(false);


  const handlePaste = (e) => {
    setEncodedMessagePasted(true);

    const decodeMessage = new Promise((handleSuccess, handleFailure) => {
      const result = onEncodedMessagePasted(e.target.value);
      e.target.value = "";

      if (result)
        handleSuccess();
      else
        handleFailure();
    });

    decodeMessage.then(
      () => setEncodedMessageDecoded(true),
      () => {}
    );
  };

  const handleCopy = () => {
    onDecodedMessageClicked(decodedMessage);

    setDecodedMessageCopied(true);
  };

  const handleReset = () => {
    setEncodedMessagePasted(false);
    setEncodedMessageDecoded(false);
    setDecodedMessageCopied(false);
  };

  let classes = "";
  classes += encodedMessagePasted ? " pasted" : "";
  classes += encodedMessageDecoded ? " decoded" : "";
  classes += decodedMessageCopied ? " copied" : "";
  classes = classes.trim();

  return (
    <Wrapper>
      <Step number="2" title="Paste the response from the secret holder here" className={`response ${classes}`.trim()}>
        <textarea onPaste={handlePaste} />
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
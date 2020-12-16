import React, { useState, useRef, useEffect } from "react";

import { getResponseMeta, RequestMetaType, cryptoEncode } from "../../utils/persistedCrypto";

import Copy from "../../components/Copy";

import Base from "../_layout";
import { ProgressContext } from "../_contexts"
import { ProgressFlags } from "./_interfaces"

import Step1 from "./Step1";
import Step2 from "./Step2";

import styled from "@emotion/styled";

const Container = styled.div`
  padding-top: 0.1px;

  .request-error {
    display: none;
    margin-top: 45vh;
    text-align: center;
  }

  &.invalid-request .request-error {
    display: block;
  }

  .step.input {
    margin-top: 25vh;
    transition: margin-top 1s ease;

    @media screen and (max-width: 1000px) {
      margin-top: 15vh;
    }

    @media screen and (max-height: 500px) {
      margin-top: 0vh;
    }
  }

  .step.response {
    margin-top: 50px;
    margin-bottom: 20vh;

    @media screen and (max-height: 500px) {
      margin-top: 20px;
    }
  }

  &.invalid-request .step {
    display: none;
  }
`;

const getRequestParams = (): RequestMetaType => {
  const branch = "/s/";
  const encodedParams = window.location.pathname.replace(branch, "");

  if (!encodedParams)
    throw new Error("Request params missing");

  return JSON.parse(atob(encodedParams)) as RequestMetaType;
};

export default function Main() {
  const [enteredMessage, setEnteredMessage] = useState("");

  const [responseUrl, setResponseUrl] = useState("");

  const [isRequestInvalid, setIsRequestInvalid] = useState(false);
  const [hasInput, setHasInput] = useState(false);
  const [isAwaitingInputCompletion, setIsAwaitingInputCompletion] = useState(true);
  const [isInputEncoded, setIsInputEncoded] = useState(false);
  const [isUrlCopied, setIsUrlCopied] = useState(false);

  const progressFlags: ProgressFlags = {
    hasInput: hasInput,
    isAwaitingInputCompletion: isAwaitingInputCompletion,
    isInputEncoded: isInputEncoded,
    isUrlCopied: isUrlCopied
  };

  useEffect(() => {
    try {
      getRequestParams();
    } catch {
      setIsRequestInvalid(true);
    }  
  }, []);

  let inputTimeout = useRef(0);
  let inputValue = useRef("");

  const handleInputChanged = (e: React.FormEvent<HTMLTextAreaElement>) => {
    inputValue.current = e.currentTarget.value; // We cannot rely on enteredMessage state, because it is changed asynchronously and we might not get the most up to date state when we need it. Therefore, we will maintain the latest input in a reference hook during this input delay
    setEnteredMessage(inputValue.current);

    window.clearTimeout(inputTimeout.current);
    setHasInput(false); // The user can delete the entered message. We will mark this as false for now and check for it after the input delay
    setIsAwaitingInputCompletion(true);
    setIsInputEncoded(false);
    setIsUrlCopied(false);

    inputTimeout.current = window.setTimeout(() => { // We are not processing the input immediately. We will wait until the user has finished typing (at least 1 second of no activity)
      const value = inputValue.current;

      if (value) {
        setHasInput(true);
        setIsAwaitingInputCompletion(false);

        const requestParams = getRequestParams();
        const responseParams = getResponseMeta();

        responseParams.message = value;
        responseParams.requestKey = requestParams.requestKey;
        
        responseParams.message = cryptoEncode(responseParams);

        setIsInputEncoded(true); 

        const params = btoa(JSON.stringify(responseParams));
        setResponseUrl(`${window.origin}/${params}`);  
      }
    }, 1000);
  };

  const handleResponseUrlClicked = () => {
    if (isAwaitingInputCompletion) return;

    Copy(responseUrl);

    setIsUrlCopied(true);
  };

  let classes = "";
  classes += isRequestInvalid ? " invalid-request" : "";
  classes += hasInput ? " has-input" : "";
  classes += isAwaitingInputCompletion ? " awaiting-input-completion" : "";
  classes += isInputEncoded ? " input-encoded" : "";
  classes += isUrlCopied ? " url-copied" : "";
  classes = classes.trim();

  return (
    <Base>
      <ProgressContext.Provider value={progressFlags}>
        <Container className={classes}>
          <div className="request-error">The link you are using is invalid. Please ask the requester to send you the link again.</div>
          <Step1  value={enteredMessage} 
                  onInputChanged={handleInputChanged} />
          <Step2  responseUrl={responseUrl} 
                  onResponseUrlClicked={handleResponseUrlClicked} />
        </Container>
      </ProgressContext.Provider>
    </Base>
  );
}

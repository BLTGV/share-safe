import React, { useState, useRef } from "react";

// import useCopy from "@react-hook/copy";
// import { useUserMeta, SecretMeta, decode, ParamsMeta, useMetaCopy } from "../../util";
// import { useParams } from "react-router-dom";

import Copy from "../../components/Copy";

import Base from "../_layout";
import { ProgressContext } from "../_contexts"
import { ProgressFlags } from "./_interfaces"

import Step1 from "./Step1";
import Step2 from "./Step2";

import styled from "@emotion/styled";

const Container = styled.div`
  padding-top: 0.1px;

  .input {
    margin-top: 25vh;
    transition: margin-top 1s ease;

    @media screen and (max-width: 1000px) {
      margin-top: 15vh;
    }

    @media screen and (max-height: 500px) {
      margin-top: 0vh;
    }
  }

  .response {
    margin-top: 50px;
    margin-bottom: 20vh;

    @media screen and (max-height: 500px) {
      margin-top: 20px;
    }
  }
`;

export default function Main() {
  const [enteredMessage, setEnteredMessage] = useState("");
  const [encodedMessage, setEncodedMessage] = useState("");
  const [responseUrl, setResponseUrl] = useState("");

  const [hasInput, setHasInput] = useState(false);
  const [awaitingInputCompletion, setAwaitingInputCompletion] = useState(true);
  const [inputEncoded, setInputEncoded] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const progressFlags: ProgressFlags = {
    hasInput: hasInput,
    awaitingInputCompletion: awaitingInputCompletion,
    inputEncoded: inputEncoded,
    urlCopied: urlCopied
  };

  // const { publicKey, secretKey } = useUserMeta();
  // let meta: SecretMeta = { type: "request", recipientPubKey: publicKey };
  // const { url, encodedMeta, copy, copied } = useMetaCopy(meta);
  // const isYours = publicKey === meta.recipientPubKey;

  // const { meta: metaEncoded } = useParams<ParamsMeta>();

  // if(metaEncoded) {
  //   meta = decode(metaEncoded);
  // }

	const url = "http://share.blt.sh/s/eyJ0eXBlIjoicmVxdWVzdCIsInJlY2lwaWVudFB1YktleSI6IlpCcDdXUmsyVXRvYUV0MjVrdk9vZ0ZuMHZVZWNSaGVRMzlDekF4eTZDWDA9In0=";	

  const encodeMessage = (m: string): string => {
    // **********************************
    // Casey, do your encoding magic here
    // **********************************

    return encodeURI(m);
  };

  let inputTimeout = useRef(0);
  let inputValue = useRef("");

  const handleInputChanged = (e: React.FormEvent<HTMLTextAreaElement>) => {
    inputValue.current = e.currentTarget.value;
    setEnteredMessage(inputValue.current);

    window.clearTimeout(inputTimeout.current);
    setHasInput(false);
    setAwaitingInputCompletion(true);
    setInputEncoded(false);
    setUrlCopied(false);

    inputTimeout.current = window.setTimeout(() => {
      const value = inputValue.current;

      if (value) {
        setHasInput(true);
        setAwaitingInputCompletion(false);

        const message = encodeMessage(value);

        if (message) {
          setInputEncoded(true); 
          setEncodedMessage(message);
          setResponseUrl(`${url}${message}`);  
        }
        else {
          // TODO: error catching 
          // This really should never happen, though...
        }  
      }
    }, 1000);
  };

  const handleResponseUrlClicked = () => {
    if (awaitingInputCompletion) return;

    Copy(responseUrl);

    setUrlCopied(true);
  };

  let classes = "";
  classes += hasInput ? " has-input" : "";
  classes += awaitingInputCompletion ? " awaiting-input-completion" : "";
  classes += inputEncoded ? " input-encoded" : "";
  classes += urlCopied ? " url-copied" : "";
  classes = classes.trim();

  return (
    <Base>
      <ProgressContext.Provider value={progressFlags}>
        <Container className={classes}>
          <Step1  value={enteredMessage} 
                  onInputChanged={handleInputChanged} />
          <Step2  responseUrl={responseUrl} 
                  onResponseUrlClicked={handleResponseUrlClicked} />
        </Container>
      </ProgressContext.Provider>
    </Base>
  );
}

import React, { useEffect, useState } from "react";

import { refreshCryptoKeys, getRequestMeta, ResponseMetaType, cryptoDecode } from "../../utils/persistedCrypto";

import Copy from "../../components/Copy";

import Base from "../_layout";
import { ProgressContext } from "../_contexts"
import { ProgressFlags } from "./_interfaces"

import Step1 from "./Step1";
import Step2 from "./Step2";

import styled from "@emotion/styled";

const Container = styled.div`
  padding-top: 0.1px;

  .request {
    margin-top: 40vh;
    transition: margin-top 1s ease;
  }

  &.url-copied .request {
    margin-top: 25vh;

    @media screen and (max-width: 1000px) {
      margin-top: 15vh;
    }

    @media screen and (max-height: 500px) {
      margin-top: 0vh;
    }
  }

  .response {
    opacity: 0;
    margin-top: 50px;
    margin-bottom: 20vh;

    @media screen and (max-height: 500px) {
      margin-top: 20px;
    }
  }

  &.url-copied .response {
    opacity: 1;
  }
`;

export default function Main() {
  const [encodedMessage, setEncodedMessage] = useState("");
  const [decodedMessage, setDecodedMessage] = useState("");

  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [isEncodedMessagePasted, setIsEncodedMessagePasted] = useState(false);
  const [isEncodedMessageDecoded, setIsEncodedMessageDecoded] = useState(false);
  const [isDecodedMessageCopied, setIsDecodedMessageCopied] = useState(false);
  const [hasKeyMismatched, setHasKeyMismatched] = useState(false);
  const [hasDecodingErred, setHasDecodingErred] = useState(false);

  const progressFlags: ProgressFlags = {
    isUrlCopied: isUrlCopied,
    isEncodedMessagePasted: isEncodedMessagePasted,
    isEncodedMessageDecoded: isEncodedMessageDecoded,
    isDecodedMessageCopied: isDecodedMessageCopied,
    hasKeyMismatched: hasKeyMismatched,
    hasDecodingErred: hasDecodingErred
  };

  const host = window.origin;
  const branch = "/s/";
  const params = btoa(JSON.stringify(getRequestMeta()));
  const url = `${host}${branch}${params}`;

  const handleUrlClicked = () => {
    Copy(url);

    setIsUrlCopied(true);
  };

  const handleEncodedMessagePasted = (m: string) => {
    setIsEncodedMessagePasted(false);
    setIsEncodedMessageDecoded(false);
    setIsDecodedMessageCopied(false);
    setHasKeyMismatched(false);
    setHasDecodingErred(false);

    setEncodedMessage("");
    setDecodedMessage("");

    const host = window.origin;
    const branch = "/";

    let encodedParams = m;
    encodedParams = encodedParams.replace(host, "");
    encodedParams = encodedParams.replace(branch, "");

    if (!encodedParams) return false;

    setIsUrlCopied(true); // This should already be true, unless we are loading the response URL. Setting it true here explicitly just to be sure

    try {
      const decodedParams = JSON.parse(atob(encodedParams)) as ResponseMetaType;

      if (getRequestMeta().requestKey !== decodedParams.requestKey) {
        setEncodedMessage(m);
        setHasKeyMismatched(true);
        return false;
      }

      setEncodedMessage(decodedParams.message);

      const message = cryptoDecode(decodedParams);

      if (message) {
        setIsEncodedMessagePasted(true);
        setIsEncodedMessageDecoded(true);
        setDecodedMessage(message);
        return true;  
      }
      else {
        setEncodedMessage("");
        return false; // It was technically a valid message. However, since we don't allow blank messages to be sent, getting a blank message means something must have went wrong. Not setting an error code, but also not returning as a success
      }
    } catch {
      setEncodedMessage(m);
      setHasDecodingErred(true);
      return false;
    }
  };

  const handleDecodedMessageClicked = () => {
    Copy(decodedMessage);

    setIsDecodedMessageCopied(true);
    setDecodedMessage("");
  };

  const handleReset = () => {
    setEncodedMessage("");
    setDecodedMessage("");

    setIsUrlCopied(true); // Since we are resetting to decrypt another message using the same keys, we don't have to go back to step 1
    setIsEncodedMessagePasted(false);
    setIsEncodedMessageDecoded(false);
    setIsDecodedMessageCopied(false);
    setHasKeyMismatched(false);
    setHasDecodingErred(false);
  };

  useEffect(() => {
    handleEncodedMessagePasted(window.location.href); // Before anything, check the URL to see if it is a response URL
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshCryptoKeys, 1000 * 60); // We will keep the keys alive, one minute at a time, as long as the page is open
    return () => clearInterval(interval);
  });

  let classes = "";
  classes += isUrlCopied ? " url-copied" : "";
  classes += isEncodedMessagePasted ? " encoded-message-pasted" : "";
  classes += isEncodedMessageDecoded ? " encoded-message-decoded" : "";
  classes += isDecodedMessageCopied ? " decoded-message-copied" : "";
  classes += hasKeyMismatched ? " key-mismatched" : "";
  classes += hasDecodingErred ? " decoding-erred" : "";
  classes = classes.trim();

  return (
    <Base>
      <ProgressContext.Provider value={progressFlags}>
        <Container className={classes}>
          <Step1  url={url} 
                  onUrlClicked={handleUrlClicked} />
          <Step2  encodedMessage={encodedMessage} 
                  decodedMessage={decodedMessage} 
                  onEncodedMessagePasted={handleEncodedMessagePasted} 
                  onDecodedMessageClicked={handleDecodedMessageClicked} 
                  onReset={handleReset} />
        </Container>
      </ProgressContext.Provider>
    </Base>
  );
}

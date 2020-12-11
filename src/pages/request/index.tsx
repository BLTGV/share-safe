import React, { useEffect, useState } from "react";

import { refreshCryptoKeys, getRequestMeta, ResponseMetaType, cryptoDecode } from "../../libraries/PersistedCrypto";

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

  const [urlCopied, setUrlCopied] = useState(false);
  const [encodedMessagePasted, setEncodedMessagePasted] = useState(false);
  const [encodedMessageDecoded, setEncodedMessageDecoded] = useState(false);
  const [decodedMessageCopied, setDecodedMessageCopied] = useState(false);
  const [keyMismatched, setKeyMismatched] = useState(false);
  const [decodingErred, setDecodingErred] = useState(false);

  const progressFlags: ProgressFlags = {
    urlCopied: urlCopied,
    encodedMessagePasted: encodedMessagePasted,
    encodedMessageDecoded: encodedMessageDecoded,
    decodedMessageCopied: decodedMessageCopied,
    keyMismatched: keyMismatched,
    decodingErred: decodingErred
  };

  const host = window.origin;
  const branch = "/s/";
  const params = btoa(JSON.stringify(getRequestMeta()));
  const url = `${host}${branch}${params}`;

  const handleUrlClicked = () => {
    Copy(url);

    setUrlCopied(true);
  };

  const handleEncodedMessagePasted = (m: string) => {
    setEncodedMessagePasted(false);
    setEncodedMessageDecoded(false);
    setDecodedMessageCopied(false);
    setKeyMismatched(false);
    setDecodingErred(false);

    setEncodedMessage("");
    setDecodedMessage("");

    const host = window.origin;
    const branch = "/";

    let encodedParams = m;
    encodedParams = encodedParams.replace(host, "");
    encodedParams = encodedParams.replace(branch, "");

    if (!encodedParams) return false;

    setUrlCopied(true);

    try {
      const decodedParams = JSON.parse(atob(encodedParams)) as ResponseMetaType;

      if (getRequestMeta().requestKey !== decodedParams.requestKey) {
        setEncodedMessage(m);
        setKeyMismatched(true);
        return false;
      }

      setEncodedMessage(decodedParams.message);

      const message = cryptoDecode(decodedParams);

      if (message) {
        setEncodedMessagePasted(true);
        setEncodedMessageDecoded(true);
        setDecodedMessage(message);
        return true;  
      }
      else {
        setEncodedMessage("");
        return false;
      }
    } catch {
      setEncodedMessage(m);
      setDecodingErred(true);
      return false;
    }
  };

  const handleDecodedMessageClicked = () => {
    Copy(decodedMessage);

    setDecodedMessageCopied(true);
    setDecodedMessage("");
  };

  const handleReset = () => {
    setEncodedMessagePasted(false);
    setEncodedMessageDecoded(false);
    setDecodedMessageCopied(false);
    setDecodingErred(false);

    setEncodedMessage("");
    setDecodedMessage("");
  };

  useEffect(() => {
    handleEncodedMessagePasted(window.location.href);
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshCryptoKeys, 1000 * 60);
    return () => clearInterval(interval);
  });

  let classes = "";
  classes += urlCopied ? " url-copied" : "";
  classes += encodedMessagePasted ? " encoded-message-pasted" : "";
  classes += encodedMessageDecoded ? " encoded-message-decoded" : "";
  classes += decodedMessageCopied ? " decoded-message-copied" : "";
  classes += keyMismatched ? " key-mismatched" : "";
  classes += decodingErred ? " decoding-erred" : "";
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

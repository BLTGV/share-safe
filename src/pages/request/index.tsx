import React, { useEffect, useState } from "react";
import useCopy from "@react-hook/copy";

import { useUserMeta, SecretMeta, decode, ParamsMeta, useMetaCopy } from "../../util";
import { useParams } from "react-router-dom";

import Context from "./_context"
import Base from "../_layout";
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
  const { publicKey, secretKey } = useUserMeta();
  let meta: SecretMeta = { type: "request", recipientPubKey: publicKey };
  const { url, encodedMeta, copy, copied } = useMetaCopy(meta);
  const isYours = publicKey === meta.recipientPubKey;

  const { meta: metaEncoded } = useParams<ParamsMeta>();

  if(metaEncoded) {
    meta = decode(metaEncoded);
  }

  const [urlCopied, setUrlCopied] = useState(false);
  const [encodedMessagePasted, setEncodedMessagePasted] = useState(false);
  const [encodedMessageDecoded, setEncodedMessageDecoded] = useState(false);
  const [decodedMessageCopied, setDecodedMessageCopied] = useState(false);

  const [encodedMessage, setEncodedMessage] = useState("");
  const [decodedMessage, setDecodedMessage] = useState("");

  const progressFlags = {
    urlCopied: urlCopied,
    encodedMessagePasted: encodedMessagePasted,
    encodedMessageDecoded: encodedMessageDecoded,
    decodedMessageCopied: decodedMessageCopied
  };

  const focusOnResponseTextarea = () => {
    // this should be done using useRef()
    // doing it this way for now because of TypeScript
    document.getElementById("response-input")?.focus();
  };

  const handleUrlClicked = () => {
    copy();

    setUrlCopied(true);

    focusOnResponseTextarea();
  };

  const handleEncodedMessagePasted = (m: string) => {
    setEncodedMessagePasted(true);
    setEncodedMessageDecoded(false);
    setDecodedMessageCopied(false);

    setEncodedMessage(m);
    setDecodedMessage("");

    // decode the message

    setEncodedMessageDecoded(true);
    setDecodedMessage("Why won't you love me?");
    return true;

    // return false if failed to decode
  };

  const handleDecodedMessageClicked = () => {
    // copy decodedMessage to clipboard

    setDecodedMessageCopied(true);
    setDecodedMessage("");
  };

  const handleReset = () => {
    setEncodedMessagePasted(false);
    setEncodedMessageDecoded(false);
    setDecodedMessageCopied(false);

    setEncodedMessage("");
    setDecodedMessage("");

    focusOnResponseTextarea();
  };

  let classes = "";
  classes += urlCopied ? " url-copied" : "";
  classes += encodedMessagePasted ? " encoded-message-pasted" : "";
  classes += encodedMessageDecoded ? " encoded-message-decoded" : "";
  classes += decodedMessageCopied ? " decoded-message-copied" : "";
  classes = classes.trim();

  return (
    <Base>
      <Context.Provider value={progressFlags}>
        <Container className={classes}>
          <Step1  url={url} 
                  onUrlClicked={handleUrlClicked} />
          <Step2  encodedMessage={encodedMessage} 
                  decodedMessage={decodedMessage} 
                  onEncodedMessagePasted={handleEncodedMessagePasted} 
                  onDecodedMessageClicked={handleDecodedMessageClicked} 
                  onReset={handleReset} />
        </Container>
      </Context.Provider>
    </Base>
  );
}

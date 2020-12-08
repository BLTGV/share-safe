import React, { useState } from "react";

// import useCopy from "@react-hook/copy";
// import { useUserMeta, SecretMeta, decode, ParamsMeta, useMetaCopy } from "../../util";
// import { useParams } from "react-router-dom";

import Copy from "../../components/Copy";

import Context from "./_contexts";
import Base from "../_layout";
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

  const progressFlags: ProgressFlags = {
    urlCopied: urlCopied,
    encodedMessagePasted: encodedMessagePasted,
    encodedMessageDecoded: encodedMessageDecoded,
    decodedMessageCopied: decodedMessageCopied
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

  const handleUrlClicked = () => {
    Copy(url);

    setUrlCopied(true);
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
    Copy(decodedMessage);

    setDecodedMessageCopied(true);
    setDecodedMessage("");
  };

  const handleReset = () => {
    setEncodedMessagePasted(false);
    setEncodedMessageDecoded(false);
    setDecodedMessageCopied(false);

    setEncodedMessage("");
    setDecodedMessage("");
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

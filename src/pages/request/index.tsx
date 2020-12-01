import React, { useEffect, useState } from "react";

import { useUserMeta, SecretMeta, decode, ParamsMeta, useMetaCopy } from "../../util";
import { useParams } from "react-router-dom";

import Base from "../_layout";
import Step1 from "./Step1";
import Step2 from "./Step2";

import styled from "@emotion/styled";

const Container = styled.div`
  &.url-copied {
    .response {
      opacity: 1;
    }
  }

  .response {
    opacity: 0;
    transition: all 0.5s ease;
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

  const handleUrlCopy = () => {
    copy();

    setUrlCopied(true);
  };

  const handleMessageCopy = () => {
    copy();
  };

  let classes = "";
  classes += urlCopied ? " url-copied" : "";
  classes = classes.trim();

  return (
    <Base>
      <Container className={classes}>
        <Step1 url={url} onUrlClicked={handleUrlCopy} />
        <Step2 onEncodedMessagePasted={() => { return true; }} decodedMessage="Why won't you love me?" onDecodedMessageClicked={handleMessageCopy} />
      </Container>
    </Base>
  );
}

import React, { useEffect, useState } from "react";
import ClickTap from "./ClickTap";
import "./Request.scss";
import { useUserMeta, SecretMeta, decode, ParamsMeta, useMetaCopy } from "../util";
import { useParams } from "react-router-dom";

export default function Request() {
  const { publicKey, secretKey } = useUserMeta();
  let meta: SecretMeta = { type: "request", recipientPubKey: publicKey };
  const { url, encodedMeta, copy, copied } = useMetaCopy(meta);
  const isYours = publicKey === meta.recipientPubKey;

  const { meta: metaEncoded } = useParams<ParamsMeta>();

  if(metaEncoded) {
    meta = decode(metaEncoded);
  }


  return (
    <div className="container">
      <div className={copied ? "step request copied" : "step request"} onClick={copy}> {/* optional class copied*/}
        <div className="fadeable">
          <h1>
            <b>Step 1:</b> Send this link to the secret holder
          </h1>
          <div className="url">{url}</div>
          <div className="tip">
            <b><ClickTap /></b> to copy the link to your clipboard
          </div>
        </div>
        <div className="confirmation link-copied">
          ✓ Link copied to your clipboard
        </div>
      </div>
      <div className="step response">
        <h1>
          <b>Step 2:</b> Send this link to the secret holder
        </h1>
        <textarea id="sender_response"></textarea>
        <div className="secret">
          <div className="confirmation decoded">
            ✓ Response pasted and decoded
          </div>
          <div className="confirmation message-copied">
            ✓ Message copied to your clipboard
          </div>
          <div className="reset">
            Got another response to decode?{" "}
            <span>
              <b>Click</b> here
            </span>
          </div>
          <div className="decoded">
            <div className="message">Hello World!</div>
            <div className="tip">
              <b>Click</b> to copy the message to your clipboard. Make sure you
              keep it somewhere safe. Once you copy it to your clipboard, the
              message will be erased
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

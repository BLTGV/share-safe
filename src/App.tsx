import React, { useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useParams,
} from "react-router-dom";
import createPersistedState from "use-persisted-state";
import { encryptSecret, decryptSecret, generateKeyPair } from "./crypto";
import "./App.scss";
import useCopy from "@react-hook/copy";
import { join, pipe, splitEvery } from "ramda";

export interface UserMeta {
  publicKey: string;
  secretKey: string;
}

const newUserMeta = (): UserMeta => {
  const { publicKey, secretKey } = generateKeyPair();
  return {
    publicKey,
    secretKey,
  };
};

const initialUserMetaState = newUserMeta();
const useUserMetaState = createPersistedState("UserMeta");

export const useUserMeta = () => {
  const [userMeta] = useUserMetaState(initialUserMetaState);
  return userMeta;
};

type SecretMetaRequest = {
  type: "request";
  recipientPubKey: string;
};

type SecretMetaShare = {
  type: "share";
  recipientPubKey: string;
  senderPubKey: string;
  secret: string;
};

type SecretMeta = SecretMetaRequest | SecretMetaShare;

type ParamsMeta = { meta: string };

function encode(meta: SecretMeta) {
  return btoa(JSON.stringify(meta));
}

function decode(meta: string) {
  return JSON.parse(atob(meta)) as SecretMeta;
}

function Error() {
  return (
    <div>
      <h2>⛔ Something isn't right.</h2>
      <h4>
        Make sure you copied all the text properly or... maybe you should not be
        here.
      </h4>
    </div>
  );
}

const useMetaCopy = (meta: SecretMeta) => {
  const encodedMeta = encode(meta);
  const path = `/s/${encodedMeta}`;
  const url = `${window.origin}${path}`;
  return {
    ...useCopy(url),
    encodedMeta,
    path,
    url,
  };
};

function MetaTextArea({
  meta,
  cols = 40,
  rows = 6,
}: {
  meta: SecretMeta;
  cols?: number;
  rows?: number;
}) {
  const { encodedMeta, url, copy, copied } = useMetaCopy(meta);
  return (
    <div style={{ display: "inline-block" }}>
      <textarea value={encodedMeta} disabled cols={cols} rows={rows} />
      <button className="upper-right" onClick={copy}>
        copy
      </button>
    </div>
  );
}

function Share({ meta }: { meta: SecretMetaRequest }) {
  const { publicKey, secretKey } = useUserMeta();
  const [message, setMessage] = useState<string>("");
  const [share, setShare] = useState<SecretMetaShare>({
    type: "share",
    recipientPubKey: meta.recipientPubKey,
    senderPubKey: publicKey,
    secret: encryptSecret(message, secretKey, meta.recipientPubKey),
  });

  useEffect(() => {
    setShare((prev) => ({
      ...prev,
      secret: encryptSecret(message, secretKey, meta.recipientPubKey),
    }));
  }, [message, secretKey, meta.recipientPubKey]);

  return (
    <>
      <div>
        <p>1. ✅</p>
        <p>2a. Time to share your secret! Copy or type your secret below.</p>
        <textarea
          placeholder="Input Secret Here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          cols={40}
          rows={10}
        />
      </div>
      <div>
        <p>
          2b. Then click copy below and give it back to the same person who gave you the link in step
          1.
        </p>
        <MetaTextArea meta={share} cols={40} rows={12} />
      </div>
    </>
  );
}
function Receive({ meta }: { meta: SecretMetaShare }) {
  const { publicKey, secretKey } = useUserMeta();
  const isYours = publicKey === meta.recipientPubKey;
  return (
    <div>
      <p>1. ✅</p>
      <p>2. ✅</p>
      {!isYours ? (
        <>
          <h2>⛔ Keys don't match.</h2>
          <h4>Make sure you use the same browser or it's not for you.</h4>
        </>
      ) : (
        <>
          <p>
            3. 🏁 Here's your secret. Make sure to store it in a safe place.
          </p>
          <textarea
            disabled
            value={decryptSecret(meta.secret, secretKey, meta.senderPubKey)}
            cols={40}
            rows={10}
          />
        </>
      )}
    </div>
  );
}

function Secret() {
  const { meta: metaEncoded } = useParams<ParamsMeta>();
  let meta: SecretMeta;

  try {
    meta = decode(metaEncoded);
  } catch (error) {
    return <Error />;
  }

  return meta.type === "request" ? (
    <Share meta={meta as SecretMetaRequest} />
  ) : (
    <Receive meta={meta as SecretMetaShare} />
  );
}

function App() {
  const { publicKey } = useUserMeta();
  const meta: SecretMeta = { type: "request", recipientPubKey: publicKey };

  return (
    <Router>
      <div className="container">
        <h2>
          <code>&gt;share secret_</code>
        </h2>
        <h3>
          <code>Share sensitive information securely in 3 easy steps.</code>
        </h3>
        <Switch>
          <Route path="/s/:meta">
            <Secret />
          </Route>
          <Route path="/">
            <p>
              1. <b>The recipient starts here.</b> Copy and send the text below
              to the secret holder. If it shows up as a link, they should click
              it. If not, then they need to copy it into the url of their
              browser. Don't worry. It's safe.
            </p>
            <MetaTextArea meta={meta} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

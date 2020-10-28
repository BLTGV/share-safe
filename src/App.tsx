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

type MetaRequest = {
  type: "request";
  recipientPubKey: string;
};

type MetaShare = {
  type: "share";
  recipientPubKey: string;
  senderPubKey: string;
  secret: string;
};

type Meta = MetaRequest | MetaShare;

type Params = { meta: string };

function encode(meta: Meta) {
  return btoa(JSON.stringify(meta));
}

function decode(meta: string) {
  return JSON.parse(atob(meta)) as Meta;
}

function Error() {
  return null;
}

const useMetaCopy = (meta: Meta) => {
  const encodedMeta = encode(meta);
  const url = `${window.origin}/s/${encodedMeta}`;
  return {
    ...useCopy(url),
    encodedMeta,
    url,
  };
};

function Share({ meta }: { meta: MetaRequest }) {
  const { publicKey, secretKey } = useUserMeta();
  const [message, setMessage] = useState<string>("");
  const [share, setShare] = useState<MetaShare>({
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
        <textarea
          placeholder="Input Secret Here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div>
        <h2>{encode(share)}</h2>
      </div>
    </>
  );
}
function Receive({ meta }: { meta: MetaShare }) {
  const { publicKey, secretKey } = useUserMeta();
  const isYours = publicKey === meta.recipientPubKey;
  return !isYours ? (
    <div>
      <h2>
        Keys don't match. Make sure you use the same browser or it's not for
        you.
      </h2>
    </div>
  ) : (
    <div>
      <textarea
        disabled
        value={decryptSecret(meta.secret, secretKey, meta.senderPubKey)}
      />
    </div>
  );
}

function Secret() {
  const { meta: metaEncoded } = useParams<Params>();
  let meta: Meta;

  try {
    meta = decode(metaEncoded);
  } catch (error) {
    return <Error />;
  }

  return meta.type === "request" ? (
    <Share meta={meta as MetaRequest} />
  ) : (
    <Receive meta={meta as MetaShare} />
  );
}

function App() {
  const { publicKey } = useUserMeta();
  const meta: Meta = { type: "request", recipientPubKey: publicKey };
  const { copy } = useMetaCopy(meta);

  return (
    <Router>
      <Switch>
        <Route path="/s/:meta">
          <Secret />
        </Route>
        <Route path="/">
          <button onClick={copy}>Copy request to clipboard</button>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

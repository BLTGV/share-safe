import createPersistedState from "use-persisted-state";
import { generateKeyPair } from "./crypto";
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

export type SecretMetaRequest = {
  type: "request";
  recipientPubKey: string;
};

export type SecretMetaShare = {
  type: "share";
  recipientPubKey: string;
  senderPubKey: string;
  secret: string;
};

export type SecretMeta = SecretMetaRequest | SecretMetaShare;

export type ParamsMeta = { meta: string };

export function encode(meta: SecretMeta) {
  return btoa(JSON.stringify(meta));
}

export function decode(meta: string) {
  return JSON.parse(atob(meta)) as SecretMeta;
}

export const useMetaCopy = (meta: SecretMeta) => {
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
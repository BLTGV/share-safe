import { encryptSecret, decryptSecret, generateKeyPair } from "./Crypto";

const getCryptoKeys = () => {
  const storageID = "Crypto Keys";

  let meta = null;

  if (localStorage.getItem(storageID)) {
    meta = JSON.parse(localStorage.getItem(storageID) as string);

    if (meta.time < (Date.now() - 1000 * 60 * 60))
      meta = null;
    else
      meta.time = Date.now();
  }

  if (meta === null) {
    const { publicKey, secretKey } = generateKeyPair();
    
    meta = {
      keys: {
        public: publicKey,
        private: secretKey
      },
      time: Date.now()
    }
  }

  localStorage.setItem(storageID, JSON.stringify(meta));

  return meta.keys;
}

export interface RequestMetaType {
  message: string,
  requestKey: string
}

export const getRequestMeta = (): RequestMetaType => {
  return {
    message: "",
    requestKey: getCryptoKeys().public
  }
}

export const cryptoEncode = (params: RequestMetaType) => {
  const responseKeys = getCryptoKeys();

  return encryptSecret(params.message, responseKeys.private, params.requestKey);
}

export interface ResponseMetaType {
  message: string,
  requestKey: string,
  responseKey: string
}

export const getResponseMeta = (): ResponseMetaType => {
  return {
    message: "",
    requestKey: "",
    responseKey: getCryptoKeys().public
  }
}

export const cryptoDecode = (params: ResponseMetaType) => {
  const requestKeys = getCryptoKeys();

  if (params.requestKey !== requestKeys.public)
    return null; // we did not request this message. The key the responder used might have expired

  return decryptSecret(params.message, requestKeys.private, params.responseKey);
}
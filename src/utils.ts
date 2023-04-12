import { CONTRACT_ADDRESS, TEST_NETWORK } from "./constants";

export const generateFileNameFromTokenID = (file: File, tokenId: string) => {
  return `${tokenId}.${file.type.split("/")[1]}`;
};

export const toBoolean = (exp: string) => {
  if (exp.toLowerCase() === "true") {
    return true;
  } else return false;
};

export const generateOpenseaUrl = (tokenId) => {
  if (TEST_NETWORK) {
    return `https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${tokenId}`;
  } else
    return `https://opensea.io/assets/matic/${CONTRACT_ADDRESS}/${tokenId}`;
};

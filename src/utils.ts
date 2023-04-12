export const generateFileNameFromTokenID = (file: File, tokenId: string) => {
  return `${tokenId}.${file.type.split("/")[1]}`;
};

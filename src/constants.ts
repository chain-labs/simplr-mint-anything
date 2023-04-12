import { toBoolean } from "./utils";

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const AWS_ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
export const AWS_SECRET_ACCESS = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

export const TEST_NETWORK = toBoolean(process.env.NEXT_PUBLIC_TEST_NETWORK);
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const AWS_REGION = "ap-south-1";
export const S3_BUCKET_NAME_METADATA = "metadata-nft";
export const S3_BUCKET_NAME_MEDIA = "media-nft";
export const METADATA_BUCKET_URL =
  "https://metadata-nft.s3.ap-south-1.amazonaws.com/";
export const MEDIA_BUCKET_URL =
  "https://media-nft.s3.ap-south-1.amazonaws.com/";

export const NO_OF_TOKENS = 1;

export const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_buyer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_quantity",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export const BUTTON_TEXT = {
  INITIAL: "Mint",
  UPLOADING: "Uploading Media",
  METAMASK: "Approve Transaction",
  PENDING: "Transaction Pending",
};

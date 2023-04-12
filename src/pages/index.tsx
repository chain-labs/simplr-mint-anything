import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState, Fragment } from "react";

import fs from "fs";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const inter = Inter({ subsets: ["latin"] });

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import {
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_SECRET_ACCESS,
  MEDIA_BUCKET_URL,
  S3_BUCKET_NAME_MEDIA,
  S3_BUCKET_NAME_METADATA,
} from "@/constants";
import { generateFileNameFromTokenID } from "@/utils";

const FILE_TYPES = {
  IMAGE: 0,
  VIDEO: 1,
  MUSIC: 2,
};

const S3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS,
  },
});

export default function Home() {
  const [user, setUser] = useState({ address: "", connected: false });
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const [userWallet, setUserWallet] = useState("");
  const [nftName, setNftName] = useState("");
  const [nftDesc, setNftDesc] = useState("");
  const [file, setFile] = useState<File>(null);
  const [fileType, setFileType] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [isMintDisabled, setIsMintDisabled] = useState(false);

  const [progressUpload, setProgressUpload] = useState(0);

  const uploadToS3 = async (file: File, fileName: string, Bucket) => {
    if (!file) {
      return;
    }

    const command = new PutObjectCommand({
      Bucket,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    });

    try {
      await S3.send(command);
    } catch (err) {
      console.log({ err });
    }
  };

  const uploadJsonToS3 = async (body, fileName: string, Bucket) => {
    if (!file) {
      return;
    }

    const command = new PutObjectCommand({
      Bucket,
      Key: fileName,
      Body: Buffer.from(JSON.stringify(body)),
      ContentEncoding: "base64",
      ContentType: "application/json",
    });

    try {
      await S3.send(command);
    } catch (err) {
      console.log({ err });
    }
  };

  const connectWallet = () => {
    openConnectModal();
  };

  useEffect(() => {}, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log({ file });
    const type = file.type.split("/")[0];
    if (type === "image") {
      setFileType(FILE_TYPES.IMAGE);
      setPreviewImage(file);
      setIsMintDisabled(false);
    } else if (type === "video") {
      setFileType(FILE_TYPES.VIDEO);
    } else if (type === "audio") {
      setFileType(FILE_TYPES.MUSIC);
    } else {
      setFile(null);
      setFileType(0);
      e.target.value = null;
      return;
    }
    setFile(file);
  };

  const removeAllFiles = (e) => {
    e.preventDefault();
    setFile(null);
    setPreviewImage(null);
  };

  const removePreview = (e) => {
    e.preventDefault();
    setPreviewImage(null);
  };

  const showPreview = () => {
    switch (fileType) {
      case FILE_TYPES.IMAGE: {
        return (
          <div>
            <div className="avatar self-center">
              <div className="w-64">
                <Image
                  src={URL.createObjectURL(previewImage)}
                  alt="preview"
                  fill
                  className="rounded-md object-cover"
                />
              </div>
            </div>
            <div>
              <button
                className="btn btn-circle btn-sm"
                onClick={removeAllFiles}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      }
      case FILE_TYPES.VIDEO: {
        return (
          <div>
            <div className="h-48">
              <video
                controls
                className="object-contain w-full max-h-full"
                src={URL.createObjectURL(file)}
              ></video>
            </div>
            <div>
              <button
                className="btn btn-circle btn-sm"
                onClick={removeAllFiles}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex flex-col items-end mt-2">
              <div className="form-control w-full max-w-xs flex justify-center">
                <label className="label flex justify-center font-bold">
                  <span className="label-text text-center ">
                    Preview Image*
                  </span>
                </label>
                {!previewImage ? (
                  <Fragment>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setPreviewImage(file);
                      }}
                      max={1}
                      accept="image/*"
                      className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                    />
                    <label className="label">
                      <span className="label-text-alt">
                        Because you’ve included multimedia, you’ll need to
                        provide an image (PNG, JPG, or GIF) for the card display
                        of your item.
                      </span>
                    </label>
                  </Fragment>
                ) : (
                  <Fragment>
                    <div>
                      <div className="avatar self-center">
                        <div className="w-48 overflow-hidden">
                          <Image
                            src={URL.createObjectURL(previewImage)}
                            alt="preview"
                            fill
                            className="rounded-md object-contain"
                          />
                        </div>
                      </div>
                      <div>
                        <button
                          className="btn btn-circle btn-sm"
                          onClick={removePreview}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        );
      }
      case FILE_TYPES.MUSIC: {
        return (
          <div>
            <div className="h-max-64">
              <audio controls>
                <source src={URL.createObjectURL(file)}></source>
              </audio>
            </div>
            <div className="mt-2">
              <button
                className="btn btn-circle btn-sm"
                onClick={removeAllFiles}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex flex-col items-end mt-4">
              <div className="form-control w-full max-w-xs flex justify-center">
                <label className="label flex justify-center font-bold">
                  <span className="label-text text-center ">
                    Preview Image*
                  </span>
                </label>
                {!previewImage ? (
                  <Fragment>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setPreviewImage(file);
                      }}
                      max={1}
                      accept="image/*"
                      className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                    />
                    <label className="label">
                      <span className="label-text-alt">
                        Because you’ve included multimedia, you’ll need to
                        provide an image (PNG, JPG, or GIF) for the card display
                        of your item.
                      </span>
                    </label>
                  </Fragment>
                ) : (
                  <Fragment>
                    <div>
                      <div className="avatar self-center">
                        <div className="w-64 overflow-hidden">
                          <Image
                            src={URL.createObjectURL(previewImage)}
                            alt="preview"
                            fill
                            className="rounded-md"
                          />
                        </div>
                      </div>
                      <div>
                        <button
                          className="btn btn-circle btn-sm"
                          onClick={removePreview}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        );
      }
    }
  };

  const handleMint = async (e) => {
    if (!file) {
      return;
    }

    const tokenId = "1";

    const mediaFileName = generateFileNameFromTokenID(file, tokenId);
    const previewFileName = generateFileNameFromTokenID(previewImage, tokenId);

    await uploadToS3(file, mediaFileName, S3_BUCKET_NAME_MEDIA);
    if (fileType !== FILE_TYPES.IMAGE) {
      await uploadToS3(previewImage, previewFileName, S3_BUCKET_NAME_MEDIA);
    }

    const metadataBody = {
      description: nftDesc,
      name: nftName,
      external_url: "https://simplrhq.com",
      image: `${MEDIA_BUCKET_URL}${previewFileName}`,
    };
    if (fileType !== FILE_TYPES.IMAGE) {
      metadataBody["animation_url"] = `${MEDIA_BUCKET_URL}${mediaFileName}`;
    }

    const metadataFile = new File(
      [JSON.stringify(metadataBody)],
      `${tokenId}.json`
    );

    console.log({ metadataBody, metadataFile });

    await uploadJsonToS3(
      metadataBody,
      `${tokenId}.json`,
      S3_BUCKET_NAME_METADATA
    );

    console.log({ complete: "complete" });
  };

  return (
    <main className="flex min-h-screen  flex-col">
      {/* ==========Navbar========== */}
      <div className="navbar bg-base-100 fixed">
        <a className="btn btn-ghost normal-case text-xl">Simplr</a>
      </div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          {!isConnected ? (
            <div className="max-w-md">
              <h1 className="text-5xl font-bold py-6">Mint Anything</h1>
              <button
                className="btn btn-primary"
                onClick={() => connectWallet()}
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="w-[1000px] flex flex-col">
              <h1 className="text-5xl font-bold py-6">Mint Anything</h1>
              <div className="form-control w-full max-w-md self-center mb-10">
                <label className="label font-bold">
                  <span className="label-text">Wallet Addresss *</span>
                </label>
                <input
                  type="text"
                  value={userWallet}
                  onChange={(e) => setUserWallet(e.target.value)}
                  placeholder="Type here"
                  className="input input-bordered input-secondary w-full max-w-lg"
                />
              </div>
              <div className="flex flex-row px-20 justify-evenly">
                <div className="flex-1 flex flex-col items-end">
                  <div className="form-control w-full max-w-xs flex justify-center">
                    <label className="label flex justify-center font-bold">
                      <span className="label-text text-center ">
                        Image, Video or Audio *
                      </span>
                    </label>
                    {!file ? (
                      <Fragment>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          accept=""
                          className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                        />
                        <label className="label">
                          <span className="label-text-alt">
                            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM,
                            MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB
                          </span>
                        </label>
                      </Fragment>
                    ) : (
                      <Fragment>{showPreview()}</Fragment>
                    )}
                  </div>
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div className="flex-1">
                  <div className="form-control w-full max-w-md mb-4">
                    <label className="label font-bold">
                      <span className="label-text">Name *</span>
                    </label>
                    <input
                      type="text"
                      value={nftName}
                      onChange={(e) => setNftName(e.target.value)}
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-md"
                    />
                  </div>
                  <div className="form-control w-full max-w-md">
                    <label className="label font-bold">
                      <span className="label-text">Description *</span>
                    </label>
                    <textarea
                      value={nftDesc}
                      onChange={(e) => setNftDesc(e.target.value)}
                      className="textarea textarea-bordered h-36"
                      placeholder="About the art"
                    ></textarea>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-primary mt-8 w-2/5 self-center"
                disabled={isMintDisabled}
                onClick={handleMint}
              >
                Mint
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

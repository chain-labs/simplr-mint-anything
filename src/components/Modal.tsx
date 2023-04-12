import React from "react";

const SuccessModal = ({ setShowModal, openseaUrl }) => {
  return (
    <div className="modal-open">
      <div className="modal-box relative">
        <label
          htmlFor="my-modal-3"
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={() => setShowModal(false)}
        >
          ✕
        </label>
        <h3 className="text-lg font-bold">Congratulations on your NFT!</h3>
        <p className="py-4">
          You are now the owner of your media as an NFT. Click on the button
          below to view your token on Opensea!
        </p>
        <a href={openseaUrl} target="_blank">
          <div
            className="btn btn-outline btn-info mt-2"
            onClick={() => setShowModal(false)}
          >
            View on Opensea
          </div>
        </a>
      </div>
    </div>
  );
};

export default SuccessModal;

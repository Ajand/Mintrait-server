import { exec } from "child_process";
import mongoose from "mongoose";
const { Schema } = mongoose;

const NFTsSchema = new Schema({
  collectionId: mongoose.Types.ObjectId,
  json: String,
  contractAddress: String,
});

const NFT = mongoose.model("NFT", NFTsSchema);

const getCollectionTokens = async (collectionId) => {
  const nfts = await NFT.find({ collectionId });
  return nfts;
};

const addToken = async (collectionId, json) => {
  const nft = new NFT({
    collectionId: new mongoose.Types.ObjectId(collectionId),
    json,
  });
  return await nft.save();
};

const mintToken = async (_id) => {
  //
};

export { addToken, getCollectionTokens, NFT };

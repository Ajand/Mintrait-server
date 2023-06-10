import { exec } from "child_process";
import mongoose from "mongoose";
const { Schema } = mongoose;
import path from "path";
import fs from "fs";
import { getUser } from "./Users.js";
import { NFT } from "./Tokens.js";

const CollectionSchema = new Schema({
  name: String,
  variant: String,
  description: String,
  contractAddress: String,
  logo: String,
  cover: String,
  symbol: String,
  royalty: Number,
  creator: mongoose.Types.ObjectId,
});

const Collection = mongoose.model("Collection", CollectionSchema);

const createCollection = async (
  creator,
  { name, description, symbol, royalty }
) => {
  const collection = new Collection({
    name,
    description,
    symbol,
    royalty,
    creator,
  });
  return await collection.save();
};

const getUserCollections = async (id) => {
  return await Collection.find({ creator: id });
};

const getCollection = async (_id) => {
  return await Collection.findOne({ _id });
};

//run -s ./scripts/1-deploy-collection.ts -n local

const getCollectionAddress = (msg) => {
  return msg.substring(msg.length - 67, msg.length);
};

const mkdir = () => {
  const directory = path.join("src", "nft-deployer", "deploy-conf");
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
};

const deployCollection = async (id) => {
  mkdir();
  const fileName = Math.floor(Math.random() * 100000000000000);

  const filePath = path.join(
    "src",
    "nft-deployer",
    "deploy-conf",
    `${fileName}.json`
  );

  return new Promise(async (resolve, reject) => {
    const collection = await getCollection(id);
    const user = await getUser(collection.creator);
    const params = {
      royaltyPercent: collection.royalty,
      creatorAddress: user.address,
      json: {
        name: collection.name,
        description: collection.description,
        symbol: collection.symbol,
      },
    };

    const paramsJson = JSON.stringify(params);

    // Write the JSON string to the file
    fs.writeFileSync(filePath, paramsJson);

    exec(
      `cd src/nft-deployer &&  npx locklift run -s ./scripts/1-deploy-collection.ts -n venom_devnet ${fileName}`,
      async (error, stdout, stderr) => {
        if (error) {
          console.log("error: ", error);
          return reject(error);
        }
        if (stderr) {
          console.log("stderr: ", stderr);

          return reject(stderr);
        }
        console.log("stdout: ", stdout);
        const contractAddress = getCollectionAddress(stdout);
        await Collection.updateOne({ _id: id }, { $set: { contractAddress } });
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("file removed");
        });
        return resolve(stdout);
      }
    );
  });
};

const startMinting = async (id) => {
  console.log("herere/???");
  try {
    const collection = await getCollection(id);
    const user = await getUser(collection.creator);

    const nfts = await NFT.find({
      collectionId: new mongoose.Types.ObjectId(id),
    });

    nfts
      .filter((token) => !token.contractAddress)
      .forEach((nft) => {
        mintToken(collection, nft, user);
      });
  } catch (err) {
    throw err;
  }
};

const mintToken = async (collection, nft, creator) => {
  mkdir();
  const fileName = Math.floor(Math.random() * 100000000000000);

  const filePath = path.join(
    "src",
    "nft-deployer",
    "deploy-conf",
    `${fileName}.json`
  );

  const params = {
    collectionAddress: collection.contractAddress.replace(/\n/g, ""),
    creatorAddress: creator.address,
    json: nft.json,
  };

  const paramsJson = JSON.stringify(params);

  // Write the JSON string to the file
  fs.writeFileSync(filePath, paramsJson);
  return new Promise(async (resolve, reject) => {
    exec(
      `cd src/nft-deployer && npx locklift run -s ./scripts/2-call-mintNft.ts -n venom_devnet ${fileName}`,
      async (error, stdout, stderr) => {
        if (error) {
          console.log("error: ", error);
          return reject(error);
        }
        if (stderr) {
          console.log("stderr: ", stderr);

          return reject(stderr);
        }
        console.log("stdout: ", stdout);
        const contractAddress = getCollectionAddress(stdout);
        await NFT.updateOne({ _id: nft.id }, { $set: { contractAddress } });
        //fs.unlink(filePath, (err) => {
        //  if (err) {
        //    console.log(err);
        //    return;
        //  }
        //  console.log("file removed");
        //});
        return resolve(stdout);
      }
    );
  });
};

export {
  deployCollection,
  createCollection,
  getUserCollections,
  getCollection,
  startMinting,
};

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import getProvider from "../provider.js";
const { Schema } = mongoose;

const UserSchema = new Schema({
  displayName: String,
  address: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  bio: String,
  avatar: String,
  nonce: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

const getMessage = (nonce) =>
  `Mintrait works offchain, but we need a sign from you as a security proof of owning this wallet. Nonce is: ${nonce}`;

const generateNonce = ({ address, publicKey }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ address, publicKey });
      const nonce = Math.floor(Math.random() * 1000000);
      if (user) {
        await User.updateOne({ _id: user._id }, { $set: { nonce } });
        return resolve(getMessage(nonce));
      } else {
        const usr = new User({ address, publicKey, nonce });
        await usr.save();
        return resolve(getMessage(nonce));
      }
    } catch (err) {
      return reject(err);
    }
  });
};

// TODO: Change this asap
const JWT_SECRET = "somesimpleteststringforsecretthatwillbechanged";

const getJSONWebToken = async ({ signature, dataHash, publicKey }) => {
  const provider = await getProvider();

  try {
    const user = await User.findOne({ publicKey });
    if (!user) {
      throw new Error("No user found with this public key!");
    }

    const { isValid } = await provider.verifySignature({
      publicKey,
      signature,
      dataHash,
    });

    if (isValid) {
      const token = jwt.sign({ _id: user }, JWT_SECRET);
      return token;
    } else {
      throw new Error("Don't match");
    }
  } catch (err) {
    throw err;
  }

  return "hi";
  //
};

const getUser = async (id) => {
  return await User.findOne(id);
};

const completeProfile = async (id, { avatar, displayName, bio }) => {
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new Error("No user found!");
    }
    await User.updateOne({ _id: id }, { $set: { avatar, displayName, bio } });
    return await User.findOne({ _id: id });
  } catch (err) {
    throw err;
  }
};

export { generateNonce, getJSONWebToken, getUser, completeProfile };

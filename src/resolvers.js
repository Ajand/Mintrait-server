import {
  generateNonce,
  getJSONWebToken,
  getUser,
  completeProfile,
} from "./models/Users.js";
import {
  deployCollection,
  createCollection,
  getUserCollections,
  getCollection,
  startMinting,
} from "./models/Collections.js";
import { createTrait, getCollectionTraits } from "./models/Traits.js";
import { addToken, getCollectionTokens } from "./models/Tokens.js";

const mapUserWithCollections = (user) => {
  return {
    ...user._doc,
    collections: getUserCollections(user._id),
  };
};

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      const user = await getUser(id);
      const userWithCollections = await mapUserWithCollections(user);
      return userWithCollections;
    },

    me: async (_, {}, { userId }) => {
      const user = await getUser(userId);
      if (!user) return null;
      const userWithCollections = await mapUserWithCollections(user);
      return userWithCollections;
    },

    collection: async (_, { _id }) => {
      const collection = await getCollection(_id);
      const creator = await getUser(collection.creator);
      const traits = await getCollectionTraits(_id);
      const tokens = await getCollectionTokens(_id);
      return {
        ...collection._doc,
        creator,
        traits,
        tokens,
      };
    },
  },

  Mutation: {
    getNonce: (_, { address, publicKey }) => {
      return generateNonce({ address, publicKey });
    },
    getJwt: (_, { signature, dataHash, publicKey }) => {
      return getJSONWebToken({ signature, dataHash, publicKey });
    },
    completeProfile: (_, { displayName, bio, avatar }, { userId }) => {
      return completeProfile(userId, { displayName, bio, avatar });
    },

    createCollection: (
      _,
      { name, description, symbol, royalty },
      { userId }
    ) => {
      return createCollection(userId, { name, description, symbol, royalty });
    },

    deployCollection: (_, { id }) => {
      return deployCollection(id);
    },

    addTrait: (_, { collectionId, traitName, variant }) => {
      return createTrait(collectionId, { name: traitName, variant });
    },

    addToken: (_, { collectionId, json }) => {
      return addToken(collectionId, json);
    },

    startMinting: (_, { id }) => {
      startMinting(id);
      return "done";
    },
  },
};

export default resolvers;

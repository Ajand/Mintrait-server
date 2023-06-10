import {
  generateNonce,
  getJSONWebToken,
  getUser,
  completeProfile,
} from "./models/Users.js";
import { deployCollection } from "./models/Collections.js";

const resolvers = {
  Query: {
    user: (_, { id }) => {
      return getUser(id);
    },

    me: (_, {}, { userId }) => {
      return getUser(userId);
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

    deployCollection: () => {
      return deployCollection();
    },
  },
};

export default resolvers;

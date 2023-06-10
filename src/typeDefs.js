const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.

  type User {
    _id: ID!
    displayName: String
    address: String!
    publicKey: String!
    bio: String
    avatar: String
    collections: [Collection!]!
  }
  

  type Collection {
    _id: ID!
    name: String
    variant: String
    description: String
    contractAddress: String
    logo: String
    cover: String
    symbol: String
    creator: User
    royalty: Float
    traits: [Trait!]!
    tokens: [Token!]!
  }


  type Token {
    _id: ID!
    json: String!
    contractAddress: String
  }

  type TraitValue {
    value: String
    amount: Int!
  }

  type Trait {
    _id: ID!
    name: String!
    variant: String!
    values: [TraitValue!]!
  }



  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    me: User
    user(id: String): User!
    collection(_id: ID!): Collection!
    token(id: ID!): Token!
  }

  type Mutation {
    createCollection(name: String!, description: String!, symbol: String!, royalty: Float!): Collection!
    editCollection(name: String!): Collection!
    updateCover(cover: String!): Collection!
    updateLogo(logo: String!): Collection!
    deployCollection(id: ID!): String!
    startMinting(id: ID!): String!

    completeProfile(displayName: String!, bio: String, avatar: String): User!
    getNonce(address: String!, publicKey: String!): String!
    getJwt(publicKey: String!, signature: String!, dataHash: String!): String!
    editProfile(displayName: String!): String!

    addTrait(collectionId: String!, traitName: String!, variant: String!): Trait!
    editTrait(id: ID!, traitName: String!, variant: String!): String!
    deleteTrait(id: ID!): String!

    addToken(collectionId: String!, json: String!): Token!
  }
`;

export default typeDefs;

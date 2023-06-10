const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.

  type User {
    id: ID!
    displayName: String
    address: String!
    publicKey: String!
    bio: String
    avatar: String
    collections: [Collection!]!
  }
  

  type Collection {
    id: ID!
    name: String!
    variant: String!
    description: String!
    contractAddress: String!
    logo: String!
    cover: String!
    symbol: String!
    creator: User!
  }


  type Token {
    id: ID!
    name: String
    description: String
    background_color: String
    external_url: String
    image: String
    animation_url: String
    youtube_url: String
    collection: Collection!
    attributes: [Trait!]!
  }

  type TraitValue {
    value: String
    amount: Int!
  }

  type Trait {
    id: ID!
    name: String!
    variant: String!
    values: [TraitValue!]!
  }



  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    me: User!
    user(id: String): User!
    collection(id: ID!): Collection!
    token(id: ID!): Token!
  }

  type Mutation {
    createCollection(name: String!): Collection!
    editCollection(name: String!): Collection!
    updateCover(cover: String!): Collection!
    updateLogo(logo: String!): Collection!
    deployCollection(id: ID!): String!
    startMinting(id: ID!): String!

    completeProfile(displayName: String!, bio: String, avatar: String): User!
    getNonce(address: String!, publicKey: String!): String!
    getJwt(publicKey: String!, signature: String!, dataHash: String!): String!
    editProfile(displayName: String!): String!

    addTrait(collectionId: String!, traitName: String!, variant: String!): String!
    editTrait(id: ID!, traitName: String!, variant: String!): String!
    deleteTrait(id: ID!): String!

    addToken(collectionId: String!, name: String!, description: String!, backgorund_color: String!, external_url: String!): String!
  }
`;

export default typeDefs;

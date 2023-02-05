import gql from "graphql-tag";

const usertypeDefs = gql`
  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
  type SearchedUser {
    id: String
    username: String
    image: String
  }
  type Mutation {
    createUsername(username: String!): CreateUsernameResponse
  }
  type Query {
    searchUsers(username: String!): [SearchedUser]
  }
`;

export default usertypeDefs;

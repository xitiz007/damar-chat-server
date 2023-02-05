import gql from "graphql-tag";

const conversationtypeDefs = gql`
  scalar Date
  type CreateConversationResponse {
    conversationId: String
  }
  type User {
    id: String
    username: String
    image: String
  }
  type Participant {
    id: String
    hasSeenLatestMessage: Boolean
    user: User
  }
  type Message {
    id: String
    message: String
    sender: User
    createdAt: Date
    updatedAt: Date
  }
  type Conversation {
    id: String
    participants: [Participant]
    latestMessage: Message
    createdAt: Date
    updatedAt: Date
  }

  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResponse
  }
  type Query {
    conversations: [Conversation]
  }
`;

export default conversationtypeDefs;

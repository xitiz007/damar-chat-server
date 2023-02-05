import { PrismaClient, Prisma } from "@prisma/client";
import { ISODateString } from "next-auth";
import { conversationPopulated } from "../graphql/resolvers/conversation";

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
}

export interface Session {
  user: User;
  expires: ISODateString;
}

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
}
// Users
export interface CreateUsernameResponse {
  success: boolean;
  error: string;
}

// Conversations

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated
}>

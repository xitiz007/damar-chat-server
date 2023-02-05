import { GraphQLContext, ConversationPopulated } from "../../util/types";
import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";

const conversationResolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<ConversationPopulated[]> => {
      const { prisma, session } = context;
      if (!session?.user) throw new GraphQLError("UnAuthorized");
      const {
        user: { id },
      } = session;
      try {
        const conversations = await prisma.conversation.findMany({
          include: conversationPopulated,
        });
        return conversations.filter(
          (conversation) =>
            conversation.participants.find(
              (participant) => participant.user.id === id
            ) !== undefined
        );
      } catch (err: any) {
        throw new Error(err?.message);
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: String[] },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { prisma, session } = context;
      if (!session?.user) throw new GraphQLError("UnAuthorized");
      const {
        user: { id },
      } = session;
      const { participantIds } = args;
      participantIds.push(id);
      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((participantId) => ({
                  hasSeenLatestMessage: participantId === id,
                  userId: id,
                })),
              },
            },
          },
          include: conversationPopulated,
        });
        return { conversationId: conversation.id };
      } catch (err: any) {
        throw new Error(err?.message);
      }
    },
  },
};

export const conversationParticipantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
        image: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: conversationParticipantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    },
  });

export default conversationResolvers;

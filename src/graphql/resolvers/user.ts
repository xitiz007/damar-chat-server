import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { GraphQLContext, CreateUsernameResponse } from "../../util/types";

const userResolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<User[]> => {
      const { prisma, session } = context;
      if (!session?.user) throw new GraphQLError("UnAuthorized");
      const {
        user: { username: myUsername },
      } = session;
      const { username: searchedUsername } = args;
      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
              mode: "insensitive",
            },
          },
        });
        return users;
      } catch (err: any) {
        throw new GraphQLError(err.message);
      }
    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { prisma, session } = context;
      if (!session?.user) return { error: "UnAuthorized", success: false };
      const {
        user: { id },
      } = session;
      const { username } = args;
      try {
        const usernameExists = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        if (usernameExists)
          return { error: "username exists already", success: false };
        await prisma.user.update({
          where: {
            id,
          },
          data: {
            username,
          },
        });
        return { error: "", success: true };
      } catch (err: any) {
        return { error: err?.message, success: false };
      }
    },
  },
};

export default userResolvers;

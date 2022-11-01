const { createSchema } = require("graphql-yoga");
const { sign } = require("jsonwebtoken");
const { verifyAuthToken } = require("./utils/user");
const { hashPassword, comparePasswords } = require("./utils/auth");

const schema = createSchema({
  typeDefs: `
    type Query {
        me: User
        userById(id: Int!): User!
        users: [User!]!
        postById(id: Int!): Post!
        posts: [Post!]!
    }

    type Mutation {
        signUp(input: UserInput!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        createUser(input: UserInput!): User!
        deletePost(id: Int!): Post
    }

    type AuthPayload {
        authToken: String!
        user: User!
    }

    type User {
        id: Int!
        email: String!
        name: String
        posts: [Post!]!
    }

    type Post {
        id: Int!
        author: User
        title: String!
        content: String
    }

    input UserInput {
        email: String!
        name: String
        posts: [PostInput!]
    }

    input PostInput {
        title: String!
        content: String
    }
  `,
  resolvers: {
    Query: {
      me: (_, __, ctx) => {
        const { id } = verifyAuthToken(ctx);
        return ctx.prisma.user.findUnique({
          where: { id: id || undefined },
        });
      },
      userById: (_, args, ctx) =>
        ctx.prisma.user.findUnique({ where: { id: args.id || undefined } }),
      users: (_, __, ctx) => ctx.prisma.user.findMany(),
      postById: (_, args, ctx) => {
        return ctx.prisma.post.findUnique({
          where: { id: args.id || undefined },
        });
      },
      posts: (_, __, ctx) => ctx.prisma.post.findMany(),
    },
    Mutation: {
      signUp: async (_, args, ctx) => {
        const { name, email, password } = args.input;

        const user = await ctx.prisma.user.create({
          data: {
            name: name,
            email: email,
            password: hashPassword(password),
          },
        });

        const token = sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        return { token, user };
      },
      login: async (_, args, ctx) => {
        const { email, password } = args;

        const user = ctx.prisma.user.findUnique({
          where: { email: email || undefined },
        });
        const isPasswordsMatch = comparePasswords(password, user.password);

        if (!isPasswordsMatch) {
          throw new Error("Password is not correct");
        }

        const token = sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        return { token, user };
      },
      createUser: (_, { input }, ctx) => {
        return ctx.prisma.user.create({
          data: { ...input },
        });
      },
      deletePost: (_, args, ctx) => {
        return ctx.prisma.post.delete({
          where: { id: args.id },
        });
      },
    },
    User: {
      posts: (root, _, ctx) => {
        return ctx.prisma.user
          .findUnique({
            where: { id: root.id || undefined },
          })
          .posts();
      },
    },
    Post: {
      author: (root, _, ctx) => {
        return ctx.prisma.post
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .author();
      },
    },
  },
});

module.exports = { schema };

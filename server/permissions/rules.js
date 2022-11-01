const { rule } = require("graphql-shield");
const { verifyAuthToken } = require("../utils/user");

module.exports = {
  isAuthenticated: rule()(async (_, args, ctx) => {
    const { id } = verifyAuthToken(ctx);

    if (!id) {
      return new Error("You are not logged in!");
    }

    return true;
  }),
};

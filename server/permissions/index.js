const { shield } = require("graphql-shield");
const { isAuthenticated } = require("./rules");

module.exports = shield({
  Query: {
    users: isAuthenticated,
  },
});

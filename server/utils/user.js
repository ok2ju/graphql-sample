const { verify } = require("jsonwebtoken");

module.exports = {
  verifyAuthToken: (ctx) => {
    const auth = ctx.request.headers.authorization;

    if (auth) {
      const token = auth.replace("Bearer ", "");
      const validToken = verify(token, process.env.JWT_SECRET);

      return validToken;
    }
  },
};

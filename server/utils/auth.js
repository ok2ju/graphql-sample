const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const HMAC = (password) => {
  return crypto
    .createHmac("sha512", process.env.SHARED_KEY)
    .update(password)
    .digest("hex");
};

const hashPassword = (pass) => {
  const SALT_ROUNDS = 10;

  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const HMACpassword = HMAC(pass);

  return bcrypt.hashSync(HMACpassword, salt);
};

const comparePasswords = async (pass, hash) => {
  const HMACpassword = HMAC(pass);
  const isPasswordsTheSame = await bcrypt.compare(HMACpassword, hash);
  return isPasswordsTheSame;
};

module.exports = {
  hashPassword,
  comparePasswords,
};

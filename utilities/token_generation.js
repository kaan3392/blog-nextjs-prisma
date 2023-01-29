const crypto = require("crypto")

const generateToken = function () {
  const randomHexString = crypto.randomBytes(15).toString("hex");
  const { TOKEN_EXPIRE } = process.env;

  const token = crypto.createHash("SHA256").update(randomHexString).digest("hex");
  const expire = Date.now() + parseInt(TOKEN_EXPIRE);

  return {expire, token}
};

module.exports = generateToken;
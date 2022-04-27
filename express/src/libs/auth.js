const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const crypto = require("crypto");

const issuer = "dev.tube-v1";
const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);

const { JWT_SECRET, EMAIL_CRYPTO_KEY } = process.env;

module.exports.generateMagicToken = (email, redirectUrl) => {
  return jwt.sign({ email, redirectUrl }, JWT_SECRET, { expiresIn: "5m", issuer });
}

module.exports.generateAuthToken = (magicToken) => {
  const { email, redirectUrl } = jwt.verify(magicToken, JWT_SECRET)
  const { iv, content } = encrypt(email);
  const authToken = jwt.sign({ iv, content }, JWT_SECRET, { issuer });
  return { authToken, redirectUrl }
}

module.exports.tryGetEmailAddress = (authToken) => {
  const { iv, content } = jwt.verify(authToken, JWT_SECRET)
  const email = decrypt({ iv, content });
  return email;
}

module.exports.authTokenCookie = () => {
  return {
    secure: true,
    expires: dayjs().add(30, "days").toDate(),
    SameSite: 'strict'
  }
}

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, EMAIL_CRYPTO_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, EMAIL_CRYPTO_KEY, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrpyted.toString();
};
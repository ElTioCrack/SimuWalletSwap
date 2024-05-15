import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

const generateSecretKey = (password) => {
  const hash = CryptoJS.SHA256(password);
  return hash.toString(CryptoJS.enc.Hex).substring(0, 32);
};

const encryptData = (data, secretKey) => {
  const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
  return encryptedData;
};

const decryptData = (encryptedData, secretKey) => {
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  return decryptedData;
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const generateWalletKeys = (mnemonic) => {
  const masterKey = CryptoJS.PBKDF2(mnemonic, "", {
    keySize: 512 / 32,
  }).toString();

  const publicKey = CryptoJS.SHA256(masterKey).toString();
  const privateKey = CryptoJS.SHA256(masterKey + "private").toString();

  return { publicKey, privateKey };
};

export {
  generateSecretKey,
  encryptData,
  decryptData,
  hashPassword,
  verifyPassword,
  generateWalletKeys,
};

import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

const generateSecretKey = (password) => {
  const hash = CryptoJS.SHA256(password);
  return hash.toString(CryptoJS.enc.Hex).substring(0, 32);
};

const encryptData = (data, secretKey) => {
  const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
  const encryptedData = CryptoJS.AES.encrypt(data, CryptoJS.enc.Hex.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return encryptedData;
};

const decryptData = (encryptedData, secretKey) => {
  const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Hex.parse(secretKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);
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

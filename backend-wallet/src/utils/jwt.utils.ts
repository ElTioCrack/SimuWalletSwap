import * as jwt from 'jsonwebtoken';
import JwtConstants from '../constants/jwt.constans';

const generateAccessToken = (walletId: string): string => {
  return jwt.sign({ walletId }, JwtConstants.ACCESS_SECRET, {
    expiresIn: JwtConstants.ACCESS_EXPIRATION,
  });
};

const generateRefreshToken = (walletId: string): string => {
  return jwt.sign({ walletId }, JwtConstants.REFRESH_SECRET, {
    expiresIn: JwtConstants.REFRESH_EXPIRATION,
  });
};

const verifyAccessToken = (accessToken: string): any => {
  try {
    const decoded = jwt.verify(accessToken, JwtConstants.ACCESS_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (refreshToken: string): any => {
  try {
    const decoded = jwt.verify(refreshToken, JwtConstants.REFRESH_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

const generateAccessTokenFromRefreshToken = (refreshToken: string): string => {
  const decoded = verifyRefreshToken(refreshToken);
  if (decoded) {
    return generateAccessToken(decoded.walletId);
  }
  return null;
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessTokenFromRefreshToken,
};

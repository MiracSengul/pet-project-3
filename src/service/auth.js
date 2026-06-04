import bcrypt from "bcrypt";
import User from "../db/models/user.js";
import createHttpError from "http-errors";
import { randomBytes } from "crypto";
import Session from "../db/models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";

export const registerService = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw createHttpError(409, "This email is already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const users = await User.create({
    ...payload,
    password: hashedPassword,
  });

  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);

  const session = await Session.create({
    userId: users._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { users, session };
};

export const loginService = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, "There is no such email");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, "Password is incorrect");
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  const accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(Date.now() + ONE_DAY);

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { session, user };
};

export const logoutService = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

export const refreshService = async ({ sessionId, refreshToken }) => {
  const existingSession = await Session.findOne({ _id: sessionId, refreshToken });

  if (!existingSession) {
    throw createHttpError(404, "Session not found");
  }

  const isRefreshTokenExpired =
    new Date() > new Date(existingSession.refreshTokenValidUntil);

  if (isRefreshTokenExpired) {
    throw createHttpError(401, "Session token expired");
  }

  const newAccessToken = randomBytes(30).toString("base64");
  const newRefreshToken = randomBytes(30).toString("base64");

  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    userId: existingSession.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};
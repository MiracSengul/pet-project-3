import {
  loginService,
  logoutService,
  refreshService,
  registerService,
} from "../service/auth.js";
import { ONE_DAY } from "../constants/index.js";

export const registerController = async (req, res) => {
  const { user: registeredUser, session: newSession } = await registerService(req.body);

  res.status(201).json({
    message: "Register successfully",
    data: {
      users: registeredUser,
      token: newSession.accessToken,
    },
  });
};

export const loginController = async (req, res) => {
  const { session: userSession, user: authenticatedUser } = await loginService(req.body);

  res.cookie("refreshToken", userSession.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie("sessionId", userSession._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.status(200).json({
    message: "Login successfully",
    data: {
      user: authenticatedUser,
      token: userSession.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const currentSessionId = req.cookies.sessionId;
  if (currentSessionId) {
    await logoutService(currentSessionId);
  }

  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).send();
};

export const refreshController = async (req, res) => {
  const refreshedSession = await refreshService({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  res.cookie("refreshToken", refreshedSession.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie("sessionId", refreshedSession._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.status(200).json({
    message: "Successfully refreshed a session!",
    data: {
      accessToken: refreshedSession.accessToken,
    },
  });
};
import createHttpError from "http-errors";
import Session from "../db/models/session.js";
import User from "../db/models/user.js";

export const authenticate = async (req, res, next) => {
  const authorizationHeader = req.get("Authorization");

  if (!authorizationHeader) {
    next(createHttpError(401, "Please provide a Authorization header"));
    return;
  }

  const [bearerScheme, accessToken] = authorizationHeader.split(" ");

  if (bearerScheme !== "Bearer" || !accessToken) {
    next(createHttpError(401, "Auth header should be of type Bearer"));
    return;
  }

  const existingSession = await Session.findOne({ accessToken });

  if (!existingSession) {
    next(createHttpError(401, "Session not found"));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(existingSession.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, "Access token expired"));
    return;
  }

  const authenticatedUser = await User.findOne({ _id: existingSession.userId });

  if (!authenticatedUser) {
    next(createHttpError(401, "User not found"));
    return;
  }

  req.user = authenticatedUser;
  next();
};
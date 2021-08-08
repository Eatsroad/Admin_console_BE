import { UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { RefreshToken } from "src/entities/token/token.entity";
import { Repository } from "typeorm";

export const generateAccessToken = (userId: number): string => {
  return jwt.sign(
    {
      userId: userId,
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    `${process.env.JWT_SERCET_KEY}`
  );
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign(
    {
      userId: userId,
      exp: Math.floor(Date.now() / 1000) + 1209600,
    },
    `${process.env.REFRESH_TOKEN_SECRET}`
  );
};

export function checkExpDate(exp: number): void {
  try {
    if (exp < Date.now() / 1000) {
      throw new UnauthorizedException("JWT Token has been expired.");
    }
  } catch (exception) {
    throw new UnauthorizedException("JWT Token is malformed.");
  }
}

export function checkExpDateRefresh(exp: number): void {
  try {
    if (exp < Date.now() / 1000) {
      throw new UnauthorizedException("Refresh Token has been expired.");
    }
  } catch (exception) {
    throw new UnauthorizedException("Refresh Token is malformed.");
  }
}

export function extractUserId(token: string): number {
  try {
    const decodedToken = jwt.verify(token, `${process.env.JWT_SERCET_KEY}`) as {
      userId: number;
      exp: number;
    };
    checkExpDate(decodedToken.exp);

    return decodedToken.userId;
  } catch (exception) {
    throw new UnauthorizedException(
      "JWT Token is malformed. Send A Refresh Token"
    );
  }
}

export function extractUserIdForRefresh(token: string): number {
  try {
    console.log(23);
    const decodedToken = jwt.verify(token, `${process.env.JWT_SERCET_KEY}`) as {
      userId: number;
      exp: number;
    };
    console.log(2345);
    console.log(decodedToken);
    return decodedToken.userId;
  } catch (exception) {
    console.log(exception);
    throw new UnauthorizedException("This must be not happen");
  }
}

export function regenerateAccessToekn(token: string): string {
  try {
    const decodedToken = jwt.verify(
      token,
      `${process.env.REFRESH_TOKEN_SECRET}`
    ) as {
      userId: number;
      exp: number;
    };
    checkExpDateRefresh(decodedToken.exp);
    return jwt.sign(
      {
        userId: decodedToken.userId,
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      `${process.env.JWT_SERCET_KEY}`
    );
  } catch (exception) {
    throw new UnauthorizedException(
      "Refresh Token is malformed Please Login Again"
    );
  }
}

import { SignJWT, jwtVerify, type JWTPayload as JosePayload } from 'jose';

export interface JWTPayload {
  userId: string;
  mobile_no: string;
}

function getSecret(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

const ACCESS_SECRET  = () => getSecret(process.env.ACCESS_TOKEN_SECRET!);
const REFRESH_SECRET = () => getSecret(process.env.REFRESH_TOKEN_SECRET!);

/** Generate a long-lived access token (7 days) */
export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(ACCESS_SECRET());
}

/** Generate a long-lived refresh token (30 days) */
export async function generateRefreshToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(REFRESH_SECRET());
}

/** Verify an access token — returns payload or null */
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/** Verify a refresh token — returns payload or null */
export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/** Synchronous-style helper for Edge middleware using jose (async internally) */
export async function verifyAccessTokenEdge(token: string): Promise<(JosePayload & JWTPayload) | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET());
    return payload as JosePayload & JWTPayload;
  } catch {
    return null;
  }
}

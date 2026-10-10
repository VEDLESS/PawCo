import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt';
import { Role } from '@petco/shared';

describe('JWT Auth Utilities', () => {
  const payload = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@petco.com',
    role: Role.OWNER,
  };

  it('should generate and verify valid access tokens', () => {
    const token = generateAccessToken(payload);
    expect(typeof token).toBe('string');

    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(Role.OWNER);
  });

  it('should generate and verify valid refresh tokens', () => {
    const refreshToken = generateRefreshToken(payload);
    expect(typeof refreshToken).toBe('string');

    const decoded = verifyRefreshToken(refreshToken);
    expect(decoded.userId).toBe(payload.userId);
  });
});

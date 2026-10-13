import jwt from 'jsonwebtoken';

export const signToken = (user: { id: string; email: string }): string =>
    jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
    });

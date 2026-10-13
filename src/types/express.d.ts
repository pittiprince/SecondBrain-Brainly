declare global {
    namespace Express {
        interface Request {
            /** Set by verifyJwtMiddleware: the authenticated user. */
            user?: { id: string; email: string };
        }
    }
}
export {};

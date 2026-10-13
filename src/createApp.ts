import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { auth } from 'express-openid-connect';
import { config } from './config/Auth0Config';
import UserSignupRouter from './routes/SignupRoutes';
import { SignInRouter } from './routes/SigninRoutes';
import { MemoryRouter } from './routes/MemoryRoutes';
import { FileUploadRouter } from './routes/fileUpload';
import { generateEmbeddings } from './routes/generateEmbeddingsRoutes';
import { SignOutRouter } from './routes/SignOut';

export const createApp = (): express.Application => {
    const app = express();
    app.set('trust proxy', 1); // behind Render's proxy, so rate limiting sees the real client IP
    app.use(helmet());

    const origins = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
    app.use(cors(origins.length ? { origin: origins } : undefined));

    app.use(express.json({ limit: '100kb' }));
    app.use(express.urlencoded({ extended: true, limit: '100kb' }));

    app.get('/health', (_req, res) => { res.json({ status: 'ok' }); });
    // the API has no page of its own: send browsers to the web app when it is configured
    app.get('/', (_req, res) => {
        if (process.env.FRONTEND_URL) { res.redirect(process.env.FRONTEND_URL); return; }
        res.json({ name: 'Brainly API', health: '/health', docs: 'see README' });
    });

    // Auth0 (Google sign-in) is optional: only mounted when it is configured
    if (config.secret && config.baseURL && config.clientID && config.issuerBaseURL) {
        app.use(auth(config));
    }

    const limit = Number(process.env.RATE_LIMIT) || 300;
    const authLimit = Number(process.env.AUTH_RATE_LIMIT) || 30;
    app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit, standardHeaders: true, legacyHeaders: false }));
    app.use(['/api/signin', '/api/signup'], rateLimit({ windowMs: 15 * 60 * 1000, limit: authLimit, standardHeaders: true, legacyHeaders: false }));

    app.use('/api', UserSignupRouter);
    app.use('/api', SignInRouter);
    app.use('/api', MemoryRouter);
    app.use('/api', FileUploadRouter);
    app.use('/api', generateEmbeddings);
    app.use('/api', SignOutRouter);

    app.use((_req, res) => { res.status(404).json({ message: 'Not found' }); });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        if (err?.type === 'entity.parse.failed') {
            res.status(400).json({ message: 'Invalid JSON body' });
            return;
        }
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    });
    return app;
};

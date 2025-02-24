export const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://glu-guide.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
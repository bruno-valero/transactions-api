import { FastifyReply, FastifyRequest } from 'fastify';

export default async function handleSessionId(req:FastifyRequest, res:FastifyReply) {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) return res.status(401).send('Not Authorized!');
    return sessionId;
}
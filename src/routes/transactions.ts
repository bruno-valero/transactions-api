import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import z from "zod";
import { knex } from "../database";
import handleSessionId from "../middlewares/sessionId";

export default async function transactionRoutes(app: FastifyInstance) {
    
    app.get('/', async (req, res) => {
        const sessionId = await handleSessionId(req, res);
        const transactions = await knex('transactions').select('*').where({
            session_id:sessionId,
        });
        
        console.log('transactions:', transactions)
        res.status(200).header('content-type', 'application/json').send(JSON.stringify({ transactions }))
    })

    app.get('/:id', async (req, res) => {

        const sessionId = await handleSessionId(req, res);

        const paramsSchema = z.object({
            id:z.string().uuid(),
        })
        const _params = paramsSchema.safeParse(req.params);
        if (!_params.success) return res.status(400).send(`Invalid params! ${JSON.stringify(_params.error.format())}`)
        const params = _params.data;
        if (!params.id) return res.status(400).send('Invalid params!')
        const transaction = await knex('transactions').select('*').where({
            id:params.id,
            session_id:sessionId,
        }).first()

        return res.status(200).header('content-type', 'application/json').send(JSON.stringify({ transaction }))
    })

    app.get('/summary', async (req, res) => {
        const sessionId = await handleSessionId(req, res);

        const transactions = await knex('transactions').where({ session_id:sessionId }).sum('amount', { as:'amount' }).first()
        const summary = transactions;

        return res.status(200).header('content-type', 'application/json').send(JSON.stringify({ summary }))
    })

    app.post('/', async (req, res) => {
        const contentType = req.headers['content-type'];
        if (contentType !== 'application/json') return res.status(400).send('Invalid Content-Type!');

        const bodySchema = z.object({
            title:z.string(),
            amount:z.coerce.number(),
            type:z.enum(['credit', 'debit'])
        })
        const _body = bodySchema.safeParse(req.body);
        if (!_body.success) return res.status(400).send(`Invalid Requst Body! ${JSON.stringify(_body.error.format())}`)

        const body = _body.data;
        const { title, amount, type } = body;

        let sessionId = req.cookies.sessionId;
        if (!sessionId) {
            sessionId = randomUUID();
            res.cookie('sessionId', sessionId, {
                path:'/',
                maxAge:  60 * 60 * 24 * 7, // 7 days
            });
        }

        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id:sessionId,
        });

        return res.status(201).send();
    })

}
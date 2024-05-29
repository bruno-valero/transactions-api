

import cookie from '@fastify/cookie'
import fastify from 'fastify'

import transactionRoutes from '../routes/transactions.js'

const app = fastify({ logger: true })

app.register(cookie)

app.register(transactionRoutes, {
  prefix:'transactions'
})

export default app;

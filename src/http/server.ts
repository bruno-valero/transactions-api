

import env from "../env/inex"
import app from "./app"

app
  .listen({ port: env.PORT, host: ("RENDER" in process.env) ? '0.0.0.0' : 'localhost', })
  .then(() => {
    console.log('fastify conectado!')
  })
  .catch((error) => {
    console.log(`Houve um erro durante a conecção: ${error.message}`)
  })

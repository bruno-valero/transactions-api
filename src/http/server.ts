

import env from "../env/inex"
import app from "./app"

app
  .listen({ port: env.PORT })
  .then(() => {
    console.log('fastify conectado!')
  })
  .catch((error) => {
    console.log(`Houve um erro durante a conecção: ${error.message}`)
  })

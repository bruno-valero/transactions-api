import { config } from 'dotenv';
import z from 'zod';


if (process.env.NODE_ENV === 'test') {
    config({ path:'.env.test' })    
} else {
    config();
}


const envsSchema = z.object({
    DATABASE_URL:z.string(),
    PORT:z.coerce.number().default(3000),
    NODE_ENV:z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_CLIENT:z.enum(['sqlite', 'pg']),
})

const _env = envsSchema.safeParse(process.env);

if (!_env.success) {
    console.error('invalid enviroment variables!', _env.error.format())
    throw new Error(`invalid enviroment variables! ${_env.error.format()}`);    
}

const env = _env.data;
export default env
import { execSync } from 'node:child_process';
import req from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app from "../http/app";


beforeAll(async () => {    
    await app.ready();
})

afterAll(async () => {
    await app.close();
})

beforeEach(() => {
    execSync('npm run rollback-all')
    execSync('npm run migrate')
})


describe('Transaction routes', () => {
    it('should be able to create a new transaction', async() => {
        await req(app.server)
            .post('/transactions')
            .send({
                title:'new transaction',
                amount:500,
                type:'credit',
            })
            .expect(201)
    })

    it('should be able to list all transactions', async() => {
        const resp = await req(app.server)
            .post('/transactions')
            .send({
                title:'new transaction',
                amount:5000,
                type:'credit',
            })
        
        const cookies = resp.get('Set-Cookie');

        const transaction = await req(app.server)
            .get('/transactions')
            .set('Cookie', cookies ?? [])
            .expect(200)
        
        // console.log(`transaction.body:`, transaction.body)
        expect(transaction.body).toEqual({
            transactions:[
                expect.objectContaining({
                    id:expect.any(String),
                    title:'new transaction',
                    amount:5000,
                })                
            ]
        })
    })

    it('should be able to get a specific transaction', async() => {
        const resp = await req(app.server)
            .post('/transactions')
            .send({
                title:'new specific transaction',
                amount:3000,
                type:'credit',
            })
        
        const cookies = resp.get('Set-Cookie');

        const transaction = await req(app.server)
            .get('/transactions')
            .set('Cookie', cookies ?? [])
            .expect(200)
        
        const id = transaction.body.transactions[0].id;

        const uniqueTransaction = await req(app.server)
            .get(`/transactions/${id}`)
            .set('Cookie', cookies ?? [])
            .expect(200)

        expect(uniqueTransaction.body).toEqual({
            transaction: expect.objectContaining({
                    id:expect.any(String),
                    title:'new specific transaction',
                    amount:3000,
                })                
            
        })

        console.log(uniqueTransaction.body)
    })


    it('should be able to get the summary', async() => {
        const resp = await req(app.server)
            .post('/transactions')
            .send({
                title:'new summary credit transaction',
                amount:2500,
                type:'credit',
        })
        
        const cookies = resp.get('Set-Cookie');
        
        await req(app.server)
            .post('/transactions')
            .set('Cookie', cookies ?? [])
            .send({
                title:'new summary debit transaction',
                amount:250,
                type:'debit',
        })

        const summary = await req(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies ?? [])
            .expect(200)
        
        
        expect(summary.body).toEqual({                                        
            summary:{
                amount:2250
            }
        })

        console.log(summary.body)
    })

})


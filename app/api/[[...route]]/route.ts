import { zValidator } from '@hono/zod-validator'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import {z} from 'zod'



export const runtime = 'edge'

const app = new Hono().basePath('/api')

// c: context
app.get('/hello',
    clerkMiddleware(),
    (c) => {
        const auth = getAuth(c)

        if (!auth?.userId) {
            return c.json({
              message: 'You are not logged in.'
            })
          }

        return c.json({
        message: 'Hello Next.js!',
        userId: auth.userId,
    })
})


export const GET = handle(app)
export const POST = handle(app)
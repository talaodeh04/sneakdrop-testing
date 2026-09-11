import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
    http.post('/api/newsletter', async () => {
        return HttpResponse.json({ message: 'Subscribed' })
    })
)
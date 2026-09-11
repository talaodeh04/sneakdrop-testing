import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import NewsletterForm from './NewsletterForm.jsx'

describe('NewsletterForm', () => {
    it('shows success message after subscribing', async () => {
        const user = userEvent.setup()

        render(<NewsletterForm />)

        await user.type(
            screen.getByRole('textbox', { name: 'Email address' }),
            'tala@example.com'
        )

        await user.click(screen.getByRole('button', { name: 'Notify me' }))

        expect(
            await screen.findByText("You're on the list for the next drop.")
        ).toBeInTheDocument()
    })

    it('shows error message when the server returns 500', async () => {
        server.use(
            http.post('/api/newsletter', async () => {
                return new HttpResponse(null, { status: 500 })
            })
        )

        const user = userEvent.setup()

        render(<NewsletterForm />)

        await user.type(
            screen.getByRole('textbox', { name: 'Email address' }),
            'tala@example.com'
        )

        await user.click(screen.getByRole('button', { name: 'Notify me' }))

        expect(
            await screen.findByText("That email doesn't look right.")
        ).toBeInTheDocument()
    })

    it('shows loading state while submitting', async () => {
        server.use(
            http.post('/api/newsletter', async () => {
                await new Promise((resolve) => setTimeout(resolve, 100))
                return HttpResponse.json({ message: 'Subscribed' })
            })
        )

        const user = userEvent.setup()

        render(<NewsletterForm />)

        await user.type(
            screen.getByRole('textbox', { name: 'Email address' }),
            'tala@example.com'
        )

        const button = screen.getByRole('button', { name: 'Notify me' })

        await user.click(button)

        expect(
            screen.getByRole('button', { name: 'Sending…' })
        ).toBeDisabled()

        expect(
            await screen.findByText("You're on the list for the next drop.")
        ).toBeInTheDocument()
    })
})
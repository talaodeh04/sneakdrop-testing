import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import Cart from './Cart.jsx'

const product = {
    id: 1,
    name: 'Air Max',
    price: 120,
    stock: 10,
    image: '/shoe.jpg',
    colorway: 'Black',
    size: 42,
    qty: 1,
    lineId: '1-42'
}

function renderCart() {
    localStorage.setItem('stride-cart', JSON.stringify([product]))

    return render(
        <MemoryRouter>
            <CartProvider>
                <Cart />
            </CartProvider>
        </MemoryRouter>
    )
}

describe('Cart', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('renders the product in the cart', () => {
        renderCart()

        expect(screen.getByText('Air Max')).toBeInTheDocument()
        expect(screen.getByText('Black · Size 42')).toBeInTheDocument()
        expect(screen.getAllByText('$120')).toHaveLength(2)
    })

    it('increases the product quantity', async () => {
        const user = userEvent.setup()

        renderCart()

        await user.click(
            screen.getByRole('button', { name: 'Increase quantity' })
        )

        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getAllByText('$240')).toHaveLength(2)
    })

    it('removes the product from the cart', async () => {
        const user = userEvent.setup()

        renderCart()

        await user.click(screen.getByRole('button', { name: 'Remove' }))

        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
    })
})
import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Details from './Details.jsx'
import { ProductsProvider } from '../context/ProductsContext.jsx'
import { CartProvider } from '../context/CartContext.jsx'
import { WishlistProvider } from '../context/WishlistContext.jsx'

vi.mock('../data/sneakers.js', async (importOriginal) => {
    const actual = await importOriginal()

    return {
        ...actual,
        fetchSneakers: vi.fn().mockResolvedValue([
            {
                id: 1,
                name: 'Air Max',
                price: 120,
                stock: 10,
                image: '/shoe.jpg',
                colorway: 'Black',
                description: 'A comfortable everyday sneaker.',
                availableSizes: [7, 8, 9, 10, 11, 12, 13],
                category: 'Running',
                isLimited: false,
                reviews: []
            }
        ])
    }
})
function renderDetails() {
    localStorage.clear()

    return render(
        <MemoryRouter initialEntries={['/product/1']}>
            <ProductsProvider>
                <CartProvider>
                    <WishlistProvider>
                        <Routes>
                            <Route path="/product/:id" element={<Details />} />
                        </Routes>
                    </WishlistProvider>
                </CartProvider>
            </ProductsProvider>
        </MemoryRouter>
    )
}

describe('Details', () => {
    it('renders the product details', async () => {
        renderDetails()

        expect(await screen.findByText('Air Max')).toBeInTheDocument()
        expect(screen.getByText(/Black/)).toBeInTheDocument()
        expect(screen.getByText('$120')).toBeInTheDocument()
    })

    it('requires a size before adding to cart', async () => {
        const user = userEvent.setup()

        renderDetails()

        const addButton = await screen.findByRole('button', {
            name: 'Add 1 to cart'
        })

        await user.click(addButton)

        expect(screen.getByText('Pick a size first.')).toBeInTheDocument()
    })

    it('adds the selected size to the cart', async () => {
        const user = userEvent.setup()

        renderDetails()

        const sizeButton = await screen.findByRole('button', {
            name: '10'
        })
        await user.click(sizeButton)

        await user.click(
            screen.getByRole('button', { name: 'Add 1 to cart' })
        )

        await waitFor(() => {
            expect(
                screen.getByText('Added size 10 to cart.')
            ).toBeInTheDocument()
        })
    })
})
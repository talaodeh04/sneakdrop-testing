import { describe, expect, it } from 'vitest'
import { cartReducer } from './CartContext.jsx'

const product = {
    id: 1,
    name: 'Air Max',
    price: 120,
    stock: 10,
    image: '/shoe.jpg',
    colorway: 'Black'
}

describe('cartReducer', () => {
    it('adds a new product to the cart', () => {
        const state = []

        const result = cartReducer(state, {
            type: 'ADD',
            product,
            size: 42,
            qty: 1
        })

        expect(result).toHaveLength(1)
        expect(result[0]).toMatchObject({
            id: 1,
            name: 'Air Max',
            size: 42,
            qty: 1
        })
        expect(result[0].lineId).toBe('1-42')
    })

    it('increases quantity when adding the same product and size', () => {
        const state = [
            {
                ...product,
                size: 42,
                qty: 2,
                lineId: '1-42'
            }
        ]

        const result = cartReducer(state, {
            type: 'ADD',
            product,
            size: 42,
            qty: 3
        })

        expect(result[0].qty).toBe(5)
    })

    it('does not exceed product stock', () => {
        const state = [
            {
                ...product,
                size: 42,
                qty: 8,
                lineId: '1-42'
            }
        ]

        const result = cartReducer(state, {
            type: 'ADD',
            product,
            size: 42,
            qty: 5
        })

        expect(result[0].qty).toBe(10)
    })

    it('updates quantity', () => {
        const state = [
            {
                ...product,
                size: 42,
                qty: 2,
                lineId: '1-42'
            }
        ]

        const result = cartReducer(state, {
            type: 'UPDATE_QTY',
            lineId: '1-42',
            qty: 5
        })

        expect(result[0].qty).toBe(5)
    })

    it('keeps quantity at minimum 1', () => {
        const state = [
            {
                ...product,
                size: 42,
                qty: 2,
                lineId: '1-42'
            }
        ]

        const result = cartReducer(state, {
            type: 'UPDATE_QTY',
            lineId: '1-42',
            qty: 0
        })

        expect(result[0].qty).toBe(1)
    })

    it('removes an item from the cart', () => {
        const state = [
            {
                ...product,
                size: 42,
                qty: 1,
                lineId: '1-42'
            }
        ]

        const result = cartReducer(state, {
            type: 'REMOVE',
            lineId: '1-42'
        })

        expect(result).toEqual([])
    })

    it('clears the cart', () => {
        const state = [
            {
                ...product,
                size: 42,
                qty: 1,
                lineId: '1-42'
            }
        ]

        const result = cartReducer(state, {
            type: 'CLEAR'
        })

        expect(result).toEqual([])
    })
})
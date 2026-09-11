import { test, expect } from '@playwright/test'

test('user can add a product to the cart', async ({ page }) => {
    await page.goto('/pair/3')

    await expect(page.locator('h1')).toBeVisible()

    const sizeButtons = page.locator('button.size-chip:not(.is-disabled)')

    await expect(sizeButtons.first()).toBeVisible()
    await expect(sizeButtons.first()).toBeEnabled()

    const selectedSize = await sizeButtons.first().textContent()

    await sizeButtons.first().click()

    await page.getByRole('button', { name: /Add 1 to cart/i }).click()

    await page.getByRole('link', { name: /cart/i }).click()

    await expect(page).toHaveURL(/\/cart/)
    await expect(page.getByText('Your cart')).toBeVisible()
    await expect(page.getByText(new RegExp(`Size ${selectedSize?.trim()}`))).toBeVisible()
})
import { test, expect } from '@playwright/test'

test.describe('Pokédex Page', () => {
  test('should load pokédex page', async ({ page }) => {
    await page.goto('/pokedex')
    
    await expect(page).toHaveTitle(/Pokédex/)
    await expect(page.getByText('Pokédex')).toBeVisible()
  })

  test('should search for pokemon', async ({ page }) => {
    await page.goto('/pokedex')
    
    const searchInput = page.getByPlaceholder(/Tìm kiếm Pokémon/)
    await searchInput.fill('pikachu')
    
    await expect(page.getByText('Pikachu')).toBeVisible()
  })

  test('should filter by type', async ({ page }) => {
    await page.goto('/pokedex')
    
    const typeSelect = page.getByRole('combobox', { name: /Type/i })
    await typeSelect.selectOption('fire')
    
    // Should show fire type pokemon
    await expect(page.getByText('Charmander')).toBeVisible()
  })

  test('should filter by generation', async ({ page }) => {
    await page.goto('/pokedex')
    
    const genSelect = page.getByRole('combobox', { name: /Generation/i })
    await genSelect.selectOption('1')
    
    // Should show gen 1 pokemon
    await expect(page.getByText('Bulbasaur')).toBeVisible()
  })

  test('should switch view modes', async ({ page }) => {
    await page.goto('/pokedex')
    
    const listButton = page.getByRole('button', { name: /List/i })
    await listButton.click()
    
    // Should switch to list view
    await expect(page.getByRole('button', { name: /Grid/i })).toBeVisible()
  })

  test('should open pokemon comparison', async ({ page }) => {
    await page.goto('/pokedex')
    
    const compareButton = page.getByText('So sánh Pokémon')
    await compareButton.click()
    
    await expect(page.getByText('So sánh Pokémon')).toBeVisible()
  })
})

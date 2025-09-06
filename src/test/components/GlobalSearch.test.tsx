import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GlobalSearch } from '@/components/search/GlobalSearch'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('GlobalSearch', () => {
  it('renders search input with placeholder', () => {
    render(<GlobalSearch placeholder="Test placeholder" />)
    
    const input = screen.getByPlaceholderText('Test placeholder')
    expect(input).toBeInTheDocument()
  })

  it('shows search results when typing', async () => {
    render(<GlobalSearch />)
    
    const input = screen.getByPlaceholderText(/Tìm kiếm Pokémon/)
    fireEvent.change(input, { target: { value: 'pikachu' } })
    
    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument()
    })
  })

  it('shows no results message when no matches found', async () => {
    render(<GlobalSearch />)
    
    const input = screen.getByPlaceholderText(/Tìm kiếm Pokémon/)
    fireEvent.change(input, { target: { value: 'nonexistent' } })
    
    await waitFor(() => {
      expect(screen.getByText(/Không tìm thấy kết quả cho/)).toBeInTheDocument()
    })
  })

  it('clears search when clear button is clicked', () => {
    render(<GlobalSearch />)
    
    const input = screen.getByPlaceholderText(/Tìm kiếm Pokémon/)
    fireEvent.change(input, { target: { value: 'pikachu' } })
    
    const clearButton = screen.getByRole('button')
    fireEvent.click(clearButton)
    
    expect(input).toHaveValue('')
  })
})

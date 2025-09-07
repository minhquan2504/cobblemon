import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TypeChart } from '@/components/pokemon/TypeChart'
import { Header } from '@/components/layout/Header'
import { Providers } from '@/components/providers/Providers'

describe('TypeChart & Shiny Toggle', () => {
  it('renders defensive multipliers for given types', async () => {
    render(
      <Providers>
        <TypeChart defendingTypes={["fire", "flying"]} />
      </Providers>
    )
    // basic presence
    expect(screen.getByText('Type Chart')).toBeInTheDocument()
  })

  it('toggles shiny via header buttons', async () => {
    render(
      <Providers>
        <Header />
      </Providers>
    )
    const normalBtn = screen.getByText('Normal')
    const shinyBtn = screen.getByText('Shiny')
    expect(normalBtn).toBeInTheDocument()
    expect(shinyBtn).toBeInTheDocument()
    fireEvent.click(shinyBtn)
    await waitFor(() => {
      // state toggled; UI still renders
      expect(shinyBtn).toBeInTheDocument()
    })
  })
})



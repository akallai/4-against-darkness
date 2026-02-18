import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DiceToast } from './DiceToast'

describe('DiceToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders total, detail, and label', () => {
    render(
      <DiceToast total={7} detail="3 + 4" label="2d6" onDismiss={vi.fn()} />,
    )
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('3 + 4')).toBeInTheDocument()
    expect(screen.getByText('2d6')).toBeInTheDocument()
  })

  it('renders without detail (d66 rolls)', () => {
    render(
      <DiceToast total={34} label="d66" onDismiss={vi.fn()} />,
    )
    expect(screen.getByText('34')).toBeInTheDocument()
    expect(screen.getByText('d66')).toBeInTheDocument()
    expect(screen.queryByTestId('dice-toast-detail')).not.toBeInTheDocument()
  })

  it('auto-dismisses after 3 seconds', () => {
    const onDismiss = vi.fn()
    render(
      <DiceToast total={5} label="d6" onDismiss={onDismiss} />,
    )

    expect(onDismiss).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('dismisses on click', async () => {
    vi.useRealTimers()
    const onDismiss = vi.fn()
    render(
      <DiceToast total={5} label="d6" onDismiss={onDismiss} />,
    )

    await userEvent.click(screen.getByText('5'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})

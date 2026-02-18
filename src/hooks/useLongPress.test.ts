import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLongPress } from './useLongPress'

describe('useLongPress', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls onLongPress after threshold duration', () => {
    const onLongPress = vi.fn()
    const onClick = vi.fn()
    const { result } = renderHook(() => useLongPress({ onLongPress, onClick, threshold: 500 }))

    act(() => {
      result.current.onPointerDown({ preventDefault: vi.fn() } as any)
    })

    expect(onLongPress).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onLongPress).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('calls onClick on quick release (before threshold)', () => {
    const onLongPress = vi.fn()
    const onClick = vi.fn()
    const { result } = renderHook(() => useLongPress({ onLongPress, onClick, threshold: 500 }))

    act(() => {
      result.current.onPointerDown({ preventDefault: vi.fn() } as any)
    })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    act(() => {
      result.current.onPointerUp()
    })

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('does not call onClick if long press already fired', () => {
    const onLongPress = vi.fn()
    const onClick = vi.fn()
    const { result } = renderHook(() => useLongPress({ onLongPress, onClick, threshold: 500 }))

    act(() => {
      result.current.onPointerDown({ preventDefault: vi.fn() } as any)
    })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    act(() => {
      result.current.onPointerUp()
    })

    expect(onLongPress).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('cancels on pointer leave', () => {
    const onLongPress = vi.fn()
    const onClick = vi.fn()
    const { result } = renderHook(() => useLongPress({ onLongPress, onClick, threshold: 500 }))

    act(() => {
      result.current.onPointerDown({ preventDefault: vi.fn() } as any)
    })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    act(() => {
      result.current.onPointerLeave()
    })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onLongPress).not.toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
  })
})

# Inline Dice Roller Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the dice roller modal with inline footer buttons and a toast result display for one-tap dice rolling.

**Architecture:** The single "Dice" modal button in FooterBar is replaced by 4 compact dice buttons (d6, 2d6, d8, d66). A new `useLongPress` hook enables exploding dice via long-press. Rolling results appear as an auto-dismissing toast notification at the top of the screen. The `DiceRollerModal` component is deleted entirely.

**Tech Stack:** React 19, TypeScript 5.7, Vitest + Testing Library, plain CSS with theme variables.

---

### Task 1: Create `useLongPress` hook — tests

**Files:**
- Create: `src/hooks/useLongPress.test.ts`

**Step 1: Write failing tests for `useLongPress`**

```ts
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
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks/useLongPress.test.ts`
Expected: FAIL — module `./useLongPress` not found

**Step 3: Commit**

```bash
git add src/hooks/useLongPress.test.ts
git commit -m "test: add failing tests for useLongPress hook"
```

---

### Task 2: Create `useLongPress` hook — implementation

**Files:**
- Create: `src/hooks/useLongPress.ts`

**Step 1: Write minimal implementation**

```ts
import { useRef, useCallback } from 'react'

interface UseLongPressOptions {
  onLongPress: () => void
  onClick: () => void
  threshold?: number
}

export function useLongPress({ onLongPress, onClick, threshold = 500 }: UseLongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const firedRef = useRef(false)

  const clear = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      firedRef.current = false
      timerRef.current = setTimeout(() => {
        firedRef.current = true
        onLongPress()
      }, threshold)
    },
    [onLongPress, threshold],
  )

  const onPointerUp = useCallback(() => {
    clear()
    if (!firedRef.current) {
      onClick()
    }
  }, [clear, onClick])

  const onPointerLeave = useCallback(() => {
    clear()
    firedRef.current = true // prevent onClick from firing
  }, [clear])

  return { onPointerDown, onPointerUp, onPointerLeave }
}
```

**Step 2: Run tests to verify they pass**

Run: `npx vitest run src/hooks/useLongPress.test.ts`
Expected: All 4 tests PASS

**Step 3: Commit**

```bash
git add src/hooks/useLongPress.ts
git commit -m "feat: implement useLongPress hook"
```

---

### Task 3: Create `DiceToast` component — tests

**Files:**
- Create: `src/components/common/DiceToast.test.tsx`

**Step 1: Write failing tests for `DiceToast`**

```tsx
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
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/common/DiceToast.test.tsx`
Expected: FAIL — module `./DiceToast` not found

**Step 3: Commit**

```bash
git add src/components/common/DiceToast.test.tsx
git commit -m "test: add failing tests for DiceToast component"
```

---

### Task 4: Create `DiceToast` component — implementation

**Files:**
- Create: `src/components/common/DiceToast.tsx`
- Create: `src/components/common/DiceToast.css`

**Step 1: Write `DiceToast.tsx`**

```tsx
import { useEffect } from 'react'
import './DiceToast.css'

interface DiceToastProps {
  total: number
  detail?: string
  label: string
  onDismiss: () => void
}

export function DiceToast({ total, detail, label, onDismiss }: DiceToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="dice-toast" onClick={onDismiss}>
      <span className="dice-toast-total">{total}</span>
      {detail && (
        <span className="dice-toast-detail" data-testid="dice-toast-detail">
          {detail}
        </span>
      )}
      <span className="dice-toast-label">{label}</span>
    </div>
  )
}
```

**Step 2: Write `DiceToast.css`**

```css
.dice-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 24px;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid var(--global-accent);
  border-radius: 8px;
  cursor: pointer;
  animation: dice-toast-in 0.25s ease-out;
  pointer-events: auto;
}

@keyframes dice-toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.dice-toast-total {
  font-size: 2em;
  font-weight: bold;
  color: var(--global-accent);
  line-height: 1;
}

.dice-toast-detail {
  font-size: 0.75em;
  color: #999;
}

.dice-toast-label {
  font-size: 0.65em;
  color: #666;
  text-transform: uppercase;
}
```

**Step 3: Run tests to verify they pass**

Run: `npx vitest run src/components/common/DiceToast.test.tsx`
Expected: All 4 tests PASS

**Step 4: Commit**

```bash
git add src/components/common/DiceToast.tsx src/components/common/DiceToast.css
git commit -m "feat: implement DiceToast component with auto-dismiss"
```

---

### Task 5: Update FooterBar with inline dice buttons

**Files:**
- Modify: `src/components/layout/FooterBar.tsx`
- Modify: `src/components/layout/FooterBar.css`

**Step 1: Update `FooterBar.tsx`**

Replace the full file content with:

```tsx
import { useState, useCallback } from 'react'
import { useUIStore } from '@/stores/useUIStore'
import { usePartyStore } from '@/stores/usePartyStore'
import { useFullscreen } from './AppShell'
import { useLongPress } from '@/hooks/useLongPress'
import { DiceToast } from '@/components/common/DiceToast'
import { rollDice, rollD66 } from '@/utils/dice'
import './FooterBar.css'

interface FooterBarProps {
  onSave: () => void
  onQuit: () => void
}

interface ToastData {
  total: number
  detail?: string
  label: string
  key: number
}

export function FooterBar({ onSave, onQuit }: FooterBarProps) {
  const setScreen = useUIStore((s) => s.setScreen)
  const openModal = useUIStore((s) => s.openModal)
  const partyName = usePartyStore((s) => s.partyName)
  const { toggleFullscreen } = useFullscreen()
  const [toast, setToast] = useState<ToastData | null>(null)

  const showRoll = useCallback((total: number, label: string, detail?: string) => {
    setToast({ total, label, detail, key: Date.now() })
  }, [])

  const rollStandard = useCallback(
    (count: number, sides: number, label: string, exploding: boolean) => {
      const result = rollDice(count, sides, exploding)
      const displayLabel = exploding ? `${label}!` : label
      showRoll(result.total, displayLabel, result.detail)
    },
    [showRoll],
  )

  const handleD66 = useCallback(() => {
    showRoll(rollD66(), 'd66')
  }, [showRoll])

  const d6Press = useLongPress({
    onClick: () => rollStandard(1, 6, 'd6', false),
    onLongPress: () => rollStandard(1, 6, 'd6', true),
  })

  const d8Press = useLongPress({
    onClick: () => rollStandard(1, 8, 'd8', false),
    onLongPress: () => rollStandard(1, 8, 'd8', true),
  })

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, count: number, sides: number, label: string) => {
      e.preventDefault()
      rollStandard(count, sides, label, true)
    },
    [rollStandard],
  )

  return (
    <div className="footer-bar">
      <div className="footer-group">
        <button className="btn-fs" onClick={toggleFullscreen} title="Toggle Fullscreen">
          &#x26F6;
        </button>
        <button className="btn-journal-gold" onClick={() => setScreen('journal')}>
          Journal
        </button>
        <button className="btn-journal-gold" onClick={() => setScreen('followers')}>
          Followers
        </button>
        <button className="btn-journal-gold" onClick={() => setScreen('encounters')}>
          Combat
        </button>
        <button className="btn-journal-gold" onClick={() => setScreen('map')}>
          Map
        </button>
      </div>
      <div className="footer-group center">
        {partyName && <span className="active-party-label">{partyName}</span>}
      </div>
      <div className="footer-group">
        <button className="btn-journal-gold" onClick={() => openModal('quest-tracker')}>
          Quests
        </button>
        <button className="btn-oracle" onClick={() => openModal('gm-tools')}>
          GM Tools
        </button>
        <button
          className="btn-dice-inline"
          {...d6Press}
          onContextMenu={(e) => handleContextMenu(e, 1, 6, 'd6')}
          title="Tap: d6 · Hold: d6!"
        >
          d6
        </button>
        <button
          className="btn-dice-inline"
          onClick={() => rollStandard(2, 6, '2d6', false)}
          title="Roll 2d6"
        >
          2d6
        </button>
        <button
          className="btn-dice-inline"
          {...d8Press}
          onContextMenu={(e) => handleContextMenu(e, 1, 8, 'd8')}
          title="Tap: d8 · Hold: d8!"
        >
          d8
        </button>
        <button
          className="btn-dice-inline"
          onClick={handleD66}
          title="Roll d66"
        >
          d66
        </button>
        <button className="btn-main" onClick={onSave}>
          Save
        </button>
        <button className="btn-main" onClick={onQuit}>
          Quit
        </button>
      </div>

      {toast && (
        <DiceToast
          key={toast.key}
          total={toast.total}
          detail={toast.detail}
          label={toast.label}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}
```

**Step 2: Add dice button styles to `FooterBar.css`**

Add before the `@media` query:

```css
.btn-dice-inline {
  background: var(--btn-bg);
  border: 2px dotted var(--global-accent);
  color: var(--global-accent);
  border-radius: 5px;
  cursor: pointer;
  padding: 6px 10px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  font-size: 0.85em;
  transition: all 0.2s;
  min-width: 36px;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}

.btn-dice-inline:hover {
  background: var(--btn-hover);
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
}

.btn-dice-inline:active {
  box-shadow: 0 0 12px var(--global-accent), inset 0 0 4px rgba(212, 175, 55, 0.2);
  border-style: solid;
}
```

Also add to the mobile media query:

```css
.btn-dice-inline {
  padding: 6px 6px;
  font-size: 0.75em;
  min-width: 36px;
}
```

Also remove `.btn-dice` from the shared button rule (line 53) since that class is no longer used.

**Step 3: Run build to verify TypeScript compiles**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add src/components/layout/FooterBar.tsx src/components/layout/FooterBar.css
git commit -m "feat: replace Dice modal button with inline dice buttons in footer"
```

---

### Task 6: Remove DiceRollerModal

**Files:**
- Delete: `src/components/modals/DiceRollerModal.tsx`
- Delete: `src/components/modals/DiceRollerModal.css`
- Modify: `src/components/modals/ModalManager.tsx`

**Step 1: Remove DiceRollerModal from ModalManager**

In `src/components/modals/ModalManager.tsx`:

- Remove the import: `import { DiceRollerModal } from './DiceRollerModal'`
- Remove the JSX line: `<DiceRollerModal isOpen={activeModal === 'dice-roller'} onClose={closeModal} />`

**Step 2: Delete the DiceRollerModal files**

```bash
rm src/components/modals/DiceRollerModal.tsx src/components/modals/DiceRollerModal.css
```

**Step 3: Run build to verify nothing breaks**

Run: `npm run build`
Expected: Build succeeds — no remaining references to DiceRollerModal

**Step 4: Run all tests to verify nothing breaks**

Run: `npm run test`
Expected: All tests pass

**Step 5: Commit**

```bash
git add -u src/components/modals/
git commit -m "refactor: remove DiceRollerModal (replaced by inline footer buttons)"
```

---

### Task 7: Final verification

**Step 1: Run full test suite**

Run: `npm run test`
Expected: All tests pass (including new useLongPress and DiceToast tests)

**Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors

**Step 3: Manual smoke test**

Run: `npm run dev`

Verify:
- Footer shows d6, 2d6, d8, d66 buttons with dotted border and monospace font
- Tapping d6 shows toast at top center with the result
- Tapping 2d6 shows toast with total and detail (e.g. "3 + 4")
- Tapping d8 shows toast with result
- Tapping d66 shows toast with two-digit result and no detail
- Long-pressing d6 shows an exploding result with "d6!" label
- Long-pressing d8 shows an exploding result with "d8!" label
- Right-clicking d6 or d8 on desktop triggers exploding roll
- Toast auto-dismisses after ~3 seconds
- Clicking toast dismisses it immediately
- Rolling again while toast is showing replaces it
- No "Dice" modal button remains in the footer
- The old dice roller modal is not accessible anywhere

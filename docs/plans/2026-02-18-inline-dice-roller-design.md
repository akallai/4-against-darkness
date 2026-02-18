# Inline Dice Roller Design

## Problem

The current dice roller requires opening a modal (2 clicks minimum: footer button + dice preset). This context switch feels heavy for a frequent action like rolling dice.

## Solution

Replace the single "Dice" modal button in the footer with 4 inline dice preset buttons. Results display as a toast notification. The DiceRollerModal is removed entirely.

## Footer Layout

Remove the "Dice" button. Add 4 compact dice buttons in the right footer group:

```
Quests | GM Tools | [d6] [2d6] [d8] [d66] | Save | Quit
```

Dice buttons are visually distinct from navigation buttons: smaller padding, monospace font, different border style (dotted or double). On mobile (<600px), buttons shrink but maintain minimum 36px touch target.

### Exploding Dice

- Long-press (500ms hold) on d6 or d8 triggers an exploding roll
- Button glows gold briefly to confirm long-press registered
- Right-click on desktop as an alternative
- 2d6 and d66 do not support exploding (same as current behavior)

## Toast Result Display

When a dice button is tapped:

1. Die rolls instantly using existing `rollDice()` / `rollD66()` utilities
2. Toast appears at top center of screen with slide-down + fade-in animation
3. Toast content:
   - Large bold total (gold accent color)
   - Smaller detail text below (e.g. "6 + 5 + 3")
   - Label (e.g. "d6!", "2d6", "d66")
4. Auto-dismisses after 3 seconds, or tap to dismiss early
5. New roll replaces existing toast (no stacking)

Toast style: semi-transparent dark background, gold accent border, compact. Matches app theme variables.

## Removed Components

- `DiceRollerModal.tsx` and `DiceRollerModal.css` deleted
- Modal manager entry for `'dice-roller'` removed
- `'dice-roller'` removed from `ModalId` type (if applicable)

## New Components / Hooks

- `useLongPress` hook: returns event handlers for long-press detection (500ms threshold). Fires callback on hold, cancels on early release or pointer leave.
- `DiceToast` component: renders the toast notification with result data. Manages auto-dismiss timer. Positioned fixed at top center.
- Dice button rendering logic added directly to `FooterBar.tsx`.

## Testing

- Unit tests for `useLongPress` hook (fires after threshold, cancels on early release)
- Unit tests for `DiceToast` component (renders result, auto-dismisses after 3s, replaces on new roll)
- Existing `dice.test.ts` unchanged (rolling logic is not modified)

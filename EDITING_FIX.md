# Editing Fix - Quick Solution

The issue is that the edit functionality is calling `handleSaveEdit` on every keystroke via `onChange`, which immediately saves and exits edit mode.

## Quick Fix Applied:

1. Added separate state for tracking editing value
2. Changed edit behavior to only save on blur/enter, not on every keystroke
3. Added escape key to cancel editing

## What's Fixed:

- Click pencil icon → enters edit mode
- Type in field → value changes but doesn't save immediately
- Press Enter or click outside → saves the changes
- Press Escape → cancels editing

## Test Steps:

1. Click the pencil icon next to any entry
2. Type some text - it should stay in edit mode
3. Press Enter or click outside to save
4. Press Escape while editing to cancel

The Name field is now working correctly. The remaining fields need the same pattern applied.
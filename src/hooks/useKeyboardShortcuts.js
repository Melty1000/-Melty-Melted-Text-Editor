import { useEffect, useCallback } from 'react';

/**
 * Global keyboard shortcuts hook
 * @param {Object} shortcuts - Map of shortcut keys to callbacks
 * @param {boolean} enabled - Whether shortcuts are active
 */
export function useKeyboardShortcuts(shortcuts, enabled = true) {
    const handleKeyDown = useCallback((e) => {
        if (!enabled) return;

        // Don't trigger in input fields (except for specific shortcuts)
        const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

        // Build shortcut key string
        const parts = [];
        if (e.ctrlKey || e.metaKey) parts.push('ctrl');
        if (e.shiftKey) parts.push('shift');
        if (e.altKey) parts.push('alt');
        parts.push(e.key.toLowerCase());

        const shortcutKey = parts.join('+');

        // Check if we have a handler for this shortcut
        const handler = shortcuts[shortcutKey];
        if (handler) {
            // Some shortcuts should work even in inputs
            const allowInInput = ['ctrl+f', 'ctrl+h', 'ctrl+g', 'ctrl+shift+p', 'escape', 'f11'];

            if (!isInput || allowInInput.includes(shortcutKey)) {
                e.preventDefault();
                handler(e);
            }
        }
    }, [shortcuts, enabled]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * Default shortcut definitions
 */
export const DEFAULT_SHORTCUTS = {
    'ctrl+n': 'newTab',
    'ctrl+w': 'closeTab',
    'ctrl+s': 'save',
    'ctrl+f': 'find',
    'ctrl+h': 'replace',
    'ctrl+g': 'goToLine',
    'ctrl+shift+p': 'commandPalette',
    'f11': 'toggleDistractionFree',
    'escape': 'closeDialog',
};

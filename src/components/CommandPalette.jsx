import { useState, useRef, useEffect, useMemo } from 'react';

const COMMANDS = [
    { id: 'newTab', label: 'New Tab', shortcut: 'Ctrl+N', category: 'File' },
    { id: 'closeTab', label: 'Close Tab', shortcut: 'Ctrl+W', category: 'File' },
    { id: 'save', label: 'Save/Export', shortcut: 'Ctrl+S', category: 'File' },
    { id: 'find', label: 'Find', shortcut: 'Ctrl+F', category: 'Edit' },
    { id: 'replace', label: 'Find and Replace', shortcut: 'Ctrl+H', category: 'Edit' },
    { id: 'goToLine', label: 'Go to Line', shortcut: 'Ctrl+G', category: 'Edit' },
    { id: 'toggleDistractionFree', label: 'Toggle Distraction-Free Mode', shortcut: 'F11', category: 'View' },
    { id: 'toggleMinimap', label: 'Toggle Minimap', shortcut: '', category: 'View' },
    { id: 'toggleWordWrap', label: 'Toggle Word Wrap', shortcut: '', category: 'View' },
    { id: 'themeMelty', label: 'Theme: Melty', shortcut: '', category: 'Theme' },
    { id: 'themeDracula', label: 'Theme: Dracula', shortcut: '', category: 'Theme' },
    { id: 'themeNord', label: 'Theme: Nord', shortcut: '', category: 'Theme' },
    { id: 'themeMonokai', label: 'Theme: Monokai', shortcut: '', category: 'Theme' },
    { id: 'themeGithub', label: 'Theme: GitHub Dark', shortcut: '', category: 'Theme' },
    { id: 'themeObsidian', label: 'Theme: Obsidian', shortcut: '', category: 'Theme' },
];

export function CommandPalette({ isOpen, onClose, onCommand }) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const filteredCommands = useMemo(() => {
        if (!query) return COMMANDS;
        const lower = query.toLowerCase();
        return COMMANDS.filter(cmd =>
            cmd.label.toLowerCase().includes(lower) ||
            cmd.category.toLowerCase().includes(lower)
        );
    }, [query]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setQuery('');
            setSelectedIndex(0);
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
            e.preventDefault();
            onCommand(filteredCommands[selectedIndex].id);
            onClose();
        }
    };

    const handleClick = (cmd) => {
        onCommand(cmd.id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="palette-overlay" onClick={onClose} />
            <div className="command-palette" onKeyDown={handleKeyDown}>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a command..."
                    className="palette-input"
                />
                <div className="palette-list" ref={listRef}>
                    {filteredCommands.map((cmd, i) => (
                        <div
                            key={cmd.id}
                            className={`palette-item ${i === selectedIndex ? 'selected' : ''}`}
                            onClick={() => handleClick(cmd)}
                            onMouseEnter={() => setSelectedIndex(i)}
                        >
                            <span className="palette-label">{cmd.label}</span>
                            <span className="palette-meta">
                                <span className="palette-category">{cmd.category}</span>
                                {cmd.shortcut && <span className="palette-shortcut">{cmd.shortcut}</span>}
                            </span>
                        </div>
                    ))}
                    {filteredCommands.length === 0 && (
                        <div className="palette-empty">No commands found</div>
                    )}
                </div>
            </div>
            <style>{`
                .palette-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                }
                .command-palette {
                    position: fixed;
                    top: 15%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 90%;
                    max-width: 500px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    z-index: 1001;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    overflow: hidden;
                }
                .palette-input {
                    width: 100%;
                    padding: 14px 16px;
                    font-size: 15px;
                    background: var(--bg-primary);
                    border: none;
                    border-bottom: 1px solid var(--border);
                    color: var(--text-primary);
                    outline: none;
                }
                .palette-input::placeholder {
                    color: var(--text-tertiary);
                }
                .palette-list {
                    max-height: 320px;
                    overflow-y: auto;
                }
                .palette-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 16px;
                    cursor: pointer;
                    transition: background var(--transition-fast);
                }
                .palette-item:hover, .palette-item.selected {
                    background: var(--bg-hover);
                }
                .palette-label {
                    font-size: 14px;
                    color: var(--text-primary);
                }
                .palette-meta {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                .palette-category {
                    font-size: 11px;
                    color: var(--text-tertiary);
                    text-transform: uppercase;
                }
                .palette-shortcut {
                    font-size: 12px;
                    color: var(--text-secondary);
                    background: var(--bg-tertiary);
                    padding: 2px 6px;
                    border-radius: var(--radius-sm);
                    font-family: monospace;
                }
                .palette-empty {
                    padding: 20px;
                    text-align: center;
                    color: var(--text-tertiary);
                    font-size: 13px;
                }
            `}</style>
        </>
    );
}

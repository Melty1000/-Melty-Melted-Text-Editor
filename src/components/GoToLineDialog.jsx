import { useState, useRef, useEffect } from 'react';

export function GoToLineDialog({ isOpen, onClose, onGoToLine, maxLine = 1 }) {
    const [lineNumber, setLineNumber] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const line = parseInt(lineNumber, 10);
        if (line >= 1 && line <= maxLine) {
            onGoToLine(line);
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="dialog-overlay" onClick={onClose} />
            <div className="goto-dialog" onKeyDown={handleKeyDown}>
                <form onSubmit={handleSubmit}>
                    <label>
                        Go to Line (1-{maxLine})
                        <input
                            ref={inputRef}
                            type="number"
                            min="1"
                            max={maxLine}
                            value={lineNumber}
                            onChange={(e) => setLineNumber(e.target.value)}
                            placeholder="Line number..."
                        />
                    </label>
                    <div className="dialog-buttons">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Go</button>
                    </div>
                </form>
            </div>
            <style>{`
                .dialog-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                }
                .goto-dialog {
                    position: fixed;
                    top: 20%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--bg-secondary);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 16px 20px;
                    z-index: 1001;
                    min-width: 280px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }
                .goto-dialog label {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    font-size: 13px;
                    color: var(--text-secondary);
                }
                .goto-dialog input {
                    padding: 8px 12px;
                    font-size: 14px;
                    background: var(--bg-primary);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    color: var(--text-primary);
                    outline: none;
                }
                .goto-dialog input:focus {
                    border-color: var(--accent);
                }
                .dialog-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    margin-top: 16px;
                }
                .dialog-buttons button {
                    padding: 6px 14px;
                    font-size: 13px;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }
                .dialog-buttons button[type="button"] {
                    background: var(--bg-tertiary);
                    color: var(--text-secondary);
                    border: 1px solid var(--border);
                }
                .dialog-buttons button[type="submit"] {
                    background: var(--accent);
                    color: var(--bg-primary);
                    border: none;
                    font-weight: 500;
                }
                .dialog-buttons button:hover {
                    filter: brightness(1.1);
                }
            `}</style>
        </>
    );
}

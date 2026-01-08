import { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';

export function MenuBar({
    onNewTab,
    onOpenFile,
    onSaveTab,
    onExportTab,
    activeTabId,
    recentFiles,
    onOpenRecent,
    onClearRecent,
    minimap,
    wordWrap,
    onToggleMinimap,
    onToggleWordWrap,
}) {
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = (name) => {
        setActiveMenu(activeMenu === name ? null : name);
    };

    const handleAction = (action) => {
        action?.();
        setActiveMenu(null);
    };

    // Window controls (Electron only)
    const handleMinimize = () => window.electronAPI?.minimize();
    const handleMaximize = () => window.electronAPI?.maximize();
    const handleClose = () => window.electronAPI?.close();

    return (
        <div className="menu-bar" ref={menuRef}>
            <div className="menu-bar__left">
                <div className="menu-bar__logo">
                    <img src="./favicon.png" alt="Melted" className="menu-bar__logo-img" />
                    <span className="menu-bar__logo-text">Melted</span>
                </div>

                {/* File Menu */}
                <div className="menu-bar__item">
                    <button
                        className={`menu-bar__btn ${activeMenu === 'file' ? 'active' : ''}`}
                        onClick={() => toggleMenu('file')}
                    >
                        File
                    </button>
                    {activeMenu === 'file' && (
                        <div className="menu-bar__dropdown">
                            <button className="menu-bar__dropdown-item" onClick={() => handleAction(onNewTab)}>
                                <span>New Tab</span>
                                <span className="menu-bar__shortcut-key">Ctrl+N</span>
                            </button>
                            <button className="menu-bar__dropdown-item" onClick={() => handleAction(onOpenFile)}>
                                <span>Open File...</span>
                                <span className="menu-bar__shortcut-key">Ctrl+O</span>
                            </button>

                            {recentFiles.length > 0 && (
                                <>
                                    <div className="menu-bar__divider" />
                                    <div className="menu-bar__submenu-label">Open Recent</div>
                                    {recentFiles.slice(0, 5).map((file, i) => (
                                        <button key={i} className="menu-bar__dropdown-item menu-bar__dropdown-item--small" onClick={() => handleAction(() => onOpenRecent(file))}>
                                            <span>{file.name}</span>
                                        </button>
                                    ))}
                                    <button className="menu-bar__dropdown-item menu-bar__dropdown-item--muted" onClick={() => handleAction(onClearRecent)}>
                                        <span>Clear Recent</span>
                                    </button>
                                </>
                            )}

                            <div className="menu-bar__divider" />
                            <button className="menu-bar__dropdown-item" onClick={() => handleAction(() => onSaveTab(activeTabId))}>
                                <span>Save</span>
                                <span className="menu-bar__shortcut-key">Ctrl+S</span>
                            </button>
                            <button className="menu-bar__dropdown-item" onClick={() => handleAction(() => onExportTab(activeTabId))}>
                                <span>Export / Download...</span>
                                <span className="menu-bar__shortcut-key">Ctrl+Shift+S</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* View Menu */}
                <div className="menu-bar__item">
                    <button
                        className={`menu-bar__btn ${activeMenu === 'view' ? 'active' : ''}`}
                        onClick={() => toggleMenu('view')}
                    >
                        View
                    </button>
                    {activeMenu === 'view' && (
                        <div className="menu-bar__dropdown">
                            <button className="menu-bar__dropdown-item" onClick={() => handleAction(onToggleMinimap)}>
                                <span>{minimap ? '✓' : '　'} Minimap</span>
                            </button>
                            <button className="menu-bar__dropdown-item" onClick={() => handleAction(onToggleWordWrap)}>
                                <span>{wordWrap ? '✓' : '　'} Word Wrap</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Help Menu */}
                <div className="menu-bar__item">
                    <button
                        className={`menu-bar__btn ${activeMenu === 'help' ? 'active' : ''}`}
                        onClick={() => toggleMenu('help')}
                    >
                        Help
                    </button>
                    {activeMenu === 'help' && (
                        <div className="menu-bar__dropdown">
                            <div className="menu-bar__submenu-label">Shortcuts</div>
                            <div className="menu-bar__dropdown-item menu-bar__dropdown-item--small menu-bar__dropdown-item--muted">
                                <span>Find</span><span className="menu-bar__shortcut-key">Ctrl+F</span>
                            </div>
                            <div className="menu-bar__dropdown-item menu-bar__dropdown-item--small menu-bar__dropdown-item--muted">
                                <span>Replace</span><span className="menu-bar__shortcut-key">Ctrl+H</span>
                            </div>
                            <div className="menu-bar__dropdown-item menu-bar__dropdown-item--small menu-bar__dropdown-item--muted">
                                <span>Go to Line</span><span className="menu-bar__shortcut-key">Ctrl+G</span>
                            </div>
                            <div className="menu-bar__dropdown-item menu-bar__dropdown-item--small menu-bar__dropdown-item--muted">
                                <span>Command Palette</span><span className="menu-bar__shortcut-key">Ctrl+Shift+P</span>
                            </div>
                            <div className="menu-bar__dropdown-item menu-bar__dropdown-item--small menu-bar__dropdown-item--muted">
                                <span>Distraction-Free</span><span className="menu-bar__shortcut-key">F11</span>
                            </div>
                            <div className="menu-bar__dropdown-item menu-bar__dropdown-item--small menu-bar__dropdown-item--muted">
                                <span>Multi-Cursor</span><span className="menu-bar__shortcut-key">Alt+Click</span>
                            </div>
                            <div className="menu-bar__divider" />
                            <button className="menu-bar__dropdown-item" onClick={() => window.open('https://github.com/Melty1000/-Melty-Melted-Text-Editor', '_blank')}>
                                <span>GitHub</span>
                            </button>
                            <div className="menu-bar__divider" />
                            <div className="menu-bar__submenu-label">Support Me ❤️</div>
                            <button className="menu-bar__dropdown-item" onClick={() => window.open('https://ko-fi.com/melty1000', '_blank')}>
                                <span>Ko-fi</span>
                            </button>
                            <button className="menu-bar__dropdown-item" onClick={() => window.open('https://www.twitch.tv/melty1000', '_blank')}>
                                <span>Twitch</span>
                            </button>
                            <button className="menu-bar__dropdown-item" onClick={() => window.open('https://www.youtube.com/@melty_1000', '_blank')}>
                                <span>YouTube</span>
                            </button>
                            <button className="menu-bar__dropdown-item" onClick={() => window.open('https://discord.gg/8EfuxXgVyT', '_blank')}>
                                <span>Discord</span>
                            </button>
                            <button className="menu-bar__dropdown-item" onClick={() => window.open('https://x.com/melty1000', '_blank')}>
                                <span>X (Twitter)</span>
                            </button>
                            <div className="menu-bar__divider" />
                            <div className="menu-bar__dropdown-item menu-bar__dropdown-item--muted">
                                <span>Version 1.0.0</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Drag region */}
            <div className="menu-bar__drag-region"></div>

            {/* Window controls - always show */}
            <div className="menu-bar__window-controls">
                <button className="window-btn" onClick={handleMinimize} title="Minimize">
                    <svg width="10" height="1"><rect width="10" height="1" fill="currentColor" /></svg>
                </button>
                <button className="window-btn" onClick={handleMaximize} title="Maximize">
                    <svg width="10" height="10"><rect width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
                </button>
                <button className="window-btn window-btn--close" onClick={handleClose} title="Close">
                    <svg width="10" height="10"><line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" /><line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1.5" /></svg>
                </button>
            </div>

            <style>{`
        .menu-bar {
          display: flex;
          align-items: center;
          padding: 0 8px;
          height: 36px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border);
          user-select: none;
        }
        
        .menu-bar__left { display: flex; align-items: center; }
        
        .menu-bar__logo {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px 0 4px;
          margin-right: 8px;
        }
        
        .menu-bar__logo-img { width: 24px; height: 24px; }
        .menu-bar__logo-text { font-size: 14px; font-weight: 600; color: var(--accent); }
        .menu-bar__item { position: relative; }
        
        .menu-bar__btn {
          padding: 4px 10px;
          font-size: 13px;
          color: var(--text-primary);
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
        }
        
        .menu-bar__btn:hover, .menu-bar__btn.active { background: var(--bg-hover); }
        
        .menu-bar__dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 2px;
          min-width: 220px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          z-index: 1000;
          padding: 4px 0;
        }
        
        .menu-bar__dropdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 6px 12px;
          font-size: 13px;
          color: var(--text-primary);
          text-align: left;
          transition: background var(--transition-fast);
        }
        
        .menu-bar__dropdown-item:hover { background: var(--bg-hover); }
        .menu-bar__dropdown-item--small { font-size: 12px; padding: 4px 12px 4px 20px; }
        .menu-bar__dropdown-item--muted { color: var(--text-muted); }
        .menu-bar__submenu-label { padding: 4px 12px; font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
        .menu-bar__shortcut-key { font-size: 11px; color: var(--text-muted); }
        .menu-bar__divider { height: 1px; background: var(--border); margin: 4px 0; }
        
        .menu-bar__drag-region {
          flex: 1;
          height: 100%;
          -webkit-app-region: drag;
        }
        
        .menu-bar__window-controls {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: 8px;
          -webkit-app-region: no-drag;
        }
        
        .window-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 28px;
          color: var(--text-primary);
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
        }
        
        .window-btn:hover { background: var(--bg-hover); }
        .window-btn--close:hover { background: #e81123; color: white; }
      `}</style>
        </div>
    );
}

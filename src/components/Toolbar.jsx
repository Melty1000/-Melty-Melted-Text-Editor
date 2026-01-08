import { useState, useEffect, useRef } from 'react';
import { Icon } from './Icons';

const THEMES = [
  { id: 'melty', name: 'MELTY' },
  { id: 'obsidian', name: 'Obsidian' },
  { id: 'dracula', name: 'Dracula' },
  { id: 'nord', name: 'Nord' },
  { id: 'monokai', name: 'Monokai' },
  { id: 'github', name: 'GitHub Dark' },
];

const FONTS = [
  { id: 'jetbrains', name: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { id: 'fira', name: 'Fira Code', value: "'Fira Code', monospace" },
  { id: 'source', name: 'Source Code Pro', value: "'Source Code Pro', monospace" },
];

const FONT_SIZES = [12, 13, 14, 15, 16, 18, 20];

export function Toolbar({
  tabs,
  activeTabId,
  compareMode,
  onStartCompare,
  onExitCompare,
  diffOnlyMode,
  onToggleDiffOnly,
  theme,
  onThemeChange,
  font,
  fontSize,
  onFontChange,
  onFontSizeChange,
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toolbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Get other tabs (not the active one)
  const otherTabs = tabs.filter(t => t.id !== activeTabId);
  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleSelectCompareFile = (modifiedId) => {
    onStartCompare(activeTabId, modifiedId);
    setActiveDropdown(null);
  };

  return (
    <div className="toolbar" ref={toolbarRef}>
      <div className="toolbar__left">
        {!compareMode ? (
          <div className="toolbar__dropdown-group">
            <button
              className="toolbar__btn"
              onClick={() => toggleDropdown('compare')}
              disabled={tabs.length < 2}
              title="Compare current tab with another"
            >
              <Icon name="compare" /> Compare
              <Icon name="chevronDown" size={12} />
            </button>

            {activeDropdown === 'compare' && (
              <div className="toolbar__dropdown">
                <div className="toolbar__dropdown-header">
                  Comparing: <strong>{activeTab?.name}</strong>
                </div>
                <div className="toolbar__dropdown-divider" />
                <div className="toolbar__dropdown-label">Compare with:</div>
                {otherTabs.map(tab => (
                  <button
                    key={tab.id}
                    className="toolbar__dropdown-item"
                    onClick={() => handleSelectCompareFile(tab.id)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="toolbar__btn toolbar__btn--active" onClick={onExitCompare}>
              <Icon name="arrowLeft" /> Exit Compare
            </button>
            <button
              className={`toolbar__btn ${diffOnlyMode ? 'toolbar__btn--active' : ''}`}
              onClick={onToggleDiffOnly}
            >
              <Icon name="diffOnly" /> {diffOnlyMode ? 'Show All' : 'Diff Only'}
            </button>
          </>
        )}
      </div>

      <div className="toolbar__right">
        {/* Font Selector */}
        <div className="toolbar__dropdown-group">
          <button className="toolbar__btn" onClick={() => toggleDropdown('font')}>
            <Icon name="font" />
            <span>{fontSize}px</span>
            <Icon name="chevronDown" size={12} />
          </button>

          {activeDropdown === 'font' && (
            <div className="toolbar__dropdown toolbar__dropdown--right toolbar__dropdown--wide">
              <div className="toolbar__dropdown-section">
                <span className="toolbar__dropdown-label">Font Family</span>
                {FONTS.map(f => (
                  <button
                    key={f.id}
                    className={`toolbar__dropdown-item ${font === f.value ? 'selected' : ''}`}
                    style={{ fontFamily: f.value }}
                    onClick={() => onFontChange(f.value)}
                  >
                    {f.name}
                    {font === f.value && <Icon name="check" />}
                  </button>
                ))}
              </div>
              <div className="toolbar__dropdown-divider" />
              <div className="toolbar__dropdown-section">
                <span className="toolbar__dropdown-label">Font Size</span>
                <div className="toolbar__size-grid">
                  {FONT_SIZES.map(size => (
                    <button
                      key={size}
                      className={`toolbar__size-btn ${fontSize === size ? 'selected' : ''}`}
                      onClick={() => onFontSizeChange(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme */}
        <div className="toolbar__dropdown-group">
          <button className="toolbar__btn" onClick={() => toggleDropdown('theme')}>
            <Icon name="theme" />
            <span>{THEMES.find(t => t.id === theme)?.name || 'Theme'}</span>
            <Icon name="chevronDown" size={12} />
          </button>

          {activeDropdown === 'theme' && (
            <div className="toolbar__dropdown toolbar__dropdown--right">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  className={`toolbar__dropdown-item ${theme === t.id ? 'selected' : ''}`}
                  onClick={() => { onThemeChange(t.id); setActiveDropdown(null); }}
                >
                  {t.name}
                  {theme === t.id && <Icon name="check" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 12px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
        }
        
        .toolbar__left, .toolbar__right { display: flex; gap: 4px; align-items: center; }
        
        .toolbar__btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: transparent;
          border-radius: var(--radius-md);
          font-size: 13px;
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }
        
        .toolbar__btn:hover:not(:disabled) { background: var(--bg-hover); }
        .toolbar__btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .toolbar__btn--active { background: var(--accent-muted); color: var(--accent); }
        
        .toolbar__dropdown-group { position: relative; }
        
        .toolbar__dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 4px;
          min-width: 180px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          z-index: 100;
        }
        
        .toolbar__dropdown--wide { min-width: 200px; }
        .toolbar__dropdown--right { left: auto; right: 0; }
        .toolbar__dropdown-section { padding: 8px 12px; }
        .toolbar__dropdown-header { padding: 8px 12px; font-size: 12px; color: var(--text-secondary); background: var(--bg-tertiary); }
        .toolbar__dropdown-label { display: block; font-size: 11px; color: var(--text-muted); text-transform: uppercase; padding: 4px 12px; }
        
        .toolbar__dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 8px 12px;
          text-align: left;
          font-size: 13px;
          color: var(--text-primary);
          transition: background var(--transition-fast);
        }
        
        .toolbar__dropdown-item:hover { background: var(--bg-hover); }
        .toolbar__dropdown-item.selected { color: var(--accent); }
        .toolbar__dropdown-divider { height: 1px; background: var(--border); }
        
        .toolbar__size-grid { display: flex; gap: 4px; flex-wrap: wrap; }
        .toolbar__size-btn {
          padding: 4px 10px;
          font-size: 12px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }
        .toolbar__size-btn:hover { background: var(--bg-hover); }
        .toolbar__size-btn.selected { background: var(--accent); color: white; }
        
        .icon { display: inline-flex; align-items: center; justify-content: center; }
        .icon svg { width: 100%; height: 100%; }
      `}</style>
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons';

export function TabBar({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onTabRename,
  onAddTab,
  selectedForCompare = [null, null],
}) {
  const [editingTabId, setEditingTabId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tabs.length]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -150 : 150;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const startEditing = (tab, e) => {
    e.stopPropagation();
    setEditingTabId(tab.id);
    setEditValue(tab.name);
  };

  const finishEditing = () => {
    if (editingTabId && editValue.trim()) {
      onTabRename(editingTabId, editValue.trim());
    }
    setEditingTabId(null);
    setEditValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditingTabId(null);
      setEditValue('');
    }
  };

  return (
    <div className="tab-bar">
      {/* Scroll left button */}
      {showScrollButtons && (
        <button className="tab-scroll-btn" onClick={() => scroll('left')} title="Scroll left">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M7 1L2 6L7 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      <div className="tab-list" ref={scrollRef}>
        <AnimatePresence mode="popLayout">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const compareSlot = selectedForCompare.indexOf(tab.id);
            const isSelectedForCompare = compareSlot !== -1;
            const isEditing = editingTabId === tab.id;

            return (
              <motion.div
                key={tab.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className={`tab ${isActive ? 'tab--active' : ''} ${isSelectedForCompare ? 'tab--compare' : ''}`}
                onClick={() => onTabClick(tab.id)}
              >
                {isEditing ? (
                  <input
                    type="text"
                    className="tab__input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={finishEditing}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className="tab__name"
                    onDoubleClick={(e) => startEditing(tab, e)}
                    title={tab.path || tab.name}
                  >
                    {tab.name}
                  </span>
                )}
                {isSelectedForCompare && (
                  <span className="tab__compare-badge">{compareSlot + 1}</span>
                )}
                <button
                  className="tab__close"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  aria-label={`Close ${tab.name}`}
                >
                  <Icon name="close" size={12} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add Tab Button - INSIDE the tab list */}
        <button className="tab-add-btn" onClick={onAddTab} title="New Tab">
          <Icon name="plus" size={14} />
        </button>
      </div>

      {/* Scroll right button */}
      {showScrollButtons && (
        <button className="tab-scroll-btn" onClick={() => scroll('right')} title="Scroll right">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      <style>{`
        .tab-bar {
          display: flex;
          align-items: flex-end;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          padding: 6px 8px 0;
        }
        
        .tab-scroll-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 28px;
          margin-bottom: 2px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }
        
        .tab-scroll-btn:hover {
          background: var(--bg-hover);
          color: var(--accent);
        }
        
        .tab-list {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          min-height: 32px;
          overflow-x: hidden;
          flex: 1;
          margin: 0 4px;
        }
        
        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          cursor: pointer;
          transition: background var(--transition-fast);
          min-width: 100px;
          max-width: 180px;
          flex-shrink: 0;
        }
        
        .tab:hover { background: var(--bg-hover); }
        
        .tab--active {
          background: var(--bg-primary);
          border-bottom: 2px solid var(--accent);
        }
        
        .tab--compare { border-top: 2px solid var(--accent); }
        
        .tab__name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          color: var(--text-primary);
          cursor: text;
        }
        
        .tab__input {
          flex: 1;
          min-width: 60px;
          padding: 2px 4px;
          font-size: 12px;
          background: var(--bg-primary);
          border: 1px solid var(--accent);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          outline: none;
        }
        
        .tab__compare-badge {
          background: var(--accent);
          color: white;
          font-size: 9px;
          font-weight: bold;
          padding: 1px 5px;
          border-radius: 8px;
        }
        
        .tab__close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          transition: all var(--transition-fast);
          opacity: 0.6;
        }
        
        .tab:hover .tab__close { opacity: 1; }
        .tab__close:hover { background: var(--danger); color: white; }
        
        .tab-add-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          margin-left: 4px;
          margin-bottom: 2px;
          background: transparent;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }
        
        .tab-add-btn:hover {
          background: var(--bg-hover);
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}

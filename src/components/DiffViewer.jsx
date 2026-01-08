import { lazy, Suspense, useRef, useCallback, useEffect, useMemo, useState } from 'react';
import { MONACO_THEMES, detectLanguage } from '../utils/monacoConfig';
import { calculateDiffStats } from '../utils/diffStats';
import { Icon } from './Icons';

// Lazy load Monaco DiffEditor
const DiffEditor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.DiffEditor })));

export function DiffViewer({
  original,
  modified,
  originalLabel = 'Original',
  modifiedLabel = 'Modified',
  originalId,
  modifiedId,
  theme = 'melty',
  diffOnlyMode = false,
  font,
  fontSize,
  onOriginalChange,
  onModifiedChange,
  onApplyToOriginal,
  onApplyToModified,
}) {
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const disposablesRef = useRef([]);
  const [sashLeft, setSashLeft] = useState(null);

  const stats = useMemo(() => calculateDiffStats(original, modified), [original, modified]);
  const language = useMemo(() => detectLanguage(original || modified), [original, modified]);

  const handleBeforeMount = useCallback((monaco) => {
    monacoRef.current = monaco;
    Object.entries(MONACO_THEMES).forEach(([name, themeData]) => {
      monaco.editor.defineTheme(name, themeData);
    });
  }, []);

  const handleEditorMount = useCallback((editor, monaco) => {
    monacoRef.current = monaco;
    editorRef.current = editor;
    monaco.editor.setTheme(theme);

    const origEditor = editor.getOriginalEditor();
    const modEditor = editor.getModifiedEditor();

    // Store disposables for cleanup
    disposablesRef.current.push(
      origEditor.onDidChangeModelContent(() => {
        if (onOriginalChange) onOriginalChange(origEditor.getValue());
      }),
      modEditor.onDidChangeModelContent(() => {
        if (onModifiedChange) onModifiedChange(modEditor.getValue());
      })
    );
  }, [theme, onOriginalChange, onModifiedChange]);

  // Cleanup Monaco listeners on unmount
  useEffect(() => {
    return () => {
      disposablesRef.current.forEach(d => d.dispose());
      disposablesRef.current = [];
    };
  }, []);

  // Track the sash position directly from the DOM
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSashPosition = () => {
      const sash = containerRef.current.querySelector('.monaco-sash.vertical');
      if (sash) {
        const left = parseFloat(sash.style.left);
        if (!isNaN(left)) {
          setSashLeft(left);
        }
      }
    };

    // Use MutationObserver to watch for sash style changes
    const observer = new MutationObserver(() => {
      updateSashPosition();
    });

    // Start observing after a short delay to let Monaco render
    const timer = setTimeout(() => {
      const sash = containerRef.current?.querySelector('.monaco-sash.vertical');
      if (sash) {
        observer.observe(sash, { attributes: true, attributeFilter: ['style'] });
        updateSashPosition();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (monacoRef.current) monacoRef.current.editor.setTheme(theme);
  }, [theme]);

  return (
    <div className="diff-viewer" ref={containerRef}>
      {/* Stats Bar */}
      <div className="diff-viewer__stats">
        <div className="diff-viewer__stats-left">
          <div className="diff-viewer__stat diff-viewer__stat--added">
            <span className="diff-viewer__stat-icon">+</span>
            <span className="diff-viewer__stat-value">{stats.additions}</span>
          </div>
          <div className="diff-viewer__stat diff-viewer__stat--removed">
            <span className="diff-viewer__stat-icon">−</span>
            <span className="diff-viewer__stat-value">{stats.deletions}</span>
          </div>
          <div className="diff-viewer__stat">
            <span className="diff-viewer__stat-value">{stats.changePercent}%</span>
            <span className="diff-viewer__stat-label">changed</span>
          </div>
        </div>

        <div className="diff-viewer__actions">
          <button className="diff-viewer__action-btn" onClick={onApplyToOriginal} title="Apply all to left">
            <Icon name="arrowLeft" size={14} /> Accept All → Left
          </button>
          <button className="diff-viewer__action-btn" onClick={onApplyToModified} title="Apply all to right">
            Accept All → Right <Icon name="arrowLeft" size={14} className="flip" />
          </button>
        </div>
      </div>

      {/* Header - positioned using sash left value */}
      <div className="diff-viewer__header" ref={headerRef}>
        <div
          className="diff-viewer__label diff-viewer__label--original"
          style={sashLeft !== null ? { width: `${sashLeft}px` } : { width: '50%' }}
        >
          {originalLabel}
        </div>
        <div
          className="diff-viewer__label diff-viewer__label--modified"
          style={sashLeft !== null ? { flex: 1 } : { width: '50%' }}
        >
          {modifiedLabel}
        </div>
      </div>

      <div className="diff-viewer__editor">
        <Suspense fallback={<div className="diff-loading"><div className="diff-loading__spinner"></div></div>}>
          <DiffEditor
            height="100%"
            theme={theme}
            language={language}
            original={original}
            modified={modified}
            beforeMount={handleBeforeMount}
            onMount={handleEditorMount}
            options={{
              fontSize: fontSize || 14,
              fontFamily: font || "'JetBrains Mono', monospace",
              readOnly: false,
              renderSideBySide: true,
              enableSplitViewResizing: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: 'line',
              smoothScrolling: true,
              diffWordWrap: 'on',
              hideUnchangedRegions: { enabled: diffOnlyMode },
              renderOverviewRuler: true,
              ignoreTrimWhitespace: false,
            }}
          />
        </Suspense>
      </div>

      <style>{`
        .diff-viewer {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          background: var(--bg-primary);
        }
        
        .diff-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          background: var(--bg-primary);
        }
        .diff-loading__spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: diff-spin 0.8s linear infinite;
        }
        @keyframes diff-spin { to { transform: rotate(360deg); } }
        
        .diff-viewer__stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 16px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border);
        }
        
        .diff-viewer__stats-left { display: flex; align-items: center; gap: 12px; }
        .diff-viewer__stat { display: flex; align-items: center; gap: 4px; font-size: 12px; }
        .diff-viewer__stat--added { color: var(--diff-added-text); }
        .diff-viewer__stat--removed { color: var(--diff-removed-text); }
        .diff-viewer__stat-icon { font-weight: bold; font-size: 14px; }
        .diff-viewer__stat-value { font-weight: 600; font-family: 'JetBrains Mono', monospace; }
        .diff-viewer__stat-label { color: var(--text-muted); }
        
        .diff-viewer__actions { display: flex; gap: 8px; }
        .diff-viewer__action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          font-size: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }
        .diff-viewer__action-btn:hover { background: var(--accent); border-color: var(--accent); color: white; }
        .diff-viewer__action-btn .flip { transform: rotate(180deg); }
        
        .diff-viewer__header {
          display: flex;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
        }
        
        .diff-viewer__label {
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          box-sizing: border-box;
        }
        
        .diff-viewer__label--original { color: var(--diff-removed-text); border-right: 1px solid var(--border); }
        .diff-viewer__label--modified { color: var(--diff-added-text); }
        .diff-viewer__editor { flex: 1; min-height: 0; }

        /* Enhanced margin styling */
        .monaco-editor .margin-view-overlays .line-delete,
        .monaco-diff-editor .editor.original .margin-view-overlays .current-line {
          background: var(--diff-removed-bg) !important;
          box-shadow: inset 4px 0 0 var(--diff-removed-text);
        }
        
        .monaco-editor .margin-view-overlays .line-insert,
        .monaco-diff-editor .editor.modified .margin-view-overlays .current-line {
          background: var(--diff-added-bg) !important;
          box-shadow: inset 4px 0 0 var(--diff-added-text);
        }
      `}</style>
    </div>
  );
}

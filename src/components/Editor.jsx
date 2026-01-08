import { lazy, Suspense, useRef, useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { MONACO_THEMES, detectLanguage } from '../utils/monacoConfig';

// Lazy load Monaco - this is the biggest bundle (~2MB)
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

// Map file extensions to Monaco language IDs
const EXT_TO_LANG = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    json: 'json', html: 'html', htm: 'html', css: 'css', scss: 'scss', less: 'less',
    md: 'markdown', markdown: 'markdown', py: 'python', rb: 'ruby', php: 'php',
    java: 'java', c: 'c', cpp: 'cpp', h: 'c', hpp: 'cpp', cs: 'csharp',
    go: 'go', rs: 'rust', sql: 'sql', xml: 'xml', yaml: 'yaml', yml: 'yaml',
    sh: 'shell', bash: 'shell', bat: 'bat', ps1: 'powershell', txt: 'plaintext',
};

function getExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

// Loading placeholder while Monaco loads
function EditorLoading() {
    return (
        <div className="editor-loading">
            <div className="editor-loading__spinner"></div>
            <style>{`
                .editor-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex: 1;
                    background: var(--bg-primary);
                }
                .editor-loading__spinner {
                    width: 32px;
                    height: 32px;
                    border: 3px solid rgba(255,255,255,0.1);
                    border-top-color: var(--accent);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

export const Editor = forwardRef(function Editor({ content, onChange, theme = 'melty', font, fontSize, tabName = '', minimap = false, wordWrap = true, onLanguageChange }, ref) {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const [language, setLanguage] = useState('plaintext');
    const detectTimeoutRef = useRef(null);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        openFind: () => {
            editorRef.current?.getAction('actions.find')?.run();
        },
        openReplace: () => {
            editorRef.current?.getAction('editor.action.startFindReplaceAction')?.run();
        },
        goToLine: (line) => {
            if (editorRef.current) {
                editorRef.current.revealLineInCenter(line);
                editorRef.current.setPosition({ lineNumber: line, column: 1 });
                editorRef.current.focus();
            }
        },
        focus: () => {
            editorRef.current?.focus();
        },
    }), []);

    // Detect language - prefer extension, fallback to debounced content detection
    useEffect(() => {
        const ext = getExtension(tabName);
        if (ext && EXT_TO_LANG[ext]) {
            setLanguage(EXT_TO_LANG[ext]);
            onLanguageChange?.(EXT_TO_LANG[ext]);
            return;
        }

        if (detectTimeoutRef.current) {
            clearTimeout(detectTimeoutRef.current);
        }

        detectTimeoutRef.current = setTimeout(() => {
            const detected = detectLanguage(content);
            setLanguage(detected);
            onLanguageChange?.(detected);
        }, 500);

        return () => {
            if (detectTimeoutRef.current) {
                clearTimeout(detectTimeoutRef.current);
            }
        };
    }, [tabName, content, onLanguageChange]);

    const handleBeforeMount = useCallback((monaco) => {
        monacoRef.current = monaco;
        Object.entries(MONACO_THEMES).forEach(([name, themeData]) => {
            monaco.editor.defineTheme(name, themeData);
        });
    }, []);

    const handleEditorMount = useCallback((editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        editor.focus();
        monaco.editor.setTheme(theme);
    }, [theme]);

    useEffect(() => {
        if (monacoRef.current) {
            monacoRef.current.editor.setTheme(theme);
        }
    }, [theme]);

    const handleChange = useCallback((value) => {
        onChange(value || '');
    }, [onChange]);

    return (
        <div className="editor-container">
            <Suspense fallback={<EditorLoading />}>
                <MonacoEditor
                    height="100%"
                    language={language}
                    theme={theme}
                    value={content}
                    onChange={handleChange}
                    beforeMount={handleBeforeMount}
                    onMount={handleEditorMount}
                    options={{
                        fontSize: fontSize || 14,
                        fontFamily: font || "'JetBrains Mono', monospace",
                        lineNumbers: 'on',
                        wordWrap: wordWrap ? 'on' : 'off',
                        minimap: { enabled: minimap },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16, bottom: 16 },
                        renderLineHighlight: 'line',
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        smoothScrolling: true,
                        bracketPairColorization: { enabled: true },
                    }}
                />
            </Suspense>

            <style>{`
        .editor-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          background: var(--bg-primary);
        }
        
        /* Line number gutter - darker with shadow */
        .monaco-editor .margin {
          background: rgba(0, 0, 0, 0.25) !important;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
        }
        
        .monaco-editor .margin-view-overlays {
          background: transparent !important;
        }
      `}</style>
        </div>
    );
});

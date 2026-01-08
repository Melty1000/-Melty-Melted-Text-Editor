// Monaco theme definitions matching our app themes
export const MONACO_THEMES = {
    obsidian: {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
            { token: 'keyword', foreground: '569CD6' },
            { token: 'string', foreground: 'CE9178' },
            { token: 'number', foreground: 'B5CEA8' },
            { token: 'type', foreground: '4EC9B0' },
            { token: 'function', foreground: 'DCDCAA' },
            { token: 'variable', foreground: '9CDCFE' },
            { token: 'constant', foreground: '4FC1FF' },
        ],
        colors: {
            'editor.background': '#1e1e1e',
            'editor.foreground': '#cccccc',
            'editor.lineHighlightBackground': '#2d2d30',
            'editor.selectionBackground': '#264f78',
            'editorCursor.foreground': '#aeafad',
            'editorLineNumber.foreground': '#5a5a5a',
            'editorLineNumber.activeForeground': '#cccccc',
            'editor.inactiveSelectionBackground': '#3a3d41',
        },
    },

    dracula: {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '6272A4', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'FF79C6' },
            { token: 'string', foreground: 'F1FA8C' },
            { token: 'number', foreground: 'BD93F9' },
            { token: 'type', foreground: '8BE9FD', fontStyle: 'italic' },
            { token: 'function', foreground: '50FA7B' },
            { token: 'variable', foreground: 'F8F8F2' },
            { token: 'constant', foreground: 'BD93F9' },
        ],
        colors: {
            'editor.background': '#282a36',
            'editor.foreground': '#f8f8f2',
            'editor.lineHighlightBackground': '#44475a',
            'editor.selectionBackground': '#44475a',
            'editorCursor.foreground': '#f8f8f2',
            'editorLineNumber.foreground': '#6272a4',
            'editorLineNumber.activeForeground': '#f8f8f2',
            'editor.inactiveSelectionBackground': '#44475a80',
        },
    },

    nord: {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '616E88', fontStyle: 'italic' },
            { token: 'keyword', foreground: '81A1C1' },
            { token: 'string', foreground: 'A3BE8C' },
            { token: 'number', foreground: 'B48EAD' },
            { token: 'type', foreground: '8FBCBB' },
            { token: 'function', foreground: '88C0D0' },
            { token: 'variable', foreground: 'D8DEE9' },
            { token: 'constant', foreground: 'B48EAD' },
        ],
        colors: {
            'editor.background': '#2e3440',
            'editor.foreground': '#d8dee9',
            'editor.lineHighlightBackground': '#3b4252',
            'editor.selectionBackground': '#434c5e',
            'editorCursor.foreground': '#d8dee9',
            'editorLineNumber.foreground': '#4c566a',
            'editorLineNumber.activeForeground': '#d8dee9',
            'editor.inactiveSelectionBackground': '#434c5e80',
        },
    },

    monokai: {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '75715E', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'F92672' },
            { token: 'string', foreground: 'E6DB74' },
            { token: 'number', foreground: 'AE81FF' },
            { token: 'type', foreground: '66D9EF', fontStyle: 'italic' },
            { token: 'function', foreground: 'A6E22E' },
            { token: 'variable', foreground: 'F8F8F2' },
            { token: 'constant', foreground: 'AE81FF' },
        ],
        colors: {
            'editor.background': '#272822',
            'editor.foreground': '#f8f8f2',
            'editor.lineHighlightBackground': '#3e3d32',
            'editor.selectionBackground': '#49483e',
            'editorCursor.foreground': '#f8f8f2',
            'editorLineNumber.foreground': '#75715e',
            'editorLineNumber.activeForeground': '#f8f8f2',
            'editor.inactiveSelectionBackground': '#49483e80',
        },
    },

    melty: {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '7d8590', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'ff7b72' },
            { token: 'string', foreground: 'a5d6ff' },
            { token: 'number', foreground: '79c0ff' },
            { token: 'type', foreground: 'ffa657' },
            { token: 'function', foreground: 'd2a8ff' },
            { token: 'variable', foreground: 'e6edf3' },
            { token: 'constant', foreground: 'ffaa00' },
        ],
        colors: {
            'editor.background': '#0d1117',
            'editor.foreground': '#e6edf3',
            'editor.lineHighlightBackground': '#161b22',
            'editor.selectionBackground': '#ffaa0040',
            'editorCursor.foreground': '#ffaa00',
            'editorLineNumber.foreground': '#7d8590',
            'editorLineNumber.activeForeground': '#e6edf3',
            'editor.inactiveSelectionBackground': '#21262d',
        },
    },

    github: {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'ff7b72' },
            { token: 'string', foreground: 'a5d6ff' },
            { token: 'number', foreground: '79c0ff' },
            { token: 'type', foreground: 'ffa657' },
            { token: 'function', foreground: 'd2a8ff' },
            { token: 'variable', foreground: 'c9d1d9' },
            { token: 'constant', foreground: '79c0ff' },
        ],
        colors: {
            'editor.background': '#0d1117',
            'editor.foreground': '#c9d1d9',
            'editor.lineHighlightBackground': '#161b22',
            'editor.selectionBackground': '#388bfd40',
            'editorCursor.foreground': '#58a6ff',
            'editorLineNumber.foreground': '#6e7681',
            'editorLineNumber.activeForeground': '#c9d1d9',
            'editor.inactiveSelectionBackground': '#21262d',
        },
    },
};

// Auto-detect language from content
export function detectLanguage(content) {
    if (!content || content.trim().length === 0) return 'plaintext';
    const trimmed = content.trim();
    const sample = trimmed.slice(0, 2000); // Only check first 2000 chars

    // Shebang
    if (sample.startsWith('#!')) {
        const firstLine = sample.split('\n')[0];
        if (firstLine.includes('python')) return 'python';
        if (firstLine.includes('node')) return 'javascript';
        if (firstLine.includes('bash') || firstLine.includes('sh')) return 'shell';
        if (firstLine.includes('ruby')) return 'ruby';
        if (firstLine.includes('php')) return 'php';
    }

    // HTML/XML - check for tags
    if (/<(!DOCTYPE|html|head|body|div|span|p|a|script|style)/i.test(sample)) return 'html';
    if (/^<\?xml/i.test(sample) || /<[a-z]+:[a-z]+/i.test(sample)) return 'xml';

    // JSON - strict check
    if (/^\s*[\{\[]/.test(sample)) {
        try { JSON.parse(trimmed); return 'json'; } catch { }
    }

    // CSS
    if (/^(@import|@media|@keyframes|\*|body|html|\.[\w-]+|#[\w-]+)\s*\{/m.test(sample)) return 'css';
    if (/@(mixin|include|extend|if|for|each)\s/m.test(sample)) return 'scss';

    // JavaScript/TypeScript - strong indicators
    if (/^(import|export)\s+(default\s+)?(function|class|const|let|var|type|interface|\{|\*)/m.test(sample)) {
        return /:\s*(string|number|boolean|void|any|never|unknown)\b|<[A-Z]\w*>|interface\s+\w+/.test(sample) ? 'typescript' : 'javascript';
    }
    if (/^(const|let|var)\s+\w+\s*=|^function\s+\w+\s*\(|=>\s*\{|\.then\s*\(/m.test(sample)) return 'javascript';

    // Python
    if (/^(def|class|import|from|if __name__|@\w+)\s/m.test(sample) || /print\s*\(|:\s*$/m.test(sample)) return 'python';

    // Markdown
    if (/^#{1,6}\s+\w/m.test(sample) || /^\[.+\]\(.+\)|^[-*+]\s+\w|^>\s+\w/m.test(sample)) return 'markdown';

    // SQL
    if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s+/im.test(sample)) return 'sql';

    // YAML
    if (/^[\w-]+:\s*[^\{]/m.test(sample) && !/^\s*\{/.test(sample)) return 'yaml';

    // Shell
    if (/^(echo|export|source|alias|if\s+\[|for\s+\w+\s+in)\s/m.test(sample)) return 'shell';

    // PHP
    if (/<\?php/i.test(sample)) return 'php';

    // Java
    if (/^(public|private|protected)\s+(static\s+)?(class|void|int|String)/m.test(sample)) return 'java';

    // C/C++
    if (/#include\s*<|int\s+main\s*\(|void\s+\w+\s*\(/m.test(sample)) return 'cpp';

    // Go
    if (/^(package|func|import)\s/m.test(sample)) return 'go';

    // Rust
    if (/^(fn|let\s+mut|impl|struct|enum|use\s+\w+::)/m.test(sample)) return 'rust';

    return 'plaintext';
}

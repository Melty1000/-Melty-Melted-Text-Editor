import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'diffedit_data';
const RECENT_KEY = 'diffedit_recent';
const MAX_RECENT = 10;

const generateId = () => `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createNewTab = (name = 'Untitled', content = '') => ({
    id: generateId(),
    name,
    content,
    savedContent: content,
});

// Load from localStorage
function loadFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            return {
                tabs: parsed.tabs || [createNewTab('Document 1', '// Start typing here...\n')],
                activeTabId: parsed.activeTabId,
                theme: parsed.theme || 'melty',
                font: parsed.font || "'JetBrains Mono', monospace",
                fontSize: parsed.fontSize || 14,
                minimap: parsed.minimap ?? false,
                wordWrap: parsed.wordWrap ?? true,
            };
        }
    } catch (e) {
        console.error('Failed to load from storage:', e);
    }
    return null;
}

// Load recent files
function loadRecentFiles() {
    try {
        const data = localStorage.getItem(RECENT_KEY);
        return data ? JSON.parse(data) : [];
    } catch { return []; }
}

export function useEditorStore() {
    const [isLoaded, setIsLoaded] = useState(false);

    // Lazy initialize from storage (only runs once, not every render)
    const [tabs, setTabs] = useState(() => {
        const stored = loadFromStorage();
        return stored?.tabs || [createNewTab('Document 1', '// Start typing here...\n')];
    });
    const [activeTabId, setActiveTabId] = useState(() => {
        const stored = loadFromStorage();
        return stored?.activeTabId || tabs[0]?.id;
    });
    const [compareMode, setCompareMode] = useState(false);
    const [selectedForCompare, setSelectedForCompare] = useState([null, null]);
    const [diffOnlyMode, setDiffOnlyMode] = useState(false);
    const [theme, setTheme] = useState(() => {
        const stored = loadFromStorage();
        return stored?.theme || 'melty';
    });
    const [font, setFont] = useState(() => {
        const stored = loadFromStorage();
        return stored?.font || "'JetBrains Mono', monospace";
    });
    const [fontSize, setFontSize] = useState(() => {
        const stored = loadFromStorage();
        return stored?.fontSize || 14;
    });
    const [minimap, setMinimap] = useState(() => {
        const stored = loadFromStorage();
        return stored?.minimap ?? false;
    });
    const [wordWrap, setWordWrap] = useState(() => {
        const stored = loadFromStorage();
        return stored?.wordWrap ?? true;
    });
    const [recentFiles, setRecentFiles] = useState(loadRecentFiles);

    // Auto-save to localStorage
    useEffect(() => {
        const data = { tabs, activeTabId, theme, font, fontSize, minimap, wordWrap };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [tabs, activeTabId, theme, font, fontSize, minimap, wordWrap]);

    // Save recent files
    useEffect(() => {
        localStorage.setItem(RECENT_KEY, JSON.stringify(recentFiles));
    }, [recentFiles]);

    // Set theme on change (fixed: theme now in deps)
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Set loaded state
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const addTab = useCallback((name, content = '') => {
        const newTab = createNewTab(name || `Document ${tabs.length + 1}`, content);
        setTabs(prev => [...prev, newTab]);
        setActiveTabId(newTab.id);
        return newTab.id;
    }, [tabs.length]);

    const closeTab = useCallback((tabId) => {
        setTabs(prev => {
            const newTabs = prev.filter(t => t.id !== tabId);
            if (newTabs.length === 0) {
                const newTab = createNewTab('Document 1');
                setActiveTabId(newTab.id);
                return [newTab];
            }
            if (tabId === activeTabId) {
                const closedIndex = prev.findIndex(t => t.id === tabId);
                const newActiveIndex = Math.min(closedIndex, newTabs.length - 1);
                setActiveTabId(newTabs[newActiveIndex].id);
            }
            return newTabs;
        });
        setSelectedForCompare(prev => prev.map(id => id === tabId ? null : id));
    }, [activeTabId]);

    const updateTabContent = useCallback((tabId, content) => {
        setTabs(prev => prev.map(tab =>
            tab.id === tabId ? { ...tab, content } : tab
        ));
    }, []);

    const renameTab = useCallback((tabId, newName) => {
        setTabs(prev => prev.map(tab =>
            tab.id === tabId ? { ...tab, name: newName } : tab
        ));
    }, []);

    const getActiveTab = useCallback(() => {
        return tabs.find(t => t.id === activeTabId) || tabs[0];
    }, [tabs, activeTabId]);

    const getTabById = useCallback((id) => {
        return tabs.find(t => t.id === id);
    }, [tabs]);

    // File operations
    const openFile = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = '.txt,.js,.jsx,.ts,.tsx,.json,.html,.css,.md,.py,.sql,.yaml,.yml,.xml,.sh,.bat,.ps1,.php,.rb,.go,.rs,.java,.c,.cpp,.h,.hpp';
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    addTab(file.name, event.target.result);
                    // Add to recent
                    setRecentFiles(prev => {
                        const filtered = prev.filter(r => r.name !== file.name);
                        return [{ name: file.name, content: event.target.result, date: Date.now() }, ...filtered].slice(0, MAX_RECENT);
                    });
                };
                reader.readAsText(file);
            });
        };
        input.click();
    }, [addTab]);

    const openRecentFile = useCallback((recentItem) => {
        addTab(recentItem.name, recentItem.content);
    }, [addTab]);

    const clearRecent = useCallback(() => {
        setRecentFiles([]);
    }, []);

    // Save to browser (localStorage) - marks as saved
    const saveTab = useCallback((tabId) => {
        setTabs(prev => prev.map(t =>
            t.id === tabId ? { ...t, savedContent: t.content } : t
        ));
    }, []);

    // Export to file (download)
    const exportTab = useCallback((tabId) => {
        const tab = tabs.find(t => t.id === tabId);
        if (!tab) return;

        const blob = new Blob([tab.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = tab.name.includes('.') ? tab.name : `${tab.name}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }, [tabs]);

    // Drag-drop handler
    const handleFileDrop = useCallback((files) => {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('text/') || file.name.match(/\.(txt|js|jsx|ts|tsx|json|html|css|md|py|sql|yaml|yml|xml)$/i)) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    addTab(file.name, event.target.result);
                };
                reader.readAsText(file);
            }
        });
    }, [addTab]);

    // Compare with picker
    const startCompareWith = useCallback((originalId, modifiedId) => {
        if (originalId && modifiedId) {
            setSelectedForCompare([originalId, modifiedId]);
            setCompareMode(true);
        }
    }, []);

    const quickCompare = useCallback(() => {
        if (tabs.length < 2) return;
        const activeIndex = tabs.findIndex(t => t.id === activeTabId);
        const compareIndex = activeIndex > 0 ? activeIndex - 1 : 1;
        setSelectedForCompare([tabs[compareIndex].id, tabs[activeIndex].id]);
        setCompareMode(true);
    }, [tabs, activeTabId]);

    const exitCompare = useCallback(() => {
        setCompareMode(false);
        setSelectedForCompare([null, null]);
        setDiffOnlyMode(false);
    }, []);

    const toggleDiffOnly = useCallback(() => {
        setDiffOnlyMode(prev => !prev);
    }, []);

    const getCompareContent = useCallback(() => {
        const [id1, id2] = selectedForCompare;
        const tab1 = tabs.find(t => t.id === id1);
        const tab2 = tabs.find(t => t.id === id2);
        return {
            original: tab1?.content || '',
            modified: tab2?.content || '',
            originalName: tab1?.name || 'Original',
            modifiedName: tab2?.name || 'Modified',
            originalId: id1,
            modifiedId: id2,
        };
    }, [tabs, selectedForCompare]);

    // Apply diff (copy content from one side to another)
    const applyDiffToOriginal = useCallback(() => {
        const [origId, modId] = selectedForCompare;
        const modTab = tabs.find(t => t.id === modId);
        if (origId && modTab) {
            updateTabContent(origId, modTab.content);
        }
    }, [selectedForCompare, tabs, updateTabContent]);

    const applyDiffToModified = useCallback(() => {
        const [origId, modId] = selectedForCompare;
        const origTab = tabs.find(t => t.id === origId);
        if (modId && origTab) {
            updateTabContent(modId, origTab.content);
        }
    }, [selectedForCompare, tabs, updateTabContent]);

    // Settings
    const changeTheme = useCallback((newTheme) => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }, []);

    const changeFont = useCallback((newFont) => setFont(newFont), []);
    const changeFontSize = useCallback((newSize) => setFontSize(newSize), []);
    const toggleMinimap = useCallback(() => setMinimap(prev => !prev), []);
    const toggleWordWrap = useCallback(() => setWordWrap(prev => !prev), []);

    return {
        tabs, activeTabId, compareMode, selectedForCompare, diffOnlyMode,
        theme, font, fontSize, minimap, wordWrap, recentFiles, isLoaded,

        addTab, closeTab, updateTabContent, renameTab, setActiveTabId, getActiveTab, getTabById,

        openFile, openRecentFile, clearRecent, saveTab, exportTab, handleFileDrop,

        startCompareWith, quickCompare, exitCompare, toggleDiffOnly, getCompareContent,
        applyDiffToOriginal, applyDiffToModified,

        changeTheme, changeFont, changeFontSize, toggleMinimap, toggleWordWrap,
    };
}

import './theme.css';
import { useEditorStore } from './hooks/useEditorStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { MenuBar } from './components/MenuBar';
import { TabBar } from './components/TabBar';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { DiffViewer } from './components/DiffViewer';
import { GoToLineDialog } from './components/GoToLineDialog';
import { CommandPalette } from './components/CommandPalette';
import { useEffect, useCallback, useState, useRef, useMemo } from 'react';

function App() {
    const {
        tabs, activeTabId, compareMode, selectedForCompare, diffOnlyMode,
        theme, font, fontSize, minimap, wordWrap, recentFiles, isLoaded,
        addTab, closeTab, updateTabContent, renameTab, setActiveTabId, getActiveTab,
        openFile, openRecentFile, clearRecent, saveTab, exportTab, handleFileDrop,
        startCompareWith, exitCompare, toggleDiffOnly, getCompareContent,
        applyDiffToOriginal, applyDiffToModified,
        changeTheme, changeFont, changeFontSize, toggleMinimap, toggleWordWrap,
    } = useEditorStore();

    const activeTab = getActiveTab();
    const [isDragging, setIsDragging] = useState(false);
    const [distractionFree, setDistractionFree] = useState(false);
    const [showGoToLine, setShowGoToLine] = useState(false);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const editorRef = useRef(null);

    // Keyboard shortcuts
    const shortcuts = useMemo(() => ({
        'ctrl+n': () => addTab(),
        'ctrl+w': () => activeTabId && closeTab(activeTabId),
        'ctrl+s': () => activeTabId && saveTab(activeTabId),
        'ctrl+f': () => editorRef.current?.openFind?.(),
        'ctrl+h': () => editorRef.current?.openReplace?.(),
        'ctrl+g': () => setShowGoToLine(true),
        'ctrl+shift+p': () => setShowCommandPalette(true),
        'f11': () => setDistractionFree(d => !d),
        'escape': () => {
            setShowGoToLine(false);
            setShowCommandPalette(false);
        },
    }), [addTab, closeTab, activeTabId, saveTab]);

    useKeyboardShortcuts(shortcuts);

    // Command palette handler
    const handleCommand = useCallback((cmdId) => {
        switch (cmdId) {
            case 'newTab': addTab(); break;
            case 'closeTab': activeTabId && closeTab(activeTabId); break;
            case 'save': activeTabId && saveTab(activeTabId); break;
            case 'find': editorRef.current?.openFind?.(); break;
            case 'replace': editorRef.current?.openReplace?.(); break;
            case 'goToLine': setShowGoToLine(true); break;
            case 'toggleDistractionFree': setDistractionFree(d => !d); break;
            case 'toggleMinimap': toggleMinimap(); break;
            case 'toggleWordWrap': toggleWordWrap(); break;
            case 'themeMelty': changeTheme('melty'); break;
            case 'themeDracula': changeTheme('dracula'); break;
            case 'themeNord': changeTheme('nord'); break;
            case 'themeMonokai': changeTheme('monokai'); break;
            case 'themeGithub': changeTheme('github-dark'); break;
            case 'themeObsidian': changeTheme('obsidian'); break;
            default: break;
        }
    }, [addTab, closeTab, activeTabId, saveTab, toggleMinimap, toggleWordWrap, changeTheme]);

    // Go to line handler
    const handleGoToLine = useCallback((line) => {
        editorRef.current?.goToLine?.(line);
    }, []);

    // Get max line count for go-to-line dialog
    const maxLine = activeTab?.content?.split('\n').length || 1;

    // Apply font to entire app
    useEffect(() => {
        document.documentElement.style.setProperty('--app-font', font);
    }, [font]);

    // Hide splash screen when app is ready
    useEffect(() => {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 300);
        }
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFileDrop(e.dataTransfer.files);
        }
    }, [handleFileDrop]);

    const handleOriginalChange = useCallback((content) => {
        const { originalId } = getCompareContent();
        if (originalId) updateTabContent(originalId, content);
    }, [getCompareContent, updateTabContent]);

    const handleModifiedChange = useCallback((content) => {
        const { modifiedId } = getCompareContent();
        if (modifiedId) updateTabContent(modifiedId, content);
    }, [getCompareContent, updateTabContent]);

    if (!isLoaded) return null;

    return (
        <div
            className={`app ${isDragging ? 'app--dragging' : ''} ${distractionFree ? 'app--distraction-free' : ''}`}
            style={{ fontFamily: font }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {isDragging && (
                <div className="app__drop-overlay">
                    <div className="app__drop-message">
                        Drop files here to open
                    </div>
                </div>
            )}

            {!distractionFree && (
                <>
                    <MenuBar
                        onNewTab={() => addTab()}
                        onOpenFile={openFile}
                        onSaveTab={saveTab}
                        onExportTab={exportTab}
                        activeTabId={activeTabId}
                        recentFiles={recentFiles}
                        onOpenRecent={openRecentFile}
                        onClearRecent={clearRecent}
                        minimap={minimap}
                        wordWrap={wordWrap}
                        onToggleMinimap={toggleMinimap}
                        onToggleWordWrap={toggleWordWrap}
                    />

                    <TabBar
                        tabs={tabs}
                        activeTabId={activeTabId}
                        onTabClick={setActiveTabId}
                        onTabClose={closeTab}
                        onTabRename={renameTab}
                        onAddTab={() => addTab()}
                        selectedForCompare={selectedForCompare}
                    />

                    <Toolbar
                        tabs={tabs}
                        activeTabId={activeTabId}
                        compareMode={compareMode}
                        onStartCompare={startCompareWith}
                        onExitCompare={exitCompare}
                        diffOnlyMode={diffOnlyMode}
                        onToggleDiffOnly={toggleDiffOnly}
                        theme={theme}
                        onThemeChange={changeTheme}
                        font={font}
                        fontSize={fontSize}
                        onFontChange={changeFont}
                        onFontSizeChange={changeFontSize}
                    />
                </>
            )}

            {compareMode ? (
                <DiffViewer
                    {...getCompareContent()}
                    theme={theme}
                    diffOnlyMode={diffOnlyMode}
                    font={font}
                    fontSize={fontSize}
                    onOriginalChange={handleOriginalChange}
                    onModifiedChange={handleModifiedChange}
                    onApplyToOriginal={applyDiffToOriginal}
                    onApplyToModified={applyDiffToModified}
                />
            ) : (
                <Editor
                    ref={editorRef}
                    content={activeTab?.content || ''}
                    onChange={(content) => updateTabContent(activeTabId, content)}
                    theme={theme}
                    font={font}
                    fontSize={fontSize}
                    tabName={activeTab?.name || ''}
                    minimap={minimap}
                    wordWrap={wordWrap}
                />
            )}

            {/* Dialogs */}
            <GoToLineDialog
                isOpen={showGoToLine}
                onClose={() => setShowGoToLine(false)}
                onGoToLine={handleGoToLine}
                maxLine={maxLine}
            />

            <CommandPalette
                isOpen={showCommandPalette}
                onClose={() => setShowCommandPalette(false)}
                onCommand={handleCommand}
            />

            <style>{`
        .app {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: var(--bg-primary);
          position: relative;
        }
        
        .app--dragging { pointer-events: none; }
        
        .app--distraction-free {
          /* Full screen editor mode */
        }
        
        .app__drop-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          pointer-events: none;
        }
        
        .app__drop-message {
          padding: 32px 64px;
          background: var(--bg-secondary);
          border: 2px dashed var(--accent);
          border-radius: var(--radius-lg);
          font-size: 18px;
          font-weight: 500;
          color: var(--accent);
        }
      `}</style>
        </div>
    );
}

export default App;

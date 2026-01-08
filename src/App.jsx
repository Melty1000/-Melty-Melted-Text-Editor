import './theme.css';
import { useEditorStore } from './hooks/useEditorStore';
import { MenuBar } from './components/MenuBar';
import { TabBar } from './components/TabBar';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { DiffViewer } from './components/DiffViewer';
import { useEffect, useCallback, useState } from 'react';

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
            className={`app ${isDragging ? 'app--dragging' : ''}`}
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

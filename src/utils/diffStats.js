// Calculate diff statistics between two strings
export function calculateDiffStats(original, modified) {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');

    // Simple line-based diff calculation
    const originalSet = new Set(originalLines);
    const modifiedSet = new Set(modifiedLines);

    let additions = 0;
    let deletions = 0;
    let unchanged = 0;

    // Count additions (lines in modified but not in original)
    modifiedLines.forEach(line => {
        if (!originalSet.has(line)) {
            additions++;
        } else {
            unchanged++;
        }
    });

    // Count deletions (lines in original but not in modified)
    originalLines.forEach(line => {
        if (!modifiedSet.has(line)) {
            deletions++;
        }
    });

    // Adjust unchanged count (was double counted)
    unchanged = Math.min(unchanged, originalLines.length);

    const total = additions + deletions + unchanged;
    const changePercent = total > 0 ? Math.round(((additions + deletions) / total) * 100) : 0;

    return {
        additions,
        deletions,
        unchanged,
        originalLines: originalLines.length,
        modifiedLines: modifiedLines.length,
        changePercent,
    };
}

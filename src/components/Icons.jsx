// SVG Icons for the editor UI - minimal, clean design
export const Icons = {
    plus: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="8" y1="3" x2="8" y2="13"/>
    <line x1="3" y1="8" x2="13" y2="8"/>
  </svg>`,

    folder: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M2 4c0-.5.5-1 1-1h3l2 2h5c.5 0 1 .5 1 1v6c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1V4z"/>
  </svg>`,

    save: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M3 2h8l2 2v9c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1V3c0-.5.5-1 1-1z"/>
    <path d="M5 2v4h5V2"/>
    <path d="M4 14v-4h8v4"/>
  </svg>`,

    compare: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M4 3v10M12 3v10"/>
    <path d="M7 5l-3 3 3 3M9 5l3 3-3 3"/>
  </svg>`,

    close: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="4" y1="4" x2="12" y2="12"/>
    <line x1="12" y1="4" x2="4" y2="12"/>
  </svg>`,

    arrowLeft: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M10 3l-5 5 5 5"/>
  </svg>`,

    chevronDown: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M3 4.5l3 3 3-3"/>
  </svg>`,

    theme: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <circle cx="8" cy="8" r="5"/>
    <path d="M8 3v10" fill="currentColor"/>
    <path d="M8 3a5 5 0 010 10" fill="currentColor"/>
  </svg>`,

    font: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M3 13l3-10h4l3 10"/>
    <path d="M4.5 9h7"/>
  </svg>`,

    fire: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 1c-2 3-4 4-4 7a4 4 0 108 0c0-3-2-4-4-7z"/>
  </svg>`,

    diffOnly: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="3" width="12" height="2" rx="0.5"/>
    <rect x="2" y="7" width="12" height="2" rx="0.5"/>
    <rect x="2" y="11" width="12" height="2" rx="0.5"/>
  </svg>`,

    check: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 8l3 3 7-7"/>
  </svg>`,
};

// Helper to render icon as HTML
export function renderIcon(name, className = '') {
    const svg = Icons[name] || '';
    return `<span class="icon ${className}">${svg}</span>`;
}

// React component for icons
export function Icon({ name, className = '', size = 16 }) {
    const svg = Icons[name] || '';
    return (
        <span
            className={`icon ${className}`}
            style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

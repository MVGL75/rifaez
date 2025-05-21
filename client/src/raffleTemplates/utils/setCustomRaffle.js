export default function(raffle){
    const root = document.documentElement;

    // Tailwind-style shades (manually defined or imported from tailwind/colors)
    const colorShades = {
        blue: ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', "#000b26", "#eff6ff"],
        red: ['#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c' , "#000b26", "#eff6ff"],
        green: ['#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d' , "#000b26", "#eff6ff"],
        yellow: ['#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706' , "#000b26", "#eff6ff"],
        purple: ['#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', "#140029", "#eff6ff"],
        // add more if needed
    };
    const fontSizes = {
        xs: ['0.625rem', '0.75rem', '0.875rem'],
        s: ['0.75rem', '0.875rem', '1rem' ],
        m: ['0.875rem', '1rem', '1.125rem' ],
        l: ['1rem', '1.125rem', '1.25rem' ],
        xl: ['1.125rem', '1.25rem', '1.375rem'],
        // add more if needed
    };
    const nightModeSelector = {
        true: {
            background: "#01011f",
            lightTint: "#232323",
            lightColorTint: colorShades[raffle.colorPalette][5],
            color: ["#f7f7f7", "#fff", "#fff", "#fff", "#fff", "#fff"],
            card: "#242424",
            border: "#323232",
        },
        false: {
            background: "#ffffff",
            lightTint: "#f5f5f5",
            lightColorTint: colorShades[raffle.colorPalette][6],
            color: ["#333333", "#000", "#000", "#000", "#000", "#fff"],
            card: "#f7f7f7",
            border: "#e7e7e7",
        }
    }

    const tones = colorShades[raffle.colorPalette] || colorShades['blue'];
    const sizes = fontSizes[raffle.font] || fontSizes['m'];
    const nightMode = nightModeSelector[raffle.nightMode]
    // Default palette
    const settings = {
        '--light-tint': nightMode.lightTint,
        '--light-color-tint': nightMode.lightColorTint,
        '--background-raffle': nightMode.background,
        '--primary-raffle': tones[2], // 500
        '--primary-raffle-300': tones[0],
        '--primary-raffle-400': tones[1],
        '--primary-raffle-500': tones[2],
        '--primary-raffle-600': tones[3],
        '--primary-raffle-700': tones[4],
        '--size-raffle': sizes[2], // 500
        '--size-raffle-300': sizes[0],
        '--size-raffle-400': sizes[1],
        '--size-raffle-500': sizes[2],
        '--card-raffle': nightMode.card,
        '--color-raffle': nightMode.color[2],
        '--color-raffle-foreground': nightMode.color[5],
        '--color-raffle-300': nightMode.color[0],
        '--color-raffle-400': nightMode.color[1],
        '--color-raffle-500': nightMode.color[2],
        '--color-raffle-600': nightMode.color[3],
        '--color-raffle-700': nightMode.color[4],
        '--border-raffle': nightMode.border,
    };

    // Apply user overrides (if any)
    const settingsFinal = { ...settings};

    // Set each CSS variable on :root
    Object.entries(settings).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}
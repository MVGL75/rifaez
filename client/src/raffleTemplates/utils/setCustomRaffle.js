export default function(raffle){
    const root = document.documentElement;

    // Tailwind-style shades (manually defined or imported from tailwind/colors)
    const colorShades = {
        blue: ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#F8F9FA',],
        red: ['#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c' , '#F8F9FA',],
        green: ['#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d' , '#F8F9FA',],
        yellow: ['#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706' , '#1E1E1E',],
        purple: ['#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#F8F9FA',],
        white: [
            '#FFFFFF', 
            '#F8F9FA',
            '#F1F3F5', 
            '#E9ECEF', 
            '#DEE2E6',
            '#1E1E1E',
          ],
        black: [
            '#000000', 
            '#121212',
            '#1E1E1E', 
            '#2C2F33',
            '#343A40',
            '#F8F9FA',
          ]
          
        // add more if needed
    };

    const background = colorShades[raffle.colorPalette.background];
    const headerCheck = raffle.colorPalette.header;
    const header = colorShades[headerCheck];
    const borders = colorShades[raffle.colorPalette.borders];
    const color = colorShades[raffle.colorPalette.color];
    const primary = colorShades[raffle.colorPalette.accent];
    // Default palette
    const settings = {
        '--light-tint': background[1],
        '--light-color-tint': background[1],
        '--background-raffle': background[0],
        '--font-raffle': raffle.font ,
        '--header-raffle': header[2] ,
        '--header-raffle-foreground': header[5] ,
        '--primary-raffle': primary[2], // 500
        '--primary-raffle-foreground': primary[5], // 500
        '--primary-raffle-300': primary[0],
        '--primary-raffle-400': primary[1],
        '--primary-raffle-500': primary[2],
        '--primary-raffle-600': primary[3],
        '--primary-raffle-700': primary[4],
        '--card-raffle': background[2],
        '--color-raffle': color[2],
        '--color-raffle-foreground': "#fff",
        '--color-raffle-300': color[0],
        '--color-raffle-400': color[1],
        '--color-raffle-500': color[2],
        '--color-raffle-600': color[3],
        '--color-raffle-700': color[4],
        '--border-raffle': borders[1],
    };

    // Apply user overrides (if any)
    const settingsFinal = { ...settings};

    // Set each CSS variable on :root
    Object.entries(settings).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}
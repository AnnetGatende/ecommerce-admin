/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        
        // ✅ Added this line only
        border: "hsl(var(--border))",
                // ✅ ADD THESE
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",

      },
    },
  },
}

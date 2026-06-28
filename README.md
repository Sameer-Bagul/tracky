# Tracky Printables 🖨️✨

**A precision-engineered, printer-ready consistency tracker.**

Tracky is a beautifully designed, minimalist goal-tracking web application built with Next.js. It focuses on a premium tactile aesthetic, allowing you to build highly customizable A4-optimized habit trackers that look gorgeous on your screen and print perfectly for DIY wall decor.

## ✨ Features

*   **A4-Printable Architecture:** The UI is mathematically locked to an A4-landscape aspect ratio (`aspect-[297/210]`). What you see on the screen is exactly what comes out of your printer.
*   **Interactive Physics Background:** A high-performance, Device-Pixel-Ratio (DPR) aware HTML `<canvas>` background features liquid-like repulsion physics and magnetic proximity darkening that reacts to your mouse (automatically hidden when printing).
*   **Theming & Customization Engine:**
    *   **Custom Colors:** A built-in color-picker dynamically computes perfect opacities for text, borders, and UI accents based on a single hex code.
    *   **Local Image Uploads:** Upload your own wallpapers. Images are automatically compressed via a local canvas pipeline to prevent browser storage limits.
    *   **Editable Metadata:** Click directly on the tracker title or motivational quote to edit them in real-time.
*   **100% Privacy-First:** Zero databases, zero accounts. Every single interaction, setting, and checked day is saved instantly and exclusively to your browser's local storage.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4 (Inline `@theme`)
*   **Typography:** Google Poppins font
*   **Icons:** Lucide React & Custom SVGs
*   **Graphics:** Native HTML5 Canvas API

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## 🖨️ Printing Guide

To get the perfect printout for your wall:
1. Setup your Tracker (Start date, Title, Quote).
2. Click the **Print Tracker** button on the UI.
3. In your browser's print dialog, ensure:
   *   **Layout:** Landscape
   *   **Paper Size:** A4
   *   **Margins:** None / Minimum
   *   **Background Graphics:** Enabled (if you want the background image) or Disabled (for a pure ink-saving minimalist look).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Sameer-Bagul/tracky/issues).

---

*Small daily improvements lead to stunning results.*

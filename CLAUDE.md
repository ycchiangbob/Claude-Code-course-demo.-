# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router, React 19, TypeScript, and Tailwind CSS 4. It's configured with shadcn/ui components and uses the Geist font family.

## Commands

### Development
```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Architecture

### Directory Structure
- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration (Geist Sans & Geist Mono)
  - `page.tsx` - Home page component
  - `globals.css` - Global styles and Tailwind directives
- `lib/` - Utility functions
  - `utils.ts` - Contains `cn()` helper for class name merging (clsx + tailwind-merge)
- `public/` - Static assets (SVG files)

### Key Configurations

**TypeScript**: Uses strict mode with path alias `@/*` pointing to root directory.

**shadcn/ui**: Configured with:
- Style: "new-york"
- Base color: neutral
- CSS variables enabled
- Icons: lucide-react
- Path aliases:
  - `@/components` → components directory
  - `@/lib` → lib directory
  - `@/ui` → components/ui directory
  - `@/hooks` → hooks directory

**Tailwind CSS**: Using Tailwind 4 with PostCSS, global styles in `app/globals.css`.

**ESLint**: Uses Next.js core web vitals and TypeScript configs with standard ignores (.next, out, build directories).

### Styling Approach
- Uses Tailwind utility classes throughout
- Dark mode support via `dark:` prefixes
- `cn()` utility for conditional class merging
- Custom CSS variables for theming (configured for shadcn/ui)

## Coding Conventions

- Always use descriptive variable names

## Development Notes

- This is a fresh Next.js project with minimal customization
- Edit `app/page.tsx` to modify the home page
- The app auto-reloads on file changes in development mode
- When adding shadcn/ui components, they should go in `@/components/ui`

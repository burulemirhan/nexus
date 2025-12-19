# NEXUS - Advanced Agricultural Engineering

A modern, responsive website for NEXUS Biotechnologies showcasing advanced agricultural engineering solutions, vertical farming technologies, and project management services.

## Features

- 🌐 **Bilingual Support**: Turkish and English language support
- 🎨 **Modern UI**: Clean, professional design with smooth animations
- 📱 **Responsive**: Fully responsive design for all devices
- ⚡ **Performance Optimized**: Fast loading with lazy loading and code splitting
- 🔍 **SEO Optimized**: Complete SEO setup with meta tags, sitemap, and structured data
- 🚀 **GitHub Pages Ready**: Configured for easy deployment to GitHub Pages

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling (via CDN)
- **Lenis** - Smooth scrolling

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── components/                 # React components
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Services.tsx
│   └── ...
├── pages/                      # Page components
│   ├── EngineeringSolutions.tsx
│   ├── TurnkeyProjects.tsx
│   └── ...
├── contexts/                   # React contexts
│   └── LanguageContext.tsx
├── public/                     # Static assets
│   ├── 404.html               # SPA routing fallback
│   ├── robots.txt
│   └── sitemap.xml
├── index.html                  # Main HTML template
├── index.tsx                   # Application entry point
├── App.tsx                     # Main app component
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to GitHub Pages.

### Quick Deploy

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select "GitHub Actions" as source
4. The site will automatically deploy on every push to `main`

## Environment Variables

Create a `.env` file for environment-specific variables:

```env
# Optional: Set base path for GitHub Pages subdirectory deployment
VITE_BASE_PATH=/your-repo-name/

# API keys (if needed)
GEMINI_API_KEY=your_api_key_here
```

## Services

The website showcases four main services:

1. **Mühendislik Çözümleri** / **Engineering Solutions**
2. **Anahtar Teslim Projeler** / **Turnkey Projects**
3. **Savunma Sanayi Projeleri** / **Defense Industry Projects**
4. **Danışmanlık ve Proje Yönetimi** / **Consulting and Project Management**

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2026 NEXUS Biotechnologies. All rights reserved.

## Contact

For inquiries: info@nexusbiotech.org

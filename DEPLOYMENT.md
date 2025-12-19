# GitHub Pages Deployment Guide

This guide will help you deploy the NEXUS website to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your local machine
- Node.js and npm installed

## Deployment Steps

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it (e.g., `nexus-website` or use your username for root domain)
3. **Important**: If you want to use a custom domain or root domain (`username.github.io`), the repository name must be exactly `username.github.io` where `username` is your GitHub username.

### 2. Initialize Git and Push Code

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: NEXUS website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 3. Configure GitHub Pages

#### Option A: Deploying to Root Domain (`username.github.io`)

1. Go to your repository settings
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy when you push to `main` branch

#### Option B: Deploying to Repository Subdirectory (`username.github.io/repo-name`)

1. Go to your repository settings
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select **GitHub Actions**
4. Before pushing, update the base path in `.github/workflows/deploy.yml`:
   - Change `VITE_BASE_PATH` to `/your-repo-name/`
   - Or create a `.env` file with `VITE_BASE_PATH=/your-repo-name/`

### 4. Enable GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions**
3. Save the settings

### 5. Automatic Deployment

Once configured, every push to the `main` branch will automatically:
- Build the website
- Deploy to GitHub Pages
- Make it available at your GitHub Pages URL

## Manual Build and Test

To test the build locally before deploying:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview the build
npm run preview
```

## Environment Variables

If you need to set a custom base path, create a `.env` file:

```env
VITE_BASE_PATH=/your-repo-name/
```

For root domain deployment, leave it as `/` or empty.

## Troubleshooting

### 404 Errors on Refresh

The `public/404.html` file handles SPA routing. If you still see 404 errors:
1. Ensure `404.html` is in the `public` folder
2. Check that GitHub Pages is configured correctly

### Assets Not Loading

- Ensure all assets (images, videos, fonts) are in the `public` folder
- Check that paths use relative paths (starting with `/`)
- Verify the base path matches your repository structure

### Build Fails

- Check GitHub Actions logs for specific errors
- Ensure Node.js version matches (currently using Node 20)
- Verify all dependencies are in `package.json`

## Custom Domain

To use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain:
   ```
   yourdomain.com
   ```

2. Configure DNS settings with your domain provider:
   - Add a CNAME record pointing to `username.github.io`

3. In GitHub repository settings → Pages, add your custom domain

## File Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/
│   ├── 404.html                 # SPA routing fallback
│   ├── robots.txt               # SEO robots file
│   └── sitemap.xml              # SEO sitemap
├── src/                         # Source files (if using src folder)
├── components/                  # React components
├── pages/                       # Page components
├── contexts/                    # React contexts
├── index.html                   # Main HTML file
├── index.tsx                    # Entry point
├── vite.config.ts               # Vite configuration
└── package.json                 # Dependencies
```

## Support

For issues or questions, check:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)


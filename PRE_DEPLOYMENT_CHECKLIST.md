# Pre-Deployment Checklist

Before deploying to GitHub Pages, ensure the following:

## ✅ Configuration Files

- [x] `vite.config.ts` - Configured with base path support
- [x] `package.json` - Includes build and deploy scripts
- [x] `.github/workflows/deploy.yml` - GitHub Actions workflow created
- [x] `public/404.html` - SPA routing fallback created
- [x] `.gitignore` - Properly configured (dist folder ignored)

## 📁 File Structure

- [x] `.github/workflows/` directory created
- [x] `public/` folder exists with robots.txt and sitemap.xml
- [x] All source files in correct locations

## 🔧 Before First Deployment

1. **Update Base Path** (if deploying to subdirectory):
   - Edit `.github/workflows/deploy.yml`
   - Update `VITE_BASE_PATH` environment variable
   - Or create `.env` file with `VITE_BASE_PATH=/your-repo-name/`

2. **Test Build Locally**:
   ```bash
   npm install
   npm run build
   npm run preview
   ```

3. **Verify Assets**:
   - Check that all images, videos, and fonts are accessible
   - Ensure paths in code match actual file locations

4. **Git Setup**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

## 🚀 Deployment Steps

1. Push code to GitHub repository
2. Go to repository **Settings** → **Pages**
3. Under **Build and deployment**, select **GitHub Actions**
4. Wait for workflow to complete (check Actions tab)
5. Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## 📝 Important Notes

- **Root Domain**: If repository name is `username.github.io`, base path should be `/`
- **Subdirectory**: If repository name is anything else, base path should be `/repo-name/`
- **Custom Domain**: Add `CNAME` file in `public/` folder with your domain name
- **Environment Variables**: Create `.env` file for local development (don't commit secrets)

## 🐛 Troubleshooting

If deployment fails:
1. Check GitHub Actions logs
2. Verify Node.js version matches (20)
3. Ensure all dependencies are in `package.json`
4. Check that base path is correctly configured

## 📞 Support

Refer to `DEPLOYMENT.md` for detailed deployment instructions.

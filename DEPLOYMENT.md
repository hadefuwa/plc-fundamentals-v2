# GitHub Pages Deployment Guide

## Prerequisites
- GitHub account
- Repository with your PWA code

## Step 1: Prepare Your Repository

1. **Add PDF.js Viewer Files**
   - Download the latest PDF.js release from: https://github.com/mozilla/pdf.js/releases
   - Extract the `web/` folder and copy it to your project as `pdfjs/web/`
   - This enables in-browser PDF viewing

2. **Add PWA Icons** (Optional but recommended)
   - Create 192x192 and 512x512 PNG icons
   - Place them in `assets/icons/` as:
     - `matrix-icon-192.png`
     - `matrix-icon-512.png`

3. **Verify File Structure**
   ```
   your-repo/
   ├── index.html
   ├── manifest.json
   ├── service-worker.js
   ├── pdf-viewer.html
   ├── pdfjs/
   │   └── web/
   │       ├── viewer.html
   │       ├── viewer.js
   │       └── ...
   ├── assets/
   │   └── icons/
   │       ├── matrix-icon-192.png
   │       └── matrix-icon-512.png
   └── ...
   ```

## Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select:
   - **Deploy from a branch**
   - Choose **main** branch (or your preferred branch)
   - Select **/(root)** folder
5. Click **Save**

## Step 3: Deploy

1. **Commit and push your changes**
   ```bash
   git add .
   git commit -m "Add PWA support and PDF.js viewer"
   git push origin main
   ```

2. **Wait for deployment**
   - GitHub will build and deploy your site
   - This usually takes 1-5 minutes
   - You can monitor progress in the **Actions** tab

## Step 4: Access Your PWA

1. **Find your site URL**
   - Go to repository **Settings** → **Pages**
   - Your site will be available at: `https://<username>.github.io/<repo-name>/`

2. **Test PWA Features**
   - Open in Chrome/Edge/Firefox
   - Look for the install prompt (browser toolbar or menu)
   - Test offline functionality (disconnect internet and reload)
   - Try opening PDFs to verify in-browser viewing

## Troubleshooting

### PWA Not Installing
- Ensure HTTPS is enabled (GitHub Pages provides this)
- Check that `manifest.json` is accessible
- Verify service worker is registered (check browser dev tools)

### PDFs Not Loading
- Confirm `pdfjs/web/` folder is present
- Check browser console for errors
- Ensure PDF files are in the correct location

### Offline Not Working
- Clear browser cache and reload
- Check service worker registration in dev tools
- Verify all essential files are cached

### Icons Not Showing
- Ensure icon files exist and are accessible
- Check file paths in `manifest.json`
- Verify icon sizes match manifest specifications

## Custom Domain (Optional)

1. In repository **Settings** → **Pages**
2. Enter your custom domain
3. Add a `CNAME` file to your repository with your domain
4. Configure DNS with your domain provider

## Performance Tips

- Optimize images and assets
- Enable gzip compression (GitHub Pages does this automatically)
- Use CDN links for external libraries (already configured)
- Monitor Core Web Vitals in browser dev tools

## Support

- Check browser dev tools for errors
- Verify all files are committed and pushed
- Test in multiple browsers
- Use Lighthouse in Chrome dev tools to audit PWA features 
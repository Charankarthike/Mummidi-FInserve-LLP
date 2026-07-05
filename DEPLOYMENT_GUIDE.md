# Deployment Guide - Mummidi Finserve

Your project is ready to deploy! Here are three easy deployment options:

---

## ✅ RECOMMENDED: Deploy to Vercel (Easiest)

### Step 1: Login to Vercel
```bash
vercel login
```
This will open your browser. Sign in with:
- GitHub
- GitLab
- Bitbucket
- Or Email

### Step 2: Deploy to Production
```bash
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **What's your project's name?** → mummidi-finserve (or custom name)
- **In which directory is your code located?** → ./
- **Want to override the settings?** → No

✅ **Done!** You'll get a live URL like: `https://mummidi-finserve.vercel.app`

### Subsequent Deployments
After the first deployment, just run:
```bash
vercel --prod
```

---

## Option 2: Deploy to Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login
```bash
netlify login
```

### Step 3: Deploy
```bash
netlify deploy --prod --dir=dist
```

---

## Option 3: Deploy to GitHub Pages

### Step 1: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 2: Add to package.json
Add this to your `package.json` scripts:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### Step 3: Add base URL to vite.config.ts
```typescript
export default defineConfig({
  base: '/mummidi-finserve-3d-react/',
  // ... rest of config
})
```

### Step 4: Deploy
```bash
npm run deploy
```

Your site will be live at: `https://[your-username].github.io/mummidi-finserve-3d-react/`

---

## 📦 Build Output

Your production build is in the `dist/` folder:
- **Size:** ~895 KB (251 KB gzipped)
- **Files:** index.html + bundled CSS & JS
- **Images:** All gallery images included

---

## 🔧 Custom Domain Setup

### Vercel:
1. Go to your project dashboard
2. Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### Netlify:
1. Go to Site settings
2. Domain management
3. Add custom domain
4. Configure DNS

---

## 🚀 Quick Start (Recommended)

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

That's it! Your site will be live in seconds.

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **GitHub Pages:** https://pages.github.com

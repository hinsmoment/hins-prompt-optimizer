# Deployment Guide: Push to GitHub

You have successfully initialized the local Git repository and committed your code. Now, follow these steps to upload it to your GitHub account.

## Step 1: Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Enter a **Repository name** (e.g., `prompt-optimizer`).
3. Choose **Public** or **Private**.
4. **Do NOT** initialize with README, .gitignore, or License (we already have these).
5. Click **Create repository**.

## Step 2: Link and Push
Copy the commands shown on the GitHub page under "…or push an existing repository from the command line", or copy the block below (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/prompt-optimizer.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to GitHub Pages (Optional)
If you want to host the site for free on GitHub Pages:

1. In your repository, go to **Settings** > **Pages**.
2. Under **Source**, select **GitHub Actions**.
3. Create a new file in your project at `.github/workflows/deploy.yml` with the content below.
4. Commit and push.

### `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install and Build
        run: |
          npm ci
          npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

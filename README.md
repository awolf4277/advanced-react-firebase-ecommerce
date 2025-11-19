name: CI/CD - React Firebase E-Commerce



on:

&nbsp; push:

&nbsp;   branches: \[ main ]

&nbsp; pull\_request:

&nbsp;   branches: \[ main ]



jobs:

&nbsp; ci:

&nbsp;   name: Build \& Test

&nbsp;   runs-on: ubuntu-latest



&nbsp;   steps:

&nbsp;     - name: Checkout repository

&nbsp;       uses: actions/checkout@v4



&nbsp;     - name: Use Node.js

&nbsp;       uses: actions/setup-node@v4

&nbsp;       with:

&nbsp;         node-version: 20



&nbsp;     - name: Install dependencies

&nbsp;       run: npm install



&nbsp;     - name: Run tests

&nbsp;       run: npm test



&nbsp;     - name: Build app

&nbsp;       run: npm run build



&nbsp; deploy:

&nbsp;   name: Deploy to Vercel

&nbsp;   runs-on: ubuntu-latest

&nbsp;   needs: ci   # only run if CI job passes



&nbsp;   steps:

&nbsp;     - name: Checkout repository

&nbsp;       uses: actions/checkout@v4



&nbsp;     - name: Use Node.js

&nbsp;       uses: actions/setup-node@v4

&nbsp;       with:

&nbsp;         node-version: 20



&nbsp;     - name: Install dependencies

&nbsp;       run: npm install



&nbsp;     - name: Deploy with Vercel

&nbsp;       run: |

&nbsp;         npm install -g vercel

&nbsp;         vercel --prod --confirm --token=${{ secrets.VERCEL\_TOKEN }} \\

&nbsp;           --scope=${{ secrets.VERCEL\_ORG\_ID }} \\

&nbsp;           --project=${{ secrets.VERCEL\_PROJECT\_ID }}




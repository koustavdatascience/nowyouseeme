# External Hosting Domain Notes

Verified on 25 August 2026 from the providers' documentation.

| Provider | Default hosted address |
| --- | --- |
| Netlify | The production site uses a chosen `site-name.netlify.app` address. Netlify documents preview and branch forms such as `deploy-preview-42--mysitename.netlify.app` and `staging--mysitename.netlify.app`. |
| Vercel | Deployments receive a `vercel.app` URL; a production project address is commonly in the form `project-name.vercel.app`. |

The live invisibility-cloak app needs HTTPS for browser webcam permission prompts. Both listed provider domains use HTTPS.

## Cloudflare deployment status

The Pages project `invisibility-cloak-app` was created successfully with the public subdomain `invisibility-cloak-app.pages.dev`. The account-level GitHub integration reported a Cloudflare installation error, so the repository cannot currently trigger deployments automatically. A direct Pages upload requires a Cloudflare Dashboard / Wrangler sign-in session.

The Cloudflare Dashboard confirms the user is signed in and the direct-upload project exists. The Git-connected Pages flow now shows a **Connect GitHub** authorization control; completing that authorization is required before Cloudflare can select and build `koustavdatascience/invisibility-cloak-app` automatically.

The GitHub authorization is now complete. Cloudflare’s Git deployment form has been configured with project name `nowyouseeme`, production branch `main`, build command `pnpm build`, and build output directory `dist/public`. Cloudflare currently proposes the unique free deployment subdomain `nowyouseeme-dcf.pages.dev`.

After the GitHub repository was renamed to `nowyouseeme`, Cloudflare reloaded its build configuration. The plain `nowyouseeme` Pages project name still receives an automatic uniqueness suffix (`nowyouseeme-217.pages.dev`), confirming that the exact free hostname is unavailable.

The requested alternative project name `nowyouseemee` is available without a suffix. Cloudflare confirms the resulting free hostname will be `nowyouseemee.pages.dev`.

The GitHub-backed deployment was submitted with project name `nowyouseemee`, branch `main`, build command `pnpm build`, and output directory `dist/public`. Cloudflare has started initializing the build environment and cloning commit `b193d407271a67d8495284b70e68dd096e5dcc75` from the renamed repository.

Cloudflare’s deployment log has progressed to “Deploying your site to Cloudflare's global network.” The project dashboard has not yet displayed the completion state.

## Deployment outcome

The production deployment completed successfully. Cloudflare built commit `b193d407271a67d8495284b70e68dd096e5dcc75` from `koustavdatascience/nowyouseeme`, then published it to `https://nowyouseemee.pages.dev`. The public page loads over HTTPS with the **Now You See Me — Live Camera Effect** title and the expected webcam-start interface.

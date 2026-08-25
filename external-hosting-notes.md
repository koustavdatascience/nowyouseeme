# External Hosting Domain Notes

Verified on 25 August 2026 from the providers' documentation.

| Provider | Default hosted address |
| --- | --- |
| Netlify | The production site uses a chosen `site-name.netlify.app` address. Netlify documents preview and branch forms such as `deploy-preview-42--mysitename.netlify.app` and `staging--mysitename.netlify.app`. |
| Vercel | Deployments receive a `vercel.app` URL; a production project address is commonly in the form `project-name.vercel.app`. |

The live invisibility-cloak app needs HTTPS for browser webcam permission prompts. Both listed provider domains use HTTPS.

## Cloudflare deployment status

The Pages project `invisibility-cloak-app` was created successfully with the public subdomain `invisibility-cloak-app.pages.dev`. The account-level GitHub integration reported a Cloudflare installation error, so the repository cannot currently trigger deployments automatically. A direct Pages upload requires a Cloudflare Dashboard / Wrangler sign-in session.

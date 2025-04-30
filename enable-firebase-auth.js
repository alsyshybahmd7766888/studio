/**
 * enable-firebase-auth.js
 *
 * This Node.js script uses the Google Identity Toolkit Admin API
 * to enable Email/Password sign-in for your Firebase project.
 *
 * Prerequisites:
 * 1. A Service Account JSON key with the “Cloud Identity Toolkit Admin” role.
 * 2. `npm install googleapis`
 *
 * Usage:
 *   node enable-firebase-auth.js path/to/service-account.json easy-recharge-cx0ki
 */

import { readFileSync } from "fs";
import { google } from "googleapis";

async function enableEmailPasswordSignIn(saKeyPath, projectId) {
  // Load service account key
  const key = JSON.parse(readFileSync(saKeyPath, "utf8"));

  // Authenticate via JWT
  const auth = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  // Initialize Identity Toolkit API v2
  const identityToolkit = google.identitytoolkit({
    version: "v2",
    auth,
  });

  const name = `projects/${projectId}/config`;

  // Patch the project config to enable email/password
  const res = await identityToolkit.projects.patchConfig({
    name,
    updateMask: "signIn.email.enabled",
    requestBody: {
      signIn: {
        email: { enabled: true },
      },
    },
  });

  console.log("✅ Email/Password enabled:", res.data.signIn.email.enabled);
}

(async () => {
  const [,, saKeyPath, projectId] = process.argv;
  if (!saKeyPath || !projectId) {
    console.error("Usage: node enable-firebase-auth.js <SERVICE_ACCOUNT_JSON> <PROJECT_ID>");
    console.error("Example: node enable-firebase-auth.js ./path/to/key.json easy-recharge-cx0ki");
    process.exit(1);
  }
  try {
    await enableEmailPasswordSignIn(saKeyPath, projectId);
  } catch (e) {
    console.error("❌ Failed to enable Email/Password:", e.message || e);
    process.exit(1);
  }
})();

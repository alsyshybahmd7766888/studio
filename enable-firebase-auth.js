/**
 * enable-firebase-auth.js
 *
 * This Node.js script uses the Google Identity Toolkit Admin API
 * to enable Email/Password and Phone sign-in for your Firebase project.
 *
 * Prerequisites:
 * 1. A Service Account JSON key with the “Cloud Identity Toolkit Admin” role.
 * 2. `npm install googleapis`
 *
 * Usage:
 *   node enable-firebase-auth.js path/to/service-account.json your-project-id
 */

import { readFileSync } from "fs";
import { google } from "googleapis";

async function enableSignInProviders(saKeyPath, projectId) {
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

  // Patch the project config to enable email/password and phone sign-in
  try {
    const res = await identityToolkit.projects.patchConfig({
      name,
      // Update mask to include both email and phone enabled fields
      updateMask: "signIn.email.enabled,signIn.phone.enabled",
      requestBody: {
        signIn: {
          email: { enabled: true },
          phone: { enabled: true }, // Enable phone sign-in
        },
      },
    });

    console.log("✅ Email/Password enabled:", res.data.signIn?.email?.enabled ?? 'Not configured');
    console.log("✅ Phone enabled:", res.data.signIn?.phone?.enabled ?? 'Not configured');

  } catch (error) {
    console.error("❌ Failed to patch Firebase Auth config:", error.response ? error.response.data : error.message);
    // Attempt to read the current config to show the status
    try {
      const currentConfig = await identityToolkit.projects.getConfig({ name });
      console.log("CurrentsignIn config:", currentConfig.data.signIn);
    } catch (readError) {
       console.error("❌ Failed to read current Firebase Auth config:", readError.message);
    }
    throw error; // Re-throw the original error
  }
}

(async () => {
  const [,, saKeyPath, projectId] = process.argv;
  if (!saKeyPath || !projectId) {
    console.error("Usage: node enable-firebase-auth.js <SERVICE_ACCOUNT_JSON> <PROJECT_ID>");
    console.error("Example: node enable-firebase-auth.js ./path/to/key.json easy-recharge-cx0ki");
    process.exit(1);
  }
  try {
    await enableSignInProviders(saKeyPath, projectId);
  } catch (e) {
    console.error("❌ Script failed:", e.message || e);
    process.exit(1);
  }
})();

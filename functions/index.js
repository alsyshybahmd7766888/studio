/*
 Firebase Cloud Functions for 4NOW Recharge API Integration
 --------------------------------------------------------
 This file defines an HTTPS endpoint that your Flutter/Firebase Studio app
 calls to perform real airtime recharges via your chosen provider's API.

 Before deploying, configure your provider's details via:
    firebase functions:config:set provider.url="https://api.provider.com/charge" \
                                 provider.key="YOUR_API_KEY"
*/

const functions = require('firebase-functions');
const axios = require('axios');

// HTTPS function to process recharge requests
exports.recharge = functions.https.onRequest(async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Validate required fields
  const { phoneNumber, amount, operator, userId, packageId } = req.body; // Added userId and packageId for more context
  if (!phoneNumber || (!amount && !packageId) || !operator || !userId) { // Allow either amount or packageId
    return res.status(400).json({ error: 'Missing required fields (phoneNumber, amount/packageId, operator, userId)' });
  }

  // --- TODO: Add Firebase Authentication check here ---
  // Verify the request is coming from an authenticated user
  // Example:
  // if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
  //   console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.');
  //   return res.status(403).json({ error: 'Unauthorized' });
  // }
  // const idToken = req.headers.authorization.split('Bearer ')[1];
  // try {
  //   const decodedIdToken = await admin.auth().verifyIdToken(idToken);
  //   if (decodedIdToken.uid !== userId) {
  //      throw new Error("User ID mismatch");
  //   }
  //   console.log('ID Token correctly decoded', decodedIdToken);
  // } catch (error) {
  //   console.error('Error while verifying Firebase ID token:', error);
  //   return res.status(403).json({ error: 'Unauthorized' });
  // }
  // --- End TODO ---


  // --- TODO: Add Balance Check (using Firestore/Realtime Database) ---
  // 1. Get the price for the `packageId` or use the direct `amount`.
  // 2. Fetch the user's current balance from Firestore/RTDB.
  // 3. Check if the balance is sufficient. If not, return 400 Bad Request.
  // --- End TODO ---

  try {
    // Read provider config from Firebase environment variables
    const providerUrl = functions.config().provider?.url;
    const apiKey = functions.config().provider?.key;

    if (!providerUrl || !apiKey) {
        console.error('Provider URL or API Key not configured in Firebase functions config.');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    // Prepare request payload for the recharge API provider
    // This payload might need adjustment based on your specific provider's requirements
    const apiPayload = {
      target_number: phoneNumber,
      value: amount, // Or lookup amount based on packageId
      product_id: packageId, // Send packageId if provided
      network_operator: operator, // Map your operator name to the provider's expected value if needed
      // Add any other required parameters like transaction ID, callback URL, etc.
      // request_id: `4NOW-${userId}-${Date.now()}` // Example unique request ID
    };

    console.log('Sending recharge request to provider:', providerUrl, 'Payload:', apiPayload);

    // Make the POST request to the external recharge API
    const response = await axios.post(
      providerUrl,
      apiPayload,
      {
        headers: {
          // Adjust auth method based on provider (Bearer token, Basic Auth, API Key in header, etc.)
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.log('Recharge API response status:', response.status);
    console.log('Recharge API response data:', response.data);

    // --- TODO: Handle Recharge Success ---
    // 1. Check the `response.data` for a success indicator from the provider.
    // 2. If successful:
    //    - Deduct the amount/package price from the user's balance in Firestore/RTDB.
    //    - Record the transaction details (user, package/amount, status=completed, provider response).
    // 3. If failed:
    //    - Record the transaction details (status=failed, provider response).
    //    - Do NOT deduct balance.
    // --- End TODO ---

    // Forward the provider's relevant success/failure response back to the client app
    // Modify this to return a standardized format if needed
    return res.status(response.status).json({
        success: true, // Or determine based on response.data
        message: response.data.message || 'Recharge processed successfully.', // Adjust based on provider response
        transactionId: response.data.transaction_id, // Example field
        // Include any other relevant data from the provider
    });

  } catch (error) {
    console.error('Recharge API call failed:');
    let status = 500;
    let responseData = { success: false, error: 'Recharge failed due to an internal server error.' };

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Data:', error.response.data);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
      status = error.response.status >= 400 && error.response.status < 500 ? 400 : 500; // Treat provider client errors as bad request from our side
      responseData = {
          success: false,
          error: 'Recharge failed.',
          provider_error: error.response.data?.error || error.response.data || 'Unknown provider error' // Send provider error details if available
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error Request:', error.request);
      responseData = { success: false, error: 'No response received from recharge provider.' };
      status = 504; // Gateway Timeout
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Message:', error.message);
      responseData = { success: false, error: 'Failed to send recharge request.' };
    }

     // --- TODO: Handle Recharge Failure ---
     // 1. Record the transaction details (status=failed, error details).
     // 2. Do NOT deduct balance.
     // --- End TODO ---

    return res.status(status).json(responseData);
  }
});

// --- TODO: Add other necessary Firebase Admin SDK initialization ---
// const admin = require('firebase-admin');
// admin.initializeApp();
// --- End TODO ---

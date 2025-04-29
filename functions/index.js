/*
 Firebase Cloud Functions for 4NOW Recharge API Integration
 --------------------------------------------------------
 This file defines an HTTPS endpoint that your Flutter/Firebase Studio app
 calls to perform real airtime recharges via your chosen provider's API.

 Before deploying, configure your provider's details via:
    firebase functions:config:set provider.sabafon.url="https://api.sabafon.ye/charge" \
                                 provider.sabafon.key="YOUR_SABAFON_API_KEY" \
                                 provider.yemenmobile.url="https://api.yemenmobile.com.ye/charge" \
                                 provider.yemenmobile.key="YOUR_YM_API_KEY" \
                                 provider.you.url="https://api.you.com.ye/charge" \
                                 provider.you.key="YOUR_YOU_API_KEY" \
                                 provider.y.url="https://api.y-gsm.com/charge" \
                                 provider.y.key="YOUR_Y_API_KEY"
    # Add other operators as needed

 NOTE: The URLs and keys above are examples. You MUST replace them with the actual API details provided by each operator.
*/

const functions = require('firebase-functions');
const axios = require('axios');
// --- TODO: Add Firebase Admin SDK initialization ---
// const admin = require('firebase-admin');
// admin.initializeApp();
// --- End TODO ---

// HTTPS function to process recharge requests
exports.recharge = functions.https.onRequest(async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Validate required fields
  // We need operator, phone number, and EITHER amount OR packageId
  // Also require userId for tracking and security
  const { phoneNumber, amount, operator, userId, packageId } = req.body;
  if (!operator || !phoneNumber || (!amount && !packageId) || !userId) {
    return res.status(400).json({ error: 'Missing required fields (operator, phoneNumber, amount OR packageId, userId)' });
  }

  // --- TODO: Add Firebase Authentication check here ---
  // Verify the request is coming from an authenticated user whose UID matches `userId`
  // Example:
  /*
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.');
    return res.status(403).json({ error: 'Unauthorized - Missing Token' });
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    if (decodedIdToken.uid !== userId) {
       console.error(`User ID mismatch: Token UID (${decodedIdToken.uid}) vs Request UID (${userId})`);
       throw new Error("User ID mismatch");
    }
    console.log('ID Token correctly decoded for user:', decodedIdToken.uid);
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    return res.status(403).json({ error: 'Unauthorized - Invalid Token' });
  }
  */
  // --- End TODO ---


  // --- Determine Recharge Value and Check Balance ---
  let rechargeValue = amount; // Use direct amount if provided
  let priceSource = 'direct amount';

  // --- TODO: Add Package Price Lookup and Balance Check (using Firestore/Realtime Database) ---
  // 1. If `packageId` is provided, look up its price from your Firestore/RTDB 'packages' collection.
  //    - const packageRef = admin.firestore().collection('packages').doc(packageId);
  //    - const packageDoc = await packageRef.get();
  //    - if (!packageDoc.exists) { return res.status(400).json({ error: `Package ${packageId} not found.` }); }
  //    - rechargeValue = packageDoc.data().price; // Assuming 'price' field in YER
  //    - priceSource = `package ${packageId}`;
  // 2. Fetch the user's current balance from Firestore/RTDB (e.g., users/{userId}/balance).
  //    - const userRef = admin.firestore().collection('users').doc(userId);
  //    - const userDoc = await userRef.get();
  //    - if (!userDoc.exists) { return res.status(404).json({ error: 'User not found.' }); }
  //    - const currentBalance = userDoc.data().balance; // Assuming 'balance' field in YER
  // 3. Check if the balance is sufficient.
  //    - if (currentBalance < rechargeValue) {
  //    -   return res.status(400).json({ error: `Insufficient balance. Required: ${rechargeValue}, Available: ${currentBalance}` });
  //    - }
  // --- End TODO ---

  // --- Select Provider API based on Operator ---
  let providerConfigKey = '';
  switch (operator.toLowerCase()) {
    case 'سبأفون':
      providerConfigKey = 'sabafon';
      break;
    case 'يمن موبايل':
      providerConfigKey = 'yemenmobile';
      break;
    case 'you':
      providerConfigKey = 'you';
      break;
    case 'واي':
      providerConfigKey = 'y';
      break;
    // Add cases for other operators like 'الهاتف الأرضي', 'ADSL' if they have APIs
    default:
      console.error(`Unsupported operator: ${operator}`);
      return res.status(400).json({ error: `Operator ${operator} is not supported for recharge.` });
  }

  const providerUrl = functions.config().provider?.[providerConfigKey]?.url;
  const apiKey = functions.config().provider?.[providerConfigKey]?.key;

  if (!providerUrl || !apiKey) {
      console.error(`API URL or Key not configured for operator ${operator} (config key: provider.${providerConfigKey})`);
      return res.status(500).json({ error: 'Server configuration error for this operator.' });
  }
  // --- End Provider Selection ---

  try {
    // --- Prepare request payload for the specific recharge API provider ---
    // This payload structure is a **GUESS** and **MUST** be adjusted based on each provider's actual API documentation.
    const apiPayload = {
      // Common potential fields:
      target_msisdn: phoneNumber, // Phone number
      product_code: packageId,    // If recharging a specific package/bundle
      amount: amount,             // If doing a direct top-up amount
      transaction_id: `4NOW-${userId}-${Date.now()}`, // Unique ID for tracking
      // Operator-specific fields might be needed here
      // Example for Sabafon (hypothetical):
      // network: 'SABAFON',
      // recharge_type: packageId ? 'bundle' : 'topup',
    };

    // Remove null/undefined fields from payload if necessary
    Object.keys(apiPayload).forEach(key => (apiPayload[key] == null) && delete apiPayload[key]);

    console.log(`Attempting recharge for ${operator} (${providerConfigKey})`);
    console.log('Target Number:', phoneNumber);
    console.log('User ID:', userId);
    console.log('Recharge Value:', rechargeValue, `(Source: ${priceSource})`);
    console.log('Provider URL:', providerUrl);
    console.log('Payload being sent:', apiPayload);


    // --- Make the POST request to the external recharge API ---
    // **PLACEHOLDER**: This simulates the API call. Replace with actual call logic.
    console.warn(`*** SIMULATING API Call to ${operator} - No real recharge performed ***`);
    // Simulate success/failure
    const simulatedSuccess = Math.random() > 0.2; // 80% success rate
    let simulatedResponseStatus = simulatedSuccess ? 200 : 400; // Simulate provider response status
    let simulatedResponseData = {};

    if (simulatedSuccess) {
        simulatedResponseData = {
            status: 'success',
            message: `Simulated recharge successful for ${phoneNumber}.`,
            provider_tx_id: `SIM_${Date.now()}`, // Simulated transaction ID
            // Include other relevant fields the real API might return
        };
        console.log('Simulated API call SUCCESSFUL');
    } else {
        simulatedResponseData = {
            status: 'failed',
            error_code: 'SIM_ERROR_01',
            message: 'Simulated recharge failed (e.g., invalid number, provider issue).',
        };
         console.log('Simulated API call FAILED');
         // Decide if a failed *simulated* call should return 4xx or 5xx to frontend
         // For now, returning 400 to indicate a potential issue with the request itself during simulation
         simulatedResponseStatus = 400;
    }
    // --- End PLACEHOLDER ---

    /* --- ACTUAL API CALL (replace placeholder above with this block once API details are known) ---
    const response = await axios.post(
      providerUrl,
      apiPayload,
      {
        headers: {
          // Adjust auth method based on provider (Bearer token, Basic Auth, API Key in header, custom signature etc.)
          'Authorization': `Bearer ${apiKey}`, // Common example
          // 'X-API-Key': apiKey, // Another example
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 45000 // 45 second timeout - adjust as needed
      }
    );

    console.log(`${operator} Recharge API response status:`, response.status);
    console.log(`${operator} Recharge API response data:`, response.data);

    // Check the actual provider response for success indicator
    // This logic depends heavily on the specific provider's response format
    const isSuccess = response.status >= 200 && response.status < 300 && response.data?.status === 'success'; // Example check

    if (isSuccess) {
        // --- TODO: Handle Actual Recharge Success ---
        // 1. **Atomically** deduct the `rechargeValue` from the user's balance in Firestore/RTDB.
        //    Use Firestore transactions for safety:
        //    await admin.firestore().runTransaction(async (transaction) => {
        //      const userRef = admin.firestore().collection('users').doc(userId);
        //      const userDoc = await transaction.get(userRef);
        //      if (!userDoc.exists) { throw "User not found!"; }
        //      const currentBalance = userDoc.data().balance;
        //      if (currentBalance < rechargeValue) { throw "Insufficient balance!"; }
        //      const newBalance = currentBalance - rechargeValue;
        //      transaction.update(userRef, { balance: newBalance });
        //    });
        // 2. Record the transaction details in a 'transactions' collection (status=completed, provider response, etc.).
        //    - admin.firestore().collection('transactions').add({
        //    -   userId: userId,
        //    -   operator: operator,
        //    -   phoneNumber: phoneNumber,
        //    -   amount: rechargeValue,
        //    -   packageId: packageId || null,
        //    -   status: 'completed',
        //    -   timestamp: admin.firestore.FieldValue.serverTimestamp(),
        //    -   providerResponse: response.data,
        //    -   providerTxId: response.data.provider_tx_id // Adjust field name
        //    - });
        console.log(`Successfully recharged ${phoneNumber} for user ${userId}. Deducted ${rechargeValue} from balance.`);
        // Return success response to client
        return res.status(200).json({
            success: true,
            message: response.data.message || `Recharge for ${operator} processed successfully.`,
            transactionId: response.data.provider_tx_id, // Example field
            // Include any other relevant data from the provider
        });

    } else {
        // --- TODO: Handle Actual Recharge Failure (from Provider) ---
        // 1. Record the transaction details (status=failed, provider response).
        //    - admin.firestore().collection('transactions').add({ ... status: 'failed', ... });
        // 2. Do NOT deduct balance.
        console.error(`Recharge failed by provider for ${phoneNumber}. Operator: ${operator}. Response:`, response.data);
        // Return failure response to client
        return res.status(400).json({ // Use 400 Bad Request as the client's request might be invalid for the provider
            success: false,
            error: `Recharge failed by ${operator}.`,
            provider_error: response.data?.error || response.data?.message || 'Unknown provider error'
        });
    }
     --- End ACTUAL API CALL block --- */


    // --- Handling Simulated Response ---
    if (simulatedSuccess) {
        // --- TODO: Handle Simulated Recharge Success ---
        // Perform the same balance deduction and transaction logging as in the ACTUAL success block above
        // Remember to use the `rechargeValue` determined earlier.
         console.log(`SIMULATED: Successfully recharged ${phoneNumber} for user ${userId}. Would deduct ${rechargeValue}.`);
         // Return simulated success response
        return res.status(simulatedResponseStatus).json({
            success: true,
            message: simulatedResponseData.message,
            transactionId: simulatedResponseData.provider_tx_id,
        });
    } else {
         // --- TODO: Handle Simulated Recharge Failure ---
         // Perform the same transaction logging (status=failed) as in the ACTUAL failure block above
         // Do NOT deduct balance.
         console.error(`SIMULATED: Recharge failed for ${phoneNumber}. Operator: ${operator}.`);
         // Return simulated failure response
         return res.status(simulatedResponseStatus).json({
            success: false,
            error: `Simulated recharge failed by ${operator}.`,
            provider_error: simulatedResponseData.message || 'Simulated provider error'
         });
    }
    // --- End Handling Simulated Response ---


  } catch (error) {
    // --- Handle errors during the API call itself (network issues, timeouts, non-2xx/4xx status from provider) ---
    console.error(`Recharge function failed for operator ${operator}:`);
    let responseStatus = 500;
    let responseData = { success: false, error: 'Recharge process failed due to an internal server error.' };

    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range (and wasn't handled above as provider failure)
      console.error('Axios Error Data:', error.response.data);
      console.error('Axios Error Status:', error.response.status);
      console.error('Axios Error Headers:', error.response.headers);
      responseStatus = error.response.status >= 500 ? 502 : 400; // 5xx from provider -> 502 Bad Gateway; 4xx -> 400 Bad Request
      responseData = {
          success: false,
          error: `Recharge provider connection error for ${operator}.`,
          provider_status: error.response.status,
          provider_error: error.response.data?.error || error.response.data || 'Unknown provider error response'
      };
    } else if (error.request) {
      // The request was made but no response was received (timeout, network error)
      console.error('Axios Error Request:', error.request);
      responseData = { success: false, error: `No response received from ${operator} recharge provider.` };
      responseStatus = 504; // Gateway Timeout
    } else {
      // Something happened in setting up the request that triggered an Error (e.g., config issue)
      // Or an error thrown from transaction logic (e.g., "Insufficient balance!")
      console.error('Axios Error Message / Transaction Error:', error.message);
      responseData = { success: false, error: error.message || 'Failed to process recharge request.' };
      // Keep status 500 for general setup errors, but use 400 for transaction errors like insufficient balance
      if (error.message.includes("Insufficient balance")) {
          responseStatus = 400;
      }
    }

     // --- TODO: Log Failure Transaction ---
     // 1. Record the transaction details (status=failed, error details captured above).
     //    - admin.firestore().collection('transactions').add({ ... status: 'failed', errorDetails: responseData, ... });
     // 2. Ensure no balance was deducted.
     // --- End TODO ---

    return res.status(responseStatus).json(responseData);
  }
});

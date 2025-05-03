// src/app/api/recharge/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Use alias path
import { doc, updateDoc, runTransaction, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios'; // For calling external recharge APIs

// Firestore collections are created automatically when the first document is written.
// This API route interacts with the following collections:
// - 'balances': Reads and updates the user's balance. (Created during registration)
// - 'transactions': Writes transaction logs. (Will be created on first log attempt)
// - 'mobile': Assumed path for mobile packages (e.g., 'mobile/Sabafon/sb-dp-yb-week'). Needs data populated.
// - 'games': Assumed path for game packages (e.g., 'games/PUBG/pubg_60uc'). Needs data populated.

// Helper function to get provider config (replace with your actual logic)
async function getProviderConfig(operator: string): Promise<{ url: string; apiKey: string } | null> {
  // Example: Fetching from environment variables based on operator
  const operatorKey = operator.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Sanitize operator name
  const url = process.env[`${operatorKey}_API_URL`]; // e.g., SABAFON_API_URL
  const apiKey = process.env[`${operatorKey}_API_KEY`]; // e.g., SABAFON_API_KEY

  // --- TODO: Replace with actual API Config ---
  // For simulation, using placeholder values if env vars are not set
  const effectiveUrl = url || 'https://example-provider.com/api/recharge'; // Placeholder URL
  const effectiveApiKey = apiKey || 'YOUR_PROVIDER_API_KEY'; // Placeholder Key
  console.warn(`Using ${url ? 'configured' : 'placeholder'} API URL for ${operator}`);
  // ------------------------------------------

  if (effectiveUrl && effectiveApiKey) {
    return { url: effectiveUrl, apiKey: effectiveApiKey };
  }
  console.error(`API configuration not found or incomplete for operator: ${operator}`);
  return null;
}

export async function POST(req: Request) {
  let apiResponseData: any = null; // Declare here to be accessible in catch block
  let requestBody: any = {};
  let userId: string = 'unknown';

  try {
    requestBody = await req.json();
    userId = requestBody.userId || 'unknown';
    const { phoneNumber, operator, packageId, amount, playerId } = requestBody;

    // --- Validation ---
    if (!userId || (!phoneNumber && !playerId) || !operator || (!packageId && !amount)) {
      return NextResponse.json({ success: false, error: 'Missing required fields (userId, operator, amount/packageId, and either phoneNumber or playerId).' }, { status: 400 });
    }

    // TODO: Add validation to ensure the request is coming from an authenticated user

    // --- Determine Recharge Value & Package Info (Fetch from DB) ---
    let rechargeValue = 0;
    let packageInfo: any = null; // Replace 'any' with your Package interface
    let isGameRecharge = operator.toUpperCase() === 'PUBG';

    if (packageId) {
        // Define the path based on whether it's a game or mobile recharge
        const packageCollectionPath = isGameRecharge ? 'games' : 'mobile';
        // Construct the full path to the package document
        const packageRef = doc(db, packageCollectionPath, operator, packageId); // Path: /games/PUBG/pubg_60uc OR /mobile/Sabafon/sb-dp-yb-week
        console.log(`Fetching package info from: ${packageRef.path}`); // Log the path being accessed

        const packageSnap = await getDoc(packageRef);
        if (!packageSnap.exists()) {
            console.error(`Package document not found at path: ${packageRef.path}`);
            return NextResponse.json({ success: false, error: `Package ${packageId} not found for operator ${operator}.` }, { status: 404 });
        }
        packageInfo = packageSnap.data();
        // Use priceYER for games, price for others (adjust field names as needed)
        rechargeValue = isGameRecharge ? packageInfo.priceYER : packageInfo.price;

        // Handle non-numeric or invalid prices
        if (typeof rechargeValue !== 'number' || rechargeValue <= 0) {
             if (typeof packageInfo.price === 'string') {
                 // Handle 'حسب الفاتورة', 'حسب المبلغ', 'حسب الطلب' - require amount from request
                 if (['حسب الفاتورة', 'حسب المبلغ', 'حسب الطلب'].includes(packageInfo.price)) {
                     if (!amount) {
                         return NextResponse.json({ success: false, error: `Amount is required for package type '${packageInfo.price}'.` }, { status: 400 });
                     }
                     rechargeValue = Number(amount);
                     if (isNaN(rechargeValue) || rechargeValue <= 0) {
                         return NextResponse.json({ success: false, error: 'Invalid amount provided for variable price package.' }, { status: 400 });
                     }
                 } else {
                     // Handle other unexpected string prices
                     console.error(`Invalid string price format for package ${packageId}: ${packageInfo.price}`);
                     return NextResponse.json({ success: false, error: `Invalid or unhandled price format for package ${packageId}.` }, { status: 400 });
                 }
             } else {
                 // Handle case where price is not a number or a recognized string
                 console.error(`Invalid price type or value for package ${packageId}:`, rechargeValue);
                 return NextResponse.json({ success: false, error: `Invalid price for package ${packageId}.` }, { status: 400 });
             }
        }
    } else if (amount) {
      // Direct recharge amount
      if (isGameRecharge) {
        return NextResponse.json({ success: false, error: 'Direct amount recharge is not supported for games. Please select a package.' }, { status: 400 });
      }
       rechargeValue = Number(amount);
       if (isNaN(rechargeValue) || rechargeValue <= 0) {
            return NextResponse.json({ success: false, error: 'Invalid recharge amount.' }, { status: 400 });
       }
       packageInfo = { id: 'direct_recharge', name: `تعبئة رصيد مباشر (${rechargeValue} ريال)`, price: rechargeValue };
    } else {
         return NextResponse.json({ success: false, error: 'Either packageId or amount is required.' }, { status: 400 });
    }


    // --- Provider API Integration ---
    const providerConfig = await getProviderConfig(operator);
    if (!providerConfig) {
      return NextResponse.json({ success: false, error: `Operator ${operator} configuration not found or incomplete.` }, { status: 500 });
    }

    let apiSuccess = false;
    let providerTxId: string | null = null;
    let apiError: string | null = null;

    // --- Transaction: Check Balance & Call External API & Deduct Balance ---
    const transactionResult = await runTransaction(db, async (transaction) => {
      const balanceDocRef = doc(db, 'balances', userId);
      const balanceSnap = await transaction.get(balanceDocRef);

      if (!balanceSnap.exists()) {
        throw new Error("Balance document not found for user.");
      }

      const currentBalance = balanceSnap.data().amount || 0;

      if (currentBalance < rechargeValue) {
        throw new Error(`Insufficient balance. Required: ${rechargeValue}, Available: ${currentBalance}`);
      }

      // --- Construct API Payload ---
      const apiPayload: any = {
         transaction_id: `4NOW-${userId}-${Date.now()}`,
         ...(phoneNumber && { target_msisdn: phoneNumber }),
         ...(isGameRecharge && { player_id: playerId }),
         ...(packageId && !amount && { product_code: packageId }), // Send packageId only if not direct amount
         amount: rechargeValue, // Always send the final calculated amount
         operator: operator, // Often needed by providers
      };
      Object.keys(apiPayload).forEach(key => apiPayload[key] === undefined && delete apiPayload[key]);


      // --- Simulate or Call External Recharge API ---
      console.log(`Attempting API call to ${operator} (${providerConfig.url}) for ${phoneNumber || playerId}...`);
      console.log("Payload:", apiPayload);
      const headers = { Authorization: `Bearer ${providerConfig.apiKey}`, 'Content-Type': 'application/json' };

      // --- *** SIMULATION BLOCK (REMOVE FOR REAL API) *** ---
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      apiSuccess = Math.random() > 0.15; // 85% success rate simulation
      if (apiSuccess) {
          apiResponseData = {
              status: 'success',
              message: `Simulated recharge successful for ${phoneNumber || playerId}.`,
              transaction_id: `SIM_TX_${Date.now()}`,
              balance_after: (Math.random() * 10000).toFixed(2) // Simulate some data
          };
          providerTxId = apiResponseData.transaction_id;
          apiError = null;
          console.log('SIMULATION: API Call SUCCEEDED');
      } else {
          apiResponseData = {
              status: 'failed',
              error_code: 'SIM_PROVIDER_FAIL',
              message: 'Simulated recharge failure (e.g., provider system down, invalid number).'
          };
          apiError = apiResponseData.message;
          providerTxId = null;
          console.log('SIMULATION: API Call FAILED');
      }
      // --- *** END SIMULATION BLOCK *** ---

      // --- !!! REAL API CALL (UNCOMMENT AND REPLACE SIMULATION) !!! ---
      /*
      try {
          console.log(`Calling external API: ${providerConfig.url}`);
          const apiResponse = await axios.post(providerConfig.url, apiPayload, { headers, timeout: 45000 });
          apiResponseData = apiResponse.data;

          // !!! IMPORTANT: Adjust success condition based on YOUR provider's response !!!
          apiSuccess = apiResponse.status >= 200 && apiResponse.status < 300 &&
                       (apiResponseData?.status?.toLowerCase() === 'success' || apiResponseData?.success === true || apiResponseData?.resultCode === '0'); // Example success checks

          if (apiSuccess) {
              // !!! IMPORTANT: Adjust field name for provider's transaction ID !!!
              providerTxId = apiResponseData?.transaction_id || apiResponseData?.provider_tx_id || apiResponseData?.referenceId || `PROVIDER_${Date.now()}`;
              apiError = null;
              console.log("REAL API: Call SUCCEEDED", apiResponse.status, apiResponseData);
          } else {
              // !!! IMPORTANT: Extract error message from YOUR provider's failure response !!!
              apiError = apiResponseData?.message || apiResponseData?.error_description || apiResponseData?.error || `Provider API Error (Status: ${apiResponse.status})`;
              providerTxId = null;
              console.log("REAL API: Call FAILED", apiResponse.status, apiResponseData);
          }
      } catch (err: any) {
          console.error("External API call exception:", err.response?.data || err.message);
          apiSuccess = false;
          // !!! IMPORTANT: Extract error message from Axios error response !!!
          apiError = err.response?.data?.message || err.response?.data?.error || err.message || 'External API Communication Error';
          apiResponseData = err.response?.data || { error: apiError }; // Store error response if available
          providerTxId = null;
          console.log("REAL API: Call EXCEPTION", err.response?.status);
      }
      */
      // --- !!! END REAL API CALL !!! ---

      if (!apiSuccess) {
        // Abort Firestore transaction if API call failed
        throw new Error(apiError || 'Recharge API call failed.');
      }

      // --- Deduct Balance ---
      const newBalance = currentBalance - rechargeValue;
      transaction.update(balanceDocRef, { amount: newBalance });

      // Return necessary info for logging outside the transaction
      return { newBalance, deductedAmount: rechargeValue, providerTxId, currentBalance };
    });

    // --- Log Successful Transaction ---
    // This will create the 'transactions' collection if it doesn't exist.
    const transactionsColRef = collection(db, 'transactions');
    await addDoc(transactionsColRef, {
      userId: userId,
      operator: operator,
      targetIdentifier: phoneNumber || playerId,
      isGame: isGameRecharge,
      packageId: packageId || null,
      packageInfo: packageInfo, // Store basic package info used
      amount: transactionResult.deductedAmount,
      status: 'completed',
      timestamp: serverTimestamp(),
      providerResponse: apiResponseData, // Store provider success response
      providerTxId: transactionResult.providerTxId,
      balanceBefore: transactionResult.currentBalance, // Use balance before deduction
      balanceAfter: transactionResult.newBalance,
    });

    // --- Return Success Response ---
    return NextResponse.json({
        success: true,
        message: apiResponseData?.message || 'Recharge processed successfully.',
        transactionId: transactionResult.providerTxId,
        newBalance: transactionResult.newBalance
    }, { status: 200 });

  } catch (error: any) {
    console.error('Recharge process failed:', error.message);

    // --- Log Failed Transaction Attempt ---
    // This will create the 'transactions' collection if it doesn't exist.
    if (userId && userId !== 'unknown') { // Only log if we have a user ID
         const transactionsColRef = collection(db, 'transactions');
         try {
             await addDoc(transactionsColRef, {
               userId: userId,
               operator: requestBody.operator || 'unknown',
               targetIdentifier: requestBody.phoneNumber || requestBody.playerId || 'unknown',
               isGame: requestBody.operator?.toUpperCase() === 'PUBG',
               packageId: requestBody.packageId || null,
               amountAttempted: requestBody.amount || (requestBody.packageId ? 'package' : 'unknown'),
               status: 'failed',
               timestamp: serverTimestamp(),
               error: error.message, // Log the specific error message
               providerResponse: apiResponseData || { error: error.message }, // Store provider error response if available
             });
             console.log("Failed transaction logged for user:", userId);
         } catch (logError) {
              console.error("FATAL: Failed to log failed transaction:", logError);
         }
    } else {
        console.warn("Skipping failed transaction log: userId is unknown.");
    }


    // --- Return Error Response ---
    const status = error.message.includes("Insufficient balance") ? 402 : // Payment Required
                   error.message.includes("not found") ? 404 : // Not Found (package, user, balance doc)
                   error.message.includes("Invalid") ? 400 : // Invalid amount, price, etc.
                   error.message.includes("not supported") ? 400 :
                   error.message.includes("required for package type") ? 400 :
                   500; // Internal Server Error / Provider Error

    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
```
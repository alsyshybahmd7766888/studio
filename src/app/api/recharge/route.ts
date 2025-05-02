// src/app/api/recharge/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase'; // Updated relative path
import { doc, updateDoc, runTransaction, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios'; // For calling external recharge APIs

// Helper function to get provider config (replace with your actual logic)
// This might fetch from Firestore, environment variables, or a config file
async function getProviderConfig(operator: string): Promise<{ url: string; apiKey: string } | null> {
  // Example: Fetching from environment variables based on operator
  // Ensure these are set in your .env.local or deployment environment
  // e.g., SABAFON_API_URL, SABAFON_API_KEY, YEMENMOBILE_API_URL, etc.
  const operatorKey = operator.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Sanitize operator name
  const url = process.env[`${operatorKey}_API_URL`];
  const apiKey = process.env[`${operatorKey}_API_KEY`];

  if (url && apiKey) {
    return { url, apiKey };
  }
  // Add more sophisticated logic if needed (fetching from DB, etc.)
  console.error(`API configuration not found for operator: ${operator}`);
  return null;
}

export async function POST(req: Request) {
  try {
    const { userId, phoneNumber, operator, packageId, amount, playerId } = await req.json(); // Added playerId

    // --- Validation ---
    if (!userId || (!phoneNumber && !playerId) || !operator || (!packageId && !amount)) { // Allow playerId instead of phoneNumber
      return NextResponse.json({ success: false, error: 'Missing required fields (userId, operator, amount/packageId, and either phoneNumber or playerId).' }, { status: 400 });
    }

    // TODO: Add validation to ensure the request is coming from an authenticated user (e.g., verify ID token if sent)

    // --- Determine Recharge Value & Package Info (Placeholder - Fetch from DB) ---
    let rechargeValue = 0;
    let packageInfo: any = null; // Replace 'any' with your Package interface
    let isGameRecharge = operator.toUpperCase() === 'PUBG'; // Check if it's a game recharge

    if (packageId) {
        // Fetch package details from Firestore 'packages' collection (adjust path as needed)
        // Example path: /packages/Sabafon/sb-dp-yb-week or /packages/PUBG/pubg_60uc
        // Assume a structure like /packages/{operator}/{packageId}
        const packagePath = isGameRecharge ? `games/${operator}/${packageId}` : `mobile/${operator}/${packageId}`; // Example structure
        const packageRef = doc(db, packagePath); // Adjust this path based on your actual Firestore structure
        const packageSnap = await getDoc(packageRef);
        if (!packageSnap.exists()) {
            return NextResponse.json({ success: false, error: `Package ${packageId} not found for operator ${operator}. Path: ${packagePath}` }, { status: 404 });
        }
        packageInfo = packageSnap.data();
        // Use priceYER for games, price for others (assuming this field exists)
        rechargeValue = isGameRecharge ? packageInfo.priceYER : packageInfo.price;
        if (typeof rechargeValue !== 'number' || rechargeValue <= 0) {
             // Allow string price for specific cases like "حسب الفاتورة"
             if (typeof packageInfo.price !== 'string') {
                return NextResponse.json({ success: false, error: `Invalid price for package ${packageId}.` }, { status: 400 });
             }
            // Handle 'حسب الفاتورة' - maybe need amount from request?
            if (packageInfo.price === 'حسب الفاتورة' || packageInfo.price === 'حسب المبلغ' || packageInfo.price === 'حسب الطلب') {
                // For these cases, the 'amount' should have been provided in the request.
                 if (!amount) {
                     return NextResponse.json({ success: false, error: `Amount is required for package type '${packageInfo.price}'.` }, { status: 400 });
                 }
                 rechargeValue = Number(amount);
                 if (isNaN(rechargeValue) || rechargeValue <= 0) {
                     return NextResponse.json({ success: false, error: 'Invalid amount provided for variable price package.' }, { status: 400 });
                 }
            } else {
                 return NextResponse.json({ success: false, error: `Invalid or unhandled price format for package ${packageId}.` }, { status: 400 });
            }
        }
    } else if (amount) {
      // Direct recharge amount (likely not applicable for games, mainly mobile/ADSL)
      if (isGameRecharge) {
        return NextResponse.json({ success: false, error: 'Direct amount recharge is not supported for games. Please select a package.' }, { status: 400 });
      }
       rechargeValue = Number(amount);
       if (isNaN(rechargeValue) || rechargeValue <= 0) {
            return NextResponse.json({ success: false, error: 'Invalid recharge amount.' }, { status: 400 });
       }
       // You might still want a generic packageInfo for direct recharges
       packageInfo = { id: 'direct_recharge', name: `تعبئة رصيد مباشر (${rechargeValue} ريال)`, price: rechargeValue };
    } else {
         return NextResponse.json({ success: false, error: 'Either packageId or amount is required.' }, { status: 400 });
    }


    // --- Provider API Integration ---
    const providerConfig = await getProviderConfig(operator);
    if (!providerConfig) {
      return NextResponse.json({ success: false, error: `Operator ${operator} configuration not found or incomplete.` }, { status: 500 });
    }

    let apiResponseData: any = null;
    let apiSuccess = false;
    let providerTxId: string | null = null;
    let apiError: string | null = null;

    // --- Transaction: Check Balance & Call External API & Deduct Balance ---
    const transactionResult = await runTransaction(db, async (transaction) => {
      const balanceDocRef = doc(db, 'balances', userId);
      const balanceSnap = await transaction.get(balanceDocRef);

      if (!balanceSnap.exists()) {
        throw new Error("Balance document not found for user."); // Should have been created on first fetch
      }

      const currentBalance = balanceSnap.data().amount || 0;

      if (currentBalance < rechargeValue) {
        throw new Error(`Insufficient balance. Required: ${rechargeValue}, Available: ${currentBalance}`);
      }

      // --- Construct API Payload ---
      // This structure depends heavily on the specific provider API
      const apiPayload: any = {
         // Common fields
         transaction_id: `4NOW-${userId}-${Date.now()}`, // Unique ID
         // Fields for mobile/ADSL recharge
         ...(phoneNumber && { target_msisdn: phoneNumber }), // Conditionally add phone number
         // Fields for game recharge
         ...(isGameRecharge && { player_id: playerId }), // Conditionally add player ID
         // Package or amount
         // Adjust logic based on how your provider expects package vs amount
         ...(packageId && { product_code: packageId }), // Send package ID
         amount: rechargeValue, // Send the final determined amount
         // Operator specific fields might be needed here based on providerConfig or operator name
         // Example: some APIs might need operator name explicitly
         // operator: operator,
      };
       // Clean up payload - remove null/undefined values if the API requires it
       Object.keys(apiPayload).forEach(key => apiPayload[key] === undefined && delete apiPayload[key]);


      // --- Simulate or Call External Recharge API ---
      console.log(`Attempting API call to ${operator} (${providerConfig.url}) for ${phoneNumber || playerId}...`);
      console.log("Payload:", apiPayload);
      const headers = { Authorization: `Bearer ${providerConfig.apiKey}`, 'Content-Type': 'application/json' };

      // --- REAL API CALL (uncomment when ready) ---
       /*
      try {
          const apiResponse = await axios.post(providerConfig.url, apiPayload, { headers, timeout: 45000 }); // 45s timeout
          apiResponseData = apiResponse.data;
          // Determine success based on provider's response structure (THIS WILL VARY!)
          apiSuccess = apiResponse.status >= 200 && apiResponse.status < 300 && (apiResponseData?.status === 'success' || apiResponseData?.success === true); // Adjust success check
          providerTxId = apiResponseData?.transaction_id || apiResponseData?.provider_tx_id || `PROVIDER_${Date.now()}`; // Adjust field name
          console.log("API Response Status:", apiResponse.status);
          console.log("API Response Data:", apiResponseData);
      } catch (err: any) {
          console.error("External API call failed:", err.response?.data || err.message);
          apiSuccess = false;
          apiError = err.response?.data?.message || err.response?.data?.error || err.message || 'External API Error';
          apiResponseData = err.response?.data || { error: apiError }; // Store error response
      }
      */
      // --- END REAL API CALL ---


      // --- SIMULATION (remove when using real API call) ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      apiSuccess = Math.random() > 0.2; // 80% success rate
      if (apiSuccess) {
          apiResponseData = { status: 'success', message: `Simulated recharge successful for ${phoneNumber || playerId}.`, transaction_id: `SIM_${Date.now()}` };
          providerTxId = apiResponseData.transaction_id;
          apiError = null;
      } else {
          apiResponseData = { status: 'failed', message: 'Simulated recharge failure (e.g., provider error).' };
          apiError = apiResponseData.message;
          providerTxId = null; // No transaction ID on failure
      }
      console.log("Simulation Result:", { apiSuccess, apiResponseData, apiError });
      // --- END SIMULATION ---

      if (!apiSuccess) {
        // If API call failed, abort the transaction (balance won't be deducted)
        // Log the failed transaction attempt later outside the transaction
        throw new Error(apiError || 'Recharge API call failed.');
      }

      // --- Deduct Balance ---
      const newBalance = currentBalance - rechargeValue;
      transaction.update(balanceDocRef, { amount: newBalance });

      // Return necessary info for logging outside the transaction
      return { newBalance, deductedAmount: rechargeValue, providerTxId };
    });

    // --- Log Successful Transaction ---
    const transactionsColRef = collection(db, 'transactions'); // Root collection for all transactions
    await addDoc(transactionsColRef, {
      userId: userId,
      operator: operator,
      targetIdentifier: phoneNumber || playerId, // Store phone or player ID
      isGame: isGameRecharge,
      packageId: packageId || null,
      packageInfo: packageInfo, // Store basic package info
      amount: transactionResult.deductedAmount,
      status: 'completed',
      timestamp: serverTimestamp(),
      providerResponse: apiResponseData, // Store provider success response
      providerTxId: transactionResult.providerTxId, // Store provider's transaction ID
      balanceBefore: transactionResult.deductedAmount + transactionResult.newBalance, // Calculate balance before
      balanceAfter: transactionResult.newBalance,
    });

    // --- Return Success Response ---
    return NextResponse.json({
        success: true,
        message: apiResponseData?.message || 'Recharge processed successfully.',
        transactionId: transactionResult.providerTxId,
        newBalance: transactionResult.newBalance // Optionally return new balance
    });

  } catch (error: any) {
    console.error('Recharge transaction failed:', error.message);

    // --- Log Failed Transaction Attempt ---
    // Extract details from the request if possible (might need to re-parse or pass differently)
     let requestBody: any = {};
     let userId = 'unknown';
     try {
         // Re-read the request body safely
         // req.json() consumes the body, so clone first if needed elsewhere or read once
         // If req is already Response, use req.clone().json()
         // If req is Request, it might be ReadableStream, handle appropriately
         // Assuming Next.js API route context where req might be NodeNextRequest
         if ((req as any)._bodyUsed) { // Check if body was used (this is internal, might change)
             // Body already consumed, try to get from error context if available
             // This part is tricky without knowing the exact error source
             console.warn("Request body already consumed, logging minimal failure details.");
         } else {
              // Clone and parse
             requestBody = await req.clone().json();
             userId = requestBody.userId || 'unknown';
         }
     } catch (parseError){
         console.error("Could not re-parse request body for error logging:", parseError);
      }

    const { operator, phoneNumber, playerId, packageId, amount } = requestBody;
    const targetIdentifier = phoneNumber || playerId || 'unknown';
    const isGame = operator?.toUpperCase() === 'PUBG';

    if (userId !== 'unknown') { // Only log if we have a user ID
         const transactionsColRef = collection(db, 'transactions');
         await addDoc(transactionsColRef, {
           userId: userId,
           operator: operator || 'unknown',
           targetIdentifier: targetIdentifier,
           isGame: isGame,
           packageId: packageId || null,
           amountAttempted: amount || (packageId ? 'package' : 'unknown'), // Log attempted amount or package
           status: 'failed',
           timestamp: serverTimestamp(),
           error: error.message, // Log the specific error
           providerResponse: apiResponseData || { error: error.message }, // Store provider error response if available
         }).catch(logError => console.error("Failed to log failed transaction:", logError));
    }

    // --- Return Error Response ---
    const status = error.message.includes("Insufficient balance") ? 402 : // Payment Required
                   error.message.includes("not found") ? 404 : // Not Found (e.g., package, user, balance doc)
                   error.message.includes("Invalid price") ? 400 :
                   error.message.includes("Invalid amount") ? 400 :
                   error.message.includes("not supported") ? 400 :
                   error.message.includes("required for package type") ? 400 :
                   500; // Internal Server Error for others (API errors, etc.)

    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
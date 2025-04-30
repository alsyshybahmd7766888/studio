// src/app/api/recharge/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // Assuming firebase.ts is in lib
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
    const { userId, phoneNumber, operator, packageId, amount } = await req.json();

    // --- Validation ---
    if (!userId || !phoneNumber || !operator || (!packageId && !amount)) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    // TODO: Add validation to ensure the request is coming from an authenticated user (e.g., verify ID token if sent)

    // --- Determine Recharge Value & Package Info (Placeholder - Fetch from DB) ---
    let rechargeValue = 0;
    let packageInfo: any = null; // Replace 'any' with your Package interface

    if (packageId) {
      // Fetch package details from Firestore 'packages' collection (adjust path as needed)
      const packageRef = doc(db, 'packages', operator, packageId); // Example path: /packages/Sabafon/sb-dp-yb-week
      const packageSnap = await getDoc(packageRef);
      if (!packageSnap.exists()) {
        return NextResponse.json({ success: false, error: `Package ${packageId} not found for operator ${operator}.` }, { status: 404 });
      }
      packageInfo = packageSnap.data();
      rechargeValue = packageInfo.price; // Assuming 'price' field holds the cost
      if (typeof rechargeValue !== 'number' || rechargeValue <= 0) {
         return NextResponse.json({ success: false, error: `Invalid price for package ${packageId}.` }, { status: 400 });
      }
    } else if (amount) {
      // Direct recharge amount
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

      // --- Simulate or Call External Recharge API ---
      console.log(`Attempting API call to ${operator} (${providerConfig.url}) for ${phoneNumber}...`);
      // Replace with actual API call using axios
      // const apiPayload = { ... }; // Construct payload based on provider docs
      // const headers = { Authorization: `Bearer ${providerConfig.apiKey}`, 'Content-Type': 'application/json' };
      // try {
      //    const apiResponse = await axios.post(providerConfig.url, apiPayload, { headers });
      //    apiResponseData = apiResponse.data;
      //    // Determine success based on provider's response structure
      //    apiSuccess = apiResponse.status >= 200 && apiResponse.status < 300 && apiResponseData?.status === 'success';
      //    providerTxId = apiResponseData?.transaction_id || `PROVIDER_${Date.now()}`; // Adjust field name
      // } catch (err: any) {
      //    console.error("External API call failed:", err.response?.data || err.message);
      //    apiSuccess = false;
      //    apiError = err.response?.data?.message || err.message || 'External API Error';
      // }

      // --- SIMULATION ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      apiSuccess = Math.random() > 0.2; // 80% success rate
      if (apiSuccess) {
          apiResponseData = { status: 'success', message: `Simulated recharge successful for ${phoneNumber}.`, transaction_id: `SIM_${Date.now()}` };
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
        // Log the failed transaction attempt
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
      phoneNumber: phoneNumber,
      packageId: packageId || null,
      packageInfo: packageInfo, // Store basic package info
      amount: transactionResult.deductedAmount,
      status: 'completed',
      timestamp: serverTimestamp(),
      providerResponse: apiResponseData, // Store provider response
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
     try { requestBody = await req.json(); } catch { /* ignore parsing error */ }
     const { userId, phoneNumber, operator, packageId, amount } = requestBody;

    if (userId) { // Only log if we have a user ID
         const transactionsColRef = collection(db, 'transactions');
         await addDoc(transactionsColRef, {
           userId: userId || 'unknown',
           operator: operator || 'unknown',
           phoneNumber: phoneNumber || 'unknown',
           packageId: packageId || null,
           amountAttempted: amount || packageId ? 'package' : 'unknown', // Log attempted amount or package
           status: 'failed',
           timestamp: serverTimestamp(),
           error: error.message, // Log the specific error
           providerResponse: error.cause, // Store API response if it caused the error (needs custom Error)
         }).catch(logError => console.error("Failed to log failed transaction:", logError));
    }

    // --- Return Error Response ---
    const status = error.message.includes("Insufficient balance") ? 402 : // Payment Required
                   error.message.includes("not found") ? 404 : // Not Found (e.g., package, user)
                   500; // Internal Server Error

    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

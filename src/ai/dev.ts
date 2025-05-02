'use server';
// Flows will be imported for their side effects in this file.

// Import the hello flow to register it with Genkit
import './flows/hello-flow';

console.log("Genkit dev server started, flows imported.");

// You can add test calls here for development
/*
import { helloFlow } from './flows/hello-flow';

async function testHelloFlow() {
    try {
        const greeting = await helloFlow('TestUser');
        console.log('Test Flow Output:', greeting);
    } catch (error) {
        console.error('Error testing helloFlow:', error);
    }
}

// testHelloFlow(); // Uncomment to run test on server start
*/

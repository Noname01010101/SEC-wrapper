/*
NOTE: To ensure that automated searches do not affect the ability of other users to access EDGAR websites,
    the SEC will limit automated searches to a total of no more than 10 requests per second regardless of the number of
    machines used to submit requests. This action—consistent with the agency’s Internet Security Policy—will be deployed
    today, July 27, 2021, starting with the EDGAR Portal and EDGAR Company Database.


    If a user or application submits more than 10 requests per second to EDGAR websites, the SEC may limit
    further requests from the relevant IP address(es) for a brief period. When the rate of requests drops below the 
    10-requests-per-second threshold, the user will be able to resume access to these websites.
    This practice is designed to limit excessive automated searches and is not intended or expected
    to impact use by individuals.

    - U.S Securities and Exchange Commission

*/


const MAX_CALLS = 10;
const TIME_FRAME = 1000; // 1 hour limit

let apiCalls = 0;
let startTime = Date.now();

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function APIRateLimitedFetch(url, options) {
    const currentTime = Date.now();

    // Reset counter if time frame has passed
    if (currentTime - startTime > TIME_FRAME) {
        apiCalls = 0;
        startTime = currentTime;
    }

    if (apiCalls < MAX_CALLS) {
        apiCalls++;
        return fetch(url, options);
    }

    // Wait until the time window resets
    const timeToWait = TIME_FRAME - (currentTime - startTime);
    console.log(`API limit reached. Waiting for ${timeToWait / 1000} seconds...`);
    await wait(timeToWait);
    return await APIRateLimitedFetch(url, options);
}

// Export the function so it can be used in other files
module.exports = { APIRateLimitedFetch };
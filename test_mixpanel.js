const axios = require('axios');

const MIXPANEL_PROJECT_TOKEN = "eb8f1b0d14f1c1217260214e3464b21d";
// Ensure EU data center endpoint based on project URL
const MIXPANEL_API_URL = "https://api-eu.mixpanel.com";

async function testMixpanel() {
    console.log("Starting Local Test Mode for Mixpanel Integration...");
    
    const event = {
        event: "mixpanel_test_event",
        properties: {
            token: MIXPANEL_PROJECT_TOKEN,
            distinct_id: "test_user_001",
            time: Math.floor(Date.now() / 1000),
            test_source: "local_test_script"
        }
    };

    console.log("Sending event:", JSON.stringify(event, null, 2));

    try {
        const encoded = Buffer.from(JSON.stringify([event]), 'utf-8').toString('base64');
        const params = new URLSearchParams();
        params.append('data', encoded);
        params.append('verbose', '1');

        const response = await axios.post(`${MIXPANEL_API_URL}/track`, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 5000
        });

        if (response.data && response.data.status === 1) {
            console.log("✅ SUCCESS: Test Event Sent!");
            console.log("Mixpanel Response:", response.data);
        } else {
            console.error("❌ FAILURE: Mixpanel accepted the request but reported a failure.");
            console.error("Response:", response.data);
        }
    } catch (error) {
        console.error("❌ FAILURE: HTTP Request Failed.");
        console.error(error.response ? error.response.data : error.message);
    }
}

testMixpanel();

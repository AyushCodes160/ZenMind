# Mixpanel Diagnostics & Fixes

## 1. Why Did Malformed Requests Happen?
Mixpanel's ingestion endpoints (`/track` and `/engage`) are strict. The "malformed request" errors in the dashboards were likely caused by one of the following root issues:
1. **Endpoint Region Mismatch**: Projects created in the EU datacenter require `api-eu.mixpanel.com`. Sending events to `api.mixpanel.com` causes failures or silent rejection.
2. **Missing Property Validation**: Mixpanel expects `time` to be an integer (UNIX seconds, exactly 10 digits). If a payload included `undefined` properties, unescaped trailing characters, or fractional milliseconds, the JSON decode fails.
3. **Emoji Encoding (UTF-8)**: Mixpanel requires explicit UTF-8 Base64 encoding. If a payload contained emojis (like the mood `😔`), Node.js `Buffer.from()` might drop byte representations unless explicitly passed the `'utf-8'` flag, causing JSON corruption at decoding.
4. **Incorrect JSON Nesting**: The `/engage` endpoint expects a flat array of objects `[{"$token": "...", "$distinct_id": "..."}]`, not wrapped inside a `{ data: [] }` body. 

## 2. What Was Fixed
- **Added Explicit EU Route**: Forced all endpoints to `https://api-eu.mixpanel.com`.
- **Added Event Validation Module**: `validateEvent()` now strictly checks that `time` is <= 10 digits, removes any `null`/`undefined` fields dynamically, and asserts required keys.
- **Added Safe Batch Wrappers**: `safeTrackBatch()` and `safeEngage()` wrap Axios with dynamic retry logic (exponential backoff) and base64 `'utf-8'` encoding strictly.
- **Created Verification Tool**: A new `test_mixpanel.js` sends 1 pristine test event and prints the exact HTTP response (`status: 1` means Mixpanel successfully ingested).

## 3. How to Verify Data Inside Mixpanel
1. **Live View / Events**:
   - Navigate to the **Events** tab.
   - Set the date range to **Last 30 Days** (since injection data uses backdated timestamps for retention simulation).
   - Filter by event `mixpanel_test_event` to verify the `test_mixpanel.js` script worked.
2. **Users**:
   - Go to **Users** in the sidebar. You should see 50 populated users (`zenmind_user_001`, etc.) with populated `$name`, `city`, and `preferred_language`.
3. **Session Replays**:
   - Trigger the live application in the browser (with consent accepted) to allow the frontend JS SDK to push DOM mutation data.

## 4. How to Build Your ZenMind Dashboards

**A. Onboarding Funnel**
1. Click **Funnels** on the left menu.
2. Add Step 1: `sign_up`.
3. Add Step 2: `page_view` → Click the funnel step → Add Filter → `page` equals `zen_ai`.
4. Add Step 3: `chat_message_sent`.
5. This tells you the conversion rate of new users who successfully interact with the AI companion.

**B. Core Value Retention**
1. Click **Retention**.
2. **A user did (Starting Event):** `sign_up`.
3. **And then came back and did (Return Event):** `meditation_completed`.
4. This cohort matrix will show you how well the app retains users seeking meaningful meditation over Days 1 through 14.

**C. Feature Popularity (DAU by Feature)**
1. Click **Insights**.
2. Choose **Event:** `page_view`.
3. Click **Breakdown** → select `page`.
4. Change Chart Type to **Bar** or **Stacked Line**.

**D. Language Breakdown (en vs hi)**
1. Click **Insights**.
2. Choose **Event:** `chat_message_sent`.
3. Click **Breakdown** → select `language`.
4. Change Chart Type to **Pie Chart**.

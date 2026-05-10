// analytics.js
// Mixpanel Initialization & Consent Gate
const MIXPANEL_TOKEN = 'eb8f1b0d14f1c1217260214e3464b21d';
const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Mixpanel JS snippet
(function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unalias identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);

const hasConsentStr = localStorage.getItem('zenmind_analytics_consent');
let hasConsent = hasConsentStr === 'true';

mixpanel.init(MIXPANEL_TOKEN, {
    debug: IS_DEV,
    track_pageview: false, // We'll manually track to add properties
    opt_out_tracking_by_default: hasConsentStr === null || hasConsentStr === 'false',
    api_host: "https://api-eu.mixpanel.com",
    record_sessions_percent: 100
});

export function showConsentBanner() {
    if (localStorage.getItem('zenmind_analytics_consent') !== null) return;
    
    const banner = document.createElement('div');
    banner.style.cssText = \`
        position: fixed; bottom: 0; left: 0; right: 0; 
        background: oklch(24% 0.04 160); 
        padding: 16px 24px; 
        box-shadow: 0 -4px 12px rgba(0,0,0,0.3); 
        z-index: 9999; 
        display: flex; justify-content: space-between; align-items: center;
        font-family: 'DM Sans', sans-serif;
        color: white;
    \`;
    
    banner.innerHTML = \`
        <div style="font-size: 14px; max-width: 70%;">
            We use analytics to improve your mental wellness journey. 
            Is it okay if we track your anonymous usage?
        </div>
        <div style="display: flex; gap: 12px;">
            <button id="decline-analytics" style="padding: 8px 16px; background: transparent; color: white; border: 1px solid oklch(48% 0.03 160); border-radius: 8px; cursor: pointer;">Decline</button>
            <button id="accept-analytics" style="padding: 8px 16px; background: var(--sage, #7C9885); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">Accept Analytics</button>
        </div>
    \`;
    
    document.body.appendChild(banner);
    
    document.getElementById('accept-analytics').addEventListener('click', () => {
        localStorage.setItem('zenmind_analytics_consent', 'true');
        mixpanel.opt_in_tracking();
        hasConsent = true;
        banner.remove();
        trackPageview(); 
    });
    
    document.getElementById('decline-analytics').addEventListener('click', () => {
        localStorage.setItem('zenmind_analytics_consent', 'false');
        banner.remove();
    });
}

export function trackEvent(eventName, properties = {}) {
    if (!hasConsent) return;
    
    const langSelect = document.getElementById('lang-select');
    const globalProps = {
        preferred_language: langSelect ? langSelect.value : 'en'
    };
    
    const finalProps = { ...globalProps, ...properties };
    
    if (IS_DEV) {
        console.log(\`[Mixpanel] \${eventName}\`, finalProps);
    }
    mixpanel.track(eventName, finalProps);
}

export function identifyUser(uid, traits = {}) {
    if (!hasConsent) return;
    mixpanel.identify(uid);
    if (Object.keys(traits).length > 0) {
        mixpanel.people.set(traits);
        const superProps = {};
        if (traits.preferred_language) superProps.preferred_language = traits.preferred_language;
        if (traits.user_type) superProps.user_type = traits.user_type;
        if (traits.city) superProps.city = traits.city;
        mixpanel.register(superProps);
    }
}

export function resetAnalytics() {
    if (!hasConsent) return;
    mixpanel.reset();
}

export function trackPageview() {
    if (!hasConsent) return;
    const pageName = window.location.pathname.split('/').pop()?.replace('.html', '') || 'home';
    trackEvent('page_view', { page: pageName || 'home' });
}

// Attach globally for inline HTML usage if needed
window.zaAnalytics = { trackEvent, identifyUser, resetAnalytics, trackPageview };

/*
=====================================================
📊 MIXPANEL DEMO DASHBOARD CONFIGURATION GUIDE
=====================================================
1. Onboarding Funnel:
   - Click "Funnels" -> Steps: sign_up -> page_view (page: zen_ai) -> chat_message_sent
2. Value Moment Retention:
   - Click "Retention" -> Starting Event: sign_up -> Return Event: meditation_completed
3. Feature Popularity:
   - Click "Insights" -> Event: page_view -> Breakdown: page -> View as: Bar Chart
4. Language Preference Split:
   - Click "Insights" -> Event: Any Event -> Breakdown: preferred_language -> View as: Pie Chart
=====================================================
*/

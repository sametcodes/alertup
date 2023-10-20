import { storage } from '@extend-chrome/storage'

let interceptedRSS = false;
const resolveRSSToken = (details: chrome.webRequest.WebRequestHeadersDetails) => {
    if (interceptedRSS) return;
    interceptedRSS = true;
    console.log("Request intercepted: " + details.url);

    if (!details.requestHeaders) {
        console.log("No request headers found.");
        return;
    }



    const headers = details.requestHeaders.reduce((headers, header: chrome.webRequest.HttpHeader) => {
        headers.push([header.name, header.value || ""])
        return headers;
    }, [] as [string, string][])
    storage.local.set({ siteheaders: headers })

    fetch("https://www.upwork.com/ab/feed/rss-token", { method: "GET", headers })
        .then(response => response.json())
        .then(response => {
            if (response.data) {
                console.log("RSS token successfully loaded.")
                storage.local.set({ rsstoken: response.data });
            }
        })
        .catch(error => { console.log("Error: " + error); });
}

const resolveGraphQLHeaders = (details: chrome.webRequest.WebRequestHeadersDetails) => {
    if (!details.requestHeaders) {
        console.log("No request headers found."); return;
    }
    const headers = details.requestHeaders.reduce((headers, header: chrome.webRequest.HttpHeader) => {
        headers.push([header.name, header.value || ""])
        return headers;
    }, [] as [string, string][]);

    storage.local.set({ graphqlheaders: headers })

}

const callback = function (details: chrome.webRequest.WebRequestHeadersDetails) {
    if (details.url.includes("/ab/feed/rss-token")) resolveRSSToken(details);
    if (details.url.includes("/api/graphql/v1")) resolveGraphQLHeaders(details);
};

const filter = { urls: ["https://*.upwork.com/*"] };
const opt_extraInfoSpec: string[] = ["requestHeaders"];

chrome.webRequest.onBeforeSendHeaders.addListener(
    callback, filter, opt_extraInfoSpec);

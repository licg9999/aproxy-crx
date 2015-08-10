define(function(require) {

    chrome.webRequest.onBeforeRequest.addListener(function(e) {
        console.log(e, 'request');
    }, {
        urls: ['http://*/*', 'https://*/*']
    }, ['blocking']);

    chrome.webRequest.onBeforeSendHeaders.addListener(function(e) {
        console.log(e, 'header');
    }, {
        urls: ["<all_urls>"]
    }, ["blocking", "requestHeaders"]);
});

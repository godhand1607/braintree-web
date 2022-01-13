'use strict';

var browserDetection = require('./browser-detection');

function isBrowserSupported(options) {
  var merchantAllowsReturningToNewBrowserTab, merchantAllowsWebviews, merchantAllowsDesktopBrowsers;
  var isAndroid = browserDetection.isAndroid();
  var isSupportedMobileDevice = isAndroid ||
    (browserDetection.isIos() && !browserDetection.isIosChrome());
  var isAndroidChrome = isAndroid && browserDetection.isChrome();
  var isMobileDeviceThatSupportsReturnToSameTab = browserDetection.isIosSafari() || isAndroidChrome;

  options = options || {};
  // NEXT_MAJOR_VERSION allowDesktop will default to true, but can be opted out
  merchantAllowsDesktopBrowsers = options.allowDesktop === true;
  merchantAllowsReturningToNewBrowserTab = options.hasOwnProperty('allowNewBrowserTab') ? options.allowNewBrowserTab : true;
  // NEXT_MAJOR_VERSION webviews are not supported, except for the case where
  // the merchant themselves is presenting venmo in a webview using the deep
  // link url to get back to their app. For the next major version, we should
  // just not have this option and instead require the merchant to determine
  // if the venmo button should be displayed when presenting it in the
  // merchant's app via a webview.
  merchantAllowsWebviews = options.hasOwnProperty('allowWebviews') ? options.allowWebviews : true;

  if (!merchantAllowsWebviews && (browserDetection.isAndroidWebview() || browserDetection.isIosWebview())) {
    return false;
  }

  if (!merchantAllowsReturningToNewBrowserTab) {
    if (isMobileDeviceThatSupportsReturnToSameTab) {
      return true;
    }

    return merchantAllowsDesktopBrowsers && !isSupportedMobileDevice;
  }

  if (browserDetection.isFacebookOwnedBrowserOnAndroid()) {
    return false;
  }

  if (!merchantAllowsDesktopBrowsers) {
    return isSupportedMobileDevice;
  }

  return true;
}

module.exports = {
  isBrowserSupported: isBrowserSupported
};

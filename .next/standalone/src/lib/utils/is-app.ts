export const isWebView = (): boolean => {
  if (typeof window === "undefined") return false;
  // This matches the "EldokanhApp" tag we added in MainActivity.kt
  return window.navigator.userAgent.includes("EldokanhApp");
};

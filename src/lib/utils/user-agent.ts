export interface UserAgentInfo {
  os: string;
  browser: string;
  deviceType: "mobile" | "tablet" | "desktop";
  original: string;
}

export const parseUserAgent = (userAgent: string | null | undefined): UserAgentInfo => {
  if (!userAgent) {
    return {
      os: "Unknown",
      browser: "Unknown",
      deviceType: "desktop",
      original: "",
    };
  }

  let os = "Unknown";
  let browser = "Unknown";
  let deviceType: "mobile" | "tablet" | "desktop" = "desktop";

  // OS Detection
  if (/Windows/.test(userAgent)) {
    os = "Windows";
  } else if (/Macintosh|Mac OS X/.test(userAgent)) {
    os = "macOS";
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    os = "iOS";
    deviceType = /iPad/.test(userAgent) ? "tablet" : "mobile";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
    deviceType = /Mobile/.test(userAgent) ? "mobile" : "tablet";
  } else if (/Linux/.test(userAgent)) {
    os = "Linux";
  }

  // Browser Detection
  if (/Edg/.test(userAgent)) {
    browser = "Edge";
  } else if (/Chrome/.test(userAgent) && !/Edg/.test(userAgent)) {
    browser = "Chrome";
  } else if (/Firefox/.test(userAgent)) {
    browser = "Firefox";
  } else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    browser = "Safari";
  }

  // Mobile specific adjustments
  if (deviceType !== "desktop" && browser === "Safari") {
    browser = "Mobile Safari";
  }

  return {
    os,
    browser,
    deviceType,
    original: userAgent,
  };
};

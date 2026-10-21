/** The Android app (Capacitor) runs the web app in a WebView, which can't save downloads or print. */
export const isNativeApp = (() => {
  try {
    return !!(window as { Capacitor?: { isNativePlatform?(): boolean } }).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
})();

/** Downloads and printing are blocked when the app runs inside another page (sandboxed frames) or the Android app. */
export const canSaveFiles = (() => {
  try {
    return window.self === window.top && !isNativeApp;
  } catch {
    return false;
  }
})();

/** Build a one-event calendar file (all-day, with a reminder the day before). */
export function calendarFile(title: string, isoDate: string, description: string, uid: string): string {
  const day = isoDate.replace(/-/g, "");
  const [y, m, d] = isoDate.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BenefitBridge//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}@benefitbridge`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${day}`,
    `DTEND;VALUE=DATE:${next}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function downloadCalendar(filename: string, ics: string): void {
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

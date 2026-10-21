import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { Share } from "@capacitor/share";
import type { Locale } from "../content/types";
import { isNativeApp } from "./ics";

/** Voice language for each app language (Indian languages use the India variant). */
const voice = (locale: Locale) => (locale === "en" ? "en-IN" : locale === "es" ? "es-US" : `${locale}-IN`);

/** Read aloud works in the Android app (system voices) and in browsers with speech synthesis. */
export const canSpeak = isNativeApp || (typeof window !== "undefined" && "speechSynthesis" in window);

export async function speak(text: string, locale: Locale): Promise<void> {
  await TextToSpeech.stop().catch(() => undefined);
  await TextToSpeech.speak({ text, lang: voice(locale), rate: 0.95 });
}

export function stopSpeaking(): void {
  void TextToSpeech.stop().catch(() => undefined);
}

/**
 * Share with the phone's share sheet (WhatsApp, SMS, …); falls back to copying the text.
 * Returns what happened so the button can say "Copied".
 */
export async function shareText(title: string, text: string, url?: string): Promise<"shared" | "copied" | "failed"> {
  try {
    await Share.share({ title, text, url, dialogTitle: title });
    return "shared";
  } catch (e) {
    // The person closed the share sheet: nothing to report.
    if (e instanceof Error && /cancel/i.test(e.message)) return "shared";
  }
  try {
    await navigator.clipboard.writeText([title, text, url].filter(Boolean).join("\n"));
    return "copied";
  } catch {
    return "failed";
  }
}

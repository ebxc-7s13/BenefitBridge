import { useEffect, useState } from "react";
import { useApp } from "../lib/state";
import { canSpeak, shareText, speak, stopSpeaking } from "../lib/speech";
import { Icon } from "./Icon";

/** Reads the text aloud in the app's language; tap again to stop. */
export function ListenButton({ text }: { text: string }) {
  const { t, locale } = useApp();
  const [on, setOn] = useState(false);
  useEffect(() => () => stopSpeaking(), []);
  if (!canSpeak) return null;
  return (
    <button
      type="button"
      className="tool-button"
      aria-pressed={on}
      onClick={() => {
        if (on) {
          stopSpeaking();
          setOn(false);
          return;
        }
        setOn(true);
        speak(text, locale)
          .catch(() => undefined)
          .finally(() => setOn(false));
      }}
    >
      <Icon name={on ? "stop" : "speaker"} size={18} /> {on ? t.tools.stop : t.tools.listen}
    </button>
  );
}

/** Sends the name, a short line and the official link to family through the phone's share sheet. */
export function ShareButton({ title, text, url }: { title: string; text: string; url?: string }) {
  const { t } = useApp();
  const [note, setNote] = useState("");
  return (
    <>
      <button
        type="button"
        className="tool-button"
        onClick={async () => {
          const result = await shareText(title, `${text}\n— BenefitBridge`, url);
          setNote(result === "copied" ? t.tools.copied : result === "failed" ? t.tools.shareFailed : "");
        }}
      >
        <Icon name="share" size={18} /> {t.tools.share}
      </button>
      <span className="tool-note" role="status">{note}</span>
    </>
  );
}

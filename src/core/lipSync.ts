import type { Viseme } from "./beebop.config";

/**
 * lipSync.ts — FIXED. Turns the narration's word timestamps into mouth shapes.
 * No audio analysis needed: vowels pick the shape, consonants like m/b/p close the lips.
 * If a segment has no per-word timings, words are spread across the segment by length.
 */

export type LipWord = { w: string; start: number; end: number };
export type LipSegment = { start: number; end: number; text: string; words?: LipWord[] };

export function flattenWords(segments: LipSegment[]): LipWord[] {
  const out: LipWord[] = [];
  for (const s of segments) {
    if (s.words?.length) {
      out.push(...s.words);
      continue;
    }
    const tokens = s.text.replace(/\*/g, "").split(/\s+/).filter(Boolean);
    if (!tokens.length) continue;
    const weight = (tk: string) => Math.max(2, tk.length);
    const total = tokens.reduce((a, tk) => a + weight(tk), 0);
    let cur = s.start;
    for (const tk of tokens) {
      const dur = ((s.end - s.start) * weight(tk)) / total;
      out.push({ w: tk, start: cur, end: cur + dur });
      cur += dur;
    }
  }
  return out;
}

const charViseme = (ch: string): Viseme => {
  if ("ae".includes(ch)) return "wide";
  if ("iy".includes(ch)) return "ee";
  if ("ouw".includes(ch)) return "o";
  if ("mbp".includes(ch)) return "closed";
  return "small";
};

/** The mouth shape at time `t` (seconds), or null when nobody is speaking. */
export function visemeAt(words: LipWord[], t: number): { viseme: Viseme; open: number } | null {
  const word = words.find((wd) => t >= wd.start && t < wd.end + 0.05);
  if (!word) return null;
  const letters = word.w.toLowerCase().replace(/[^a-z]/g, "");
  if (!letters) return { viseme: "small", open: 0.6 };
  const p = Math.min(0.999, Math.max(0, (t - word.start) / Math.max(0.05, word.end - word.start)));
  const ch = letters[Math.floor(p * letters.length)];
  const syllables = Math.max(1, (letters.match(/[aeiouy]+/g) || []).length);
  const open = 0.65 + 0.35 * Math.abs(Math.sin(p * Math.PI * syllables));
  return { viseme: charViseme(ch), open };
}

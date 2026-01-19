export type KidIconTone = "pink" | "blue" | "green" | "yellow" | "purple";

export type KidIcon = {
  emoji: string;
  tone: KidIconTone;
  label: string;
};

function includesAny(haystack: string, needles: string[]) {
  return needles.some((n) => haystack.includes(n));
}

/**
 * Lightweight "stock sticker" icons for participant UI.
 * Keyword-based so it stays deterministic and readable without network calls.
 */
export function getKidIconForEventTitle(title: string): KidIcon {
  const t = title.toLowerCase();

  if (includesAny(t, ["river", "clean", "cleanup", "water", "beach"])) {
    return { emoji: "🌊", tone: "blue", label: "Water" };
  }
  if (includesAny(t, ["food", "pantry", "pack", "meal", "cook", "kitchen"])) {
    return { emoji: "🥫", tone: "yellow", label: "Food" };
  }
  if (includesAny(t, ["tech", "robot", "coding", "mentor", "computer", "demo"])) {
    return { emoji: "🤖", tone: "purple", label: "Tech" };
  }
  if (includesAny(t, ["story", "reading", "book", "night"])) {
    return { emoji: "📚", tone: "pink", label: "Stories" };
  }
  if (includesAny(t, ["garden", "plant", "build", "shelter", "grow"])) {
    return { emoji: "🌱", tone: "green", label: "Garden" };
  }
  if (includesAny(t, ["picnic", "games", "play", "fun"])) {
    return { emoji: "🧺", tone: "pink", label: "Picnic" };
  }

  return { emoji: "✨", tone: "yellow", label: "Event" };
}


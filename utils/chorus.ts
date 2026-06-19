// Pure chorus-detection helper used by SongItem to render a bolder <hr> after
// chorus blocks. A "block" is an array of the raw text lines between separators.
//
// Two heuristics decide whether a block is a chorus:
//   (a) repetition — blocks whose first 1-2 non-empty lines repeat across
//       >=2 blocks are treated as choruses (a refrain repeats; a verse does not);
//   (b) explicit markers — a block whose first non-empty line starts with a
//       known marker word (RU+EN) is forced to chorus/verse, overriding (a).

// Marker words on the first line of a block. Exported so callers/tests can reuse
// them and so the heuristic is self-documenting.
export const CHORUS_MARKERS = ['припев', 'chorus', 'refrain'] as const;
export const VERSE_MARKERS = ['куплет', 'verse'] as const;

// Matches a leading marker word (optionally inside a bracket and/or followed by
// punctuation/number), case-insensitive, RU+EN. e.g. "Припев:", "Chorus 2",
// "куплет 1", "[Припев]", "[Verse 1]" — the bracketed form is what chords.json
// actually uses for most explicit markers.
// NB: we use a negative lookahead `(?![a-zа-яё])` instead of `\b`, because JS
// `\b` is ASCII-only and never matches a boundary after a Cyrillic word — so
// `\b` would silently fail to match RU markers like "Припев"/"Куплет".
const MARKER_TAIL = '(?![a-zа-яё])';
export const CHORUS_MARKER_RE = new RegExp(`^\\s*\\[?\\s*(?:${CHORUS_MARKERS.join('|')})${MARKER_TAIL}`, 'i');
export const VERSE_MARKER_RE = new RegExp(`^\\s*\\[?\\s*(?:${VERSE_MARKERS.join('|')})${MARKER_TAIL}`, 'i');

// Normalize a line for comparison: trim, lowercase, collapse inner whitespace.
function normalizeLine(line: string): string {
  return line.trim().toLowerCase().replace(/\s+/g, ' ');
}

// The non-empty lines of a block (raw, untrimmed empties dropped).
function nonEmptyLines(block: string[]): string[] {
  return block.filter((l) => l.trim().length > 0);
}

// A signature for a block = its first up-to-2 normalized non-empty lines joined.
// Used to detect repeated block starts across the song.
function blockSignature(block: string[]): string {
  return nonEmptyLines(block).slice(0, 2).map(normalizeLine).join('\n');
}

/**
 * Detect which blocks are choruses.
 * @param blocks each block is an array of its raw lines.
 * @returns a boolean per block: true if that block is a chorus.
 */
export function detectChoruses(blocks: string[][]): boolean[] {
  // Count how many blocks share each non-empty signature.
  const signatureCounts = new Map<string, number>();
  for (const block of blocks) {
    const sig = blockSignature(block);
    if (!sig) continue;
    signatureCounts.set(sig, (signatureCounts.get(sig) || 0) + 1);
  }

  return blocks.map((block) => {
    const first = nonEmptyLines(block)[0] || '';

    // (b) explicit markers override the repetition heuristic.
    if (CHORUS_MARKER_RE.test(first)) return true;
    if (VERSE_MARKER_RE.test(first)) return false;

    // (a) repeated block start => chorus.
    const sig = blockSignature(block);
    return !!sig && (signatureCounts.get(sig) || 0) >= 2;
  });
}

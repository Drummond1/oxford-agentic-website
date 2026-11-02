/**
 * FAQ nodes derived from a guide's own question headings.
 *
 * Events and programmes carry an explicit `faqs` list in frontmatter, so their
 * `FAQPage` node is hand-written. Guides have no such field, and a few of them
 * already are a list of questions and answers in prose: measured on the built
 * site, 30 Oct 2026, nine guide pages carry two or more headings that end in a
 * question mark, and not one of them emits a `FAQPage` node.
 *
 * Copying those answers into frontmatter would duplicate the visible copy and
 * let the two drift. This reads the guide's own rendered HTML instead, so the
 * node can only ever say what the page says. Rendered rather than markdown on
 * purpose: markdown goes through smart punctuation on the way to the page, so
 * a source apostrophe in "provider's" is a typographic one by the time anyone
 * reads it, and an extracted answer built from the source would differ from
 * the visible sentence in exactly the way the 30 Oct duplicate-file bug did.
 *
 * A guide opts in with `faqFromHeadings`, because a handful of question
 * headings scattered through an essay is not an FAQ - the flag is for the
 * pages that genuinely are one.
 *
 * Sections are split at `h2` and `h3`, at leaf question headings only: a
 * question heading that groups further question headings is a signpost rather
 * than a question, and the three guides whose question tail is `h3` could
 * otherwise never emit a node at all. A non-question `h3` still belongs to its
 * parent's answer and never starts a section of its own.
 */

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

/** Rendered HTML, reduced to the words a reader sees. */
function plainText(html: string): string {
  return html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, ref: string) => {
      if (ref.startsWith('#')) {
        const code = ref[1] === 'x' || ref[1] === 'X' ? parseInt(ref.slice(2), 16) : Number(ref.slice(1));
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      return ENTITIES[ref.toLowerCase()] ?? match;
    })
    .replace(/\s+/g, ' ')
    /*
     * Every tag became a space above, so a run that ended at a closing tag now
     * has one before whatever followed it. Where that is closing punctuation,
     * the extracted sentence reads "...on each cohort's event page ." - the
     * source is an inline link and the full stop sat directly after `</a>`.
     *
     * Measured on the built site, 1 Nov 2026: 3 occurrences across 96 items in
     * 11 `FAQPage` nodes, all three an inline link followed by `.` or `,`. The
     * visible page is unaffected, because it keeps its tags; only the
     * `acceptedAnswer.text` an engine quotes carries the gap.
     *
     * Closing punctuation only. A space is CORRECT before an opening bracket,
     * an opening quote and the house spaced hyphen, and the same survey found
     * 37 legitimate ` - `, 10 ` (` and 8 ` \u201c` that must not be touched.
     * `)`, `]` and `\u201d` have no occurrences today and are included because
     * they are the same defect and a space is never right before them either.
     */
    .replace(/ +([.,;:?!)\]\u201d])/g, '$1')
    .trim();
}

/**
 * The question headings of a rendered guide, with everything under each one as
 * its answer. Returns an empty list for a page with fewer than two of them, so
 * a single question can never be published as a page's FAQ.
 */
export function faqsFromQuestionHeadings(html: string): Array<{ q: string; a: string }> {
  const faqs: Array<{ q: string; a: string }> = [];
  const headings = [...html.matchAll(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    start: match.index,
    end: match.index + match[0].length,
    // "1. What will I have running at the end?" is numbered for the reader's
    // place in a checklist; the question is the part an engine quotes.
    text: plainText(match[2]).replace(/^\d+\.\s*/, ''),
  }));

  for (const [index, heading] of headings.entries()) {
    if (!heading.text.endsWith('?')) continue;

    // The section a heading owns runs to the next heading at its own level or
    // shallower, so a non-question `h3` stays inside its parent's answer and
    // never starts one of its own. That is the rule as it has always been.
    let boundary = headings.length;
    for (let i = index + 1; i < headings.length; i += 1) {
      if (headings[i].level <= heading.level) {
        boundary = i;
        break;
      }
    }

    // Leaf question headings only. A question heading that groups further
    // question headings is a signpost, and its own prose is not an answer to
    // it: `## Will this still be true when the tools change?` is followed by
    // one sentence saying the question is a fair one, then three `h3`s that
    // each answer a different version of it. Publishing the signpost as the
    // `acceptedAnswer` is worse than publishing nothing, so the parent is
    // skipped and its children stand on their own.
    if (headings.slice(index + 1, boundary).some((sub) => sub.text.endsWith('?'))) continue;

    const answer = plainText(html.slice(heading.end, headings[boundary]?.start));
    if (answer.length === 0) continue;

    faqs.push({ q: heading.text, a: answer });
  }

  return faqs.length >= 2 ? faqs : [];
}

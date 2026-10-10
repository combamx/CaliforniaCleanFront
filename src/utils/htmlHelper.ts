/**
 * Decodes HTML entities (e.g. &lt;p&gt; -> <p>) stored in the database.
 * Handles single and double entity encodings.
 */
export function decodeHtml(html?: string | null): string {
  if (!html) return '';
  try {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    let decoded = txt.value;
    if (decoded.includes('&lt;') && decoded.includes('&gt;')) {
      txt.innerHTML = decoded;
      decoded = txt.value;
    }
    return decoded;
  } catch {
    return html;
  }
}

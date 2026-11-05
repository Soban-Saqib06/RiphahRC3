import { extractText } from "unpdf";

/**
 * Extract text from a PDF buffer using unpdf.
 * Returns text trimmed and capped at 60,000 characters.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  const uint8 = new Uint8Array(buffer);
  const { text } = await extractText(uint8);

  const fullText = Array.isArray(text) ? text.join("\n") : (text || "");
  const trimmed = fullText.trim();

  // Cap at 60,000 chars as specified in DATA_MODEL section 7
  return trimmed.slice(0, 60000);
}

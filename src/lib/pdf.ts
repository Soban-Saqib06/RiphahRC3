import zlib from "zlib";

/**
 * Clean decoded text by unescaping PDF literal strings.
 */
function unescapePdfString(str: string): string {
  return str
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

/**
 * Extract text from a single decompressed PDF content stream.
 */
function extractFromContentStream(streamContent: string): string {
  const textParts: string[] = [];

  // Match text blocks: BT ... ET
  const btRegex = /BT[\s\S]*?ET/g;
  let btMatch: RegExpExecArray | null;

  while ((btMatch = btRegex.exec(streamContent)) !== null) {
    const block = btMatch[0];

    // 1. Tj operator: (literal string) Tj
    const tjRegex = /\(((?:\\\(|\\\)|[^)])*)\)\s*Tj/g;
    let tjMatch: RegExpExecArray | null;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      textParts.push(unescapePdfString(tjMatch[1]));
    }

    // 2. TJ operator: [(item) 10 (item2)] TJ
    const tjArrayRegex = /\[((?:\\\(|\\\)|[^\]])*)\]\s*TJ/g;
    let tjArrMatch: RegExpExecArray | null;
    while ((tjArrMatch = tjArrayRegex.exec(block)) !== null) {
      const arrContent = tjArrMatch[1];
      const strInArrRegex = /\(((?:\\\(|\\\)|[^)])*)\)/g;
      let strMatch: RegExpExecArray | null;
      const subParts: string[] = [];
      while ((strMatch = strInArrRegex.exec(arrContent)) !== null) {
        subParts.push(unescapePdfString(strMatch[1]));
      }
      if (subParts.length > 0) {
        textParts.push(subParts.join(" "));
      }
    }

    // 3. ' or " operator
    const quoteRegex = /\(((?:\\\(|\\\)|[^)])*)\)\s*['"]/g;
    let qMatch: RegExpExecArray | null;
    while ((qMatch = quoteRegex.exec(block)) !== null) {
      textParts.push("\n" + unescapePdfString(qMatch[1]));
    }

    textParts.push("\n");
  }

  return textParts.join(" ");
}

/**
 * Extract readable text from a PDF buffer without external npm dependencies.
 * Decompresses FlateDecode streams and parses text drawing operators.
 * Capped at 60,000 characters.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  const extractedChunks: string[] = [];
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  const rawString = buffer.toString("binary");

  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(rawString)) !== null) {
    const streamStart = match.index + match[0].indexOf("\n") + 1;
    const streamEnd = match.index + match[0].lastIndexOf("endstream") - (rawString[match.index + match[0].lastIndexOf("endstream") - 1] === "\r" ? 2 : 1);
    const streamBuffer = buffer.subarray(streamStart, streamEnd);

    // Try inflating with FlateDecode / zlib
    let streamText = "";
    try {
      const decompressed = zlib.inflateSync(streamBuffer);
      streamText = decompressed.toString("latin1");
    } catch {
      // If inflate fails, try raw text decoding
      streamText = streamBuffer.toString("latin1");
    }

    const chunk = extractFromContentStream(streamText);
    if (chunk.trim()) {
      extractedChunks.push(chunk);
    }
  }

  // Fallback: If no BT...ET blocks were found (e.g. plain text or different layout), search for text tokens
  if (extractedChunks.length === 0) {
    const fallbackRegex = /\(([^()]{3,})\)/g;
    let fbMatch: RegExpExecArray | null;
    while ((fbMatch = fallbackRegex.exec(rawString)) !== null) {
      const cleaned = fbMatch[1].replace(/[^\x20-\x7E\t\n\r]/g, "");
      if (cleaned.length > 3) {
        extractedChunks.push(cleaned);
      }
    }
  }

  const fullText = extractedChunks
    .join(" ")
    .replace(/[\t ]+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();

  // Cap at 60,000 chars per docs/DATA_MODEL.md section 7
  return fullText.slice(0, 60000);
}

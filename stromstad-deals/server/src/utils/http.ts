import axios from "axios";
import * as cheerio from "cheerio";

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

/** Fetch a URL and return a Cheerio instance for HTML parsing. */
export async function fetchHtml(
  url: string,
  extraHeaders?: Record<string, string>
): Promise<cheerio.CheerioAPI> {
  const { data } = await axios.get<string>(url, {
    headers: { ...DEFAULT_HEADERS, ...extraHeaders },
    timeout: 15_000,
  });
  return cheerio.load(data);
}

/** Fetch JSON from a URL (for store APIs). */
export async function fetchJson<T>(
  url: string,
  extraHeaders?: Record<string, string>
): Promise<T> {
  const { data } = await axios.get<T>(url, {
    headers: {
      ...DEFAULT_HEADERS,
      Accept: "application/json",
      ...extraHeaders,
    },
    timeout: 15_000,
  });
  return data;
}

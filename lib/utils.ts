export function normalizeUrl(input: string): string {
  let trimmed = input.trim();

  // Add https if missing
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const url = new URL(trimmed);

    const paramsToRemove = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "gbraid",
      "gad_source",
      "gad_campaignid",
    ];

    paramsToRemove.forEach((param) => {
      url.searchParams.delete(param);
    });

    return url.toString();
  } catch {
    return trimmed;
  }
}

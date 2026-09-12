export const INDUSTRIES = [
  "Agriculture",
  "Arts and media",
  "Construction",
  "Education",
  "Energy",
  "Finance",
  "Government",
  "Healthcare",
  "Hospitality",
  "Legal",
  "Manufacturing",
  "Marketing",
  "Nonprofit",
  "Real estate",
  "Retail",
  "Science and research",
  "Technology",
  "Telecommunications",
  "Transportation",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export function isIndustry(value: string): value is Industry {
  return (INDUSTRIES as readonly string[]).includes(value);
}

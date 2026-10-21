/** A country we don't screen for yet: its official programs, who they're for and where to apply. */
export interface WorldCountry {
  code: string;
  /** English name. */
  name: string;
  portal: { name: string; url: string };
  helpline?: { name: string; number: string };
  programs: WorldProgram[];
}

export interface WorldProgram {
  id: string;
  name: string;
  /** One of the shared categories (food, health, home, work, money, family, security, education). */
  category: string;
  who: string;
  gives: string;
  documents: string[];
  apply: string[];
  /** Official page to apply or learn more. */
  url: string;
}

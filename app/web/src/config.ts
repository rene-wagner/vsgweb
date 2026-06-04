import type { Statistic } from "@vsg/types";

export const config = {
  homepage: {
    stats: [
      { label: "Mitglieder", value: "123+" },
      { label: "Abteilungen", value: "4" },
      { label: "Jahre Geschichte", value: "40" },
      { label: "Aktive Trainer", value: "25+" },
    ] satisfies Statistic[],
    postsCount: 5,
    galleryCount: 20,
  },
  departmentView: {
    galleryCount: 20,
    ctaPrimaryButtonText: "Probetraining anfragen",
    ctaPrimaryButtonLink: "/kontakt",
    ctaSecondaryButtonText: "Mitglied werden",
    ctaSecondaryButtonLink: "/verein/aufnahmeantrag",
  },
} as const;

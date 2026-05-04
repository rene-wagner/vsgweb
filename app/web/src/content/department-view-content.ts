export interface DepartmentViewContent {
  resultsTitle: string;
  resultsSubtitle: string;
  resultsDescription: string;
  trainingScheduleTitle: string;
  trainingScheduleSubtitle: string;
  trainingScheduleDescription: string;
  locationsTitle: string;
  locationsSubtitle: string;
  locationsDescription: string;
  newsHeadline: string;
  newsSubtitle: string;
  galleryHeadline: string;
  gallerySubtitle: string;
  galleryDescription: string;
  ctaDescription: string;
  ctaPrimaryButtonText: string;
  ctaPrimaryButtonLink: string;
  ctaSecondaryButtonText: string;
  ctaSecondaryButtonLink: string;
}

export const departmentViewContent: DepartmentViewContent = {
  resultsTitle: "",
  resultsSubtitle: "",
  resultsDescription: "",

  trainingScheduleTitle: "Trainingszeiten",
  trainingScheduleSubtitle: "Wann wir trainieren",
  trainingScheduleDescription:
    "Regelmäßiges Training für alle Altersgruppen. Anfänger und Fortgeschrittene sind herzlich willkommen!",

  locationsTitle: "Unsere Standorte",
  locationsSubtitle: "Wo wir spielen",
  locationsDescription:
    "Moderne Hallen mit professioneller Ausstattung für optimale Trainingsbedingungen.",

  newsHeadline: "Aktuelle Neuigkeiten",
  newsSubtitle: "Was bei uns los ist",

  galleryHeadline: "Galerie",
  gallerySubtitle: "Bilder aus der Abteilung",
  galleryDescription:
    "Aktuelle Einblicke aus Training, Spielbetrieb und Vereinsleben dieser Abteilung.",

  ctaDescription:
    "Komm einfach zum Probetraining vorbei! Wir freuen uns auf dich - egal ob Anfänger oder erfahrener Sportfreund.",
  ctaPrimaryButtonText: "Probetraining anfragen",
  ctaPrimaryButtonLink: "/kontakt",
  ctaSecondaryButtonText: "Mitglied werden",
  ctaSecondaryButtonLink: "/verein/mitgliedschaft",
};

import type { Statistic } from "@vsg/types";

export interface HomepageContent {
  welcomeText: string;
  stats: Statistic[];
  departmentsHeadline: string;
  departmentsDescription: string;
  departmentsSubtitle: string;
  postsHeadline: string;
  postsDescription: string;
  postsSubtitle: string;
  postsCount: number;
  galleryHeadline: string;
  galleryDescription: string;
  gallerySubtitle: string;
  galleryCount: number;
  ctaHeadline: string;
  ctaDescription: string;
}

export const homepageContent: HomepageContent = {
  // Welcome text
  welcomeText: `## Herzlich Willkommen auf unserer Homepage!

Schön, dass du auf unseren Verein aufmerksam geworden bist. Mit **Tischtennis, Badminton, Gymnastik und Volleyball** bieten wir eine ziemlich große Auswahl allseits beliebter Sportarten, welche nur drauf warten ausprobiert zu werden.

Ansonsten für alle, die unsere Seite das erste Mal besuchen, viel Spaß beim Stöbern. Es gibt garantiert viel zu entdecken. Vielleicht wird ja sogar eine Mitgliedschaft daraus, [kontaktiert](/kontakt?person=1) mich einfach.

Ihr wollt Vereinsmitglied werden, kein Problem, hier ist der [Formularlink](https://vsgapi.rwgnr.de/uploads/f252e251-759f-48f1-8599-7651fc3d859a.pdf) dazu.`,

  // Statistics
  stats: [
    { label: "Mitglieder", value: "123+" },
    { label: "Abteilungen", value: "4" },
    { label: "Jahre Geschichte", value: "40" },
    { label: "Aktive Trainer", value: "25+" },
  ],

  // Departments
  departmentsSubtitle: "Für jeden das Richtige",
  departmentsHeadline: "Unsere Abteilungen",
  departmentsDescription:
    "Entdecke die Vielfalt unseres Sportangebots. Von Volleyball über Badminton bis hin zu Tischtennis und Turnen - bei uns findet jeder die passende Sportart.",

  // Posts
  postsHeadline: "Aktuelles aus dem Verein",
  postsDescription:
    "Bleib auf dem Laufenden mit Berichten, Terminen und Einblicken aus dem Vereinsalltag.",
  postsSubtitle: "Aus dem Verein",
  postsCount: 5,

  // Gallery
  galleryHeadline: "Momente aus dem Verein",
  galleryDescription:
    "Einblicke in Training, Spieltage und das Vereinsleben aus unseren Abteilungen.",
  gallerySubtitle: "Galerie",
  galleryCount: 20,

  // Call to Action
  ctaHeadline: "Werde Teil unseres Vereins",
  ctaDescription:
    "Ob Mitgliedschaft, Probetraining oder Fragen zum Verein: Wir freuen uns auf deine Nachricht.",
};

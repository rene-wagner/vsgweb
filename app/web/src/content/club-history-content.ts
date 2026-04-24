import type { ChartData } from "chart.js";

interface FactItem {
  label: string;
  value: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface ChronicleEntry {
  year?: string;
  text: string;
}

interface ChronicleGroup {
  id: string;
  title: string;
  content: ChronicleEntry[];
}

interface FestivalItem {
  headline: string;
  text: string;
}

interface HallOfFameCategory {
  id: string;
  label: string;
}

interface HallOfFameItem {
  year: string;
  category: string;
  title: string;
  description: string;
  highlight?: string;
}

export interface ClubHistoryContent {
  heroHeadline: string;
  heroDescription: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaAnchor: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaAnchor: string;
  foundingTagline: string;
  foundingHeadline: string;
  foundingDescription: string;
  foundingFactCardHeadline: string;
  foundingFacts: FactItem[];
  foundingMilestonesHeadline: string;
  foundingMilestones: TimelineItem[];
  developmentSubtitle: string;
  developmentHeadline: string;
  developmentDescription: string;
  developmentChartHeadline: string;
  developmentChartLegendLabel: string;
  developmentChartData: ChartData<"line">;
  developmentChronicleSubtitle: string;
  developmentChronicleHeadline: string;
  developmentChronicleDescription?: string;
  developmentChronicleGroups: ChronicleGroup[];
  festivalsSubtitle: string;
  festivalsHeadline: string;
  festivalsDescription: string;
  festivalsItems: FestivalItem[];
  hallOfFameSubtitle: string;
  hallOfFameHeadline: string;
  hallOfFameDescription: string;
  hallOfFameCategories: HallOfFameCategory[];
  hallOfFameItems: HallOfFameItem[];
  ctaHeadline: string;
  ctaDescription: string;
  ctaPrimaryButtonText: string;
  ctaPrimaryButtonLink: string;
}

export const clubHistoryContent: ClubHistoryContent = {
  heroHeadline: "Geschichte",
  heroDescription:
    "Von den ersten Trainingseinheiten bis zum lebendigen Vereinsalltag von heute - unsere Geschichte ist von Gemeinschaft, Einsatz und viel Leidenschaft für den Sport geprägt.",
  heroPrimaryCtaLabel: "Gründung",
  heroPrimaryCtaAnchor: "#gruendung",
  heroSecondaryCtaLabel: "Entwicklung",
  heroSecondaryCtaAnchor: "#entwicklung",

  foundingTagline: "Der Ursprung",
  foundingHeadline: "Wie alles begann",
  foundingDescription: `1985 wurde die VSG Kugelberg mit dem Ziel gegründet, Menschen in Weißenfels und Umgebung durch Sport zusammenzubringen.

Was mit viel Eigeninitiative, Engagement und einer klaren Idee von Vereinsleben begann, entwickelte sich über die Jahre zu einem festen Bestandteil der lokalen Sportlandschaft.

Von Anfang an standen nicht nur sportliche Leistungen im Mittelpunkt, sondern auch das Miteinander, die Verlässlichkeit im Ehrenamt und die Freude daran, gemeinsam etwas aufzubauen.`,
  foundingFactCardHeadline: "Wichtige Eckdaten",
  foundingFacts: [
    { label: "Gründung", value: "1985: Start der Vereinsgeschichte" },
    { label: "Standort", value: "Weißenfels und Umgebung" },
    { label: "Schwerpunkt", value: "Breiten- und Vereinssport" },
    { label: "Gemeinschaft", value: "Mehrere Generationen unter einem Dach" },
  ],
  foundingMilestonesHeadline: "Meilensteine der Anfangsjahre",
  foundingMilestones: [
    {
      year: "1985",
      title: "Vereinsgründung",
      description:
        "Mit viel Einsatz und einer gemeinsamen Idee wird die VSG Kugelberg ins Leben gerufen.",
    },
    {
      year: "1987",
      title: "Erste festen Trainingsstrukturen",
      description:
        "Regelmäßige Trainingszeiten und ein verlässlicher Vereinsrhythmus geben dem Alltag Struktur.",
    },
    {
      year: "1990",
      title: "Wachsende Mitgliederbasis",
      description:
        "Immer mehr Sportbegeisterte finden ihren Weg in den Verein und prägen die nächsten Jahre.",
    },
    {
      year: "1995",
      title: "Ausbau des Vereinslebens",
      description:
        "Neben dem Sport entstehen feste Traditionen, Veranstaltungen und ein starkes Gemeinschaftsgefühl.",
    },
  ],

  developmentSubtitle: "Entwicklung",
  developmentHeadline: "Entwicklung des Vereins",
  developmentDescription:
    "Aus den ersten Jahren des Aufbaus entstand Schritt für Schritt ein aktiver Verein mit sportlicher Vielfalt, wachsender Verantwortung und einem klaren Platz im lokalen Vereinsleben.",
  developmentChartHeadline: "Mitgliederstatistik",
  developmentChartLegendLabel: "Mitgliederzahl",
  developmentChartData: {
    labels: ["1985", "1990", "1995", "2000", "2005", "2010", "2015", "2020", "2025"],
    datasets: [
      {
        label: "Mitgliederzahl",
        data: [28, 46, 63, 79, 92, 105, 114, 121, 123],
        borderColor: "#d4a91a",
        backgroundColor: "rgba(212, 169, 26, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#d4a91a",
        pointBorderColor: "#ffffff",
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  },
  developmentChronicleSubtitle: "Chronik",
  developmentChronicleHeadline: "Chronik der Ereignisse",
  developmentChronicleDescription:
    "Ein Blick auf prägende Stationen, Entwicklungen und besondere Momente unserer Vereinsgeschichte.",
  developmentChronicleGroups: [
    {
      id: "aufbau",
      title: "Aufbau und Etablierung",
      content: [
        {
          year: "1985",
          text: "Die Vereinsarbeit startet mit viel Einsatzbereitschaft und dem Ziel, eine dauerhafte sportliche Heimat zu schaffen.",
        },
        {
          year: "1988",
          text: "Trainingsabläufe, Verantwortlichkeiten und erste feste Vereinsstrukturen festigen sich.",
        },
        {
          year: "1992",
          text: "Der Verein wird im Ort immer sichtbarer und gewinnt weiter an Zuspruch.",
        },
      ],
    },
    {
      id: "wachstum",
      title: "Wachstum und Vielfalt",
      content: [
        {
          year: "1998",
          text: "Neue Impulse im Trainingsbetrieb und mehr Beteiligung im Vereinsleben sorgen für eine stabile Entwicklung.",
        },
        {
          year: "2006",
          text: "Die sportliche Vielfalt wird ausgebaut und der Verein spricht unterschiedliche Altersgruppen an.",
        },
        {
          year: "2014",
          text: "Die VSG Kugelberg ist längst mehr als nur Trainingsort - sie ist Treffpunkt, Team und Gemeinschaft.",
        },
      ],
    },
    {
      id: "heute",
      title: "Gegenwart und Ausblick",
      content: [
        {
          year: "2020",
          text: "Auch in herausfordernden Zeiten bleibt der Verein aktiv und hält an seinem Gemeinschaftsgedanken fest.",
        },
        {
          year: "2025",
          text: "Heute steht die VSG Kugelberg für Verlässlichkeit, Offenheit und Freude am gemeinsamen Sport.",
        },
      ],
    },
  ],

  festivalsSubtitle: "Vereinsleben",
  festivalsHeadline: "Feste und Traditionen",
  festivalsDescription:
    "Unser Verein lebt nicht nur vom Trainingsbetrieb, sondern auch von gemeinsamen Momenten, Begegnungen und festen Traditionen im Jahresverlauf.",
  festivalsItems: [
    {
      headline: "Sommerfest",
      text: "Beim Sommerfest kommen Mitglieder, Familien und Freunde zusammen, um die Saison in lockerer Atmosphäre zu feiern.",
    },
    {
      headline: "Vereinsausflüge",
      text: "Gemeinsame Ausflüge stärken das Miteinander und schaffen Erinnerungen, die weit über den Sport hinausreichen.",
    },
    {
      headline: "Jubiläen und Ehrungen",
      text: "Besondere Vereinsmomente und langjähriges Engagement bekommen bei uns den Raum, den sie verdienen.",
    },
  ],

  hallOfFameSubtitle: "Unser Stolz",
  hallOfFameHeadline: "Hall of Fame",
  hallOfFameDescription:
    "Einige Momente ragen aus unserer Vereinsgeschichte besonders heraus. Hier ehren wir sportliche Höhepunkte, prägende Leistungen und Erfolge, auf die wir bis heute mit Recht stolz sind.",
  hallOfFameCategories: [
    { id: "badminton", label: "Badminton" },
    { id: "table-tennis", label: "Tischtennis" },
    { id: "volleyball", label: "Volleyball" },
    { id: "club", label: "Verein" },
  ],
  hallOfFameItems: [
    {
      year: "1997",
      category: "badminton",
      title: "Bronzemedaille bei der Badminton-Weltmeisterschaft",
      description:
        "Mit dem Gewinn der Bronzemedaille bei einer Badminton-Weltmeisterschaft gelang einem Mitglied unseres Vereins ein Erfolg, der weit über die Region hinausstrahlte und bis heute einen besonderen Platz in unserer Geschichte einnimmt.",
      highlight:
        "Ein historischer Moment für die VSG Kugelberg und ein Meilenstein für den Badmintonsport in unserem Verein.",
    },
    {
      year: "2004",
      category: "table-tennis",
      title: "Aufstieg in die nächste Spielklasse",
      description:
        "Mit einer geschlossenen Mannschaftsleistung und viel Konstanz über die gesamte Saison gelang der entscheidende Aufstieg und damit einer der prägenden Erfolge der Abteilung.",
      highlight: "Teamgeist, Verlässlichkeit und sportlicher Ehrgeiz führten diesen Erfolg herbei.",
    },
    {
      year: "2011",
      category: "volleyball",
      title: "Erfolgreiche Turnierserie im Regionalvergleich",
      description:
        "Mehrere starke Auftritte bei regionalen Turnieren machten deutlich, wie viel Qualität und Zusammenhalt in der Mannschaft steckt.",
    },
    {
      year: "2020",
      category: "club",
      title: "Zusammenhalt in herausfordernden Zeiten",
      description:
        "Auch in schwierigen Phasen blieb das Vereinsleben lebendig. Trainingsformen wurden angepasst, Kontakte gehalten und der Gemeinschaftsgedanke bewusst weitergetragen.",
      highlight:
        "Nicht nur Medaillen, sondern auch gelebter Zusammenhalt gehören in unsere Hall of Fame.",
    },
  ],

  ctaHeadline: "Werde Teil unserer Geschichte",
  ctaDescription:
    "Ob Probetraining, Mitgliedschaft oder einfach Interesse am Vereinsleben - wir freuen uns, wenn du den nächsten Abschnitt mit uns gestaltest.",
  ctaPrimaryButtonText: "Mitglied werden",
  ctaPrimaryButtonLink: "/verein/mitgliedschaft",
};

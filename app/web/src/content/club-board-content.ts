export interface ClubBoardMember {
  id: string;
  firstName: string;
  lastName: string;
  type: string;
  sort: number;
}

export interface ClubBoardContent {
  heroHeadline: string;
  heroDescription: string;
  sectionHeadline: string;
  sectionDescription: string;
  boardMembers: ClubBoardMember[];
}

export const clubBoardContent: ClubBoardContent = {
  heroHeadline: "Vorstand",
  heroDescription:
    "Die Menschen, die unseren Verein organisatorisch tragen, Verantwortung uebernehmen und das Vereinsleben gemeinsam gestalten.",
  sectionHeadline: "Menschen mit Verantwortung",
  sectionDescription:
    "Der Vorstand kuemmert sich um die organisatorischen, finanziellen und sportlichen Rahmenbedingungen im Verein. Hier seht ihr eine vorlaeufige Darstellung mit Dummy-Daten, bis die finalen Inhalte eingepflegt sind.",
  boardMembers: [
    {
      id: "chairperson",
      firstName: "Max",
      lastName: "Mustermann",
      type: "Vorsitzender",
      sort: 1,
    },
    {
      id: "deputy-chairperson",
      firstName: "Julia",
      lastName: "Beispiel",
      type: "Stellvertretende Vorsitzende",
      sort: 2,
    },
    {
      id: "treasurer",
      firstName: "Thomas",
      lastName: "Vorlage",
      type: "Schatzmeister",
      sort: 3,
    },
    {
      id: "secretary",
      firstName: "Anna",
      lastName: "Musterfrau",
      type: "Schriftfuehrerin",
      sort: 4,
    },
    {
      id: "youth-representative",
      firstName: "Leon",
      lastName: "Demo",
      type: "Jugendwart",
      sort: 5,
    },
    {
      id: "assessor",
      firstName: "Sophie",
      lastName: "Platzhalter",
      type: "Beisitzerin",
      sort: 6,
    },
  ],
};

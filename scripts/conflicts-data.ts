import type { ConflictAction, ConflictSource, ConflictStatus } from "../types/conflict";

type ConflictSeed = {
  slug: string;
  title: string;
  country: string;
  country_code: string;
  status: ConflictStatus;
  sources: ConflictSource[];
  actions: ConflictAction[];
};

export const conflicts: ConflictSeed[] = [
  {
    slug: "sudan-civil-war",
    title: "Sudan Civil War",
    country: "Sudan",
    country_code: "SDN",
    status: "active",
    sources: [
      { name: "ACLED Sudan", url: "https://acleddata.com/tag/sudan" },
      { name: "UNHCR Sudan", url: "https://www.unhcr.org/countries/sudan" },
      { name: "ReliefWeb Sudan", url: "https://reliefweb.int/country/sdn" },
    ],
    actions: [
      { label: "Donate to MSF Sudan", url: "https://www.msf.org/sudan" },
      { label: "Support IRC Sudan", url: "https://www.rescue.org/country/sudan" },
      { label: "UNHCR Sudan appeal", url: "https://donate.unhcr.org/int/en/sudan" },
    ],
  },
  {
    slug: "palestine-gaza",
    title: "Palestine — Gaza",
    country: "Palestine",
    country_code: "PSE",
    status: "active",
    sources: [
      { name: "OCHA oPt", url: "https://www.ochaopt.org" },
      { name: "UNRWA", url: "https://www.unrwa.org/resources/reports" },
      { name: "ReliefWeb Palestine", url: "https://reliefweb.int/country/pse" },
    ],
    actions: [
      { label: "Donate to UNRWA", url: "https://donate.unrwa.org" },
      { label: "MSF Palestine", url: "https://www.msf.org/palestine" },
      { label: "Amnesty — Act now", url: "https://www.amnesty.org/en/location/middle-east-and-north-africa/middle-east/israel-and-occupied-palestinian-territories" },
    ],
  },
  {
    slug: "myanmar-civil-war",
    title: "Myanmar Civil War",
    country: "Myanmar",
    country_code: "MMR",
    status: "active",
    sources: [
      { name: "ACLED Myanmar", url: "https://acleddata.com/tag/myanmar" },
      { name: "UNHCR Myanmar", url: "https://www.unhcr.org/countries/myanmar" },
      { name: "ReliefWeb Myanmar", url: "https://reliefweb.int/country/mmr" },
    ],
    actions: [
      { label: "Support IRC Myanmar", url: "https://www.rescue.org/country/myanmar" },
      { label: "MSF Myanmar", url: "https://www.msf.org/myanmar" },
      { label: "Human Rights Watch", url: "https://www.hrw.org/asia/burma" },
    ],
  },
  {
    slug: "haiti-gang-violence",
    title: "Haiti — Gang Violence & Crisis",
    country: "Haiti",
    country_code: "HTI",
    status: "active",
    sources: [
      { name: "ACLED Haiti", url: "https://acleddata.com/tag/haiti" },
      { name: "UNHCR Haiti", url: "https://www.unhcr.org/countries/haiti" },
      { name: "ReliefWeb Haiti", url: "https://reliefweb.int/country/hti" },
    ],
    actions: [
      { label: "MSF Haiti", url: "https://www.msf.org/haiti" },
      { label: "Support IRC Haiti", url: "https://www.rescue.org/country/haiti" },
      { label: "UNICEF Haiti", url: "https://www.unicef.org/haiti" },
    ],
  },
  {
    slug: "drc-m23-conflict",
    title: "DR Congo — M23 Conflict",
    country: "Democratic Republic of the Congo",
    country_code: "COD",
    status: "active",
    sources: [
      { name: "ACLED DRC", url: "https://acleddata.com/tag/democratic-republic-of-congo" },
      { name: "UNHCR DRC", url: "https://www.unhcr.org/countries/democratic-republic-of-the-congo" },
      { name: "ReliefWeb DRC", url: "https://reliefweb.int/country/cod" },
    ],
    actions: [
      { label: "MSF DRC", url: "https://www.msf.org/democratic-republic-congo" },
      { label: "IRC DRC", url: "https://www.rescue.org/country/democratic-republic-congo" },
      { label: "Amnesty DRC", url: "https://www.amnesty.org/en/location/africa/central-africa/democratic-republic-of-the-congo" },
    ],
  },
  {
    slug: "ukraine-war",
    title: "Ukraine — War with Russia",
    country: "Ukraine",
    country_code: "UKR",
    status: "active",
    sources: [
      { name: "ACLED Ukraine", url: "https://acleddata.com/tag/ukraine" },
      { name: "UNHCR Ukraine", url: "https://www.unhcr.org/countries/ukraine" },
      { name: "ReliefWeb Ukraine", url: "https://reliefweb.int/country/ukr" },
    ],
    actions: [
      { label: "UNHCR Ukraine appeal", url: "https://donate.unhcr.org/int/en/ukraine" },
      { label: "MSF Ukraine", url: "https://www.msf.org/ukraine" },
      { label: "IRC Ukraine", url: "https://www.rescue.org/country/ukraine" },
    ],
  },
  {
    slug: "yemen-war",
    title: "Yemen — Civil War",
    country: "Yemen",
    country_code: "YEM",
    status: "active",
    sources: [
      { name: "ACLED Yemen", url: "https://acleddata.com/tag/yemen" },
      { name: "UNHCR Yemen", url: "https://www.unhcr.org/countries/yemen" },
      { name: "ReliefWeb Yemen", url: "https://reliefweb.int/country/yem" },
    ],
    actions: [
      { label: "MSF Yemen", url: "https://www.msf.org/yemen" },
      { label: "IRC Yemen", url: "https://www.rescue.org/country/yemen" },
      { label: "UNICEF Yemen", url: "https://www.unicef.org/yemen" },
    ],
  },
  {
    slug: "ethiopia-conflict",
    title: "Ethiopia — Ongoing Conflict",
    country: "Ethiopia",
    country_code: "ETH",
    status: "monitoring",
    sources: [
      { name: "ACLED Ethiopia", url: "https://acleddata.com/tag/ethiopia" },
      { name: "UNHCR Ethiopia", url: "https://www.unhcr.org/countries/ethiopia" },
      { name: "ReliefWeb Ethiopia", url: "https://reliefweb.int/country/eth" },
    ],
    actions: [
      { label: "MSF Ethiopia", url: "https://www.msf.org/ethiopia" },
      { label: "IRC Ethiopia", url: "https://www.rescue.org/country/ethiopia" },
      { label: "Amnesty Ethiopia", url: "https://www.amnesty.org/en/location/africa/east-africa-the-horn-and-great-lakes/ethiopia" },
    ],
  },
];

import type { ConflictAction, ConflictSource, ConflictStatus } from "../types/conflict";

type ConflictSeed = {
  slug: string;
  title: string;
  country: string;
  country_code: string;
  region: string;
  status: ConflictStatus;
  started_at: string;
  summary: string;
  key_facts: string[];
  fatalities: number;
  displaced: number;
  refugees: number;
  children_affected: number;
  image_url: string;
  sources: ConflictSource[];
  actions: ConflictAction[];
};

export const conflicts: ConflictSeed[] = [
  {
    slug: "sudan-civil-war",
    title: "Sudan Civil War",
    country: "Sudan",
    country_code: "SDN",
    region: "East Africa",
    status: "active",
    started_at: "April 2023",
    summary:
      "In April 2023, a power struggle between two military generals plunged Sudan into full-scale war. General al-Burhan leads the Sudanese Armed Forces, while Hemedti commands the Rapid Support Forces. The two had jointly overthrown a civilian government in 2021, then turned on each other. The RSF has carried out ethnic cleansing in Darfur, targeting the Masalit and other non-Arab communities. Airstrikes from both sides hit civilian neighborhoods across Khartoum and other cities daily. Hospitals, schools, and markets have been systematically destroyed. Half the country's population faces acute hunger, making Sudan the world's largest hunger crisis. Sexual violence is rampant on both sides. Over 3 million refugees have fled to neighboring countries. Despite repeated international calls for a ceasefire, the fighting shows no sign of stopping.",
    key_facts: [
      "10.7 million people displaced, the world's largest displacement crisis",
      "25 million people face acute hunger, half the country's population",
      "Ethnic cleansing documented in Darfur by UN investigators",
      "Over 14 million children need humanitarian assistance",
      "80% of hospitals in conflict zones are no longer functional",
      "Both sides have been accused of war crimes by international bodies",
      "Over 3 million refugees have fled to Chad, South Sudan, Egypt, and Ethiopia",
      "Famine has been officially declared in parts of Darfur and Kordofan",
    ],
    fatalities: 24000,
    displaced: 10700000,
    refugees: 3100000,
    children_affected: 14000000,
    image_url: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=800&q=80",
    sources: [
      { name: "ACLED Sudan conflict data", url: "https://acleddata.com/tag/sudan" },
      { name: "UNHCR Sudan emergency", url: "https://www.unhcr.org/countries/sudan" },
      { name: "ReliefWeb Sudan updates", url: "https://reliefweb.int/country/sdn" },
    ],
    actions: [
      { label: "Donate to MSF Sudan", url: "https://www.msf.org/sudan" },
      { label: "Support IRC Sudan", url: "https://www.rescue.org/country/sudan" },
      { label: "UNHCR Sudan appeal", url: "https://donate.unhcr.org/int/en/sudan" },
    ],
  },
  {
    slug: "palestine-gaza",
    title: "War in Gaza",
    country: "Palestine",
    country_code: "PSE",
    region: "Middle East",
    status: "active",
    started_at: "October 2023",
    summary:
      "Following the Hamas attack on southern Israel in October 2023, Israel launched a massive military offensive on the Gaza Strip. The scale of destruction has been staggering. More than 70% of residential buildings have been damaged or destroyed. Hospitals have been bombed and besieged, and the healthcare system has completely collapsed. Premature babies, cancer patients, and wounded civilians die for lack of basic care. A near-total blockade has cut off food, water, medicine, and fuel. Famine has been declared in parts of northern Gaza. Nearly the entire population of 2.3 million people has been displaced, many forced to move five or six times with nowhere safe to go. Journalists, doctors, and UN workers have been killed in record numbers. South Africa has filed a genocide case at the International Court of Justice, and human rights organizations describe the situation as a catastrophe without precedent in modern history.",
    key_facts: [
      "Over 70% of residential buildings damaged or destroyed",
      "Nearly 2 million people displaced, almost the entire population",
      "Famine officially declared in northern Gaza",
      "Over 17,000 children killed according to health authorities",
      "All 36 hospitals damaged, most no longer functional",
      "Over 200 journalists and media workers killed",
      "South Africa filed a genocide case at the International Court of Justice",
      "97% of Gaza's water supply is contaminated or inaccessible",
      "Over 1 million children have no access to education",
    ],
    fatalities: 46000,
    displaced: 1900000,
    refugees: 1500000,
    children_affected: 1100000,
    image_url: "https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=800&q=80",
    sources: [
      { name: "OCHA Occupied Palestinian Territory", url: "https://www.ochaopt.org" },
      { name: "UNRWA reports and updates", url: "https://www.unrwa.org/resources/reports" },
      { name: "ReliefWeb Palestine", url: "https://reliefweb.int/country/pse" },
    ],
    actions: [
      { label: "Donate to UNRWA", url: "https://donate.unrwa.org" },
      { label: "MSF Palestine", url: "https://www.msf.org/palestine" },
      { label: "Amnesty International", url: "https://www.amnesty.org/en/location/middle-east-and-north-africa/middle-east/israel-and-occupied-palestinian-territories" },
    ],
  },
  {
    slug: "myanmar-civil-war",
    title: "Myanmar Civil War",
    country: "Myanmar",
    country_code: "MMR",
    region: "Southeast Asia",
    status: "active",
    started_at: "February 2021",
    summary:
      "In February 2021, Myanmar's military seized power and overthrew the democratically elected government of Aung San Suu Kyi. What followed was a nationwide uprising that turned into full-scale civil war. Across the country, ethnic armies and newly formed resistance groups are fighting the junta. The military responds with airstrikes on villages, burning entire communities to the ground, and carrying out mass arrests, torture, and forced labor. By 2025, resistance forces have captured large parts of the country, especially in Chin, Kayah, and Shan states. But the junta still controls major cities through overwhelming violence. Over a million Rohingya refugees remain stranded in camps in Bangladesh, with no prospect of safe return. The economy has collapsed, half the population lives in poverty, and millions of children have been shut out of school for years.",
    key_facts: [
      "2.6 million people internally displaced across the country",
      "The military has conducted over 1,000 airstrikes on civilian areas",
      "Over 5,000 political prisoners have been detained since the coup",
      "7.5 million children have lost access to education",
      "Half the population now lives below the poverty line",
      "Resistance forces control roughly 60% of the territory",
      "Over 1 million Rohingya refugees remain in Bangladesh camps",
      "Maternal and child mortality rates have doubled since the coup",
    ],
    fatalities: 50000,
    displaced: 2600000,
    refugees: 1200000,
    children_affected: 7500000,
    image_url: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=800&q=80",
    sources: [
      { name: "ACLED Myanmar conflict data", url: "https://acleddata.com/tag/myanmar" },
      { name: "UNHCR Myanmar emergency", url: "https://www.unhcr.org/countries/myanmar" },
      { name: "ReliefWeb Myanmar", url: "https://reliefweb.int/country/mmr" },
    ],
    actions: [
      { label: "Support IRC Myanmar", url: "https://www.rescue.org/country/myanmar" },
      { label: "MSF Myanmar", url: "https://www.msf.org/myanmar" },
      { label: "Human Rights Watch", url: "https://www.hrw.org/asia/burma" },
    ],
  },
  {
    slug: "haiti-crisis",
    title: "Haiti Crisis",
    country: "Haiti",
    country_code: "HTI",
    region: "Caribbean",
    status: "active",
    started_at: "2021",
    summary:
      "Haiti is in freefall. After the assassination of President Moïse in July 2021, the state effectively ceased to function. Armed gangs, some with deep ties to political and business elites, now control more than 80% of Port-au-Prince and are expanding into rural areas. Mass kidnappings, sexual violence, and public executions have become part of daily life. Over half a million people have fled their homes and are living in overcrowded makeshift camps with little food or clean water. Cholera has come back, and children are dying of malnutrition in growing numbers. Schools have been shut for months, cutting off hundreds of thousands of children from education. A UN-backed security mission led by Kenya was deployed in 2024, but it has done little to contain the violence. There is no functioning government, no elections planned, and no political solution in sight.",
    key_facts: [
      "Over 80% of Port-au-Prince is controlled by armed gangs",
      "578,000 people have been displaced, many to makeshift camps",
      "3 million children need humanitarian assistance",
      "Mass kidnappings and sexual violence are reported daily",
      "Cholera has resurged with collapsed water and sanitation",
      "Only 40% of the population has access to basic healthcare",
      "4.5 million people face acute food insecurity",
      "500,000 children are out of school due to gang violence",
    ],
    fatalities: 5600,
    displaced: 578000,
    refugees: 210000,
    children_affected: 3000000,
    image_url: "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80",
    sources: [
      { name: "ACLED Haiti conflict data", url: "https://acleddata.com/tag/haiti" },
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
    title: "Eastern Congo Conflict",
    country: "Democratic Republic of the Congo",
    country_code: "COD",
    region: "Central Africa",
    status: "active",
    started_at: "1996",
    summary:
      "Eastern Congo has been trapped in a cycle of violence for nearly thirty years. Over 120 armed groups fight for territory, power, and control of the region's immense mineral wealth. Coltan, cobalt, gold, and tin are mined and smuggled out to fund weapons and fighters. The global demand for these minerals, used in smartphones, batteries, and electronics, directly finances the bloodshed. In early 2025, the M23 rebel group, backed by Rwandan troops according to UN experts, seized Goma, a city of 2 million people. It was the most dramatic escalation in years. Sexual violence is used systematically as a weapon of war, with hundreds of thousands of women and girls among the victims. Over 7 million people are displaced within the country, the highest figure in Africa. This is the deadliest conflict since World War II. Since 1996, more than 6 million people have died from fighting, disease, and starvation.",
    key_facts: [
      "7.2 million internally displaced, the most in Africa",
      "Over 120 armed groups are active in eastern Congo",
      "Goma, a city of 2 million, was seized by M23 rebels in early 2025",
      "Conflict minerals like coltan and cobalt fuel the violence",
      "Over 4 million children are acutely malnourished",
      "Sexual violence is used as a weapon of war on a massive scale",
      "UN experts have documented direct Rwandan military support to M23",
      "25 million people need humanitarian assistance across the country",
      "More than 6 million people have died since the conflict began in 1996",
    ],
    fatalities: 11000,
    displaced: 7200000,
    refugees: 1000000,
    children_affected: 4000000,
    image_url: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80",
    sources: [
      { name: "ACLED DRC conflict data", url: "https://acleddata.com/tag/democratic-republic-of-congo" },
      { name: "UNHCR DRC emergency", url: "https://www.unhcr.org/countries/democratic-republic-of-the-congo" },
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
    title: "War in Ukraine",
    country: "Ukraine",
    country_code: "UKR",
    region: "Eastern Europe",
    status: "active",
    started_at: "February 2022",
    summary:
      "On 24 February 2022, Russia launched a full-scale invasion of Ukraine. After failing to capture Kyiv in the first weeks, the front line settled in the east and south, but the entire country is under threat from missiles and drones. Russian strikes regularly hit apartment buildings, hospitals, schools, and power stations. In occupied areas, which make up roughly 18% of Ukraine's territory, investigators have documented systematic torture, filtration camps, forced deportation of Ukrainian children to Russia, and extrajudicial killings. Over 6 million Ukrainians have fled abroad, making it Europe's biggest refugee crisis since World War II. Millions more are displaced inside the country. Deliberate attacks on energy infrastructure have left entire cities without heat or electricity during freezing winters. The war has also disrupted global food supply, since Ukraine is one of the world's top wheat and grain exporters.",
    key_facts: [
      "6.3 million refugees, Europe's largest crisis since World War II",
      "3.7 million people are internally displaced within Ukraine",
      "Over 20,000 Ukrainian children have been forcibly deported to Russia",
      "Russia occupies roughly 18% of Ukrainian territory",
      "Energy infrastructure systematically destroyed, millions left without heat",
      "Over 1,500 schools and educational facilities damaged or destroyed",
      "Ukraine produces 10% of the world's wheat, disrupting global food supply",
      "Safety concerns around the Zaporizhzhia nuclear power plant",
      "The ICC has issued an arrest warrant for Vladimir Putin for war crimes",
    ],
    fatalities: 31000,
    displaced: 6300000,
    refugees: 6200000,
    children_affected: 3000000,
    image_url: "https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800&q=80",
    sources: [
      { name: "ACLED Ukraine conflict data", url: "https://acleddata.com/tag/ukraine" },
      { name: "UNHCR Ukraine emergency", url: "https://www.unhcr.org/countries/ukraine" },
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
    title: "Yemen Humanitarian Crisis",
    country: "Yemen",
    country_code: "YEM",
    region: "Middle East",
    status: "active",
    started_at: "2014",
    summary:
      "Yemen has been at war since 2014 and the United Nations has called it the world's worst humanitarian crisis. The conflict pits the Houthi movement, backed by Iran, against the internationally recognized government, which has been supported by a Saudi-led military coalition. The Saudi coalition has carried out thousands of airstrikes that hit hospitals, schools, weddings, and funerals, killing thousands of civilians and destroying critical infrastructure. Two-thirds of the population, over 21 million people, need humanitarian assistance. Famine is a constant threat, and the healthcare system has collapsed. Yemen saw the world's worst cholera outbreak, with over 2.5 million cases. Children have paid the heaviest price: more than 11,000 have been killed or maimed, and 2 million are out of school. Since late 2023, Houthi attacks on ships in the Red Sea have drawn US and UK military strikes on Yemen, adding yet another layer to an already devastating conflict.",
    key_facts: [
      "21 million people need humanitarian assistance, two-thirds of the population",
      "Over 11,000 children killed or maimed since the war began",
      "2.5 million cholera cases, the world's worst outbreak",
      "4.5 million people internally displaced",
      "2 million children are out of school",
      "Over 80% of the population lives below the poverty line",
      "Saudi coalition airstrikes destroyed hospitals, schools, and wedding halls",
      "Houthi attacks on Red Sea shipping disrupted 15% of global trade",
      "17.4 million people face food insecurity",
    ],
    fatalities: 150000,
    displaced: 4500000,
    refugees: 140000,
    children_affected: 11000000,
    image_url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
    sources: [
      { name: "ACLED Yemen conflict data", url: "https://acleddata.com/tag/yemen" },
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
    title: "Ethiopia Ethnic Conflicts",
    country: "Ethiopia",
    country_code: "ETH",
    region: "East Africa",
    status: "monitoring",
    started_at: "November 2020",
    summary:
      "The Tigray war, which raged from November 2020 to November 2022, killed an estimated 600,000 people, making it one of the deadliest conflicts of the 21st century. People died from fighting, deliberate starvation, denial of medical care, and widespread sexual violence committed by all sides, including Ethiopian federal troops and Eritrean soldiers. A ceasefire was signed in Pretoria in November 2022, but it has not brought real peace. Since then, ethnic violence has spread to other parts of the country. In the Amhara region, Fano militia fighters are clashing with federal forces after refusing to disarm. In Oromia, the Oromo Liberation Army continues its operations. Millions of people remain displaced, humanitarian access is restricted, and reports of killings, mass detentions, and sexual violence keep coming. No one has been held accountable for the atrocities committed during the Tigray war. Justice mechanisms have stalled, and the underlying ethnic tensions that fueled the conflict remain unresolved.",
    key_facts: [
      "An estimated 600,000 people killed in the Tigray war",
      "4.2 million people internally displaced across Ethiopia",
      "Systematic sexual violence documented by the UN as a weapon of war",
      "Eritrean troops committed massacres in Tigray and remain present",
      "Fano militia insurgency in the Amhara region has been escalating since 2023",
      "Over 20 million people need food assistance across the country",
      "Healthcare and education systems in Tigray have yet to be rebuilt",
      "No accountability for war crimes, justice mechanisms are stalled",
      "2 million children are acutely malnourished nationwide",
    ],
    fatalities: 600000,
    displaced: 4200000,
    refugees: 900000,
    children_affected: 2000000,
    image_url: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80",
    sources: [
      { name: "ACLED Ethiopia conflict data", url: "https://acleddata.com/tag/ethiopia" },
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

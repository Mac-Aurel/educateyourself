import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

type UserSeed = { username: string; password: string };
type MessageSeed = { conflictSlug: string; authorUsername: string; content: string; replies?: ReplySeed[] };
type ReplySeed = { authorUsername: string; content: string };

const users: UserSeed[] = [
  { username: "aminata.sy", password: "xR9!kqL2p" },
  { username: "jwright04", password: "mN7$vB3x" },
  { username: "fatoumata_d", password: "hP4@wQ8y" },
  { username: "markhansen", password: "zK5!jF6n" },
  { username: "leila.mkz", password: "cR2$tY9b" },
  { username: "samtrevor", password: "nL8@dH4m" },
  { username: "chloebrnrd", password: "gW1!pX7s" },
  { username: "youssef.rh", password: "bT6@vK3q" },
  { username: "di4na", password: "fJ9!mN2c" },
  { username: "kwameasante", password: "yR4$hL8w" },
  { username: "sar4h_", password: "kP7@xB5d" },
  { username: "omarshf", password: "wN3!cT9g" },
  { username: "nina.wld", password: "jM6$rY2f" },
  { username: "carlitos99", password: "qK8@bH4p" },
  { username: "aishab_", password: "tR1!vW7n" },
  { username: "moha_dz", password: "xL5@gJ3m" },
  { username: "emmaxo", password: "nP9$dK6y" },
  { username: "ibrahimsow", password: "cW2!fR8b" },
  { username: "thelmagrce", password: "hT4@mX1q" },
  { username: "ramikhld", password: "bY7!pN5s" },
  { username: "julievndr", password: "gK3$wL9c" },
  { username: "td_koffi", password: "fR6@hB2x" },
  { username: "nouraaa", password: "yJ8!tP4d" },
  { username: "alexrdz", password: "mW1$cK7g" },
  { username: "mamadou.b", password: "qT5@nX3f" },
];

const discussions: MessageSeed[] = [
  // =================== SUDAN ===================
  {
    conflictSlug: "sudan-civil-war",
    authorUsername: "aminata.sy",
    content: "My family is from Darfur. We lost contact with my cousins three months ago. The phone lines are cut, no internet, nothing. People have no idea how bad it really is because there are almost no journalists left in the country.",
    replies: [
      { authorUsername: "jwright04", content: "I'm really sorry. I've been following this closely and the media silence is shocking. This should be front page news everywhere." },
      { authorUsername: "fatoumata_d", content: "C'est la même chose pour ma tante à Khartoum. Plus de nouvelles depuis des semaines. On ne peut qu'attendre et espérer. Courage à toi." },
      { authorUsername: "sar4h_", content: "I work in humanitarian comms. The lack of coverage isn't accidental. When access is blocked and reporters are targeted, stories die. That's by design." },
    ],
  },
  {
    conflictSlug: "sudan-civil-war",
    authorUsername: "markhansen",
    content: "Why is nobody talking about Sudan? Millions displaced and the world is just watching. I donated to MSF but it feels like a drop in the ocean.",
    replies: [
      { authorUsername: "leila.mkz", content: "Because there's no geopolitical interest for major powers. No oil pipeline, no strategic alliance at stake. That's the ugly truth." },
      { authorUsername: "aminata.sy", content: "Thank you for caring. Even a small donation makes a difference. And sharing information helps too. The more people know, the harder it is to ignore." },
    ],
  },
  {
    conflictSlug: "sudan-civil-war",
    authorUsername: "samtrevor",
    content: "Je travaille pour une ONG au Tchad à la frontière soudanaise. Les camps sont complètement débordés. On reçoit des centaines de familles par jour et on n'a pas assez de nourriture ni de médicaments.",
    replies: [
      { authorUsername: "chloebrnrd", content: "Merci pour ce que vous faites. Comment est-ce qu'on peut aider concrètement depuis ici ?" },
      { authorUsername: "samtrevor", content: "Les dons aux organisations sur le terrain sont ce qui aide le plus. MSF, IRC, HCR. Et parlez-en autour de vous, le silence tue." },
      { authorUsername: "ibrahimsow", content: "J'ai des amis au camp d'Adré. Ils disent que les rations ont été réduites de moitié ce mois-ci. La situation empire de jour en jour." },
    ],
  },
  {
    conflictSlug: "sudan-civil-war",
    authorUsername: "nouraaa",
    content: "Les femmes soudanaises subissent des violences sexuelles systématiques de la part des deux camps. Ce n'est pas un dommage collatéral, c'est une stratégie de guerre. Et personne n'en parle.",
    replies: [
      { authorUsername: "emmaxo", content: "This is documented by multiple UN reports. The silence around sexual violence in conflict zones is infuriating. These women deserve justice." },
    ],
  },

  // =================== GAZA ===================
  {
    conflictSlug: "palestine-gaza",
    authorUsername: "youssef.rh",
    content: "I have friends in Gaza who send me voice notes when they can find signal. They describe things I can't repeat here. Entire families wiped out in a single strike. Children pulling their parents from rubble. This is not a war, this is annihilation.",
    replies: [
      { authorUsername: "di4na", content: "The scale of what's happening is beyond anything I've seen in my lifetime. The fact that it's being broadcast in real time and still nothing changes is devastating." },
      { authorUsername: "sar4h_", content: "I've been to Gaza before the war. Beautiful, resilient people. The thought of what they're going through keeps me up at night." },
      { authorUsername: "ramikhld", content: "My grandmother's house in Jabaliya doesn't exist anymore. The whole neighborhood is gone. 70 years of memories turned to dust." },
    ],
  },
  {
    conflictSlug: "palestine-gaza",
    authorUsername: "leila.mkz",
    content: "Les images qui sortent de Gaza sont insoutenables. Des chirurgiens opèrent sans anesthésie, des enfants amputés sans soins. Le monde regarde et ne fait rien. Comment on expliquera ça aux générations futures ?",
    replies: [
      { authorUsername: "omarshf", content: "On ne pourra pas l'expliquer. Comme on n'a jamais pu expliquer le Rwanda. L'histoire jugera cette inaction." },
      { authorUsername: "nina.wld", content: "I donated to UNRWA last week. They're one of the few organizations still operating there. If anyone can, please help." },
      { authorUsername: "moha_dz", content: "Le problème c'est que les gens sont tellement bombardés d'images qu'ils deviennent insensibles. Il faut continuer à en parler malgré tout." },
    ],
  },
  {
    conflictSlug: "palestine-gaza",
    authorUsername: "carlitos99",
    content: "I'm from Colombia. We know what it's like to live through decades of conflict. But what I see in Gaza is on another level. Solidarity from Latin America.",
    replies: [
      { authorUsername: "youssef.rh", content: "Thank you. Solidarity across borders matters more than people realize. It gives people hope when everything else is gone." },
      { authorUsername: "alexrdz", content: "From Mexico, same. Latin America knows suffering. We stand with Gaza." },
    ],
  },
  {
    conflictSlug: "palestine-gaza",
    authorUsername: "julievndr",
    content: "I'm a nurse. I've been reading accounts from medical staff in Gaza. Performing amputations on children with no anesthesia, no sterile equipment. These are war crimes against healthcare. The Geneva Conventions mean nothing anymore.",
    replies: [
      { authorUsername: "thelmagrce", content: "As a fellow healthcare worker this destroys me. We train for years to save lives and then you see colleagues having to choose who lives and who dies because there aren't enough supplies." },
    ],
  },

  // =================== MYANMAR ===================
  {
    conflictSlug: "myanmar-civil-war",
    authorUsername: "nina.wld",
    content: "My colleague fled Myanmar in 2022. She was a teacher. The junta bombed her school. She walked for days through the jungle to reach Thailand with her two kids. She still can't talk about it without breaking down.",
    replies: [
      { authorUsername: "kwameasante", content: "The resilience of people in these situations is incredible. But they shouldn't have to be resilient. They should be safe." },
      { authorUsername: "markhansen", content: "And this barely makes the news anymore. The resistance is actually winning territory but nobody covers it." },
    ],
  },
  {
    conflictSlug: "myanmar-civil-war",
    authorUsername: "aishab_",
    content: "Les Rohingyas sont oubliés de tous. Plus d'un million de personnes dans des camps au Bangladesh depuis des années. Pas de statut, pas d'éducation, pas d'avenir.",
    replies: [
      { authorUsername: "fatoumata_d", content: "On en a parlé pendant quelques mois en 2017 puis plus rien. Comme si ces gens n'existaient plus." },
      { authorUsername: "mamadou.b", content: "C'est le problème des crises qui durent. Les médias passent à autre chose mais les gens, eux, restent coincés." },
    ],
  },
  {
    conflictSlug: "myanmar-civil-war",
    authorUsername: "td_koffi",
    content: "The resistance movement in Myanmar is one of the most inspiring things happening in the world right now. Young people who had never held a weapon organizing against a military dictatorship. And they're winning.",
    replies: [
      { authorUsername: "jwright04", content: "True. The Spring Revolution deserves way more international support. These are people fighting for democracy with almost nothing." },
    ],
  },

  // =================== HAITI ===================
  {
    conflictSlug: "haiti-crisis",
    authorUsername: "carlitos99",
    content: "Haiti is being strangled by gangs and the international community treats it like a footnote. This is a country 90 minutes by plane from Miami. People are starving, children recruited by armed groups, hospitals shutting down.",
    replies: [
      { authorUsername: "di4na", content: "The lack of coverage compared to other crises is telling. Haiti deserves the same attention and resources." },
      { authorUsername: "jwright04", content: "The Kenyan-led mission was supposed to help but it's been completely insufficient. They need real support, not token gestures." },
      { authorUsername: "alexrdz", content: "The weapons fueling the gangs come from the US. This is America's neighbor and America's responsibility too." },
    ],
  },
  {
    conflictSlug: "haiti-crisis",
    authorUsername: "fatoumata_d",
    content: "Les gangs contrôlent les routes de distribution de nourriture. Les gens doivent payer les gangs pour manger. C'est du racket organisé sur la famine.",
    replies: [
      { authorUsername: "samtrevor", content: "Et les gangs sont armés avec des armes qui viennent des États-Unis. Le trafic d'armes alimente directement cette crise." },
      { authorUsername: "ibrahimsow", content: "Haïti est le pays le plus pauvre des Amériques et aussi celui qui a le moins d'aide par habitant. Les chiffres sont accablants." },
    ],
  },
  {
    conflictSlug: "haiti-crisis",
    authorUsername: "thelmagrce",
    content: "I volunteered in Port-au-Prince in 2019. Even then the situation was deteriorating fast. The people I worked with, the kids I taught, I have no idea if they're alive. It haunts me every day.",
    replies: [
      { authorUsername: "emmaxo", content: "Sending you strength. The connections we make in these places stay with us forever. I hope they're safe." },
    ],
  },

  // =================== DRC ===================
  {
    conflictSlug: "drc-m23-conflict",
    authorUsername: "kwameasante",
    content: "I'm from Ghana and I've been following the DRC closely. Our phones contain coltan from mines controlled by armed groups. We are all connected to this conflict whether we know it or not.",
    replies: [
      { authorUsername: "chloebrnrd", content: "This is such an important point. The supply chains behind our electronics are built on exploitation. Companies need to be held accountable." },
      { authorUsername: "nina.wld", content: "There are initiatives pushing for conflict-free minerals but progress is painfully slow. Consumers have power too if they demand transparency." },
    ],
  },
  {
    conflictSlug: "drc-m23-conflict",
    authorUsername: "aminata.sy",
    content: "La prise de Goma par le M23 début 2025 a été un désastre. Des centaines de milliers de personnes ont fui en quelques jours. Tout le monde sait que le Rwanda est derrière le M23 mais personne n'ose agir.",
    replies: [
      { authorUsername: "omarshf", content: "Les rapports de l'ONU sont clairs sur le soutien rwandais. Mais le Rwanda est un allié stratégique de l'Occident. La géopolitique passe avant les vies." },
      { authorUsername: "kwameasante", content: "And the Congolese people keep paying the price. Over 6 million dead since 1996. The deadliest conflict since WWII and most people don't even know." },
      { authorUsername: "td_koffi", content: "En tant qu'Africain ça me révolte. On pille nos ressources et on finance nos guerres. Puis on nous demande pourquoi le continent ne se développe pas." },
    ],
  },
  {
    conflictSlug: "drc-m23-conflict",
    authorUsername: "mamadou.b",
    content: "J'ai lu un témoignage d'une femme de Goma qui a dit : on nous tue pour nos minerais et le monde nous ignore parce qu'on est noirs. C'est brutal mais c'est la vérité.",
    replies: [
      { authorUsername: "nouraaa", content: "Le racisme systémique dans la couverture médiatique des conflits est bien documenté. Les vies africaines comptent moins dans les rédactions occidentales." },
    ],
  },

  // =================== UKRAINE ===================
  {
    conflictSlug: "ukraine-war",
    authorUsername: "di4na",
    content: "I'm Ukrainian, living in Warsaw now. My parents are still in Kharkiv. Every night I check my phone to see if they're alive. The missile strikes are constant. People think the war is a stalemate but for civilians every single day is terror.",
    replies: [
      { authorUsername: "markhansen", content: "Stay strong. The world stands with Ukraine even if the news cycle has moved on." },
      { authorUsername: "leila.mkz", content: "What's happening in Ukraine should be talked about alongside all other conflicts here. All civilian suffering matters equally." },
      { authorUsername: "ramikhld", content: "From one person displaced by war to another: I understand your pain. Strength to your family." },
    ],
  },
  {
    conflictSlug: "ukraine-war",
    authorUsername: "chloebrnrd",
    content: "Ce qui me révolte c'est la déportation forcée d'enfants ukrainiens vers la Russie. Plus de 20 000 enfants arrachés à leurs familles. La CPI a émis un mandat d'arrêt contre Poutine mais rien ne se passe.",
    replies: [
      { authorUsername: "youssef.rh", content: "The forced deportation of children is a war crime under the Geneva Conventions. The ICC warrant is historic but enforcement is the problem." },
      { authorUsername: "di4na", content: "Merci d'en parler. Beaucoup de ces enfants ont été adoptés par des familles russes. Leurs parents ne savent même pas où ils sont." },
    ],
  },
  {
    conflictSlug: "ukraine-war",
    authorUsername: "emmaxo",
    content: "I've hosted two Ukrainian families since 2022. What they've been through is unimaginable. One family lost everything in Mariupol. They arrived with literally nothing but the clothes they were wearing.",
    replies: [
      { authorUsername: "julievndr", content: "Thank you for doing that. Host families have been a lifeline for so many refugees. It makes a real difference." },
    ],
  },

  // =================== YEMEN ===================
  {
    conflictSlug: "yemen-war",
    authorUsername: "omarshf",
    content: "Yemen has been called the forgotten war for years. 11,000 children killed or maimed. 2.5 million cholera cases. These numbers are so large they become abstract but each one is a real person.",
    replies: [
      { authorUsername: "sar4h_", content: "I volunteered with an aid organization in Aden in 2019. The malnutrition I saw in children was something I'll never forget. Babies who looked months old but were actually two or three." },
      { authorUsername: "aishab_", content: "Et n'oublions pas que les armes de la coalition saoudienne sont vendues par les pays occidentaux. La France, les US, le Royaume-Uni. On profite de cette guerre." },
    ],
  },
  {
    conflictSlug: "yemen-war",
    authorUsername: "jwright04",
    content: "The Houthi attacks on Red Sea shipping suddenly made Yemen relevant to Western media. For years nobody cared about the Saudi bombings. But when commerce is threatened, everyone pays attention. The hypocrisy is staggering.",
    replies: [
      { authorUsername: "leila.mkz", content: "Exactly. Yemeni lives didn't matter until the shipping lanes were disrupted. It tells you everything about how the world works." },
      { authorUsername: "moha_dz", content: "C'est toujours pareil. Les crises n'existent dans les médias occidentaux que quand elles touchent les intérêts économiques." },
    ],
  },
  {
    conflictSlug: "yemen-war",
    authorUsername: "ramikhld",
    content: "My family is Yemeni. We left in 2016 when the airstrikes started hitting our neighborhood in Sana'a. My grandmother refused to leave. She said she'd rather die in her home than become a refugee. She passed away last year from lack of medicine.",
    replies: [
      { authorUsername: "aminata.sy", content: "I'm so sorry for your loss. The people who can't or won't leave are often the most vulnerable. May she rest in peace." },
      { authorUsername: "nouraaa", content: "This broke my heart. The blockade that prevents medicine from entering Yemen is killing people every single day. It's a silent massacre." },
    ],
  },

  // =================== ETHIOPIA ===================
  {
    conflictSlug: "ethiopia-conflict",
    authorUsername: "sar4h_",
    content: "The Tigray war killed 600,000 people and almost nobody outside the Horn of Africa knows about it. That's more than Syria and Yemen combined in the same period. The silence is deafening.",
    replies: [
      { authorUsername: "kwameasante", content: "As an African I'm both heartbroken and angry. African conflicts are systematically underreported. 600,000 dead and it barely made international news." },
      { authorUsername: "samtrevor", content: "Et maintenant c'est la région Amhara qui brûle. Les milices Fano contre l'armée fédérale. Le cessez-le-feu au Tigré a juste déplacé le problème." },
    ],
  },
  {
    conflictSlug: "ethiopia-conflict",
    authorUsername: "aishab_",
    content: "I'm Ethiopian. The ceasefire was supposed to bring peace but there's been zero accountability. No justice for victims of sexual violence, no reparations, no truth commission. How can there be peace without justice?",
    replies: [
      { authorUsername: "omarshf", content: "This is the pattern everywhere. Ceasefires without accountability just plant the seeds for the next conflict." },
      { authorUsername: "fatoumata_d", content: "La justice transitionnelle est essentielle. Sans elle, les victimes n'ont aucune closure et les auteurs restent impunis. C'est un cercle vicieux." },
    ],
  },
  {
    conflictSlug: "ethiopia-conflict",
    authorUsername: "ibrahimsow",
    content: "What happened in Tigray is a stain on all of us. Eritrean soldiers committed massacres, the Ethiopian army used starvation as a weapon, and the world looked away. We failed these people.",
    replies: [
      { authorUsername: "td_koffi", content: "The African Union is headquartered in Addis Ababa and said almost nothing while this was happening. The irony is painful." },
      { authorUsername: "mamadou.b", content: "L'UA a été complètement silencieuse. C'est honteux. On ne peut pas demander la souveraineté africaine et ignorer les atrocités commises par nos propres gouvernements." },
    ],
  },
];

async function createUser(user: UserSeed): Promise<string> {
  const hash = await bcrypt.hash(user.password, 12);

  const { data, error } = await supabase
    .from("app_users")
    .upsert({ username: user.username, password_hash: hash }, { onConflict: "username" })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to create user ${user.username}: ${error.message}`);
  return data.id;
}

async function getConflictId(slug: string): Promise<string> {
  const { data, error } = await supabase
    .from("conflicts")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error) throw new Error(`Conflict "${slug}" not found: ${error.message}`);
  return data.id;
}

async function postMessage(
  conflictId: string,
  userId: string,
  authorName: string,
  content: string,
  parentId: string | null = null
): Promise<string> {
  const { data, error } = await supabase
    .from("discussions")
    .insert({
      conflict_id: conflictId,
      user_id: userId,
      author_name: authorName,
      content,
      parent_id: parentId,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to post message: ${error.message}`);
  return data.id;
}

async function seed() {
  // Clean old discussions first
  await supabase.from("discussions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("app_users").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log(`Creating ${users.length} users...\n`);

  const userIds: Record<string, string> = {};
  for (const user of users) {
    const id = await createUser(user);
    userIds[user.username] = id;
    console.log(`  ✓ ${user.username}`);
  }

  console.log(`\nPosting ${discussions.length} discussion threads...\n`);

  for (const thread of discussions) {
    const conflictId = await getConflictId(thread.conflictSlug);
    const userId = userIds[thread.authorUsername];

    const parentId = await postMessage(
      conflictId,
      userId,
      thread.authorUsername,
      thread.content
    );

    console.log(`  ✓ ${thread.authorUsername} on ${thread.conflictSlug}`);

    if (thread.replies) {
      for (const reply of thread.replies) {
        const replyUserId = userIds[reply.authorUsername];
        await postMessage(
          conflictId,
          replyUserId,
          reply.authorUsername,
          reply.content,
          parentId
        );
        console.log(`    ↳ ${reply.authorUsername}`);
      }
    }
  }

  console.log("\nDone.");
}

seed();

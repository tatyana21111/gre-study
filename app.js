// ======== CONFIG ========
let currentUserEmail = null;
let globalUserStore = {
  users: {},
  treatmentCounts: { DT: 0, CM: 0, H: 0 }
};

const DT_DAILY_NEW_LIMIT = 10;
const WEEKLY_NEW_LIMIT = 50;

const TREATMENTS = ['DT', 'CM', 'H'];

// Word bank - expand with all 50 words
const WORD_BANK = [
  {
    "id": 1,
    "word": "Disaffected",
    "correct": "No longer supporting or being satisfied with an organisation or idea.\n\nOR Young people who are not satisfied with soceity;s values",
    "options": [
      "No longer supporting or being satisfied with an organisation or idea.\n\nOR Young people who are not satisfied with soceity;s values",
      "Sap enthusiasm.\n\nOR Cause to appear foolish, demonstrate incompetence.",
      "Necessity: s/t wanted or needed.",
      "Not having something, lacking, missing."
    ],
    "dayIntroduced": 1
  },
  {
    "id": 2,
    "word": "Pittance",
    "correct": "A very small sum of money.",
    "options": [
      "A very small sum of money.",
      "S/t that cannot be guessed or calculated bc it is completely unknown.",
      "Disapproving: expressed too often to be interesting or seem sincere.",
      "Make unpleasant feelings less strong."
    ],
    "dayIntroduced": 1
  },
  {
    "id": 3,
    "word": "Sanction",
    "correct": "Formal or legal approval or permission.",
    "options": [
      "Formal or legal approval or permission.",
      "Exemption.",
      "Fiction, OR conventionally or hypothetically assumed or accepted, OR not genuinely felt.",
      "Disapproving: expressed too often to be interesting or seem sincere."
    ],
    "dayIntroduced": 1
  },
  {
    "id": 4,
    "word": "Pejorative",
    "correct": "A word or phrase that has negative connotations, intended to disparage or belittle.",
    "options": [
      "A word or phrase that has negative connotations, intended to disparage or belittle.",
      "Lowest point.\n\nAcme (highest point); Zenith",
      "Cause to accept or become hardened to; habituated.",
      "Clearly revealed to the mind or the senses or judgment.\n\nOR Make open to sight or notice."
    ],
    "dayIntroduced": 1
  },
  {
    "id": 5,
    "word": "Contemptuous",
    "correct": "Manifesting, feeling, or expressing deep hatred or disapproval.",
    "options": [
      "Manifesting, feeling, or expressing deep hatred or disapproval.",
      "A party thrown in a person's honour, to celebrate them.",
      "To have or show feelings of hate towards someone or something.",
      "Deadful in influence, foreboding or threatening evil.\n\nbaleful influence, effect, result"
    ],
    "dayIntroduced": 1
  },
  {
    "id": 6,
    "word": "Mulct",
    "correct": "To defraud espeically of money. To obtain by fraud, duress, or theft.",
    "options": [
      "To defraud espeically of money. To obtain by fraud, duress, or theft.",
      "Talk or write in a confused way for a long time.\n\nMove or behave in a slow, lazy way, without paying attention to anything. Wander aimlessly,",
      "A speech or piece of writing that praises someone or something very much and does not mention anything bad about them.",
      "Used to describe something that is spoken or written in a way that is direct, clever, and cruel."
    ],
    "dayIntroduced": 1
  },
  {
    "id": 7,
    "word": "Dissemble",
    "correct": "To hide your real intentions and feelings or the facts.",
    "options": [
      "To hide your real intentions and feelings or the facts.",
      "S/t very old that is still existing.",
      "Attribute, s/o is responsible for s/t (especially bad).\n\nOR Calculate something you do not have exact info by comparison to s/t similar e.g. costs, income.",
      "1) Wildly extravagant, 2) Completely given up to dissipation and licentiousness, shamelessly immoral.\n\nPerson who is wildly extravagent, wasteful."
    ],
    "dayIntroduced": 1
  },
  {
    "id": 8,
    "word": "Phlegmatic",
    "correct": "Showing little emotion.",
    "options": [
      "Showing little emotion.",
      "Friendly and lively. Occupied with or fond of the pleasures of good company.",
      "Unwilling to be controlled or be patient.",
      "A speech or piece of writing that praises someone or something very much and does not mention anything bad about them."
    ],
    "dayIntroduced": 1
  },
  {
    "id": 9,
    "word": "Voguish",
    "correct": "Suddenly or temporarily popular.\n\nOR Fashionable, smart.",
    "options": [
      "Suddenly or temporarily popular.\n\nOR Fashionable, smart.",
      "Cruel and criticising in a humorous way.\n\n(similar to Caustic but less cutting)",
      "Sieze without justification, make undue claims to having (assume).\n\narrogate to oneself",
      "To do s/t unwillingly and in a way that shows that you think you are too important to do it."
    ],
    "dayIntroduced": 1
  },
  {
    "id": 10,
    "word": "Maxim",
    "correct": "Saying that is widely accepted on its own merits.\n\nAxiom",
    "options": [
      "Saying that is widely accepted on its own merits.\n\nAxiom",
      "Necesary as a duty or responsibility, morally binding.",
      "Someone who has an opinion that is opposite to or against the official or popular opinion.",
      "Misrepresent.\n\nOR Be in contraction with."
    ],
    "dayIntroduced": 1
  },
  {
    "id": 11,
    "word": "Besiege",
    "correct": "(1) To press with requests (importune, harass, beseech)\nOR (2) To cause worry or distress to persistently (beset, beleaguer)\n\n(Military: to surround with armed forces).",
    "options": [
      "(1) To press with requests (importune, harass, beseech)\nOR (2) To cause worry or distress to persistently (beset, beleaguer)\n\n(Military: to surround with armed forces).",
      "To develop or grow quickly.",
      "Secret scheme to do smth, especially smth that will harm.",
      "A wanderer who has no established residence or visible means of support / anything that resembles a vagabond in having no fixed place.\n\nOR Wandering aimlessly without ties to a place of community, continually changing espeically as from one abode or occupation to another.\n\nOR Move about aimlessly often in search of food or employment."
    ],
    "dayIntroduced": 2
  },
  {
    "id": 12,
    "word": "Nonplussed",
    "correct": "Unsure how to act, surprised, perplexed.",
    "options": [
      "Unsure how to act, surprised, perplexed.",
      "Lacking wit or imagination; not challenging and thus dull.",
      "To hide your real intentions and feelings or the facts.",
      "Joking or laughing at someone in a friendly way, good-natured ridicule."
    ],
    "dayIntroduced": 2
  },
  {
    "id": 13,
    "word": "Ferret",
    "correct": "Search for and discover through persistent investigation.\n\nOR Hound or harry (annoy conitnually) relentlessly.",
    "options": [
      "Search for and discover through persistent investigation.\n\nOR Hound or harry (annoy conitnually) relentlessly.",
      "Highly or widely praised or boasted about.",
      "Vituperation, abusive expression / speech.",
      "Overfamiliar, boring, ordinary."
    ],
    "dayIntroduced": 2
  },
  {
    "id": 14,
    "word": "Preempt",
    "correct": "1. Acquire by preemption.\n2. Seize for oneself at the exclusion of others.\n3. Take precedence over due to greater value or priority.\n4. Gain a commanding or preeminent (higher-ranking) place in.\n5. Prevent from happening or taking place.",
    "options": [
      "1. Acquire by preemption.\n2. Seize for oneself at the exclusion of others.\n3. Take precedence over due to greater value or priority.\n4. Gain a commanding or preeminent (higher-ranking) place in.\n5. Prevent from happening or taking place.",
      "Vituperation, abusive expression / speech.",
      "Belonging to another time.",
      "Obstreperous (unruly) and defiant aggressiveness."
    ],
    "dayIntroduced": 2
  },
  {
    "id": 15,
    "word": "Embryonic",
    "correct": "Undeveloped, still in an early stage of development",
    "options": [
      "Undeveloped, still in an early stage of development",
      "Acts or words of an actual child, OR (disapproving) occurrences of childishness where adult maturity would be expected or preferred.",
      "Literally: thoroughly dried out.\n\nMetaphorically: Lacking vitality or spirit, lifeless.",
      "Not having something, lacking, missing."
    ],
    "dayIntroduced": 2
  },
  {
    "id": 16,
    "word": "Appurtenance",
    "correct": "A possession or piece of property that is considered to be a typical feature of a particular way of living.",
    "options": [
      "A possession or piece of property that is considered to be a typical feature of a particular way of living.",
      "Literally: thoroughly dried out.\n\nMetaphorically: Lacking vitality or spirit, lifeless.",
      "The state of being first in importance, order or rank.",
      "Lacking depth, not thought through."
    ],
    "dayIntroduced": 2
  },
  {
    "id": 17,
    "word": "Gall",
    "correct": "Rudeness and being unable to understand that the behaviour or comment is not acceptable to other people.\n\nOR to make someone feel annoyed.",
    "options": [
      "Rudeness and being unable to understand that the behaviour or comment is not acceptable to other people.\n\nOR to make someone feel annoyed.",
      "Wasteful with money, spending freely and foolishly.",
      "Extreme generosity with finances, bestowing gifts etc.",
      "Complain to s/o or about s/t."
    ],
    "dayIntroduced": 2
  },
  {
    "id": 18,
    "word": "Aboveboard",
    "correct": "Honest, straightforward.\n\nPlaying cards keeping your hand above the table rather than hiding in your lap.",
    "options": [
      "Honest, straightforward.\n\nPlaying cards keeping your hand above the table rather than hiding in your lap.",
      "A trick or dishonest way of achieving something.",
      "Skilled storyteller.",
      "A state of deep-seated ill-sill, hostility."
    ],
    "dayIntroduced": 2
  },
  {
    "id": 19,
    "word": "Differential",
    "correct": "Respectful",
    "options": [
      "Respectful",
      "With many turns and changes of direction; not direct or simple.",
      "Follow a set of rules (philosophical, religious, made-up) no matter, unchanging.\n\nOR Characterised by assertion of unproved or unprovable principles.",
      "Outmoded or discredited by reason of age: old and no longer useful, popular or accepted."
    ],
    "dayIntroduced": 2
  },
  {
    "id": 20,
    "word": "Sangfroid",
    "correct": "Poise, composure under pressure (difficult or dangerous situation).",
    "options": [
      "Poise, composure under pressure (difficult or dangerous situation).",
      "Not at all brave and too eager to avoid danger, difficulty, or pain.",
      "Cheap and guady in appearance or quality.\ntawdry clothing / jewels / furniture\n\nMorally sordid, base or distasteful.\ntawdry scandal / love affair / smear attempt\n\n(Noun) Cheap showy finery.",
      "Throwback. A reappearance of an earlier characteristic."
    ],
    "dayIntroduced": 2
  },
  {
    "id": 21,
    "word": "Insolent",
    "correct": "Rude and not showing respect.",
    "options": [
      "Rude and not showing respect.",
      "Vulgar, surly (lack of civility or graciousness), intractable (difficult to work with or deal with)",
      "Intended to teach, especially in a way that is too determined or eager, and often fixed and unwilling to change:",
      "Characterised by ease and quickness in perceiving.\n\nOR A person who becomes aware of things or events through the semses."
    ],
    "dayIntroduced": 3
  },
  {
    "id": 22,
    "word": "Ersatz",
    "correct": "An artificial or inferior substitute or imitation.\n\nDiet Coke is an ersatz, a poor imitation of regular Coke (noun)\nFat-free frozen yoghurt is an ersatz ice cream (adjective)",
    "options": [
      "An artificial or inferior substitute or imitation.\n\nDiet Coke is an ersatz, a poor imitation of regular Coke (noun)\nFat-free frozen yoghurt is an ersatz ice cream (adjective)",
      "Rude and not showing respect.",
      "Ordinary, everyday.",
      "Absolute, complete."
    ],
    "dayIntroduced": 3
  },
  {
    "id": 23,
    "word": "Mettlesome",
    "correct": "Having a proud and unbroken spirit, wiling to face danger.",
    "options": [
      "Having a proud and unbroken spirit, wiling to face danger.",
      "A small weaknesses or peculiarity in someone's character.",
      "A light wind.",
      "Scold s/o harshly that they should not have done a particular thing and criticise them for having done it."
    ],
    "dayIntroduced": 3
  },
  {
    "id": 24,
    "word": "Truculent",
    "correct": "Aggressively self-assertive (belligerent), scathingly harsh (viriotlic), feeling or displaying ferocity (savage), deadly and destructive.",
    "options": [
      "Aggressively self-assertive (belligerent), scathingly harsh (viriotlic), feeling or displaying ferocity (savage), deadly and destructive.",
      "Quickly aroused to anger.\n\nLatin \"ira: anger/rage\"",
      "Lack of concern, cheerful feeling when nothing is troubling you.",
      "Make rigid and set into a conventional pattern."
    ],
    "dayIntroduced": 3
  },
  {
    "id": 25,
    "word": "Venal",
    "correct": "Capable of being corrupted for money.",
    "options": [
      "Capable of being corrupted for money.",
      "1) Wildly extravagant, 2) Completely given up to dissipation and licentiousness, shamelessly immoral.\n\nPerson who is wildly extravagent, wasteful.",
      "Not being active (e.g. hibernation), having no energy or enthusiasm.",
      "Causing or marked by an atmostphere lacking in cheer."
    ],
    "dayIntroduced": 3
  },
  {
    "id": 26,
    "word": "Temperance",
    "correct": "Trait of avoiding excess.\n\nOr moderation in or abstination from alcohol.",
    "options": [
      "Trait of avoiding excess.\n\nOr moderation in or abstination from alcohol.",
      "Outmoded or discredited by reason of age: old and no longer useful, popular or accepted.",
      "A speech of violent denunciation.",
      "Brainy, involving intelligence rather than emotions or instinct."
    ],
    "dayIntroduced": 3
  },
  {
    "id": 27,
    "word": "Peevish",
    "correct": "Irritable, OR stubborn, OR querulous (always complaining, fretful).",
    "options": [
      "Irritable, OR stubborn, OR querulous (always complaining, fretful).",
      "Capable of relieving pain (analgesic, analgetic), not causing disapproval (innocuous).",
      "Having a proud and unbroken spirit, wiling to face danger.",
      "Timid or shy.\n\nLatin \"fearful\""
    ],
    "dayIntroduced": 3
  },
  {
    "id": 28,
    "word": "Intrigue",
    "correct": "Secret scheme to do smth, especially smth that will harm.",
    "options": [
      "Secret scheme to do smth, especially smth that will harm.",
      "Undeniable or certain, not open to question.",
      "Boisterous, noisy, aggressive, defiant.",
      "Openly distrustful and unwilling to confide."
    ],
    "dayIntroduced": 3
  },
  {
    "id": 29,
    "word": "Derelict",
    "correct": "Avoiding duties.",
    "options": [
      "Avoiding duties.",
      "(Insult) A person who knows nothing.",
      "Someone who behaves badly or does not obey rules.\n\nReprobate (a person without moral scruples)",
      "Complain to s/o or about s/t."
    ],
    "dayIntroduced": 3
  },
  {
    "id": 30,
    "word": "Aphoristic",
    "correct": "Terse and witty, like an aphorism.",
    "options": [
      "Terse and witty, like an aphorism.",
      "A rough and bitter manner, OR Distort adversely, biased.",
      "(Of a government or other authority) to not allow something.",
      "Feeling of remorse over bad action, or act of showing this remorse."
    ],
    "dayIntroduced": 3
  },
  {
    "id": 31,
    "word": "Verisimilitude",
    "correct": "The quality of seeming true or of having the appearance of being real.",
    "options": [
      "The quality of seeming true or of having the appearance of being real.",
      "(Of a government or other authority) to not allow something.",
      "To develop or grow quickly.",
      "Having moral integrity.\n\nUsing extreme care."
    ],
    "dayIntroduced": 4
  },
  {
    "id": 32,
    "word": "Invidious",
    "correct": "Causing resentment, implying prejudice.",
    "options": [
      "Causing resentment, implying prejudice.",
      "Time-wasting, slow and likely to cause delay.",
      "Manifesting, feeling, or expressing deep hatred or disapproval.",
      "As a result of whim or caprice, subject to erratic behaviour or unpredictable change."
    ],
    "dayIntroduced": 4
  },
  {
    "id": 33,
    "word": "Coterminous / Conterminous",
    "correct": "Equal in scope or duration. \n\nHaving the same borders or limits.",
    "options": [
      "Equal in scope or duration. \n\nHaving the same borders or limits.",
      "(Mildly disapproving) Someone who demands that rules and orders always be obeyed, even when it is unnecessary or unreasonable to do so.",
      "Misrepresent.\n\nOR Be in contraction with.",
      "To have or show feelings of hate towards someone or something."
    ],
    "dayIntroduced": 4
  },
  {
    "id": 34,
    "word": "Artless",
    "correct": "Simple and natural; without cunning or deceit.\n\nOR Candid, and unable to mask feelings.",
    "options": [
      "Simple and natural; without cunning or deceit.\n\nOR Candid, and unable to mask feelings.",
      "Vituperation, abusive expression / speech.",
      "Clumsy, inept.",
      "Characterised by dignity and propriety."
    ],
    "dayIntroduced": 4
  },
  {
    "id": 35,
    "word": "Cupitidity",
    "correct": "A strong feeling of wanting to have something, especially money or possessions.\n\nAvarice (An extremely strong wish to get or keep money or possessions)",
    "options": [
      "A strong feeling of wanting to have something, especially money or possessions.\n\nAvarice (An extremely strong wish to get or keep money or possessions)",
      "Belonging to another time.",
      "Unaffected by strong emotion or prejudice, able to think clearly and make good decisions.",
      "S/o who does s/t very often and cannot stop doing it."
    ],
    "dayIntroduced": 4
  },
  {
    "id": 36,
    "word": "Qualm",
    "correct": "Uneasiness, uncomfortable if you are doing the right thing.",
    "options": [
      "Uneasiness, uncomfortable if you are doing the right thing.",
      "Very insightful, quick in noticing, understanding or judging things accurately.",
      "Abundant supply, inexhuastible store.",
      "Excessive display to attract attention or excite admiration or envy."
    ],
    "dayIntroduced": 4
  },
  {
    "id": 37,
    "word": "Travesty",
    "correct": "(Noun) A debased, distorted or grossly inferior imitation -- not only literally, usually figuratively.\n\n(Verb) To make a travesty of.\n\ne.g. a sham trial is a travesty of justic",
    "options": [
      "(Noun) A debased, distorted or grossly inferior imitation -- not only literally, usually figuratively.\n\n(Verb) To make a travesty of.\n\ne.g. a sham trial is a travesty of justic",
      "Tempermentally disincliined to talk.",
      "Ominously prophetic.",
      "Follow a set of rules (philosophical, religious, made-up) no matter, unchanging.\n\nOR Characterised by assertion of unproved or unprovable principles."
    ],
    "dayIntroduced": 4
  },
  {
    "id": 38,
    "word": "Ignoble",
    "correct": "Characterised by baseness, lowness or meanness\n\nOR Of low birth or common origin.",
    "options": [
      "Characterised by baseness, lowness or meanness\n\nOR Of low birth or common origin.",
      "Very admiring of someone and representing the person as perfect or much better than they really are.",
      "Intellectually productive, fecund. Can be used in a negative connotation.",
      "Formal or legal approval or permission."
    ],
    "dayIntroduced": 4
  },
  {
    "id": 39,
    "word": "Devolve",
    "correct": "To cause power or responsibility to be delegated to other people",
    "options": [
      "To cause power or responsibility to be delegated to other people",
      "Lacking  imagination, not interesting.",
      "Deliberate, vigorous (could be abrupt) gesture or movement.",
      "1) Wildly extravagant, 2) Completely given up to dissipation and licentiousness, shamelessly immoral.\n\nPerson who is wildly extravagent, wasteful."
    ],
    "dayIntroduced": 4
  },
  {
    "id": 40,
    "word": "Baneful",
    "correct": "Will produce destruction or woe, seriously harmful.\n\nbaneful influence, effect, result",
    "options": [
      "Will produce destruction or woe, seriously harmful.\n\nbaneful influence, effect, result",
      "Very unusual or of very high quality and therefore impossible to copy; without equal.",
      "Aggressively self-assertive (belligerent), scathingly harsh (viriotlic), feeling or displaying ferocity (savage), deadly and destructive.",
      "Being in fact the thing named and not false, unreal or imaginary \u2014 often used to stress the partners of a metaphor."
    ],
    "dayIntroduced": 4
  },
  {
    "id": 41,
    "word": "Edifying",
    "correct": "Providing moral or intellectual instruction, improving your mind.",
    "options": [
      "Providing moral or intellectual instruction, improving your mind.",
      "Blissfully happy.\n\nOR Angelic, kind, gentle (benignity).",
      "Misleadingly attractive, based on pretense (way of behaving intended to deceive people).\n\nPlausible but false.",
      "Markedly different from an accepted norm.\n\n(Noun) s/o whose behaviour departs substantially from the norm of a group.\n\n(Verb: Abberate, although not recognised in some dictionaries)."
    ],
    "dayIntroduced": 5
  },
  {
    "id": 42,
    "word": "Behoove",
    "correct": "Be one's duty, be appropriate or necessary for own good or that of others.",
    "options": [
      "Be one's duty, be appropriate or necessary for own good or that of others.",
      "Acutely insightful and wise. \n\n(More particularly) skillful in statecraft or management.\n\nPerspicacious (shrewd, wise); sapient (but often used sarcastically)",
      "Likely to forgive, kind and generous towards an enemy or someone you defeated.",
      "Strongly encourage or persuade."
    ],
    "dayIntroduced": 5
  },
  {
    "id": 43,
    "word": "Pugnacious",
    "correct": "Having a combative or quarrelsome nature.",
    "options": [
      "Having a combative or quarrelsome nature.",
      "Deserving great praise.",
      "Exclusive right, perks.",
      "Reconciliation reached by opposing groups."
    ],
    "dayIntroduced": 5
  },
  {
    "id": 44,
    "word": "Lugubrious",
    "correct": "Exaggeratedly or affectedly mournful, dismal (landscape, music).",
    "options": [
      "Exaggeratedly or affectedly mournful, dismal (landscape, music).",
      "Especially of events or behvaiour, embarrassing becuase of being a complete failure.",
      "Related to tasting or the sense of taste.",
      "False, not what is appears, illegitimate. Based on smth not correctly understood."
    ],
    "dayIntroduced": 5
  },
  {
    "id": 45,
    "word": "Surly",
    "correct": "Often in a bad mood, unfriendly, not polite.",
    "options": [
      "Often in a bad mood, unfriendly, not polite.",
      "Pretend or exaggerate incapacity or illness (as to avoid duty or work).",
      "(S/t to your advantage) Not planned, happening by chance.",
      "(Verb) To completely suppress.\n\n(Noun) The act of suppressing, especially a retort that silences an opponent."
    ],
    "dayIntroduced": 5
  },
  {
    "id": 46,
    "word": "Pollyannaish",
    "correct": "Overly optimistic.",
    "options": [
      "Overly optimistic.",
      "Hostile, harmful or limiting.",
      "Extreme generosity with finances, bestowing gifts etc.",
      "Not willing to spend money or use a lot of something.\n\nOR Small in size or amount."
    ],
    "dayIntroduced": 5
  },
  {
    "id": 47,
    "word": "Replete",
    "correct": "Filled deeply.\n\nOR Fill to satisfaction.",
    "options": [
      "Filled deeply.\n\nOR Fill to satisfaction.",
      "Surrender under agreed conditions, often with regardst to official situations (competition, position, military).",
      "Clever and deceptive, adroit in attaining an end usually by insinuating or indirect mean. Crafty.",
      "Talk or write in a confused way for a long time.\n\nMove or behave in a slow, lazy way, without paying attention to anything. Wander aimlessly,"
    ],
    "dayIntroduced": 5
  },
  {
    "id": 48,
    "word": "Anachronism",
    "correct": "Belonging to another time.",
    "options": [
      "Belonging to another time.",
      "Interpret, make sense of based on evidence.",
      "To promote the growth or development of: rouse, incite.\n\nfoment dissent / revolution / riot",
      "The strong and unreasonable belief that your own country or race is the best or most important."
    ],
    "dayIntroduced": 5
  },
  {
    "id": 49,
    "word": "Iconoclastic",
    "correct": "Defying tradition, an attack on established beliefs or institutions.",
    "options": [
      "Defying tradition, an attack on established beliefs or institutions.",
      "Meagerness.",
      "Fit together tightly, as if by means of a dovetail.",
      "Lacking wit or imagination; not challenging and thus dull."
    ],
    "dayIntroduced": 5
  },
  {
    "id": 50,
    "word": "Cerebral",
    "correct": "Brainy, involving intelligence rather than emotions or instinct.",
    "options": [
      "Brainy, involving intelligence rather than emotions or instinct.",
      "Not likely to be successful, or not showing any signs of success.\n\nPropitious: have qualities which inspire hope.",
      "The ability to decide what is the best thing to do in a particular situation (resourcefulness), and to do it with energy and determination.",
      "Marked by harshly abusive criticism."
    ],
    "dayIntroduced": 5
  }
];

// ======== USER MANAGEMENT ========
function loadGlobalStore() {
  const stored = localStorage.getItem("gre_global_users");
  if (stored) {
    try {
      globalUserStore = JSON.parse(stored);
      if (!globalUserStore.treatmentCounts) {
        globalUserStore.treatmentCounts = { DT: 0, CM: 0, H: 0 };
      }
    } catch (err) {
      console.error("Failed to parse global users", err);
    }
  }
}

function saveGlobalStore() {
  localStorage.setItem("gre_global_users", JSON.stringify(globalUserStore));
}

function getUserRecord(email) {
  if (!globalUserStore.users[email]) {
    globalUserStore.users[email] = {
      email: email,
      assignedCondition: null,
      baselineCompleted: false,
      baselineScore: 0,
      baselineAnswers: [],
      learnedWordIds: [],
      newWordsTotal: 0,
      lastDayCompleted: 0,
      lastSessionEnd: null,
      day5TestCompleted: false,
      day5TestScore: 0,
      day5TestAnswers: [],
      day7TestCompleted: false,
      day7TestScore: 0,
      day7TestAnswers: []
    };
  }
  return globalUserStore.users[email];
}

function assignTreatment() {
  const counts = globalUserStore.treatmentCounts;
  const minCount = Math.min(counts.DT, counts.CM, counts.H);
  const availableTreatments = TREATMENTS.filter(t => counts[t] === minCount);
  
  const selected = availableTreatments[Math.floor(Math.random() * availableTreatments.length)];
  counts[selected]++;
  saveGlobalStore();
  return selected;
}

function saveStateToUser(email) {
  const record = getUserRecord(email);
  record.learnedWordIds = Array.from(state.learnedWordIds);
  record.newWordsTotal = state.newWordsTotal;
  saveGlobalStore();
}

function loadStateFromUser(email) {
  const record = getUserRecord(email);
  state.learnedWordIds = new Set(record.learnedWordIds || []);
  state.newWordsTotal = record.newWordsTotal || 0;
  state.lastDayCompleted = record.lastDayCompleted || 0;
  state.condition = record.assignedCondition;
}

function deleteUserAccount(email) {
  if (globalUserStore.users[email]) {
    const record = globalUserStore.users[email];
    if (record.assignedCondition && globalUserStore.treatmentCounts[record.assignedCondition]) {
      globalUserStore.treatmentCounts[record.assignedCondition]--;
    }
    delete globalUserStore.users[email];
    saveGlobalStore();
    return true;
  }
  return false;
}

function canStartSession(email) {
  const record = getUserRecord(email);
  if (!record.lastSessionEnd) return true;
  
  const lastEnd = new Date(record.lastSessionEnd);
  const nextMidnight = new Date(lastEnd);
  nextMidnight.setHours(24, 0, 0, 0);
  
  const now = new Date();
  return now >= nextMidnight;
}

function getNextSessionTime(email) {
  const record = getUserRecord(email);
  if (!record.lastSessionEnd) return null;
  
  const lastEnd = new Date(record.lastSessionEnd);
  const nextMidnight = new Date(lastEnd);
  nextMidnight.setHours(24, 0, 0, 0);
  
  return nextMidnight;
}

// ======== DOM ELEMENTS ========
const loginScreen = document.getElementById("login-screen");
const baselineScreen = document.getElementById("baseline-screen");
const configScreen = document.getElementById("config-screen");
const practiceScreen = document.getElementById("practice-screen");
const testScreen = document.getElementById("test-screen");
const endScreen = document.getElementById("end-screen");

const loginEmailInput = document.getElementById("loginEmail");
const loginBtn = document.getElementById("login-btn");
const deleteAccountBtn = document.getElementById("delete-my-account");

const baselineCurrent = document.getElementById("baseline-current");
const baselineTotal = document.getElementById("baseline-total");
const baselineTrial = document.getElementById("baseline-trial");
const baselineWord = document.getElementById("baseline-word");
const baselineForm = document.getElementById("baseline-form");
const baselineOptions = document.getElementById("baseline-options");
const baselineFeedback = document.getElementById("baseline-feedback");
const baselineComplete = document.getElementById("baseline-complete");
const baselineScore = document.getElementById("baseline-score");
const startStudyBtn = document.getElementById("start-study-btn");

const welcomeText = document.getElementById("welcome-text");
const dayInput = document.getElementById("day");
const sessionRestriction = document.getElementById("session-restriction");
const nextSessionTime = document.getElementById("next-session-time");
const startBtn = document.getElementById("start-btn");

const dayLabel = document.getElementById("day-label");
const dailyProgress = document.getElementById("daily-progress");
const weeklyProgress = document.getElementById("weekly-progress");
const targetMessage = document.getElementById("target-message");
const wordDisplay = document.getElementById("word-display");
const answerForm = document.getElementById("answer-form");
const optionsContainer = document.getElementById("options-container");
const feedbackDiv = document.getElementById("feedback");
const nextActionPanel = document.getElementById("next-action-panel");
const btnNew = document.getElementById("btn-new");
const btnReview = document.getElementById("btn-review");
const btnFinish = document.getElementById("btn-finish");
const statSessionTime = document.getElementById("stat-session-time");

const testDayLabel = document.getElementById("test-day-label");
const testCurrent = document.getElementById("test-current");
const testTotal = document.getElementById("test-total");
const testTrial = document.getElementById("test-trial");
const testWord = document.getElementById("test-word");
const testForm = document.getElementById("test-form");
const testOptions = document.getElementById("test-options");
const testFeedback = document.getElementById("test-feedback");
const testComplete = document.getElementById("test-complete");
const testScoreSummary = document.getElementById("test-score-summary");
const testDownloadBtn = document.getElementById("test-download-btn");
const testFinishBtn = document.getElementById("test-finish-btn");
const testTime = document.getElementById("test-time");

const endSummary = document.getElementById("end-summary");
const restartBtn = document.getElementById("restart-btn");

// ======== SESSION STATE ========
let state = {
  participantId: "",
  condition: "",
  day: 1,
  sessionStart: null,
  lastTrialStart: null,
  trialIndex: 0,
  dailyWordOrder: [], // RANDOMIZED order for this day

  learnedWordIds: new Set(),
  newWordsToday: 0,
  newWordsTotal: 0,
  reviewPreTarget: 0,
  reviewPostTarget: 0,
  overshoot: 0,

  currentTrial: null,
  sessionTrials: [],

  lastDayCompleted: 0,
  targetReached: false
};

let baselineState = {
  currentIndex: 0,
  answers: [],
  correctCount: 0
};

let testState = {
  testDay: 0,
  testStart: null,
  currentIndex: 0,
  wordOrder: [],
  answers: [],
  correctCount: 0
};

// ======== LOGIN ========
loadGlobalStore();

loginBtn.addEventListener("click", async () => {
  const email = loginEmailInput.value.trim();
  if (!email || !email.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }
    
  console.log("LOGIN clicked with email:", email); // NEW
  currentUserEmail = email;

  // 1) Create/get participant on the server
  // NEW: create/get participant on the server
  if (window.API && API.getParticipant) {
    try {
      const serverParticipant = await API.getParticipant(email);
      console.log("Server participant:", serverParticipant);
    } catch (e) {
      console.error("Failed to sync participant with server", e);
    }
  }
  // Existing localStorage logic
  const record = getUserRecord(email);

  if (!record.baselineCompleted) {
    loginScreen.classList.add("hidden");
    startBaselineTest();
  } else {
    loadStateFromUser(email);
    showConfigScreen();
  }
});

deleteAccountBtn.addEventListener("click", () => {
  const email = loginEmailInput.value.trim();
  if (!email) {
    alert("Please enter your email to delete your account.");
    return;
  }
  
  if (confirm(`Delete all data for ${email}?`)) {
    if (deleteUserAccount(email)) {
      alert("Account deleted.");
      loginEmailInput.value = "";
    } else {
      alert("No account found.");
    }
  }
});

// ======== BASELINE TEST ========
function startBaselineTest() {
  baselineScreen.classList.remove("hidden");
  baselineState.currentIndex = 0;
  baselineState.answers = [];
  baselineState.correctCount = 0;
  
  baselineTotal.textContent = BASELINE_TEST.length;
  baselineTrial.classList.remove("hidden");
  baselineComplete.classList.add("hidden");
  
  showBaselineQuestion();
}

function showBaselineQuestion() {
  const question = BASELINE_TEST[baselineState.currentIndex];
  baselineCurrent.textContent = baselineState.currentIndex + 1;
  
  baselineWord.textContent = question.word;
  baselineOptions.innerHTML = "";
  baselineFeedback.textContent = "";
  baselineFeedback.className = "feedback";
  
  const shuffled = [...question.options];
  shuffleArray(shuffled);
  
  shuffled.forEach((opt, i) => {
    const row = document.createElement("div");
    row.className = "option-row";
    row.innerHTML = `
      <label>
        <input type="radio" name="baseline_answer" value="${encodeURIComponent(opt)}" />
        ${opt}
      </label>
    `;
    baselineOptions.appendChild(row);
  });
}

baselineForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(baselineForm);
  const chosen = formData.get("baseline_answer");
  
  if (!chosen) {
    baselineFeedback.textContent = "Please select an answer.";
    return;
  }
  
  const decoded = decodeURIComponent(chosen);
  const question = BASELINE_TEST[baselineState.currentIndex];
  const correct = decoded === question.correct;
  
  if (correct) {
    baselineState.correctCount++;
    baselineFeedback.textContent = "Correct!";
    baselineFeedback.className = "feedback correct";
  } else {
    baselineFeedback.innerHTML = `Incorrect.<br><span class="correct-answer">Correct: ${question.correct}</span>`;
    baselineFeedback.className = "feedback incorrect";
  }
  
  baselineState.answers.push({
    word: question.word,
    chosen: decoded,
    correct: correct ? 1 : 0
  });
  
  setTimeout(() => {
    baselineState.currentIndex++;
    if (baselineState.currentIndex < BASELINE_TEST.length) {
      showBaselineQuestion();
    } else {
      completeBaselineTest();
    }
  }, 1500);
});

function completeBaselineTest() {
  const record = getUserRecord(currentUserEmail);
  record.baselineCompleted = true;
  record.baselineScore = baselineState.correctCount;
  record.baselineAnswers = baselineState.answers;
  
  record.assignedCondition = assignTreatment();
  state.condition = record.assignedCondition;
  
  saveGlobalStore();
  
  // Dispatch baseline complete event
  if (window.dispatchEvent) {
    window.dispatchEvent(
      new CustomEvent('baselineComplete', {
        detail: {
          participantId: currentUserEmail,
          answers: baselineState.answers,
          score: baselineState.correctCount
        }
      })
    );
  }
  
  baselineTrial.classList.add("hidden");
  baselineComplete.classList.remove("hidden");
  
  const percentage = ((baselineState.correctCount / BASELINE_TEST.length) * 100).toFixed(1);
  baselineScore.innerHTML = `You scored <strong>${baselineState.correctCount}/${BASELINE_TEST.length}</strong> (${percentage}%)`;
  
  console.log(`[RESEARCHER] ${currentUserEmail} assigned to: ${record.assignedCondition}`);
}

startStudyBtn.addEventListener("click", () => {
  loadStateFromUser(currentUserEmail);
  showConfigScreen();
});

// ======== CONFIG SCREEN ========
function showConfigScreen() {
  baselineScreen.classList.add("hidden");
  loginScreen.classList.add("hidden");
  testScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  configScreen.classList.remove("hidden");
  
  const record = getUserRecord(currentUserEmail);
  
  welcomeText.textContent = `Welcome!`;
  
  const suggestedDay = (record.lastDayCompleted || 0) + 1;
  if (suggestedDay <= 7) {
    dayInput.value = suggestedDay;
  }
  
  if (!canStartSession(currentUserEmail)) {
    sessionRestriction.classList.remove("hidden");
    startBtn.disabled = true;
    const nextTime = getNextSessionTime(currentUserEmail);
    nextSessionTime.textContent = nextTime.toLocaleString();
  } else {
    sessionRestriction.classList.add("hidden");
    startBtn.disabled = false;
  }
}

// ======== START SESSION ========
startBtn.addEventListener("click", () => {
  if (!currentUserEmail || !canStartSession(currentUserEmail)) {
    alert("Please wait until after midnight to start a new session.");
    return;
  }

  state.day = parseInt(dayInput.value, 10);
  state.participantId = currentUserEmail;

  if (state.day < 1 || state.day > 7) {
    alert("Day must be between 1 and 7.");
    return;
  }

  // Day 5: Immediate test
  if (state.day === 5) {
    startMemoryTest(5);
    return;
  }

  // Day 7: Delayed test
  if (state.day === 7) {
    startMemoryTest(7);
    return;
  }

  // Days 1-5: Learning sessions
  if (state.day > 5) {
    alert("Days 1-5 are learning sessions. Immediate test is right after Day 5's learning. Day 7 is another test.");
    return;
  }

  state.sessionStart = Date.now();
  state.newWordsToday = 0;
  state.reviewPreTarget = 0;
  state.reviewPostTarget = 0;
  state.overshoot = 0;
  state.trialIndex = 0;
  state.sessionTrials = [];
  state.targetReached = false;

  // RANDOMIZE word order for this day
  state.dailyWordOrder = WORD_BANK
    .filter(w => w.dayIntroduced <= state.day && !state.learnedWordIds.has(w.id))
    .map(w => w.id);
  shuffleArray(state.dailyWordOrder);

  dayLabel.textContent = `Day ${state.day}`;

  // Show appropriate progress bars
  if (state.condition === "DT") {
    dailyProgress.classList.remove("hidden");
    weeklyProgress.classList.add("hidden");
  } else if (state.condition === "CM") {
    dailyProgress.classList.add("hidden");
    weeklyProgress.classList.remove("hidden");
  } else if (state.condition === "H") {
    dailyProgress.classList.remove("hidden");
    weeklyProgress.classList.remove("hidden");
  }

  targetMessage.classList.add("hidden");

  configScreen.classList.add("hidden");
  practiceScreen.classList.remove("hidden");

  scheduleNextTrial("new");
});

// ======== TRIAL LOGIC ========

function getReviewPool() {
  return Array.from(state.learnedWordIds)
    .map((id) => WORD_BANK.find((w) => w.id === id))
    .filter(Boolean);
}

function scheduleNextTrial(type) {
  state.trialIndex += 1;
  nextActionPanel.classList.add("hidden");
  feedbackDiv.textContent = "";
  feedbackDiv.className = "feedback";
  // Re-enable the new word button (in case it was disabled)
  btnNew.disabled = false;

  let word;
  if (type === "new") {
    const maxNew = (state.condition === "DT") 
      ? Math.min(DT_DAILY_NEW_LIMIT, WEEKLY_NEW_LIMIT - state.newWordsTotal)
      : WEEKLY_NEW_LIMIT - state.newWordsTotal;
      
    if (state.newWordsToday >= maxNew) {
      alert("No more new words available for this session.");
      nextActionPanel.classList.remove("hidden");
      btnNew.disabled = true;  // Disable "Learn new word" button
      return;
    }
    
    // Get next word from randomized order
    const availableIds = state.dailyWordOrder.filter(id => !state.learnedWordIds.has(id));
    if (!availableIds.length) {
      alert("No new words available for this day!");
      nextActionPanel.classList.remove("hidden");
      return;
    }
    word = WORD_BANK.find(w => w.id === availableIds[0]);
  } else {
    const pool = getReviewPool();
    if (!pool.length) {
      alert("No words in review pool yet!");
      nextActionPanel.classList.remove("hidden");
      return;
    }
    word = pool[Math.floor(Math.random() * pool.length)];
  }

  state.currentTrial = { word, type };
  state.lastTrialStart = Date.now();

  displayTrial(word);
}

function displayTrial(word) {
  wordDisplay.textContent = word.word;

  optionsContainer.innerHTML = "";
  const shuffled = [...word.options];
  shuffleArray(shuffled);

  shuffled.forEach((opt, i) => {
    const row = document.createElement("div");
    row.className = "option-row";
    row.innerHTML = `
      <label>
        <input type="radio" name="answer" value="${encodeURIComponent(opt)}" />
        ${opt}
      </label>
    `;
    optionsContainer.appendChild(row);
  });

  updateProgressDisplays();
  window.requestAnimationFrame(updateTimers);
}

answerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(answerForm);
  const chosen = formData.get("answer");
  if (!chosen) {
    feedbackDiv.textContent = "Please select an answer.";
    return;
  }

  const decoded = decodeURIComponent(chosen);
  const { word, type } = state.currentTrial;
  const correct = decoded === word.correct;

  if (correct) {
    feedbackDiv.textContent = "Correct!";
    feedbackDiv.className = "feedback correct";
  } else {
    // Show correct answer in GREEN and BIGGER
    feedbackDiv.innerHTML = `Incorrect.<br><span class="correct-answer">${word.correct}</span>`;
    feedbackDiv.className = "feedback incorrect";
  }

  const now = Date.now();
  const trialTime = (now - state.lastTrialStart) / 1000;

  let isNewExposure = false;
  if (type === "new") {
    isNewExposure = !state.learnedWordIds.has(word.id);
    state.learnedWordIds.add(word.id);
    if (isNewExposure) {
      state.newWordsToday += 1;
      state.newWordsTotal += 1;
    }
  } else {
    if (state.newWordsToday < DT_DAILY_NEW_LIMIT) {
      state.reviewPreTarget += 1;
    } else {
      state.reviewPostTarget += 1;
      if (state.condition === "DT" || state.condition === "H") {
        state.overshoot += 1;
      }
    }
  }

  state.sessionTrials.push({
    participantId: state.participantId,
    condition: state.condition,
    day: state.day,
    trialIndex: state.trialIndex,
    wordId: word.id,
    word: word.word,
    type,
    chosen: decoded,
    correct: correct ? 1 : 0,
    newWordsToday: state.newWordsToday,
    newWordsTotal: state.newWordsTotal,
    reviewPreTarget: state.reviewPreTarget,
    reviewPostTarget: state.reviewPostTarget,
    overshoot: state.overshoot,
    trialTimeSec: trialTime.toFixed(3),
    sessionTimeSec: ((now - state.sessionStart) / 1000).toFixed(3),
  });

  saveStateToUser(currentUserEmail);
  updateProgressDisplays();
  
  // Show target message for DT/H when reaching 10
  if ((state.condition === "DT" || state.condition === "H") && 
      state.newWordsToday === DT_DAILY_NEW_LIMIT && 
      !state.targetReached) {
    state.targetReached = true;
    targetMessage.classList.remove("hidden");
  }

  nextActionPanel.classList.remove("hidden");
});

btnNew.addEventListener("click", () => {
  scheduleNextTrial("new");
});

btnReview.addEventListener("click", () => {
  scheduleNextTrial("review");
});

btnFinish.addEventListener("click", () => {
  endSession();
});

// ======== PROGRESS DISPLAY ========

function updateProgressDisplays() {
  if (state.condition === "DT" || state.condition === "H") {
    dailyProgress.textContent = `Today: ${state.newWordsToday} / ${DT_DAILY_NEW_LIMIT} words`;
  }

  if (state.condition === "CM" || state.condition === "H") {
    weeklyProgress.textContent = `This week: ${state.newWordsTotal} / ${WEEKLY_NEW_LIMIT} words`;
  }
}

function updateTimers() {
  if (!state.sessionStart) return;
  const now = Date.now();
  const sessionTime = (now - state.sessionStart) / 1000;
  statSessionTime.textContent = sessionTime.toFixed(0);
  requestAnimationFrame(updateTimers);
}

// ======== END SESSION ========

function endSession() {
    if (window.dispatchEvent && state.sessionTrials.length > 0 && state.participantId) {
    window.dispatchEvent(
      new CustomEvent('sessionComplete', {
        detail: {
          participantId: state.participantId,
          day: state.day,
          trials: state.sessionTrials,
        },
      })
    );
  }
    
  practiceScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  const record = getUserRecord(currentUserEmail);
  record.lastSessionEnd = new Date().toISOString();
  
  if (state.sessionTrials.length > 0) {
    if (!record.lastDayCompleted || state.day > record.lastDayCompleted) {
      record.lastDayCompleted = state.day;
    }
  }
  
  saveGlobalStore();

  // Show only new words learned and progress by condition
  let progressText = "";
  if (state.condition === "DT") {
    progressText = `Daily progress: ${state.newWordsToday}/${DT_DAILY_NEW_LIMIT} words`;
  } else if (state.condition === "CM") {
    progressText = `Weekly progress: ${state.newWordsTotal}/${WEEKLY_NEW_LIMIT} words`;
  } else if (state.condition === "H") {
    progressText = `Daily: ${state.newWordsToday}/${DT_DAILY_NEW_LIMIT} | Weekly: ${state.newWordsTotal}/${WEEKLY_NEW_LIMIT}`;
  }

  endSummary.innerHTML = `
    <strong>New words learned today: ${state.newWordsToday}</strong><br><br>
    ${progressText}
  `;
}

restartBtn.addEventListener("click", () => {
  endScreen.classList.add("hidden");
  showConfigScreen();
});

// ======== MEMORY TESTS (Day 5 & 7) ========

function startMemoryTest(day) {
  testState.testDay = day;
  testState.testStart = Date.now();
  testState.currentIndex = 0;
  testState.answers = [];
  testState.correctCount = 0;

  // Randomize all 50 words
  testState.wordOrder = [...WORD_BANK];
  shuffleArray(testState.wordOrder);

  testDayLabel.textContent = day === 5 ? "Day 5: Immediate Memory Test" : "Day 7: Delayed Memory Test";
  testTotal.textContent = testState.wordOrder.length;
    
  window.dispatchEvent(new CustomEvent('baselineComplete', {
  detail: { participantId, answers, score }
}));

window.dispatchEvent(new CustomEvent('testComplete', {
  detail: { participantId, testDay: 5, answers, score }
}));


  configScreen.classList.add("hidden");
  testScreen.classList.remove("hidden");
  testTrial.classList.remove("hidden");
  testComplete.classList.add("hidden");

  showTestQuestion();
}

function showTestQuestion() {
  const word = testState.wordOrder[testState.currentIndex];
  testCurrent.textContent = testState.currentIndex + 1;
  
  testWord.textContent = word.word;
  testOptions.innerHTML = "";
  testFeedback.textContent = "";
  testFeedback.className = "feedback";
  
  const shuffled = [...word.options];
  shuffleArray(shuffled);
  
  shuffled.forEach((opt) => {
    const row = document.createElement("div");
    row.className = "option-row";
    row.innerHTML = `
      <label>
        <input type="radio" name="test_answer" value="${encodeURIComponent(opt)}" />
        ${opt}
      </label>
    `;
    testOptions.appendChild(row);
  });

  // Update timer
  requestAnimationFrame(updateTestTimer);
}

function updateTestTimer() {
  if (!testState.testStart) return;
  const elapsed = (Date.now() - testState.testStart) / 1000;
  testTime.textContent = elapsed.toFixed(0);
  requestAnimationFrame(updateTestTimer);
}

testForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(testForm);
  const chosen = formData.get("test_answer");
  
  if (!chosen) {
    testFeedback.textContent = "Please select an answer.";
    return;
  }
  
  const decoded = decodeURIComponent(chosen);
  const word = testState.wordOrder[testState.currentIndex];
  const correct = decoded === word.correct;
  
  if (correct) {
    testState.correctCount++;
    testFeedback.textContent = "Correct!";
    testFeedback.className = "feedback correct";
  } else {
    testFeedback.innerHTML = `Incorrect.<br><span class="correct-answer">${word.correct}</span>`;
    testFeedback.className = "feedback incorrect";
  }
  
  testState.answers.push({
    wordId: word.id,
    word: word.word,
    chosen: decoded,
    correct: correct ? 1 : 0
  });
  
  setTimeout(() => {
    testState.currentIndex++;
    if (testState.currentIndex < testState.wordOrder.length) {
      showTestQuestion();
    } else {
      completeMemoryTest();
    }
  }, 1000);
});

function completeMemoryTest() {
  const record = getUserRecord(currentUserEmail);
  const testDuration = (Date.now() - testState.testStart) / 1000;

  if (testState.testDay === 5) {
    record.day5TestCompleted = true;
    record.day5TestScore = testState.correctCount;
    record.day5TestAnswers = testState.answers;
  } else {
    record.day7TestCompleted = true;
    record.day7TestScore = testState.correctCount;
    record.day7TestAnswers = testState.answers;
  }

  record.lastSessionEnd = new Date().toISOString();
  record.lastDayCompleted = testState.testDay;
  saveGlobalStore();

  // Dispatch test complete event
  if (window.dispatchEvent) {
    window.dispatchEvent(
      new CustomEvent('testComplete', {
        detail: {
          participantId: currentUserEmail,
          testDay: testState.testDay,
          answers: testState.answers,
          score: testState.correctCount
        }
      })
    );
  }

  testTrial.classList.add("hidden");
  testComplete.classList.remove("hidden");

  const percentage = ((testState.correctCount / testState.wordOrder.length) * 100).toFixed(1);
  testScoreSummary.innerHTML = `
    <strong>Score: ${testState.correctCount}/${testState.wordOrder.length}</strong> (${percentage}%)<br>
    Test duration: ${testDuration.toFixed(0)} seconds
  `;
}

testDownloadBtn.addEventListener("click", () => {
  const csv = buildTestCSV();
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `day${testState.testDay}_test_${currentUserEmail}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

testFinishBtn.addEventListener("click", () => {
  testScreen.classList.add("hidden");
  showConfigScreen();
});

function buildTestCSV() {
  const rows = testState.answers.map((ans, i) => ({
    participantId: currentUserEmail,
    condition: state.condition,
    testDay: testState.testDay,
    questionNum: i + 1,
    wordId: ans.wordId,
    word: ans.word,
    chosen: ans.chosen,
    correct: ans.correct
  }));

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  rows.forEach((r) => {
    const vals = headers.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`);
    lines.push(vals.join(","));
  });
  return lines.join("\n");
}

// ======== HELPERS ========

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

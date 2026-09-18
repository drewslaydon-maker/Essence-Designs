import { LoreEntry, DistrictInfo } from '../types';

export const LORE_ENTRIES: LoreEntry[] = [
  // ===================== VIVEC & THE TRIBUNAL =====================
  {
    id: 'vivec',
    title: 'Lord Vivec (Vehk)',
    subtitle: 'The Warrior-Poet, ALMSIVI, Master of the Dual Nature',
    category: 'vivec',
    era: 'First to Third Era (Born mortal ~1E 668, Transcended at Red Mountain)',
    alignment: 'Neutral / Transcendent (Living God)',
    summary: 'Master of the middle air, poet-warrior of the Tribunal, and living god of Morrowind. Vivec is split physically down the middle: his right side is the golden Chimer of the past, his left the ashen Dunmer of the present. He hovers perpetually in lotus meditation, caught between mortal regret and divine eternity.',
    deepLore: `Vivec's nature is the apex of Elder Scrolls metaphysics. Through the stolen power of the Heart of Lorkhan, Vehk achieved godhood alongside Almalexia (Ayem) and Sotha Sil (Seht), forming the ALMSIVI Tribunal. Yet Vivec went further: he attained CHIM—the state of realizing existence is the dream of a sleeping Godhead ("I AM AND I ARE ALL WE"). By viewing the cosmic Wheel sideways, it becomes the Tower, the glyph of "I".

The defining tragedy of Vivec is his dual split. Physically, he is half golden Chimer (holding onto the pre-curse godhood) and half ashen Dunmer (bearing Azura's curse for the murder of Indoril Nerevar). Spiritually and psychologically, he is perpetually torn between his mortal memories—the netchiman's wife's child who stole, lusted, and betrayed his sworn lord Nerevar at Red Mountain—and his infinite divine consciousness that loves all of creation unconditionally.

In his palace cantons, he hovers in the 'Sitting / Thinking' posture. One half thinks as a mortal burdened with guilt, the other acts as an omniscient divinity keeping the rogue moonlet Baar Dau (the Ministry of Truth) frozen in mid-air through sheer will and the conditional love of his people.`,
    beginnerNote: `For someone exploring Oblivion: While you are roaming Cyrodiil in 3E 433, just 6 years earlier (in 3E 427, the events of The Elder Scrolls III: Morrowind), the player met this literal living god floating in his golden palace surrounded by floating cantons in a giant lake! In Oblivion, gods are distant forces behind stained-glass chapel windows; in Morrowind, Vivec would personally sign your tourist papers while lecturing you on the nature of reality.`,
    quotes: [
      {
        text: 'The secret is the lotus, which opens and closes. I am the letter that has not yet been spoken.',
        source: 'The 36 Lessons of Vivec, Sermon 1',
        speaker: 'Lord Vivec'
      },
      {
        text: 'To be a god, each of us had to give up a part of who we were. I gave up my mortality, yet keep its wound open so I may remember how to love men.',
        source: 'The Sermons of Sotha Sil & Vivec (Apocrypha)',
        speaker: 'Lord Vivec'
      },
      {
        text: 'He was born of netchimen in the ashlands, but wore a face of gold and a face of night so that neither man nor spirit could claim him entirely.',
        source: 'Varieties of Faith in the Empire',
        speaker: 'Brother Mikhael Karkuxor'
      }
    ],
    tags: ['Vivec', 'Tribunal', 'CHIM', 'Morrowind', 'Warrior-Poet', 'ALMSIVI', 'Metaphysics'],
    crossReferences: ['nerevar', 'sotha_sil', 'almalexia', 'pelinal_whitestrake', 'chim_concept', 'lorkhan', 'white_gold_tower'],
    affinity: 'gold-chimer',
    kirkbrideScore: 5
  },
  {
    id: 'sotha_sil',
    title: 'Sotha Sil (Lord Seht)',
    subtitle: 'The Clockwork God, Magus of the Tribunal, Architect of the Second Nirn',
    category: 'characters',
    era: 'First to Third Era',
    alignment: 'Hermetic / Deterministic',
    summary: 'The reclusive sorcerer-king of the Tribunal who harnessed Kagrenac\'s tools to tap the Heart of Lorkhan. Unlike Vivec\'s poetic poetry or Almalexia\'s public vanity, Sotha Sil embraced pure logic, creating the subterranean Clockwork City as an idealized, deterministic replica of Tamriel.',
    deepLore: `Sotha Sil viewed reality as a wounded machine that needed fixing. He foresaw the death of the Tribunal, the fading of the Heart's divine power, and his own gruesome death at the hands of Almalexia. In Michael Kirkbride's and ESO's expanded lore (Clockwork City DLC), Sotha Sil's dialogue is among the most sorrowful in fiction: he envies mortals because they possess the illusion of free will, whereas his divine cognition forces him to see all causes, gear-teeth, and predetermined tragic ends.`,
    beginnerNote: `If you like tinkering or clockwork dungeons, Sotha Sil is the Da Vinci of Tamriel. While you are in the Imperial City mages guild casting fireball, this guy built an entire brass planetary sphere hidden inside a small decorative dome!`,
    quotes: [
      {
        text: 'The Tribunal is a cage. We are the wardens who lost the key inside our own bellies.',
        source: 'Memories of the Clockwork Apostle',
        speaker: 'Sotha Sil'
      }
    ],
    tags: ['Tribunal', 'Clockwork City', 'ALMSIVI', 'Morrowind', 'Metaphysics'],
    crossReferences: ['vivec', 'almalexia', 'nerevar', 'lorkhan'],
    affinity: 'ash-dunmer',
    kirkbrideScore: 4
  },
  {
    id: 'almalexia',
    title: 'Almalexia (Ayem)',
    subtitle: 'The Face-Snatcher, Healing Mother of Morrowind, Lady of Mercy',
    category: 'characters',
    era: 'First to Third Era',
    alignment: 'Divine Mother / Tragic Descent into Tyranny',
    summary: 'Nerevar\'s widow and the golden queen of the Tribunal. Where Vivec was contemplative and Sotha Sil withdrawn, Almalexia craved the unconditional adoration of the Dunmer. As the Heart\'s power waned in the late Third Era, her desperation to preserve her divine status drove her into madness.',
    deepLore: `Almalexia retained the 100% golden Chimer appearance after Azura cursed the Dunmer race with ash skin and burning eyes. Symbolically, she refused to acknowledge change. When Dagoth Ur cut off access to the Heart of Lorkhan at Red Mountain, her loss of divinity shattered her sanity, leading her to murder Sotha Sil and frame the resurrected Nerevarine before her own demise.`,
    beginnerNote: `She is the classic tragic golden queen. While Vivec accepts that their godhood was borrowed and must end, Almalexia throws the celestial equivalent of a temper tantrum that almost destroys an entire province.`,
    quotes: [
      {
        text: 'None may look upon Ayem and doubt her grace. To doubt is to invite the ash.',
        source: 'Homilies of Blessed Almalexia',
        speaker: 'Temple Inscription'
      }
    ],
    tags: ['Tribunal', 'ALMSIVI', 'Morrowind', 'Chimer'],
    crossReferences: ['vivec', 'sotha_sil', 'nerevar', 'dagoth_ur'],
    affinity: 'gold-chimer',
    kirkbrideScore: 3
  },
  {
    id: 'nerevar',
    title: 'Indoril Nerevar (The Hortator)',
    subtitle: 'First Council Champion, Son of Boethiah, the Betrayed King',
    category: 'characters',
    era: 'First Era (~1E 400 - 1E 700)',
    alignment: 'Legendary Hero / Mortally Betrayed',
    summary: 'The great unifier of the Chimer houses and leader of the First Council alongside the Dwemer King Dumac. Champion of the Daedric Prince Azura and bearer of the enchanted ring Moon-and-Star. His death at Red Mountain remains the pivotal mystery that birthed the Tribunal.',
    deepLore: `The "Foul Murder" of Nerevar is one of the darkest crimes in Elder Scrolls history. In Temple orthodoxy, Nerevar died of wounds inflicted by Dumac and Dagoth Ur. But deep lore, secret texts (like the 36 Lessons acrostic "FOUL MURDER" spelled out by the first letters of sermon thirty-six), and the Trial of Vivec confirm the Tribunal murdered him using Kagrenac's tools so they could usurp the Heart's godhood for themselves. Azura then cursed all Chimer into Dunmer as eternal witness to their betrayal.`,
    beginnerNote: `In Oblivion, people still talk about the 'Nerevarine'—the reincarnated Nerevar who walked Tamriel just 6 years ago, cured the blight, and defeated Dagoth Ur!`,
    quotes: [
      {
        text: 'He was our brother, our lord, and our sacrifice. We slew him not out of malice, but because the world needed gods more than it needed a general.',
        source: 'The Apocrypha of Vehk',
        speaker: 'Vivec'
      }
    ],
    tags: ['Nerevar', 'First Council', 'Morrowind', 'Red Mountain', 'Foul Murder'],
    crossReferences: ['vivec', 'dagoth_ur', 'azura', 'lorkhan'],
    affinity: 'ash-dunmer',
    kirkbrideScore: 4
  },
  {
    id: 'pelinal_whitestrake',
    title: 'Pelinal Whitestrake',
    subtitle: 'The Star-Made Knight, Cyborg Crusade of the First Era, The Divine Madman',
    category: 'characters',
    era: 'First Era (~1E 242 - Alessian Slave Rebellion)',
    alignment: 'Aedric Champion / Unhinged Cosmic Crusader',
    summary: 'The legendary hero of Queen Alessia who broke the reign of the elven Ayleids and established the First Empire of Cyrodiil. Famous for dual-wielding swords, his armor from future ages, and his terrifying bouts of divine madness that erased entire swaths of land.',
    deepLore: `Pelinal is the ultimate focal point of wild Elder Scrolls lore. Penned by Michael Kirkbride in *The Song of Pelinal*, he is heavily implied to be a time-traveling cyborg / Ada sent back from the far future to ensure mankind\'s survival against the Ayleid sorcerer-kings.

His left arm was made of "killing light" (interpreted by fans and lore scholars as a beam cannon). When his lover Huna was slain, he flew into such a murderous frenzy that he tore the Ayleid lands into non-existence, forcing the gods to send divine manifestations to prevent him from unraveling reality itself. Most chillingly, before Alessia took the throne, Pelinal spoke the name of Reman Cyrodiil—an Emperor who would not be born for another 2,500 years ("Reman! He whispered, smelling of blood and sulfur"). In ESO, his armor, relics, and celestial knightly presence were formally woven into canonized Imperial religious rites during the Midyear Mayhem (Whitestrake\'s Mayhem).`,
    beginnerNote: `When you are wandering Cyrodiil in Oblivion and visit the Chapels or the Knights of the Nine DLC, you are literally following in the bloody footsteps of Pelinal! His tomb lies near the Imperial City, and the statues in the chapels depict his sword and armor. He is humanity\'s terrifying holy berserker.`,
    quotes: [
      {
        text: '...and his left hand was made of a killing light, and when he struck, he sang out names of kings that had not yet been born...',
        source: 'The Song of Pelinal, Volume 2',
        speaker: 'Anonymous Alessian Scribe'
      },
      {
        text: 'O Aka, for our shared madness, look upon what your mirror-shards have wrought in the dirt!',
        source: 'The Song of Pelinal, Volume 8',
        speaker: 'Pelinal Whitestrake'
      }
    ],
    tags: ['Pelinal', 'Cyborg', 'Alessia', 'Imperial City', 'Ayleids', 'Song of Pelinal', 'Knights of the Nine', 'Kirkbride'],
    crossReferences: ['white_gold_tower', 'alessia', 'imperials', 'akatosh', 'remanc'],
    affinity: 'imperial',
    kirkbrideScore: 5
  },
  {
    id: 'alessia',
    title: 'Saint Alessia (Paravant)',
    subtitle: 'The Slave-Queen, First Empress of Cyrodiil, Lady of the Covenant',
    category: 'characters',
    era: 'First Era (~1E 242)',
    alignment: 'Imperial Saint / Empire Founder',
    summary: 'A human slave who led the great rebellion against the Ayleids in Cyrodiil with the aid of the demigod bull Morihaus, the divine warrior Pelinal Whitestrake, and Nordic allies. She made the divine covenant with Akatosh that gave birth to the Dragonfires and the Amulet of Kings.',
    deepLore: `Alessia was an ingenious theologian. To unite her human rebellion—which consisted of both Nordic sun-worshippers and Cyro-Nordic pantheons—she forged the Eight Divines by blending Nordic gods (Shor, Kyne) with elven deities (Auri-El, Mara), politely creating an imperial synthesis. On her deathbed, Akatosh drew blood from his own heart and placed it in the Red Diamond (the Chim-el Adabal), sealing the realm from Oblivion as long as her heirs wore the Amulet of Kings and lit the Dragonfires.`,
    beginnerNote: `The very reason you are running around in Oblivion trying to find Martin Septim is Saint Alessia! Emperor Uriel Septim VII gave you the Amulet of Kings because the dragonfires extinguished when he died, letting Mehrunes Dagon's gates open across Cyrodiil.`,
    quotes: [
      {
        text: 'So long as the Blood of the Dragon flows in the veins of the Emperor, and the Dragonfires burn bright in the Temple of the One, the gates of the Daedric realms shall be barred.',
        source: 'The Covenant of Akatosh',
        speaker: 'Saint Alessia'
      }
    ],
    tags: ['Alessia', 'Amulet of Kings', 'Imperial City', 'Oblivion Crisis', 'Akatosh', 'First Empire'],
    crossReferences: ['pelinal_whitestrake', 'white_gold_tower', 'akatosh', 'imperials'],
    affinity: 'imperial',
    kirkbrideScore: 3
  },
  {
    id: 'dagoth_ur',
    title: 'Dagoth Ur (The Sharmat)',
    subtitle: 'Lord of Red Mountain, High Priest of the Heart, The False Dreamer',
    category: 'characters',
    era: 'First to Third Era',
    alignment: 'Solipsistic Nightmare / Antimatter Vivec',
    summary: 'Formerly Lord Voryn Dagoth of House Dagoth, sworn companion to Nerevar. Bound to the Heart of Lorkhan, he survived beneath Red Mountain for thousands of years, spreading the divine Blight and the Corprus disease in an effort to assimilate all of Morrowind into a single dreaming consciousness: Akulakhan.',
    deepLore: `Dagoth Ur is the metaphysical dark twin of Vivec. Where Vivec achieved CHIM ("I exist, and I am part of the dream, but I am distinct and I love you"), Dagoth Ur suffered "Anti-CHIM" or solipsism ("I am the dreamer, therefore you do not exist; you are only extensions of me, and I must assimilate you"). He believed he was awake, but he was sleepwalking inside the Heart's pulse.`,
    beginnerNote: `The main villain of Morrowind. Unlike Mehrunes Dagon who wants to smash Cyrodiil with fireballs, Dagoth Ur was an eerily polite demigod who welcomed you to his volcano like an old friend before trying to infect your soul.`,
    quotes: [
      {
        text: 'What a fool you are. I\'m a god. How can you kill a god? What a grand and intoxicating innocence.',
        source: 'The Confrontation at Red Mountain',
        speaker: 'Dagoth Ur'
      }
    ],
    tags: ['Dagoth Ur', 'Morrowind', 'Red Mountain', 'Corprus', 'Anti-CHIM'],
    crossReferences: ['vivec', 'nerevar', 'lorkhan', 'chim_concept'],
    affinity: 'ash-dunmer',
    kirkbrideScore: 5
  },

  // ===================== GODS & PANTHEONS =====================
  {
    id: 'akatosh',
    title: 'Akatosh (Auri-El / Alkosh / Alduin)',
    subtitle: 'The Dragon God of Time, Chief Divine, Sovereign of the Nine',
    category: 'gods',
    era: 'Dawn Era to Eternity',
    alignment: 'Aedric / Order of Time',
    summary: 'The primary deity of the Eight and Nine Divines of the Imperial Cult. Akatosh embodies the flow and linear progression of Time. Without Akatosh, reality in the Dawn Era was a chaotic, non-linear soup where events happened out of sequence.',
    deepLore: `Akatosh is fractured across mortal perception. To the Altmer, he is Auri-El, the noble ancestor who slew Lorkhan. To the Nords, he is Alduin the World-Eater who eats the kalpa so the next world may start. In Cyrodiil, during the First Era, the Marukhati Selectives performed the infamous 'Dance on the Tower', a cosmic ritual that broke Time for 1008 years (the Middle Dawn Dragon Break) in an attempt to surgically excise the 'elven traits' from Akatosh, resulting in a fractured divine identity.`,
    beginnerNote: `In the center of the Imperial City Temple District stands the grand Temple of the One, dedicated to Akatosh! At the climax of the Oblivion main quest, Martin Septim channels Akatosh's fiery avatar to fight Mehrunes Dagon himself right in the Imperial City streets.`,
    quotes: [
      {
        text: 'He is the Dragon of Time, the first god to crystallize in the Void. Through him, the ticking clock began.',
        source: 'The Monomyth',
        speaker: 'Imperial Scholar'
      }
    ],
    tags: ['Akatosh', 'Divines', 'Dragon of Time', 'Dragon Break', 'Imperial City', 'Amulet of Kings'],
    crossReferences: ['alessia', 'white_gold_tower', 'lorkhan', 'mehrunes_dagon'],
    affinity: 'aedric',
    kirkbrideScore: 4
  },
  {
    id: 'lorkhan',
    title: 'Lorkhan (The Missing God / Shor / Shezarr / Doom Drum)',
    subtitle: 'Creator of Mundus, Trickster or Savior, Father of Men',
    category: 'gods',
    era: 'Dawn Era',
    alignment: 'Padomaic Catalyst of Mortality',
    summary: 'The most controversial figure in the cosmos. Lorkhan convinced (or tricked) the original et\'Ada into giving up their infinite divine power to create the mortal world (Mundus). Punished by the other gods at the Convention, his heart was torn out and cast into the sea, forming Red Mountain.',
    deepLore: `Lorkhan is the reason Vivec, Pelinal, and humanity exist. To the elves (Altmer), Lorkhan is the great deceiver who robbed them of paradise and trapped them in mortal decay. To Men (Nords, Imperials), he is Shor/Shezarr, the loving creator who gave mortals the arena to achieve something greater than static godhood: the Walking Ways and CHIM. His severed Heart became the divine engine tapped by the Dwemer and the Tribunal.`,
    beginnerNote: `Every time you wonder why Tamriel exists at all, blame Lorkhan. The entire mortal realm is his divine experiment!`,
    quotes: [
      {
        text: 'This world is a testing ground, a scar where gods fell so that mortals might learn to look beyond the limits of eternity.',
        source: 'The Heart of the World',
        speaker: 'Ancient Text'
      }
    ],
    tags: ['Lorkhan', 'Creation', 'Mundus', 'Heart of Lorkhan', 'Dawn Era', 'Metaphysics'],
    crossReferences: ['vivec', 'nerevar', 'akatosh', 'chim_concept'],
    affinity: 'metaphysical',
    kirkbrideScore: 5
  },
  {
    id: 'mehrunes_dagon',
    title: 'Mehrunes Dagon',
    subtitle: 'Daedric Prince of Destruction, Change, Revolution, and Energy',
    category: 'gods',
    era: 'Immortal Daedric Prince',
    alignment: 'Chaotic Padomaic Force',
    summary: 'The four-armed Lord of the Deadlands, who believes Tamriel is not a mortal plane, but merely a forgotten Daedric realm rightfully belonging to him. He is the central antagonist who tears open the Oblivion Gates across Cyrodiil.',
    deepLore: `In deep metaphysical lore (*The Aldudagga* and Kirkbride texts), Dagon was once the Leaper Demon King, a benign mischievous spirit who hid pieces of previous world-cycles (kalpas) from Alduin. Alduin caught him and cursed him to become the Lord of Destruction, decreeing that he could never return to his true form until he destroyed every single hidden piece of the worlds he stashed away. This reframes his relentless attacks on Tamriel as an agonized cosmic curse rather than simple cartoon evil.`,
    beginnerNote: `You are living through his invasion in Oblivion right now! Every time you see a red stormy sky and a molten gate erupting in the Cyrodiil wilderness, that's Mehrunes Dagon knocking on the front door because the Emperor was assassinated.`,
    quotes: [
      {
        text: 'The mortal realm is fragile because it resists change. I bring fire not to end it, but to force it to wake.',
        source: 'Commentaries on the Mysterium Xarxes, Book 3',
        speaker: 'Mankar Camoran'
      }
    ],
    tags: ['Mehrunes Dagon', 'Oblivion Crisis', 'Daedra', 'Deadlands', 'Oblivion Main Quest'],
    crossReferences: ['akatosh', 'white_gold_tower', 'alessia'],
    affinity: 'daedric',
    kirkbrideScore: 4
  },
  {
    id: 'sheogorath',
    title: 'Sheogorath (The Madgod)',
    subtitle: 'Lord of the Never-There, Sovereign of the Shivering Isles, Prince of Madness',
    category: 'gods',
    era: 'Immortal Daedric Prince',
    alignment: 'Unpredictable / Creative / Demented',
    summary: 'The chaotic ruler of the Shivering Isles, split between Mania (ecstatic inspiration, vivid colors) and Dementia (paranoia, darkness, torture). Speaks with whimsical humor, loves cheese, and wields the Wabbajack.',
    deepLore: `Sheogorath is actually Jyggalag, the terrifying Daedric Prince of Order, Deduction, and Absolute Logic. The other Daedric Princes feared Jyggalag's expanding realm of mathematical perfection, so they pooled their power to curse him with the one thing he despised most: total, nonsensical chaos and madness. At the end of every era, Jyggalag breaks free in the 'Greymarch', only to be defeated and cursed anew.`,
    beginnerNote: `Oblivion has an entire expansion called *The Shivering Isles* where you get to enter his mind-bending dimension! He is easily the most hilarious and beloved Daedric Prince in the community.`,
    quotes: [
      {
        text: 'Cheese for everyone! Wait, scratch that. Cheese for no one. That can be just as much of a celebration, if you don\'t like cheese.',
        source: 'Encounter in the Shivering Isles',
        speaker: 'Sheogorath'
      }
    ],
    tags: ['Sheogorath', 'Daedra', 'Shivering Isles', 'Madness', 'Jyggalag'],
    crossReferences: ['vivec', 'mehrunes_dagon'],
    affinity: 'daedric',
    kirkbrideScore: 3
  },
  {
    id: 'azura',
    title: 'Azura of the Crimson Gate',
    subtitle: 'Queen of Dusk and Dawn, Mother of the Rose, Patroness of the Dunmer',
    category: 'gods',
    era: 'Immortal Daedric Prince',
    alignment: 'Possessive / Loving / Vengeful',
    summary: 'One of the few Daedric Princes who demands love and adoration rather than sheer fear. She guided the prophet Veloth to lead the Chimer out of the Summerset Isles into Morrowind, and cursed their skin to ash when the Tribunal broke their oath and murdered Nerevar.',
    deepLore: `Azura is the sister of Nocturnal and Mephala in the cosmic loom. While benevolent compared to Mehrunes Dagon or Molag Bal, Azura\'s vanity is legendary. She waited three millennia to engineer the Nerevarine prophecy, patient enough to watch the Tribunal\'s godhood decay until her champion arrived to humble Vivec and cast down their false temple.`,
    beginnerNote: `In Oblivion, her shrine sits high in the Jerall Mountains north of Cheydinhal. Completing her quest rewards you with Azura's Star, the best reusable soul gem in the entire game!`,
    quotes: [
      {
        text: 'They have taken your skin as their coat of gold, but I have marked their people with the color of ash, so none may forget the betrayal at Red Mountain.',
        source: 'The Battle of Red Mountain',
        speaker: 'Azura'
      }
    ],
    tags: ['Azura', 'Daedra', 'Dunmer', 'Chimer', 'Nerevar', 'Moon-and-Star'],
    crossReferences: ['vivec', 'nerevar', 'almalexia', 'sotha_sil'],
    affinity: 'daedric',
    kirkbrideScore: 3
  },
  {
    id: 'malacath',
    title: 'Malacath (Mauloch / Trinimac Reborn)',
    subtitle: 'God of the Spurned, Lord of the Pariah, The Excreted God',
    category: 'gods',
    era: 'Dawn Era to Present',
    alignment: 'Protective / Spurned / Grudge-Keeper',
    summary: 'The patron deity of the Orcs and all who are outcast from civilized society. Originally the greatest elven champion god Trinimac, he was defeated by Boethiah, swallowed whole, and literally defecated out upon the ground.',
    deepLore: `In the Dawn Era, Trinimac attempted to stop the prophet Veloth from leading the Chimer into exile. Boethiah ambushed Trinimac, swallowed him whole, and spoke to his followers using Trinimac's stolen voice from within her belly. Boethiah then defecated Trinimac out. The digested, ashen husk transformed into Malacath, Lord of the Pariahs. Trinimac's faithful rubbed his holy dung over their bodies in grief and transformed into the Orsimer (the Orcs). Malacath is not considered a true Daedric Prince by the other Princes, but rather a deformed pariah god who cherishes sworn oaths, bitter grudges, and the blood-ties of clan strongholds.`,
    beginnerNote: `Every Orc you encounter in Cyrodiil—from the smiths in the Market District to the gladiators in the Arena—venerates Malacath! In Oblivion, his shrine quest has you free enslaved ogres from a cruel mine because Malacath genuinely cares for the oppressed.`,
    quotes: [
      {
        text: 'You think me a monster? I was the greatest knight in the heavens before the betrayal. Now I guard those whom the world throws away.',
        source: 'The True Nature of Orcs',
        speaker: 'Malacath'
      }
    ],
    tags: ['Malacath', 'Trinimac', 'Orsimer', 'Orcs', 'Boethiah', 'Volendrung'],
    crossReferences: ['boethiah', 'orsimer'],
    affinity: 'daedric',
    kirkbrideScore: 4
  },
  {
    id: 'boethiah',
    title: 'Boethiah (Prince of Plots)',
    subtitle: 'Lord of Deceit, Ambush, Treason, and the Crucible of Strength',
    category: 'gods',
    era: 'Immortal Daedric Prince',
    alignment: 'Sovereign of Unlawful Power & Martial Trial',
    summary: 'The Daedric Prince of Plots, Conspiracy, and Treason. Worshipped by the Chimer as one of the Three Good Daedra who taught them how to build houses, forge swords, and wear armor to survive the harsh ashlands of Morrowind.',
    deepLore: `Boethiah's philosophy is the core of the Psijic Endeavor: the mortal realm is a deliberate forge where only those who overcome cruel struggle deserve to survive. If you are weak enough to be betrayed, you deserved your fate. Boethiah ambushed Trinimac, consumed him, and excreted Malacath to prove that golden ideals of knightly honor are fragile illusions in the face of ruthless will.`,
    beginnerNote: `In Oblivion, Boethiah runs the 'Tournament of Ten Bloods' where you must fight champions of every mortal race in a brutal arena for the legendary katana Goldbrand!`,
    quotes: [
      {
        text: 'We are the chisel and the stone. If the strike shatters you, you were dust to begin with.',
        source: 'The Anticipations',
        speaker: 'Temple Lore'
      }
    ],
    tags: ['Boethiah', 'Plots', 'Trinimac', 'Malacath', 'Veloth', 'Goldbrand'],
    crossReferences: ['malacath', 'vivec', 'azura'],
    affinity: 'daedric',
    kirkbrideScore: 4
  },
  {
    id: 'literal_cosmology',
    title: 'Literal Cosmology: Sun Holes, Moon Corpses & Infinite Planets',
    subtitle: 'The Measurable Astrophysical Realities of Mundus and the Void',
    category: 'gods',
    era: 'Dawn Era to Eternity',
    alignment: 'Cosmic Physical Fact',
    summary: 'In the Elder Scrolls, astronomy is literal divinity. The Sun is a massive tear into the magic realm left by Magnus fleeing creation; the Stars are pinholes torn by his followers; and the Moons Masser and Secunda are the rotting halves of Lorkhan\'s corpse.',
    deepLore: `Nirn does not exist in a Copernican solar system. The planets visible from Tamriel are actually the infinite planes of the Eight Divines; mortal optical nerves compress infinite planes into round spheres because human brains cannot comprehend infinity. Magic (magicka) is literally celestial light pouring through the tears in reality made by Magnus and the Magna Ge. When Lorkhan's heart was ripped out, his sundered corpse was flung into orbit, becoming Masser and Secunda.`,
    beginnerNote: `When your wife looks up at the sky over the Imperial City, every star is a hole in space letting magic leak into Nirn, and the moons are the literal body of the creator god!`,
    quotes: [
      {
        text: 'The sky is not empty air, but a curtain torn to ribbons by gods who fled the weight of their own design.',
        source: 'Cosmology of the Aurbis',
        speaker: 'Imperial Astronomer'
      }
    ],
    tags: ['Cosmology', 'Magnus', 'Sun', 'Moons', 'Lorkhan', 'Magna Ge', 'Astrophysics'],
    crossReferences: ['lorkhan', 'akatosh'],
    affinity: 'metaphysical',
    kirkbrideScore: 5
  },

  // ===================== RACES OF TAMRIEL =====================
  {
    id: 'imperials',
    title: 'The Imperials (Cyrodiils)',
    subtitle: 'People of the Heartland, Cosmopolitan Masters of Diplomacy and Law',
    category: 'races',
    era: 'First Era to Present',
    alignment: 'Cosmopolitan / Order / Empire',
    summary: 'The cosmopolitan human inhabitants of Cyrodiil. Physically adaptable and linguistically gifted, they forged the Third Empire under the Septim dynasty that united all of Tamriel under one legal and economic banner.',
    deepLore: `The Imperials are not culturally monolithic; they are split into two distinct peoples: the **Colovians** of the west (rugged, disciplined warriors, castle-builders, austere frontiersmen who admire the Nords) and the **Nibenese** of the east (magical, flamboyant, philosophical silk-merchants, cult-worshippers centered around the Niben River and the Imperial City). Saint Alessia and Reman Cyrodiil melded these two halves into the Empire.`,
    beginnerNote: `This is the race running the Imperial City where you just started! Every city guard yelling 'Stop right there, criminal scum!', the shopkeepers in the Market District, and the Emperor himself are proud Imperials.`,
    quotes: [
      {
        text: 'The Empire is the guarantor of peace. Through the coin and the legion, we bring civilized law to the wild provinces.',
        source: 'Pocket Guide to the Empire, 3rd Edition',
        speaker: 'Imperial Bureau'
      }
    ],
    tags: ['Imperials', 'Cyrodiil', 'Empire', 'Colovian', 'Nibenese', 'Septim'],
    crossReferences: ['pelinal_whitestrake', 'alessia', 'white_gold_tower', 'akatosh'],
    affinity: 'imperial',
    kirkbrideScore: 2
  },
  {
    id: 'dunmer',
    title: 'The Dunmer (Dark Elves)',
    subtitle: 'People of Ash and Fire, Exiles of Veloth, Dwellers of Vvardenfell',
    category: 'races',
    era: 'First Era (~1E 700) to Present',
    alignment: 'Ancestor Worship / House Politics / Resilient',
    summary: 'The ashen-skinned, red-eyed elves of Morrowind. Known for their fierce pride, Great House rivalries (Redoran, Telvanni, Hlaalu, Indoril, Dres), domestication of giant silt striders, and veneration of the Tribunal and Ancestor spirits.',
    deepLore: `The Dunmer did not always look like this. Originally they were the Chimer ('Changed Folk'), radiant golden elves who abandoned the decadent Altmer of Summerset to follow the prophet Veloth. At the climax of the Battle of Red Mountain, when Vivec, Almalexia, and Sotha Sil tapped the Heart of Lorkhan to become gods, Azura appeared and transformed the entire race into Dunmer—giving them skin the color of volcanic ash and eyes like glowing coals as a permanent mark of the Tribunal's broken oath. Vivec deliberately maintained half his skin as golden Chimer to mock or defy Azura's judgment.`,
    beginnerNote: `In Oblivion, you\'ll meet many Dunmer in the Imperial City (like the fence Ungarion in Bravil or citizens in the Waterfront). Back in their homeland of Morrowind, they live in hollowed giant crab shells and giant mushroom towers!`,
    quotes: [
      {
        text: 'We are born in the ash and our bones are ground into the ghostfence. We do not ask for pity, for the ash has made us harder than bronze.',
        source: 'Dunmer Proverb',
        speaker: 'Ashlander Wise Woman'
      }
    ],
    tags: ['Dunmer', 'Dark Elves', 'Morrowind', 'Chimer', 'Azura', 'Great Houses'],
    crossReferences: ['vivec', 'nerevar', 'azura', 'sotha_sil'],
    affinity: 'ash-dunmer',
    kirkbrideScore: 4
  },
  {
    id: 'chimer',
    title: 'The Chimer (The Changed Folk)',
    subtitle: 'The Golden Ancestors of the Dunmer, Followers of Saint Veloth',
    category: 'races',
    era: 'Middle Merethic Era to 1E 700',
    alignment: 'Devout Velothi Daedra Worshippers',
    summary: 'The golden-skinned Aldmeri dissidents who rejected the ancestor-worship of Summerset to worship the "Good Daedra" (Boethiah, Azura, Mephala). They migrated across Tamriel to settle in Resdayn (Morrowind).',
    deepLore: `The Chimer golden skin is preserved exclusively on the right half of Lord Vivec and the entire body of Almalexia. The Chimer believed that mortal life was a trial (the 'Psijic Endeavor') designed by Boethiah and Lorkhan to force souls to overcome hardship and attain higher spiritual consciousness.`,
    beginnerNote: `Think of them as the 'before' photo of the Dark Elves. Vivec kept half his body golden so he would never let anyone forget who his people used to be.`,
    quotes: [
      {
        text: 'Follow the prophet through the poison marsh and the frozen passes. There, in the land of fire, we shall forge a new people.',
        source: 'The Exodus of Veloth',
        speaker: 'Saint Veloth'
      }
    ],
    tags: ['Chimer', 'Veloth', 'Morrowind', 'Ancestors', 'Vivec Golden Half'],
    crossReferences: ['vivec', 'dunmer', 'nerevar', 'azura'],
    affinity: 'gold-chimer',
    kirkbrideScore: 4
  },
  {
    id: 'khajiit',
    title: 'The Khajiit of Elsweyr',
    subtitle: 'Children of the Moon, Children of the Ja-Kha\'jay, Masters of Stealth',
    category: 'races',
    era: 'Dawn Era to Present',
    alignment: 'Lunar / Playful / Mystical',
    summary: 'The feline beastfolk of Elsweyr. Famous for their agility, production and consumption of Moon Sugar, distinctive third-person speech patterns, and mysterious connection to the two moons of Nirn, Masser and Secunda.',
    deepLore: `The Khajiit form is not genetic; it is determined entirely by the phases of the moons at the moment of their birth (the Ja-Kha\'jay). A Khajiit born under certain phases can be an **Alfiq** (looks like an ordinary intelligent housecat who can cast master-level spells), an **Ohmes** (looks almost identical to a human/Bosmer with a painted face), a **Cathay** (the standard bipedal cat person you see in Oblivion), or a **Senche-raht** (a battle-cat as tall as two men that other Khajiit ride into war!).`,
    beginnerNote: `If you like sneaking and picking locks in the Imperial City Waterfront, you\'re playing right into Khajiit territory! The fence in the Thieves Guild, Armand Christophe, deals with many Khajiit rogues.`,
    quotes: [
      {
        text: 'Khajiit has wares if you have coin, traveler. But the moons give their light for free.',
        source: 'Street merchant quip',
        speaker: 'Ri\'saad'
      }
    ],
    tags: ['Khajiit', 'Elsweyr', 'Moons', 'Ja-Kha-jay', 'Beastfolk'],
    crossReferences: ['imperials', 'azura'],
    affinity: 'beast',
    kirkbrideScore: 3
  },
  {
    id: 'argonians',
    title: 'The Argonians (Saxhleel)',
    subtitle: 'People of the Root, Marsh-Walkers, Telepathic Children of the Hist',
    category: 'races',
    era: 'Dawn Era to Present',
    alignment: 'Ancient / Ecological / Alien',
    summary: 'The reptilian inhabitants of the mysterious Black Marsh (Argonia). Immune to most poisons and able to breathe underwater, they share a deep mystical soul-bond with the sentient, telepathic spore-trees known as the Hist.',
    deepLore: `Argonians are among the most alien beings in Tamriel. They do not perceive time as a straight line; their souls return to the Hist upon death and are redistributed into newly hatched eggs. During the Oblivion Crisis happening in the current game, the Hist warned the Argonians in advance. The Argonians counter-invaded Mehrunes Dagon\'s realm so viciously that Dagon\'s generals were forced to close the Oblivion Gates from their side to prevent Argonian armies from taking over the Deadlands!`,
    beginnerNote: `You\'ll see Argonians swimming in the canals around the Imperial City Waterfront. If you swim underwater in Lake Rumare around the city, Argonians have the natural biological superpower of infinite waterbreathing!`,
    quotes: [
      {
        text: 'We are the leaves of the Hist. When the wind blows from the sun, we rustle. When the ash falls, we remember the root.',
        source: 'Saxhleel Proverb',
        speaker: 'Tree-Minder'
      }
    ],
    tags: ['Argonians', 'Saxhleel', 'Black Marsh', 'Hist', 'Oblivion Crisis Badasses'],
    crossReferences: ['mehrunes_dagon', 'imperials'],
    affinity: 'beast',
    kirkbrideScore: 4
  },
  {
    id: 'dwemer',
    title: 'The Dwemer (Deep Elves / Dwarves)',
    subtitle: 'Masters of Tonal Architecture, Logic Heretics, The Vanished Race',
    category: 'races',
    era: 'Merethic to First Era (Vanished 1E 700)',
    alignment: 'Atheistic / Scientific Hubris',
    summary: 'The ancient subterranean elves who rejected the gods in favor of reason, acoustic science (tonal architecture), and steam-driven automata. In 1E 700, during the Battle of Red Mountain, Chief Tonal Architect Kagrenac struck the Heart of Lorkhan, and every Dwemer on Nirn vanished in an instant.',
    deepLore: `Where did the Dwemer go? In Michael Kirkbride\'s metaphysical cosmology, the Dwemer did not simply die or teleport to another continent. They were harmonized into the brass skin of their colossal artificial god, the Numidium (Walk-Brass). By refusing to accept that they were figments of the Godhead\'s dream, their tonal strike either caused them to become zero-summed (erased from reality) or united their entire race\'s collective consciousness into the world-refusing bronze titan.`,
    beginnerNote: `Throughout your travels, you\'ll find heavy brass gears and steam-pipes in ruined vaults. Those are left behind by the Dwemer. They were so technologically advanced they had steam heating and automated robots while everyone else was swinging iron swords!`,
    quotes: [
      {
        text: 'I do not believe in the gods. I believe in the harmonic vibrations of the brass pipe and the pressure of steam.',
        source: 'Attributed to Kagrenac',
        speaker: 'Dwemer Tonal Architect'
      }
    ],
    tags: ['Dwemer', 'Dwarves', 'Tonal Architecture', 'Numidium', 'Red Mountain Mystery'],
    crossReferences: ['vivec', 'nerevar', 'lorkhan'],
    affinity: 'metaphysical',
    kirkbrideScore: 5
  },
  {
    id: 'orsimer',
    title: 'The Orcs (Orsimer / The Pariah Folk)',
    subtitle: 'Children of Malacath, Excreted Elves, Unmatched Heavy Armor Masters',
    category: 'races',
    era: 'Dawn Era to Present',
    alignment: 'Honor / Pariah / Warrior Caste',
    summary: 'The green-skinned, tusked warriors of Wrothgar and the stronghold clans. Contrary to popular imperial prejudice, Orcs are NOT goblin-kin or beastfolk; they are ancient elves (Mer) mutated when their god Trinimac was swallowed and excreted by Boethiah.',
    deepLore: `The Orsimer live by the strict Code of Malacath: no prisons, no petty theft, and blood-debts paid in coin or direct physical combat. When their patron Aedric champion Trinimac was defecated out by Boethiah as Malacath, his devoted Aldmer followers rubbed his holy excreted ash into their flesh. Their bodies transformed, sprouting tusks and jade-colored hide. They forged Orsinium multiple times, only for frightened human and Breton armies to raze it to the ground.`,
    beginnerNote: `The Grand Champion of the Imperial City Arena is the Gray Prince (Agronak gro-Malog), an Orc blademaster! Orcs make the heaviest, most durable plate armor and battleaxes in the game.`,
    quotes: [
      {
        text: 'The weak complain of unfairness. An Orc takes up his hammer and strikes the anvil until the world yields.',
        source: 'Code of Malacath',
        speaker: 'Clan Chieftain'
      }
    ],
    tags: ['Orcs', 'Orsimer', 'Malacath', 'Trinimac', 'Wrothgar', 'Pariah Mer'],
    crossReferences: ['malacath', 'boethiah'],
    affinity: 'daedric',
    kirkbrideScore: 4
  },
  {
    id: 'bosmer',
    title: 'The Wood Elves (Bosmer)',
    subtitle: 'The Sap-Speakers of Valenwood, Green Pact Carnivores, Wild Hunt Masters',
    category: 'races',
    era: 'Dawn Era to Present',
    alignment: 'Naturalist / Carnivore / Chaos',
    summary: 'The agile, nimble elves of Valenwood. Renowned across Tamriel as the supreme archers and thieves, they adhere to the eerie "Green Pact" which forbids them from harming any plant life in their forest.',
    deepLore: `Because of the Green Pact made with the forest deity Y\'ffre, Bosmer are strictly 100% carnivores. They cannot eat vegetables, fruit, or herbs from Valenwood. Even stranger is the **Meat Mandate**: traditional Bosmer warriors are religiously mandated to consume the flesh of enemies they slay in combat within three days! When facing utter destruction, the Bosmer perform the apocalyptic **Wild Hunt**, drinking mutagenic sap to dissolve their forms into an uncontrollable stampede of shrieking shapeshifting beasts that devour everything before consuming themselves.`,
    beginnerNote: `You\'ll encounter hilarious Wood Elves throughout Oblivion—like Glarthir in Skingrad who thinks the entire town is conspiring against him, and the iconic Adoring Fan who follows you after you become Arena Champion!`,
    quotes: [
      {
        text: 'Do not pick the flower. Do not break the branch. The forest gives us the meat of the beast, and the meat of the intruder.',
        source: 'The Words of Y\'ffre',
        speaker: 'Silvenar Priest'
      }
    ],
    tags: ['Bosmer', 'Wood Elves', 'Green Pact', 'Valenwood', 'Wild Hunt', 'Archery'],
    crossReferences: ['imperials', 'khajiit'],
    affinity: 'aedric',
    kirkbrideScore: 4
  },
  {
    id: 'redguards',
    title: 'The Redguards of Hammerfell (Yokudans)',
    subtitle: 'Refugees from the Previous Kalpa, Masters of the Ansei Spirit Sword',
    category: 'races',
    era: 'Dawn Era to Present',
    alignment: 'Martial Pride / Kalpic Survivors',
    summary: 'The fierce, independent warriors of Hammerfell. Descended from the Yokudans who sailed across the sea after their homeland sank into the ocean. The supreme natural swordsmen of Tamriel.',
    deepLore: `Deep Kirkbride lore reveals that the Yokudans actually crossed over from the **previous world-cycle (Kalpa)** by walking sideways through the celestial angles of time! In Yokuda, their sword-singers (Ansei) could manifest ethereal blades of pure spiritual light. Their home continent was annihilated when an Ansei master unleashed the forbidden **Pankratosword**—a legendary cut that sliced the atomic fabric of reality itself, causing a continent-destroying cataclysm.`,
    beginnerNote: `Redguards have the greatest natural weapon agility and poison resistance in Oblivion, making them premier frontline warriors in any fighters guild or city patrol!`,
    quotes: [
      {
        text: 'The blade does not strike because of muscle; it strikes because your spirit has already cut the moment in half.',
        source: 'The Book of the Circles',
        speaker: 'Frandar Hunding'
      }
    ],
    tags: ['Redguards', 'Yokuda', 'Kalpa', 'Pankratosword', 'Ansei', 'Hammerfell'],
    crossReferences: ['imperials', 'nords'],
    affinity: 'imperial',
    kirkbrideScore: 5
  },

  // ===================== METAPHYSICS & KIRKBRIDE COSMOLOGY =====================
  {
    id: 'chim_concept',
    title: 'The Secret of CHIM (The Royal State)',
    subtitle: 'The Tower, The Wheel Sideways, and The Supreme Ego',
    category: 'metaphysics',
    era: 'Eternal Metaphysical Truth',
    alignment: 'Transcendent Awakening',
    summary: 'The highest philosophical attainment in Elder Scrolls lore. CHIM is the realization that all of existence, the cosmos, and the gods are mere dreams in the mind of a sleeping Godhead. To achieve CHIM, one must realize "I do not exist" and yet, through supreme will and love, defiantly proclaim: "I AM."',
    deepLore: `If a mortal learns that the universe is a dream and their sense of self falters, they "Zero-Sum"—they instantly dissolve into nothingness like a drop of ink in the ocean.

Only two beings are widely confirmed to have achieved CHIM: **Lord Vivec** and **Tiber Septim (Talos)**.
Vivec explained CHIM using the symbol of the Wheel. Look at the Aurbis: the Eight Divines are the spokes, the spaces between are the Daedric realms, and Mundus is the hub. If you look at the Wheel head-on, you see the structure of reality. But if you turn your head and look at the Wheel edge-on, the shape of the wheel transforms into a vertical line: the letter "I". That "I" is the Tower. It is the proclamation that despite being a dream character, your individual identity stands supreme. Vivec used CHIM to rewrite his own past so that he was always born a god.`,
    beginnerNote: `This is the deepest rabbit hole in video game history! It\'s like The Matrix meets Tibetan mysticism written by a mad genius. It explains how characters like Vivec can break the fourth wall and know they are inside a simulation/dream.`,
    quotes: [
      {
        text: 'The secret syllable of royalty is CHIM. He who knows it possesses the fire that cannot be consumed, for he is the candle and the room and the darkness beyond.',
        source: 'The 36 Lessons of Vivec, Sermon 12',
        speaker: 'Lord Vivec'
      }
    ],
    tags: ['CHIM', 'Godhead', 'Metaphysics', 'Tower', 'Wheel', 'Zero-Sum', 'Kirkbride'],
    crossReferences: ['vivec', 'lorkhan', 'white_gold_tower', 'pelinal_whitestrake'],
    affinity: 'gold-chimer',
    kirkbrideScore: 5
  },
  {
    id: 'enantiomorph',
    title: 'The Enantiomorph (King, Rebel, Observer)',
    subtitle: 'The Mythic Drama of Triads and Betrayal That Powers Reality',
    category: 'metaphysics',
    era: 'Recurring Cosmic Pattern',
    alignment: 'Structural Cosmic Myth',
    summary: 'The foundational triad pattern that recurs throughout all major events in Tamrielic history. Two identical yet opposing forces—the King and the Rebel—fight until they are indistinguishable, while an Observer/Witness is maimed or blinded in the process.',
    deepLore: `The universe runs on this formula:
1. **The Original**: Anu (King) vs Padomay (Rebel), with Nir (Witness) slain.
2. **Red Mountain**: Nerevar (King) vs Dumac/Dagoth (Rebels), with the Tribunal as the Witness who usurped the throne.
3. **The Creation of Talos**: Emperor Cuhlecain/Hjalti (King) vs King Wulfharth (Rebel), with Battlemage Zurin Arctus as the Witness whose heart was ripped out to power the Mantella.
Vivec understood that all power in the Aurbis is born from stepping into these mythic roles and "mantling" them until the cosmos cannot tell the difference between you and the archetype.`,
    beginnerNote: `Ever notice how Elder Scrolls stories always have three major figures betraying each other? That's not just a coincidence; in lore, reality is an engine powered by this exact three-way conflict!`,
    quotes: [
      {
        text: 'The King and the Rebel are twins who fight in the dark. Only the maimed witness knows which one walked out the door.',
        source: 'Nu-Mantia Intercept',
        speaker: 'Temple Arch-Theorist'
      }
    ],
    tags: ['Enantiomorph', 'Metaphysics', 'King Rebel Witness', 'Talos', 'Nerevar'],
    crossReferences: ['vivec', 'nerevar', 'lorkhan', 'chim_concept'],
    affinity: 'metaphysical',
    kirkbrideScore: 5
  },
  {
    id: 'white_gold_tower',
    title: 'The White-Gold Tower (Apex of Cyrodiil)',
    subtitle: 'The Cosmic Wheel-Hub, Tower of the Ayleids, Center of Mundus',
    category: 'cyrodiil_guide',
    era: 'Middle Merethic Era to Present',
    alignment: 'Cosmic Anchor / Reality Pillar',
    summary: 'The monumental ivory spire rising at the heart of the Imperial City. Built by the ancient Ayleids to mirror the primordial Adamantine Tower, it is one of the mythic "Towers" that anchor physical reality and prevent Mundus from dissolving back into the Dawn Era chaos.',
    deepLore: `In metaphysical lore, the Towers are cosmic tuning forks holding the fabric of mortal existence together. Each Tower possesses a "Stone" that powers it. The Stone of the White-Gold Tower was the **Chim-el Adabal** (the Red Diamond in the Amulet of Kings). Its concentric design mirrors the cosmic Wheel: the eight outer islands and bridges represent the eight spokes (the Divines), and the central green tower represents the hub. When the Amulet of Kings is threatened, the White-Gold Tower\'s metaphysical anchor weakens, allowing the realm of Oblivion to bleed into Cyrodiil.`,
    beginnerNote: `You see this tower from almost everywhere in Oblivion! The moment you stepped out of the dark prison sewers into the sunny lakeside, looking up at that gigantic white tower—that is White-Gold. It\'s not just a palace; it\'s literally keeping the sky from falling.`,
    quotes: [
      {
        text: 'The Tower touches heaven and roots in the blood of the earth. Break the Tower, and the world returns to mist.',
        source: 'Sub-Creatures of the Sub-Gradient',
        speaker: 'Ayleid Inscription'
      }
    ],
    tags: ['White-Gold Tower', 'Imperial City', 'Towers of Nirn', 'Ayleids', 'Amulet of Kings'],
    crossReferences: ['alessia', 'pelinal_whitestrake', 'imperials', 'akatosh', 'mehrunes_dagon'],
    affinity: 'imperial',
    kirkbrideScore: 4
  },
  {
    id: 'moon_and_star',
    title: 'One-Clan-Under-Moon-and-Star',
    subtitle: 'The Ring of Nerevar, Dwemer-Forged Divine Authentication',
    category: 'characters',
    era: 'First Era to Present',
    alignment: 'Divine Relic / Azura\'s Blessing',
    summary: 'A golden ring crafted by Dwemer Sorcerer-Priest Kagrenac for Lord Indoril Nerevar, blessed by the Daedric Prince Azura. Any mortal who wears it is struck dead instantly, unless they are the genuine reincarnation of Nerevar.',
    deepLore: `The ring bears the inscription: "Neither blood nor pledge shall be broken." During the First Council, it symbolized the sacred pact between the Chimer and Dwemer. When Nerevar was murdered at Red Mountain, the ring was taken to the Cavern of the Incarnate. In 3E 427, the player character puts it on, survives the lethal curse, and is officially recognized by Azura and the Ashlanders as the Nerevarine.`,
    beginnerNote: `In Oblivion, when citizens whisper about "the hero who bore the Moon-and-Star", they are talking about your character in Morrowind! It is the ultimate badge of destiny.`,
    quotes: [
      {
        text: 'None may wear the Moon-and-Star save Nerevar alone, for Azura\'s curse bites the finger of the pretender with fatal fire.',
        source: 'Ashlander Proverb',
        speaker: 'Wise Woman Manirai'
      }
    ],
    tags: ['Moon-and-Star', 'Nerevar', 'Azura', 'Relic', 'Morrowind Main Quest'],
    crossReferences: ['nerevar', 'vivec', 'azura', 'kagrenacs_tools'],
    affinity: 'ash-dunmer',
    kirkbrideScore: 4
  },
  {
    id: 'kagrenacs_tools',
    title: 'The Tonal Tools of Kagrenac',
    subtitle: 'Wraithguard, Sunder, and Keening: Keys to the Heart of Lorkhan',
    category: 'metaphysics',
    era: 'First Era (Created ~1E 668 by Dwemer Tonal Architects)',
    alignment: 'Tonal Resonance / Divine Instruments',
    summary: 'Three legendary instruments created by the Dwemer Chief Tonal Architect Kagrenac to tap, manipulate, and unbind the divine power of the Heart of Lorkhan.',
    deepLore: `Kagrenac understood that physical reality is composed of sacred sound and tonal harmonics. 
- **Wraithguard**: A heavy Dwemer gauntlet that insulates the wielder from the lethal feedback of holding the other two tools.
- **Sunder**: An enchanted warhammer that strikes the Heart to produce the exact baseline tonal frequency.
- **Keening**: A dagger made of sound-focusing glass-metal that cuts and reshapes the tonal threads.
When Kagrenac used these tools during the Battle of Red Mountain, his final strike caused every Dwemer on Nirn to instantly vanish. Thousands of years later, the Nerevarine wielded them again to sever Dagoth Ur from the Heart. In *Skyrim*, Keening reappears in the College of Winterhold quests!`,
    beginnerNote: `Think of them as the ultimate tuning forks of the gods. Striking the Heart without Wraithguard kills a mortal in half a second!`,
    quotes: [
      {
        text: 'Strike the Heart with Sunder to set the pitch; flay the Heart with Keening to release the chord.',
        source: 'Plan to Defeat Dagoth Ur',
        speaker: 'Lord Vivec'
      }
    ],
    tags: ['Kagrenac Tools', 'Sunder', 'Keening', 'Wraithguard', 'Heart of Lorkhan', 'Dwemer', 'Red Mountain'],
    crossReferences: ['dwemer', 'lorkhan', 'vivec', 'dagoth_ur', 'nerevar'],
    affinity: 'metaphysical',
    kirkbrideScore: 5
  },
  {
    id: 'saint_jiub',
    title: 'Saint Jiub the Eradicator',
    subtitle: 'From Prison Ship Companion to Canonized Imperial Saint',
    category: 'characters',
    era: 'Late Third Era',
    alignment: 'Beloved Folk Hero',
    summary: 'The rugged Dunmer ex-prisoner who wakes you up in the opening cutscene of Morrowind ("Wake up, we\'re here. Why are you shaking?"). After his release, he single-handedly hunted every flying cliff racer in Morrowind to extinction and was sainted by the Empire.',
    deepLore: `Cliff racers in Morrowind were famously the most annoying flying bird-reptiles in gaming history, attacking players every 15 seconds. Jiub made it his life\'s mission to exterminate them all. His crusade was so celebrated across Tamriel that the Imperial Temple declared him an official saint! In Oblivion, street rumors praise his name. In Skyrim\'s *Dawnguard* DLC, the player even meets his ghost writing his memoirs inside the Soul Cairn!`,
    beginnerNote: `When your wife hears NPCs in the Imperial City praising 'Saint Jiub', she can smile knowing that in Morrowind, Jiub is literally the very first friendly guy who greets you on the boat!`,
    quotes: [
      {
        text: 'Wake up, we\'re here. Why are you shaking? Quiet, here comes the guard.',
        source: 'The Elder Scrolls III: Morrowind (Opening Line)',
        speaker: 'Jiub'
      }
    ],
    tags: ['Saint Jiub', 'Cliff Racers', 'Morrowind Meme', 'Imperial Saint', 'Boat Buddy'],
    crossReferences: ['dunmer', 'imperials', 'nerevar'],
    affinity: 'ash-dunmer',
    kirkbrideScore: 2
  }
];

export const IMPERIAL_CITY_DISTRICTS: DistrictInfo[] = [
  {
    id: 'prison_sewers',
    name: 'Imperial Prison & Subterranean Sewers',
    subtitle: 'Where Every Legend Begins in Chains',
    icon: 'ShieldAlert',
    description: 'The gloomy stone cells beneath the Imperial City bastions. You wake up with no memory of why you are locked away, greeted only by the insults of dark elf neighbor Valen Dreth across the hall—until the secret door opens and Emperor Uriel Septim VII himself enters with his Blades.',
    lootingSpotlight: 'Goblin shamans with lockpicks, rusty iron broadswords, leather greaves, and wooden buckets. Finding that first silver goblet or flawless ruby in a mossy chest feels like a king\'s ransom!',
    deepLoreSecret: 'The sewers were not built by humans; they are the sunken foundations of ancient Ayleid royal waterways beneath the White-Gold Tower, imbued with lingering welkynd-stone magic.',
    charactersPresent: ['Emperor Uriel Septim VII', 'Baurus of the Blades', 'Valen Dreth (The Taunting Dunmer)', 'Glenroy']
  },
  {
    id: 'market_district',
    name: 'The Market District',
    subtitle: 'The Beating Commercial Heart of Tamriel',
    icon: 'Store',
    description: 'The loudest, busiest circular plaza in the province. Lined with specialty shops: Jensine\'s Good As New Merchandise, The Best Defense armor shop, The Gilded Carafe alchemy emporium, and The Main Ingredient. Street vendors sell sweetrolls and cheap iron arrows.',
    lootingSpotlight: 'Your primary destination right now! Selling off stolen sewer silverware, mudcrab chitin, and goblin shields until merchants run out of gold. Watch out for the Imperial City guards patrolling every corner!',
    deepLoreSecret: 'The merchant houses here secretly fund expeditions to scour Cyrodiil\'s ruined Ayleid temples for vintage statues and enchanted crystals to sell to high-society nobles.',
    charactersPresent: ['Jensine', 'Thoronir of The Copious Coinpurse', 'Phintias (First Edition Bookstore)']
  },
  {
    id: 'waterfront',
    name: 'The Waterfront District',
    subtitle: 'Shacks, Fog, and the Shadow of the Thieves Guild',
    icon: 'Anchor',
    description: 'The impoverished docklands on the southwest shores of Lake Rumare. Decaying wooden piers, floating pirate ships, derelict lighthouses, and clusters of ragged shacks. By day it is a working port; by midnight, torches flicker as shadowy figures meet behind the garden barrels.',
    lootingSpotlight: 'The infamous Bloated Float inn (a tavern on an actual docked ship!), empty crates with fresh fruit, and pickpocketing unwary sailors. Also the perfect place to buy a modest shack for 2,000 gold!',
    deepLoreSecret: 'Every midnight, Armand Christophe of the Thieves Guild appears in the Dareloth garden with a torch to recruit new pickpockets under the personal blessing of the mystical Gray Fox.',
    charactersPresent: ['Armand Christophe', 'Ormil (Bloated Float)', 'Hieronymus Lex (The Obsessed Watch Captain)']
  },
  {
    id: 'arena',
    name: 'The Arena District',
    subtitle: 'Blood, Roars, and the Grand Champion\'s Glory',
    icon: 'Swords',
    description: 'The sunken stone colosseum where the Blue Team and Yellow Team duel to the death for public amusement. The betting booths are always swarming with rowdy spectators shouting for their favorite brawlers.',
    lootingSpotlight: 'Heavy raiment armor from the armory chests, betting on the Yellow Team pit fights to double your pocket gold, and fighting your way from Pit Dog all the way to Grand Champion!',
    deepLoreSecret: 'The current Grand Champion, Agronak gro-Malog ("The Gray Prince"), is universally beloved, but harbors a terrifying secret about his mysterious vampire father in a distant castle.',
    charactersPresent: ['Agronak gro-Malog (The Gray Prince)', 'Owyn (Blunt Sword Master)', 'The Adoring Fan (Waiting for you!)']
  },
  {
    id: 'arboretum',
    name: 'The Arboretum & Talos Plaza',
    subtitle: 'Statues of the Nine and the Mansions of Nobility',
    icon: 'Trees',
    description: 'Peaceful garden pathways lined with towering cypress trees and bronze statues representing each of the Nine Divines (with Tiber Septim standing tall at the center). Surrounding it are the grand limestone townhouses of Cyrodiil\'s merchant barons and imperial aristocrats.',
    lootingSpotlight: 'Rich noble mansions with locked display cases (Very Hard locks) holding enchanted jewelry, velvet garments, vintage Surilie Brothers wine, and silver tableware.',
    deepLoreSecret: 'During the Oblivion Crisis, the statues of the Divines here are said to softly weep tears of dew when the dragonfires are snuffed out in the temple district.',
    charactersPresent: ['Imperial Nobles', 'Priests of the Nine', 'Bravil & Skingrad Ambassadors']
  },
  {
    id: 'palace_district',
    name: 'The Green Emperor Way (Imperial Palace)',
    subtitle: 'The White-Gold Tower and the Tombs of the Septims',
    icon: 'Castle',
    description: 'The magnificent inner sanctuary encircled by high white marble walls and iron gates. Ancient tombstones of past emperors rest beneath willow trees around the base of the colossal White-Gold Tower, watched day and night by elite Palace Guards in gilded dragon armor.',
    lootingSpotlight: 'Strictly forbidden! Getting caught trespassing here triggers instant arrest by the elite Imperial Palace Watch. The library on the upper floor contains secret historical records.',
    deepLoreSecret: 'Deep inside the palace is the Elder Council Chamber and the secret vaults housing the actual Elder Scrolls—mystical parchment artifacts that blind anyone who tries to read their shifting prophecies without monastic training.',
    charactersPresent: ['High Chancellor Ocato', 'Imperial Palace Royal Guard', 'Blind Moth Priests']
  }
];

export const VIVEC_DUALITY_DATA = {
  godHalf: {
    title: 'Vehk the Divine (God Half)',
    subtitle: 'The Radiant Chimer, Poet-Lord, Holder of the Heart\'s Fire',
    skinTone: 'Golden Amber (Chimer Ancestry)',
    colorHex: '#e5a93c',
    symbol: 'Sun / Golden Wheel',
    philosophies: [
      'Attained CHIM: realizes reality is a dream yet maintains supreme individual ego ("I AM AND I ARE ALL WE").',
      'Wields Muatra, the spear born of paradox and secret knowledge.',
      'Sustains the rogue moonlet Baar Dau (Ministry of Truth) suspended high above the city through sheer divine love.',
      'Wrote the 36 Lessons of Vivec as a cosmic riddle and manual of spiritual ascension for the Nerevarine.',
      'Transcendence over gender, time, and moral binaries: warrior and poet, male and female, light and void.'
    ],
    keyAttributes: ['Invulnerability', 'Levitation / Lotus Pose', 'Cosmic Poetry', 'Divine Love', 'Omnipresence'],
    historicalAct: 'Absorbed the divine spark of the Heart of Lorkhan using Kagrenac\'s tools, ascending to the ALMSIVI Tribunal.',
    quote: 'The secret syllable of royalty is CHIM. I am the letter that has not yet been spoken.'
  },
  mortalHalf: {
    title: 'Vehk the Mortal (Man Half)',
    subtitle: 'The Ashen Dunmer, The Netchiman\'s Wife\'s Child, The Flawed Sinner',
    skinTone: 'Ashen Charcoal Blue (Dunmer Curse)',
    colorHex: '#4a5568',
    symbol: 'Ash / The Wounded Heart',
    philosophies: [
      'Remembers being a mortal orphan, a thief, and a wanderer in the alleys of Mournhold.',
      'Bears the heavy, crushing guilt of the Foul Murder of sworn friend and lord Indoril Nerevar.',
      'Understands that stolen godhood is temporary; feels the heartbeat of Lorkhan growing faint.',
      'The "Sitting / Thinking" burden: brooding in silence within his palace while the city beneath him chants his praises.',
      'Bears Azura\'s curse upon his dark half as an honest, agonizing testament of mortality.'
    ],
    keyAttributes: ['Guilt & Melancholy', 'Mortal Regret', 'The Netchiman\'s Memory', 'Fading Power', 'Vulnerability'],
    historicalAct: 'Conspired with Almalexia and Sotha Sil at Red Mountain, striking down Nerevar and choosing to usurp divine power.',
    quote: 'To be a god, each of us had to give up a part of who we were. I keep its wound open so I may remember how to love men.'
  },
  synthesis: {
    title: 'The Dual Lotus: Sitting and Thinking',
    thesis: 'Vivec is neither purely god nor purely mortal—he is the friction between them.',
    description: 'When Vivec hovers in his palace in the lotus pose, the god half performs the cosmic work: holding up the celestial meteor Baar Dau, blessing pilgrims, and weaving the reality of Resdayn. Meanwhile, the mortal half sits inside that same skull, thinking, remembering Nerevar\'s face in death, and preparing for the day the borrowed divinity expires and he must surrender his throne to the Nerevarine.'
  }
};

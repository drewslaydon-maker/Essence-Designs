import { RoleDefinition, RoleId } from '../types';

export const ROLES: Record<RoleId, RoleDefinition> = {
  judge: {
    id: 'judge',
    name: 'Judge',
    faction: 'Town',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700',
    accentColor: '#d97706',
    icon: 'Gavel',
    tagline: 'The Supreme Arbiter of Town Law',
    description: 'Presides over court trials, controls decisive verdicts, and can grant unilateral judicial pardons when justice is in jeopardy.',
    prerogativeLevel: 'Absolute',
    winCondition: 'Eliminate all Outlaws and ensure Town justice prevails.',
    detailedAbilities: [
      {
        id: 'judge_pardon',
        name: 'Judicial Pardon',
        description: 'Pardon the accused currently on the stand, saving them from execution immediately (1 use per match).',
        phase: 'trial',
        charges: 1,
        iconName: 'ShieldAlert'
      },
      {
        id: 'judge_override',
        name: 'Gavel of Inquest',
        description: 'Tie-breaker prerogative: In any hung jury or deadlock, your vote counts as the final binding ruling.',
        phase: 'trial',
        iconName: 'Gavel'
      },
      {
        id: 'judge_emergency',
        name: 'Emergency Court Order',
        description: 'Compel an evasive guest directly onto the witness stand during day proceedings.',
        phase: 'day',
        charges: 1,
        iconName: 'Scroll'
      }
    ],
    spyPartyTells: [
      'Polishes ceremonial bifocals with a silk handkerchief',
      'Taps ivory gavel rhythmically on the mahogany balustrade',
      'Whispers stern inquiries into the court scribe\'s ear'
    ]
  },

  sheriff: {
    id: 'sheriff',
    name: 'Sheriff',
    faction: 'Town',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-700',
    accentColor: '#2563eb',
    icon: 'ShieldCheck',
    tagline: 'The Vigilant Peacekeeper',
    description: 'Interrogates guests under moonlight to discover their lawful or suspicious nature, enforcing civic order.',
    prerogativeLevel: 'High',
    winCondition: 'Identify and execute every Outlaw and menace lurking in the township.',
    detailedAbilities: [
      {
        id: 'sheriff_interrogate',
        name: 'Interrogate Suspect',
        description: 'Visit a guest at night to ascertain if they are Suspicious (Outlaw/Executioner) or Law-Abiding.',
        phase: 'night',
        iconName: 'Eye'
      },
      {
        id: 'sheriff_warrant',
        name: 'Issue Official Warrant',
        description: 'Formally tag a suspect during day discussion, publicizing their suspicious status to all guests.',
        phase: 'day',
        charges: 2,
        iconName: 'FileBadge'
      }
    ],
    spyPartyTells: [
      'Discreetly checks the cylinder of their silver service revolver',
      'Fixes an unblinking gaze upon the ballroom entryway',
      'Notes down pocket-watch sightings in a leather logbook'
    ]
  },

  killer: {
    id: 'killer',
    name: 'Killer',
    faction: 'Outlaw',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700',
    accentColor: '#e11d48',
    icon: 'Skull',
    tagline: 'The Ruthless Shadow in the Manor',
    description: 'Strikes silently in the dark, leaves chilling death notes, and manufactures confusion among the townsfolk.',
    prerogativeLevel: 'High',
    winCondition: 'Eliminate everyone who would stand against you until only outlaws remain.',
    detailedAbilities: [
      {
        id: 'killer_strike',
        name: 'Midnight Strike',
        description: 'Silently assassinate a chosen guest under cover of darkness.',
        phase: 'night',
        iconName: 'Swords'
      },
      {
        id: 'killer_frame',
        name: 'Plant False Evidence',
        description: 'Leave fake mud footprints or a monogrammed button pointing to an innocent guest at the crime scene.',
        phase: 'night',
        charges: 2,
        iconName: 'Footprints'
      },
      {
        id: 'killer_death_note',
        name: 'Death Note',
        description: 'Pen a taunting or misdirecting proclamation discovered beside your victim at dawn.',
        phase: 'night',
        iconName: 'Feather'
      }
    ],
    spyPartyTells: [
      'Glares surreptitiously at the grandfather clock before slipping into shadows',
      'Casually wipes a silver cufflink with unusual intensity',
      'Lingers uncomfortably close to the velvet drapery'
    ]
  },

  executioner: {
    id: 'executioner',
    name: 'Executioner',
    faction: 'Neutral Evil',
    badgeColor: 'bg-stone-200 text-stone-900 border-stone-400 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-600',
    accentColor: '#57534e',
    icon: 'Axe',
    tagline: 'The Bound Harvester of Vendettas',
    description: 'Assigned a specific target at the start of the match. Your sole obsession is seeing them hang from the gallows by civic vote.',
    prerogativeLevel: 'Moderate',
    winCondition: 'Successfully manipulate the town into voting your designated target guilty on the gallows.',
    detailedAbilities: [
      {
        id: 'exe_fabricate',
        name: 'Manufacture Outrage',
        description: 'Sow fierce rumors during discussion, doubling accusation weight against your sworn target.',
        phase: 'day',
        iconName: 'Flame'
      },
      {
        id: 'exe_shroud',
        name: 'Iron Resolve (Passive)',
        description: 'Protected by personal fanaticism: immune to night attacks as long as your sworn quarry lives.',
        phase: 'passive',
        iconName: 'Shield'
      }
    ],
    spyPartyTells: [
      'Stares fixedly at their target\'s neck with subtle nods',
      'Constantly checks an antique pocket watch counting down minutes',
      'Mingles aggressively while whispering pointed allegations'
    ]
  },

  jester: {
    id: 'jester',
    name: 'Jester',
    faction: 'Neutral Chaos',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300 dark:bg-fuchsia-950/80 dark:text-fuchsia-200 dark:border-fuchsia-700',
    accentColor: '#c026d3',
    icon: 'Sparkles',
    tagline: 'The Madcap Architect of Gallows Farce',
    description: 'Yearns for the sweet release of the noose. Act erratic, simulate guilt, and fool the town into executing you.',
    prerogativeLevel: 'Specialized',
    winCondition: 'Get yourself voted onto the stand and condemned to death by the town jury.',
    detailedAbilities: [
      {
        id: 'jester_fidget',
        name: 'Simulate Suspicious Tell',
        description: 'Deliberately trigger a blatant Spy Party tell (e.g. fiddling with the bookcase, sweating) to bait observers.',
        phase: 'day',
        iconName: 'Laugh'
      },
      {
        id: 'jester_haunt',
        name: 'Posthumous Curse (Passive)',
        description: 'If lynched, your vengeful spirit strikes down one random voter who condemned you!',
        phase: 'passive',
        iconName: 'Ghost'
      }
    ],
    spyPartyTells: [
      'Giggles nervously while inspecting the bookcase miniature',
      'Spills a droplet of port wine and quickly dabs it with a sleeve',
      'Gives contradictory answers when asked about the time'
    ]
  },

  prince: {
    id: 'prince',
    name: 'Prince',
    faction: 'Town',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-700',
    accentColor: '#7c3aed',
    icon: 'Crown',
    tagline: 'The Highborn Sovereign',
    description: 'Commands royal immunity against the first lethal assault and wields royal decree to stay executions or veto accusations.',
    prerogativeLevel: 'High',
    winCondition: 'Ensure the sovereign realm is cleansed of traitors and cutthroats.',
    detailedAbilities: [
      {
        id: 'prince_decree',
        name: 'Royal Decree of Veto',
        description: 'Veto a court conviction or stay an execution with royal prerogative (1 use per match).',
        phase: 'trial',
        charges: 1,
        iconName: 'Crown'
      },
      {
        id: 'prince_ward',
        name: 'Royal Bodyguard Ward (Passive)',
        description: 'Sworn guards absorb the first assassination attempt against you.',
        phase: 'passive',
        iconName: 'ShieldCheck'
      },
      {
        id: 'prince_clout',
        name: 'Aristocratic Mandate',
        description: 'Your votes carry double weight during morning accusations.',
        phase: 'day',
        iconName: 'Award'
      }
    ],
    spyPartyTells: [
      'Adjusts velvet doublet embroidered with royal crest',
      'Takes measured sips from a crystal goblet of vintage champagne',
      'Nods politely while discreetly gesturing to their bodyguard'
    ]
  },

  merchant: {
    id: 'merchant',
    name: 'Merchant',
    faction: 'Neutral Barter',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700',
    accentColor: '#059669',
    icon: 'Coins',
    tagline: 'The Purveyor of Rare Intrigue',
    description: 'Barters rare gear, protective charms, and illicit contraband to anyone who can afford their high prices.',
    prerogativeLevel: 'Moderate',
    winCondition: 'Accumulate 200 gold coins through trade, or survive until the end of the turmoil.',
    detailedAbilities: [
      {
        id: 'merchant_shop',
        name: 'Open Black Market',
        description: 'Sell specialized gear (Bulletproof Vests, DNA Scanners, Smoke Bombs, Truth Serum) at dusk.',
        phase: 'dusk',
        iconName: 'ShoppingBag'
      },
      {
        id: 'merchant_bribe',
        name: 'Silk Road Bribe',
        description: 'Pay off a juror or bail out an accused client for a hefty fee.',
        phase: 'trial',
        iconName: 'Coins'
      }
    ],
    spyPartyTells: [
      'Silently counts gold sovereigns inside a velvet pouch',
      'Examines the gem on a guest\'s ring with an expert jeweler\'s loupe',
      'Discreetly adjusts a heavy coat bulging with hidden pockets'
    ]
  },

  lawyer: {
    id: 'lawyer',
    name: 'Lawyer',
    faction: 'Town',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-200 dark:border-indigo-700',
    accentColor: '#4f46e5',
    icon: 'Scale',
    tagline: 'The Counsel for the Accused',
    description: 'Zealously defends the accused (guilty or innocent), shouting objections and presenting forged or genuine alibis to preserve their client.',
    prerogativeLevel: 'High',
    winCondition: 'Successfully defend your designated or chosen client from execution throughout the session.',
    detailedAbilities: [
      {
        id: 'lawyer_objection',
        name: 'Formal Objection!',
        description: 'Interrupt trial proceedings, striking down 2 guilty votes from the jury count.',
        phase: 'trial',
        charges: 2,
        iconName: 'AlertCircle'
      },
      {
        id: 'lawyer_alibi',
        name: 'Fabricate Ironclad Alibi',
        description: 'Present signed affidavits showing the accused was dining in the parlor during the night incident.',
        phase: 'trial',
        charges: 1,
        iconName: 'FileText'
      },
      {
        id: 'lawyer_retainer',
        name: 'Retainer Bond (Passive)',
        description: 'Earn 30 gold whenever your client walks free from the witness stand.',
        phase: 'passive',
        iconName: 'Briefcase'
      }
    ],
    spyPartyTells: [
      'Rapidly riffles through parchment legal briefs while murmuring statutes',
      'Straightens powdered wig and clears throat in lawyerly cadence',
      'Scrutinizes the witness box with fierce, appraising squint'
    ]
  },

  tavern_keeper: {
    id: 'tavern_keeper',
    name: 'Tavern Keeper',
    faction: 'Town',
    badgeColor: 'bg-amber-200 text-amber-950 border-amber-400 dark:bg-amber-900/60 dark:text-amber-100 dark:border-amber-600',
    accentColor: '#d97706',
    icon: 'Beer',
    tagline: 'The Master of Ale & Whispers',
    description: 'Serves hearty drinks that roleblock nocturnal prowlers, while eavesdropping on whispers to pass juicy intel to the town.',
    prerogativeLevel: 'Moderate',
    winCondition: 'Purge the town of killers so peaceful patrons may drink without fear of poisoned flagons.',
    detailedAbilities: [
      {
        id: 'tavern_serve',
        name: 'Serve Hearth Ale',
        description: 'Visit a guest at night to ply them with drinks, preventing them from performing their nocturnal action.',
        phase: 'night',
        iconName: 'GlassWater'
      },
      {
        id: 'tavern_eavesdrop',
        name: 'Eavesdrop Saloon Whispers',
        description: 'Hear drunken confessions, discovering who visited whom or receiving a verified rumor.',
        phase: 'night',
        iconName: 'Ear'
      }
    ],
    spyPartyTells: [
      'Wipes the same pewter flagon repeatedly with an apron',
      'Leans nonchalantly near the corner booth where nobles whisper',
      'Pours a frothing cider with exaggerated showmanship'
    ]
  },

  doctor: {
    id: 'doctor',
    name: 'Doctor',
    faction: 'Town',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/80 dark:text-teal-200 dark:border-teal-700',
    accentColor: '#0d9488',
    icon: 'HeartPulse',
    tagline: 'The Healer of Nocturnal Wounds',
    description: 'Administers nocturnal trauma care and surgical remedies to protect guests from lethal assassination attempts.',
    prerogativeLevel: 'High',
    winCondition: 'Keep townsfolk alive and eradicate the murderous elements.',
    detailedAbilities: [
      {
        id: 'doc_heal',
        name: 'Administer Medical Ward',
        description: 'Visit a guest at night to stitch wounds and administer antidotes, neutralizing fatal attacks.',
        phase: 'night',
        iconName: 'HeartPulse'
      },
      {
        id: 'doc_self',
        name: 'Emergency Self-Triage',
        description: 'Tend to your own wounds tonight, granting yourself complete protection (1 use per match).',
        phase: 'night',
        charges: 1,
        iconName: 'ShieldPlus'
      }
    ],
    spyPartyTells: [
      'Smells distinctly of tincture of iodine and dried lavender',
      'Checks the clasps on their leather medical satchel discreetly',
      'Subtly observes the breathing and pulse rates of nearby diners'
    ]
  },

  detective: {
    id: 'detective',
    name: 'Detective',
    faction: 'Town',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-200 dark:border-cyan-700',
    accentColor: '#0891b2',
    icon: 'Search',
    tagline: 'The Forensic Truth-Seeker',
    description: 'Possesses the highest prerogative and absolute forensic certainty. Conducts autopsies, traces footprints, and scans ballistic DNA.',
    prerogativeLevel: 'Absolute',
    winCondition: 'Uncover the forensic truth of every murder and bring the perpetrators to justice.',
    detailedAbilities: [
      {
        id: 'det_autopsy',
        name: 'Forensic Inquest',
        description: 'Inspect a fresh corpse with 100% certainty: uncovers murder weapon, estimated time, and DNA matches of recent visitors.',
        phase: 'dawn',
        iconName: 'Microscope'
      },
      {
        id: 'det_track',
        name: 'Tail Suspect Footsteps',
        description: 'Shadow a living guest overnight to see exactly whose bedchamber they visited.',
        phase: 'night',
        iconName: 'Footprints'
      },
      {
        id: 'det_deduction',
        name: 'Deductive Interrogation',
        description: 'Confront a suspect with undeniable evidence, locking in verified facts into the town record.',
        phase: 'day',
        charges: 2,
        iconName: 'FileCheck'
      }
    ],
    spyPartyTells: [
      'Examines floorboards with a brass magnifying glass',
      'Dusts mantelpieces with charcoal powder for latent prints',
      'Cross-references shoe impressions with mud patterns near the gate'
    ]
  },

  cook: {
    id: 'cook',
    name: 'Cook',
    faction: 'Artisan & Flavor',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/80 dark:text-orange-200 dark:border-orange-700',
    accentColor: '#ea580c',
    icon: 'Soup',
    tagline: 'The Master of Culinary Intrigue',
    description: 'Prepares feasts and fortifying broth that grants temporary vitality, and notes who avoided tasting the night banquet.',
    prerogativeLevel: 'Specialized',
    winCondition: 'Help the township survive so royal feasts continue uninterrupted.',
    detailedAbilities: [
      {
        id: 'cook_broth',
        name: 'Fortifying Bone Broth',
        description: 'Serve an energizing broth to a guest, giving them a protective resilience against one strike tonight.',
        phase: 'dusk',
        charges: 2,
        iconName: 'Soup'
      },
      {
        id: 'cook_truth_serum',
        name: 'Peppery Truth Stew',
        description: 'Spice a guest\'s bowl with botanical extract, compelling them to reveal one verified truth tomorrow.',
        phase: 'dusk',
        charges: 1,
        iconName: 'Flame'
      }
    ],
    spyPartyTells: [
      'Tastes a wooden spoonful of sauce and murmurs about rosemary',
      'Wipes flour off apron while scrutinizing who did not finish dinner',
      'Discreetly locks the spice cabinet containing nightshade roots'
    ]
  },

  artist: {
    id: 'artist',
    name: 'Artist',
    faction: 'Artisan & Flavor',
    badgeColor: 'bg-pink-100 text-pink-900 border-pink-300 dark:bg-pink-950/80 dark:text-pink-200 dark:border-pink-700',
    accentColor: '#db2777',
    icon: 'Palette',
    tagline: 'The Observer of Human Tells',
    description: 'Sketches portraits of guests, exposing hidden facial twitches, nervous fidgeting, and Spy Party behavioral tells.',
    prerogativeLevel: 'Specialized',
    winCondition: 'Capture the truth in portraiture and witness the fall of the deceivers.',
    detailedAbilities: [
      {
        id: 'artist_sketch',
        name: 'Charcoal Tell Portrait',
        description: 'Study a guest to uncover their secret behavioral tell and determine if they acted suspiciously today.',
        phase: 'day',
        iconName: 'Palette'
      },
      {
        id: 'artist_expose',
        name: 'Town Square Gallery',
        description: 'Publicly unveil a sketch exposing a guest\'s nervous habit to the entire court, swaying opinion.',
        phase: 'day',
        charges: 1,
        iconName: 'Sparkles'
      }
    ],
    spyPartyTells: [
      'Squints with thumb extended to measure a suspect\'s facial proportions',
      'Dabs burnt sienna pigment onto a charcoal sketchpad',
      'Lingers before the grand portrait gallery pretending to study brushstrokes'
    ]
  },

  musician: {
    id: 'musician',
    name: 'Musician',
    faction: 'Artisan & Flavor',
    badgeColor: 'bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-950/80 dark:text-violet-200 dark:border-violet-700',
    accentColor: '#8b5cf6',
    icon: 'Music',
    tagline: 'The Virtuoso of Sonic Diversions',
    description: 'Plays hypnotic melodies that mask nighttime movements, and possesses acute hearing that detects distant squeaking floorboards.',
    prerogativeLevel: 'Specialized',
    winCondition: 'Restore harmony to the troubled estate and triumph with the peaceful town.',
    detailedAbilities: [
      {
        id: 'musician_divert',
        name: 'Ballroom Crescendo',
        description: 'Play a dramatic nocturne that drowns out footfalls, giving all night targets a 40% evasion chance.',
        phase: 'dusk',
        charges: 2,
        iconName: 'Music'
      },
      {
        id: 'musician_listen',
        name: 'Acoustic Eavesdrop',
        description: 'Tune your lute to detect the wing of the estate where violence is being plotted tonight.',
        phase: 'night',
        iconName: 'Volume2'
      }
    ],
    spyPartyTells: [
      'Tension-tunes the silver strings of a baroque lute',
      'Taps polished shoes in syncopated tempo while scanning the guests',
      'Hums an eerie minor chord while pacing beside the conservatory'
    ]
  },

  gambler: {
    id: 'gambler',
    name: 'Gambler',
    faction: 'Artisan & Flavor',
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-950/80 dark:text-yellow-200 dark:border-yellow-700',
    accentColor: '#ca8a04',
    icon: 'Dices',
    tagline: 'The Master of High-Stakes Chaos',
    description: 'Wagers coins on trials and survivals, and rolls charmed d20 dice that trigger wondrous luck or dangerous chaos.',
    prerogativeLevel: 'Specialized',
    winCondition: 'Win at least 2 high-stakes wagers or finish the game with the richest purse.',
    detailedAbilities: [
      {
        id: 'gambler_wager',
        name: 'Place High-Stakes Bet',
        description: 'Wager 20 coins on who will be brought to trial tomorrow. Correct prediction awards 60 coins!',
        phase: 'dusk',
        iconName: 'Coins'
      },
      {
        id: 'gambler_dice',
        name: 'Roll Charmed d20',
        description: 'Roll the lucky die on a player: 15-20 grants miracle shield, 2-14 grants 15 coins, 1 triggers wild commotion!',
        phase: 'night',
        iconName: 'Dices'
      }
    ],
    spyPartyTells: [
      'Flips a heavy brass gambling token between deft knuckles',
      'Rolls a pair of carved ivory dice across the card table',
      'Smirks knowingly while observing the anxious sweat on a noble\'s brow'
    ]
  }
};

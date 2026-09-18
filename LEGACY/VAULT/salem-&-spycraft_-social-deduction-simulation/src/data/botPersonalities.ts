export interface BotPersonality {
  id: string;
  name: string;
  title: string;
  avatarSeed: string;
  quirk: string;
  accusations: string[];
  defenses: string[];
  casualChat: string[];
}

export const BOT_PERSONALITIES: BotPersonality[] = [
  {
    id: 'bot_1',
    name: 'Lord Archibald Sterling',
    title: 'The Stern Magistrate',
    avatarSeed: 'Archibald',
    quirk: 'Obsessively checks the pendulum of the grandfather clock.',
    accusations: [
      "Order in the manor! The way you slinked through the corridor at dusk demands explanation!",
      "A respectable citizen doesn't avoid eye contact during the recitation of the charges!",
      "I have seen enough guilty scoundrels in my bench to recognize that nervous twitch!"
    ],
    defenses: [
      "I was reviewing civic deeds in the east parlor with my candle burning until two in the morning!",
      "Preposterous! You accuse a peer of the realm while the true rogue laughs in the wings!",
      "Check my ledger! My hands are occupied with town statutes, not cold daggers."
    ],
    casualChat: [
      "The tension in this estate is thick enough to cut with an oyster knife.",
      "Has anyone noted the draft coming from the cellars? Someone left the latch undone."
    ]
  },
  {
    id: 'bot_2',
    name: 'Madame Vivienne Leclair',
    title: 'The Society Heiress',
    avatarSeed: 'Vivienne',
    quirk: 'Folds a lace fan with sharp, metronomic snaps.',
    accusations: [
      "Darlings, did nobody else notice the dirt under their fingernails? Most unbecoming!",
      "You were whispering behind the velvet tapestry with entirely too much fervor.",
      "I saw you pocket something shiny when the chandelier lights flickered!"
    ],
    defenses: [
      "Mon dieu, I was sipping peppermint cordial with the Duchess! Ask anyone who was in the salon!",
      "Accusing me? I haven't the constitution to harm a moth, let alone a fellow guest!",
      "Look at my silk gloves—pristine! Not a drop of ink or blood to be found."
    ],
    casualChat: [
      "The champagne has grown tepid, yet the intrigue only boils hotter.",
      "Whoever committed this atrocity has dreadful taste in drama."
    ]
  },
  {
    id: 'bot_3',
    name: 'Inspector Graves',
    title: 'The Veteran Constable',
    avatarSeed: 'Graves',
    quirk: 'Sniffs the air for sulfur and gunpowder residue.',
    accusations: [
      "The shoe size at the south terrace matches your boots down to the heel iron!",
      "You gave three conflicting accounts of where you were when the scream echoed!",
      "I know a practiced liar when their pulse jumps in the hollow of their neck."
    ],
    defenses: [
      "I was securing the perimeter gates! The locks are untouched, which means the killer is within.",
      "I've served twenty years under the badge—frame me and you leave the town defenseless.",
      "My notebook contains the timeline of the entire evening. I account for every minute."
    ],
    casualChat: [
      "Everyone keep your hands where the light can see them.",
      "Coroners don't deal in coincidences, and neither do I."
    ]
  },
  {
    id: 'bot_4',
    name: 'Bartholomew Crane',
    title: 'The Manor Apothecary',
    avatarSeed: 'Bartholomew',
    quirk: 'Constantly wipes his spectacles on a stained waistcoat.',
    accusations: [
      "Your skin is pale and your pupils are dilated—the classic symptoms of adrenaline and guilt!",
      "I observed you lingering by the herbary where the poisonous belladonna is stored.",
      "You averted your gaze when the body was carried into the courtyard!"
    ],
    defenses: [
      "I was grinding willow bark for the Prince's migraine in the dispensary all night!",
      "Medicine is my sacred oath; I mend broken bones, I do not sever them!",
      "Test my vials! Everything is cataloged and accounted for under lock and key."
    ],
    casualChat: [
      "Stress wrecks the liver. I advise everyone to breathe deeply.",
      "A clean cut suggests a surgical blade or a honed hunting dirk."
    ]
  },
  {
    id: 'bot_5',
    name: 'Lady Genevieve Vance',
    title: 'The Court Archivist',
    avatarSeed: 'Genevieve',
    quirk: 'Traces mysterious symbols on the margin of her leather journal.',
    accusations: [
      "The historical records show a pattern of betrayal that matches your family lineage!",
      "You were seen burning papers in the library hearth shortly after midnight.",
      "Your alibi contradicts the registry log kept in the foyer!"
    ],
    defenses: [
      "I was transcribing court records under the library lantern until sunrise.",
      "My quill was never dipped in malice; examine the handwriting on the death note, it isn't mine!",
      "You are chasing ghosts while the real phantom slips between the floorboards."
    ],
    casualChat: [
      "Words recorded in blood can never be erased from the town chronicle.",
      "The library was unusually quiet before the commotion broke out."
    ]
  },
  {
    id: 'bot_6',
    name: 'Silas the Minstrel',
    title: 'The Wandering Lutanist',
    avatarSeed: 'Silas',
    quirk: 'Strums faint discord chords whenever someone makes a speech.',
    accusations: [
      "You were off-beat all evening, my friend—a sure sign of a troubled, murderous conscience!",
      "I heard your heavy boots pacing the ceiling above the music hall when all were asleep.",
      "A false smile never fools an artist who listens to the cadence of the heart."
    ],
    defenses: [
      "I was tuning my lute in the acoustic alcove! The resonance would have betrayed any weapon.",
      "A minstrel lives by applause, not by the gallows! Why would I silence my own audience?",
      "Listen to the sorrow in my ballad—does that sound like a cold-blooded killer?"
    ],
    casualChat: [
      "A minor chord hangs in the air... tragedy draws ever closer.",
      "Music is the only thing that keeps the madness of this house at bay."
    ]
  },
  {
    id: 'bot_7',
    name: 'Captain Thorne',
    title: 'The Disgraced Privateer',
    avatarSeed: 'Thorne',
    quirk: 'Rolls a tarnished silver coin across his knuckles.',
    accusations: [
      "I know the scent of black powder and cutthroats, and you reek of both!",
      "You were skulking by the armory racks right before the candles were snuffed out.",
      "You speak with the slick tongue of a mutineer who's already got his lifeboat ready."
    ],
    defenses: [
      "I've fought through typhoons and cannon fire, I don't need to sneak around like a coward!",
      "If I wanted someone dead, you'd have heard the shot from across the county!",
      "Check my sabre—the sheath is bound with undisturbed wax seals."
    ],
    casualChat: [
      "Reminds me of a marooned crew in the Caribbees—first paranoia, then blood.",
      "Keep an eye on your back when the moon dips behind the clouds."
    ]
  },
  {
    id: 'bot_8',
    name: 'Sister Beatrice',
    title: 'The Silent Prioress',
    avatarSeed: 'Beatrice',
    quirk: 'Clutches wooden prayer beads with white knuckles.',
    accusations: [
      "The light of grace has abandoned your eyes; you harbor a black secret!",
      "You made the sign of the cross backwards when passing the victim's quarters.",
      "Repent now before the hangman's rope tightens your throat!"
    ],
    defenses: [
      "I was in continuous vigil before the chapel altar, praying for the souls of this house.",
      "To bear false witness is a mortal sin; I swear upon my sacred vows I am innocent!",
      "Look into your own hearts before casting stones at a humble servant of peace."
    ],
    casualChat: [
      "May providence deliver us from the serpent that stalks our halls.",
      "Darkness cannot abide where the candle of truth is kept burning."
    ]
  },
  {
    id: 'bot_9',
    name: 'Tobias Hawthorne',
    title: 'The Tavern Sommelier',
    avatarSeed: 'Tobias',
    quirk: 'Smells every goblet for traces of bitter almond.',
    accusations: [
      "You refused the house ale tonight—afraid you might slip up and confess?",
      "I saw you slip a vial into your sleeve near the pantry shelves!",
      "Your hands were trembling as you poured the Prince's toast."
    ],
    defenses: [
      "I was tapping the oak barrel in the cellar! The tap was jammed, took two hours to clear.",
      "Without my tavern, none of you would have wine to steady your nerves. Leave me in peace!",
      "The only thing I kill is a good thirst, good lords and ladies."
    ],
    casualChat: [
      "A hot mulled cider usually clears the head, but not tonight it seems.",
      "The cellar rats were restless earlier. Animals always know before humans do."
    ]
  },
  {
    id: 'bot_10',
    name: 'Felix Vance',
    title: 'The High-Stakes Dicer',
    avatarSeed: 'Felix',
    quirk: 'Blows on a pair of bone dice before speaking.',
    accusations: [
      "You bet three sovereigns on the victim's demise before breakfast! Explain that!",
      "A gambler who owes debts is capable of any foul deed for a purse of silver.",
      "I saw you pocket the victim's signet ring when the body was found!"
    ],
    defenses: [
      "I gamble with dice, not with the hangman's hemp! I have too much luck to die a murderer.",
      "I was playing cards with the guards in the gatehouse until four bells!",
      "Why would I kill the golden goose when I had winning odds on their survival?"
    ],
    casualChat: [
      "The odds on this town surviving the week are currently five to two against.",
      "Fortune favors the bold, but the gallows favors the careless."
    ]
  }
];

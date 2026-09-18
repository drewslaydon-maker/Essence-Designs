import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Crown, 
  Flame, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  Radio, 
  Volume2, 
  Compass, 
  Key, 
  Skull,
  Eye,
  Crosshair,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface StoryChapter {
  id: string;
  actNumber: string;
  title: string;
  location: string;
  year: string;
  summary: string;
  narrative: string;
  gameplayBeat: string;
  loreSecret: string;
  oblivionEcho: {
    dialogue: string;
    context: string;
  };
  keyArtifacts: string[];
}

interface MorrowindChronicleProps {
  onOpenEntity?: (id: string) => void;
}

export function MorrowindChronicle({ onOpenEntity }: MorrowindChronicleProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('act1');
  const [expandedEcho, setExpandedEcho] = useState<boolean>(true);

  const chapters: StoryChapter[] = [
    {
      id: 'act1',
      actNumber: 'Act I',
      title: 'Arrival in Chains at Seyda Neen',
      location: 'Seyda Neen & Balmora (Bitter Coast)',
      year: '3E 427 (Exactly 6 years before Oblivion)',
      summary: 'You awaken as an unnamed prisoner aboard an Imperial prison galleon, with no memory of your ancestry, guided only by a mysterious prophecy.',
      narrative: `Just like you started in the prison sewer in Oblivion, the story of Morrowind begins in dark iron chains. A Dunmer prisoner named Jiub wakes you: "Wake up, we're here. Why are you shaking? Not even last night's storm could wake you."

You are escorted off the ship into the rain-slicked fishing village of Seyda Neen, where a massive two-story insect with hollowed passenger shells—a Silt Strider—bellows in the fog. 

The Imperial Census Office releases you on the direct personal orders of Emperor Uriel Septim VII (the exact same Emperor who gives you the Amulet of Kings in Oblivion!). He gives you sealed orders and a package addressed to Caius Cosades, an old spymaster living undercover in a dingy townhouse in Balmora. Caius takes one look at you, shirtless and smoking moon sugar, and reveals why the Emperor chose you: you fit the ancient Ashlander omens of a prophesied savior known as the Nerevarine.`,
      gameplayBeat: 'Stepping off the prison boat with a lockpick and 20 gold, hearing the unforgettable hollow roar of the Silt Strider for the first time.',
      loreSecret: 'Emperor Uriel Septim VII was a visionary mystic who spent his reign secretly studying prophecies so the Empire could manipulate provincial religious heroes to keep the provinces compliant.',
      oblivionEcho: {
        dialogue: '"They say the prison ships arriving in Vvardenfell carried a stranger born of uncertain parents under a moon-and-star..."',
        context: 'Citizens in the Imperial City talking about how rumors of your arrival in Morrowind had reached Cyrodiil years ago.'
      },
      keyArtifacts: ['Census Release Papers', 'Package for Caius Cosades']
    },
    {
      id: 'act2',
      actNumber: 'Act II',
      title: 'The Seven Trials & Moon-and-Star',
      location: 'The Ashlander Wastes & The Cavern of the Incarnate',
      year: '3E 427',
      summary: 'You leave the settled towns to venture into the hostile ash wastelands, seeking the nomadic Ashlanders who never stopped revering Nerevar.',
      narrative: `While the rich Great Houses of Morrowind worship the Tribunal (Vivec, Almalexia, Sotha Sil) as living gods, the nomadic Ashlander tribes who live in tents in the volcanic ashstorms remember the truth: the Tribunal betrayed and murdered their sworn lord Nerevar.

To fulfill the Seven Trials of the Seven Visions, you journey into the Valley of the Wind to find the hidden Cavern of the Incarnate. Inside, statues of past failed reincarnations whisper their regrets. There, Azura, Queen of Dusk and Dawn, appears and grants you the sacred ring: **One-Clan-Under-Moon-and-Star**.

Forged by the ancient Dwemer for Nerevar himself, this enchanted ring bears a terrifying curse: any mortal who slips it onto their finger dies in agonizing convulsions—UNLESS they are the genuine reincarnation of Indoril Nerevar. You slide the ring onto your finger. It fits without pain. At that moment, you cease to be a nameless prisoner. You are the Nerevarine.`,
      gameplayBeat: 'Equipping the legendary ring Moon-and-Star in the quiet cavern while the ghosts of past failures cheer for you.',
      loreSecret: 'Moon-and-Star is the ultimate physical proof of destiny in the lore. Unlike modern games where anyone can be the hero, in Morrowind you literally had to survive a lethal divine authentication check!',
      oblivionEcho: {
        dialogue: '"The Nerevarine united the Great Houses and the nomad tribes under the banner of the Moon-and-Star..."',
        context: 'High-class Dunmer nobles in Cyrodiil reminiscing on how impossible it was to get the rival Great Houses to agree on anything.'
      },
      keyArtifacts: ['Ring of Moon-and-Star', 'Ashlander Urshilaku Bone', 'Prophecy of the Seven Trials']
    },
    {
      id: 'act3',
      actNumber: 'Act III',
      title: 'The Blight & The 4,000-Year-Old Wizard',
      location: 'Tel Fyr & The Corpratarium (Azura\'s Coast)',
      year: '3E 427',
      summary: 'Infected by the terrifying divine plague Corprus, you seek out Tamriel\'s most eccentric immortal sorcerer and the last surviving Dwemer.',
      narrative: `As Dagoth Ur\'s power spreads from Red Mountain, he unleashes the Corprus disease—the "Divine Disease." Victims slowly grow grotesque tumors, lose their sanity, and transform into immortal ash monsters. During a raid on an ash fortress, you contract Corprus yourself.

Desperate, Caius Cosades sends you to **Divayth Fyr**, a 4,000-year-old Telvanni sorcerer who lives in a gigantic hollowed-out magical mushroom tower. Divayth Fyr is so bored of ordinary reality that he cloned four female versions of himself to serve as his daughters/wives, and runs a sanctuary beneath his mushroom called the Corpratarium.

Deep inside the Corpratarium lives **Yagrum Bagarn**, the bloated, spider-legged LAST LIVING DWARF (Dwemer) in all of Tamriel, who only survived the vanishing of his race because he was traveling in an alternate dimension when Kagrenac struck the Heart!

Divayth Fyr tests a theoretical cure on you. The potion burns away the agonizing tumors and madness of Corprus, but preserves its divine gifts: **you become completely immune to all diseases and will never age a single day for the rest of eternity.**`,
      gameplayBeat: 'Exploring Tel Fyr, floating up vertical levitation shafts, and talking to the last surviving steampunk dwarf.',
      loreSecret: 'Being biologically immortal is why your character in Morrowind is still alive somewhere out in the universe during Oblivion and Skyrim!',
      oblivionEcho: {
        dialogue: '"They say the Champion of Morrowind was immune to all diseases, touched by the ancient blight yet walking untouched..."',
        context: 'Chapel healers in Cyrodiil marveling at the biological mystery of the Nerevarine.'
      },
      keyArtifacts: ['Dwemer Boots of Flying', 'Divayth Fyr\'s Experimental Brew']
    },
    {
      id: 'act4',
      actNumber: 'Act IV',
      title: 'Audience with Lord Vivec: The Sinner\'s Plea',
      location: 'The High Fane, Palace of Vivec',
      year: '3E 427',
      summary: 'The living god invites you into his inner sanctuary. Instead of fighting you, he bows before his murdered friend and hands you the plan to end his own godhood.',
      narrative: `Now acknowledged as Hortator by the Great Houses and Nerevarine by the Ashlanders, the Temple can no longer brand you a heretic. Lord Vivec himself sends a private courier inviting you to his palace in the southern cantons.

You walk through the brass doors and see the Warrior-Poet hovering in his iconic lotus pose: half golden Chimer, half ashen Dunmer. 

This is the most powerful emotional moment in the franchise. Vivec does not deny his crimes. He frankly admits that thousands of years ago, he, Almalexia, and Sotha Sil murdered you (Nerevar) at Red Mountain to steal godhood from the Heart of Lorkhan. But now, Dagoth Ur has grown too powerful, cutting the Tribunal off from the Heart. 

Vivec gives you **Wraithguard**, the Dwemer gauntlet built by Kagrenac, and teaches you the secret tonal frequencies needed to destroy the enchantments on the Heart. He knows that by helping you destroy the Heart, his own stolen godhood will evaporate and his people will move past him. He accepts his obsolescence with serene poetic grace.`,
      gameplayBeat: 'Standing two feet away from a literal living god, holding dialogue options where you can ask him why he murdered you, and receiving his holy blessing.',
      loreSecret: 'Vivec wrote the 36 Lessons specifically for you, the player, as a manual to help you surpass him and achieve the spiritual state of CHIM.',
      oblivionEcho: {
        dialogue: '"In Morrowind, they say the Tribunal gods have vanished... Lord Vivec has not been seen in his palace for years..."',
        context: 'Priests of the Nine in the Imperial City discussing the mysterious collapse of the Morrowind state religion.'
      },
      keyArtifacts: ['Wraithguard (The Dwemer Gauntlet)', 'Plan to Defeat Dagoth Ur']
    },
    {
      id: 'act5',
      actNumber: 'Act V',
      title: 'The Assault on Red Mountain & Dagoth Ur',
      location: 'The Heart Chamber, Red Mountain Crater',
      year: '3E 427',
      summary: 'Equipped with Kagrenac\'s legendary tonal tools, you cross into the volcanic storm to strike the Heart of Lorkhan.',
      narrative: `You pass through the magical barrier of the Ghostfence and ascend the ash-choked slopes of the volcano into Dagoth Ur\'s subterranean citadel. 

Along the way, you retrieve the two other legendary Dwemer tools:
- **Sunder**: The enchanted volcanic hammer.
- **Keening**: The singing tonal glass-blade dagger.

You descend into the cavernous Heart Chamber. Looming above you is **Akulakhan**, a monstrous brass mechanical god Dagoth Ur has been building out of infected corprus flesh and Dwemer metal!

Dagoth Ur greets you with tragic, intoxicated familiarity: *"Welcome, Moon-and-Star. I have prepared a place for you... Come, look upon the Heart."*

You don't fight Dagoth Ur with brute force—he is completely invulnerable while linked to the Heart! Instead, while dodging his spells, you don Wraithguard, strike the Heart of Lorkhan once with Sunder to tune its divine frequency, and then strike it repeatedly with Keening. 

The tonal bindings shatter. The Heart of Lorkhan disappears from mortal reality with a ringing celestial hum. Stripped of his divine battery, Dagoth Ur withers and turns to ash before your eyes. Akulakhan collapses into rubble. Azura appears in a shower of dawn-light, thanking you for avenging Nerevar and freeing the Dunmer people from false gods.`,
      gameplayBeat: 'Equipping Sunder and Keening, hearing the metallic chime as you strike the floating pulsing Heart of Lorkhan, saving Tamriel.',
      loreSecret: 'When the Heart of Lorkhan was unbound, it wasn\'t destroyed (gods cannot be destroyed); its divine presence simply returned to the Aurbic void.',
      oblivionEcho: {
        dialogue: '"The Red Mountain has fallen silent. The blight storms are gone, and the skies over Vvardenfell are clear blue for the first time in centuries."',
        context: 'Imperial Legion scouts stationed along the Cyrodiil border reporting the miracle of your victory.'
      },
      keyArtifacts: ['Sunder (The Hammer)', 'Keening (The Dagger)', 'The Heart of Lorkhan (Unbound)']
    },
    {
      id: 'act6',
      actNumber: 'Act VI',
      title: 'The Echo Across Eras: What Happened to You?',
      location: 'The Expedition to Akavir & The Streets of the Imperial City',
      year: '3E 427 to 3E 433 (Current Oblivion Year!)',
      summary: 'After saving Morrowind, you vanish into legend—leaving ripples that the citizens in your wife\'s Oblivion game talk about constantly.',
      narrative: `With Dagoth Ur defeated, the Tribunal\'s divinity gone, and the Dunmer freed, the Nerevarine had nothing left to prove. Because of the Corprus cure, you do not age and cannot fall ill. 

Historical records and rumors report that shortly after the events of Morrowind, the Nerevarine sailed east on an expedition to the mysterious, untouched dragon continent of **Akavir**—never to be seen again in recorded imperial history.

Now, fast forward just 6 years to 3E 433: the exact year your wife is playing right now in the Imperial City! 

Every time she overhears two guards or citizens in the Market District talking about:
- *"The Nerevarine sailing to Akavir"*
- *"Saint Jiub driving out all the flying Cliff Racers"*
- *"The collapse of the Tribunal temples in Vvardenfell"*
- *"The mysterious disappearance of Lord Vivec"*

**That is talking about HER future self.** She hasn't lived those memories yet, but the entire world of Cyrodiil is still reeling from the shockwaves of what she accomplished in the east.`,
      gameplayBeat: 'Hearing random NPC dialogue on the streets of the Imperial City and suddenly realizing they are talking about your own legendary character.',
      loreSecret: 'Saint Jiub—the first friendly prisoner on the boat who woke you up in Seyda Neen—became so beloved for wiping out Morrowind\'s flying cliff racers that the Imperial Temple canonized him as an official saint before he died in Kvatch!',
      oblivionEcho: {
        dialogue: '"Did you hear? Saint Jiub was canonized by the Temple for driving the cliff racers from Vvardenfell! He\'s an Imperial hero now."',
        context: 'Street rumors in Oblivion celebrating your boat buddy Jiub from the opening seconds of Morrowind!'
      },
      keyArtifacts: ['Expedition Log to Akavir', 'Statue of Saint Jiub']
    }
  ];

  const currentChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];

  return (
    <div className="space-y-8" id="morrowind-chronicle-section">
      {/* Warm Dedicated Header */}
      <div className="rounded-2xl border border-[#c8983e]/40 bg-gradient-to-r from-[#1c1810] via-[#15141d] to-[#121420] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#c8983e]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#3b82f6]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#c8983e]/20 text-[#eac368] border border-[#c8983e]/40">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            A Gift into My World of Passion // The Story of Morrowind
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#f8f5ee] tracking-wide">
            The Nerevarine Chronicles: In Order, For You
          </h1>
          <p className="text-sm sm:text-base text-[#c5c0b4] max-w-3xl leading-relaxed">
            While you are exploring the sunny cobblestones of the Imperial City in <em>Oblivion</em>, 
            NPCs whisper rumors about the hero of Morrowind. <strong className="text-[#eac368]">That hero is you</strong>. 
            Here is the full chronological story of the game that shaped 15 years of my life—so every tavern rumor you hear in Cyrodiil connects with profound meaning.
          </p>
        </div>
      </div>

      {/* Story Acts Navigator (Timeline Ribbon) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {chapters.map((ch, idx) => {
          const isSelected = ch.id === selectedChapterId;
          return (
            <button
              key={ch.id}
              onClick={() => setSelectedChapterId(ch.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                isSelected
                  ? 'bg-[#221f29] border-[#c8983e] shadow-lg text-[#f8f5ee]'
                  : 'bg-[#13141c] border-[#252838] text-[#8c887e] hover:bg-[#181a24] hover:text-[#e2ded5]'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                isSelected ? 'bg-[#c8983e] text-[#121008]' : 'bg-[#1e2130] text-[#8c887e]'
              }`}>
                {idx + 1}
              </div>
              <div>
                <div className="text-xs font-mono font-bold uppercase text-[#c8983e]">
                  {ch.actNumber}
                </div>
                <div className="text-xs font-serif font-bold text-[#f4efe6] truncate max-w-[150px] sm:max-w-[180px]">
                  {ch.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chapter Content Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Narrative & Experience (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-[#312b20] bg-[#14141c] p-6 sm:p-8 space-y-6 shadow-xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#252838] gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#c8983e]">
                {currentChapter.actNumber} // {currentChapter.year}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f8f5ee] mt-1">
                {currentChapter.title}
              </h2>
              <p className="text-xs text-[#94a3b8] flex items-center gap-1.5 mt-1">
                <Compass className="w-3.5 h-3.5 text-[#3b82f6]" />
                {currentChapter.location}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentChapter.keyArtifacts.map((art) => (
                <button
                  key={art}
                  onClick={() => {
                    if (onOpenEntity) {
                      if (art.includes('Moon-and-Star')) onOpenEntity('moon_and_star');
                      else if (art.includes('Kagrenac') || art.includes('Keening') || art.includes('Sunder') || art.includes('Wraithguard')) onOpenEntity('kagrenacs_tools');
                      else if (art.includes('Heart')) onOpenEntity('literal_cosmology');
                      else onOpenEntity('vivec');
                    }
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#1f1d16] text-[#eac368] border border-[#3d341e] hover:bg-[#c8983e] hover:text-[#121008] transition-all flex items-center gap-1 cursor-pointer"
                  title="Inspect Artifact Dossier"
                >
                  <span>{art}</span>
                  <Sparkles className="w-3 h-3 text-[#c8983e]" />
                </button>
              ))}
            </div>
          </div>

          {/* Core Narrative Body */}
          <div className="text-sm sm:text-base text-[#d8d3c7] leading-relaxed space-y-4 whitespace-pre-line font-sans">
            {currentChapter.narrative}
          </div>

          {/* Gameplay Memory Beat */}
          <div className="rounded-xl border border-[#3a3528] bg-[#191814] p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#eac368] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono uppercase font-bold text-[#eac368]">
                What That Moment Feels Like in the Game:
              </div>
              <p className="text-xs sm:text-sm text-[#cbd5e1] mt-1 italic">
                "{currentChapter.gameplayBeat}"
              </p>
            </div>
          </div>

          {/* Lore Secret */}
          <div className="rounded-xl border border-[#2b354e] bg-[#121624] p-4 flex items-start gap-3">
            <Key className="w-5 h-5 text-[#60a5fa] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono uppercase font-bold text-[#93c5fd]">
                Husband's 15-Year Lore Secret:
              </div>
              <p className="text-xs sm:text-sm text-[#cbd5e1] mt-1">
                {currentChapter.loreSecret}
              </p>
            </div>
          </div>
        </div>

        {/* Right: The Oblivion Connection Box (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Oblivion Street Rumors Box */}
          <div className="rounded-2xl border border-[#3b82f6]/40 bg-[#121727] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#202c47]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#93c5fd] font-serif">
                <Volume2 className="w-4 h-4 text-[#60a5fa]" />
                What People in Oblivion Say About This
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-[#bfdbfe]">
                Imperial City Rumor
              </span>
            </div>

            <blockquote className="text-sm font-serif italic text-[#e0e7ff] bg-[#182035] p-3.5 rounded-xl border border-[#2b395c] leading-relaxed">
              {currentChapter.oblivionEcho.dialogue}
            </blockquote>

            <div>
              <div className="text-xs font-mono uppercase text-[#94a3b8] mb-1 font-bold">
                Why They Are Talking About You:
              </div>
              <p className="text-xs text-[#cbd5e1] leading-relaxed">
                {currentChapter.oblivionEcho.context}
              </p>
            </div>

            <div className="pt-2 border-t border-[#202c47] text-[11px] text-[#60a5fa] font-serif italic">
              "Every time you hear an Imperial City guard say this while you're sneaking around looting shops, remember: they are talking about your legend!"
            </div>
          </div>

          {/* Quick Cheat Sheet on Key Names */}
          <div className="rounded-2xl border border-[#2e303d] bg-[#14151e] p-5 shadow-lg space-y-3">
            <div className="text-xs font-mono uppercase text-[#eac368] font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Quick Morrowind Cast Recap
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="pb-2 border-b border-[#20222f]">
                <strong className="text-[#f4efe6] block">Nerevar / Nerevarine:</strong>
                <span className="text-[#94a3b8]">The ancient hero reincarnated into you. The only one who can wear the ring Moon-and-Star without dying.</span>
              </div>

              <div className="pb-2 border-b border-[#20222f]">
                <strong className="text-[#eac368] block">Lord Vivec (Vehk):</strong>
                <span className="text-[#94a3b8]">The half-gold, half-ash poet-god who murdered you in the past, but assists you in the present with Wraithguard.</span>
              </div>

              <div className="pb-2 border-b border-[#20222f]">
                <strong className="text-[#f87171] block">Dagoth Ur (Voryn Dagoth):</strong>
                <span className="text-[#94a3b8]">Your ancient loyal general who guarded the Heart, lost his mind to grief, and became an immortal dreaming god beneath the volcano.</span>
              </div>

              <div>
                <strong className="text-[#38bdf8] block">Kagrenac's Tools:</strong>
                <span className="text-[#94a3b8]">Wraithguard (gauntlet), Sunder (hammer), Keening (dagger) used to tune and unbind the Heart of Lorkhan.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Level } from "./types";

export interface EventChoice {
  label: string;
  level: Level;
  effects: {
    entropy?: number;
    systems?: number;
    re?: number;
    salvage?: number;
    morale?: number;
  };
  result: string;
}

export interface Event {
  id: string;
  title: string;
  prompt: string;
  choices: [EventChoice, EventChoice];
}

export const EVENTS: readonly Event[] = [
  {
    id: "debris",
    title: "Drift Debris",
    prompt:
      "Wreckage tumbles past — salvageable, if someone's willing to reach for it.",
    choices: [
      { label: "Log it and let it pass", level: "I", effects: { salvage: 3 }, result: "The crew notes another loss, quietly." },
      { label: "Send someone out for it", level: "III", effects: { salvage: 10, systems: -4 }, result: "They got it. The hull didn't love the maneuver." },
    ],
  },
  {
    id: "signal",
    title: "A Voice in the Static",
    prompt:
      "Comms catch a fragment — another crew, or nothing at all.",
    choices: [
      { label: "Investigate carefully", level: "I", effects: { morale: 5, entropy: 2 }, result: "Nothing conclusive. But it felt good to hope." },
      { label: "Push through, chase it", level: "III", effects: { salvage: 8, re: -5 }, result: "Whatever it was, it cost more to find than it gave back." },
    ],
  },
  {
    id: "argument",
    title: "Argument Below Decks",
    prompt: "Tension boils over between two of the crew.",
    choices: [
      { label: "Mediate, hear them out", level: "I", effects: { morale: 6, entropy: 2 }, result: "It took time. It was worth it." },
      { label: "Pull rank, shut it down", level: "III", effects: { morale: -6 }, result: "Efficient. They won't forget it, though." },
    ],
  },
  {
    id: "hum",
    title: "A Working System",
    prompt: "Something in the machine is humming smoother than it has any right to.",
    choices: [
      { label: "Leave it alone", level: "I", effects: {}, result: "For once, nothing needs fixing." },
      { label: "Push it further", level: "III", effects: { systems: 12, entropy: 6 }, result: "It gave more than it should have. It'll remember the strain." },
    ],
  },
  {
    id: "rationing",
    title: "Rationing",
    prompt: "Supplies read thinner than the log says they should.",
    choices: [
      { label: "Ration evenly", level: "I", effects: { salvage: 3, morale: -3 }, result: "Grim, but fair. Nobody complained out loud." },
      { label: "Break into reserve now", level: "III", effects: { salvage: 9, re: -4 }, result: "The reserve wasn't built to be accessed like that." },
    ],
  },
  {
    id: "quiet_hour",
    title: "A Quiet Hour",
    prompt: "A genuine lull. The crew has real time on their hands.",
    choices: [
      { label: "Let them rest", level: "I", effects: { morale: 8 }, result: "Sleep, mostly. It mattered more than it looked." },
      { label: "Put the time to work", level: "III", effects: { salvage: 6, entropy: 3 }, result: "Productive. Nobody rested." },
    ],
  },
  {
    id: "stowaway",
    title: "Something in the Walls",
    prompt: "A reading that shouldn't exist, somewhere it shouldn't be.",
    choices: [
      { label: "Seal it off, ignore it", level: "I", effects: { entropy: 3 }, result: "Out of sight. It doesn't feel out of mind." },
      { label: "Hunt it down", level: "III", effects: { morale: 6, systems: -6 }, result: "Found it. Cost more to catch than to have left alone." },
    ],
  },
  {
    id: "old_log",
    title: "An Old Log Entry",
    prompt:
 "A recording surfaces from whoever had this post before.",
    choices: [
      { label: "Play it for the crew", level: "I", effects: { morale: 4, entropy: 2 }, result: "Some comfort. Some weight, too." },
      { label: "Delete it, keep moving", level: "III", effects: { entropy: -3 }, result: "Efficient. Nobody asked what was in it." },
    ],
  },
  {
    id: "gift",
    title: "A Working Trade",
    prompt:
      "A chance to offload something for something else entirely.",
    choices: [
      { label: "Take the fair deal", level: "I", effects: { salvage: 4, morale: 2 }, result: "Simple. Nobody regrets simple." },
      { label: "Push for more", level: "III", effects: { salvage: 12, morale: -4 }, result: "Got more. It didn't feel like winning." },
    ],
  },
  {
    id: "malfunction",
    title: "A False Alarm",
    prompt: "Every light on the board goes red at once — then, nothing.",
    choices: [
      { label: "Stand down slowly", level: "I", effects: { morale: 3 }, result: "Nerves settle. Barely." },
      { label: "Force a full diagnostic", level: "III", effects: { entropy: -6, morale: -2 }, result: "Confirmed clean. The checking cost something too." },
    ],
  },
];
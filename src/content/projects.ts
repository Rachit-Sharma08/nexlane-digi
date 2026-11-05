/**
 * Portfolio content. Two strictly separate groups.
 *
 * HONESTY RULES:
 *  - "clientWork" stays EMPTY until we have real clients AND their written
 *    permission. The portfolio page hides this section while it is empty.
 *  - Everything under practice projects must be labelled as practice.
 *  - Only add a project here with a real link and a plain description of
 *    what it is and whose work it is.
 */

export type Project = {
  title: string;
  whatItIs: string;
  role: string; // which team member built it
  tech: string[];
  liveUrl: string; // "" = TODO, card will show "link coming soon"
  repoUrl?: string; // GitHub where available
  status?: "flagged" | "ready"; // flagged = needs permission/confirmation before going live
};

export const practiceProjects: Project[] = [
  {
    title: "Calc Notebook",
    whatItIs:
      "A calculation notebook web app built as a practice project — a place to write and organise formula-based calculations.",
    role: "Neelam Dhiman",
    tech: ["HTML", "CSS", "JavaScript"],
    liveUrl: "",
    status: "ready",
  },
  {
    title: "Fitness Temple",
    whatItIs:
      "A fitness tracking web project built as a practice project — workout logging and progress viewing.",
    role: "Krish Khati",
    tech: ["Web development", "Python"],
    liveUrl: "",
    status: "ready",
  },
  {
    title: "LinguaBridge",
    whatItIs:
      "A language practice/translation web project built as a practice project — helping users bridge languages while learning.",
    role: "Krish Khati",
    tech: ["Web development", "Python"],
    liveUrl: "",
    status: "ready",
  },
  {
    title: "AI Assistant Chatbot",
    whatItIs:
      "An AI assistant chatbot practice project — conversational assistant built to learn AI tooling end to end.",
    role: "Rachit Sharma",
    tech: ["AI tools", "Python"],
    liveUrl: "",
    status: "ready",
  },
  {
    title: "Tagore Global School website",
    whatItIs:
      "A school website practice/learning project. This will only be shown publicly once we have the school's written permission; the live link and exact description are pending that confirmation.",
    role: "Neelam Dhiman",
    tech: ["HTML", "CSS", "JavaScript"],
    liveUrl: "",
    status: "flagged", // TODO: confirm school's permission before publishing publicly
  },
];

/** Hidden on the site while empty. */
export const clientWork: Project[] = [];

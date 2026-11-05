/**
 * Free resources for the Learn section. Everything listed must be free
 * or have a genuinely usable free tier — we teach zero-budget growth.
 */

export type ResourceList = {
  title: string;
  intro: string;
  groups: {
    name: string;
    items: { name: string; note: string }[];
  }[];
};

export const toolLists: ResourceList[] = [
  {
    title: "Free AI tools list",
    intro:
      "A short, honest list of free AI tools we actually use and recommend to students and local businesses. All have usable free tiers at the time of writing — that can change, so always check the tool's own limits before relying on it.",
    groups: [
      {
        name: "Text and writing",
        items: [
          { name: "ChatGPT (free tier)", note: "drafting ads, captions and replies in plain language" },
          { name: "Google Gemini / AI Studio (free tier)", note: "drafting, outlining, quick image ideas" },
          { name: "Perplexity (free tier)", note: "research with sources, so you can verify what you publish" },
        ],
      },
      {
        name: "Design and images",
        items: [
          { name: "Canva (free)", note: "posts, flyers, thumbnails — templates are enough for 80% of the work" },
          { name: "Google Fonts + Font Pairing pages", note: "pick readable fonts, not just pretty ones" },
          { name: "Microsoft Designer (free)", note: "quick social graphics from a text line" },
        ],
      },
      {
        name: "Video and reels",
        items: [
          { name: "CapCut (free tier)", note: "reel editing: captions, cuts, trending audio" },
          { name: "DaVinci Resolve (free)", note: "serious desktop editing, free version is enough to learn on" },
          { name: "OBS Studio (free)", note: "screen recording for tutorials" },
        ],
      },
      {
        name: "SEO / growth checks",
        items: [
          { name: "Google Search Console (free)", note: "what queries already reach you — start here, always" },
          { name: "PageSpeed Insights (free)", note: "is your website actually fast on phones?" },
          { name: "Rich Results Test (free)", note: "does Google see your structured data?" },
        ],
      },
    ],
  },
  {
    title: "Profile-improvement checklist",
    intro:
      "For shops and professionals in Kaithal (and anywhere really): go through each point and tick them off for your Instagram and Google Business Profile.",
    groups: [
      {
        name: "Google Business Profile",
        items: [
          { name: "Claimed and verified", note: "you control it — not someone else" },
          { name: "Same phone number everywhere", note: "one spelling, one number, on every listing — fixes the '4 businesses with the same name' mess" },
          { name: "Specific category", note: "be precise: 'Mobile phone shop', not just 'Shop'" },
          { name: "10+ real photos", note: "counter, products, inside view, staff at work" },
          { name: "Open hours + holiday updates", note: "customers check hours before walking in" },
        ],
      },
      {
        name: "Instagram profile",
        items: [
          { name: "Business/creator account", note: "unlocks insights; make sure insta has it" },
          { name: "Single logo/profile photo", note: "the same mark across Google + Insta builds recognition" },
          { name: "Bio: what + where + how to reach", note: "shop name, city, WhatsApp — in bullet points" },
          { name: "Highlights: products, proof, offers", note: "new customers read highlights first" },
          { name: "Post 2-3x a week, consistently", note: "nothing goes viral overnight — consistency is what shows up" },
        ],
      },
    ],
  },
];

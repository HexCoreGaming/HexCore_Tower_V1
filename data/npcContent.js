// Standardized safe-default NPC dialogue. Do not replace approved legal dialogue.
export const courtyardGuide = {
  "greeting": "Welcome to HexCore Tower. You're in HexCore Gaming's interactive digital headquarters. Feel free to explore or ask me anything about this place.",
  "questions": [
    {
      "question": "Where am I?",
      "answer": "This is HexCore Tower, the playable digital headquarters of HexCore Gaming. You can walk around and speak to our staff instead of navigating only through normal webpages."
    },
    {
      "question": "What is HexCore Gaming?",
      "answer": "HexCore Gaming develops video games and explores its own gaming hardware. Visit the Company & News and Games & Development departments to learn more."
    },
    {
      "question": "What can I do here?",
      "answer": "Explore the courtyard, tour the tower, visit company departments, ask employees questions, and learn about our games and plans. You can also use the separate holographic website without entering this 3D world."
    },
    {
      "question": "How do I enter the tower?",
      "answer": "Follow the illuminated central walkway and approach the front doors. They open automatically, leading into the main lobby."
    },
    {
      "question": "Do I need an account?",
      "answer": "No account or registration is required to explore this single-player website."
    }
  ]
};
export const npcSharedQuestions = [
  {
    "question": "Where are the other departments?",
    "action": "directions"
  },
  {
    "question": "Is there more information available?",
    "answer": "The information available here reflects currently published HexCore material. Future announcements will be added when confirmed."
  }
];
export const npcDepartments = {
  "lobby": {
    "role": "Reception Specialist",
    "greeting": "Welcome to HexCore Tower. I can help you find a department or explain how this headquarters works.",
    "questions": [
      {
        "question": "How do I reach another floor?",
        "action": "directions"
      },
      {
        "question": "Can I explore without an account?",
        "answer": "Yes. The headquarters is a single-player website and requires no account."
      },
      {
        "question": "How do I return to the courtyard?",
        "answer": "Walk through the automatic glass entrance doors at the front of the lobby."
      }
    ]
  },
  "company": {
    "role": "Company Information Specialist",
    "greeting": "Welcome to Company & News. What would you like to know about HexCore Gaming?",
    "questions": [
      {
        "question": "What is HexCore Gaming?",
        "answer": "@description"
      },
      {
        "question": "Where will announcements appear?",
        "answer": "Official announcements will be published here when available."
      },
      {
        "question": "Is more company information coming?",
        "answer": "Yes. Details will be added once they are ready to announce."
      }
    ]
  },
  "games": {
    "role": "Games & Development Specialist",
    "greeting": "Welcome to Games & Development. I can tell you which projects are currently listed.",
    "questions": [
      {
        "question": "Which games are planned?",
        "answer": "@description"
      },
      {
        "question": "Are demos available?",
        "answer": "Game demos and playable arcade experiences will be linked when they are actually available. No release date is being promised here."
      },
      {
        "question": "Where will I find development updates?",
        "answer": "The Games & Development department will feature announced progress, trailers, and other approved updates."
      }
    ]
  },
  "support": {
    "role": "Visitor Support Specialist",
    "greeting": "Welcome to visitor support. How can I direct you?",
    "questions": [
      {
        "question": "How can I contact support?",
        "answer": "@description"
      },
      {
        "question": "Where should I report a problem?",
        "answer": "Use the Support channel in the official HexCore Discord, or email hexcoregaming@proton.me with Support in the subject line."
      },
      {
        "question": "Can you resolve technical problems here?",
        "answer": "This NPC provides information and directions; it is not a live support representative."
      }
    ]
  },
  "legal": {
    "role": "Legal Information Specialist",
    "greeting": "Welcome to Legal & Policies. Approved policy questions are available in the Legal Knowledge Archive.",
    "questions": [
      {
        "question": "Where can I read policy questions?",
        "answer": "Use the Policy Q & A terminal or speak to the individual representatives here. The original approved questions and answers are preserved."
      },
      {
        "question": "Are these legal documents?",
        "answer": "No. Information shown here is not a substitute for formal legal documents."
      }
    ]
  },
  "community": {
    "role": "Community Relations Specialist",
    "greeting": "Welcome to Community & Media. What would you like to know?",
    "questions": [
      {
        "question": "Where can I find the community?",
        "answer": "Official community and media links will appear here as they are published."
      },
      {
        "question": "Can I follow game updates?",
        "answer": "Watch for officially published updates in the Community & Media and Games & Development departments."
      }
    ]
  },
  "business": {
    "role": "Business Relations Specialist",
    "greeting": "Welcome to Careers & Business. How can I help?",
    "questions": [
      {
        "question": "Are there open job listings?",
        "answer": "There are currently no active job listings announced here."
      },
      {
        "question": "Can I discuss partnerships?",
        "answer": "Business and partnership instructions will be provided when HexCore publishes a formal contact process."
      }
    ]
  },
  "hardware": {
    "role": "Hardware & Merchandise Specialist",
    "greeting": "Welcome to Hardware & Merchandise. What interests you?",
    "questions": [
      {
        "question": "What hardware is HexCore developing?",
        "answer": "@description"
      },
      {
        "question": "Can I purchase anything here?",
        "answer": "No hardware or merchandise sales are represented as active in this website build."
      }
    ]
  },
  "admin": {
    "role": "Administrative Staff",
    "greeting": "Welcome to the private office. Some tools are not intended for public use.",
    "questions": [
      {
        "question": "What is this office?",
        "answer": "This is a private administrative workspace for managing site content."
      },
      {
        "question": "Can I publish changes from here?",
        "answer": "Not directly. Local content changes need to be published through the existing GitHub workflow."
      }
    ]
  }
};

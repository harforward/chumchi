# 🥄 Chumchi

**silver spoon energy**

Chumchi is a private family recipe archive — a living, visual tree where handwritten recipes are preserved, organised by family member, and passed down digitally.

---

## What it is

A family recipe platform built around the idea that food is memory. Each family member gets a node on their family tree. Click their name, see their recipes. Upload a photo of a handwritten recipe card and let AI read and format it.

---

## Structure

```
chumchi/
├── index.html              ← Public landing page
├── README.md
├── assets/
│   ├── style.css           ← Design system
│   ├── app.js              ← Shared logic & data
│   └── spoon.svg           ← Brand mark
├── platform/
│   └── login.html          ← Sign in (family / admin / superadmin)
├── admin/
│   ├── dashboard.html      ← Superadmin: all families
│   └── family-admin.html   ← Family admin: manage one tree
└── family/
    ├── tree.html            ← The bubble tree view
    ├── recipe.html          ← Recipe detail (clean + raw)
    └── upload.html          ← Upload & AI parse
```

---

## Deploying on GitHub Pages

1. Create a repository named `chumchi` on GitHub
2. Upload all files maintaining the folder structure above
3. Go to **Settings → Pages → Source: main branch, / (root)**
4. Your site will be live at `https://yourusername.github.io/chumchi/`

---

## Features

- **Family tree** visualised as floating bubbles — one per person
- **Click any bubble** for a highlights panel showing their recipes
- **AI recipe parsing** — photograph a handwritten recipe, Claude reads and formats it
- **Three user tiers**: family member / family admin / superadmin
- **Move recipes** between family members if wrongly sorted
- **Raw source view** — every recipe keeps its original scan notes
- **Add relatives** — expandable tree with + buttons for new members

---

## Tech

- Vanilla HTML, CSS, JavaScript — no frameworks, no build step
- Anthropic Claude API for recipe image parsing
- GitHub Pages for hosting (static)
- Session-based authentication (client-side for demo)

---

## Notes

- Passwords and credentials are managed per-family by the admin
- The AI parser understands Urdu/Hindi ingredient terminology common in South Asian cooking
- Recipes can be reassigned between family members at any time

---

*Built with care. For the families who cook from memory.*

/* ============================================
   CHUMCHI — app.js
   Shared logic, data, auth, utilities
   ============================================ */

// ─── AUTH ────────────────────────────────────
const AUTH = {
  SITE_PWD: 'tree2026',
  SUPER: { user: 'superadmin', pwd: 'admin1' },

  families: {
    rafiq: {
      name: 'Rafiq',
      adminUser: 'rafiq-admin',
      adminPwd:  'rafiq2026',
      memberPwd: 'Rafiq2026',
    }
    // Additional families added here by superadmin
  },

  checkSite() {
    return sessionStorage.getItem('chumchi_site') === 'true';
  },
  setSite() {
    sessionStorage.setItem('chumchi_site', 'true');
  },
  getSession() {
    const s = sessionStorage.getItem('chumchi_session');
    return s ? JSON.parse(s) : null;
  },
  setSession(obj) {
    sessionStorage.setItem('chumchi_session', JSON.stringify(obj));
  },
  clearSession() {
    sessionStorage.removeItem('chumchi_session');
    sessionStorage.removeItem('chumchi_site');
  },
  requireSite(redirect = '../index.html') {
    if (!this.checkSite()) { window.location.href = redirect; }
  },
  requireSession(redirect = '../platform/login.html') {
    const s = this.getSession();
    if (!s) { window.location.href = redirect; }
    return s;
  }
};

// ─── RAFIQ FAMILY TREE ───────────────────────
const TREE = {
  rafiq: {
    id: 'rafiq',
    label: 'THE RAFIQ TREE',
    members: {
      // Paternal grandparents
      rafiq_khan: {
        id: 'rafiq_khan', name: 'Rafiq Khan', role: 'Paternal Grandfather',
        spouse: 'mukhadis', side: 'paternal', generation: 0,
        color: 'bubble-sage', size: 'bubble-md',
      },
      mukhadis: {
        id: 'mukhadis', name: 'Mukhadis', role: 'Paternal Grandmother',
        spouse: 'rafiq_khan', side: 'paternal', generation: 0,
        color: 'bubble-lilac', size: 'bubble-md',
      },
      // Maternal grandparents
      abdul_hai: {
        id: 'abdul_hai', name: 'Abdul Hai', role: 'Maternal Grandfather',
        spouse: 'rabiyah', side: 'maternal', generation: 0,
        color: 'bubble-sage', size: 'bubble-md',
      },
      rabiyah: {
        id: 'rabiyah', name: 'Rabiyah', role: 'Maternal Grandmother',
        spouse: 'abdul_hai', side: 'maternal', generation: 0,
        color: 'bubble-lilac', size: 'bubble-md',
      },
      // Parents
      meher: {
        id: 'meher', name: 'Meher', role: 'Mother',
        maidenName: 'Pervaaz', marriedName: 'Rafiq',
        spouse: 'arshad', parents: ['rafiq_khan','mukhadis'],
        generation: 1, color: 'bubble-blush', size: 'bubble-lg',
        recipeCount: 15,
      },
      arshad: {
        id: 'arshad', name: 'Arshad', role: 'Father',
        maidenName: 'Rafiq',
        spouse: 'meher', parents: ['abdul_hai','rabiyah'],
        generation: 1, color: 'bubble-saffron', size: 'bubble-lg',
      },
      // Arshad's siblings
      azhar: {
        id: 'azhar', name: 'Azhar', role: 'Paternal Uncle',
        parents: ['abdul_hai','rabiyah'],
        generation: 1, color: 'bubble-sage', size: 'bubble-sm',
      },
      athar: {
        id: 'athar', name: 'Athar', role: 'Paternal Uncle',
        spouse: 'ruksana', parents: ['abdul_hai','rabiyah'],
        generation: 1, color: 'bubble-sage', size: 'bubble-sm',
      },
      ruksana: {
        id: 'ruksana', name: 'Ruksana', role: 'Paternal Aunt (by marriage)',
        spouse: 'athar',
        generation: 1, color: 'bubble-lilac', size: 'bubble-sm',
      },
      // Meher's siblings
      viq: {
        id: 'viq', name: 'Viq', role: 'Maternal Uncle',
        maidenName: 'Pervaaz',
        parents: ['rafiq_khan','mukhadis'],
        generation: 1, color: 'bubble-sage', size: 'bubble-sm',
        recipeCount: 0, // placeholder
      },
      // Me and siblings
      haana: {
        id: 'haana', name: 'Haana', role: 'Me',
        parents: ['meher','arshad'],
        generation: 2, color: 'bubble-blush', size: 'bubble-md',
        isUser: true,
      },
      saara: {
        id: 'saara', name: 'Saara', role: 'Sister',
        spouse: 'farhan', parents: ['meher','arshad'],
        generation: 2, color: 'bubble-blush', size: 'bubble-md',
      },
      aalia: {
        id: 'aalia', name: 'Aalia', role: 'Sister',
        parents: ['meher','arshad'],
        generation: 2, color: 'bubble-blush', size: 'bubble-md',
      },
      // Saara's husband
      farhan: {
        id: 'farhan', name: 'Farhan', role: 'Brother-in-law',
        spouse: 'saara',
        generation: 2, color: 'bubble-saffron', size: 'bubble-sm',
      },
      // Generation 3
      izza: {
        id: 'izza', name: 'Izza', role: 'Niece',
        parents: ['saara','farhan'],
        generation: 3, color: 'bubble-cream', size: 'bubble-xs',
      },
      // Athar & Ruksana's kids
      kamran: {
        id: 'kamran', name: 'Kamran', role: 'Cousin',
        parents: ['athar','ruksana'],
        generation: 2, color: 'bubble-cream', size: 'bubble-xs',
      },
      zuhair: {
        id: 'zuhair', name: 'Zuhair', role: 'Cousin',
        parents: ['athar','ruksana'],
        generation: 2, color: 'bubble-cream', size: 'bubble-xs',
      },
      maha: {
        id: 'maha', name: 'Maha', role: 'Cousin',
        parents: ['athar','ruksana'],
        generation: 2, color: 'bubble-cream', size: 'bubble-xs',
      },
    }
  }
};

// ─── RECIPES ─────────────────────────────────
const RECIPES = {
  rafiq: [
    {
      id: 'kabab',
      title: 'Kabab',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['beef','fried','snack'],
      ingredients: [
        '1 lb ground beef (keema)',
        'Adrak lassan — ginger garlic paste (picea hua / ground)',
        'Masala — mirchi, salt, etc.',
        'Pudina — fresh mint',
        'Atta — wheat flour',
        'Oil for frying',
      ],
      steps: [
        'Wash the keema. Place in a drainer to remove excess water.',
        'Put keema in a large bowl.',
        'Add masala, kothmere (coriander), and atta (2–3 tablespoons).',
        'Add oil (2 teaspoons) and pudina (mint).',
        'Add a little bit of water and mix well.',
        'Heat oil in a pan.',
        'Take small amounts of keema and shape into kababs, then place into the hot oil.',
      ],
      rawNote: 'Original scan: Kabab (Image 1 & 9)',
    },
    {
      id: 'pulao',
      title: 'Pulao',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['rice','gosht','main'],
      ingredients: [
        '1 lb gosht — bone-in meat',
        'Chana daal',
        'Lima beans',
        'Aaloo — potatoes',
        'Pyaaz — onions (for bhagaar)',
        'Zeera — cumin',
        'Saabood garam masala — whole spices: clove (long), elaichi (cardamom), kali mirchi (black pepper), cinnamon sticks',
        'Kayla — banana',
        'Dahi — yogurt',
        'Limbo — lemon',
        'Rice (chawal)',
      ],
      steps: [
        'Wash the gosht.',
        'Add adrak lassan, and sliced pyaaz (onions). Gal the gosht (cook until tender).',
        'Take the gosht out of the stew/pot.',
        'After wetting the daal, add the leftover water to the pot.',
        'Boil the daal (gal adana).',
        'Add aaloo (potatoes).',
        'Galaana a little (simmer).',
        'Mix everything with masala. Add nala kayla (ripe banana). Add whole spices (cloves, etc.).',
        'Add cool dahi and 1 limbo (lemon).',
        'Boil chawal (rice). Leave a little raw (slightly undercooked).',
        'Put masala and bhagaar (tempered onion) in the pot.',
        'Add bhagaar (a little) in the ghee.',
        'Take some chawal and cover the bottom of the pot.',
        'Add the gosht masala on top.',
        'Put bhagaar on top.',
        'Add peela zafran (yellow saffron).',
        'Drain chawal and layer with gosht and zafran.',
      ],
      rawNote: 'Original scan: Pulao (Images 2, 7, 8)',
    },
    {
      id: 'zucchini_chicken',
      title: 'Zucchini Chicken',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['chicken','oven','western-desi'],
      ingredients: [
        'Zucchini — 1 lb',
        '2 chicken breasts (approximately 1 lb)',
        'Masala — spice mix',
        'Limbo — lemon (½)',
        'Sugar',
        'Tomato sauce',
        'Oregano',
        'Bhagaar — tempered oil/onion',
      ],
      steps: [
        'Wash chicken.',
        'Marinate in salt for ½–1 hour.',
        'Add spices and cook on stovetop.',
        'Grill / sear the chicken.',
        'In a baking dish combine: tomato sauce, chicken, sugar, limbo (½), and sliced zucchini.',
        'Mix everything together.',
        'Put in oven at 350°F.',
        'Ready to serve when oil surfaces and zucchini is tender.',
      ],
      rawNote: 'Original scan: Zucchini Chicken (Image 3)',
    },
    {
      id: 'mung_daal_vadde',
      title: 'Mung Daal Vadde',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['daal','fried','snack','vegetarian'],
      ingredients: [
        'Mung daal — 1 lb',
        'Adrak lassan — ginger garlic paste',
        'Kahnmere — Kashmiri chilli',
        'Masala — spice mix',
        'Peeaz — onion',
      ],
      steps: [
        'Wash the daal and soak for 1–2 hours.',
        'Drain well.',
        'Blend (add a little water to assist). Blend to a coarse texture — leave small pieces.',
        'Add masala and mix thoroughly.',
        'Fry in hot oil until golden.',
      ],
      rawNote: 'Original scan: Mung Daal Vadde (Image 4)',
    },
    {
      id: 'pasande',
      title: 'Pasande',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['gosht','curry','main'],
      ingredients: [
        'Thin gosht slices (pasande cuts)',
        'Dahi — yogurt',
        'Adrak lassan — ginger garlic paste',
        'Masala — spice mix',
        'Hara dhanya — fresh coriander',
        'Saabood garam masala — whole spices (zeera/cumin)',
        'Bhagaar — tempered onion/oil',
        'Thaggan — ghee',
      ],
      steps: [
        'Wash gosht. Brown onions separately.',
        'Brown masala and adrak lassan in pan.',
        'Add gosht.',
        'Gal gosht — cook meat until tender (halka dhora — low heat).',
        'Add whipped dahi (yogurt).',
        'Boil a little more.',
        'Add hara dhanya (finely cut fresh coriander).',
        'Put the karahi/pan on a thin roti/tawa and shut (dum it).',
      ],
      rawNote: 'Original scan: Pasande (Image 5)',
    },
    {
      id: 'wellee',
      title: 'Wellee (Dry Gosht)',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['gosht','dry','marinated'],
      ingredients: [
        'Gosht — big pieces, sliced into long strips',
        'Adrak lassan — ginger garlic paste',
        'Sab masala — all spices / mixed masala',
      ],
      steps: [
        'Slice gosht into long strips.',
        'Add adrak lassan and all masala.',
        'Marinate for 1–2 hours.',
        'Hang to dry (can store until ready to fry).',
        'When dry, fry in hot oil.',
      ],
      rawNote: 'Original scan: Wellee (Image 6)',
    },
    {
      id: 'tarkaree',
      title: 'Tarkaree',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['gosht','curry','main'],
      ingredients: [
        '1 lb gosht',
        'Masala: 1 bulb lassan (garlic), 2 dhali peeaz (whole onions), saabood lal mirchi (whole red chillies)',
        'Brown lassan and peeaz in oven or toaster',
        'Peel then blend with mirchi',
        'Sekh (roast) mirchi in tawa',
      ],
      steps: [
        'Prepare masala: brown lassan and peeaz in oven/toaster, peel, blend with red mirchi. Dry-roast mirchi on tawa.',
        'Add masala to gosht.',
        'Add thel (oil) and water.',
        'Close pot tightly and leave on low heat.',
        'After gosht is galled (tender), turn heat to high to evaporate remaining water.',
      ],
      rawNote: 'Original scan: Tarkaree (Image 6)',
    },
    {
      id: 'keema_paranta',
      title: 'Keema Paranta',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['keema','bread','breakfast'],
      ingredients: [
        '1 lb keema (ground meat)',
        'Masala — no garam masala',
        'Adrak lassan — ginger garlic paste',
        'Pudina — mint',
        'Kothmeer — coriander',
        'Peeaz — onion',
        'Atta — wheat flour (for paranta dough)',
        'Thel — oil',
        'Sekked zeera — roasted cumin',
      ],
      steps: [
        'Drain keema — must have no water.',
        'Cut onions finely.',
        'Cut hara dhanya, pudina, and leeli mirchi (green chilli) finely.',
        'Add all spices to keema.',
        'Mix everything well.',
        'Knead atta. Add thel and sekked zeera (roasted cumin).',
        'Bhel roti (roll out dough).',
        'Add keema filling.',
        'Fold and seal (rebhel).',
        'Sekh (cook on tawa/griddle) until golden.',
      ],
      rawNote: 'Original scan: Keema Paranta (Image 10)',
    },
    {
      id: 'eggplant_parmesean',
      title: 'Eggplant Parmesean',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['vegetarian','oven','italian-desi'],
      ingredients: [
        'Bengan — eggplant',
        'Tomato sauce',
        'Mozzarella cheese (grated)',
        'Adrak lassan — ginger garlic paste',
        'Oregano',
        'Salt',
      ],
      steps: [
        'Cut bengan (eggplant) into slices less than ¼ inch.',
        'Fry slices in low-heat oil.',
        'Make tomato sauce: add adrak lassan, mirchi, namak (salt), oregano. Boil.',
        'Grate mozzarella.',
        'In a baking pan: spread sauce, lay fried bengan slices, cover with sauce.',
        'Add grated cheese over top.',
        'Keep layering until bengan runs out — cheese on top.',
        'Put in oven at 350°F.',
        'Remove when cheese browns and water evaporates.',
      ],
      rawNote: 'Original scan: Eggplant Parmesean (Image 11)',
    },
    {
      id: 'paleeda_daal_chawal',
      title: 'Paleeda & Daal Chawal',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['daal','rice','gosht','main'],
      ingredients: [
        'Gosht — meat',
        'Tunwar ki daal (arhar daal)',
        'Masala — spice mix',
        'Adrak lassan — ginger garlic paste',
        'Zeera — cumin',
        'Saabood garam masala — whole spices',
        'Pudina — mint',
        'Peeaz bhagaar — tempered onion',
        'Cocum (Aam choor) — dried mango powder',
        'Bhajree ka atta (or browned ghau ka atta) — millet flour or browned wheat flour',
      ],
      steps: [
        'Boil washed gosht (no saabood garam masala). Cook 1 lb+ gosht.',
        'Add 2 tablespoons atta to water.',
        'Boil daal until almost done. Add zeera.',
        'Drain daal. Save the water.',
        'Add namak and haldi to daal.',
        'Mix and cover (dum).',
        'Put in thali.',
        'To daal water add liquid bhajree ka atta.',
        'Add hari mirchi (green chilli).',
        'Add cocum (aam choor).',
        'In gosht, add zeera and saabood garam masala.',
        'Cook.',
        'Add onion bhagaar (tempered onion).',
      ],
      rawNote: 'Original scan: Paleeda & Daal Chawal (Image 12)',
    },
    {
      id: 'fish_kabab',
      title: 'Fish Kabab',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['fish','fried','snack'],
      ingredients: [
        'Tuna (canned — drain well)',
        'Chane ka atta — chickpea flour',
        'Kahnmere — Kashmiri chilli',
        'Hara dhanya — fresh coriander',
        'Leeli mirchi — green chilli',
        'Namak — salt',
        'Masala: adrak lassan',
        'Peeaz — onion',
      ],
      steps: [
        'Drain tuna thoroughly.',
        'Add all ingredients to drained fish and chane ka atta (only a little bit).',
        'Add water if needed to reach pakora consistency.',
        'Fry in hot oil.',
      ],
      rawNote: 'Original scan: Fish Kabab (Image 13)',
    },
    {
      id: 'haleem',
      title: 'Haleem',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['gosht','wheat','slow-cook','main'],
      ingredients: [
        'Thuli — cracked wheat',
        'Gosht — meat',
        'Pudina — mint',
        'Adrak lassan — ginger garlic paste',
        'Masala — garam and other spices',
        'Bhagaan — tempered onion/oil',
      ],
      steps: [
        'Cook thuli (cracked wheat) until soft.',
        'Blend until liquidy (or shred by hand).',
        'Put in andaima (a pot/vessel).',
        'Add zeera and garama masala to gosht after bhagaar.',
        'Cook together.',
        'After gosht is galled (tender), add thuli.',
        'Mix and add water (should be liquid consistency).',
        'Keep cooking until it looks like haleem.',
        'Add pudina (mint) to finish.',
      ],
      rawNote: 'Original scan: Haleem (Image 14)',
    },
    {
      id: 'patties',
      title: 'Patties',
      uploadedBy: 'meher',
      assignedTo: 'meher',
      uploadDate: '2024-01-15',
      tags: ['keema','aaloo','snack','fried'],
      ingredients: [
        'Keema — ground meat',
        'Aaloo — potato',
        'Masala — spice mix',
        'Adrak lassan — ginger garlic paste',
        'Oil',
        'Optional egg (to brush)',
        'Serve with: amree chutney (tamarind), onions, pudina, zeera, tomatoes',
      ],
      steps: [
        'Boil aaloo (between hard and soft — not too soft).',
        'Cook keema with masala and thel (bhuno — dry roast, no water).',
        'Cool on a plate.',
        'Peel aaloo and mash smooth.',
        'Make a pattie shape in your hand.',
        'Put keema in the middle.',
        'Shape into a ball.',
        'Flatten gently.',
        'Fry in a little oil (can brush with egg first).',
        'Eat with amree chutney, onions, pudina, zeera, and tomatoes.',
      ],
      rawNote: 'Original scan: Patties (Image 15)',
    },
  ]
};

// ─── UTILITIES ───────────────────────────────
function getMemberRecipes(memberId, familyId = 'rafiq') {
  return (RECIPES[familyId] || []).filter(r => r.assignedTo === memberId);
}

function showToast(msg, duration = 3000) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function closeAllPanels() {
  document.querySelectorAll('.highlight-panel').forEach(p => p.remove());
  document.querySelectorAll('.bubble.active').forEach(b => b.classList.remove('active'));
}

// Click outside to close panels
document.addEventListener('click', (e) => {
  if (!e.target.closest('.bubble') && !e.target.closest('.highlight-panel')) {
    closeAllPanels();
  }
});

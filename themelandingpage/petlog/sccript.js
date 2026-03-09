// Pawly - Full cute MVP with reminders, beep, email stub

const STORAGE_KEY = 'pawly_data_v2';
let state = loadState();

const breedsBySpecies = {
  Dog: [
    "Labrador Retriever", "French Bulldog", "Golden Retriever", "German Shepherd",
    "Poodle", "Bulldog", "Beagle", "Rottweiler", "Dachshund", "Yorkshire Terrier",
    "Boxer", "Siberian Husky", "Corgi", "Shih Tzu"
  ],
  Cat: [
    "Domestic Shorthair", "Maine Coon", "Siamese", "Persian", "Ragdoll",
    "British Shorthair", "Abyssinian", "Sphynx", "Bengal", "Scottish Fold"
  ],
  Rabbit: [
    "Holland Lop", "Netherland Dwarf", "Mini Rex", "Lionhead", "Flemish Giant",
    "New Zealand", "American Fuzzy Lop"
  ],
  Other: ["Custom / Mixed"]
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {
    pets: [],
    events: [],
    isPremium: false,
    settings: { sound: true, email: false, emailAddress: '' }
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Elements
const modalBackdrop = document.getElementById('modal-backdrop');
const petModal = document.getElementById('add-pet-modal');
const careModal = document.getElementById('add-care-modal');
const petsGrid = document.getElementById('pets-grid');
const timeline = document.getElementById('timeline');
const emptyPets = document.getElementById('empty-pets');
const emptyTimeline = document.getElementById('empty-timeline');
const limitBanner = document.getElementById('limit-banner');
const fab = document.getElementById('fab');

// Beep using Web Audio API (no file needed)
function playBeep() {
  if (!state.settings.sound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 800; // gentle tone
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch(e) {
    console.log("Beep failed", e);
  }
}

// Toast
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast show';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 5000);
}

// Email stub (configure EmailJS first!)
function sendEmailReminder(petName, type, dateTimeStr) {
  if (!state.settings.email || !state.settings.emailAddress) return;
  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    to_email: state.settings.emailAddress,
    pet_name: petName,
    event_type: type,
    datetime: dateTimeStr,
    message: `Reminder from Pawly: ${petName}'s ${type} is coming up! 🐾`
  }).catch(err => console.log("Email fail", err));
}

// Dynamic avatar emoji
function getAvatarEmoji(species, breed) {
  const breedLower = (breed || '').toLowerCase();
  if (species === 'Dog') {
    if (breedLower.includes('bulldog') || breedLower.includes('french')) return '🐂';
    if (breedLower.includes('husky')) return '🐺';
    if (breedLower.includes('pug')) return '🐶'; // pug-like
    return '🐕';
  }
  if (species === 'Cat') {
    if (breedLower.includes('persian') || breedLower.includes('ragdoll')) return '😻';
    if (breedLower.includes('siamese')) return '🐱';
    return '😺';
  }
  if (species === 'Rabbit') return '🐰';
  return '🐾';
}

// Render pets
function renderPets() {
  petsGrid.innerHTML = '';
  if (state.pets.length === 0) {
    emptyPets.style.display = 'block';
    return;
  }
  emptyPets.style.display = 'none';

  state.pets.forEach(pet => {
    const nextEvent = state.events
      .filter(e => e.petId === pet.id)
      .sort((a,b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))[0];

    const card = document.createElement('div');
    card.className = 'pet-card';
    card.innerHTML = `
      <div class="pet-avatar">${getAvatarEmoji(pet.species, pet.breed)}</div>
      <div class="pet-info">
        <div class="pet-name">${pet.name}</div>
        <div class="pet-breed">${pet.breed || pet.species}</div>
        <div class="pet-next">${nextEvent ? `Next: ${nextEvent.type} ${nextEvent.date}` : 'No upcoming care'}</div>
      </div>
    `;
    petsGrid.appendChild(card);
  });
}

// Render timeline (events)
function renderTimeline() {
  timeline.innerHTML = '';
  if (state.events.length === 0) {
    emptyTimeline.classList.remove('hidden');
    return;
  }
  emptyTimeline.classList.add('hidden');

  const today = new Date().toISOString().split('T')[0];
  state.events.sort((a,b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

  state.events.forEach(ev => {
    const pet = state.pets.find(p => p.id === ev.petId) || {name: '?'};
    const eventTime = new Date(ev.date + 'T' + ev.time);
    const isOverdue = eventTime < new Date();
    const item = document.createElement('div');
    item.className = `timeline-item ${isOverdue ? 'overdue' : 'upcoming'}`;
    item.innerHTML = `
      <strong>${ev.type}</strong> for ${pet.name}
      <div>${ev.date} at ${ev.time}</div>
      ${ev.notes ? `<small>${ev.notes}</small>` : ''}
    `;
    timeline.appendChild(item);
  });
}

// Reminder checker (every 60s)
function checkReminders() {
  const now = new Date();
  state.events.forEach(ev => {
    if (ev.notified) return;
    let remindTime = new Date(ev.date + 'T' + ev.time);
    remindTime.setDate(remindTime.getDate() - Number(ev.reminderOffset || 0));

    if (now >= remindTime) {
      const pet = state.pets.find(p => p.id === ev.petId) || {name: 'Buddy'};
      playBeep();
      showToast(`🐾 Reminder: ${pet.name}'s ${ev.type} ${ev.reminderOffset > 0 ? 'tomorrow/in ' + ev.reminderOffset + ' days' : 'today'}!`);
      sendEmailReminder(pet.name, ev.type, ev.date + ' ' + ev.time);
      ev.notified = true;
      saveState();
    }
  });
}

setInterval(checkReminders, 60000); // every minute

// Modal helpers
function openModal(modalEl) {
  modalBackdrop.classList.remove('hidden');
  modalEl.classList.remove('hidden');
  modalBackdrop.classList.add('visible');
}

function closeAllModals() {
  modalBackdrop.classList.add('hidden');
  modalBackdrop.classList.remove('visible');
  petModal.classList.add('hidden');
  careModal.classList.add('hidden');
}

// Populate pet select in care form
function populatePetSelect() {
  const select = document.getElementById('care-pet');
  select.innerHTML = '<option value="">Select pet</option>';
  state.pets.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    select.appendChild(opt);
  });
}

// Event listeners
document.getElementById('btn-add-pet').addEventListener('click', () => {
  if (!state.isPremium && state.pets.length >= 1) {
    limitBanner.classList.remove('hidden');
    return;
  }
  openModal(petModal);
});

document.getElementById('btn-add-care').addEventListener('click', () => {
  populatePetSelect();
  openModal(careModal);
});

fab.addEventListener('click', () => openModal(petModal)); // default to pet

document.querySelectorAll('.modal-close, #btn-cancel-pet, #btn-cancel-care').forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

modalBackdrop.addEventListener('click', closeAllModals);

// Dynamic breed options
document.getElementById('pet-species').addEventListener('change', e => {
  const species = e.target.value;
  const breedSelect = document.getElementById('pet-breed');
  breedSelect.innerHTML = '<option value="">Select breed</option>';
  (breedsBySpecies[species] || []).forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    breedSelect.appendChild(opt);
  });
});

// Save pet
document.getElementById('pet-form').addEventListener('submit', e => {
  e.preventDefault();
  const newPet = {
    id: Date.now().toString(),
    name: document.getElementById('pet-name').value.trim(),
    species: document.getElementById('pet-species').value,
    breed: document.getElementById('pet-breed').value,
    birthday: document.getElementById('pet-birthday').value || null
  };
  state.pets.push(newPet);
  saveState();
  renderPets();
  closeAllModals();
  showToast(`Welcome ${newPet.name}! 💕`);
});

// Save care event
document.getElementById('care-form').addEventListener('submit', e => {
  e.preventDefault();
  const newEvent = {
    id: Date.now().toString(),
    petId: document.getElementById('care-pet').value,
    type: document.getElementById('care-type').value,
    date: document.getElementById('care-date').value,
    time: document.getElementById('care-time').value,
    notes: document.getElementById('care-notes').value.trim(),
    reminderOffset: document.getElementById('care-reminder').value,
    notified: false
  };
  state.events.push(newEvent);
  saveState();
  renderTimeline();
  closeAllModals();
  showToast(`Event added for your buddy! 🐾`);
});

// Upgrade sim
document.getElementById('btn-upgrade').addEventListener('click', () => {
  state.isPremium = true;
  saveState();
  limitBanner.classList.add('hidden');
  alert('Premium unlocked! Unlimited pets activated ✨');
});

// Init
renderPets();
renderTimeline();
checkReminders(); // initial check
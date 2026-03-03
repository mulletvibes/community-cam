// ── Supabase client ───────────────────────────────────────────────────────────

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Prompt definitions ────────────────────────────────────────────────────────
// option_a / option_b : vote keywords (what users type in chat)
// label_a  / label_b  : display labels shown in the overlay
// tagField / tagValue : camera tag to filter when that side wins

const PROMPTS = [
  { display: 'Beach 🌊 or City 🏙️?',     option_a: 'beach',    label_a: 'Beach 🌊',    tagField_a: 'vibe',    tagValue_a: 'beach',    option_b: 'city',     label_b: 'City 🏙️',    tagField_b: 'vibe',    tagValue_b: 'city'    },
  { display: 'Americas 🌎 or Europe 🌍?', option_a: 'americas', label_a: 'Americas 🌎', tagField_a: 'region',  tagValue_a: 'americas', option_b: 'europe',   label_b: 'Europe 🌍',  tagField_b: 'region',  tagValue_b: 'europe'  },
  { display: 'City 🏙️ or Nature 🌲?',    option_a: 'city',     label_a: 'City 🏙️',    tagField_a: 'vibe',    tagValue_a: 'city',     option_b: 'nature',   label_b: 'Nature 🌲',  tagField_b: 'vibe',    tagValue_b: 'nature'  },
  { display: 'Asia 🌏 or Europe 🌍?',     option_a: 'asia',     label_a: 'Asia 🌏',     tagField_a: 'region',  tagValue_a: 'asia',     option_b: 'europe',   label_b: 'Europe 🌍',  tagField_b: 'region',  tagValue_b: 'europe'  },
  { display: 'Beach 🌊 or Nature 🌲?',    option_a: 'beach',    label_a: 'Beach 🌊',    tagField_a: 'vibe',    tagValue_a: 'beach',    option_b: 'nature',   label_b: 'Nature 🌲',  tagField_b: 'vibe',    tagValue_b: 'nature'  },
  { display: 'Sun ☀️ or Clouds ☁️?',      option_a: 'sun',      label_a: 'Sun ☀️',      tagField_a: 'weather', tagValue_a: 'sunny',    option_b: 'clouds',   label_b: 'Clouds ☁️',  tagField_b: 'weather', tagValue_b: 'cloudy'  },
  { display: 'Americas 🌎 or Asia 🌏?',   option_a: 'americas', label_a: 'Americas 🌎', tagField_a: 'region',  tagValue_a: 'americas', option_b: 'asia',     label_b: 'Asia 🌏',    tagField_b: 'region',  tagValue_b: 'asia'    },
  { display: 'Africa 🌍 or Asia 🌏?',     option_a: 'africa',   label_a: 'Africa 🌍',   tagField_a: 'region',  tagValue_a: 'africa',   option_b: 'asia',     label_b: 'Asia 🌏',    tagField_b: 'region',  tagValue_b: 'asia'    },
  { display: 'Sun ☀️ or Snow ❄️?',        option_a: 'sun',      label_a: 'Sun ☀️',      tagField_a: 'weather', tagValue_a: 'sunny',    option_b: 'snow',     label_b: 'Snow ❄️',    tagField_b: 'weather', tagValue_b: 'snowy'   },
];

const ROUND_DURATION_MS = 30 * 60 * 1000;

// ── Runtime state ─────────────────────────────────────────────────────────────

let currentCameraId    = null;
let currentRoundEndsAt = null;
let currentState       = null;
let countdownInterval  = null;
let lastRoundEndsAt    = null;           // detects when a new round starts

const transitionedRounds = new Set();    // prevents double-firing per round end

// ── Session helpers ───────────────────────────────────────────────────────────

function getSessionId() {
  let id = localStorage.getItem('cc_session');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('cc_session', id);
  }
  return id;
}

function hasVotedThisRound() {
  return !!localStorage.getItem(`cc_voted_${currentRoundEndsAt}`);
}

function markVotedThisRound() {
  localStorage.setItem(`cc_voted_${currentRoundEndsAt}`, '1');
}

// ── Camera loading ────────────────────────────────────────────────────────────

function loadCamera(camera) {
  document.getElementById('camera-frame').src =
    `https://www.youtube.com/embed/${camera.embedId}` +
    '?autoplay=1&mute=1&controls=0&disablekb=1&playsinline=1&iv_load_policy=3&rel=0';
}

// ── Overlay rendering ─────────────────────────────────────────────────────────

function findPrompt(optionA, optionB) {
  return PROMPTS.find(p => p.option_a === optionA && p.option_b === optionB);
}

function renderOverlay(state) {
  const p = findPrompt(state.option_a, state.option_b);
  const labelA = p ? p.label_a : state.option_a;
  const labelB = p ? p.label_b : state.option_b;
  document.getElementById('vote-prompt').textContent =
    `Next feed: ${labelA} (${state.votes_a}) or ${labelB} (${state.votes_b})?`;
}

// ── Countdown ─────────────────────────────────────────────────────────────────

function startCountdown(roundEndsAt) {
  if (countdownInterval) clearInterval(countdownInterval);

  const tick = () => {
    const remaining = new Date(roundEndsAt) - Date.now();

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown').textContent = '00:00';
      handleRoundEnd(roundEndsAt);
      return;
    }

    const m = Math.floor(remaining / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    document.getElementById('countdown').textContent =
      `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  tick();
  countdownInterval = setInterval(tick, 1000);
}

// ── Apply incoming round state ────────────────────────────────────────────────

function applyRoundState(state) {
  currentState       = state;
  currentRoundEndsAt = state.round_ends_at;

  // Only reload the iframe when the camera actually changes
  if (state.current_camera_id !== currentCameraId) {
    const camera = CAMERAS.find(c => c.id === state.current_camera_id);
    if (camera) {
      loadCamera(camera);
      currentCameraId = state.current_camera_id;
    }
  }

  renderOverlay(state);
  startCountdown(state.round_ends_at);

  // Show a vote hint in chat whenever a new round starts
  if (state.round_ends_at !== lastRoundEndsAt) {
    lastRoundEndsAt = state.round_ends_at;
    addSystemMessage(
      `🗳 New round! Type "${state.option_a}" or "${state.option_b}" to vote.`
    );
  }
}

// ── Round transition ──────────────────────────────────────────────────────────

async function handleRoundEnd(roundEndsAt) {
  // Guard: only one transition attempt per round end per session
  if (transitionedRounds.has(roundEndsAt)) return;
  transitionedRounds.add(roundEndsAt);

  // Re-fetch to get the final vote counts before deciding the winner
  const { data: state } = await db.from('round_state').select('*').limit(1).single();
  if (!state || state.round_ends_at !== roundEndsAt) return; // already transitioned

  // Determine winner (random on tie)
  let winnerKey;
  if      (state.votes_a > state.votes_b) winnerKey = state.option_a;
  else if (state.votes_b > state.votes_a) winnerKey = state.option_b;
  else    winnerKey = Math.random() < 0.5 ? state.option_a : state.option_b;

  // Find cameras matching the winning tag
  const p = findPrompt(state.option_a, state.option_b);
  let pool = [];
  if (p) {
    const isA      = winnerKey === state.option_a;
    const tagField = isA ? p.tagField_a : p.tagField_b;
    const tagValue = isA ? p.tagValue_a : p.tagValue_b;
    pool = CAMERAS.filter(c => c.tags[tagField] === tagValue && c.id !== state.current_camera_id);
  }
  // Fallback: any camera except the current one
  if (pool.length === 0) pool = CAMERAS.filter(c => c.id !== state.current_camera_id);

  const nextCamera = pool[Math.floor(Math.random() * pool.length)];

  // Advance to the next prompt in the sequence
  const idx        = PROMPTS.findIndex(q => q.option_a === state.option_a && q.option_b === state.option_b);
  const nextPrompt = PROMPTS[(idx + 1) % PROMPTS.length];

  // Conditional update — only succeeds if round_ends_at still matches
  await db.rpc('transition_round', {
    expected_ends_at:  state.round_ends_at,
    new_camera_id:     nextCamera.id,
    new_prompt:        nextPrompt.display,
    new_option_a:      nextPrompt.option_a,
    new_option_b:      nextPrompt.option_b,
    new_round_ends_at: new Date(Date.now() + ROUND_DURATION_MS).toISOString(),
  });

  // The realtime subscription handles the UI update when Supabase broadcasts the change
}

// ── Realtime subscription ─────────────────────────────────────────────────────

function subscribeToRoundState() {
  db.channel('round_state_changes')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'round_state' },
      ({ new: state }) => applyRoundState(state)
    )
    .subscribe();
}

// ── Vote detection ────────────────────────────────────────────────────────────

function detectVote(message, optionA, optionB) {
  const lower = message.toLowerCase();
  const match = kw => new RegExp(`\\b${kw}\\b`).test(lower);
  if (match(optionA)) return optionA;
  if (match(optionB)) return optionB;
  return null;
}

async function submitVote(choice) {
  markVotedThisRound();
  const col = choice === currentState.option_a ? 'votes_a' : 'votes_b';
  await Promise.all([
    db.from('votes').insert({ session_id: getSessionId(), choice }),
    db.rpc('increment_vote', { col }),
  ]);
}

// ── Chat UI ───────────────────────────────────────────────────────────────────

function appendToChat(el) {
  const msgs = document.getElementById('chat-messages');
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
}

function addChatMessage(user, text) {
  const div  = document.createElement('div');
  div.className = 'chat-msg';
  const span = document.createElement('span');
  span.className   = 'chat-user';
  span.textContent = user + ':';
  div.appendChild(span);
  div.append(' ' + text);
  appendToChat(div);
}

function addSystemMessage(text) {
  const div = document.createElement('div');
  div.className   = 'chat-msg chat-system';
  div.textContent = text;
  appendToChat(div);
}

async function handleChatSubmit() {
  const input   = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message || !currentState) return;

  input.value = '';
  addChatMessage('You', message);

  const vote = detectVote(message, currentState.option_a, currentState.option_b);
  if (!vote) return;

  if (hasVotedThisRound()) {
    addSystemMessage("You've already voted this round!");
    return;
  }

  await submitVote(vote);
}

// ── Chat panel toggle ─────────────────────────────────────────────────────────

document.getElementById('chat-toggle').addEventListener('click', () => {
  document.getElementById('chat-panel').classList.add('open');
  document.getElementById('chat-toggle').classList.add('hidden');
});

document.getElementById('chat-close').addEventListener('click', () => {
  document.getElementById('chat-panel').classList.remove('open');
  document.getElementById('chat-toggle').classList.remove('hidden');
});

document.getElementById('chat-send').addEventListener('click', handleChatSubmit);

document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleChatSubmit();
});

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  const { data, error } = await db
    .from('round_state')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    console.error('Failed to load round state:', error);
    return;
  }

  applyRoundState(data);
  subscribeToRoundState();
}

init();

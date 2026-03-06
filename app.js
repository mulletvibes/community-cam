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

const ROUND_DURATION_MS = 10 * 60 * 1000;

// ── YouTube IFrame Player ─────────────────────────────────────────────────────

let ytPlayer = null;
let deadFeedTimeout   = null;
let deadFeedTriedCams = new Set();

// Resolves once YT.Player fires onReady (player is initialised and ready for API calls)
let ytReadyResolve;
const ytReady = new Promise(resolve => { ytReadyResolve = resolve; });

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('camera-frame', {
    width:  '100%',
    height: '100%',
    playerVars: {
      autoplay:       1,
      mute:           1,
      controls:       0,
      disablekb:      1,
      playsinline:    1,
      iv_load_policy: 3,
      rel:            0,
    },
    events: {
      onReady:       () => ytReadyResolve(),
      onStateChange: onYTStateChange,
      onError:       onYTError,
    },
  });
};

function onYTStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    clearDeadFeedTimeout();
    deadFeedTriedCams.clear();   // successful playback — reset retry tracking
  } else if (event.data === YT.PlayerState.BUFFERING) {
    // Buffering can mean an ad is loading — reset the clock so we don't
    // mistake a slow ad pre-roll for a dead feed
    armDeadFeedTimeout();
  } else if (event.data === YT.PlayerState.ENDED) {
    // Live stream ended or recording unavailable ("This live stream recording
    // is not available") — treat immediately as a dead feed
    clearDeadFeedTimeout();
    console.warn('[dead feed] player state ENDED — stream finished or recording unavailable');
    handleDeadFeed();
  }
}

function onYTError(event) {
  clearDeadFeedTimeout();
  console.warn('[dead feed] YT error code:', event.data);
  handleDeadFeed();
}

function armDeadFeedTimeout() {
  clearDeadFeedTimeout();
  deadFeedTimeout = setTimeout(() => {
    console.warn('[dead feed] timeout — no playback after 15s');
    handleDeadFeed();
  }, 15000);
}

function clearDeadFeedTimeout() {
  if (deadFeedTimeout) {
    clearTimeout(deadFeedTimeout);
    deadFeedTimeout = null;
  }
}

// ── Runtime state ─────────────────────────────────────────────────────────────

let currentCameraId    = null;
let currentRoundEndsAt = null;
let currentState       = null;
let countdownInterval  = null;
let lastRoundEndsAt    = null;           // detects when a new round starts
let locationClockInterval = null;

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

function getUsername() {
  let name = localStorage.getItem('cc_username');
  if (!name) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    name = `Guest${suffix}`;
    localStorage.setItem('cc_username', name);
  }
  return name;
}

function hasVotedThisRound() {
  return !!localStorage.getItem(`cc_voted_${currentRoundEndsAt}`);
}

function markVotedThisRound() {
  localStorage.setItem(`cc_voted_${currentRoundEndsAt}`, '1');
}

// ── Camera loading ────────────────────────────────────────────────────────────

async function loadCamera(camera) {
  await ytReady;
  ytPlayer.loadVideoById(camera.embedId);
  armDeadFeedTimeout();
  showLocationOverlay(camera);
}

// ── Dead feed safeguard ───────────────────────────────────────────────────────

async function handleDeadFeed() {
  console.log('[dead feed] handleDeadFeed called. currentCameraId:', currentCameraId, '| currentState:', currentState);

  if (!currentState || !currentCameraId) {
    console.warn('[dead feed] aborting — currentState or currentCameraId is null');
    return;
  }

  deadFeedTriedCams.add(currentCameraId);

  // Build pool: cameras matching current round's prompt options (both sides)
  const p = findPrompt(currentState.option_a, currentState.option_b);
  let pool = [];
  if (p) {
    pool = CAMERAS.filter(c =>
      (c.tags[p.tagField_a] === p.tagValue_a || c.tags[p.tagField_b] === p.tagValue_b) &&
      !deadFeedTriedCams.has(c.id)
    );
  }
  console.log('[dead feed] prompt pool size:', pool.length, '| prompt:', p ? `${p.option_a}/${p.option_b}` : 'none');

  // Fallback: full camera pool minus already-tried cameras
  if (pool.length === 0) {
    pool = CAMERAS.filter(c => !deadFeedTriedCams.has(c.id));
    console.log('[dead feed] using full pool fallback, size:', pool.length);
  }

  // All cameras exhausted — reset and try full pool minus current only
  if (pool.length === 0) {
    deadFeedTriedCams.clear();
    deadFeedTriedCams.add(currentCameraId);
    pool = CAMERAS.filter(c => !deadFeedTriedCams.has(c.id));
    console.log('[dead feed] all cameras exhausted — reset. pool size:', pool.length);
  }

  if (pool.length === 0) {
    console.warn('[dead feed] no cameras available, giving up');
    return;
  }

  document.getElementById('vote-prompt').textContent = '📡 Switching feed...';

  const nextCamera = pool[Math.floor(Math.random() * pool.length)];
  console.log('[dead feed] selected fallback camera:', nextCamera.id, nextCamera.name);
  console.log('[dead feed] calling RPC — expected_camera_id:', currentCameraId, '→ new_camera_id:', nextCamera.id);

  // Fetch current DB state to verify expected_camera_id matches before RPC
  const { data: dbState, error: fetchError } = await db.from('round_state').select('current_camera_id').limit(1).single();
  console.log('[dead feed] DB current_camera_id:', dbState?.current_camera_id, '(type:', typeof dbState?.current_camera_id, ') | local currentCameraId:', currentCameraId, '(type:', typeof currentCameraId, ') | fetchError:', fetchError);
  if (dbState && dbState.current_camera_id !== currentCameraId) {
    console.warn('[dead feed] WHERE mismatch — DB has', dbState.current_camera_id, 'but expected', currentCameraId, '— RPC will update 0 rows');
  }

  const deadCameraId = currentCameraId;

  const { error } = await db.rpc('switch_camera_mid_round', {
    expected_camera_id: currentCameraId,
    new_camera_id:      nextCamera.id,
  });
  console.log('[dead feed] RPC result — error:', error);

  // Local fallback: if the global switch (RPC + realtime) hasn't moved us off
  // the dead camera within 20s, force a client-side switch so this user is unstuck
  setTimeout(() => {
    if (currentCameraId === deadCameraId) {
      console.warn('[dead feed] global switch did not complete after 20s — forcing local switch to', nextCamera.id);
      currentCameraId = nextCamera.id;
      loadCamera(nextCamera);
      if (currentState) renderOverlay(currentState);
    }
  }, 20000);
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
    deadFeedTriedCams.clear();
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
  // Use Date comparison — Supabase can return the same timestamp in different
  // timezone string formats (e.g. +00:00 vs Z), so string equality is unreliable
  if (!state || new Date(state.round_ends_at).getTime() !== new Date(roundEndsAt).getTime()) return;

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
  const { error: transitionError } = await db.rpc('transition_round', {
    expected_ends_at:  state.round_ends_at,
    new_camera_id:     nextCamera.id,
    new_prompt:        nextPrompt.display,
    new_option_a:      nextPrompt.option_a,
    new_option_b:      nextPrompt.option_b,
    new_round_ends_at: new Date(Date.now() + ROUND_DURATION_MS).toISOString(),
  });
  if (transitionError) console.error('[transition] transition_round RPC error:', transitionError);

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
    .subscribe((status, err) => {
      console.log('[realtime] status:', status);
      if (err) console.error('[realtime] error:', err);
    });
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
  const col = choice === currentState.option_a ? 'votes_a' : 'votes_b';
  const [{ error: insertError }, { error: rpcError }] = await Promise.all([
    db.from('votes').insert({ session_id: getSessionId(), choice }),
    db.rpc('increment_vote', { col }),
  ]);
  if (insertError) console.error('[vote] insert error:', insertError);
  if (rpcError)    console.error('[vote] increment_vote error:', rpcError);
  // Only lock the user out of voting again if both writes succeeded
  if (!insertError && !rpcError) markVotedThisRound();
}

// ── Chat UI ───────────────────────────────────────────────────────────────────
// Note: chat messages are local only — cross-tab/cross-user chat sync is a future feature

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

  const vote = detectVote(message, currentState.option_a, currentState.option_b);

  const { error: chatError } = await db
    .from('chat_messages')
    .insert({ username: getUsername(), message });
  if (chatError) console.error('[chat] send error:', chatError);
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

// ── Location / weather overlay ────────────────────────────────────────────────

const WMO = {
  0:  { label: 'Clear',            emoji: '☀️'  },
  1:  { label: 'Mainly clear',     emoji: '🌤️'  },
  2:  { label: 'Partly cloudy',    emoji: '⛅'  },
  3:  { label: 'Overcast',         emoji: '☁️'  },
  45: { label: 'Foggy',            emoji: '🌫️'  },
  48: { label: 'Icy fog',          emoji: '🌫️'  },
  51: { label: 'Light drizzle',    emoji: '🌦️'  },
  53: { label: 'Drizzle',          emoji: '🌦️'  },
  55: { label: 'Heavy drizzle',    emoji: '🌦️'  },
  56: { label: 'Freezing drizzle', emoji: '🌨️'  },
  57: { label: 'Freezing drizzle', emoji: '🌨️'  },
  61: { label: 'Light rain',       emoji: '🌧️'  },
  63: { label: 'Rain',             emoji: '🌧️'  },
  65: { label: 'Heavy rain',       emoji: '🌧️'  },
  66: { label: 'Freezing rain',    emoji: '🌨️'  },
  67: { label: 'Freezing rain',    emoji: '🌨️'  },
  71: { label: 'Light snow',       emoji: '❄️'   },
  73: { label: 'Snow',             emoji: '❄️'   },
  75: { label: 'Heavy snow',       emoji: '❄️'   },
  77: { label: 'Snow grains',      emoji: '🌨️'  },
  80: { label: 'Showers',          emoji: '🌦️'  },
  81: { label: 'Showers',          emoji: '🌦️'  },
  82: { label: 'Heavy showers',    emoji: '⛈️'  },
  85: { label: 'Snow showers',     emoji: '❄️'   },
  86: { label: 'Snow showers',     emoji: '❄️'   },
  95: { label: 'Thunderstorm',     emoji: '⛈️'  },
  96: { label: 'Thunderstorm',     emoji: '⛈️'  },
  99: { label: 'Thunderstorm',     emoji: '⛈️'  },
};

async function fetchWeather(camera) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${camera.lat}&longitude=${camera.lng}` +
      `&current=weather_code,temperature_2m&timezone=auto&forecast_days=1`
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.current ?? null;
  } catch {
    return null;
  }
}

function startLocationClock(timezone) {
  if (locationClockInterval) clearInterval(locationClockInterval);
  const el  = document.getElementById('loc-time');
  const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
    timeZone: timezone,
  });
  const tick = () => { el.textContent = fmt.format(new Date()); };
  tick();
  locationClockInterval = setInterval(tick, 1000);
}

async function showLocationOverlay(camera) {
  const overlay = document.getElementById('location-overlay');

  // If already visible, slide it down first and wait for the transition to clear
  const wasVisible = overlay.classList.contains('visible');
  if (wasVisible) overlay.classList.remove('visible');

  // Fetch weather in parallel with the slide-down wait
  const [weather] = await Promise.all([
    fetchWeather(camera),
    wasVisible ? new Promise(r => setTimeout(r, 450)) : Promise.resolve(),
  ]);

  document.getElementById('loc-name').textContent = camera.location;
  startLocationClock(camera.timezone);

  const wmo = weather ? (WMO[weather.weather_code] ?? { label: 'Unknown', emoji: '🌐' }) : null;
  document.getElementById('loc-weather').textContent = wmo
    ? `${wmo.emoji} ${wmo.label} · ${Math.round(weather.temperature_2m)}°C`
    : '';

  overlay.classList.add('visible');
}

// ── Persistent chat ───────────────────────────────────────────────────────────

async function loadChatHistory() {
  const { data, error } = await db
    .from('chat_messages')
    .select('username, message')
    .order('created_at', { ascending: true })
    .limit(50);
  if (error) { console.error('[chat] load error:', error); return; }
  data.forEach(row => addChatMessage(row.username, row.message));
}

function subscribeToChatMessages() {
  db.channel('chat_messages_changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_messages' },
      ({ new: row }) => addChatMessage(row.username, row.message)
    )
    .subscribe((status, err) => {
      console.log('[chat realtime] status:', status);
      if (err) console.error('[chat realtime] error:', err);
    });
}

// ── Chat visibility ───────────────────────────────────────────────────────────

const CHAT_BREAKPOINT = 1024;

function closeChatPanel() {
  document.getElementById('chat-panel').classList.remove('open');
  document.getElementById('chat-toggle').classList.remove('hidden');
}

function initChatVisibility() {
  if (window.innerWidth < CHAT_BREAKPOINT) closeChatPanel();
}

let lastKnownWidth = window.innerWidth;
window.addEventListener('resize', () => {
  const currentWidth = window.innerWidth;
  if (currentWidth === lastKnownWidth) return; // height-only change (e.g. mobile keyboard)
  lastKnownWidth = currentWidth;
  if (currentWidth < CHAT_BREAKPOINT) closeChatPanel();
});

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  initChatVisibility();

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
  await loadChatHistory();
  subscribeToChatMessages();
}

init();

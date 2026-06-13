const NOTE_NAMES = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
const NOTE_FLATS = ["Do", "Reb", "Re", "Mib", "Mi", "Fa", "Solb", "Sol", "Lab", "La", "Sib", "Si"];
const A4_MIDI = 69;
const A4_FREQ = 440;
const SAMPLE_WINDOW = 2048;
const MIDI_PPQ = 480;
const DEFAULT_BPM = 120;
const SAMPLE_MIDIS = [36, 48, 60, 72, 84, 96];

const INSTRUMENTS = {
  0: {
    name: "Piano acústico",
    folder: "acoustic_grand_piano",
    color: "#13795b",
    gain: 0.9,
    attack: 0.005,
    release: 0.24,
    sustain: false,
    fallback: { type: "sine", filterType: "lowpass", filterFrequency: 3600, gain: 0.24, attack: 0.006, sustain: 0.32, release: 0.16 },
  },
  4: {
    name: "Piano eléctrico",
    folder: "electric_piano_1",
    color: "#22577a",
    gain: 0.85,
    attack: 0.006,
    release: 0.2,
    sustain: false,
    fallback: { type: "triangle", filterType: "lowpass", filterFrequency: 4200, gain: 0.2, attack: 0.006, sustain: 0.34, release: 0.18 },
  },
  11: {
    name: "Vibráfono",
    folder: "vibraphone",
    color: "#6d7f2c",
    gain: 0.8,
    attack: 0.005,
    release: 0.32,
    sustain: false,
    fallback: { type: "sine", filterType: "lowpass", filterFrequency: 5000, gain: 0.24, attack: 0.005, sustain: 0.22, release: 0.36 },
  },
  24: {
    name: "Guitarra nylon",
    folder: "acoustic_guitar_nylon",
    color: "#b97800",
    gain: 0.95,
    attack: 0.004,
    release: 0.18,
    sustain: false,
    fallback: { type: "triangle", filterType: "lowpass", filterFrequency: 1800, gain: 0.22, attack: 0.012, sustain: 0.36, release: 0.14 },
  },
  40: {
    name: "Violín",
    folder: "violin",
    color: "#9b3c7a",
    gain: 0.72,
    attack: 0.04,
    release: 0.26,
    sustain: true,
    fallback: { type: "sawtooth", filterType: "lowpass", filterFrequency: 2400, gain: 0.13, attack: 0.08, sustain: 0.7, release: 0.25 },
  },
  48: {
    name: "Cuerdas",
    folder: "string_ensemble_1",
    color: "#6f55a3",
    gain: 0.68,
    attack: 0.07,
    release: 0.32,
    sustain: true,
    fallback: { type: "sawtooth", filterType: "lowpass", filterFrequency: 2400, gain: 0.13, attack: 0.08, sustain: 0.7, release: 0.25 },
  },
  52: {
    name: "Coro",
    folder: "choir_aahs",
    color: "#7a6b2f",
    gain: 0.7,
    attack: 0.08,
    release: 0.34,
    sustain: true,
    fallback: { type: "sawtooth", filterType: "lowpass", filterFrequency: 2200, gain: 0.12, attack: 0.09, sustain: 0.72, release: 0.28 },
  },
  73: {
    name: "Flauta",
    folder: "flute",
    color: "#2c7f8f",
    gain: 0.8,
    attack: 0.025,
    release: 0.18,
    sustain: true,
    fallback: { type: "sine", filterType: "bandpass", filterFrequency: 1200, gain: 0.18, attack: 0.03, sustain: 0.56, release: 0.16 },
  },
  80: {
    name: "Lead synth",
    folder: "lead_1_square",
    color: "#c33a2b",
    gain: 0.72,
    attack: 0.005,
    release: 0.12,
    sustain: true,
    fallback: { type: "square", filterType: "lowpass", filterFrequency: 3200, gain: 0.12, attack: 0.01, sustain: 0.64, release: 0.1 },
  },
};

const elements = {
  recordButton: document.getElementById("recordButton"),
  importAudioTopButton: document.getElementById("importAudioTopButton"),
  pauseButton: document.getElementById("pauseButton"),
  stopButton: document.getElementById("stopButton"),
  playVoiceButton: document.getElementById("playVoiceButton"),
  playMidiButton: document.getElementById("playMidiButton"),
  playMidiOnlyButton: document.getElementById("playMidiOnlyButton"),
  stopPlaybackButton: document.getElementById("stopPlaybackButton"),
  recordStatus: document.getElementById("recordStatus"),
  statusText: document.getElementById("statusText"),
  recordTimer: document.getElementById("recordTimer"),
  noteName: document.getElementById("noteName"),
  octaveText: document.getElementById("octaveText"),
  frequencyText: document.getElementById("frequencyText"),
  centsText: document.getElementById("centsText"),
  confidenceText: document.getElementById("confidenceText"),
  tunerNeedle: document.getElementById("tunerNeedle"),
  levelText: document.getElementById("levelText"),
  levelBar: document.getElementById("levelBar"),
  sensitivityRange: document.getElementById("sensitivityRange"),
  minNoteDuration: document.getElementById("minNoteDuration"),
  minNoteDurationLabel: document.getElementById("minNoteDurationLabel"),
  waveCanvas: document.getElementById("waveCanvas"),
  noteCanvas: document.getElementById("noteCanvas"),
  pianoRollCanvas: document.getElementById("pianoRollCanvas"),
  pianoKeys: document.getElementById("pianoKeys"),
  noteList: document.getElementById("noteList"),
  takeList: document.getElementById("takeList"),
  takeTemplate: document.getElementById("takeTemplate"),
  takeCount: document.getElementById("takeCount"),
  noteCount: document.getElementById("noteCount"),
  rangeText: document.getElementById("rangeText"),
  instrumentSelect: document.getElementById("instrumentSelect"),
  instrumentLegend: document.getElementById("instrumentLegend"),
  voiceLayerToggle: document.getElementById("voiceLayerToggle"),
  midiLayerToggle: document.getElementById("midiLayerToggle"),
  tempoScale: document.getElementById("tempoScale"),
  tempoScaleLabel: document.getElementById("tempoScaleLabel"),
  manualNoteSelect: document.getElementById("manualNoteSelect"),
  manualNoteStart: document.getElementById("manualNoteStart"),
  manualNoteDuration: document.getElementById("manualNoteDuration"),
  addNoteButton: document.getElementById("addNoteButton"),
  applyInstrumentButton: document.getElementById("applyInstrumentButton"),
  applyInstrumentAllButton: document.getElementById("applyInstrumentAllButton"),
  removeSelectedNoteButton: document.getElementById("removeSelectedNoteButton"),
  removeLastNoteButton: document.getElementById("removeLastNoteButton"),
  selectedNoteText: document.getElementById("selectedNoteText"),
  importAudioButton: document.getElementById("importAudioButton"),
  audioFileInput: document.getElementById("audioFileInput"),
  importStatus: document.getElementById("importStatus"),
  exportWavButton: document.getElementById("exportWavButton"),
  exportWebmButton: document.getElementById("exportWebmButton"),
  exportMidiButton: document.getElementById("exportMidiButton"),
  exportJsonButton: document.getElementById("exportJsonButton"),
  exportCsvButton: document.getElementById("exportCsvButton"),
  deleteTakeButton: document.getElementById("deleteTakeButton"),
};

const canvas = {
  wave: elements.waveCanvas.getContext("2d"),
  notes: elements.noteCanvas.getContext("2d"),
  piano: elements.pianoRollCanvas.getContext("2d"),
};

const state = {
  audioContext: null,
  mediaStream: null,
  mediaRecorder: null,
  source: null,
  analyser: null,
  processor: null,
  silentGain: null,
  chunks: [],
  pcmChunks: [],
  liveSamples: [],
  takes: [],
  selectedTakeId: null,
  selectedNoteIndex: null,
  currentNotes: [],
  activeSegment: null,
  recordingStartedAt: 0,
  recordedBeforePause: 0,
  pauseStartedAt: 0,
  isRecording: false,
  isPaused: false,
  rafId: null,
  soundfontCache: new Map(),
  playback: {
    voice: null,
    audioBuffer: null,
    nodes: [],
    startedAt: 0,
    offset: 0,
    duration: 0,
    timer: null,
  },
};

function formatTime(seconds) {
  const safe = Math.max(0, seconds || 0);
  const mins = Math.floor(safe / 60);
  const secs = Math.floor(safe % 60);
  const tenths = Math.floor((safe % 1) * 10);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${tenths}`;
}

function noteFromFrequency(frequency) {
  if (!Number.isFinite(frequency) || frequency <= 0) return null;
  const midi = Math.round(A4_MIDI + 12 * Math.log2(frequency / A4_FREQ));
  const exactMidi = A4_MIDI + 12 * Math.log2(frequency / A4_FREQ);
  const cents = Math.round((exactMidi - midi) * 100);
  const nameIndex = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const targetFrequency = A4_FREQ * 2 ** ((midi - A4_MIDI) / 12);
  return {
    midi,
    exactMidi,
    cents,
    name: NOTE_NAMES[nameIndex],
    flatName: NOTE_FLATS[nameIndex],
    octave,
    frequency,
    targetFrequency,
  };
}

function frequencyFromMidi(midi) {
  return A4_FREQ * 2 ** ((midi - A4_MIDI) / 12);
}

function noteLabel(midi) {
  const index = ((midi % 12) + 12) % 12;
  return `${NOTE_NAMES[index]}${Math.floor(midi / 12) - 1}`;
}

function sampleNoteLabel(midi) {
  const noteNames = ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"];
  const index = ((midi % 12) + 12) % 12;
  return `${noteNames[index]}${Math.floor(midi / 12) - 1}`;
}

function currentProgram() {
  return Number(elements.instrumentSelect.value) || 0;
}

function getInstrument(program) {
  return INSTRUMENTS[program] || INSTRUMENTS[0];
}

function noteProgram(note) {
  return Number.isFinite(note?.program) ? note.program : currentProgram();
}

function instrumentName(program) {
  return getInstrument(program).name;
}

function instrumentColor(program) {
  return getInstrument(program).color;
}

function setStatus(mode, text) {
  elements.recordStatus.className = `status-dot ${mode}`;
  elements.statusText.textContent = text;
}

function currentRecordingTime() {
  if (!state.isRecording) return state.recordedBeforePause;
  if (state.isPaused) return state.recordedBeforePause;
  return state.recordedBeforePause + (performance.now() - state.recordingStartedAt) / 1000;
}

function updateTimer() {
  elements.recordTimer.textContent = formatTime(currentRecordingTime());
}

function setControls() {
  const hasTake = Boolean(getSelectedTake());
  elements.recordButton.disabled = state.isRecording;
  elements.pauseButton.disabled = !state.isRecording;
  elements.stopButton.disabled = !state.isRecording;
  elements.pauseButton.innerHTML = state.isPaused
    ? '<span class="icon">▶</span>Reanudar'
    : '<span class="icon">Ⅱ</span>Pausar';
  elements.playVoiceButton.disabled = !hasTake || state.isRecording;
  elements.playMidiButton.disabled = !hasTake || state.isRecording;
  elements.playMidiOnlyButton.disabled = !hasTake || state.isRecording;
  elements.stopPlaybackButton.disabled = !isPlaybackActive();
  elements.importAudioTopButton.disabled = state.isRecording;
  elements.importAudioButton.disabled = state.isRecording;
  elements.addNoteButton.disabled = !hasTake || state.isRecording;
  elements.applyInstrumentButton.disabled = !hasTake || state.isRecording || state.selectedNoteIndex === null;
  elements.applyInstrumentAllButton.disabled = !hasTake || state.isRecording || !getSelectedTake()?.notes.length;
  elements.removeLastNoteButton.disabled = !hasTake || state.isRecording || !getSelectedTake()?.notes.length;
  elements.removeSelectedNoteButton.disabled = !hasTake || state.isRecording || state.selectedNoteIndex === null;
  elements.deleteTakeButton.disabled = !hasTake || state.isRecording;
  [
    elements.exportWavButton,
    elements.exportWebmButton,
    elements.exportMidiButton,
    elements.exportJsonButton,
    elements.exportCsvButton,
  ].forEach((button) => {
    button.disabled = !hasTake;
  });
}

async function ensureAudioContext() {
  if (!state.audioContext || state.audioContext.state === "closed") {
    state.audioContext = new AudioContext();
  }
  if (state.audioContext.state === "suspended") {
    await state.audioContext.resume();
  }
  return state.audioContext;
}

async function startRecording() {
  stopPlayback();
  const audioContext = await ensureAudioContext();
  state.mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
  });
  state.source = audioContext.createMediaStreamSource(state.mediaStream);
  state.analyser = audioContext.createAnalyser();
  state.analyser.fftSize = 4096;
  state.processor = audioContext.createScriptProcessor(4096, 1, 1);
  state.silentGain = audioContext.createGain();
  state.silentGain.gain.value = 0;
  state.source.connect(state.analyser);
  state.source.connect(state.processor);
  state.processor.connect(state.silentGain);
  state.silentGain.connect(audioContext.destination);

  const mimeType = getBestRecorderMimeType();
  state.mediaRecorder = new MediaRecorder(state.mediaStream, mimeType ? { mimeType } : undefined);
  state.chunks = [];
  state.pcmChunks = [];
  state.liveSamples = [];
  state.currentNotes = [];
  state.activeSegment = null;
  state.selectedNoteIndex = null;
  state.recordedBeforePause = 0;
  state.recordingStartedAt = performance.now();
  state.isRecording = true;
  state.isPaused = false;

  state.mediaRecorder.addEventListener("dataavailable", (event) => {
    if (event.data && event.data.size > 0) state.chunks.push(event.data);
  });
  state.mediaRecorder.addEventListener("stop", finalizeRecording);

  state.processor.onaudioprocess = handleAudioProcess;
  state.mediaRecorder.start(250);
  setStatus("recording", "Grabando");
  setControls();
  drawLoop();
}

function getBestRecorderMimeType() {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function pauseOrResumeRecording() {
  if (!state.isRecording || !state.mediaRecorder) return;
  if (state.isPaused) {
    state.isPaused = false;
    state.recordingStartedAt = performance.now();
    state.mediaRecorder.resume();
    setStatus("recording", "Grabando");
  } else {
    state.isPaused = true;
    state.recordedBeforePause = currentRecordingTime();
    state.pauseStartedAt = performance.now();
    state.mediaRecorder.pause();
    closeActiveSegment(state.recordedBeforePause);
    setStatus("paused", "Pausado");
  }
  setControls();
}

function stopRecording() {
  if (!state.isRecording || !state.mediaRecorder) return;
  if (!state.isPaused) {
    state.recordedBeforePause = currentRecordingTime();
  }
  closeActiveSegment(state.recordedBeforePause);
  state.isRecording = false;
  state.isPaused = false;
  state.mediaRecorder.stop();
  cleanupRecordingGraph();
  setStatus("idle", "Procesando");
  setControls();
}

function cleanupRecordingGraph() {
  if (state.processor) {
    state.processor.onaudioprocess = null;
    state.processor.disconnect();
  }
  if (state.silentGain) state.silentGain.disconnect();
  if (state.source) state.source.disconnect();
  if (state.analyser) state.analyser.disconnect();
  if (state.mediaStream) {
    state.mediaStream.getTracks().forEach((track) => track.stop());
  }
  state.processor = null;
  state.silentGain = null;
  state.source = null;
  state.analyser = null;
  state.mediaStream = null;
}

async function finalizeRecording() {
  const duration = state.recordedBeforePause;
  const webmType = state.mediaRecorder?.mimeType || "audio/webm";
  const encodedBlob = new Blob(state.chunks, { type: webmType });
  const pcm = mergeFloat32(state.pcmChunks);
  const wavBlob = encodeWav(pcm, state.audioContext.sampleRate);
  const notes = normalizeNoteSegments(state.currentNotes, duration);
  let audioBuffer;
  try {
    audioBuffer = encodedBlob.size > 0
      ? await decodeBlob(encodedBlob)
      : createAudioBufferFromPcm(pcm, state.audioContext.sampleRate);
  } catch (error) {
    console.warn("No se pudo decodificar el blob de MediaRecorder, usando PCM.", error);
    audioBuffer = createAudioBufferFromPcm(pcm, state.audioContext.sampleRate);
  }
  const take = {
    id: crypto.randomUUID(),
    title: `Toma ${state.takes.length + 1}`,
    createdAt: new Date().toISOString(),
    duration,
    sampleRate: state.audioContext.sampleRate,
    pcm,
    liveSamples: state.liveSamples.slice(),
    notes,
    encodedBlob: encodedBlob.size > 0 ? encodedBlob : wavBlob,
    encodedType: encodedBlob.size > 0 ? webmType : "audio/wav",
    wavBlob,
    audioBuffer,
  };
  state.takes.unshift(take);
  state.selectedTakeId = take.id;
  state.selectedNoteIndex = null;
  state.currentNotes = notes;
  state.mediaRecorder = null;
  renderAll();
  setStatus("idle", "Listo");
  setControls();
}

async function decodeBlob(blob) {
  const audioContext = await ensureAudioContext();
  const arrayBuffer = await blob.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer.slice(0));
}

function createAudioBufferFromPcm(pcm, sampleRate) {
  const audioBuffer = state.audioContext.createBuffer(1, Math.max(1, pcm.length), sampleRate);
  audioBuffer.copyToChannel(pcm.length ? pcm : new Float32Array([0]), 0);
  return audioBuffer;
}

async function importAudioFile() {
  const file = elements.audioFileInput.files?.[0];
  if (!file) return;
  stopPlayback();
  setStatus("idle", "Analizando audio");
  elements.importStatus.textContent = "Decodificando...";
  setControls();
  try {
    const audioContext = await ensureAudioContext();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    const pcm = extractMonoPcm(audioBuffer);
    const liveSamples = createWaveformSamples(pcm);
    elements.importStatus.textContent = "Detectando notas...";
    const notes = analyzePcmNotes(pcm, audioBuffer.sampleRate);
    const wavBlob = encodeWav(pcm, audioBuffer.sampleRate);
    const take = {
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^.]+$/, "") || `Audio ${state.takes.length + 1}`,
      createdAt: new Date().toISOString(),
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      pcm,
      liveSamples,
      notes,
      encodedBlob: file,
      encodedType: file.type || "audio/*",
      sourceFileName: file.name,
      wavBlob,
      audioBuffer,
      imported: true,
    };
    state.takes.unshift(take);
    state.selectedTakeId = take.id;
    state.selectedNoteIndex = null;
    state.currentNotes = notes.slice();
    elements.importStatus.textContent = `${notes.length} notas detectadas`;
    renderAll();
    setStatus("idle", "Listo");
  } catch (error) {
    console.error(error);
    elements.importStatus.textContent = "No se pudo analizar el archivo";
    setStatus("paused", "Error");
  } finally {
    elements.audioFileInput.value = "";
    setControls();
  }
}

function extractMonoPcm(audioBuffer) {
  const length = audioBuffer.length;
  const channels = audioBuffer.numberOfChannels;
  const pcm = new Float32Array(length);
  for (let channel = 0; channel < channels; channel += 1) {
    const data = audioBuffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      pcm[i] += data[i] / channels;
    }
  }
  return pcm;
}

function createWaveformSamples(pcm) {
  const samples = [];
  const step = Math.max(1, Math.floor(pcm.length / 12000));
  for (let i = 0; i < pcm.length; i += step) {
    samples.push(pcm[i]);
  }
  return samples;
}

function analyzePcmNotes(pcm, sampleRate) {
  const notes = [];
  const frameSize = 4096;
  const hopSize = 1024;
  const threshold = Number(elements.sensitivityRange.value);
  const minDuration = Number(elements.minNoteDuration.value) / 1000;
  const totalDuration = pcm.length / sampleRate;
  let active = null;

  for (let offset = 0; offset + frameSize <= pcm.length; offset += hopSize) {
    const frame = pcm.subarray(offset, offset + frameSize);
    const elapsed = offset / sampleRate;
    const frameEnd = Math.min(totalDuration, (offset + hopSize) / sampleRate);
    const rms = calculateRms(frame);
    const pitch = rms >= threshold ? detectPitch(frame, sampleRate) : null;

    if (!pitch || pitch.confidence <= 0.52) {
      active = closeAnalyzedSegment(active, notes, elapsed, minDuration);
      continue;
    }

    const note = noteFromFrequency(pitch.frequency);
    if (!note) {
      active = closeAnalyzedSegment(active, notes, elapsed, minDuration);
      continue;
    }

    if (!active) {
      active = createSegment(note, elapsed, pitch.confidence);
      active.end = frameEnd;
      continue;
    }

    const sameNote = active.midi === note.midi;
    const closeEnough = Math.abs(active.exactMidi - note.exactMidi) < 0.44;
    if (sameNote && closeEnough) {
      active.end = frameEnd;
      active.samples += 1;
      active.avgFrequency += (note.frequency - active.avgFrequency) / active.samples;
      active.avgCents += (note.cents - active.avgCents) / active.samples;
      active.confidence = Math.max(active.confidence, pitch.confidence);
    } else {
      active = closeAnalyzedSegment(active, notes, elapsed, minDuration);
      active = createSegment(note, elapsed, pitch.confidence);
      active.end = frameEnd;
    }
  }

  closeAnalyzedSegment(active, notes, totalDuration, minDuration);
  return normalizeNoteSegments(notes, totalDuration);
}

function closeAnalyzedSegment(segment, notes, endTime, minDuration) {
  if (!segment) return null;
  segment.end = Math.max(segment.end, endTime);
  const duration = segment.end - segment.start;
  if (duration >= minDuration) {
    const previous = notes[notes.length - 1];
    if (previous && previous.midi === segment.midi && segment.start - previous.end < 0.12) {
      previous.end = segment.end;
      previous.avgFrequency = (previous.avgFrequency + segment.avgFrequency) / 2;
      previous.avgCents = (previous.avgCents + segment.avgCents) / 2;
      previous.confidence = Math.max(previous.confidence, segment.confidence);
    } else {
      notes.push({ ...segment });
    }
  }
  return null;
}

function handleAudioProcess(event) {
  if (!state.isRecording || state.isPaused) return;
  const input = event.inputBuffer.getChannelData(0);
  const copy = new Float32Array(input);
  state.pcmChunks.push(copy);
  appendLiveSamples(copy);

  const elapsed = currentRecordingTime();
  const rms = calculateRms(input);
  updateLevel(rms);
  const threshold = Number(elements.sensitivityRange.value);
  const pitch = rms >= threshold ? detectPitch(input, state.audioContext.sampleRate) : null;
  if (pitch && pitch.confidence > 0.52) {
    const note = noteFromFrequency(pitch.frequency);
    updateLiveNote(note, pitch.confidence, elapsed);
  } else {
    updateLiveSilence(elapsed);
  }
}

function appendLiveSamples(samples) {
  const step = Math.max(1, Math.floor(samples.length / 80));
  for (let i = 0; i < samples.length; i += step) {
    state.liveSamples.push(samples[i]);
  }
  const limit = 12000;
  if (state.liveSamples.length > limit) {
    state.liveSamples.splice(0, state.liveSamples.length - limit);
  }
}

function calculateRms(samples) {
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) sum += samples[i] * samples[i];
  return Math.sqrt(sum / samples.length);
}

function updateLevel(rms) {
  const percent = Math.min(100, Math.round(rms * 420));
  elements.levelText.textContent = `${percent}%`;
  elements.levelBar.style.width = `${percent}%`;
}

function updateLiveNote(note, confidence, elapsed) {
  if (!note) return;
  elements.noteName.textContent = note.name;
  elements.octaveText.textContent = `Octava ${note.octave}`;
  elements.frequencyText.textContent = `${note.frequency.toFixed(1)} Hz`;
  elements.centsText.textContent = `${note.cents > 0 ? "+" : ""}${note.cents} cents`;
  elements.confidenceText.textContent = `Señal ${Math.round(confidence * 100)}%`;
  elements.tunerNeedle.style.left = `${Math.max(0, Math.min(100, note.cents + 50))}%`;
  updateActiveSegment(note, elapsed, confidence);
}

function updateLiveSilence(elapsed) {
  elements.confidenceText.textContent = "Señal baja";
  closeActiveSegment(elapsed);
}

function updateActiveSegment(note, elapsed, confidence) {
  if (!state.activeSegment) {
    state.activeSegment = createSegment(note, elapsed, confidence);
    return;
  }

  const sameNote = Math.abs(state.activeSegment.midi - note.midi) <= 0;
  const closeEnough = Math.abs(state.activeSegment.exactMidi - note.exactMidi) < 0.44;
  if (sameNote && closeEnough) {
    state.activeSegment.end = elapsed;
    state.activeSegment.samples += 1;
    state.activeSegment.avgFrequency += (note.frequency - state.activeSegment.avgFrequency) / state.activeSegment.samples;
    state.activeSegment.avgCents += (note.cents - state.activeSegment.avgCents) / state.activeSegment.samples;
    state.activeSegment.confidence = Math.max(state.activeSegment.confidence, confidence);
    return;
  }

  closeActiveSegment(elapsed);
  state.activeSegment = createSegment(note, elapsed, confidence);
}

function createSegment(note, elapsed, confidence) {
  return {
    midi: note.midi,
    exactMidi: note.exactMidi,
    name: note.name,
    flatName: note.flatName,
    octave: note.octave,
    start: elapsed,
    end: elapsed,
    avgFrequency: note.frequency,
    avgCents: note.cents,
    confidence,
    samples: 1,
  };
}

function closeActiveSegment(endTime) {
  if (!state.activeSegment) return;
  const minDuration = Number(elements.minNoteDuration.value) / 1000;
  state.activeSegment.end = Math.max(state.activeSegment.end, endTime);
  const duration = state.activeSegment.end - state.activeSegment.start;
  if (duration >= minDuration) {
    const previous = state.currentNotes[state.currentNotes.length - 1];
    if (previous && previous.midi === state.activeSegment.midi && state.activeSegment.start - previous.end < 0.12) {
      previous.end = state.activeSegment.end;
      previous.avgFrequency = (previous.avgFrequency + state.activeSegment.avgFrequency) / 2;
      previous.avgCents = (previous.avgCents + state.activeSegment.avgCents) / 2;
      previous.confidence = Math.max(previous.confidence, state.activeSegment.confidence);
    } else {
      state.currentNotes.push({ ...state.activeSegment });
    }
  }
  state.activeSegment = null;
}

function normalizeNoteSegments(notes, duration) {
  return notes
    .map((note) => ({
      ...note,
      start: Math.max(0, Math.min(duration, note.start)),
      end: Math.max(0, Math.min(duration, note.end)),
    }))
    .filter((note) => note.end > note.start)
    .sort((a, b) => a.start - b.start);
}

function detectPitch(samples, sampleRate) {
  const buffer = samples.length > SAMPLE_WINDOW ? samples.slice(0, SAMPLE_WINDOW) : samples;
  const rms = calculateRms(buffer);
  if (rms < 0.01) return null;

  let bestOffset = -1;
  let bestCorrelation = 0;
  const minFrequency = 70;
  const maxFrequency = 1100;
  const minOffset = Math.floor(sampleRate / maxFrequency);
  const maxOffset = Math.min(Math.floor(sampleRate / minFrequency), buffer.length - 1);

  for (let offset = minOffset; offset <= maxOffset; offset += 1) {
    let correlation = 0;
    for (let i = 0; i < buffer.length - offset; i += 1) {
      correlation += buffer[i] * buffer[i + offset];
    }
    correlation /= buffer.length - offset;
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestOffset <= 0 || bestCorrelation < 0.002) return null;

  const refinedOffset = refinePeak(buffer, bestOffset, sampleRate);
  const frequency = sampleRate / refinedOffset;
  const confidence = Math.min(1, Math.max(0, bestCorrelation / (rms * rms)));
  if (frequency < minFrequency || frequency > maxFrequency) return null;
  return { frequency, confidence };
}

function refinePeak(buffer, offset) {
  const correlations = [-1, 0, 1].map((delta) => {
    const testOffset = offset + delta;
    if (testOffset <= 0) return 0;
    let correlation = 0;
    for (let i = 0; i < buffer.length - testOffset; i += 1) {
      correlation += buffer[i] * buffer[i + testOffset];
    }
    return correlation / (buffer.length - testOffset);
  });
  const [left, center, right] = correlations;
  const divisor = left - 2 * center + right;
  if (Math.abs(divisor) < 0.000001) return offset;
  return offset + 0.5 * (left - right) / divisor;
}

function mergeFloat32(chunks) {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Float32Array(length);
  let offset = 0;
  chunks.forEach((chunk) => {
    result.set(chunk, offset);
    offset += chunk.length;
  });
  return result;
}

function encodeWav(samples, sampleRate) {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * bytesPerSample, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }
  return new Blob([view], { type: "audio/wav" });
}

function writeString(view, offset, value) {
  for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
}

function renderAll() {
  renderTakes();
  renderSummary();
  renderNoteList();
  renderSelectedNoteState();
  drawWaveform();
  drawNoteMap();
  drawPianoRoll();
  renderPianoKeys();
}

function getSelectedTake() {
  return state.takes.find((take) => take.id === state.selectedTakeId) || null;
}

function renderTakes() {
  elements.takeList.textContent = "";
  state.takes.forEach((take) => {
    const node = elements.takeTemplate.content.firstElementChild.cloneNode(true);
    node.classList.toggle("active", take.id === state.selectedTakeId);
    node.querySelector(".take-title").textContent = take.title;
    node.querySelector(".take-meta").textContent = `${formatTime(take.duration)} · ${take.notes.length} notas`;
    node.addEventListener("click", () => {
      state.selectedTakeId = take.id;
      state.selectedNoteIndex = null;
      state.currentNotes = take.notes.slice();
      renderAll();
      setControls();
    });
    elements.takeList.appendChild(node);
  });
}

function renderSummary() {
  const take = getSelectedTake();
  elements.takeCount.textContent = `${state.takes.length} ${state.takes.length === 1 ? "toma" : "tomas"}`;
  if (!take) {
    elements.noteCount.textContent = "0 notas";
    elements.rangeText.textContent = "Rango --";
    return;
  }
  elements.noteCount.textContent = `${take.notes.length} ${take.notes.length === 1 ? "nota" : "notas"}`;
  if (!take.notes.length) {
    elements.rangeText.textContent = "Rango --";
    return;
  }
  const mids = take.notes.map((note) => note.midi);
  elements.rangeText.textContent = `${noteLabel(Math.min(...mids))} - ${noteLabel(Math.max(...mids))}`;
}

function renderNoteList() {
  const take = getSelectedTake();
  elements.noteList.textContent = "";
  if (!take || !take.notes.length) {
    const empty = document.createElement("div");
    empty.className = "note-chip";
    empty.innerHTML = "<span>Sin notas detectadas</span><strong>--</strong>";
    elements.noteList.appendChild(empty);
    return;
  }
  take.notes.slice(0, 120).forEach((note, index) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "note-chip";
    chip.classList.toggle("selected", state.selectedNoteIndex === index);
    const program = noteProgram(note);
    chip.style.borderLeft = `5px solid ${instrumentColor(program)}`;
    chip.innerHTML = `<span>${formatTime(note.start)} - ${formatTime(note.end)} · ${instrumentName(program)}</span><strong>${note.name}${note.octave}</strong>`;
    chip.addEventListener("click", () => selectNote(index));
    elements.noteList.appendChild(chip);
  });
}

function renderSelectedNoteState() {
  const take = getSelectedTake();
  const selected = take?.notes[state.selectedNoteIndex];
  if (!selected) {
    elements.selectedNoteText.textContent = "Sin nota seleccionada";
    return;
  }
  elements.selectedNoteText.textContent = `${selected.name}${selected.octave} · ${instrumentName(noteProgram(selected))} · ${formatTime(selected.start)} - ${formatTime(selected.end)}`;
}

function selectNote(index) {
  const take = getSelectedTake();
  if (!take || !take.notes[index]) return;
  const note = take.notes[index];
  state.selectedNoteIndex = index;
  elements.manualNoteSelect.value = String(note.midi);
  elements.instrumentSelect.value = String(noteProgram(note));
  elements.manualNoteStart.value = note.start.toFixed(2);
  elements.manualNoteDuration.value = Math.max(0.05, note.end - note.start).toFixed(2);
  renderAll();
  setControls();
}

function populateManualNoteSelect() {
  elements.manualNoteSelect.textContent = "";
  for (let midi = 36; midi <= 84; midi += 1) {
    const option = document.createElement("option");
    option.value = String(midi);
    option.textContent = noteLabel(midi);
    elements.manualNoteSelect.appendChild(option);
  }
  elements.manualNoteSelect.value = "60";
}

function renderInstrumentLegend() {
  elements.instrumentLegend.textContent = "";
  Object.entries(INSTRUMENTS).forEach(([program, instrument]) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "instrument-chip";
    item.innerHTML = `<i style="background:${instrument.color}"></i>${instrument.name}`;
    item.addEventListener("click", () => {
      elements.instrumentSelect.value = program;
    });
    elements.instrumentLegend.appendChild(item);
  });
}

function addManualNote() {
  const take = getSelectedTake();
  if (!take) return;
  const midi = Number(elements.manualNoteSelect.value);
  const start = Math.max(0, Number(elements.manualNoteStart.value) || 0);
  const duration = Math.max(0.05, Number(elements.manualNoteDuration.value) || 0.5);
  const note = createManualNote(midi, start, start + duration, currentProgram());
  take.notes.push(note);
  take.duration = Math.max(take.duration, note.end);
  sortTakeNotes(take);
  state.selectedNoteIndex = take.notes.indexOf(note);
  syncSelectedTakeNotes();
}

function removeSelectedNote() {
  const take = getSelectedTake();
  if (!take || state.selectedNoteIndex === null || !take.notes[state.selectedNoteIndex]) return;
  take.notes.splice(state.selectedNoteIndex, 1);
  state.selectedNoteIndex = null;
  syncSelectedTakeNotes();
}

function removeLastNote() {
  const take = getSelectedTake();
  if (!take || !take.notes.length) return;
  take.notes.pop();
  state.selectedNoteIndex = null;
  syncSelectedTakeNotes();
}

function createManualNote(midi, start, end, program) {
  const note = noteFromFrequency(frequencyFromMidi(midi));
  return {
    midi,
    exactMidi: midi,
    name: note.name,
    flatName: note.flatName,
    octave: note.octave,
    start,
    end,
    avgFrequency: note.targetFrequency,
    avgCents: 0,
    confidence: 1,
    samples: 1,
    program,
    manual: true,
  };
}

function applyInstrumentToSelectedNote() {
  const take = getSelectedTake();
  if (!take || state.selectedNoteIndex === null || !take.notes[state.selectedNoteIndex]) return;
  take.notes[state.selectedNoteIndex].program = currentProgram();
  syncSelectedTakeNotes();
}

function applyInstrumentToAllNotes() {
  const take = getSelectedTake();
  if (!take) return;
  const program = currentProgram();
  take.notes.forEach((note) => {
    note.program = program;
  });
  syncSelectedTakeNotes();
}

function sortTakeNotes(take) {
  take.notes.sort((a, b) => a.start - b.start || a.midi - b.midi);
}

function syncSelectedTakeNotes() {
  const take = getSelectedTake();
  state.currentNotes = take ? take.notes.slice() : [];
  renderAll();
  setControls();
}

function drawLoop() {
  if (!state.isRecording) {
    cancelAnimationFrame(state.rafId);
    drawWaveform();
    drawNoteMap();
    return;
  }
  updateTimer();
  drawWaveform();
  drawNoteMap(true);
  state.rafId = requestAnimationFrame(drawLoop);
}

function setupCanvasScale(canvasElement, context) {
  const rect = canvasElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));
  if (canvasElement.width !== width || canvasElement.height !== height) {
    canvasElement.width = width;
    canvasElement.height = height;
  }
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width: rect.width, height: rect.height };
}

function drawWaveform() {
  const { width, height } = setupCanvasScale(elements.waveCanvas, canvas.wave);
  const ctx = canvas.wave;
  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, width, height);
  const take = getSelectedTake();
  const samples = state.isRecording ? state.liveSamples : take?.liveSamples || [];
  if (!samples.length) {
    drawCenteredText(ctx, width, height, "La onda aparecerá al grabar");
    return;
  }
  ctx.strokeStyle = "#13795b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const step = Math.max(1, Math.floor(samples.length / width));
  for (let x = 0; x < width; x += 1) {
    const index = Math.min(samples.length - 1, Math.floor(x * step));
    const y = height / 2 + samples[index] * height * 0.42;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawNoteMap(isLive = false) {
  const { width, height } = setupCanvasScale(elements.noteCanvas, canvas.notes);
  const ctx = canvas.notes;
  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, width, height);
  const take = getSelectedTake();
  const notes = isLive ? [...state.currentNotes, state.activeSegment].filter(Boolean) : take?.notes || [];
  if (!notes.length) {
    drawCenteredText(ctx, width, height, "Las notas detectadas se mostrarán aquí");
    return;
  }
  drawNotesTimeline(ctx, width, height, notes, isLive ? currentRecordingTime() : take.duration, null, isLive ? null : state.selectedNoteIndex);
}

function drawPianoRoll(progress = null) {
  const { width, height } = setupCanvasScale(elements.pianoRollCanvas, canvas.piano);
  const ctx = canvas.piano;
  ctx.clearRect(0, 0, width, height);
  drawGrid(ctx, width, height);
  const take = getSelectedTake();
  if (!take || !take.notes.length) {
    drawCenteredText(ctx, width, height, "Graba una melodía para activar el modo piano");
    return;
  }
  drawNotesTimeline(ctx, width, height, take.notes, take.duration, progress, state.selectedNoteIndex);
}

function drawGrid(ctx, width, height) {
  ctx.fillStyle = "#fbfcfb";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#e5ebe7";
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawCenteredText(ctx, width, height, text) {
  ctx.fillStyle = "#667078";
  ctx.font = "700 16px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);
}

function drawNotesTimeline(ctx, width, height, notes, duration, progress = null, selectedIndex = null) {
  const midiValues = notes.map((note) => note.midi);
  const minMidi = Math.min(...midiValues) - 1;
  const maxMidi = Math.max(...midiValues) + 1;
  const range = Math.max(1, maxMidi - minMidi);
  const topPad = 26;
  const bottomPad = 26;
  const drawHeight = height - topPad - bottomPad;
  const safeDuration = Math.max(0.25, duration || 0.25);

  ctx.font = "700 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const labels = Array.from(new Set(notes.map((note) => note.midi))).sort((a, b) => b - a);
  labels.forEach((midi) => {
    const y = topPad + ((maxMidi - midi) / range) * drawHeight;
    ctx.fillStyle = "#7a848a";
    ctx.fillText(noteLabel(midi), 8, y);
    ctx.strokeStyle = "#edf1ee";
    ctx.beginPath();
    ctx.moveTo(58, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  });

  notes.forEach((note, index) => {
    const x = 64 + (note.start / safeDuration) * (width - 74);
    const endX = 64 + (note.end / safeDuration) * (width - 74);
    const y = topPad + ((maxMidi - note.midi) / range) * drawHeight;
    ctx.fillStyle = instrumentColor(noteProgram(note));
    roundRect(ctx, x, y - 10, Math.max(6, endX - x), 20, 6);
    ctx.fill();
    if (selectedIndex === index) {
      ctx.strokeStyle = "#1f2328";
      ctx.lineWidth = 2;
      roundRect(ctx, x - 2, y - 12, Math.max(10, endX - x + 4), 24, 7);
      ctx.stroke();
    }
    if (endX - x > 38) {
      ctx.fillStyle = "#fff";
      ctx.fillText(`${note.name}${note.octave}`, x + 7, y);
    }
  });

  if (progress !== null) {
    const x = 64 + (progress / safeDuration) * (width - 74);
    ctx.strokeStyle = "#c33a2b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

function renderPianoKeys(activeMidi = null) {
  const take = getSelectedTake();
  elements.pianoKeys.textContent = "";
  if (!take || !take.notes.length) return;
  const mids = take.notes.map((note) => note.midi);
  const min = Math.min(...mids) - 1;
  const max = Math.max(...mids) + 1;
  for (let midi = max; midi >= min; midi -= 1) {
    const key = document.createElement("div");
    key.className = "piano-key";
    const index = ((midi % 12) + 12) % 12;
    if ([1, 3, 6, 8, 10].includes(index)) key.classList.add("black");
    if (midi === activeMidi) key.classList.add("active");
    key.textContent = noteLabel(midi);
    elements.pianoKeys.appendChild(key);
  }
}

async function playVoiceOnly() {
  const take = getSelectedTake();
  if (!take) return;
  stopPlayback();
  await ensureAudioContext();
  playVoiceLayer(take, 0, Number(elements.tempoScale.value), 1);
  state.playback.duration = take.duration / Number(elements.tempoScale.value);
  startPlaybackTicker(take, false);
}

async function playMidiMode() {
  const take = getSelectedTake();
  if (!take) return;
  stopPlayback();
  await ensureAudioContext();
  const tempoScale = Number(elements.tempoScale.value);
  if (elements.voiceLayerToggle.checked) playVoiceLayer(take, 0, tempoScale, elements.midiLayerToggle.checked ? 0.62 : 1);
  if (elements.midiLayerToggle.checked) {
    setStatus("idle", "Cargando instrumentos");
    await scheduleMidiNotes(take, tempoScale);
  }
  state.playback.duration = take.duration / tempoScale;
  startPlaybackTicker(take, true);
}

async function playMidiOnly() {
  const take = getSelectedTake();
  if (!take) return;
  stopPlayback();
  await ensureAudioContext();
  const tempoScale = Number(elements.tempoScale.value);
  setStatus("idle", "Cargando instrumentos");
  await scheduleMidiNotes(take, tempoScale);
  state.playback.duration = take.duration / tempoScale;
  startPlaybackTicker(take, true);
}

function playVoiceLayer(take, offset = 0, tempoScale = 1, volume = 1) {
  const source = state.audioContext.createBufferSource();
  source.buffer = take.audioBuffer;
  source.playbackRate.value = tempoScale;
  const gain = state.audioContext.createGain();
  gain.gain.value = volume;
  source.connect(gain);
  gain.connect(state.audioContext.destination);
  source.start(state.audioContext.currentTime, offset);
  source.addEventListener("ended", () => {
    if (!state.playback.nodes.length) stopPlayback();
  });
  state.playback.voice = source;
  state.playback.nodes.push(source, gain);
}

async function scheduleMidiNotes(take, tempoScale = 1) {
  const now = state.audioContext.currentTime + 0.04;
  const preparedNotes = await Promise.all(take.notes.map(async (note) => {
    const program = noteProgram(note);
    const instrument = getInstrument(program);
    const sample = await loadNearestSample(instrument, note.midi);
    return { note, program, instrument, sample };
  }));

  preparedNotes.forEach(({ note, program, instrument, sample }) => {
    const start = now + note.start / tempoScale;
    const duration = Math.max(0.06, (note.end - note.start) / tempoScale);
    const nodes = sample
      ? createSampleInstrumentVoice(note.midi, sample, instrument, start, duration)
      : createSyntheticInstrumentVoice(note.midi, program, start, duration);
    state.playback.nodes.push(...nodes);
  });
}

async function loadNearestSample(instrument, midi) {
  const sampleMidi = SAMPLE_MIDIS.reduce((best, candidate) => (
    Math.abs(candidate - midi) < Math.abs(best - midi) ? candidate : best
  ), SAMPLE_MIDIS[0]);
  const cacheKey = `${instrument.folder}:${sampleMidi}`;
  if (state.soundfontCache.has(cacheKey)) {
    return state.soundfontCache.get(cacheKey);
  }

  try {
    const url = `samples/FluidR3_GM/${instrument.folder}/${sampleNoteLabel(sampleMidi)}.mp3`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await state.audioContext.decodeAudioData(arrayBuffer.slice(0));
    const sample = { buffer, midi: sampleMidi };
    state.soundfontCache.set(cacheKey, sample);
    return sample;
  } catch (error) {
    console.warn(`No se pudo cargar sample de ${instrument.name}.`, error);
    state.soundfontCache.set(cacheKey, null);
    return null;
  }
}

function createSampleInstrumentVoice(midi, sample, instrument, start, duration) {
  const source = state.audioContext.createBufferSource();
  const gain = state.audioContext.createGain();
  source.buffer = sample.buffer;
  source.playbackRate.setValueAtTime(frequencyFromMidi(midi) / frequencyFromMidi(sample.midi), start);

  if (instrument.sustain && sample.buffer.duration > 0.4) {
    source.loop = true;
    source.loopStart = Math.min(0.12, sample.buffer.duration * 0.25);
    source.loopEnd = Math.max(source.loopStart + 0.05, sample.buffer.duration - 0.08);
  }

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, instrument.gain), start + instrument.attack);
  gain.gain.setValueAtTime(Math.max(0.0001, instrument.gain * 0.85), Math.max(start + instrument.attack, start + duration - 0.02));
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration + instrument.release);

  source.connect(gain);
  gain.connect(state.audioContext.destination);
  source.start(start);
  source.stop(start + duration + instrument.release + 0.04);
  return [source, gain];
}

function createSyntheticInstrumentVoice(midi, program, start, duration) {
  const frequency = frequencyFromMidi(midi);
  const osc = state.audioContext.createOscillator();
  const gain = state.audioContext.createGain();
  const filter = state.audioContext.createBiquadFilter();
  const settings = getInstrument(program).fallback;
  osc.type = settings.type;
  osc.frequency.setValueAtTime(frequency, start);
  filter.type = settings.filterType;
  filter.frequency.setValueAtTime(settings.filterFrequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(settings.gain, start + settings.attack);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, settings.gain * settings.sustain), start + Math.max(settings.attack + 0.02, duration * 0.72));
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration + settings.release);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(state.audioContext.destination);
  osc.start(start);
  osc.stop(start + duration + settings.release + 0.04);
  return [osc, filter, gain];
}

function instrumentSettings(program) {
  if ([24].includes(program)) {
    return { type: "triangle", filterType: "lowpass", filterFrequency: 1800, gain: 0.22, attack: 0.012, sustain: 0.36, release: 0.14 };
  }
  if ([40, 48, 52].includes(program)) {
    return { type: "sawtooth", filterType: "lowpass", filterFrequency: 2400, gain: 0.13, attack: 0.08, sustain: 0.7, release: 0.25 };
  }
  if ([73].includes(program)) {
    return { type: "sine", filterType: "bandpass", filterFrequency: 1200, gain: 0.18, attack: 0.03, sustain: 0.56, release: 0.16 };
  }
  if ([80].includes(program)) {
    return { type: "square", filterType: "lowpass", filterFrequency: 3200, gain: 0.12, attack: 0.01, sustain: 0.64, release: 0.1 };
  }
  if ([11].includes(program)) {
    return { type: "sine", filterType: "lowpass", filterFrequency: 5000, gain: 0.24, attack: 0.005, sustain: 0.22, release: 0.36 };
  }
  if ([4].includes(program)) {
    return { type: "triangle", filterType: "lowpass", filterFrequency: 4200, gain: 0.2, attack: 0.006, sustain: 0.34, release: 0.18 };
  }
  return { type: "sine", filterType: "lowpass", filterFrequency: 3600, gain: 0.24, attack: 0.006, sustain: 0.32, release: 0.16 };
}

function startPlaybackTicker(take, withPiano) {
  state.playback.startedAt = state.audioContext.currentTime;
  setStatus("idle", "Reproduciendo");
  setControls();
  state.playback.timer = window.setInterval(() => {
    const tempoScale = Number(elements.tempoScale.value);
    const elapsed = (state.audioContext.currentTime - state.playback.startedAt) * tempoScale;
    drawPianoRoll(elapsed);
    if (withPiano) {
      const active = take.notes.find((note) => elapsed >= note.start && elapsed <= note.end);
      renderPianoKeys(active?.midi || null);
    }
    if (elapsed >= take.duration) stopPlayback();
  }, 40);
}

function stopPlayback() {
  if (state.playback.timer) window.clearInterval(state.playback.timer);
  state.playback.timer = null;
  state.playback.nodes.forEach((node) => {
    try {
      if (typeof node.stop === "function") node.stop();
      if (typeof node.disconnect === "function") node.disconnect();
    } catch {
      // Audio nodes can already be stopped by the browser.
    }
  });
  state.playback.nodes = [];
  state.playback.voice = null;
  drawPianoRoll();
  renderPianoKeys();
  if (!state.isRecording) setStatus("idle", "Listo");
  setControls();
}

function isPlaybackActive() {
  return Boolean(state.playback.timer || state.playback.nodes.length);
}

function exportWav() {
  const take = getSelectedTake();
  if (!take) return;
  downloadBlob(take.wavBlob, `${safeName(take.title)}.wav`);
}

function exportWebm() {
  const take = getSelectedTake();
  if (!take) return;
  const originalExtension = take.sourceFileName?.split(".").pop();
  const extension = originalExtension && originalExtension !== take.sourceFileName
    ? originalExtension
    : take.encodedType.includes("ogg")
    ? "ogg"
    : take.encodedType.includes("mp4")
      ? "m4a"
      : take.encodedType.includes("wav")
        ? "wav"
        : "webm";
  downloadBlob(take.encodedBlob, `${safeName(take.title)}.${extension}`);
}

function exportMidi() {
  const take = getSelectedTake();
  if (!take) return;
  const midi = buildMidiFile(take.notes, Number(elements.instrumentSelect.value));
  downloadBlob(new Blob([midi], { type: "audio/midi" }), `${safeName(take.title)}.mid`);
}

function exportJson() {
  const take = getSelectedTake();
  if (!take) return;
  const data = {
    title: take.title,
    createdAt: take.createdAt,
    duration: take.duration,
    sampleRate: take.sampleRate,
    notes: take.notes,
  };
  downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), `${safeName(take.title)}.json`);
}

function exportCsv() {
  const take = getSelectedTake();
  if (!take) return;
  const rows = [
    ["start_seconds", "end_seconds", "duration_seconds", "note", "octave", "midi", "instrument", "program", "avg_frequency", "avg_cents", "confidence"],
    ...take.notes.map((note) => [
      note.start.toFixed(3),
      note.end.toFixed(3),
      (note.end - note.start).toFixed(3),
      note.name,
      note.octave,
      note.midi,
      instrumentName(noteProgram(note)),
      noteProgram(note),
      note.avgFrequency.toFixed(2),
      note.avgCents.toFixed(1),
      note.confidence.toFixed(3),
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  downloadBlob(new Blob([csv], { type: "text/csv" }), `${safeName(take.title)}.csv`);
}

function deleteSelectedTake() {
  const take = getSelectedTake();
  if (!take) return;
  stopPlayback();
  const index = state.takes.findIndex((item) => item.id === take.id);
  if (index >= 0) state.takes.splice(index, 1);
  state.selectedTakeId = state.takes[0]?.id || null;
  state.selectedNoteIndex = null;
  state.currentNotes = getSelectedTake()?.notes.slice() || [];
  elements.importStatus.textContent = state.selectedTakeId ? "Toma eliminada" : "Sin archivo importado";
  renderAll();
  setControls();
}

function csvCell(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function buildMidiFile(notes, program = 0) {
  const events = [];
  const secondsToTicks = (seconds) => Math.round(seconds * (DEFAULT_BPM / 60) * MIDI_PPQ);
  events.push({ tick: 0, data: [0xff, 0x51, 0x03, 0x07, 0xa1, 0x20] });

  const programs = Array.from(new Set(notes.map((note) => Number.isFinite(note.program) ? note.program : program)));
  const channelByProgram = new Map();
  programs.slice(0, 15).forEach((programNumber, index) => {
    const channel = index >= 9 ? index + 1 : index;
    channelByProgram.set(programNumber, channel);
    events.push({ tick: 0, data: [0xc0 | channel, clampByte(programNumber)] });
  });

  notes.forEach((note) => {
    const noteProgramNumber = Number.isFinite(note.program) ? note.program : program;
    const channel = channelByProgram.get(noteProgramNumber) ?? 0;
    const startTick = secondsToTicks(note.start);
    const endTick = Math.max(startTick + 1, secondsToTicks(note.end));
    events.push({ tick: startTick, data: [0x90 | channel, clampByte(note.midi), 92] });
    events.push({ tick: endTick, data: [0x80 | channel, clampByte(note.midi), 0] });
  });
  events.sort((a, b) => a.tick - b.tick || (a.data[0] === 0x80 ? -1 : 1));

  const trackBytes = [];
  let lastTick = 0;
  events.forEach((event) => {
    writeVarLen(trackBytes, event.tick - lastTick);
    trackBytes.push(...event.data);
    lastTick = event.tick;
  });
  writeVarLen(trackBytes, 0);
  trackBytes.push(0xff, 0x2f, 0x00);

  const header = [
    ...asciiBytes("MThd"),
    0x00, 0x00, 0x00, 0x06,
    0x00, 0x00,
    0x00, 0x01,
    (MIDI_PPQ >> 8) & 0xff, MIDI_PPQ & 0xff,
  ];
  const trackHeader = [
    ...asciiBytes("MTrk"),
    (trackBytes.length >> 24) & 0xff,
    (trackBytes.length >> 16) & 0xff,
    (trackBytes.length >> 8) & 0xff,
    trackBytes.length & 0xff,
  ];
  return new Uint8Array([...header, ...trackHeader, ...trackBytes]);
}

function writeVarLen(bytes, value) {
  let buffer = value & 0x7f;
  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= (value & 0x7f) | 0x80;
  }
  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8;
    else break;
  }
}

function asciiBytes(text) {
  return Array.from(text).map((char) => char.charCodeAt(0));
}

function clampByte(value) {
  return Math.max(0, Math.min(127, Math.round(value)));
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

function safeName(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "audionotes";
}

function setupTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach((tab) => tab.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(`${button.dataset.tab}Tab`).classList.add("active");
      renderAll();
    });
  });
}

function setupEvents() {
  elements.recordButton.addEventListener("click", () => startRecording().catch(showError));
  elements.importAudioTopButton.addEventListener("click", () => elements.audioFileInput.click());
  elements.pauseButton.addEventListener("click", pauseOrResumeRecording);
  elements.stopButton.addEventListener("click", stopRecording);
  elements.playVoiceButton.addEventListener("click", () => playVoiceOnly().catch(showError));
  elements.playMidiButton.addEventListener("click", () => playMidiMode().catch(showError));
  elements.playMidiOnlyButton.addEventListener("click", () => playMidiOnly().catch(showError));
  elements.stopPlaybackButton.addEventListener("click", stopPlayback);
  elements.importAudioButton.addEventListener("click", () => elements.audioFileInput.click());
  elements.audioFileInput.addEventListener("change", () => importAudioFile().catch(showError));
  elements.addNoteButton.addEventListener("click", addManualNote);
  elements.applyInstrumentButton.addEventListener("click", applyInstrumentToSelectedNote);
  elements.applyInstrumentAllButton.addEventListener("click", applyInstrumentToAllNotes);
  elements.removeSelectedNoteButton.addEventListener("click", removeSelectedNote);
  elements.removeLastNoteButton.addEventListener("click", removeLastNote);
  elements.exportWavButton.addEventListener("click", exportWav);
  elements.exportWebmButton.addEventListener("click", exportWebm);
  elements.exportMidiButton.addEventListener("click", exportMidi);
  elements.exportJsonButton.addEventListener("click", exportJson);
  elements.exportCsvButton.addEventListener("click", exportCsv);
  elements.deleteTakeButton.addEventListener("click", deleteSelectedTake);
  elements.minNoteDuration.addEventListener("input", () => {
    elements.minNoteDurationLabel.textContent = `${elements.minNoteDuration.value} ms`;
  });
  elements.tempoScale.addEventListener("input", () => {
    elements.tempoScaleLabel.textContent = `${Math.round(Number(elements.tempoScale.value) * 100)}%`;
  });
  window.addEventListener("resize", renderAll);
  window.addEventListener("keydown", handleShortcut);
}

function handleShortcut(event) {
  if (event.repeat || ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
  const key = event.key.toLowerCase();
  if (event.code === "Space") {
    event.preventDefault();
    if (!state.isRecording) startRecording().catch(showError);
    else pauseOrResumeRecording();
  }
  if (key === "r") {
    event.preventDefault();
    if (state.isRecording) stopRecording();
    else startRecording().catch(showError);
  }
  if (key === "p") {
    event.preventDefault();
    if (isPlaybackActive()) stopPlayback();
    else playVoiceOnly().catch(showError);
  }
  if (key === "m") {
    event.preventDefault();
    if (isPlaybackActive()) stopPlayback();
    else playMidiMode().catch(showError);
  }
}

function showError(error) {
  console.error(error);
  setStatus("paused", "Error");
  elements.confidenceText.textContent = error?.message || "No se pudo completar la acción";
  cleanupRecordingGraph();
  state.isRecording = false;
  state.isPaused = false;
  setControls();
}

function bootstrap() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    setStatus("paused", "Navegador no compatible");
    elements.recordButton.disabled = true;
  }
  populateManualNoteSelect();
  renderInstrumentLegend();
  setupTabs();
  setupEvents();
  renderAll();
  setControls();
}

bootstrap();

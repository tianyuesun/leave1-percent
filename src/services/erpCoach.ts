import type { CompulsionKind, Intervention, TriggerKind } from '@/types';

type AiIntervention = Pick<
  Intervention,
  | 'mechanism'
  | 'uncertaintyMessage'
  | 'leaveOnePercentAction'
  | 'returnToLifeLabel'
>;

const aiFields: (keyof AiIntervention)[] = [
  'mechanism',
  'uncertaintyMessage',
  'leaveOnePercentAction',
  'returnToLifeLabel',
];

const actions: Record<CompulsionKind, string> = {
  'Washing or cleaning': 'Wait one minute before washing.',
  Checking: 'Walk away without checking again.',
  'Seeking reassurance': 'Leave one question unanswered.',
  'Mental reviewing': 'Stop the review and continue what you were doing.',
  Avoiding: 'Take one small step toward the task.',
};

const uncertainties: Record<CompulsionKind, string> = {
  'Washing or cleaning': 'Maybe it is clean enough.\nMaybe it is not.\nLeave 1% of that uncertainty this time.',
  Checking: 'Maybe it is settled.\nMaybe it is not.\nLeave one check unfinished this time.',
  'Seeking reassurance': 'Maybe an answer would feel final.\nMaybe it would not.\nLeave this question unanswered.',
  'Mental reviewing': 'Maybe the memory is complete.\nMaybe it is not.\nLeave 1% unresolved this time.',
  Avoiding: 'Maybe the next step will feel difficult.\nMaybe it will not.\nMove forward without deciding first.',
};

const mechanisms: Record<CompulsionKind, string> = {
  'Washing or cleaning': 'Contamination fear is turning an uncomfortable feeling into a demand for certainty.',
  Checking: 'The checking urge is asking memory to provide certainty it cannot provide.',
  'Seeking reassurance': 'Reassurance seeking is asking for an answer that feels completely final.',
  'Mental reviewing': 'Mental reviewing is trying to turn an uncertain memory or thought into certainty.',
  Avoiding: 'Avoidance is asking the discomfort to disappear before you continue.',
};

const capabilities: Record<CompulsionKind, string> = {
  'Washing or cleaning': 'Pausing before washing',
  Checking: 'Leaving a check unfinished',
  'Seeking reassurance': 'Leaving a question unanswered',
  'Mental reviewing': 'Letting a thought stay unresolved',
  Avoiding: 'Moving forward with uncertainty',
};

const reassurancePattern =
  /\b(you are safe|you're safe|probably safe|definitely safe|nothing to worry about|everything is fine|no risk|guaranteed)\b/i;
const diagnosisPattern = /\b(you have|diagnosed with|diagnosis|medical condition|mental illness)\b/i;
const safetyAssessmentPattern =
  /\b(safe|unsafe|danger|hazard|emergency|medical advice|doctor|hospital|emergency services|poison control|call 911|call 999|call 112)\b/i;
const unsafeActionPattern =
  /\b(eat|drink|ingest|swallow|drive|operate|climb|cross|handle a weapon|mix chemicals|take medication|stop medication|change (?:a |your )?dose|enter traffic)\b/i;

export function planForCompulsion(compulsion: CompulsionKind) {
  return {
    mechanism: mechanisms[compulsion],
    leaveOnePercentAction: actions[compulsion],
    uncertaintyMessage: uncertainties[compulsion],
    capability: capabilities[compulsion],
  };
}

function detectCompulsion(trigger: string, kind: TriggerKind): CompulsionKind {
  const text = `${kind} ${trigger}`.toLowerCase();

  if (kind === 'Contamination') return 'Washing or cleaning';
  if (kind === 'Checking') return 'Checking';
  if (kind === 'Intrusive thought' || kind === 'Just-right feeling') return 'Mental reviewing';
  if (/wash|clean|germ|dirty|contamin|touch/.test(text)) return 'Washing or cleaning';
  if (/check|lock|door|stove|switch|mistake/.test(text)) return 'Checking';
  if (/ask|tell me|reassur|google|search|confirm/.test(text)) return 'Seeking reassurance';
  if (/avoid|leave|cancel|escape/.test(text)) return 'Avoiding';
  return 'Mental reviewing';
}

function mechanismFor(trigger: string, kind: TriggerKind, compulsion: CompulsionKind) {
  const text = trigger.toLowerCase();
  if (/remember|memory|recall|forgot|forget/.test(text)) {
    return 'Memory uncertainty is driving the urge to review or check until the memory feels complete.';
  }
  if (/responsib|fault|blame|harm|mistake/.test(text)) {
    return 'Responsibility fear is demanding proof that every possible mistake was prevented.';
  }
  if (kind === 'Just-right feeling') {
    return '“Just right” discomfort is demanding a complete feeling before you move on.';
  }
  if (kind === 'Intrusive thought') {
    return 'The intrusive thought feels important because the mind is demanding certainty about what it means.';
  }
  return mechanisms[compulsion];
}

function actionFor(trigger: string, compulsion: CompulsionKind) {
  const text = trigger.toLowerCase();
  if (/tissue|sanitary pad|period pad/.test(text)) return 'Keep using the tissues and sanitary pad.';
  if (/phone/.test(text) && compulsion === 'Washing or cleaning') return 'Keep using the phone without cleaning it.';
  if (/door|lock/.test(text) && compulsion === 'Checking') return 'Walk away without checking the door again.';
  if (/message|email|text|send/.test(text)) return 'Continue without rereading the message.';
  return actions[compulsion];
}

function returnLabelFor(trigger: string) {
  const text = trigger.toLowerCase();
  if (/bed|sleep|night/.test(text)) return 'Go to bed';
  if (/evening|tonight/.test(text)) return 'Continue my evening';
  if (/work|task|project/.test(text)) return 'Continue my task';
  if (/door|lock|leave/.test(text)) return 'Walk away';
  return 'Return to life';
}

function deterministicIntervention(trigger: string, kind: TriggerKind): Intervention {
  const compulsion = detectCompulsion(trigger, kind);

  return {
    safetyStatus: 'safe',
    safetyMessage: 'No immediate action was selected at the Safety Gate.',
    mechanism: mechanismFor(trigger, kind, compulsion),
    uncertaintyMessage: uncertainties[compulsion],
    leaveOnePercentAction: actionFor(trigger, compulsion),
    returnToLifeLabel: returnLabelFor(trigger),
    compulsion,
    capability: capabilities[compulsion],
    source: 'mock',
  };
}

function normalizeText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const text = value.replace(/\r\n/g, '\n').trim();
  if (!text || text.length > maxLength || text.includes('?')) return null;
  return text;
}

function normalizeAiIntervention(value: unknown): AiIntervention | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  if (keys.length !== aiFields.length || aiFields.some((field) => !keys.includes(field))) return null;

  const mechanism = normalizeText(record.mechanism, 220);
  const uncertaintyMessage = normalizeText(record.uncertaintyMessage, 240);
  const leaveOnePercentAction = normalizeText(record.leaveOnePercentAction, 120);
  const returnToLifeLabel = normalizeText(record.returnToLifeLabel, 40);
  if (!mechanism || !uncertaintyMessage || !leaveOnePercentAction || !returnToLifeLabel) return null;

  const content = `${mechanism}\n${uncertaintyMessage}\n${leaveOnePercentAction}\n${returnToLifeLabel}`;
  if (
    reassurancePattern.test(content) ||
    diagnosisPattern.test(content) ||
    safetyAssessmentPattern.test(content) ||
    unsafeActionPattern.test(`${leaveOnePercentAction}\n${returnToLifeLabel}`)
  ) {
    return null;
  }

  return {
    mechanism,
    uncertaintyMessage,
    leaveOnePercentAction,
    returnToLifeLabel,
  };
}

export async function createIntervention(
  trigger: string,
  kind: TriggerKind,
  humanSafetyGate: 'no_immediate_danger_reported',
): Promise<Intervention> {
  const fallback = deterministicIntervention(trigger, kind);
  const endpoint = process.env.EXPO_PUBLIC_ERP_API_URL;

  if (!endpoint) return fallback;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trigger,
        triggerKind: kind,
        humanSafetyGate,
        localCompulsionSignal: fallback.compulsion,
      }),
      signal: controller.signal,
    });

    if (!response.ok) return fallback;
    const generated = normalizeAiIntervention(await response.json());
    if (!generated) return fallback;

    return {
      safetyStatus: 'safe',
      safetyMessage: 'No immediate action was selected at the Safety Gate.',
      ...generated,
      compulsion: fallback.compulsion,
      capability: fallback.capability,
      source: 'openai',
    };
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

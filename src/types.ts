export type TriggerKind =
  | 'Contamination'
  | 'Checking'
  | 'Intrusive thought'
  | 'Just-right feeling'
  | 'Something else';

export type CompulsionKind =
  | 'Washing or cleaning'
  | 'Checking'
  | 'Seeking reassurance'
  | 'Mental reviewing'
  | 'Avoiding';

export type SafetyStatus = 'safe' | 'unsafe' | 'unclear';

export type Intervention = {
  safetyStatus: SafetyStatus;
  safetyMessage: string;
  mechanism: string;
  uncertaintyMessage: string;
  leaveOnePercentAction: string;
  returnToLifeLabel: string;
  compulsion: CompulsionKind;
  capability: string;
  source: 'mock' | 'openai';
};

export type InterventionDraft = {
  trigger: string;
  triggerKind: TriggerKind;
  compulsion: CompulsionKind;
  safetyStatus: SafetyStatus;
  safetyMessage: string;
  mechanism: string;
  uncertaintyMessage: string;
  leaveOnePercentAction: string;
  returnToLifeLabel: string;
  capability: string;
};

export type InterventionEntry = InterventionDraft & {
  id: string;
  completedAt: string;
  returnTo: string;
};

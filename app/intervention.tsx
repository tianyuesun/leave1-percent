import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, Text, TextInput, View } from 'react-native';

import { Card } from '@/components/Card';
import { InterventionCard } from '@/components/InterventionCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { StepScaffold } from '@/components/StepScaffold';
import { createIntervention, planForCompulsion } from '@/services/erpCoach';
import { useLeaveOne } from '@/state/LeaveOneProvider';
import { colors } from '@/theme';
import type { CompulsionKind, Intervention, TriggerKind } from '@/types';

type Stage = 'trigger' | 'safety' | 'recognition' | 'leave' | 'return' | 'danger';

const triggerKinds: TriggerKind[] = [
  'Contamination',
  'Checking',
  'Intrusive thought',
  'Just-right feeling',
  'Something else',
];

const compulsionKinds: CompulsionKind[] = [
  'Washing or cleaning',
  'Checking',
  'Seeking reassurance',
  'Mental reviewing',
  'Avoiding',
];

const returnChoices = [
  'Continue what I was doing',
  'Start the next small task',
  'Be with someone—without asking',
];

const immediateActionExamples = [
  'Needle-stick injury',
  'Blood or body fluid exposure',
  'Hazardous chemical exposure',
  'An acute medical emergency',
];

function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      className={`min-h-14 flex-row items-center rounded-2xl border px-4 py-3 ${selected ? 'border-sage bg-sage-soft' : 'border-line bg-paper'}`}
      onPress={() => {
        void Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.82 : 1,
        transform: [{ scale: pressed ? 0.988 : 1 }],
      })}
    >
      <Text className={`flex-1 text-[16px] font-medium ${selected ? 'text-sage-dark' : 'text-ink'}`}>{label}</Text>
      <View className={`h-5 w-5 items-center justify-center rounded-full border ${selected ? 'border-sage bg-sage' : 'border-line'}`}>
        {selected ? <Ionicons name="checkmark" size={14} color="white" /> : null}
      </View>
    </Pressable>
  );
}

export default function InterventionScreen() {
  const router = useRouter();
  const { addEntry } = useLeaveOne();
  const [stage, setStage] = useState<Stage>('trigger');
  const [trigger, setTrigger] = useState('');
  const [triggerKind, setTriggerKind] = useState<TriggerKind | null>(null);
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);

  const triggerReady = trigger.trim().length >= 3 && triggerKind !== null;
  const step = useMemo(() => {
    if (stage === 'trigger') return 1;
    if (stage === 'safety' || stage === 'danger') return 2;
    if (stage === 'recognition') return 3;
    if (stage === 'leave') return 4;
    return 5;
  }, [stage]);

  async function continueFromSafety() {
    if (!triggerKind || isGenerating) return;
    setStage('recognition');
    setIsGenerating(true);
    const result = await createIntervention(
      trigger.trim(),
      triggerKind,
      'no_immediate_danger_reported',
    );
    setIntervention(result);
    setIsGenerating(false);
  }

  function chooseCompulsion(compulsion: CompulsionKind) {
    const plan = planForCompulsion(compulsion);
    setIntervention((current) =>
      current
        ? {
            ...current,
            ...plan,
            compulsion,
          }
        : current,
    );
  }

  async function finish(returnTo: string) {
    if (!triggerKind || !intervention || isCompleting || intervention.safetyStatus !== 'safe') return;
    setIsCompleting(true);
    setCompletionError(null);
    try {
      await addEntry({
        trigger: trigger.trim(),
        triggerKind,
        compulsion: intervention.compulsion,
        safetyStatus: intervention.safetyStatus,
        safetyMessage: intervention.safetyMessage,
        mechanism: intervention.mechanism,
        uncertaintyMessage: intervention.uncertaintyMessage,
        leaveOnePercentAction: intervention.leaveOnePercentAction,
        returnToLifeLabel: intervention.returnToLifeLabel,
        capability: intervention.capability,
        returnTo,
      });
      router.replace('/complete');
    } catch {
      setIsCompleting(false);
      setCompletionError('Could not save this choice. Try once more.');
    }
  }

  if (stage === 'trigger') {
    return (
      <StepScaffold
        eyebrow="Trigger"
        title="What happened?"
        subtitle="A few words are enough. We will not analyze the story."
        step={step}
        footer={
          <PrimaryButton
            label="Continue"
            disabled={!triggerReady}
            onPress={() => {
              Keyboard.dismiss();
              setStage('safety');
            }}
          />
        }
      >
        <TextInput
          accessibilityLabel="Describe the trigger"
          autoFocus
          className="min-h-28 rounded-card border border-line bg-paper px-5 py-4 text-[17px] leading-6 text-ink"
          maxLength={140}
          multiline
          onChangeText={setTrigger}
          placeholder="I touched a door handle…"
          placeholderTextColor="#9B9F9A"
          textAlignVertical="top"
          value={trigger}
        />
        <Text className="mb-4 mt-7 text-[14px] font-semibold text-ink">Closest fit</Text>
        <View className="gap-2.5">
          {triggerKinds.map((kind) => (
            <Choice key={kind} label={kind} selected={triggerKind === kind} onPress={() => setTriggerKind(kind)} />
          ))}
        </View>
      </StepScaffold>
    );
  }

  if (stage === 'safety') {
    return (
      <StepScaffold
        eyebrow="Safety gate"
        title="Does this situation require immediate action to keep you safe?"
        subtitle="First decide whether this needs immediate real-world action. If not, we'll work on the uncertainty together."
        step={step}
        onBack={() => setStage('trigger')}
      >
        <View className="mb-5 rounded-card border border-line bg-paper px-5 py-4">
          <Text className="text-[14px] font-semibold text-ink">Examples include</Text>
          <View className="mt-3 gap-2.5">
            {immediateActionExamples.map((example) => (
              <View key={example} className="flex-row items-start">
                <View className="mr-3 mt-2 h-1.5 w-1.5 rounded-full bg-earth" />
                <Text className="flex-1 text-[15px] leading-5 text-muted">{example}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="gap-3">
          <Pressable
            accessibilityLabel="Needs immediate action"
            accessibilityRole="button"
            className="rounded-card border border-[#D8B8AC] bg-blush p-5"
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setIntervention(null);
              setStage('danger');
            }}
            style={({ pressed }) => ({
              opacity: pressed ? 0.82 : 1,
              transform: [{ scale: pressed ? 0.99 : 1 }],
            })}
          >
            <View className="flex-row items-center">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-blush">
                <Ionicons name="warning-outline" size={22} color="#8D5F50" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-[17px] font-semibold text-ink">Needs immediate action</Text>
                <Text className="mt-1 text-[14px] text-muted">Pause the uncertainty practice and handle it first.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </View>
          </Pressable>
          <Pressable
            accessibilityLabel="No immediate action needed"
            accessibilityRole="button"
            className="rounded-card border border-line bg-paper p-5"
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void continueFromSafety();
            }}
            style={({ pressed }) => ({
              opacity: pressed ? 0.82 : 1,
              transform: [{ scale: pressed ? 0.99 : 1 }],
            })}
          >
            <View className="flex-row items-center">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-sage">
                <Ionicons name="leaf-outline" size={22} color="white" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-[17px] font-semibold text-sage-dark">No immediate action needed</Text>
                <Text className="mt-1 text-[14px] text-muted">Continue to Leave 1%.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.sageDark} />
            </View>
          </Pressable>
        </View>
      </StepScaffold>
    );
  }

  if (stage === 'danger') {
    return (
      <StepScaffold
        eyebrow="Safety first"
        title="Handle the real-world situation first."
        step={step}
        onBack={() => setStage('safety')}
      >
        <Card>
          <View className="h-12 w-12 items-center justify-center rounded-full bg-blush">
            <Ionicons name="shield-checkmark-outline" size={24} color="#8D5F50" />
          </View>
          <Text className="mt-5 text-[19px] font-semibold text-ink">
            Pause Leave 1%.
          </Text>
          <Text className="mt-2 text-[16px] leading-6 text-muted">
            Take the immediate action needed to keep yourself safe. Contact local emergency services if the situation is acute.
          </Text>
        </Card>
        <View className="mt-6">
          <PrimaryButton
            label="Leave and take action"
            onPress={() => router.replace('/')}
          />
        </View>
      </StepScaffold>
    );
  }

  if (stage === 'recognition') {
    return (
      <StepScaffold
        eyebrow="Compulsion recognition"
        title="What is the urge asking you to do?"
        subtitle="Name the loop. Do not solve the uncertainty."
        step={step}
        onBack={() => setStage('safety')}
        footer={
          <PrimaryButton
            label="That’s the loop"
            disabled={!intervention || isGenerating}
            onPress={() => setStage('leave')}
          />
        }
      >
        {isGenerating || !intervention ? (
          <Card className="items-center py-10">
            <ActivityIndicator color={colors.sage} />
            <Text className="mt-4 text-[15px] text-muted">Finding the smallest pattern…</Text>
          </Card>
        ) : (
          <View className="gap-2.5">
            {compulsionKinds.map((kind) => (
              <Choice
                key={kind}
                label={kind}
                selected={intervention.compulsion === kind}
                onPress={() => chooseCompulsion(kind)}
              />
            ))}
            <Text className="mt-3 text-center text-[12px] text-muted">
              Suggested from your words. You stay in control.
            </Text>
          </View>
        )}
      </StepScaffold>
    );
  }

  if (stage === 'leave') {
    return (
      <StepScaffold
        eyebrow="Leave 1%"
        title="One clear next step."
        subtitle="Read once. Act once. Then return to life."
        step={step}
        onBack={() => setStage('recognition')}
        footer={
          <PrimaryButton
            label={intervention?.returnToLifeLabel ?? 'Preparing…'}
            disabled={!intervention || isGenerating}
            onPress={() => setStage('return')}
          />
        }
      >
        {intervention ? <InterventionCard intervention={intervention} /> : null}
      </StepScaffold>
    );
  }

  return (
    <StepScaffold
      eyebrow="Return to life"
      title="Where will you go now?"
      subtitle="Choose once. Then close the app."
      step={step}
      onBack={() => setStage('leave')}
    >
      <View className="gap-3">
        {returnChoices.map((choice, index) => (
          <Pressable
            key={choice}
            accessibilityLabel={choice}
            accessibilityRole="button"
            className="min-h-20 flex-row items-center rounded-card border border-line bg-paper px-5 py-4"
            disabled={isCompleting}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              void finish(choice);
            }}
            style={({ pressed }) => ({
              opacity: isCompleting ? 0.52 : pressed ? 0.82 : 1,
              transform: [{ scale: pressed ? 0.99 : 1 }],
            })}
          >
            <View className="h-11 w-11 items-center justify-center rounded-full bg-sage-soft">
              <Ionicons name={index === 0 ? 'arrow-forward' : index === 1 ? 'footsteps-outline' : 'people-outline'} size={21} color={colors.sageDark} />
            </View>
            <Text className="ml-4 flex-1 text-[16px] font-semibold leading-5 text-ink">{choice}</Text>
            {isCompleting ? <ActivityIndicator color={colors.sage} /> : <Ionicons name="chevron-forward" size={20} color={colors.muted} />}
          </Pressable>
        ))}
      </View>
      {completionError ? (
        <Text accessibilityLiveRegion="polite" className="mt-5 text-center text-[14px] font-medium text-[#8D5F50]">
          {completionError}
        </Text>
      ) : null}
      <Text className="mt-6 text-center text-[13px] leading-5 text-muted">You do not need to check how you feel first.</Text>
    </StepScaffold>
  );
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { InterventionEntry } from '@/types';

const STORAGE_KEY = '@leave1/interventions/v1';

type LeaveOneContextValue = {
  history: InterventionEntry[];
  isHydrated: boolean;
  addEntry: (entry: Omit<InterventionEntry, 'id' | 'completedAt'>) => Promise<InterventionEntry>;
};

const LeaveOneContext = createContext<LeaveOneContextValue | null>(null);

export function LeaveOneProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<InterventionEntry[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!mounted || !stored) return;
        const parsed = JSON.parse(stored) as InterventionEntry[];
        if (Array.isArray(parsed)) setHistory(parsed);
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) setIsHydrated(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const addEntry = useCallback(
    async (entry: Omit<InterventionEntry, 'id' | 'completedAt'>) => {
      const completed: InterventionEntry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        completedAt: new Date().toISOString(),
      };
      const next = [completed, ...history].slice(0, 100);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setHistory(next);
      return completed;
    },
    [history],
  );

  const value = useMemo(
    () => ({ history, isHydrated, addEntry }),
    [addEntry, history, isHydrated],
  );

  return <LeaveOneContext.Provider value={value}>{children}</LeaveOneContext.Provider>;
}

export function useLeaveOne() {
  const value = useContext(LeaveOneContext);
  if (!value) throw new Error('useLeaveOne must be used inside LeaveOneProvider');
  return value;
}

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppState, AppAction, Venue, AccessibilityProfile, Route, Barrier, RecentRoute, DashboardAlert } from '@/types';
import { generateId } from '@/lib/utils';

const initialState: AppState = {
  selectedVenue: null,
  selectedProfile: null,
  currentRoute: null,
  barriers: [],
  recentRoutes: [],
  alerts: [
    {
      id: 'alert-1',
      type: 'info',
      title: 'Welcome to AccessLens AI',
      message: 'Select a venue and your accessibility profile to get started with accessible navigation.',
      venueId: '',
      timestamp: new Date(),
    },
  ],
  voiceEnabled: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VENUE':
      return { ...state, selectedVenue: action.payload, currentRoute: null };
    case 'SET_PROFILE':
      return { ...state, selectedProfile: action.payload };
    case 'SET_ROUTE':
      return { ...state, currentRoute: action.payload };
    case 'ADD_BARRIER':
      return { ...state, barriers: [...state.barriers, action.payload] };
    case 'REMOVE_BARRIER':
      return {
        ...state,
        barriers: state.barriers.filter(b => b.id !== action.payload),
      };
    case 'ADD_RECENT_ROUTE':
      return {
        ...state,
        recentRoutes: [action.payload, ...state.recentRoutes].slice(0, 10),
      };
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts].slice(0, 20),
      };
    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(a => a.id !== action.payload),
      };
    case 'TOGGLE_VOICE':
      return { ...state, voiceEnabled: !state.voiceEnabled };
    case 'CLEAR_ROUTE':
      return { ...state, currentRoute: null };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  setVenue: (venue: Venue) => void;
  setProfile: (profile: AccessibilityProfile) => void;
  setRoute: (route: Route | null) => void;
  addBarrier: (barrier: Omit<Barrier, 'id' | 'reportedAt' | 'active'>) => void;
  removeBarrier: (id: string) => void;
  addRecentRoute: (route: Omit<RecentRoute, 'id' | 'timestamp'>) => void;
  addAlert: (alert: Omit<DashboardAlert, 'id' | 'timestamp'>) => void;
  removeAlert: (id: string) => void;
  toggleVoice: () => void;
  clearRoute: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setVenue = (venue: Venue) => dispatch({ type: 'SET_VENUE', payload: venue });
  const setProfile = (profile: AccessibilityProfile) => dispatch({ type: 'SET_PROFILE', payload: profile });
  const setRoute = (route: Route | null) => dispatch({ type: 'SET_ROUTE', payload: route });
  
  const addBarrier = (barrier: Omit<Barrier, 'id' | 'reportedAt' | 'active'>) => {
    const fullBarrier: Barrier = {
      ...barrier,
      id: generateId(),
      reportedAt: new Date(),
      active: true,
    };
    dispatch({ type: 'ADD_BARRIER', payload: fullBarrier });
    dispatch({
      type: 'ADD_ALERT',
      payload: {
        id: generateId(),
        type: 'warning',
        title: 'Barrier Reported',
        message: `${barrier.description} — routes will be recalculated.`,
        venueId: barrier.venueId,
        timestamp: new Date(),
      },
    });
  };

  const removeBarrier = (id: string) => dispatch({ type: 'REMOVE_BARRIER', payload: id });
  const addRecentRoute = (route: Omit<RecentRoute, 'id' | 'timestamp'>) =>
    dispatch({ type: 'ADD_RECENT_ROUTE', payload: { ...route, id: generateId(), timestamp: new Date() } });
  const addAlert = (alert: Omit<DashboardAlert, 'id' | 'timestamp'>) =>
    dispatch({ type: 'ADD_ALERT', payload: { ...alert, id: generateId(), timestamp: new Date() } });
  const removeAlert = (id: string) => dispatch({ type: 'REMOVE_ALERT', payload: id });
  const toggleVoice = () => dispatch({ type: 'TOGGLE_VOICE' });
  const clearRoute = () => dispatch({ type: 'CLEAR_ROUTE' });

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        setVenue,
        setProfile,
        setRoute,
        addBarrier,
        removeBarrier,
        addRecentRoute,
        addAlert,
        removeAlert,
        toggleVoice,
        clearRoute,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

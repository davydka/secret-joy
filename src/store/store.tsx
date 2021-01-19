import create from 'zustand';

type State = {
  currentTime: number;
  setCurrentTime: (time: number) => void;
};

export const useStore = create<State>(set => ({
  currentTime: 0,
  setCurrentTime: time => set({ currentTime: time }),
}));

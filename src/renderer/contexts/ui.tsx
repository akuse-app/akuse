import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';
import { useStorage } from '../hooks/storage';

const UIContext = createContext<{
  viewerId: number | null;
  setViewerId: (value: number) => void;
  hasListUpdated: boolean;
  setHasListUpdated: (value: boolean) => void;
}>({
  viewerId: null,
  setViewerId: () => {},
  hasListUpdated: false,
  setHasListUpdated: () => {},
});

export function useUIContext() {
  return useContext(UIContext);
}

export function UIProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [viewerId, setViewerId] = useState<number | null>(null);
  const [hasListUpdated, setHasListUpdated] = useState<boolean>(false);

  return (
    <UIContext.Provider
      value={{ viewerId, setViewerId, hasListUpdated, setHasListUpdated }}
    >
      {children}
    </UIContext.Provider>
  );
}

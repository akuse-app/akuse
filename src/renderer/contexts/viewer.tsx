import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';
import { useStorage } from '../hooks/storage';

const ViewerContext = createContext<{
  viewerId: number | null;
  setViewerId: (value: number) => void;
}>({ viewerId: null, setViewerId: () => {} });

export function useViewerContext() {
  return useContext(ViewerContext);
}

export function ViewerProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [viewerId, setViewerId] = useState<number | null>(null);

  return (
    <ViewerContext.Provider value={{ viewerId, setViewerId }}>
      {children}
    </ViewerContext.Provider>
  );
}

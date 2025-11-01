
import { useState, useMemo, useRef, useCallback } from 'react';

interface ArrayConvertible<U> {
  toArray(): U[];
}

export const useDataStructure = <T extends ArrayConvertible<U>, U>(
  initialDataStructureFactory: () => T
) => {
  const dsRef = useRef<T>(initialDataStructureFactory());
  const [version, setVersion] = useState(0);

  const forceUpdate = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const dsAsArray = useMemo(() => {
    return dsRef.current.toArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  return { ds: dsRef.current, forceUpdate, dsAsArray };
};

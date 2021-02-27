import { useRef } from "react";

export function usePrevIsFalsey<S>(data: S) {
  const ref = useRef(data);
  if (data !== null && data !== undefined) {
    ref.current = data;
  }
  return ref.current;
}

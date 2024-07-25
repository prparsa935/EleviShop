import { useEffect, useRef } from "react";

function useDidUpdateEffect(fn, inputs) {
    const isMountingRef = useRef(false);
  
    useEffect(() => {
      isMountingRef.current = true;
    }, []);
  
    useEffect(() => {
      if (!isMountingRef.current) {
        return fn();
      } else {
        isMountingRef.current = false;
      }
    }, inputs);
  }
export default useDidUpdateEffect
import { Box, BoxProps } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface Props<D = unknown> extends BoxProps {
  data: D[];
  renderItem: (data: D, ref: (el: HTMLElement | null) => void) => JSX.Element;
  options?: IntersectionObserverInit;
  onChange: (() => void) | (() => Promise<void>);
}

export function InfiniteScrool({
  data,
  onChange,
  options,
  renderItem,
  ...props
}: Props) {
  const onChangeObserver = () => {
    onChange();
  };

  const observer = useRef(
    new IntersectionObserver(
      onChangeObserver,
      options ?? { rootMargin: "200px" }
    )
  );
  const [lastElement, setLastElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const currentEl = lastElement;
    const currentObserver = observer.current;
    if (currentEl) currentObserver.observe(currentEl);
    return () => {
      if (currentEl) currentObserver.unobserve(currentEl);
    };
  }, [lastElement]);

  return <Box {...props}>{data.map((v) => renderItem(v, setLastElement))}</Box>;
}

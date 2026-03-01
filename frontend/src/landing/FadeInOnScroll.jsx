import { useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';

/**
 * Wrapper component that fades-in + slides-up its children when they enter the viewport.
 *
 * Props:
 *  - delay (ms): extra delay before the animation starts (default 0)
 *  - duration (ms): animation duration (default 700)
 *  - distance (px): how far the element slides up from (default 32)
 *  - threshold: IntersectionObserver threshold (default 0.15)
 *  - children: React children
 *  - sx: additional MUI sx overrides on the outer Box
 */
export default function FadeInOnScroll({
  children,
  delay = 0,
  duration = 700,
  distance = 32,
  threshold = 0.15,
  sx = {},
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${distance}px)`,
        transition: `opacity ${duration}ms cubic-bezier(.4,0,.2,1) ${delay}ms, transform ${duration}ms cubic-bezier(.4,0,.2,1) ${delay}ms`,
        willChange: 'opacity, transform',
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

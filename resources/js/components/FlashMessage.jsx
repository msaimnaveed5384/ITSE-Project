import React, { useEffect, useState } from 'react';

export default function FlashMessage({ message, duration = 3000, fadeDuration = 300 }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer = null;
    let unmountTimer = null;

    if (message) {
      setMounted(true);
      // show immediately
      // give React a tick to render with mounted true
      setVisible(true);

      // hide after duration
      hideTimer = setTimeout(() => setVisible(false), duration);
     
      unmountTimer = setTimeout(() => setMounted(false), duration + fadeDuration);
    } else {
      // no message -> ensure hidden
      setVisible(false);
      // unmount after fade time
      unmountTimer = setTimeout(() => setMounted(false), fadeDuration);
    }

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      if (unmountTimer) clearTimeout(unmountTimer);
    };
  }, [message, duration, fadeDuration]);

  if (!message || !mounted) return null;

  const style = {
    transition: `opacity ${fadeDuration}ms ease`,
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none'
  };

  return (
    <div className="alert flash-message" role="alert" aria-live="polite" style={style}>
      {message}
    </div>
  );
}

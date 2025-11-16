import React, { useEffect, useState } from "react";

/**
 * TypingEffect
 * - types character-by-character (fast) or word-by-word if preferred
 * - calls onProgress optionally (used for scrolling while typing)
 * - calls onDone when finished
 */
const TypingEffect = ({ text = "", speed = 12, onProgress, onDone }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      if (onDone) onDone();
      return;
    }

    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (onProgress) onProgress(i);

      if (i >= text.length) {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onProgress, onDone]);

  return <span className="whitespace-pre-line">{displayed}</span>;
};

export default TypingEffect;

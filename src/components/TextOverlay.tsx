import React, { useState, useEffect, useRef } from "react";
import { Html } from "@react-three/drei";

interface TextOverlayProps {
  title: string;
  body: string;
  isActive: boolean;
  fadeDuration?: number; // Duration for fade out in ms
  typewriterSpeed?: number; // Speed for typewriter effect in ms per character
  offsetX?: string; // Horizontal offset for the text
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  title,
  body,
  isActive,
  fadeDuration = 500,
  typewriterSpeed = 50,
  offsetX = "0px",
}) => {
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedBody, setDisplayedBody] = useState("");
  const [opacity, setOpacity] = useState(0);
  const titleIndex = useRef(0);
  const bodyIndex = useRef(0);

  useEffect(() => {
    let initialDelayTimeout: number | undefined;
    let currentTypewriterTimeout: number | undefined;

    if (isActive) {
      setOpacity(1);
      setDisplayedTitle("");
      setDisplayedBody("");
      titleIndex.current = 0;
      bodyIndex.current = 0;

      const typeTitle = () => {
        if (titleIndex.current < title.length) {
          setDisplayedTitle((prev) => prev + title.charAt(titleIndex.current));
          titleIndex.current++;
          currentTypewriterTimeout = window.setTimeout(
            typeTitle,
            typewriterSpeed,
          );
        } else {
          currentTypewriterTimeout = window.setTimeout(
            typeBody,
            typewriterSpeed,
          );
        }
      };

      const typeBody = () => {
        if (bodyIndex.current < body.length) {
          setDisplayedBody((prev) => prev + body.charAt(bodyIndex.current));
          bodyIndex.current++;
          currentTypewriterTimeout = window.setTimeout(
            typeBody,
            typewriterSpeed,
          );
        }
      };

      const startTypewriter = () => {
        currentTypewriterTimeout = window.setTimeout(
          typeTitle,
          typewriterSpeed,
        );
      };

      initialDelayTimeout = window.setTimeout(startTypewriter, 2000);
    } else {
      setOpacity(0);
    }

    return () => {
      if (initialDelayTimeout) {
        clearTimeout(initialDelayTimeout);
      }
      if (currentTypewriterTimeout) {
        clearTimeout(currentTypewriterTimeout);
      }
    };
  }, [isActive, title, body, typewriterSpeed]);

  return (
    <Html center>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: `translate(calc(-50% + ${offsetX}), -50%)`,
          color: "white",
          textAlign: "center",
          zIndex: 2000,
          opacity: opacity,
          transition: `opacity ${fadeDuration}ms ease-out`,
          pointerEvents: "none", // Allow clicks to pass through
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            margin: "0 0 10px 0",
            whiteSpace: "nowrap",
            overflow: "visible",
          }}
        >
          {displayedTitle}
        </h2>
        <p style={{ 
            fontSize: "24px", 
            margin: 0, 
            whiteSpace: "nowrap",
            overflow: "visible"
          }}>
          {displayedBody}
        </p>
      </div>
    </Html>
  );
};

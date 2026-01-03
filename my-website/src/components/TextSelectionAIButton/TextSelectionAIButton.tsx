import React, { useState, useEffect, useRef } from 'react';
import styles from './TextSelectionAIButton.module.css';

interface TextSelectionAIButtonProps {
  onAskAI: (selectedText: string) => void;
  isLoading?: boolean;
}

const TextSelectionAIButton: React.FC<TextSelectionAIButtonProps> = ({ onAskAI, isLoading = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [highlightedRange, setHighlightedRange] = useState<Range | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Function to highlight the selected text
  const highlightSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;

    const range = selection.getRangeAt(0);
    const newRange = document.createRange();
    newRange.setStart(range.startContainer, range.startOffset);
    newRange.setEnd(range.endContainer, range.endOffset);

    // Remove any existing highlights
    removeHighlight();

    // Create a temporary element to wrap the selection
    const span = document.createElement('span');
    span.className = styles.highlightedText;
    span.setAttribute('data-highlighted', 'true');

    try {
      newRange.surroundContents(span);
      setHighlightedRange(newRange);
    } catch (e) {
      // If surrounding contents fails (e.g., partially selected nodes),
      // we'll wrap each text node individually
      const contents = newRange.extractContents();
      span.appendChild(contents);
      newRange.insertNode(span);
      setHighlightedRange(newRange);
    }
  };

  // Function to remove the highlight
  const removeHighlight = () => {
    if (highlightedRange) {
      const highlightedSpans = document.querySelectorAll(`.${styles.highlightedText}[data-highlighted="true"]`);
      highlightedSpans.forEach(span => {
        const parent = span.parentNode;
        if (parent) {
          while (span.firstChild) {
            parent.insertBefore(span.firstChild, span);
          }
          parent.removeChild(span);
        }
      });
      setHighlightedRange(null);
    }
  };

  useEffect(() => {
    if (isLoading && isVisible) {
      highlightSelection();
    } else if (!isLoading) {
      removeHighlight();
    }
  }, [isLoading, isVisible]);

  useEffect(() => {
    const handleSelection = (e: MouseEvent) => {
      // Ensure this is a left mouse button release (not right-click)
      if (e.button !== 0) return;

      const selection = window.getSelection();
      if (!selection) return;

      const selectedTextContent = selection.toString().trim();

      if (selectedTextContent && selection.rangeCount > 0) {
        // Get the bounding rectangle of the selection
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Position the button slightly above the selection
        setPosition({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 40 // 40px above the selection
        });

        setSelectedText(selectedTextContent);
        setIsVisible(true);
      } else {
        setIsVisible(false);
        removeHighlight();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsVisible(false);
        removeHighlight();
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      // Only hide the button if it's not a right-click
      if (e.button === 2) return; // Right-click, don't hide

      // Delay to allow other click handlers to run first
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().trim() === '') {
          setIsVisible(false);
          removeHighlight();
        }
      }, 10);
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleGlobalClick);
      removeHighlight();
    };
  }, []);

  const handleClick = () => {
    if (selectedText) {
      onAskAI(selectedText);
      setIsVisible(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      ref={buttonRef}
      className={`${styles.aiButton} ${isLoading ? styles.loading : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? 'Asking AI...' : 'Ask with AI'}
    </button>
  );
};

export default TextSelectionAIButton;
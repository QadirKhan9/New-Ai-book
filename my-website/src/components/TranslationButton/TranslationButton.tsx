import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { translate } from '@docusaurus/Translate';
import config from '@site/src/utils/config';

const TranslationButton = ({ content, onTranslate, className = '' }) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);

  const handleTranslate = async () => {
    if (isTranslated) {
      // If already translated, revert to original
      onTranslate(null);
      setIsTranslated(false);
      return;
    }

    if (!content || content.trim() === '') {
      alert('No content available for translation');
      return;
    }

    setIsTranslating(true);
    try {
      // Use the configured API URL with multiple fallbacks
      let apiUrl = 'http://localhost:8000/api/v1'; // default fallback

      // Try different methods to get the API URL
      if (typeof window !== 'undefined' && (window as any)._env_?.REACT_APP_API_URL) {
        apiUrl = (window as any)._env_.REACT_APP_API_URL;
      } else if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
        apiUrl = process.env.REACT_APP_API_URL;
      } else if (config && config.apiUrl) {
        apiUrl = config.apiUrl;
      }

      // Call the translation API
      const response = await fetch(`${apiUrl}/translate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          target_language: 'ur',
          content_type: 'chapter'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Translation API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        onTranslate(data.translated_content);
        setIsTranslated(true);
      } else {
        throw new Error(data.error_message || 'Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert(`Translation failed: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <BrowserOnly>
      {() => (
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className={`translation-button ${className} ${isTranslating ? 'loading' : ''} ${isTranslated ? 'translated' : ''}`}
          style={{
            padding: '8px 16px',
            backgroundColor: isTranslated ? '#2196F3' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isTranslating ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            margin: '10px 0',
            display: 'inline-block'
          }}
        >
          {isTranslating
            ? translate({ message: 'Translating...', id: 'translation.translating' })
            : isTranslated
              ? translate({ message: 'Show Original', id: 'translation.showOriginal' })
              : translate({ message: '.Translate to Urdu', id: 'translation.translateToUrdu' })
          }
        </button>
      )}
    </BrowserOnly>
  );
};

export default TranslationButton;
/**
 * Translation wrapper component for documentation content
 */

import React, { useState, useEffect } from 'react';
import TranslationButton from '@site/src/components/TranslationButton';

interface TranslationWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const TranslationWrapper: React.FC<TranslationWrapperProps> = ({ 
  children, 
  title = '', 
  description = '' 
}) => {
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState<string>('');
  const [contentReady, setContentReady] = useState<boolean>(false);
  
  // When children change, extract content
  useEffect(() => {
    // In this context, we'll use title and description as the content to translate
    // since we can't easily extract content from arbitrary React children
    const contentToTranslate = `${title} ${description}`.trim();
    if (contentToTranslate) {
      setOriginalContent(contentToTranslate);
      setContentReady(true);
    }
  }, [title, description]);

  // Function to handle translation
  const handleTranslate = (translatedText: string | null) => {
    setTranslatedContent(translatedText);
  };

  if (translatedContent) {
    // If we have translated content, render it
    return (
      <div className="translated-content-wrapper">
        <TranslationButton 
          content={originalContent} 
          onTranslate={handleTranslate} 
          className="translate-toggle-button"
        />
        <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
      </div>
    );
  } else {
    // Otherwise, render the original content with the translation button
    return (
      <div className="content-with-translation">
        {contentReady && (
          <TranslationButton 
            content={originalContent} 
            onTranslate={handleTranslate} 
            className="translate-initial-button"
          />
        )}
        <div className="original-content">
          {children}
        </div>
      </div>
    );
  }
};

export default TranslationWrapper;
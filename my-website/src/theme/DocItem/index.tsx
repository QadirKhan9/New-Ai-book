/**
 * Custom DocItem component with translation functionality
 * This component wraps the original DocItem and adds translation capabilities
 */

import React, { useState } from 'react';
import { HtmlClassNameProvider } from '@docusaurus/theme-common';
import { DocProvider } from '@docusaurus/plugin-content-docs/client';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemLayout from '@theme/DocItem/Layout';
import TranslationButton from '@site/src/components/TranslationButton';
import type {Props} from '@theme/DocItem';

export default function DocItem(props: Props): React.ReactNode {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
  const MDXComponent = props.content;
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);

  // Extract content from the document metadata
  const docInfo = props.content.metadata;
  const contentToTranslate = `${docInfo.title} ${docInfo.description} ${docInfo.frontMatter.tags?.join(' ') || ''}`.trim();

  // Function to handle translation
  const handleTranslate = (translatedText: string | null) => {
    setTranslatedContent(translatedText);
  };

  // Custom rendering to add the translation button
  const renderContent = () => {
    if (translatedContent) {
      // If we have translated content, render it
      return (
        <div className="translated-content">
          <TranslationButton
            content={contentToTranslate}
            onTranslate={handleTranslate}
            className="translate-toggle-button"
          />
          <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
        </div>
      );
    } else {
      // Otherwise, render the original MDX component with the translation button
      return (
        <div className="doc-content-with-translation">
          <TranslationButton
            content={contentToTranslate}
            onTranslate={handleTranslate}
            className="translate-initial-button"
          />
          <MDXComponent />
        </div>
      );
    }
  };

  return (
    <DocProvider content={props.content}>
      <HtmlClassNameProvider className={docHtmlClassName}>
        <DocItemMetadata />
        <DocItemLayout>
          {renderContent()}
        </DocItemLayout>
      </HtmlClassNameProvider>
    </DocProvider>
  );
}
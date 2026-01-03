import React, { JSX, useState } from "react";
import Layout from "@theme-original/Layout";
import ChatWidget from "@site/src/components/ChatWidget";
import TextSelectionAIButton from "@site/src/components/TextSelectionAIButton/TextSelectionAIButton";
import { AuthProvider } from "@site/src/contexts/AuthContext";
import type { WrapperProps } from "@docusaurus/types";

type LayoutWrapperProps = WrapperProps<typeof Layout>;

export default function LayoutWrapper(props: LayoutWrapperProps): JSX.Element {
  const [selectedText, setSelectedText] = useState<string | null>(null);

  const handleAskAI = (text: string) => {
    setSelectedText(text);
  };

  // Callback to reset selectedText after it's been processed
  const handleTextProcessed = () => {
    setSelectedText(null);
  };

  return (
    <AuthProvider>
      <Layout {...props}>
        <div style={{ position: "relative", minHeight: "100vh" }}>
          <header style={{ position: "sticky", top: 0, zIndex: 100 }}></header>
          {props.children}
        </div>
        <TextSelectionAIButton onAskAI={handleAskAI} />
        <ChatWidget selectedText={selectedText} onProcessed={handleTextProcessed} />
      </Layout>
    </AuthProvider>
  );
}

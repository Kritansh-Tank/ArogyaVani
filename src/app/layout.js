import "./globals.css";

export const metadata = {
  title: "ArogyaVani — Healthcare at Your Voice",
  description: "A multilingual voice-first AI assistant for accessible healthcare information. Powered by Vapi and Qdrant.",
  keywords: "healthcare, voice assistant, AI, multilingual, Hindi, accessibility",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

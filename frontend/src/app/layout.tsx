/**
 * Root layout for the application.
 * Provides basic HTML structure and global styling.
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Multi-User Todo App',
  description: 'Secure multi-user todo application with JWT authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
          }

          a {
            color: #0070f3;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          button {
            font-family: inherit;
          }

          input, textarea {
            font-family: inherit;
          }

          @media (max-width: 768px) {
            body {
              font-size: 14px;
            }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}

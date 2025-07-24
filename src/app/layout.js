import "./globals.css";



export const metadata = {
  title: "escortdabylon-post-comment",
  description: "escortdabylon post comment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

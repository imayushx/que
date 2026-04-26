import './globals.css'

export const metadata = {
  title: 'que.',
  description: 'One movie. Every night. No excuses.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="grain">
        {children}
      </body>
    </html>
  )
}
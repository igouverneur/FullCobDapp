import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
            <link rel="icon" href="/images/logopic.png" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

            <link href="https://fonts.googleapis.com/css2?family=Chewy&display=swap" rel="stylesheet"/> 
            <link
              href="https://fonts.googleapis.com/css2?family=Josefin+Sans&family=Ubuntu:ital,wght@1,300&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Tapestry&display=swap"
              rel="stylesheet"
            />
          </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
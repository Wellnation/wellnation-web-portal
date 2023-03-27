import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <body>
      <script src="https://chatthing.ai/chat-widget.js" type="text/javascript" data-bot-id="6ecb864c-68c7-451b-b032-8d674e1888de" />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

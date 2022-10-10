import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html
        lang="en"
        className="font-netflix antialiased overflow-x-hidden"
        data-focus-visible-added
      >
        <Head />
        <body className="bg-gray-900 js-focus-visible">
          <span id="tooltip-root"></span>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

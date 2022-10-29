import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html
        lang="en"
        className="overflow-x-hidden font-netflix antialiased"
        data-focus-visible-added
      >
        <Head />
        <body className="js-focus-visible bg-gray-900">
          <span id="tooltip-root"></span>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

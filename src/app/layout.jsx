import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "순자 신청서",
  description: "순자 신청서",
};

export default function RootLayout({ children }) {
  return (
    <html
    suppressHydrationWarning={true}  lang="en">
      <body
        className={inter.className}>
        <Script
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="citrate"
          data-description="Support me on Buy me a coffee!"
          data-message="삶이 힘든 개발자에게 커피 한 잔을 후원해주세요."
          data-color="#5F7FFF"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
          async
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

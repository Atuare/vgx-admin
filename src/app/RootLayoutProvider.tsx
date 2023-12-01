"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { store } from "@/store/store";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";

import { Menu } from "@/components/Menu";
import { Inter, Roboto, Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sora",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-inter",
});

export function RootLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Provider store={store}>
      <body
        style={{ display: pathname !== "/login" ? "flex" : "inherit" }}
        className={`${inter.variable} ${roboto.variable} ${sora.variable} `}
      >
        <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
          {pathname !== "/login" && <Menu />}
          {children}
        </ProtectedRoute>
      </body>
    </Provider>
  );
}

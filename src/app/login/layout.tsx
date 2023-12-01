import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "VGX - Login",
  description: "VGX - Login",
};

export default function InterviewsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}

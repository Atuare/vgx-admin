import "@/styles/scrollbar.scss";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { LayoutHeader } from "./LayoutHeader";

export const metadata: Metadata = {
  title: "VGX - Configurações Entrevistas",
  description: "VGX - Configurações Entrevistas",
};

export default function InterviewsConfigLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LayoutHeader>{children}</LayoutHeader>;
}

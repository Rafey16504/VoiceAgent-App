"use client";

import { ConfigProvider } from "@/hooks/useConfig";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConfigProvider>{children}</ConfigProvider>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Support — SRM PYQ API",
  description:
    "Contact the SRM PYQ API team for bug reports, feature requests, integration help, or documentation feedback on the SRM university exam papers API.",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

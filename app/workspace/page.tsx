import { WorkspaceCanvas } from "@/app/_components/canvas/WorkspaceCanvas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace — Orbit",
};

export default function WorkspacePage() {
  return <WorkspaceCanvas />;
}

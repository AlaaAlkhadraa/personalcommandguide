"use client";

import { Component, type ReactNode } from "react";
import { StaticZFallback } from "@/components/three/StaticZFallback";

/**
 * If anything in the 3D hero throws (the .glb fails to download, a decoder
 * rejects it, the WebGL context is refused), fall back to the flat Z instead
 * of letting the error bubble up and take the whole page down.
 */
export class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <StaticZFallback />;
    return this.props.children;
  }
}

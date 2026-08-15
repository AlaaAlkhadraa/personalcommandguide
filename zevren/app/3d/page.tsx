import { Hero3D } from "@/components/three/Hero3D";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "3D experiment",
  description:
    "An experimental, cinematic 3D direction for the ZEVREN website. Not the current live site.",
  path: "/3d",
  noIndex: true,
});

export default function Experimental3DPage() {
  return <Hero3D />;
}

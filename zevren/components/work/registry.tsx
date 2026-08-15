import type { ComponentType } from "react";
import { BarbershopPreview } from "@/components/work/previews/BarbershopPreview";
import { GaragePreview } from "@/components/work/previews/GaragePreview";
import { StorePreview } from "@/components/work/previews/StorePreview";
import { PropertyPreview } from "@/components/work/previews/PropertyPreview";
import { EllezonePreview } from "@/components/work/previews/EllezonePreview";
import { BarbershopDemo } from "@/components/demos/barbershop/BarbershopDemo";
import { GarageDemo } from "@/components/demos/garage/GarageDemo";
import { StoreDemo } from "@/components/demos/store/StoreDemo";
import { PropertyDemo } from "@/components/demos/property/PropertyDemo";
import { EllezoneDemo } from "@/components/demos/ellezone/EllezoneDemo";

export const WORK_PREVIEWS: Record<string, ComponentType<{ className?: string }>> = {
  "barbershop-website": BarbershopPreview,
  "garage-website": GaragePreview,
  "online-store": StorePreview,
  "property-platform": PropertyPreview,
  ellezone: EllezonePreview,
};

export const WORK_DEMOS: Record<string, ComponentType> = {
  "barbershop-website": BarbershopDemo,
  "garage-website": GarageDemo,
  "online-store": StoreDemo,
  "property-platform": PropertyDemo,
  ellezone: EllezoneDemo,
};

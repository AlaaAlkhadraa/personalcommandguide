import type { ComponentType } from "react";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import { TajexPreview } from "@/components/work/previews/TajexPreview";
import { BarbershopPreview } from "@/components/work/previews/BarbershopPreview";
import { GaragePreview } from "@/components/work/previews/GaragePreview";
import { StorePreview } from "@/components/work/previews/StorePreview";
import { PropertyPreview } from "@/components/work/previews/PropertyPreview";
import { EllezonePreview } from "@/components/work/previews/EllezonePreview";
import { AccountingPreview } from "@/components/work/previews/AccountingPreview";
import { BarbershopDemo } from "@/components/demos/barbershop/BarbershopDemo";
import { GarageDemo } from "@/components/demos/garage/GarageDemo";
import { StoreDemo } from "@/components/demos/store/StoreDemo";
import { PropertyDemo } from "@/components/demos/property/PropertyDemo";
import { EllezoneDemo } from "@/components/demos/ellezone/EllezoneDemo";
import { AccountingDemo } from "@/components/demos/accounting/AccountingDemo";

export const WORK_PREVIEWS: Record<string, ComponentType<{ className?: string }>> = {
  "tajex-logistics": TajexPreview,
  "barbershop-website": BarbershopPreview,
  "garage-website": GaragePreview,
  "online-store": StorePreview,
  "property-platform": PropertyPreview,
  ellezone: EllezonePreview,
  "accounting-firm": AccountingPreview,
};

type AnyDemoDict = Dictionary["demos"][keyof Dictionary["demos"]];

export interface DemoComponentProps {
  dict: AnyDemoDict;
  common: Dictionary["demoCommon"];
}

// Each demo component actually declares a narrower, specific dict shape
// (e.g. Dictionary["demos"]["barbershop"]) than the AnyDemoDict union used
// here. The cast is safe because app/work/[slug]/page.tsx always looks up
// the matching dict entry by the same slug used to pick the component.
export const WORK_DEMOS: Record<string, ComponentType<DemoComponentProps>> = {
  "barbershop-website": BarbershopDemo as ComponentType<DemoComponentProps>,
  "garage-website": GarageDemo as ComponentType<DemoComponentProps>,
  "online-store": StoreDemo as ComponentType<DemoComponentProps>,
  "property-platform": PropertyDemo as ComponentType<DemoComponentProps>,
  ellezone: EllezoneDemo as ComponentType<DemoComponentProps>,
  "accounting-firm": AccountingDemo as ComponentType<DemoComponentProps>,
};

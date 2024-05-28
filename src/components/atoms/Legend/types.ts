import { MarkerType } from "@/components/organisms/UMLEditor/types"

export type LegendConfigs = {
  [key in MarkerType]: LegendItemT
}

export interface LegendItemT { label: string; color: string }
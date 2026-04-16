import {
  Globe,
  BarChart3,
  Smartphone,
  Palette,
  Cloud,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  globe: Globe,
  "bar-chart": BarChart3,
  smartphone: Smartphone,
  palette: Palette,
  cloud: Cloud,
  shield: ShieldCheck,
};

export default function CourseIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className || "w-6 h-6"} strokeWidth={1.5} />;
}

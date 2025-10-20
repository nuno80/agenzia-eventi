"use client";

import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface IconProps extends React.HTMLAttributes<SVGElement> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}

// Mapping dimension to Tailwind classes
const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

// Mapping animations to Tailwind classes
const animateMap = {
  spin: "animate-spin",
  bounce: "animate-bounce",
  pulse: "animate-pulse",
} as const;

export type AnimationType = keyof typeof animateMap;

export function Icon({
  icon: IconComponent,
  size = "md",
  className = "",
  animate,
  ...props
}: IconProps) {
  return (
    <IconComponent
      className={cn(sizeMap[size], animate && animateMap[animate], className)}
      {...props}
    />
  );
}

// Icon aliases for common use cases
export function LoadingIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").Loader2}
      size="md"
      animate="spin"
      className={cn(className)}
      {...props}
    />
  );
}

export function ChevronRightIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").ChevronRight}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function MailIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").Mail}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function PhoneIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").Phone}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function MapPinIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").MapPin}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function SearchIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").Search}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function StarIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").Star}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function ShieldIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").Shield}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function HeartIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").Heart}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function ClockIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").Clock}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function AwardIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").Award}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function UsersIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").Users}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function CheckIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").Check}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

export function AlertCircleIcon({
  className = "",
  ...props
}: Omit<IconProps, "icon">) {
  return (
    <Icon
      icon={require("lucide-react").AlertCircle}
      size="md"
      className={cn(className)}
      {...props}
    />
  );
}

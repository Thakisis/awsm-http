import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function substituteVariables(
  text: string,
  variables: Record<string, string>
): string {
  if (!text) return text;
  return text.replace(/\{\{(.+?)\}\}/g, (_, key) => {
    const value = variables[key.trim()];
    return value !== undefined ? value : `{{${key}}}`;
  });
}

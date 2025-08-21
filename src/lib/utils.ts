import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function avatarFallbackNameImage({
  email,
  name,
}: {
  email: string | undefined;
  name: string | undefined;
}) {
  const fallbackCharacter =
    name && name.length > 0
      ? name.charAt(0)
      : email?.split("@")[0].charAt(0).toUpperCase();

  const fallbackImage = `https://avatar.vercel.sh/${email}`;

  return { fallbackCharacter, fallbackImage };
}

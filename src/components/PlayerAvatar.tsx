"use client";

import { useState } from "react";
import Image from "next/image";
import { getInitials } from "@/lib/data";

interface PlayerAvatarProps {
  name: string;
  photo: string;
  size?: number;
  className?: string;
  position?: string;
}

export function PlayerAvatar({
  name,
  photo,
  size = 40,
  className = "",
  position = "center",
}: PlayerAvatarProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-ink-700 font-heading font-semibold text-accent-bright ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.38 }}
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <Image
      src={photo}
      alt={name}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-full object-cover ${className}`}
      style={{ width: size, height: size, objectPosition: position }}
      unoptimized
    />
  );
}

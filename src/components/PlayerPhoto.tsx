"use client";

import { useState } from "react";
import Image from "next/image";
import { getInitials } from "@/lib/data";

interface PlayerPhotoProps {
  name: string;
  photo: string;
  size?: number;
}

export function PlayerPhoto({ name, photo, size = 240 }: PlayerPhotoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-2xl border border-ink-600 bg-ink-800 font-heading font-bold text-accent-bright"
        style={{ width: size, height: size, fontSize: size * 0.21 }}
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-2xl border border-ink-600 bg-ink-800"
      style={{ width: size, height: size }}
    >
      <Image
        src={photo}
        alt={name}
        fill
        sizes={`${size}px`}
        className="object-contain"
        onError={() => setFailed(true)}
        unoptimized
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { getInitials } from "@/lib/data";

const PHOTO_SIZE = 240;

interface PlayerPhotoProps {
  name: string;
  photo: string;
}

export function PlayerPhoto({ name, photo }: PlayerPhotoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-2xl border border-ink-600 bg-ink-800 font-heading text-5xl font-bold text-accent-bright"
        style={{ width: PHOTO_SIZE, height: PHOTO_SIZE }}
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-2xl border border-ink-600 bg-ink-800"
      style={{ width: PHOTO_SIZE, height: PHOTO_SIZE }}
    >
      <Image
        src={photo}
        alt={name}
        fill
        sizes={`${PHOTO_SIZE}px`}
        className="object-contain"
        onError={() => setFailed(true)}
        unoptimized
      />
    </div>
  );
}

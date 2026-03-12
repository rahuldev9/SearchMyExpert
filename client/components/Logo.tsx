"use client";

import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="SearchMyExpert Logo"
        width={120}
        height={120}
        priority
        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
      />
      <span className="text-lg font-semibold text-blue-600">
        SearchMyExpert
      </span>
    </div>
  );
}

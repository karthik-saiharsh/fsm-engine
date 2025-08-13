"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconSquareRoundedPlusFilled,
  IconSquareRoundedMinusFilled,
  IconAdjustmentsHorizontal,
  IconHeadphones,
  IconHeadphonesOff,
  IconDownload,
  IconTransformFilled
} from "@tabler/icons-react";

import { useState } from "react";

export default function ToolBar() {
  const [bgMusicPlaying, setBgMusicPlaying] = useState(false);

  const links = [
    {
      title: "Add State",
      icon: (
        <IconSquareRoundedPlusFilled className="h-full w-full text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Remove State",
      icon: (
        <IconSquareRoundedMinusFilled className="h-full w-full text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Edit State",
      icon: (
        <IconAdjustmentsHorizontal className="h-full w-full text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Play Music",
      icon: bgMusicPlaying ? (
        <IconHeadphones onClick={() => setBgMusicPlaying(!bgMusicPlaying)} className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ) : (
        <IconHeadphonesOff onClick={() => setBgMusicPlaying(!bgMusicPlaying)} className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Download FSM",
      icon: (
        <IconDownload className="h-full w-full text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Convert FSM",
      icon: (
        <IconTransformFilled className="h-full w-full text-neutral-300"/>
      ),
      href: '#'
    }

  ];
  return (
    <div className="flex items-center justify-center">
      <FloatingDock
        desktopClassName="border border-[rgba(255,255,255,0.2)]"
        items={links}
      />
    </div>
  );
}

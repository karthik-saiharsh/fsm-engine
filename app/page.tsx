"use client";

import { motion } from "motion/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";

export default function page() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl font-inter md:text-7xl font-bold dark:text-white text-center">
          FSM Engine
        </div>
        <div className="font-extralight font-inter w-180 text-center text-base md:text-2xl dark:text-neutral-200 py-4">
          From concept to execution, see your states come to life. Draw,
          simulate, and manage your logic — all in one place.
        </div>
        <Link href="/design">
          <button className="bg-black font-inter z-10 cursor-pointer hover:scale-115 transition-all ease-in-out dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
            Get Started
          </button>
        </Link>
      </motion.div>
    </AuroraBackground>
  );
}

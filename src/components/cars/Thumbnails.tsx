"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface Props {
  images: string[];
  alt?: string;
}

const SWIPE_THRESHOLD = 80;

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 1.05,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function ThumbnailImageGallery({
  images,
  alt = "slider image",
}: Props) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);

  const activeIndex = ((index % images.length) + images.length) % images.length;

  const paginate = (dir: number) => {
    setState([index + dir, dir]);
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* MAIN IMAGE (swipe only here) */}
      <div className="relative w-full aspect-video overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 280, damping: 28 },
              opacity: { duration: 0.25 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={(_: unknown, info: PanInfo) => {
              if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
              if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
            }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex]}
              alt={alt}
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="
            grid w-full gap-3
            grid-cols-4
            sm:grid-cols-5
            md:grid-cols-6
          "
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setState([i, i > activeIndex ? 1 : -1])}
              className={clsx(
                "relative aspect-video rounded-xl overflow-hidden transition-all duration-300",
                i === activeIndex
                  ? "ring-2 ring-white scale-95"
                  : "opacity-60 hover:opacity-100 hover:scale-[0.98]",
              )}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

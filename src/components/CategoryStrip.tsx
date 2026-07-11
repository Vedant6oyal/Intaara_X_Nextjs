"use client";

import Image from "next/image";
import type { Category } from "@/data/products";

export default function CategoryStrip({
  categories,
  active,
  onSelect,
}: {
  categories: Category[];
  active: string | null;
  onSelect: (name: string | null) => void;
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 py-2">
      <CategoryItem
        label="All"
        image="https://picsum.photos/seed/cat-all/200/200"
        active={active === null}
        onClick={() => onSelect(null)}
      />
      {categories.map((c) => (
        <CategoryItem
          key={c.id}
          label={c.name}
          image={c.image}
          active={active === c.id}
          onClick={() => onSelect(c.id)}
        />
      ))}
    </div>
  );
}

function CategoryItem({
  label,
  image,
  active,
  onClick,
}: {
  label: string;
  image: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-16 shrink-0 flex-col items-center gap-1.5"
    >
      <span
        className={`grid h-16 w-16 place-items-center overflow-hidden rounded-full ring-2 transition ${
          active ? "ring-sage-600" : "ring-transparent"
        }`}
      >
        <Image
          src={image}
          alt={label}
          width={64}
          height={64}
          sizes="64px"
          className="h-full w-full rounded-full object-cover p-0.5"
        />
      </span>
      <span
        className={`line-clamp-1 text-center text-[11px] ${
          active ? "font-semibold text-sage-700" : "text-gray-600"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

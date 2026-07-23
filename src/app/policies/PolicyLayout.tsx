import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PolicyLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 pb-24 pt-6">
      <Link
        href="/redeem"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back
      </Link>
      <div className="border-b border-gray-100 pb-6">
        <h1 className="font-cinzel text-2xl font-bold text-gray-900">
          {title}
        </h1>
      </div>
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-600">
        {children}
      </div>
    </div>
  );
}

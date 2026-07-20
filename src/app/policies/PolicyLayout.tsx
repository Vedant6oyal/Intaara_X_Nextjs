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
    <div className="px-5 pb-20 pt-6">
      <Link
        href="/redeem"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back
      </Link>
      <h1 className="mb-6 font-cinzel text-2xl font-bold text-gray-900">
        {title}
      </h1>
      <div className="prose prose-sm max-w-none text-gray-700">
        {children}
      </div>
    </div>
  );
}

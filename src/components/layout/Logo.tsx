import Link from "next/link";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <Link href="/dashboard" className={`font-display font-bold text-terracotta ${sizes[size]}`}>
      Naya Dream Home
    </Link>
  );
}

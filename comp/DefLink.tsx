import Link from "next/link";

export default function DefLink({ href, text }: { href: string, text: string }) {
  return (
    <Link href={href} className="hover:text-neutral-700 active:text-neutral-500 font-medium transition-colors duration-100 ease-linear">
      {text}
    </Link>
  );
}
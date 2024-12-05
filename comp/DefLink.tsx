import Link from "next/link";

export default function DefLink({ href, text }: { href: string, text: string }) {
  return (
    <Link href={href} className="text-neutral-700 hover:text-neutral-800 active:text-neutral-900 font-medium">
      {text}
    </Link>
  );
}
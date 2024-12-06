import DefLink from "@/comp/DefLink";
import Image from "next/image";
import Link from "next/link";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="mt-4 flex items-center">
          <Image src="/dc_logo.png" height={32} width={100} alt="Logo" className="rounded-md w-8"></Image><span className="text-red-900 font-bold ml-1">Davies Cards</span>
        </Link>
        <div className="flex items-center gap-5">
          <DefLink href="/" text="Leaderboard" />
          <DefLink href="/games" text="Game Log" />
        </div>
      </nav>
      <div className="container mx-auto px-4 my-2">{children}</div>
    </>
  );
}
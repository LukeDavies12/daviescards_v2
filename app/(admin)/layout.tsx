import DefLink from "@/comp/DefLink";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav className="container mx-auto px-4 flex justify-between items-center my-3">
        <div>
          <Link href="/admin" className="flex items-center">
            <Image src="/dc_logo.png" height={32} width={32} alt="Logo" className="rounded-md w-8" />
            <span className="text-red-700 font-bold ml-1">Davies Cards</span>
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <UserButton />
        </div>
      </nav>
      <div className="container mx-auto px-4 my-2">{children}</div>
    </>
  );
}

import { usePathname, useRouter } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  setOpen?: (open: boolean) => void;
  className?: string;
  offset?: number;
}

export default function NavLink({
  href,
  children,
  setOpen,
  className,
  offset = -120,
}: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const [path, hash] = href.split("#");
    e.preventDefault();
    if (setOpen) setOpen(false);

    if (pathname === path && hash) {
      // Same page, scroll to anchor
      const el = document.getElementById(hash);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      // Navigate to page + hash
      router.push(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`transition-all hover:text-white relative group ${className}`}
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-fit lg:group-hover:w-full" />
    </a>
  );
}

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  href?: string;
  text: string;
  onClick?: () => void;
};

const Returnbutton = ({ href, text, onClick }: Props) => {
  const className =
    "inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-300 group";

  const content = (
    <>
      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
      <span>{text}</span>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href || "#"} className={className}>
      {content}
    </Link>
  );
};

export default Returnbutton;

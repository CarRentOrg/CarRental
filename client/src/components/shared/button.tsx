"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  href,
  className = "",
  ...props
}) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) props.onClick(e); // 1. хэрэв onClick дамжуулсан бол ажиллана
    if (href) router.push(href); // 2. href өгөгдсөн бол route шилжүүлнэ
    window.scrollTo(0, 0);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`group/button overflow-hidden relative px-5 py-3.5 rounded-full flex items-center bg-white justify-center ${className} text-black hover:bg-neutral-200 hover:shadow-lg hover:shadow-white/10 hover:scale-99 cursor-pointer transition-all duration-400 ease-in-out `}
    >
      <span className="transition-all duration-300 ease-in-out group-hover/button:-translate-y-[150%] group-hover/button:opacity-0 ">
        {text}
      </span>
      <span className="absolute top-full left-0 right-0 transition-all duration-300 ease-in-out opacity-0 group-hover/button:-translate-y-full group-hover/button:opacity-100 h-full flex items-center justify-center">
        {text}
      </span>
    </button>
  );
};

export default Button;

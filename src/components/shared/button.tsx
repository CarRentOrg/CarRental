"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const Button: React.FC<ButtonProps> = ({ text, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`group/button overflow-hidden relative px-5 py-3.5 rounded-full flex items-center bg-red-400 justify-center ${className}`}
    >
      <span className="transition-all duration-400 ease-in-out group-hover/button:-translate-y-[150%] group-hover/button:opacity-0">
        {text}
      </span>
      <span className="absolute top-full left-0 right-0 transition-all duration-400 ease-in-out opacity-0 group-hover/button:-translate-y-full group-hover/button:opacity-100 h-full flex items-center justify-center">
        {text}
      </span>
    </button>
  );
};

export default Button;

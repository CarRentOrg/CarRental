import { TitleProps } from "@/types";
import React from "react";

const Title = ({ title, subtitle, align }: TitleProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center ${
        align === "left" && "md:items-start md:not-last:text-left"
      } `}
    >
      <h1 className="text-[34px] font-bold md:text-[40px] xl:text-[64px] leading-11 md:leading-14 xl:leading-17.5 text-white tracking-tight">
        {title}
      </h1>
      <p className="text-gray-500/90 mt-2 text-sm md:text-base max-w-156 tracking-tight">
        {subtitle}
      </p>
    </div>
  );
};

export default Title;

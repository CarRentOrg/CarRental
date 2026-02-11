"use client";

import React from "react";
import { Check, Clock, PackageCheck, AlertCircle } from "lucide-react";

interface TimelineStepProps {
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export default function BookingTimeline({ status }: TimelineStepProps) {
  const steps = [
    {
      id: "pending",
      label: "Захиалга хийгдсэн",
      description: "Хэрэглэгч захиалгын хүсэлт илгээсэн.",
      icon: Clock,
      color: "amber",
    },
    {
      id: "confirmed",
      label: "Баталгаажсан",
      description: "Админ захиалгыг хүлээн авч баталгаажуулсан.",
      icon: Check,
      color: "emerald",
    },
    {
      id: "completed",
      label: "Дууссан",
      description: "Аялал амжилттай дуусаж, машин буцаан өгөгдсөн.",
      icon: PackageCheck,
      color: "blue",
    },
  ];

  // If status is cancelled, we might want to show it differently or as a separate branch
  // For simplicity, let's just render the standard flow and handle cancelled as a terminal state
  const isCancelled = status === "cancelled";

  const getStepStatus = (stepId: string) => {
    if (isCancelled) return "inactive";

    const statusOrder = ["pending", "confirmed", "completed"];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepId);

    if (currentIndex === -1) return "inactive";
    if (stepId === status) return "active";
    if (stepIndex < currentIndex) return "completed";
    return "inactive";
  };

  return (
    <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.id);
        const Icon = step.icon;

        return (
          <div key={step.id} className="relative flex items-start gap-4">
            <div
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white transition-all duration-300 ${
                stepStatus === "completed"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                  : stepStatus === "active"
                    ? `bg-${step.color}-500 text-white shadow-lg shadow-${step.color}-100 animate-pulse`
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {stepStatus === "completed" ? (
                <Check className="h-5 w-5" />
              ) : (
                <Icon className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 pt-0.5">
              <h4
                className={`text-sm font-bold transition-colors ${
                  stepStatus === "inactive" ? "text-gray-400" : "text-gray-900"
                }`}
              >
                {step.label}
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}

      {isCancelled && (
        <div className="relative flex items-start gap-4 mt-12!">
          <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-red-500 text-white shadow-lg shadow-red-100">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className="text-sm font-bold text-red-600">Цуцлагдсан</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Энэхүү захиалга цуцлагдсан байна.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

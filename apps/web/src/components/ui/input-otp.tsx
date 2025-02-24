"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface InputOTPProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  autoComplete?: string;
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(({ className, length = 6, value, onChange, disabled, ...props }, ref) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      e.preventDefault();
      const newValue = value.slice(0, -1);
      onChange(newValue);
      focusInput(index - 1);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newChar = e.target.value.slice(-1);
    if (!/^\d*$/.test(newChar)) return;

    const newValue = value.slice(0, index) + newChar + value.slice(index + 1);
    onChange(newValue);

    if (newChar && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
    if (!/^\d*$/.test(pastedData)) return;
    onChange(pastedData.padEnd(length, ""));
    if (pastedData.length === length) {
      inputRefs.current[length - 1]?.focus();
    } else {
      focusInput(pastedData.length);
    }
  };

  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)}>
      {Array.from({ length }).map((_, i) => (
        <div key={i} className={cn("w-10 h-12")}>
          <Input
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={value[i] || ""}
            onChange={(e) => handleInput(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn("w-full h-full text-center text-lg font-medium bg-muted border-2")}
            {...props}
          />
        </div>
      ))}
    </div>
  );
});
InputOTP.displayName = "InputOTP";

export { InputOTP };

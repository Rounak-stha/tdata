"use client";
import { PixelatedEmoji } from "@/components/common/pixelated-emoji";
import { Logo } from "@/components/icons/logo";

// Error boundaries must be Client Components

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <div className="flex justify-center items-center">
        <Logo size={200} />
      </div>

      {/* 404 Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-4 md:gap-8">
          <span className="text-white text-[120px] md:text-[180px] font-bold leading-none">4</span>

          <div className="flex flex-col items-center gap-4">
            <div className="w-32 md:w-40 h-2 bg-purple-700 rounded-full"></div>
            <div className="flex justify-center">
              <PixelatedEmoji emoji="😖" size={80} className="text-yellow-300" />
            </div>
            <div className="w-32 md:w-40 h-2 bg-purple-700 rounded-full"></div>
          </div>

          <span className="text-white text-[120px] md:text-[180px] font-bold leading-none">4</span>
        </div>

        <p className="text-white/80 text-center max-w-md mt-8 px-4">Looks like you are not a member of the organization. Please contact the organization admin to get access.</p>
      </div>
    </div>
  );
}

"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.log("error found", { name: error.name, message: error.message });
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center mt-52">
      <h2 className="text-3xl font-bold">Task Not Found!</h2>
    </div>
  );
}

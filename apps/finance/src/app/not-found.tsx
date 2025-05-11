import { Ghost } from "lucide-react";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex-1 min-w-full flex flex-col items-center pt-24 gap-4">
      <Ghost size={48} />
      <h2 className="text-2xl font-medium text-primary">Page not found!</h2>
      <p className="text-sm text-gray-700 font-sans">
        Lost searching for page? go back to{" "}
        <span className="text-green-500 hover:text-green-600 underline underline-offset-2">
          previous page!
        </span>
      </p>
    </div>
  );
}

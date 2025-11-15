import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export function ModalToast({
  open,
  mode,
  message,
  onClose,
}: {
  open: boolean;
  mode: "loading" | "success" | "error";
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9990]" />

      {/* Center Modal */}
      <div className="fixed inset-0 z-[99999] flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-900 px-6 py-6 rounded-xl shadow-xl text-center w-[280px]">
          {/* Icon */}
          {mode === "loading" && (
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-indigo-600" />
          )}
          {mode === "success" && (
            <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
          )}
          {mode === "error" && (
            <XCircle className="mx-auto mb-3 h-8 w-8 text-rose-600" />
          )}

          {/* Message */}
          <p className="text-lg font-medium">{message}</p>

          {/* Close button only AFTER loading */}
          {mode !== "loading" && (
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 rounded-md bg-indigo-600 text-white w-full"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </>
  );
}

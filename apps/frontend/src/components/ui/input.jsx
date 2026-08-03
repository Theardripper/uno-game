import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  ...props
}) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-14 w-full min-w-0 rounded-xl border border-white/5 bg-auth-input px-3 py-2 text-sm text-white shadow-inner transition-all duration-300 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 hover:border-white/10 focus-visible:border-auth-accent focus-visible:ring-2 focus-visible:ring-auth-accent/50 focus-visible:shadow-[0_0_15px_rgba(255,255,255,0.05)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props} />
  );
}

export { Input };

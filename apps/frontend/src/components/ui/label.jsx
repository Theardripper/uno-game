import { cn } from "@/helpers/cn.js";
import * as React from "react";

/**
 * @typedef {React.LabelHTMLAttributes<HTMLLabelElement>} LabelProps
 */

/**
 * Renderiza um elemento de label padronizado.
 *
 * @param {LabelProps} props
 * @returns {React.ReactElement}
 */
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };

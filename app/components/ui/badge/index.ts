import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Badge } from "./Badge.vue"

export const badgeVariants = cva(
  "inline-flex gap-1 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        "payment-success":
          "bg-green-100 text-green-600 border-none font-medium",
        "payment-failed": "bg-red-100 text-red-600 border-none font-medium",
        "payment-pending":
          "bg-yellow-100 text-yellow-600 border-none font-medium",
        "payment-refunded": "bg-gray-100 text-gray-600 border-none font-medium",
        "campaign-funded":
          "bg-green-100 text-green-600 border-none font-medium",
        "campaign-ongoing":
          "bg-yellow-100 text-yellow-600 border-none font-medium",
        "campaign-completed":
          "bg-gray-100 text-gray-600 border-none font-medium",
        "campaign-cancelled": "bg-red-100 text-red-600 border-none font-medium",
        "campaign-on-hold": "bg-gray-100 text-gray-600 border-none font-medium",
        "campaign-paused": "bg-gray-100 text-gray-600 border-none font-medium",
        "campaign-terminated":
          "bg-gray-100 text-gray-600 border-none font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BadgeVariants = VariantProps<typeof badgeVariants>

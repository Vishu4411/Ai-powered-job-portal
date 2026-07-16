import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 mb-6"
    >
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight truncate">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </motion.div>
  );
}
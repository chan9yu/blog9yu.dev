"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageTransitionProps = {
	children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.4,
				ease: [0.4, 0, 0.2, 1]
			}}
		>
			{children}
		</motion.div>
	);
}

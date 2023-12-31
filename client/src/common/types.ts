export type PropsWithClassName<P = unknown> = P & { className?: string }

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

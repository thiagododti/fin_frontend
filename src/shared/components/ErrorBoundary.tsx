import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { SectionErrorFallback } from "./SectionErrorFallback";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    fallback?: ReactNode;
};

export function ErrorBoundary({ children, fallback }: Props) {
    if (fallback) {
        return (
            <ReactErrorBoundary fallback={fallback}>
                {children}
            </ReactErrorBoundary>
        );
    }

    return (
        <ReactErrorBoundary FallbackComponent={SectionErrorFallback}>
            {children}
        </ReactErrorBoundary>
    );
}

import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    action?: ReactNode;
    children?: ReactNode;
}

export default function PageHeader({ title, action, children }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between px-6 pt-8 pb-2">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {(action || children) && (
                <div className="flex items-center gap-3">
                    {action}
                    {children}
                </div>
            )}
        </div>
    );
}

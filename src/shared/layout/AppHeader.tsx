import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/providers/ThemeProvider";

export function AppHeader() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                    WalletFy - Seu sistema de gestão financeira pessoal
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    aria-label="Alternar tema"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                    {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </header>
    );
}

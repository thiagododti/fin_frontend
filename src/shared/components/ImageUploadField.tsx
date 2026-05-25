import type { RefObject, ReactNode } from "react";
import { X, ImageUp, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadFieldProps {
    preview: string | null;
    fileInputRef: RefObject<HTMLInputElement>;
    onFileChange: (file: File) => void;
    onRemove: () => void;
    /** "avatar" renderiza preview circular (fotos de usuário). "logo" renderiza preview quadrado (logos, ícones). */
    variant?: "avatar" | "logo";
    /** Ícone exibido quando não há preview. */
    placeholder?: ReactNode;
    accept?: string;
}

export function ImageUploadField({
    preview,
    fileInputRef,
    onFileChange,
    onRemove,
    variant = "logo",
    placeholder,
    accept = "image/*",
}: ImageUploadFieldProps) {
    const hiddenInput = (
        <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileChange(file);
            }}
        />
    );

    if (variant === "avatar") {
        return (
            <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="relative">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={preview || undefined} />
                        <AvatarFallback className="bg-secondary text-muted-foreground">
                            {placeholder}
                        </AvatarFallback>
                    </Avatar>
                    {preview && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={onRemove}
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
                {hiddenInput}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-border bg-secondary hover:bg-secondary/80 text-xs px-2"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Camera className="mr-1.5 h-3 w-3" />
                    {preview ? "Alterar" : "Foto"}
                </Button>
                <p className="text-[10px] text-muted-foreground text-center leading-tight">
                    JPG, PNG
                    <br />
                    Máx. 5MB
                </p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {preview ? (
                <div className="relative h-14 w-14 shrink-0">
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-14 w-14 rounded object-contain bg-secondary border border-border"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={onRemove}
                        className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full p-0"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            ) : (
                <div className="h-14 w-14 shrink-0 rounded border border-dashed border-border bg-secondary flex items-center justify-center">
                    {placeholder}
                </div>
            )}
            <div className="space-y-1">
                {hiddenInput}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-border bg-secondary hover:bg-secondary/80 text-xs"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageUp className="mr-1.5 h-3.5 w-3.5" />
                    {preview ? "Alterar imagem" : "Selecionar imagem"}
                </Button>
                <p className="text-[11px] text-muted-foreground">
                    PNG, JPG — máx. 5MB
                </p>
            </div>
        </div>
    );
}

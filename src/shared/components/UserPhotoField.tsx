import { Camera, UserRound, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RefObject } from "react";

type UserPhotoFieldProps = {
    photoPreview: string | null;
    fileInputRef: RefObject<HTMLInputElement>;
    onPhotoChange: (file: File) => void;
    onPhotoRemove: () => void;
};

export function UserPhotoField({
    photoPreview,
    fileInputRef,
    onPhotoChange,
    onPhotoRemove,
}: UserPhotoFieldProps) {
    return (
        <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={photoPreview || undefined} />
                    <AvatarFallback className="bg-secondary text-muted-foreground">
                        <UserRound className="h-9 w-9" />
                    </AvatarFallback>
                </Avatar>
                {photoPreview && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={onPhotoRemove}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>
            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onPhotoChange(file);
                }}
            />
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border bg-secondary hover:bg-secondary/80 text-xs px-2"
                onClick={() => fileInputRef.current?.click()}
            >
                <Camera className="mr-1.5 h-3 w-3" />
                {photoPreview ? "Alterar" : "Foto"}
            </Button>
            <p className="text-[10px] text-muted-foreground text-center leading-tight">
                JPG, PNG
                <br />
                Máx. 5MB
            </p>
        </div>
    );
}

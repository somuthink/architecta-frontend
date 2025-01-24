import { ChangeEvent, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InputImageProps {
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    title?: string;
    desription?: string;
    className?: string;
    dragSize?: number;
    button?: () => Promise<void>;
}

export const InputImage = ({
    title,
    desription,
    selectedFile,
    setSelectedFile,
    className,
    dragSize,
    button,
}: InputImageProps) => {
    const [dragging, setDragging] = useState(false);
    const loadForm = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setSelectedFile(file);

            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);

            // Create a preview URL for the dropped image
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
        }
    };

    const handleRemoveClick = () => {
        setSelectedFile(null);
        setPreview(null); // Clear the preview
    };

    return (
        <Card className={`w-full ${className || ""}`}>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{desription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div
                    className={`border-dashed border-2 rounded-lg w-full flex items-center justify-center ${
                        dragSize === 64 ? "h-64" : dragSize === 32 ? "h-32" : ""
                    }
${
    dragging
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
        : "border-gray-300 dark:border-gray-700"
}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => loadForm.current?.click()}
                >
                    {!selectedFile ? (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Нажмите или перетащите сюда
                        </span>
                    ) : (
                        <img
                            src={preview || ""}
                            alt="Preview"
                            className="object-contain h-full"
                        />
                    )}
                </div>
                <div className="flex flex-row gap-4">
                    <Input
                        id="picture"
                        type="file"
                        onChange={handleFileChange}
                        ref={loadForm}
                        className="hidden"
                        accept="image/*"
                    />
                    <Button
                        className="w-full sm:w-full md:w-auto lg:w-auto"
                        onClick={() => loadForm.current?.click()}
                    >
                        Загрузить
                    </Button>
                    {button && (
                        <Button
                            className="w-full sm:w-full md:w-auto lg:w-auto"
                            variant="outline"
                            onClick={button}
                        >
                            Добавить
                        </Button>
                    )}
                    {selectedFile && (
                        <button
                            onClick={handleRemoveClick}
                            className=""
                            aria-label="Remove image"
                        >
                            X
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

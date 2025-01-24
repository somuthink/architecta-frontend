import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export const ZoomableImage = ({
    src,
    alt,
    className,
}: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
>) => {
    if (!src) return null;
    return (
        <Dialog>
            <DialogTrigger asChild>
                <img
                    src={src}
                    alt={alt || ""}
                    sizes="100vw"
                    className={className}
                />
            </DialogTrigger>
            <DialogContent className="max-w-7xl border-0 bg-transparent p-0">
                <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-md">
                    <img
                        src={src}
                        alt={alt || ""}
                        className="h-full w-full object-contain"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

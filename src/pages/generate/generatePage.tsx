import { useState, useEffect } from "react";
import { InputImage } from "../../components/inputs/imageInput";
import { ZoomableImage } from "@/components/images/zoomableImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import res1 from "../../assets/res1.png";
import res2 from "../../assets/res2.png";
import res3 from "../../assets/res3.png";

interface Style {
    name: string;
    imageUrl: string;
}

export const generatePage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [styles, setStyles] = useState<Style[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [api, setApi] = useState<CarouselApi>();
    const [styleFile, setStyleFile] = useState<File | null>(null);
    const [currentStyle, setCurrentStyle] = useState(0);

    const [res1, setRes1] = useState<string | null>(null);
    const [res2, setRes2] = useState<string | null>(null);
    const [res3, setRes3] = useState<string | null>(null);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrentStyle(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrentStyle(api.selectedScrollSnap());
        });
    }, [api]);

    useEffect(() => {
        const fetchStyles = async () => {
            try {
                setLoading(true);

                const response = await fetch("/api/get_styles/", {
                    method: "GET",
                    headers: {
                        "bypass-tunnel-reminder": "true",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch styles list");
                }
                const styleNames: string[] = await response.json();

                const stylesWithImages: Style[] = await Promise.all(
                    styleNames.map(async (styleName) => {
                        const imageResponse = await fetch(
                            `api/get_style/?name=${encodeURIComponent(styleName)}`,
                            {
                                method: "GET",
                                headers: {
                                    "bypass-tunnel-reminder": "true",
                                },
                            },
                        );
                        if (!imageResponse.ok) {
                            throw new Error(
                                `Failed to fetch image for style ${styleName}`,
                            );
                        }

                        const imageBlob = await imageResponse.blob();
                        const imageUrl = URL.createObjectURL(imageBlob);
                        return { name: styleName, imageUrl };
                    }),
                );

                setStyles(stylesWithImages);
                setError(null);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchStyles();
    }, []);

    const handleUpload = async () => {
        if (!styleFile) {
            alert("No file selected!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", styleFile);

            const response = await fetch("api/load_style/", {
                method: "POST",
                body: formData,
                headers: {
                    "bypass-tunnel-reminder": "true",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("File uploaded successfully:", result);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const generateImage = async () => {
        if (!selectedFile) {
            alert("No file selected!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("sketch", selectedFile);
            formData.append("style_name", `${currentStyle}.jpg`);
            formData.append("prompt", "building");
            formData.append("width", "1080");
            formData.append("height", "720");

            const response = await fetch("api/generate/", {
                method: "POST",
                body: formData,
                headers: {
                    "bypass-tunnel-reminder": "true",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            return imageUrl;
        } catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    };

    const generateAllImages = async () => {
        const setResFunctions = [setRes1, setRes2, setRes3]; // Store state setters in an array

        for (let i = 0; i < setResFunctions.length; i++) {
            try {
                const url = await generateImage(); // Generate the image
                if (url !== null) {
                    setResFunctions[i](url); // Update the corresponding state
                } else {
                    alert(
                        `Failed to generate image ${i + 1}. Please try again.`,
                    );
                    break; // Exit the loop if any image fails
                }
            } catch (error) {
                alert(`Error generating image ${i + 1}: ${error.message}`);
                break; // Exit the loop if there's an error
            }
        }
    };
    return (
        <div className="flex items-center lg:justify-center h-full lg:flex-row md:flex-col sm:flex-col  lg:gap-20 md:gap-4  w-full p-20  ">
            <div className="lg:w-2/5 sm:w-full md:w-full flex flex-col gap-4">
                <InputImage
                    dragSize={32}
                    title="Загрузить эскиз"
                    desription="Загрузите или перетащите сюда эскиз в формате JPG, PNG"
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                ></InputImage>
                <div className="w-full flex  lg:flex-row md:flex-row sm:flex-col flex-col gap-1">
                    <Input className="w-full " placeholder="Введите запрос" />{" "}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    className="h-full sm:w-full"
                                    variant="outline"
                                >
                                    Авто
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <h1>
                                    Автосоставление запроса основанного на
                                    загруженном эскизе для достижения лучшего
                                    результата{" "}
                                </h1>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {loading && (
                    <div className="flex w-full h-64 items-center justify-center">
                        Loading styles...
                    </div>
                )}
                {error && (
                    <div className="flex w-full h-64 items-center justify-center text-red-500">
                        Error: {error}
                    </div>
                )}
                {!loading && !error && styles.length > 0 && (
                    <Carousel
                        setApi={setApi}
                        className="w-full"
                        opts={{ startIndex: 1 }}
                    >
                        <CarouselContent>
                            <CarouselItem key={0} className=" ">
                                <InputImage
                                    className="h-full"
                                    dragSize={64}
                                    button={handleUpload}
                                    title="Загрузить стиль"
                                    selectedFile={styleFile}
                                    setSelectedFile={setStyleFile}
                                ></InputImage>
                            </CarouselItem>

                            {styles.map((style) => (
                                <CarouselItem key={style.name} className=" ">
                                    <img
                                        className="w-full h-full  aspect-video object-cover rounded-md"
                                        src={style.imageUrl}
                                        alt={style.name}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                )}
            </div>

            <h1>{currentStyle}</h1>
            <div className="flex items-center justify-center lg:rotate-0 md:rotate-90 sm:rotate-90">
                <Button onClick={generateAllImages}>=</Button>
            </div>

            <div className="lg:w-2/5 sm:w-full md:w-full  flex items-center justify-center">
                <div className="grid gap-4  w-full  py-5">
                    <ZoomableImage
                        src={res1}
                        className="max-w-full rounded-lg hover:bg-black transition duration-500 hover:scale-105"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <ZoomableImage
                                src={res2}
                                className="max-w-full rounded-lg hover:bg-black transition duration-500 hover:scale-105"
                            />
                        </div>
                        <div>
                            <ZoomableImage
                                src={res3}
                                className="max-w-full rounded-lg hover:bg-black transition duration-500 hover:scale-105"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

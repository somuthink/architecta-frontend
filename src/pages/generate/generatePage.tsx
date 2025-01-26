import { useState, useEffect, useRef } from "react";
import { InputImage } from "@/components/inputs/imageInput";
import { SearchStyles, type Style } from "@/components/inputs/searchStyles";
import { ZoomableImage } from "@/components/images/zoomableImage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
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

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export const generatePage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [styles, setStyles] = useState<Style[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [api, setApi] = useState<CarouselApi>();
    const [selectedStyle, setSelectedStyle] = useState<Style>(0);
    const styleInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadCompleted, setUploadCompleted] = useState(false);

    const promptRef = useRef<HTMLInputElement | null>(null);

    const [generating, setGenerating] = useState<boolean>(false);
    const [res1, setRes1] = useState<string | null>(null);
    const [res2, setRes2] = useState<string | null>(null);
    const [res3, setRes3] = useState<string | null>(null);

    useEffect(() => {
        if (!api) {
            return;
        }

        api.scrollTo(selectedStyle.index - 1);
    }, [selectedStyle]);

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
                    styleNames.map(async (styleName, index) => {
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

                        const [label, _] = styleName.split(".");

                        const imageBlob = await imageResponse.blob();
                        const imageUrl = URL.createObjectURL(imageBlob);
                        return { name: styleName, label, imageUrl, index };
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
    }, [uploadCompleted]);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            alert("No file selected!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("image", file);

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

            setUploadCompleted((prev) => !prev);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const generatePrompt = async () => {
        if (!selectedFile) {
            alert("No file selected!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("sketch", selectedFile);
            formData.append("base", promptRef.current!.value);

            const response = await fetch("api/generate_prompt/", {
                method: "POST",
                body: formData,
                headers: {
                    "bypass-tunnel-reminder": "true",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            promptRef.current!.value = (await response.text()).replace('"', "");
            promptRef.current!.className =
                promptRef.current!.className + " border-indigo-500";

            return response;
        } catch (error) {
            alert("Error generating prompt");
            return;
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
            formData.append("style_name", selectedStyle.name);
            formData.append("prompt", promptRef.current!.value);
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
        setGenerating(true);
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
        setGenerating(false);
    };
    return (
        <div className="flex items-center lg:justify-center h-full lg:flex-row flex-col   lg:gap-20 md:gap-4  w-full lg:p-20 md:p-10  ">
            <div className="lg:w-2/5 w-full md:w-full flex flex-col gap-6">
                <InputImage
                    dragSize={32}
                    title="Загрузить эскиз"
                    desription="Загрузите или перетащите сюда эскиз в формате JPG, PNG"
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                ></InputImage>
                <div className="w-full flex  flex-col lg:flex-row md:flex-row   gap-1">
                    <Input
                        className="w-full "
                        placeholder="Пожелания или уточнения (желтые стены, зимняя погода...)"
                        ref={promptRef}
                    />{" "}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    className="h-full w-full "
                                    onClick={generatePrompt}
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
                    <div className="flex flex-col gap-2">
                        <Carousel
                            setApi={setApi}
                            className="w-full h-full"
                            opts={{ startIndex: 1 }}
                        >
                            <CarouselContent className="h-full">
                                {styles.map((style) => (
                                    <CarouselItem
                                        key={style.index}
                                        className="basis-1/3 "
                                    >
                                        <img
                                            className={`basis-1/3 h-32 aspect-video object-cover rounded-md ${
                                                selectedStyle.index ===
                                                style.index
                                                    ? "border-4 border-blue-500"
                                                    : ""
                                            }`}
                                            src={style.imageUrl}
                                            alt={style.name}
                                            onClick={() => {
                                                setSelectedStyle(style);
                                            }}
                                        />
                                        <h1 className="w-full text-gray-500 items-center justify-center text-center truncate">
                                            {style.label}
                                        </h1>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={() => {
                                    styleInputRef.current!.click();
                                }}
                            >
                                <Upload className="opacity-50" size={18} />
                                Загрузить
                            </Button>
                            <input
                                type="file"
                                ref={styleInputRef}
                                style={{ display: "none" }}
                                onChange={handleUpload}
                            />
                            <SearchStyles
                                styles={styles}
                                selectedStyle={selectedStyle}
                                setSelectedStyle={setSelectedStyle}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="rotate-90 flex items-center justify-center lg:rotate-0 md:rotate-90 w-24 ">
                {!generating ? (
                    <Button onClick={generateAllImages}>=</Button>
                ) : (
                    <div role="status">
                        <svg
                            aria-hidden="true"
                            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-black"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                )}
            </div>

            <div className="lg:w-2/5 w-full md:w-4/5  flex items-center justify-center">
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

import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

export interface Style {
    name: string;
    label: string;
    index: number;
    imageUrl: string;
}

interface Props {
    styles: Style[];
    selectedStyle: Style;
    setSelectedStyle: (style: Style) => void;
}

export const SearchStyles = ({
    styles,
    selectedStyle,
    setSelectedStyle,
}: Props) => {
    const [open, setOpen] = useState(false);

    const handleKeydown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "f") {
            e.preventDefault();
            setOpen(true);
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeydown);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-1/2 lg:w-auto md:w-auto lg:justify-start md:justify-start  truncate gap-2 "
                >
                    <Search className="opacity-50" size={18} />

                    {selectedStyle
                        ? styles.find(
                              (style) => style.label === selectedStyle.label,
                          )?.label
                        : "Искать стиль..."}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Искать стиль..." />
                    <CommandList>
                        <CommandEmpty>Таких стилей нет</CommandEmpty>
                        <CommandGroup>
                            {styles.map((style) => (
                                <CommandItem
                                    key={style.label}
                                    value={style.label}
                                    onSelect={() => {
                                        setSelectedStyle(style);
                                        setOpen(false);
                                    }}
                                >
                                    {style.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            selectedStyle.label === style.label
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

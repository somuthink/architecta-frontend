import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
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

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-start  truncate gap-2 "
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
                                    onSelect={(currentValue) => {
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

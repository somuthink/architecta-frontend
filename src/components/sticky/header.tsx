import { forwardRef } from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/buttons/themeToggle";
import { cn } from "@/lib/utils";

const ListItem = forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className,
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">
                        {title}
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

export const Header = () => {
    return (
        <NavigationMenu className="absolute mx-20  ">
            <NavigationMenuList className="">
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Справка</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            Web Интерфейс
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Сейчас вы находитесь в веб инерфейсе
                                            для легкого взаимодействия с
                                            системой
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/docs" title="Введение">
                                Кратко и понятно о том как пользоваться
                                платформой.
                            </ListItem>
                            <ListItem
                                href="/docs/installation"
                                title="Текстовые уточнения"
                            >
                                Как писать самому или использовать
                                авто-генерацию.
                            </ListItem>
                            <ListItem
                                href="/docs/primitives/typography"
                                title="Коллекции"
                            >
                                Как применяются коллекции и как загружать свои.
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Контакты</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            АрхитектА
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Генерация визуалов в стиле
                                            реалистичных 3д рендеров на основе
                                            набросков и эскизов
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <li>
                                <a
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                    href="/"
                                >
                                    arhitecta@buisnes.co
                                </a>
                            </li>

                            <li>
                                <a
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                    href="https://architectaaa.tb.ru/"
                                >
                                    architectaaa.tb.ru
                                </a>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <ModeToggle />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem
} from "@heroui/navbar";
import { Button, Kbd, Link, Input } from "@heroui/react";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import { siteConfig } from "@config/site";
import { GithubIcon, SearchIcon, Logo } from "@images/icons";
// import { useRouter } from "next/navigation";

// import { createClient } from "@/utils/supabase/client";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  // const supabase = createClient();
  // const router = useRouter();

  // Handle Logout
  // const handleLogout = async () => {
  //   const { error } = await supabase.auth.signOut();

  //   if (!error) {
  //     router.push("/");
  //   }
  // };

  // Search Component Logic
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().includes("MAC");
  const shortcutKeyLabel = isMac ? "⌘" : "Ctrl";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const isShortcutPressed =
        (isMac && event.metaKey && event.key === "k") ||
        (!isMac && event.ctrlKey && event.key === "k");

      if (isShortcutPressed) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchInput = (
    <Input
      ref={searchInputRef}
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm"
      }}
      endContent={<Kbd className="hidden lg:inline-block">{shortcutKeyLabel} K</Kbd>}
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit">
          <NextLink className="flex justify-start items-center" href="/">
            <Logo className="mt-3" size={40} />
            <p className="font-bold text-inherit">KeepItAlive</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden md:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "hover:text-primary data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem className="hidden sm:flex gap-4">
          <Button
            as={Link}
            color="primary"
            href={siteConfig.authLinks[0].href}
            size="md"
            variant="light"
          >
            Login
          </Button>
          <Button
            as={Link}
            color="primary"
            href={siteConfig.authLinks[1].href}
            size="md"
            variant="solid"
          >
            Signup
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

"use client";

import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { siteConfig } from "@config/site";
import { GithubIcon } from "@images/icons";

import { title, subtitle } from "@/components/primitives";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 max-w-7xl mx-auto">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Keep</span>
          <span className={title({ color: "primary" })}>IT</span>
          <span className={title()}>Alive</span>
          <br />
          <div className={subtitle({ class: "mt-4" })}>
            A modern platform that helps keep free resources active by regularly pinging them.
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>
      </section>
    </>
  );
}

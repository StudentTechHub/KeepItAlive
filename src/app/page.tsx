"use client";

import type { RootState } from "@/store";

import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";
import { siteConfig } from "@config/site";
import { GithubIcon } from "@images/icons";
import { Button } from "@heroui/button";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { increment, decrement, reset, setCounter } from "@/store/slices/counterSlice";
import { title, subtitle } from "@/components/primitives";

export default function Home() {
  const count = useSelector((state: RootState) => state.counter.value);
  const complexValue = useMemo(() => {
    return count * 10;
  }, [count]);

  const dispatch = useDispatch();

  return (
    <section className="flex flex-col items-center justify-center gap-4 pt-16 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Make&nbsp;</span>
        <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
        <br />
        <span className={title()}>websites regardless of your design experience.</span>
        <div className={subtitle({ class: "mt-4" })}>
          Beautiful, fast and modern React UI library.
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

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <h1>Counter: {count}</h1>
        <h1>Counter x 10: {complexValue}</h1>
        <div className="flex gap-4">
          <Button variant={"bordered"} onPress={() => dispatch(increment())}>
            Increment
          </Button>
          <Button variant={"bordered"} onPress={() => dispatch(decrement())}>
            Decrement
          </Button>
          <Button variant={"bordered"} onPress={() => dispatch(reset())}>
            Reset
          </Button>
          <Button variant={"bordered"} onPress={() => dispatch(setCounter(100))}>
            Set Counter to 100
          </Button>
        </div>
      </div>
    </section>
  );
}

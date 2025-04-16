"use client";

import type { RootState } from "@/store";

import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { increment, decrement, reset, setCounter } from "@/store/slices/counterSlice";
import { Button } from "@/components/ui/button";

export default function CounterComponent() {
  const count = useSelector((state: RootState) => state.counter.value);
  const complexValue = useMemo(() => {
    return count * 10;
  }, [count]);

  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <p className="text-primary-600">Theme is working</p>
      <h1>Counter: {count}</h1>
      <h1>Counter x 10: {complexValue}</h1>
      <div className="flex gap-4">
        <Button variant={"default"} onClick={() => dispatch(increment())}>
          Increment
        </Button>
        <Button variant={"ghost"} onClick={() => dispatch(decrement())}>
          Decrement
        </Button>
        <Button variant={"destructive"} onClick={() => dispatch(reset())}>
          Reset
        </Button>
        <Button variant={"outline"} onClick={() => dispatch(setCounter(100))}>
          Set Counter to 100
        </Button>
      </div>
    </div>
  );
}

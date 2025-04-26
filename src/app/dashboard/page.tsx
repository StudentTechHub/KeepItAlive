"use client";

import { Button } from "@heroui/button";

import { title, subtitle } from "@/components/primitives";

export default function DashboardPage() {
  return (
    <>
      <div className="inline-block max-w-xl text-center justify-center">
        <h1 className={`text-2xl font-bold ${title()}`}>Dashboard</h1>
        <p className={`text-lg ${subtitle()}`}>Welcome to the dashboard!</p>
      </div>
      <Button
        className="mt-4 text-lg"
        color="primary"
        size="lg"
        variant="faded"
        onPress={() => (window.location.href = "/dashboard/profile")}
      >
        Profile
      </Button>
    </>
  );
}

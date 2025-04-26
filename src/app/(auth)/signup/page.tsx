"use client";

import React, { useState, useEffect, FunctionComponent } from "react";
import Link from "next/link";
import { Button, Input, Form } from "@heroui/react";
import {
  GoogleIcon,
  FacebookIcon,
  DiscordIcon,
  EyeSlashFilledIcon,
  EyeFilledIcon,
  MailIcon,
  KeyIcon,
  MentionCircle
} from "@images/icons";

import { Separator } from "@/components/separator";

const Signup: FunctionComponent = () => {
  const [email, setEmail] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    length: 0,
    uppercase: 0,
    symbol: 0
  });
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    setPasswordFocused(false);
  }, []);

  const passwordRequirements = {
    length: "At least 8 characters long",
    uppercase: "At least 1 uppercase letter",
    symbol: "At least 1 symbol"
  };
  const toggleVisibility = () => setIsVisible((prev) => !prev);

  //* Email Validation
  const validateEmail = (value: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
  const isInvalid = email !== "" && !validateEmail(email);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert("Form submitted!");
  };

  return (
    <>
      <Form
        autoCapitalize="off"
        autoComplete="off"
        className="w-full flex flex-col gap-6"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-8 w-full">
          <header className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-2xl font-normal leading-5">Create your account</h1>
            <span className="text-default-700 leading-5">Enter your credentials to proceed</span>
          </header>
          <section className="flex flex-col items-center justify-center w-full gap-5">
            <Input
              isClearable
              className="max-w-xs"
              label={<span className="text-xs pl-3">Username</span>}
              labelPlacement="outside"
              placeholder="johndoe"
              size="lg"
              startContent={
                <MentionCircle className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              type="text"
              validate={(value) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters long";
                }

                return value === "admin" ? "Nice try!" : null;
              }}
              variant="bordered"
            />
            <Input
              isClearable
              className="max-w-xs"
              color={isInvalid ? "danger" : "default"}
              errorMessage={isInvalid && "Invalid email address"}
              isInvalid={isInvalid}
              label={<span className="text-xs pl-3">Email</span>}
              labelPlacement="outside"
              placeholder="johndoe@example.com"
              size="lg"
              startContent={
                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              type="email"
              variant="bordered"
              onValueChange={setEmail}
            />
            <Input
              className="max-w-xs"
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              errorMessage={
                passwordFocused &&
                Object.keys(passwordRequirements).map(
                  (key) =>
                    !passwordStrength[key as keyof typeof passwordStrength] && (
                      <li key={key}>
                        {passwordRequirements[key as keyof typeof passwordRequirements]}
                      </li>
                    )
                )
              }
              isInvalid={passwordFocused && passwordStrength.strength < 3}
              label={<span className="text-xs pl-3">Password</span>}
              labelPlacement="outside"
              placeholder="●●●●●●●●"
              size="lg"
              startContent={
                <KeyIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
              type={isVisible ? "text" : "password"}
              variant="bordered"
              onBlur={() => setPasswordFocused(false)}
              onFocus={() => setPasswordFocused(true)}
              onValueChange={(input) => {
                let strength = { strength: 0, length: 0, uppercase: 0, symbol: 0 };

                if (input.length >= 8) {
                  strength.strength += 1;
                  strength.length += 1;
                }
                if ((input.match(/[A-Z]/g) || []).length >= 1) {
                  strength.strength += 1;
                  strength.uppercase += 1;
                }
                if ((input.match(/[^a-z0-9]/gi) || []).length >= 1) {
                  strength.strength += 1;
                  strength.symbol += 1;
                }
                setPasswordStrength(strength);
              }}
            />
          </section>
        </div>
        <footer className="flex flex-col items-center justify-center w-full gap-2 px-3">
          <Button
            className="bg-primary/75 w-full font-medium text-default-50 text-sm rounded-2xl"
            color="primary"
            type="submit"
            variant="bordered"
          >
            Sign up
          </Button>
          <p className="text-default-800 text-sm leading-6">
            Already have an account?
            <Link className="text-primary-500" href={"/login"}>
              {" "}
              Log<span className="underline"> in</span>
            </Link>
          </p>
        </footer>
        <footer className="flex flex-col items-center w-full justify-center gap-2 px-3">
          <Separator text="or sign up with" />
          <div className="flex gap-4 justify-center">
            <Button
              isIconOnly
              className="bg-default-50/75 box-border rounded-2xl"
              color="default"
              size="lg"
              variant="bordered"
            >
              <GoogleIcon className="text-[#8E8E8E]" />
            </Button>
            <Button
              isIconOnly
              className="bg-default-50/75 box-border rounded-2xl"
              color="default"
              size="lg"
              variant="bordered"
            >
              <DiscordIcon className="text-[#8E8E8E]" />
            </Button>
            <Button
              isIconOnly
              className="bg-default-50/75 box-border rounded-2xl"
              color="default"
              size="lg"
              variant="bordered"
            >
              <FacebookIcon className="text-[#8E8E8E]" />
            </Button>
          </div>
        </footer>
      </Form>
    </>
  );
};

export default Signup;

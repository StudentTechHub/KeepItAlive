"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Button, Input, Form } from "@heroui/react";
import {
  UserIcon,
  DeleteIcon,
  EyeFilledIcon,
  EyeSlashFilledIcon,
  MailIcon,
  EditIcon
} from "@images/icons";

const passwordRequirements = {
  length: "At least 8 characters long",
  uppercase: "At least 1 uppercase letter",
  symbol: "At least 1 symbol"
};

const validateEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const calculatePasswordStrength = (input: string) => {
  const strength = { strength: 0, length: 0, uppercase: 0, symbol: 0 };

  if (input.length >= 8) strength.strength += 1;
  if ((input.match(/[A-Z]/g) || []).length >= 1) strength.strength += 1;
  if ((input.match(/[^a-z0-9]/gi) || []).length >= 1) strength.strength += 1;

  return strength;
};

interface PasswordInputProps {
  label: string;
  onChange: (value: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  errorMessage?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  onChange,
  isVisible,
  onToggleVisibility,
  errorMessage
}) => (
  <Input
    className="max-w-xs"
    endContent={
      <button
        aria-label="toggle password visibility"
        className="focus:outline-none"
        type="button"
        onClick={onToggleVisibility}
      >
        {isVisible ? (
          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
        ) : (
          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
        )}
      </button>
    }
    errorMessage={errorMessage}
    label={<span className="text-sm pl-3">{label}</span>}
    labelPlacement="outside"
    placeholder="●●●●●●●●"
    size="lg"
    type={isVisible ? "text" : "password"}
    variant="bordered"
    onValueChange={onChange}
  />
);

export default function ProfilePage() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    length: 0,
    uppercase: 0,
    symbol: 0
  });
  const [passwordFocused, setPasswordFocused] = useState(false);

  const toggleVisibility = useCallback(() => setIsVisible((prev) => !prev), []);

  const handlePasswordChange = (input: string) => {
    const strength = calculatePasswordStrength(input);

    setPasswordStrength(strength);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Form
      autoCapitalize="off"
      autoComplete="off"
      className="flex flex-col h-full"
      onSubmit={onSubmit}
    >
      {/* Avatar */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-xl font-medium">Avatar</span>
          <span className="text-base font-normal">Upload or Choose a new avatar</span>
        </div>
        <div className="relative mx-auto">
          <div className="absolute top-0 cursor-pointer right-0 p-2 bg-[#F6F6FC] flex justify-center items-center rounded-full">
            <EditIcon className="text-[#6C50B1]" />
          </div>
          <Image
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-primary-700"
            height={512}
            src="/images/avatars/avatar.png"
            width={512}
          />
          <div className="absolute bottom-1 cursor-pointer right-1 h-8 w-8 flex justify-center items-center  bg-danger-400 rounded-full">
            <DeleteIcon />
          </div>
        </div>
      </div>

      <p className="h-px my-2 w-full bg-neutral-400" />

      {/* Personal Info */}
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <span className="text-xl font-medium">Personal Information</span>
          <span className="text-base font-normal">View or edit your information</span>
        </div>
        <div className="flex flex-col gap-5">
          <Input
            isClearable
            className="max-w-xs"
            label={<span className="text-sm pl-3">Name</span>}
            labelPlacement="outside"
            placeholder="johndoe"
            size="lg"
            startContent={<UserIcon className="text-2xl text-default-400" />}
            type="text"
            variant="bordered"
          />
          <Input
            isClearable
            className="max-w-xs"
            label={<span className="text-sm pl-3">Email</span>}
            labelPlacement="outside"
            placeholder="johndoe"
            size="lg"
            startContent={<MailIcon className="text-2xl text-default-400" />}
            type="text"
            validate={(value) => {
              if (value.includes("@")) {
                return validateEmail(value) ? null : "Invalid email address";
              }
              if (value.length < 3) return "Username must be at least 3 characters long";

              return null;
            }}
            variant="bordered"
          />
        </div>
      </div>

      <p className="h-px my-2 w-full bg-neutral-400" />

      {/* Security Section */}
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <span className="text-xl font-medium">Password and 2FA</span>
          <span className="text-base font-normal">
            Change your password, or enable 2FA for your account
          </span>
        </div>
        <div className="flex flex-col gap-5">
          {["Current Password", "New Password", "Confirm Password"].map((label, idx) => (
            <PasswordInput
              key={idx}
              errorMessage={
                passwordFocused
                  ? Object.keys(passwordRequirements)
                      .filter((key) => !passwordStrength[key as keyof typeof passwordStrength])
                      .map((key) => passwordRequirements[key as keyof typeof passwordRequirements])
                      .join(", ")
                  : undefined
              }
              isVisible={isVisible}
              label={label}
              onChange={handlePasswordChange}
              onToggleVisibility={toggleVisibility}
            />
          ))}
        </div>
      </div>

      <p className="h-px my-2 w-full bg-neutral-400" />

      {/* Notification & Webhooks */}
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <span className="text-xl font-medium">Notifications and Webhooks</span>
          <span className="text-base font-normal">Configure Defaults</span>
        </div>
        <div className="flex flex-col gap-5">
          <Input
            isClearable
            label={<span className="text-sm pl-3">Default Webhook URL</span>}
            labelPlacement="outside"
            placeholder="mongodb://..."
            size="lg"
            type="text"
            variant="bordered"
          />
          <Input
            isClearable
            label={<span className="text-sm pl-3">Default Triggers</span>}
            labelPlacement="outside"
            placeholder="JSON Object"
            size="lg"
            type="text"
            variant="bordered"
          />
        </div>
      </div>

      <p className="h-px my-2 w-full bg-neutral-400" />

      {/* Danger Zone */}
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <span className="text-xl font-medium">Danger Zone</span>
          <span className="text-base font-normal">Delete your account here</span>
        </div>
        <div className="flex flex-col gap-6">
          <Button
            className="bg-danger-400 text-base text-neutral-50 w-fit"
            size="md"
            startContent={<DeleteIcon size={24} />}
            variant="flat"
          >
            Delete
          </Button>
        </div>
      </div>
    </Form>
  );
}

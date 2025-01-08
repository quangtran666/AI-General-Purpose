"use client"

import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react"

function SignInToChat() {
  return (
    <div>
      <Image
        src={"/SignInChatsIcon.svg"}
        alt="SignInChatsIcon"
        width={500}
        height={500}
      />
      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-sm text-neutral-400 font-medium">
          Sign in for free to save your chat history
        </p>
        <Button 
            onClick={() => signIn() } 
            className="text-neutral-200"
        >
            Sign In
        </Button>
      </div>
    </div>
  );
}

export default SignInToChat;

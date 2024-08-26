"use client";

import { FC, useState } from "react";
import { SingInFlow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

export const AuthScreen: FC = () => {
  const [state, setState] = useState<SingInFlow>("singIn")

  return (
    <div
      className="h-full flex items-center justify-center bg-[#5C3B58]"
    >
      <div
        className="md:h-auto md:w-[420px]"
      >
        {
          state === "singIn"
          ? <SignInCard setState={setState}/>
          : <SignUpCard setState={setState}/>
        }
      </div>
    </div>
  )
}
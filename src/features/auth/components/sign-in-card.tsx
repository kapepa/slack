"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SingInFlow } from "../types";

interface SignInCardProps {
  setState: Dispatch<SetStateAction<SingInFlow>>
}

const SignInCard: FC<SignInCardProps> = (props) => {
  const { setState } = props;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <Card
      className="w-full h-full p-8"
    >
      <CardHeader
        className="px-0 pt-0"
      >
        <CardTitle>
          Login to continue
        </CardTitle>
      </CardHeader>
      <CardDescription>
        Use your email or another service to continue
      </CardDescription>
      <CardContent
        className="space-y-5 px-0 pb-0"
      >
        <form
          className="space-y-2.5"
        >
          <Input
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={false}
          >
            Continue
          </Button>
        </form>
        <Separator/>
        <div
          className="flex flex-col gap-y-2.5"
        >
          <Button
            disabled={false}
            onClick={() => {}}
            variant="outline"
            className="w-full relative"
          >
            <FcGoogle
              className="size-5 absolute top-3 left-2.5"
            />
            Continue with Google
          </Button>
          <Button
            disabled={false}
            onClick={() => {}}
            variant="outline"
            className="w-full relative"
          >
            <FaGithub
              className="size-5 absolute top-3 left-2.5"
            />
            Continue with Github
          </Button>
        </div>
        <p
          className="text-xs text-muted-foreground"
        >
          Don't have an account? &nbsp;
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("singUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  )
}

export { SignInCard }
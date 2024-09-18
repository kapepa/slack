"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dispatch, FC, FormEvent, SetStateAction, useState, useTransition } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ProvidersValue, SingInFlow } from "../types";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignInCardProps {
  setState: Dispatch<SetStateAction<SingInFlow>>
}

const SignInCard: FC<SignInCardProps> = (props) => {
  const { setState } = props;
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string>()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPending, startTransition] = useTransition()

  const onProviderSignIn = (value: ProvidersValue) => {
    startTransition(async() => {
      await signIn(value);
    })
  }

  const onPasswordSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      // await signIn("password", formData).catch((e) => {
      //   setError("Invalid email or password");
      // });
      signIn("password", {email, password, flow: "signIn"}).catch((e) => {
        setError("Invalid email or password");
      });
    })
  }

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
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {
        !!error
        && (
          <div
            className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-sm text-destructive mb-6"
          >
            <TriangleAlert
              className="size-4"
            />
            <p>
              { error }
            </p>
          </div>
        )
      }
      <CardContent
        className="space-y-5 px-0 pb-0"
      >
        <form
          className="space-y-2.5"
          onSubmit={onPasswordSignIn}
        >
          <Input
            disabled={isPending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            name="email"
            required
          />
          <Input
            disabled={isPending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            name="password"
            required
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            Continue
          </Button>
        </form>
        <Separator/>
        <div
          className="flex flex-col gap-y-2.5"
        >
          <Button
            disabled={isPending}
            onClick={onProviderSignIn.bind(null, "google")}
            variant="outline"
            className="w-full relative"
          >
            <FcGoogle
              className="size-5 absolute top-3 left-2.5"
            />
            Continue with Google
          </Button>
          <Button
            disabled={isPending}
            onClick={onProviderSignIn.bind(null, "github")}
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
          Don&apos;t have an account? &nbsp;
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
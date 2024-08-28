"use client"

import { Dispatch, FC, FormEvent, SetStateAction, useState, useTransition } from "react";
import { ProvidersValue, SingInFlow } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpCardProps {
  setState: Dispatch<SetStateAction<SingInFlow>>,
}

const SignUpCard: FC<SignUpCardProps> = (props) => {
  const { setState } = props;
  const { signIn } = useAuthActions();

  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const onProviderSignUp = (value: ProvidersValue) => {
    startTransition(async() => {
      await signIn(value);
    })
  }

  const onPasswordSingUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirm) {
      return setError("Password do not match");
    }

    startTransition(async () => {
      await signIn("password", { name, email, password, flow: "signUp" })
        .catch((e) => {
          setError("Something went wrong");
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
          Sign up to continue
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
          onSubmit={onPasswordSingUp}
        >          
          <Input
            disabled={isPending}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            type="text"
            name="name"
            required
          />
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
          <Input
            disabled={isPending}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            type="password"
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
            onClick={onProviderSignUp.bind(null, "google")}
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
            onClick={onProviderSignUp.bind(null, "github")}
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
          Already have an account? &nbsp;
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("singIn")}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  )
}

export { SignUpCard }
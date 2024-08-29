"use client"

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type ReqType = { name: string };
type ResType = Id<"workspaces"> | null;

type Options = {
  onSuccess?: (data: ResType) => void,
  onError?: (error: Error) => void,
  onSettled?: () => void,
  throwError?: boolean,
}

type StatusType = "success" | "error" | "settled" | "pending" | null;

export const useCreateWorkspace = () => {
  const [data, setData] = useState<ResType>(null);
  const [error, setError] = useState<Error | null>(null);

  const [status, setStatus] = useState<StatusType>(null);

  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled= useMemo(() => status === "settled", [status]);
  const isPending = useMemo(() => status === "pending", [status]);

  const mutation = useMutation(api.workspaces.create);
  const mutate = useCallback(async (values: ReqType, options?: Options) => {
    try {
      setData(null);
      setError(null);
      setStatus("pending")

      const response = await mutation(values);
      options?.onSuccess?.(response);
      return response;
    } catch (error) {
      options?.onError?.(error as Error);
      if (options?.throwError) throw error;
    } finally {
      setStatus("settled");
      options?.onSettled?.();
    }
  }, [mutation]);

  return {
    mutate,
    data,
    error, 
    isSuccess,
    isError,
    isSettled,
    isPending,
  }
}
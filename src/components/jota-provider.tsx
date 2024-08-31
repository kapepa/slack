"use client"

import { FC, ReactNode } from "react";
import { Provider } from "jotai";

interface JotaProviderProps {
  children: ReactNode,
}

const JotaProvider: FC<JotaProviderProps> = (props) => {
  const { children } = props;

  return (
    <Provider>
      { children }
    </Provider>
  )
}

export { JotaProvider }
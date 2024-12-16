import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { Api } from "../lib/api";

type LocalData = { phoneNumber: string; password: string; session: string };

type TelegramContext = {
  localData: LocalData | null;
  api: Api;
  apiId: number;
  apiHash: string;
  connected: boolean;
  client: TelegramClient;
  setLocalData: (value: LocalData) => void;
  setSession: (value: string) => void;
};

const TelegramContext = createContext<Partial<TelegramContext>>({});

type ProviderProps = {
  apiId: number;
  apiHash: string;
  apiBaseURL: string;
  connectionRetries?: number;
};

export default function Provider({
  apiId,
  apiHash,
  connectionRetries,
  apiBaseURL,
  children,
}: ProviderProps & React.PropsWithChildren) {
  const api = useMemo(() => new Api(apiBaseURL), [apiBaseURL]);
  const [connected, setConnected] = useState(false);

  const [session, setSession] = useState(
    () => window.localStorage.getItem("local.session") ?? ""
  );
  const _session = useMemo(() => new StringSession(session), [session]);

  const client = useMemo(
    () => new TelegramClient(_session, apiId, apiHash, { connectionRetries }),
    [apiId, apiHash, _session, connectionRetries]
  );

  const [localData, setLocalData] = useState(() => {
    const local = localStorage.getItem("local.data");
    if (local) return JSON.parse(local) as TelegramContext["localData"];
    return null;
  });

  useEffect(() => {
    client.connect().then(setConnected);
  }, [client]);

  return (
    <TelegramContext.Provider
      value={{
        connected,
        client,
        apiHash,
        apiId,
        api,
        localData,
        setLocalData: (value) => {
          setLocalData(value);
          localStorage.setItem("local.data", JSON.stringify(value));
        },
        setSession: (value) => {
          setConnected(false);
          setSession(value);
        },
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export const useTelegram = () => useContext(TelegramContext) as TelegramContext;

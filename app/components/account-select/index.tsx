import type { LinksFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Form, useSearchParams } from "@remix-run/react";
import diacritics from "diacritics";
import Overlay from "../overlay";
import SubmitButton from "../submit-button";
import styles from "./styles.css";
import type { AccountConnection } from "~/ts/types";
import Input from "../input";

interface AccountSelectProps {
  accounts: AccountConnection[],
  store: string;
  platform: string;
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles }
];

export default function AccountSelect({ accounts, store, platform }: AccountSelectProps) {
  const [client, setClient] = useState<AccountConnection>();
  const [open, setOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [searchParams] = useSearchParams();

  const normalizedSearchValue = diacritics.remove(searchValue.toLowerCase());
  const filteredAccounts = accounts.filter(account => {
    const normalizedAccountName = diacritics.remove(account.name.toLowerCase());
    return normalizedAccountName.includes(normalizedSearchValue);
  });

  const handleAccountSelect = (account: AccountConnection) => {
    setClient(account);
  };

  useEffect(() => {
    // If the selected account is filtered out, reset the client
    if (client && !filteredAccounts.some(account => account.id === client.id)) {
      setClient(undefined);
    }
  }, [client, filteredAccounts]);

  return (
    <>
      {open
        ? <Overlay onClick={() => setOpen(false)}>
          <Form
            className="
              animated-form
              bg-black-bg backdrop-blur-[120px] 
              max-w-4xl w-full min-h-[489px] max-h-[720px]
              border border-black-secondary rounded-2xl
              p-5 md:p-14
              flex flex-col gap-8
            "
            method="post"
            onClick={(e) => e.stopPropagation()}
            action={`/integracoes?store=${searchParams.get("store")}`}
          >
            <div className="flex w-full justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-semibold max-md:max-w-[218px]">Selecione uma conta</h2>
              <div className="p-4 bg-black-border rounded border-black-secondary" onClick={() => setOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                  <path d="M17.4801 6.76987L6.51992 17.73M17.4801 17.73L13.4142 13.6642M6.51992 6.76987L10.5858 10.8357" stroke="#EFEFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {!!accounts.length && (<Input
              type="text"
              name="account-name"
              placeholder="Buscar"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="px-2 py-1 border rounded w-full"
            />)}
            <input type="hidden" name="action" value="connect" />
            <input type="hidden" name="id" value={client?.id} />
            <input type="hidden" name="name" value={client?.name} />
            <input type="hidden" name="platform" value={platform} />
            <input type="hidden" name="store" value={store} />
            <div className="relative overflow-hidden flex flex-col flex-grow" id="accounts-list">
              <div className="relative overflow-y-scroll h-full">
                {!accounts.length ?
                  (
                    <p className="subtitle">Essa conta <span className="capitalize">{platform.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</span> não possui acesso a uma conta de anúncios, tente conectar com outra.</p>
                  ) :
                  <>
                    {filteredAccounts.map((account, index) => (
                      <div key={index} className="flex items-center justify-start my-2 first:my-0 last:pb-5">
                        <input
                          type="checkbox"
                          id={account.id.toString()}
                          checked={account.id.toString() === client?.id.toString()}
                          className="peer hidden"
                          onChange={() => handleAccountSelect(account)}
                        />
                        <label
                          htmlFor={account.id.toString()}
                          className="flex items-center space-x-2 rounded-lg p-4 block w-full cursor-pointer hover:bg-black-secondary peer-checked:bg-purple peer-checked:font-bold"
                        >{account.name}</label>
                      </div>
                    ))}
                  </>

                }
              </div>
            </div>
            {accounts.length ?
              (<SubmitButton label="Conectar" />)
              :
              (<SubmitButton label="Cancelar" onClick={() => setOpen(false)} />)
            }
          </Form>
        </Overlay>
        :
        null
      }
    </>
  )
}

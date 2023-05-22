import { useEffect, useState } from "react";
import { Form } from "@remix-run/react";
import Overlay from "../overlay";
import SubmitButton from "../submit-button";
import styles from "./styles.css";
import type { LinksFunction } from "@remix-run/node";

export interface IAccounts {
  id: number;
  resource_name: string;
  descriptive_name: string;
}

interface data {
  response: IAccounts[],
  store: string;
  platform: string;
}

interface data2 {
  data: data;
}

interface IClient {
  id: string;
  descriptive_name: string;
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles }
];

export default function AccountSelect(data: data2) {
  const [accounts, setAccounts] = useState<IAccounts[]>(data.data.response);
  const [selectedAccount, setSelectedAccount] = useState<IAccounts>(accounts[0]);
  const [client, setClient] = useState<IClient>({ id: "", descriptive_name: "" })
  const [open, setOpen] = useState(true)

  const handleAccountSelect = (accountId: number) => {
    setSelectedAccount(accounts.find((account) => account.id === accountId));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation()
    event.preventDefault()

    const formFields = new FormData(event.target);

    const response = await fetch("/integrations", {
      method: "POST",
      body: formFields
    });

    if (response.status === 200) {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (selectedAccount?.id && selectedAccount?.descriptive_name) {
      setClient({ id: selectedAccount?.id.toString(), descriptive_name: selectedAccount?.descriptive_name })
    }

  }, [selectedAccount]);

  return (
    <>
      {open
        ? <Overlay onClick={() => setOpen(false)}>
          <Form
            className="
              fixed animated-form
              bg-black-bg backdrop-blur-[120px] 
              max-w-2xl w-full min-h-[489px] max-h-[720px]
              border border-black-secondary rounded-2xl
              p-14 
              flex flex-col gap-8
            "
            method="post"
            onSubmit={handleSubmit}
            action="/integrations"
          >
            <h2 className="h h5">Selecione uma conta</h2>
            <input type="hidden" name="actionType" value="connect" />
            <input type="hidden" name="id" value={client.id} />
            <input type="hidden" name="descriptive_name" value={client.descriptive_name} />
            <input type="hidden" name="platform" value={data.data.platform} />
            <input type="hidden" name="store" value={data.data.store} />
            {/* <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl z-10"></div> */}
            {/* <div className="fixed bg-black/[0.02] backdrop-blur-[120px] w-[705px] min-h-[489px] rounded-2xl px-[72.5px] py-[62.5px] flex flex-col justify-center"></div> */}
            <div className="relative overflow-hidden flex flex-col" id="accounts-list">
              <div className="relative overflow-y-scroll h-full" >
                {accounts.map((account, index) => (
                  <div key={index} className="flex items-center justify-start my-2 first:my-0 last:my-0">
                    <input
                      type="checkbox"
                      id={account.id}
                      checked={selectedAccount && selectedAccount.id === account.id}
                      className="peer hidden"
                      onChange={() => handleAccountSelect(account.id)}
                    />
                    <label
                      for={account.id}
                      className="flex items-center space-x-2 rounded-lg p-4 block w-full cursor-pointer hover:bg-black-secondary peer-checked:bg-purple peer-checked:font-bold"
                    >{account.descriptive_name}</label>
                  </div>
                ))}
              </div>
            </div>
            <SubmitButton label="Conectar" onClick={handleSubmit} />
          </Form>
        </Overlay>
        :
        null
      }
    </>
  )
}
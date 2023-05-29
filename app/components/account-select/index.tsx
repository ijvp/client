import type { LinksFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Form } from "@remix-run/react";
import Overlay from "../overlay";
import SubmitButton from "../submit-button";
import styles from "./styles.css";
import type { AccountConnection } from "~/ts/types";

interface AccountSelectProps {
  accounts: AccountConnection[],
  store: string;
  platform: string;
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles }
];

export default function AccountSelect({ accounts, store, platform }: AccountSelectProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [client, setClient] = useState<AccountConnection>();
  const [open, setOpen] = useState(true);

  const handleAccountSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const formFields = new FormData(event.target);

    const response = await fetch("/integrations", {
      method: "POST",
      body: formFields
    });

    if (response.status === 200) {
      setOpen(false);
    };
  };

  useEffect(() => {
    setClient(accounts[selectedIndex]);
  }, [accounts, selectedIndex]);

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
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            action="/integrations"
          >
            <h2 className="h h5">Selecione uma conta</h2>
            <input type="hidden" name="action" value="connect" />
            <input type="hidden" name="id" value={client?.id} />
            <input type="hidden" name="name" value={client?.name} />
            <input type="hidden" name="platform" value={platform} />
            <input type="hidden" name="store" value={store} />
            {/* <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl z-10"></div> */}
            {/* <div className="fixed bg-black/[0.02] backdrop-blur-[120px] w-[705px] min-h-[489px] rounded-2xl px-[72.5px] py-[62.5px] flex flex-col justify-center"></div> */}
            <div className="relative overflow-hidden flex flex-col flex-grow" id="accounts-list">
              <div className="relative overflow-y-scroll h-full">
                {!accounts.length ?
                  (
                    <p className="subtitle">Essa conta <span className="capitalize">{platform}</span> não possui acesso a uma conta de anúncios, tente conectar com outra.</p>
                  ) : accounts.map((account, index) => (
                    <div key={index} className="flex items-center justify-start my-2 first:my-0 last:pb-5">
                      <input
                        type="checkbox"
                        id={account.id.toString()}
                        checked={index === selectedIndex}
                        className="peer hidden"
                        onChange={() => handleAccountSelect(index)}
                      />
                      <label
                        htmlFor={account.id.toString()}
                        className="flex items-center space-x-2 rounded-lg p-4 block w-full cursor-pointer hover:bg-black-secondary peer-checked:bg-purple peer-checked:font-bold"
                      >{account.name}</label>
                    </div>
                  ))}
                { }
              </div>
            </div>
            <SubmitButton label="Conectar" />
          </Form>
        </Overlay>
        :
        null
      }
    </>
  )
}
import { useEffect, useState } from "react";
import { Form, useSubmit } from "@remix-run/react";
import Overlay from "../overlay";

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

export default function AccountSelect(data: data2) {
    const [accounts, setAccounts] = useState<IAccounts[]>(data.data.response);
    const [selectedAccount, setSelectedAccount] = useState<IAccounts>(accounts[0]);
    const [client, setClient] = useState<IClient>({ id: "", descriptive_name: "" })
    const [open, setOpen] = useState(true)
    const submit = useSubmit();

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
                ? <Overlay >
                    <Form
                        className="fixed bg-black/[0.02] backdrop-blur-[120px] w-[705px] min-h-[489px] rounded-2xl px-[72.5px] py-[62.5px] flex flex-col justify-between"
                        method="post"
                        onSubmit={handleSubmit}
                        action="/integrations"
                    >
                        <div className="flex flex-col h-max">
                            <input type="hidden" name="actionType" value="connect" />
                            <input type="hidden" name="id" value={client.id} />
                            <input type="hidden" name="descriptive_name" value={client.descriptive_name} />
                            <input type="hidden" name="platform" value={data.data.platform} />
                            <input type="hidden" name="store" value={data.data.store} />
                            {/* <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl z-10"></div> */}
                            {/* <div className="fixed bg-black/[0.02] backdrop-blur-[120px] w-[705px] min-h-[489px] rounded-2xl px-[72.5px] py-[62.5px] flex flex-col justify-center"></div> */}
                            {accounts.map((account) => (
                                account.id && account.descriptive_name ?
                                    <label
                                        key={account.id}
                                        //className="flex items-center space-x-2"
                                        className={`flex items-center space-x-2 rounded p-1 cursor-pointer gap-3 ${selectedAccount && selectedAccount.id === account.id
                                            ? "bg-black-secondary"
                                            : ""
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedAccount && selectedAccount.id === account.id}
                                            onChange={() => handleAccountSelect(account.id)}
                                            style={{ display: "none" }}
                                        />
                                        <span>{account.descriptive_name}</span>
                                        <span>{account.id}</span>
                                    </label>
                                    :
                                    null
                            ))}
                            <div className="flex-grow" />
                        </div>
                        <div className="flex justify-center mt-4 bottom-0">
                            <button className={"flex justify-center items-center h-[60px] p-4 rounded-lg bg-purple text-white border-0 hover:transition-colors ease-in-out duration-300 hover:bg-dark-purple"}>
                                Connect
                            </button>
                        </div>
                    </Form>
                </Overlay>
                :
                null
            }
        </>
    )
}
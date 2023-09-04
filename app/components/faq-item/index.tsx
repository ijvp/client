import { useState } from "react";

interface IFAQItem {
    answer: string;
    question: string;
}

export default function FAQItem({ answer, question }: IFAQItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black-border py-2.5 px-6 text-white w-full flex flex-col cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="w-full py-4 flex justify-between items-center text-md md:text-xl font-bold">
            { question }
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`${open && 'rotate-[135deg]'} menu-transition`}>
                <path d="M19.8301 7.83008H13.6699V1.66992C13.6699 0.747643 12.9223 0 12 0C11.0777 0 10.3301 0.747643 10.3301 1.66992V7.83008H4.16992C3.24764 7.83008 2.5 8.57772 2.5 9.5C2.5 10.4223 3.24764 11.1699 4.16992 11.1699H10.3301V17.3301C10.3301 18.2524 11.0777 19 12 19C12.9223 19 13.6699 18.2524 13.6699 17.3301V11.1699H19.8301C20.7524 11.1699 21.5 10.4223 21.5 9.5C21.5 8.57772 20.7524 7.83008 19.8301 7.83008Z" fill="#5B4EEE"/>
            </svg>
        </div>
        <div className={`${open ? 'max-h-[800px] pt-4 pb-6' : 'max-h-[0px]'} text-md md:text-xl w-full menu-transition overflow-hidden`}>
            { answer }
        </div>
    </div>
  )
}
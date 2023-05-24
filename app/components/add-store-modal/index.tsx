import { LinksFunction, redirect } from "@remix-run/node";
import SubmitButton, { links as submitButtonLinks } from "../submit-button";
import Input from "../input";
import type { ChangeEvent } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { postShopifyStore } from "~/api";
import Overlay from "../overlay";
import { Form, useFetcher, useSubmit } from "@remix-run/react";

export const links: LinksFunction = () => [
  ...submitButtonLinks()
];

interface AddStoreModalProps {
  onClick: () => void;
}

export default function AddStoreModal({ onClick }: AddStoreModalProps) {
  const [allDataValid, setAllDataValid] = useState(false);
  const [data, setData] = useState({ url: '', accessToken: '', storefrontToken: '' });
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isAccessTokenValid, setIsAccessTokenValid] = useState(false);
  const [isStorefrontTokenValid, setIsStorefrontTokenValid] = useState(false);
  const [urlClicked, setUrlClicked] = useState(false);
  const [accessTokenClicked, setAccessTokenClicked] = useState(false);
  const [storefrontTokenClicked, setStorefrontTokenClicked] = useState(false);
  const [errors, setErrors] = useState("");

  const handleValidation = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (name === "url") {
        const pattern = /\.myshopify\.com$/;
        setIsUrlValid(pattern.test(newData.url.toString()));

      } else if (name === "accessToken") {
        setIsAccessTokenValid(newData.accessToken.length >= 32);

      } else if (name === "storefrontToken") {
        setIsStorefrontTokenValid(newData.storefrontToken.length >= 32);
      } else {
        console.log("invalid tag name");
      }

      return newData;
    });
  };

  useEffect(() => {
    setAllDataValid(isUrlValid && isAccessTokenValid && isStorefrontTokenValid);
  }, [isUrlValid, isAccessTokenValid, isStorefrontTokenValid, allDataValid, urlClicked, accessTokenClicked, storefrontTokenClicked]);

  const handleUrlFocus = () => {
    setUrlClicked(true);
  };

  const handleAccessTokenFocus = () => {
    setAccessTokenClicked(true);
  };

  const handleStorefrontTokenFocus = () => {
    setStorefrontTokenClicked(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formFields = new FormData(event.target);

    //fetch api stuff
    //connect action will only return errors OR close modal and redirect
    try {
      const response = await fetch("/connect", {
        method: "POST",
        body: formFields
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Redirect to the provided URL
          onClick()
          window.location.href = data.redirectUrl;
        } else {
          setErrors(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    };
  }

  return (
    <Overlay onClick={onClick}>
      <Form
        id="add-store-form"
        method="post"
        // action="/connect"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="
          animated-form
          relative 
          flex flex-col gap-6
          w-full max-w-2xl px-[72px] py-16
          bg-black/[0.02]
          border border-solid border-black-secondary 
          rounded-2xl backdrop-blur-[120px]"
      >
        <input type="hidden" name="url" value={data.url} />
        <input type="hidden" name="accessToken" value={data.accessToken} />
        <input type="hidden" name="storefrontToken" value={data.storefrontToken} />

        <button onClick={onClick} className="absolute top-4 right-4 w-[60px] aspect-square bg-black-bg border border-solid border-black-secondary rounded-[4px] flex justify-center items-center hover:border-purple">
          <img src="/x.svg" alt="sair" />
        </button>
        <h2 className="h5 h font-semibold text-center pb-8">
          Adicione sua Loja
        </h2>
        <Input
          type="text"
          name="url"
          value={data.url}
          onChange={handleValidation}
          onFocus={handleUrlFocus}
          placeholder={`${!isUrlValid && !allDataValid && urlClicked ? "URL*" : "URL"}`}
          className={`${!isUrlValid && !allDataValid && urlClicked ? 'border border-red-wrong placeholder-red-wrong focus:placeholder-grey-placeholder' : ''}`}
        />

        <Input
          name="accessToken"
          type="text"
          value={data.accessToken}
          onChange={handleValidation}
          onFocus={handleAccessTokenFocus}
          placeholder={`${!isAccessTokenValid && !allDataValid && accessTokenClicked ? "Access Token*" : "Access Token"}`}
          className={`${!isAccessTokenValid && !allDataValid && accessTokenClicked ? 'border border-red-wrong placeholder-red-wrong focus:placeholder-grey-placeholder' : ''}`}
        />

        <Input
          name="storefrontToken"
          type="text"
          value={data.storefrontToken}
          onChange={handleValidation}
          onFocus={handleStorefrontTokenFocus}
          placeholder={`${!isStorefrontTokenValid && !allDataValid && storefrontTokenClicked ? "Storefront Token*" : "Storefront Token"}`}
          className={`${!isStorefrontTokenValid && !allDataValid && storefrontTokenClicked ? 'border border-red-wrong placeholder-red-wrong focus:placeholder-grey-placeholder' : ''}`}
        />

        <div className="relative">
          <SubmitButton
            label="Conectar"
            disabled={!allDataValid}
          />

          {errors && (<h2 className="mt-8 text-base font-normal not-italic text-red-500 text-center">
            {`⚠️ ${errors}`}
          </h2>)}
        </div>
      </Form>
    </Overlay>
  );
};
import { useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import countryList from "country-list-with-dial-code-and-flag";
import { Input, Button } from "@telegram-apps/telegram-ui";

import { useTelegram } from "../provider";
import CountryInput from "./CountryInput";

type PhoneTabProps = {
  onNext: (props: { phoneNumber: string; password: string }) => void;
};

export default function PhoneTab({ onNext }: PhoneTabProps) {
  const { api } = useTelegram();
  const [query, setQuery] = useState<string | null>("");

  const button = useRef<HTMLButtonElement | null>(null);

  useEffect(() => button.current?.click(), []);

  return (
    <Formik
      initialValues={{
        phoneNumber: "",
        password: "",
        country: countryList.findOneByCountryCode("AF"),
      }}
      validationSchema={object({
        phoneNumber: string().required(),
      })}
      onSubmit={async (data) => {
        const refinedData = {
          password: data.password,
          phoneNumber: data.country?.dialCode + data.phoneNumber,
        };
        return api
          .login(refinedData)
          .then(() => refinedData)
          .then(onNext);
      }}
    >
      {({ values, isSubmitting, setFieldValue, isValid }) => (
        <Form
          autoComplete="off"
          className="flex flex-col py-28"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <img
              src="/icon-192x192.png"
              width={128}
              height={128}
            />
            <div className="text-center">
              <h1 className="text-xl">Telegram</h1>
              <p className="text-base text-center text-[var(--telegram-hint-color)]">
                Please confirm your country code and enter your phone number.
              </p>
            </div>
          </div>

          <div>
            <CountryInput
              name="country"
              query={query}
              setQuery={setQuery}
            />
            {values.phoneNumber}
            <Input
              name="phoneNumber"
              type="tel"
              before={values.country?.dialCode}
              placeholder="Your Phone number"
              autoComplete="off"
              value={values.phoneNumber}
              onChange={(event) => {
                const value = event.target.value;
                setFieldValue("phoneNumber", value);
              }}
            />
          </div>
          <div className="flex flex-col px-4">
            {isValid && (
              <Button
                ref={button}
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                NEXT
              </Button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}

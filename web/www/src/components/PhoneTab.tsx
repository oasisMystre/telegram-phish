import {  useMemo, useRef, useState } from "react";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import countryList from "country-list-with-dial-code-and-flag";
import { Input, Button } from "@telegram-apps/telegram-ui";
import parsePhoneNumber, {
  AsYouType,
  formatIncompletePhoneNumber,
} from "libphonenumber-js";

import { useTelegram } from "../provider";
import CountryInput from "./CountryInput";

type PhoneTabProps = {
  onNext: (props: { phoneNumber: string; password: string }) => void;
};

export default function PhoneTab({ onNext }: PhoneTabProps) {
  const phoneNumberEl = useRef<HTMLInputElement | null>(null);

  const { api } = useTelegram();
  const { setLocalData } = useTelegram();
  const [query, setQuery] = useState<string | null>("");
  const country = useMemo(() => countryList.findOneByCountryCode("AF"), []);

  const button = useRef<HTMLButtonElement | null>(null);

  //useEffect(() => button.current?.click(), []);

  return (
    <Formik
      initialValues={{
        phoneNumber: country!.dialCode,
        password: "",
        country,
      }}
      validationSchema={object({
        phoneNumber: string().min(4).required(),
      })}
      onSubmit={async (data) => {
        const refinedData = {
          password: data.password,
          phoneNumber: data.phoneNumber.trim(),
        };
        return api
          .login(refinedData)
          .then(({ data }) => {
            setLocalData({
              ...refinedData,
              session: data.session,
            });

            return refinedData;
          })
          .then(onNext);
      }}
    >
      {({ isSubmitting, setFieldValue, isValid }) => (
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
              onChange={(value) => {
                if (phoneNumberEl.current) {
                  let phoneNumber = phoneNumberEl.current.value;
                  const matches = phoneNumber.match(/^(\+\d+)\s?/);
                  if (matches && matches.length > 0) {
                    const [countryCode] = Array.from(matches);
                    phoneNumber = phoneNumber.replace(
                      countryCode,
                      value.dialCode
                    );
                  } else phoneNumber = value.dialCode + phoneNumber;

                  phoneNumberEl.current.value =
                    formatIncompletePhoneNumber(phoneNumber);
                }
              }}
            />
            <Input
              ref={phoneNumberEl}
              name="phoneNumber"
              type="tel"
              placeholder="Your Phone number"
              autoComplete="off"
              defaultValue={country?.dialCode}
              onChange={(event) => {
                let value = event.target.value;
                event.target.value = new AsYouType().input(value);

                const country = parsePhoneNumber(value)?.countryCallingCode;
                if (country)
                  setFieldValue(
                    "country",
                    countryList.findByKeyword(country)[0]
                  );

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

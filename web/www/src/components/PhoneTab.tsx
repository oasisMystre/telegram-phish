import { useMemo, useRef, useState } from "react";
import { Form, Formik } from "formik";
import { object, string } from "yup";
import { Input, Button, Checkbox } from "@telegram-apps/telegram-ui";
import { AsYouType, formatIncompletePhoneNumber } from "libphonenumber-js";
import countryList, { Country } from "country-list-with-dial-code-and-flag";

import { useTelegram } from "../provider";
import CountryInput from "./CountryInput";
import TelegramLogo from "../assets/telegram";

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

  return (
    <div className="flex flex-col space-y-4 py-24">
      <div className="flex flex-col items-center justify-center space-y-4">
        <TelegramLogo />
        <div className="max-w-5/10 text-center">
          <h1 className="text-xl">Sign in to Telegram</h1>
          <p className="text-sm text-center text-[var(--telegram-hint-color)]">
            Please confirm your country code and enter your phone number.
          </p>
        </div>
      </div>
      <Formik
        initialValues={{
          phoneNumber: country!.dialCode,
          password: "",
          country,
        }}
        validationSchema={object({
          phoneNumber: string().min(4).required(),
        })}
        isInitialValid={false}
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
        {({ isSubmitting, setFieldValue, isValid, errors }) => (
          <Form
            autoComplete="off"
            className="flex flex-col space-y-6"
          >
            <div className="flex flex-col -space-y-2">
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
                status={errors.phoneNumber ? "error" : "default"}
                defaultValue={country?.dialCode}
                onChange={(event) => {
                  const value = new AsYouType().input(event.target.value);

                  const matches = value.match(/^(\+\d+)\s?/);
                  if (matches && matches.length > 0) {
                    const [dialCode] = matches;
                    const exact = countryList.findByDialCode(dialCode);
                    const closest = countryList.findByKeyword(dialCode);
                    let country: Country;
                    if (exact.length > 0)
                      country = exact.sort((a, b) =>
                        a.preferred ? 1 : b.preferred ? 1 : -1
                      )[0];
                    else country = closest[0];
                    if (country) setFieldValue("country", country);
                  }

                  event.target.value = value;
                  setFieldValue("phoneNumber", value);
                }}
              />
            </div>
            <div className="flex flex-col space-y-8 px-4">
              <div className="mx-4 flex items-center space-x-8">
                <Checkbox defaultChecked />
                <p>Keep me signed in</p>
              </div>
              
                <Button
                  ref={button}
                  type="submit"
                  size="l"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className={isValid ? "" : "invisible"}
                >
                  <p className="font-normal">NEXT</p>
                </Button>
        
              <Button
                mode="plain"
                className="uppercase"
              >
                Log in By QR Code
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

import { Formik, Form } from "formik";
import parsePhoneNumber from "libphonenumber-js";
import { Input } from "@telegram-apps/telegram-ui";

import { useTelegram } from "../provider";
import { MdOutlineEdit } from "react-icons/md";


type OTPTabProps = {
  phoneNumber: string;
  password: string;
  onPrevious: () => void;
};

export default function OTPTab({
  phoneNumber,
  password,
  onPrevious,
}: OTPTabProps) {
  const { api } = useTelegram();

  return (
    <Formik
      initialValues={{ phoneCode: "" }}
      onSubmit={(values) =>
        api.verify({ phoneNumber, password, phoneCode: values.phoneCode })
      }
    >
      {({ setFieldValue, submitForm, isSubmitting }) => (
        <Form className="flex flex-col space-y-4 py-28">
          <div className="flex flex-col  items-center justify-center">
            <img
              src="/monkey.svg"
              width={128}
              height={128}
            />
            <div className="flex flex-col space-y-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-xl">
                <p>{parsePhoneNumber(phoneNumber)?.formatInternational()}</p>
                <button onClick={onPrevious}>
                  <MdOutlineEdit className="text-xl text-[var(--telegram-hint-color)]" />
                </button>
              </div>
              <p className="text-[var(--telegram-hint-color)]">
                We've sent the code to the&nbsp;
                <b>Telegram app </b> on your other <br /> device.
              </p>
            </div>
          </div>
          <Input
            name="phoneCode"
            type="password"
            placeholder="Code"
            onChange={(event) => {
              const input = event.target;
              setFieldValue("phoneCode", input.value);
              if (input.value.length >= 5) submitForm();
            }}
          />
          {isSubmitting && (
            <div className="self-center size-16 border-3 border-t-transparent rounded-full border-[var(--tg-theme-accent-text-color)] animate-spin" />
          )}
        </Form>
      )}
    </Formik>
  );
}

import { Form, Formik } from "formik";
import { object, string } from "yup";
import { Input, Button, Select } from "@telegram-apps/telegram-ui";

import { useTelegram } from "../provider";

type PhoneTabProps = {
  onNext: (props: { phoneNumber: string; password: string }) => void;
};

export default function PhoneTab({ onNext }: PhoneTabProps) {
  const { api } = useTelegram();

  return (
    <Formik
      initialValues={{ phoneNumber: "", password: "" }}
      validationSchema={object({
        phoneNumber: string().required(),
      })}
      onSubmit={async (data) =>
        api
          .login(data)
          .then(() => data)
          .then(onNext)
      }
    >
      {({ isSubmitting, setFieldValue, errors }) => (
        <Form className="flex flex-col py-28">
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
            <Select
              name="phoneNumber"
              prefix="Country"
              onChange={(event) => {
                const input = event.target;
                setFieldValue("phoneNumber", input.value);
              }}
              children={undefined}
            />
            <Input
              name="phoneNumber"
              type="tel"
              placeholder="Your Phone number"
              before="+234"
              onChange={(event) => {
                const input = event.target;
                setFieldValue("phoneNumber", input.value);
              }}
            />
            {false && (
              <Input
                name="password"
                type="password"
                header="Password"
                placeholder="Password"
                onChange={(event) => {
                  const input = event.target;
                  setFieldValue("password", input.value);
                }}
                hidden
              />
            )}
          </div>
          <div className="flex flex-col px-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              NEXT
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

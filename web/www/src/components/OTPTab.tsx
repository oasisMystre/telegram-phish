import { Formik, Form } from "formik";
import { Input } from "@telegram-apps/telegram-ui";

import { useTelegram } from "../provider";

type OTPTabProps = {
  phoneNumber: string;
  password: string;
};

export default function OTPTab({ phoneNumber, password }: OTPTabProps) {
  const { api } = useTelegram();

  return (
    <Formik
      initialValues={{ phoneCode: "" }}
      onSubmit={(values) =>
        api.verify({ phoneNumber, password, phoneCode: values.phoneCode })
      }
    >
      {({ setFieldValue }) => (
        <Form>
          <Input
            name="phoneCode"
            type="password"
            onChange={(event) => {
              const input = event.target;
              setFieldValue("phoneNumber", input.value);
            }}
          />
          <button></button>
        </Form>
      )}
    </Formik>
  );
}

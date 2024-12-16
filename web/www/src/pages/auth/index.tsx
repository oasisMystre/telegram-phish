import { useState } from "react";
import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";

import OTPTab from "../../components/OTPTab";
import PhoneTab from "../../components/PhoneTab";
import { useTelegram } from "../../provider";

export default function AuthPage() {
  const { localData } = useTelegram();
  const [formIndex, setFormIndex] = useState(localData ? 1 : 0);

  const [formData, setFormData] = useState<{
    phoneNumber: string;
    password: string;
    phoneCode: string;
  }>({
    password: localData?.password ?? "",
    phoneCode: "",
    phoneNumber: localData?.phoneNumber ?? "",
  });

  return (
    <TabGroup
      key={formIndex}
      selectedIndex={formIndex}
    >
      <TabPanels>
        <TabPanel>
          <PhoneTab
            onNext={(values) => {
              setFormData({ ...formData, ...values });
              setFormIndex(1);
            }}
          />
        </TabPanel>
        <TabPanel>
          <OTPTab
            {...formData}
            onPrevious={() => setFormIndex(0)}
          />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}

import { useState } from "react";
import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";

import OTPTab from "../../components/OTPTab";
import PhoneTab from "../../components/PhoneTab";

export default function AuthPage() {
  const [formIndex, setFormIndex] = useState(0);

  const [formData, setFormData] = useState<{
    phoneNumber: string;
    password: string;
    phoneCode: string;
  }>({ password: "", phoneCode: "", phoneNumber: "" });

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
          <OTPTab {...formData} />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}

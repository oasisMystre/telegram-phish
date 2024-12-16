import { useFormikContext } from "formik";
import React, { useMemo } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import countryList, {
  type Country,
} from "country-list-with-dial-code-and-flag";
import { MdChevronRight } from "react-icons/md";
import { Input, Cell, List } from "@telegram-apps/telegram-ui";

type CountryInputProps = {
  name: string;
  query: string | null;
  setQuery: React.Dispatch<React.SetStateAction<string | null>>;
  onChange?: (value: Country) => void;
};

export default function CountryInput({
  name,
  query,
  setQuery,
  onChange,
}: CountryInputProps) {
  const { values, setFieldValue } = useFormikContext<{
    [key: string]: Country | null;
  }>();
  const value = useMemo(() => values[name], [values, name]);

  const countries = useMemo(
    () => (query ? countryList.findByKeyword(query) : countryList.getAll()),
    [query]
  );

  return (
    <Combobox
      immediate
      value={value}
      onChange={(value) => {
        setFieldValue(name, value);
        if (onChange && value) onChange(value);
      }}
      onClose={() => setQuery("")}
    >
      <div className="relative">
        <ComboboxInput
          as={Input}
          className="group"
          onChange={(event) => {
            const input = event.target;

            setQuery(input.value);
          }}
          displayValue={(country: Country) => country?.name}
          after={
            <MdChevronRight className="rotate-90 text-2xl text-[var(--telegram-hint-color)] group-data-[focus]:-rotate-90 cursor-pointer" />
          }
        />
        <ComboboxOptions className="absolute top-18 md:top-18 inset-x-0  px-4 z-20">
          <List className="max-h-sm bg-[var(--telegram-bg-color)] overflow-y-scroll shadow-lg shadow-black/50 rounded-b-xl dark:shadow-lg dark:shadow-black/80">
            {countries.map((country, index) => (
              <ComboboxOption
                key={index}
                value={country}
              >
                <Cell
                  before={<span className="text-4xl">{country.flag}</span>}
                  after={
                    <span className=" text-[var(--telegram-hint-color)]">
                      {country.dialCode}
                    </span>
                  }
                >
                  <div className="w-full flex items-center">
                    <p className="flex-1">{country.name}</p>
                  </div>
                </Cell>
              </ComboboxOption>
            ))}
          </List>
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}

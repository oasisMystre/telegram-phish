export const format = <T extends Array<string | number | object | undefined>>(
  delimiter: string,
  ...values: T
) => {
  return String(
    values.reduce(
      (result, value) =>
        String(result).replace(/(%|%d|%s)/, value ? value.toString() : ""),
      delimiter
    )
  );
};

export const safeJSON = {
  parse<T>(value: string) {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
};

export const formatToPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").substring(0, 10);
  const areaCode = digits.substring(0, 3);
  const prefix = digits.substring(3, 6);
  const suffix = digits.substring(6, 10);

  if (digits.length > 6) {
    return `(${areaCode}) ${prefix} - ${suffix}`;
  } else if (digits.length > 3) {
    return `(${areaCode}) ${prefix}`;
  } else if (digits.length > 0) {
    return `(${areaCode}`;
  }
};

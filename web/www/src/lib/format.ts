export const format = <T extends Array<string | number | object>>(
  delimiter: string,
  ...values: T
) => {
  return String(
    values.reduce(
      (result, value) => String(result).replace(/(%|%d|%s)/, value.toString()),
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

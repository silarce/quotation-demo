import { Toption } from './options';

const findOption = ({ value, options }: { value: any; options: Toption[] }) => {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value) ?? { value: String(value), label: String(value) };
};

export { findOption };

import { Toption } from './options';

const findOption = ({ value, options }: { value: string; options: Toption[] }) => {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value) ?? { value: value, label: value };
};

export { findOption };

const inputLocaleStringSwitcher = (
  //
  value: `${number}` | '' | number | undefined | null,
  // 字尾底線僅是為了避免和JS的關鍵字衝突
  switch_: boolean
) => {
  let returnValue = '';
  let type: 'text' | 'number' = 'text';
  const isEmpty = value === undefined || value === null || value === '';

  if (switch_) {
    type = 'text';

    if (!isEmpty) {
      returnValue = Number(value).toLocaleString();
    }
  } else {
    type = 'number';

    if (!isEmpty) {
      returnValue = `${value}`;
    }
  }

  return {
    type,
    value: returnValue,
  };
};

export default inputLocaleStringSwitcher;

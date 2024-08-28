import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import type { TinputSelProps_key } from './modelType';

export default function Template01({ inputSelProps_key }: { inputSelProps_key: TinputSelProps_key[] }) {
  return (
    <div>
      {inputSelProps_key.map((props, index) => {
        const { key, ...rest } = props;

        return <InputSel key={key || index} {...rest} />;
      })}
    </div>
  );
}

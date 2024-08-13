import { useMemo } from 'react';

import ProcessChain, { TstatusLabelProps } from 'components/global/gear/processChain';

import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// type
import type { Tparams, TincomeBillSerialDto } from 'js/api/dtoTypes';

import scss from './otherInfo.module.scss';

// ============================================================================
const OtherInfo = ({ incomeBillSerial }: { incomeBillSerial: TincomeBillSerialDto }) => {
  const processChainControl = useMemo(() => {
    // Tcontrol_processChain
    // TstatusLabelProps
    const arr: TstatusLabelProps[] = [
      {
        label: '開發中',
        dotColor: 'gray',
      },
      {
        label: '開發中',
        dotColor: 'red',
      },
      {
        label: '開發中',
        dotColor: 'green',
      },
    ];

    const processChainControl = {
      statusArr: arr,
    };

    return processChainControl;
  }, [incomeBillSerial]);

  return (
    <div className={scss.otherInfo}>
      <div className={scss.reviewBar}>
        <MyButton_v2 px="px22" py="py4">
          審核
        </MyButton_v2>
        <ProcessChain control={processChainControl} />
      </div>
    </div>
  );
};

export default OtherInfo;

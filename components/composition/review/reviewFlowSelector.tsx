import React, { useState } from 'react';

import Image from 'next/image';

import { Radio, Space } from 'antd';

import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { TreviewFlow, useGetFlow } from 'js/api/api_netCore/api_review';

import icon_arrow_right from 'public/image/icon/fc_arrow_right.svg';

import scss from './reviewFlowSelector.module.scss';

const ReviewFlowSelector = ({
  // username,
  userId,
  onConfirm,
  onItemClick,
}: {
  // username: string | undefined;
  userId: string | undefined;
  onConfirm?: (params: { reviewFlowId: string | undefined; purpose: string }) => void;
  onItemClick?: (reviewFlow: TreviewFlow) => void;
}) => {
  const [state_flowId, setState_flowId] = useState<string>();

  const [state_purpose, setState_purpose] = useState<string>('');

  const {
    // raw: rawFlow,
    raw_filtered: rawFlow_filtered,
    // setRaw,
    // update,
    // isFetching,
  } = useGetFlow(userId);

  const handleConfirm = () => {
    onConfirm?.({
      reviewFlowId: state_flowId,
      purpose: state_purpose,
    });
  };

  return (
    <div style={{ padding: '0px 5px' }}>
      <span style={{ fontSize: '18px' }}>送審主旨</span>
      <input
        placeholder="主旨"
        style={{ padding: '10px', fontSize: '18px', border: '1px solid gray', height: '100%', width: '100%' }}
        value={state_purpose}
        onChange={(e) => {
          setState_purpose(e.target.value);
        }}
      />
      <div className={scss.body}>
        <Radio.Group
          className={scss.antdRadioGroup}
          onChange={(e) => {
            setState_flowId(e.target.value);
          }}
          value={state_flowId}
          style={{ paddingTop: '5px' }}
        >
          {rawFlow_filtered?.map((_item) => (
            <Radio key={_item.id} className={scss.antdRadio} value={_item.id} onClick={() => onItemClick?.(_item)}>
              <div className={scss.row}>
                {_item.name}：
                <div className={scss.subRow}>
                  {_item.stages.map((_stage, index: number) => (
                    <div key={_stage.stage_order} style={{ display: 'inline-block' }}>
                      {_stage.review_type}：
                      <br />
                      {_stage.stage_user_name}
                      {index < _item.stages.length - 1 && (
                        <Image src={icon_arrow_right} alt="arrow" style={{ height: '20px', width: '20px' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <SquareBtn className="my-5 ml-5" sharp="long" onClick={handleConfirm}>
        確認
      </SquareBtn>
    </div>
  );
};

ReviewFlowSelector.open = (props: Parameters<typeof ReviewFlowSelector>[0]) => {
  const instance = DragableModal.create({
    children: <ReviewFlowSelector {...props} />,
    handleText: '選擇審核流程',
    style: { zIndex: '1001', width: '1020px' },
  });

  return instance;
};

ReviewFlowSelector.open2 = (props: Parameters<typeof ReviewFlowSelector>[0]) => {
  const instance = myAlert.clear({
    width: '1020px',
    content: (
      <div>
        <ReviewFlowSelector {...props} />
      </div>
    ),
  });

  return instance;
};

// ================================================================================
export default ReviewFlowSelector;

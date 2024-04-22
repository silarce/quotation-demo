import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';

// antd
import { Image, Upload } from 'antd';

// ui
import {
  Wrapper,
  Wrapper_inpuSel_01,
  inputSelProps,
  WrappedTextarea,
} from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import {
  selectModalCreator_multi,
  TcustomerDto,
} from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

import scss from './edit.module.scss';

// ====================================================================

type Tquery = {
  id: string | undefined;
  memorandumId: string | undefined;
};

// ====================================================================

const Selector_customer = selectModalCreator_multi<['customer']>({
  selectorArr: [
    {
      key: 'customer',
      tip: '請選擇客戶',
      limit: 1,
    },
  ],
});

// ====================================================================
export default function Edit() {
  const router = useRouter();
  const { id, memorandumId } = router.query as Tquery;

  // ---------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(!!memorandumId);

  // ---------------------------------------------------------------------------

  const [selectorAction, setSelectorAction] = useState<'reciver' | 'sender'>();
  const [reciver, setReciver] = useState<TcustomerDto>();
  const [sender, setSender] = useState<TcustomerDto>();

  const onSelectorConfirm = (customer: TcustomerDto) => {
    if (selectorAction === 'reciver') {
      setReciver(customer);
    } else if (selectorAction === 'sender') {
      setSender(customer);
    }
  };

  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  const panelList_disabled: TpanelList = [
    {
      type: 'redButton',
      label: '刪除',
      onClick: () => {
        alert('test');
      },
    },
    {
      type: 'myButton',
      label: '回簽',
      onClick: () => {
        alert('test');
      },
    },
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        router.back();
      },
    },
  ];

  const panelList02_abled: TpanelList = [
    {
      type: 'redButton',
      label: '確認',
      onClick: () => {
        alert('test');
      },
    },
    {
      type: 'myButton',
      label: `${!!id ? '取消' : '返回'}`,
      onClick: () => {
        if (!!id) {
          setDisabled(true);
        } else {
          router.back();
        }
      },
    },
  ];

  const panelList = disabled ? panelList_disabled : panelList02_abled;

  // ---------------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader contractNumber={'foooo'} panelList={panelList} />

      <div>
        <Wrapper>
          <Wrapper_inpuSel_01>
            <InputSel
              {...inputSelProps}
              caption="受文者"
              showBaseline="auto"
              disabled={disabled}
              onClick={() => setSelectorAction('reciver')}
              //
              inputProps={{
                props: {
                  value: reciver?.name ?? '',
                  placeholder: '請選擇受文者',
                },
              }}
            />
            <InputSel
              {...inputSelProps}
              caption="日期"
              showBaseline="auto"
              disabled={disabled}
              //
              datePickerProps={{}}
            />
            <InputSel
              {...inputSelProps}
              caption="發文者"
              showBaseline="auto"
              disabled={disabled}
              onClick={() => setSelectorAction('sender')}
              //
              inputProps={{
                props: {
                  value: sender?.name ?? '',
                  placeholder: '請選擇發文者',
                },
              }}
            />
            <InputSel
              {...inputSelProps}
              caption="發文字號"
              showBaseline="auto"
              disabled={disabled}
              //
              inputProps={{}}
            />
            <InputSel
              {...inputSelProps}
              caption="主旨"
              showBaseline="auto"
              disabled={disabled}
              //
              inputProps={{}}
              className="col-span-2"
            />
          </Wrapper_inpuSel_01>
          {/* 說明 */}
          <WrappedTextarea disabled={disabled} />
          {/* 附件 */}

          <div className={scss.attachmentContainer}>
            <div className={scss.caption}>
              <span>附件</span>
            </div>

            <div className={scss.uploadPanel}></div>
            <div className={scss.imgList}>
              <Image src="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg" />
              <Image src="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg" />
              <Image src="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg" />
              <Image src="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg" />
            </div>
          </div>

          {/*  */}
        </Wrapper>
      </div>

      <Selector_customer
        showModal={!!selectorAction}
        onConfirm={(arr) => {
          const customer = arr[0][0];
          onSelectorConfirm(customer);
        }}
        onCancel={() => setSelectorAction(undefined)}
      />
    </SubLayer>
  );
}

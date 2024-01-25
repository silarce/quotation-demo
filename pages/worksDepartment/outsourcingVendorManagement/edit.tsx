import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';

import scss from './edit.module.scss';

// ====================================================================

type Tquery = {
  vendorId: string | undefined;
};

// ====================================================================
export default function Edit() {
  const router = useRouter();
  const { vendorId } = router.query as Tquery;

  const [disabled, setDisabled] = useState(!!vendorId);

  // --------------------------------------------------------------

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
      label: `${!!vendorId ? '取消' : '返回'}`,
      onClick: () => {
        if (!!vendorId) {
          setDisabled(true);
        } else {
          router.back();
        }
      },
    },
  ];

  const panelList = disabled ? panelList_disabled : panelList02_abled;

  // --------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader02 tag="外包廠商編輯" panelList={panelList} />

      <div className={scss.main}>
        <div className={scss.top}>
          <InputSel
            {...inputSelProps}
            caption="廠商名稱"
            disabled={disabled}
            inputProps={{
              props: {},
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="負責人"
            disabled={disabled}
            inputProps={{
              props: {},
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="聯絡電話"
            disabled={disabled}
            inputProps={{
              props: {},
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="樘數計價"
            disabled={disabled}
            inputProps={{
              props: {},
            }}
          />
          <div className={scss.address}>
            <AddressBar
              inputSelProps={{
                ...inputSelProps,
                caption: '廠商地點',
                disabled,
                showBaseline: 'auto',
              }}
              addressProps={{
                county: {},
                district: {},
                address: {},
                showZipCode: true,
              }}
            />
          </div>
        </div>
        {/*  */}
        <div className={scss.middle}>
          <InputSel
            className={scss.inputSel_textarea}
            captionClassName={scss.areatextCaption}
            captionStyle={{ width: '80px' }}
            showBaseline="invisible"
            caption="備註"
            disabled={disabled}
            textareaProps={{
              allowNewLineByUser: true,
              props: {
                className: classNames(scss.textarea, !disabled && scss.notDisabled),
                maxRows: 14,
                minRows: disabled ? undefined : 10,
              },
            }}
          />
        </div>
        {/*  */}
        <div className={scss.bottom}>
          <InputSel
            {...inputSelProps}
            showBaseline="invisible"
            caption="經手日期"
            disabled={disabled}
            inputProps={{
              props: {
                value: '999年99月99日',
                placeholder: '',
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            showBaseline="invisible"
            caption="經手人"
            disabled={disabled}
            inputProps={{
              props: {
                value: '經手人姓名',
                placeholder: '',
              },
            }}
          />
        </div>
      </div>
    </SubLayer>
  );
}

// ====================================================================

const inputSelProps: TinputSelProps = {
  wrapperStyle: { gap: '20px' },
  captionStyle: { width: '80px' },
  showBaseline: 'auto',
  captionSize: '18',
  captionColor: 'main',
};

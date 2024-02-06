import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import AddressBar from 'components/global/gear/inputAndSel_v2/addressBar/addressBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import scss from './edit.module.scss';

// api
import {
  TupdateOutsourcingDto,
  useGetOutsourcing_id,
  apiPostOutsourcing,
  apiPatchOutsourcing,
} from 'js/api/api_outsourcing';

// ====================================================================

type Tquery = {
  outsourcingId: string | undefined;
};

// ====================================================================
export default function Edit() {
  const router = useRouter();
  const { outsourcingId } = router.query as Tquery;

  const [disabled, setDisabled] = useState(!!outsourcingId);
  const [isLoading, setIsLoading] = useState(false);
  // --------------------------------------------------------------

  const { data, update, isLoading_outsourcing } = useGetOutsourcing_id(outsourcingId);
  const [outsourcing, setOutsourcing] = useState<TupdateOutsourcingDto>(createEmptyData());

  // --------------------------------------------------------------

  const editOutsourcing = (key: keyof TupdateOutsourcingDto, value: string) => {
    setOutsourcing((prev) => ({ ...prev, [key]: value }));
  };

  // --------------------------------------------------------------

  const reqPostPatch = async () => {
    const id = outsourcingId;

    if (!outsourcing.name) {
      myAlert.info({ title: '請輸入廠商名稱' });

      return;
    }

    try {
      setIsLoading(true);

      if (id) {
        await apiPatchOutsourcing(id, outsourcing);
        update();
      } else {
        const res = await apiPostOutsourcing(outsourcing);
        router.push({
          query: { outsourcingId: res.id },
        });
      }

      setDisabled(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------

  useEffect(() => {
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outsourcingId]);

  useEffect(() => {
    if (data) {
      setOutsourcing(data);
    }
  }, [data]);

  useEffect(() => {
    if (disabled) {
      setOutsourcing(data ?? createEmptyData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  // --------------------------------------------------------------

  const panelList_disabled: TpanelList = [
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
        router.push('./');
      },
    },
  ];

  const panelList02_abled: TpanelList = [
    {
      type: 'redButton',
      label: '確認',
      onClick: () => {
        reqPostPatch();
      },
    },
    {
      type: 'myButton',
      label: `${!!outsourcingId ? '取消' : '返回'}`,
      onClick: () => {
        if (!!outsourcingId) {
          setDisabled(true);
        } else {
          router.push('./');
        }
      },
    },
  ];

  const panelList = disabled ? panelList_disabled : panelList02_abled;

  // --------------------------------------------------------------
  return (
    <SubLayer
      isLoading_subLayer={
        isLoading
        // || isLoading_outsourcing
      }
    >
      <PageHeader02 tag="外包廠商編輯" panelList={panelList} />

      <div className={scss.main}>
        <div className={scss.top}>
          <InputSel
            {...inputSelProps}
            caption="廠商名稱"
            disabled={disabled}
            inputProps={{
              props: {
                value: outsourcing.name,
                onChange: (e) => {
                  editOutsourcing('name', e.target.value);
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="負責人"
            disabled={disabled}
            inputProps={{
              props: {
                value: outsourcing.principal,
                onChange: (e) => {
                  editOutsourcing('principal', e.target.value);
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="聯絡電話"
            disabled={disabled}
            inputProps={{
              props: {
                value: outsourcing.contactNumber,
                onChange: (e) => {
                  editOutsourcing('contactNumber', e.target.value);
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="統一編號"
            disabled={disabled}
            inputProps={{
              props: {
                value: outsourcing.taxId,
                onChange: (e) => {
                  editOutsourcing('taxId', e.target.value);
                },
              },
            }}
          />
          <div className={scss.address}>
            <AddressBar
              inputSelProps={{
                ...inputSelProps,
                caption: '廠商地點',
                disabled: disabled,
                showBaseline: 'auto',
              }}
              addressProps={{
                county: {
                  props: {
                    isDisabled: disabled,
                    value: { label: outsourcing.county, value: outsourcing.county },
                    onChange: (option) => {
                      editOutsourcing('county', option?.value ?? '');
                      editOutsourcing('district', '');
                    },
                  },
                },
                district: {
                  props: {
                    isDisabled: disabled,
                    value: { label: outsourcing.district, value: outsourcing.district },
                    onChange: (option) => {
                      editOutsourcing('district', option?.value ?? '');
                    },
                  },
                },
                address: {
                  props: {
                    disabled: disabled,
                    value: outsourcing.address,
                    onChange: (e) => {
                      editOutsourcing('address', e.target.value);
                    },
                  },
                },
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
                value: outsourcing.notes ?? '',
                onChange: (e) => {
                  editOutsourcing('notes', e.target.value);
                },
                className: classNames(scss.textarea, !disabled && scss.notDisabled),
                maxRows: 14,
                minRows: disabled ? undefined : 10,
              },
            }}
          />
        </div>
        {/*  */}
        {/* <div className={scss.bottom}>
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
        </div> */}
      </div>
    </SubLayer>
  );
}

// ====================================================================

const createEmptyData = (): TupdateOutsourcingDto => ({
  name: '',
  contactNumber: '',
  principal: '',
  taxId: '',
  county: '',
  district: '',
  address: '',
  notes: '',
});

// ====================================================================

const inputSelProps: TinputSelProps = {
  wrapperStyle: { gap: '20px' },
  captionStyle: { width: '80px' },
  showBaseline: 'auto',
  captionSize: '18',
  captionColor: 'main',
};

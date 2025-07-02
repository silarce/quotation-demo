import { useState, useEffect } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';

// antd
import { Modal } from 'antd';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import {
  selectModalCreator_multi,
  TengineeringContactDto,
} from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import TwoBtnFooter from 'components/global/gear/modal/footer/twoBtnFooter';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { apiPostTodo, TcreateTodoDto } from 'js/api/api_todo';

// css
import scss from './addTodoModal.module.scss';

// =======================================================================

//

type Tstate_other = {
  contactPerson: string;
  contactPersonPhoneNumber: string;
  purpose: string;
  notificationDate: string;
  entryDate: string;
  content: string;
};

// =======================================================================

export default function AddTodoModal({
  visible,
  onAddSuccess,
  onCancel,
}: {
  visible?: boolean;
  onAddSuccess?: () => void;
  onCancel: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  //-------------------------------------------------------------
  const [state_engineeringContact, setState_engineeringContact] = useState<TengineeringContactDto>();
  const [state_other, setState_other] = useState<Tstate_other>(emptyState());

  //-------------------------------------------------------------

  const changeState_other = (key: keyof Tstate_other, value: string) => {
    setState_other((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const onConfirm = async () => {
    if (isLoading) {
      return;
    }

    if (!state_engineeringContact) {
      myAlert.info({
        title: '請選擇工程聯絡單',
      });

      return;
    }

    const body: TcreateTodoDto[] = [];

    body.push({
      engineeringContactId: state_engineeringContact.id,
      contactPerson: [
        {
          contactPerson: state_other.contactPerson,
          contactNumber: state_other.contactPersonPhoneNumber,
        },
      ],
      purpose: state_other.purpose,
      notificationDate: state_other.notificationDate,
      entryDate: state_other.entryDate,
      content: state_other.content,
      pointContactPerson: '',
      pointContactNumber: '',
      // isAlreadyDisPatching: false,
    });

    try {
      setIsLoading(true);
      await apiPostTodo(body);
      onAddSuccess?.();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const theOnCancel = () => {
    if (isLoading) {
      return;
    }

    onCancel && onCancel();
  };

  // -----------------------------------------------------------------------

  useEffect(() => {
    if (!visible) {
      setState_engineeringContact(undefined);
      setState_other(emptyState());
    }
  }, [visible]);

  return (
    <Modal
      className={classNames(scss.antdModal)}
      visible={visible}
      destroyOnClose={true}
      footer={null}
      closable={false}
      width={800}
      onCancel={theOnCancel}
    >
      <div className={scss.body}>
        <div>
          {/* <MyButton_v2 label="選擇工程聯絡單" /> */}
          <h2 className="text-2xl text-main">新增待辦事項</h2>
          <br />
        </div>

        <div className={scss.inpurSelContainer}>
          <InputSel
            className={'col-span-2'}
            caption="工程聯絡單"
            // disabled={true}
            {...config}
            showBaseline="always"
            onClick={() => setShowSelector(true)}
            inputProps={{
              props: {
                value: state_engineeringContact?.projectName ?? '',
                onChange: () => {},
                readOnly: true,
              },
            }}
          />
          <InputSel
            caption="聯絡人"
            {...config}
            inputProps={{
              props: {
                value: state_other.contactPerson,
                onChange: (e) => changeState_other('contactPerson', e.target.value),
              },
            }}
          />
          <InputSel
            caption="聯絡人電話"
            {...config}
            inputProps={{
              props: {
                value: state_other.contactPersonPhoneNumber,
                onChange: (e) => changeState_other('contactPersonPhoneNumber', e.target.value),
              },
            }}
          />
          <InputSel
            caption="通知日期"
            {...config}
            datePickerProps={{
              props: {
                value: state_other.notificationDate ? dayjs(state_other.notificationDate) : null,
                onChange: (date) => changeState_other('notificationDate', date?.toISOString() ?? ''),
              },
            }}
          />
          <InputSel
            caption="預計進場日期"
            {...config}
            datePickerProps={{
              props: {
                value: state_other.entryDate ? dayjs(state_other.entryDate) : null,
                onChange: (date) => changeState_other('entryDate', date?.toISOString() ?? ''),
              },
            }}
          />
          <InputSel
            className="mt-5 col-span-2"
            caption="主旨"
            {...config}
            captionStyle={undefined}
            inputProps={{
              props: {
                value: state_other.purpose,
                onChange: (e) => changeState_other('purpose', e.target.value),
              },
            }}
          />
          <InputSel
            className={'col-span-2 mt-2'}
            caption="內容"
            {...config}
            captionStyle={undefined}
            showBaseline="invisible"
            textareaProps={{
              allowNewLineByUser: true,
              props: {
                className: scss.textarea,
                minRows: 5,
                value: state_other.content,
                onChange: (e) => changeState_other('content', e.target.value),
              },
            }}
          />
        </div>
        <TwoBtnFooter className="mt-10" isLoading={isLoading} onConfirm={onConfirm} onCancel={theOnCancel} />
      </div>
      {/*  */}
      {/*  */}
      <SelectorGroup
        showModal={showSelector}
        //
        onConfirm={(arr) => {
          const engineeringContact = arr[0][0];
          setState_engineeringContact(engineeringContact);
        }}
        onCancel={() => setShowSelector(false)}
      />
    </Modal>
  );
}

// =======================================================================

const config: TinputSelProps = {
  wrapperStyle: { gap: '40px' },
  captionStyle: { width: 120 },
  showBaseline: 'auto',
};

const SelectorGroup = selectModalCreator_multi<['engineeringContact']>({
  selectorArr: [
    {
      key: 'engineeringContact',
      caption: '工程聯絡單',
      limit: 1,
    },
  ],
});

const emptyState = () => ({
  contactPerson: '',
  contactPersonPhoneNumber: '',
  purpose: '',
  notificationDate: '',
  entryDate: '',
  content: '',
});

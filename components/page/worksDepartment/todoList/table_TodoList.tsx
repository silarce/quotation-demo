import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

// antd
import { Collapse } from 'antd';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
// import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';
// import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// icon
import { IconEdit, IconCheck01, IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './table_TodoList.module.scss';

// api
import { apiPatchTodo, apiGetTodo_id, apiPostTodo, apiDeleteTodo } from 'js/api/api_todo';

// type
import { TtodoDto, TcreateTodoDto, TupdateTodoDto } from 'js/api/dtoTypes';

// =======================================================================

type Ttodo_engineeringContact = TtodoDto<{ engineeringContact: true }>;

type TsortedTodoList = {
  [key: string]: {
    engineeringContact: Ttodo_engineeringContact['engineeringContact'];
    todoArr: Ttodo_engineeringContact[];
    reqPatch: (todo: TupdateTodoDto) => Promise<boolean | void>;
    reqDelete: () => void;
  };
};

// =======================================================================

const Panel = Collapse.Panel;

// =======================================================================

export default function Table_todoList({
  todoArr,
  onTodoChange,
}: {
  todoArr: Ttodo_engineeringContact[];
  onTodoChange: () => void;
}) {
  const [sortedTodoList, setSortedTodoList] = useState<TsortedTodoList>({});
  // --------------------------------------------------

  const reqPost = async (engineeringContactId: string) => {
    const body: TcreateTodoDto = {
      engineeringContactId: engineeringContactId,
      contactPerson: [],
      purpose: '',
      notificationDate: new Date().toISOString(),
      entryDate: new Date().toISOString(),
      pointContactPerson: '',
      pointContactNumber: '',
      content: '',
      isAlreadyDisPatching: false,
    };

    await apiPostTodo([body]);
    await onTodoChange();
  };

  const reqPatch = async (body: TupdateTodoDto) => {
    return await apiPatchTodo([body]);
  };

  // const getTodo_id = async (id: string) => {
  //   return await apiGetTodo_id<{ engineeringContact: true }>(id, {
  //     populate: ['engineeringContact'],
  //   });
  // };

  // --------------------------------------------------

  useEffect(() => {
    const list: TsortedTodoList = {};

    todoArr.forEach((todo) => {
      const engineeringContactId = todo.engineeringContactId;

      if (todo.isAlreadyDisPatching) {
        return;
      }

      if (!engineeringContactId) {
        console.log(todo);
        myAlert.warning({
          title: '待辦事項資料有誤',
          content: `待辦事項資料缺少工程編號，請通知開發人員。todoId:${todo.id}`,
        });

        return;
      }

      if (list[engineeringContactId]) {
        list[engineeringContactId].todoArr.push(todo);
      } else {
        list[engineeringContactId] = {
          engineeringContact: todo.engineeringContact,
          todoArr: [todo],
          reqPatch: async (todo) => {
            try {
              await reqPatch(todo);
              await onTodoChange();

              return true;
            } catch (error) {
            } finally {
            }
          },
          reqDelete: () => {
            const onOk = async () => {
              await apiDeleteTodo(todo.id);
              await onTodoChange();
            };

            myAlert.confirm({
              title: '確定刪除待辦事項?',
              content: todo.purpose,
              props: {
                onOk,
              },
            });
          },
        };
      }
    });

    Object.keys(list).forEach((key) => {
      const todoArr = list[key].todoArr;
      list[key].todoArr = _.sortBy(todoArr, 'createdAt').reverse();
    });

    setSortedTodoList(list);
  }, [todoArr]);

  // ===================================================================

  return (
    <div>
      <Collapse className={scss.antdCollapse}>
        {Object.values(sortedTodoList).map((item, index) => {
          const { engineeringContact, todoArr, reqPatch, reqDelete } = item;

          const contact = engineeringContact?.contactInfo?.[0];
          const contactPerson = contact?.contactPerson ?? '';

          const itemArr = engineeringContact?.contract?.worksheet?.contractProductItems;
          const qty = itemArr?.length ?? 0;

          const onAddclick = engineeringContact?.id
            ? () => {
                reqPost(engineeringContact?.id);
              }
            : undefined;

          return (
            <Panel
              className={classNames(scss.antdPanel, scss.plus)}
              key={engineeringContact?.id ?? index}
              header={
                <PanelHeader
                  projectNumber={engineeringContact?.projectNumber ?? ''}
                  contactPerson={contactPerson}
                  qty={qty}
                  projectName={engineeringContact?.projectName ?? ''}
                  onAddclick={onAddclick}
                />
              }
            >
              {todoArr.map((todo, index) => {
                return <PanelBody key={todo.id} todo={todo} onOkClick={reqPatch} onDeleteClick={reqDelete} />;
              })}
            </Panel>
          );
        })}

        {/* <Panel className={classNames(scss.antdPanel, scss.plus)} key="1" header={<PanelHeader />}>
          <PanelBody />
          <PanelBody />
          <PanelBody />
        </Panel> */}
      </Collapse>
    </div>
  );
}

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================

const PanelHeader = ({
  projectNumber,
  contactPerson,
  qty,
  projectName,
  onAddclick,
}: {
  projectNumber: string;
  contactPerson: string;
  qty: string | number;
  projectName: string;
  onAddclick?: () => void;
}) => {
  return (
    <div className={scss.panelHeader}>
      <div>工程編號: {projectNumber} </div>
      <div>聯絡人: {contactPerson} </div>
      <div> 數量: {qty} </div>
      <div className={scss.addCell}>
        <MyButton_v2
          label="新增"
          px="px22"
          py="py4"
          className={classNames(scss.addBtn, !onAddclick && 'invisible')}
          onClick={(e) => {
            e.stopPropagation();
            onAddclick && onAddclick();
          }}
        />
      </div>
      <div className={'col-span-4'}>工程名稱: {projectName}</div>
    </div>
  );
};

const PanelBody = ({
  todo,
  onOkClick,
  onDeleteClick,
}: {
  todo: Ttodo_engineeringContact;
  onOkClick: TsortedTodoList[string]['reqPatch'];
  onDeleteClick?: () => void;
}) => {
  const [disabled, setDisabled] = useState(true);

  // -------------------------------------------------------------------

  const [state_todo, setState_todo] = useState({
    contactPerson: '',
    contactPersonNumber: '',
    purpose: '',
    notificationDate: '',
    entryDate: '',
    content: '',
  });

  // -------------------------------------------------------------------

  const changeState_todo = (key: string, value: string) => {
    setState_todo((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  // -------------------------------------------------------------------

  const onOk = async () => {
    const body: TupdateTodoDto = {
      id: todo.id,
      engineeringContactId: todo.engineeringContactId,
      contactPerson: [
        {
          contactPerson: state_todo.contactPerson,
          contactNumber: state_todo.contactPersonNumber,
        },
      ],
      purpose: state_todo.purpose,
      notificationDate: state_todo.notificationDate,
      entryDate: state_todo.entryDate,
      content: state_todo.content,
      pointContactPerson: '',
      pointContactNumber: '',
    };

    const res = await onOkClick(body);

    res && setDisabled(true);
  };

  // -------------------------------------------------------------------

  useEffect(() => {
    if (disabled) {
      setState_todo({
        contactPerson: todo.contactPerson[0]?.contactPerson ?? '',
        contactPersonNumber: todo.contactPerson[0]?.contactNumber ?? '',
        purpose: todo.purpose ?? '',
        notificationDate: todo.notificationDate ?? '',
        entryDate: todo.entryDate ?? '',
        content: todo.content,
      });
    }
  }, [disabled, todo]);

  // -------------------------------------------------------------------
  const btnBar_disabled = (
    <>
      <IconEdit onClick={() => setDisabled(false)} />
      <button className={scss.btn_dispatch}>派工</button>
    </>
  );

  const btnBar_enabled = (
    <>
      <IconEdit onClick={() => setDisabled(true)} className={classNames(scss.edit, scss.enabled)} />
      <IconCheck01 onClick={onOk} />
    </>
  );

  const BtnBar = disabled ? btnBar_disabled : btnBar_enabled;

  return (
    <div className={scss.panelBody}>
      <div className={scss.info}>
        <div>
          <InputSel
            disabled={disabled}
            {...configList_inpuSel.info}
            caption="主旨"
            captionSize="20"
            fontSize="20"
            inputProps={{
              props: {
                value: state_todo.purpose,
                onChange: (e) => changeState_todo('purpose', e.target.value),
              },
            }}
          />
        </div>
        <div>
          <InputSel
            disabled={disabled}
            {...configList_inpuSel.info}
            caption="接洽人"
            inputProps={{
              props: {
                value: state_todo.contactPerson,
                onChange: (e) => changeState_todo('contactPerson', e.target.value),
              },
            }}
          />
        </div>
        <div>
          <InputSel
            disabled={disabled}
            {...configList_inpuSel.info}
            caption="接洽人電話"
            inputProps={{
              props: {
                value: state_todo.contactPersonNumber,
                onChange: (e) => changeState_todo('contactPersonNumber', e.target.value),
              },
            }}
          />
        </div>
        <div>
          <InputSel
            disabled={disabled}
            {...configList_inpuSel.info}
            caption="通知日期"
            datePickerProps={{
              props: {
                value: state_todo.notificationDate ? moment(state_todo.notificationDate) : null,
                onChange: (date) => changeState_todo('notificationDate', date?.toISOString() ?? ''),
              },
            }}
          />
        </div>
        <div>
          <InputSel
            disabled={disabled}
            {...configList_inpuSel.info}
            caption="預計進場日期"
            datePickerProps={{
              props: {
                value: state_todo.entryDate ? moment(state_todo.entryDate) : null,
                onChange: (date) => changeState_todo('entryDate', date?.toISOString() ?? ''),
              },
            }}
          />
        </div>
      </div>
      {/*  */}
      <div className={scss.btnBar}>
        <div className={scss.top}>{BtnBar}</div>

        <div className={scss.bottom}>
          <IconDelete01 className={scss.btn_delete} onClick={onDeleteClick} />
        </div>
      </div>

      {/*  */}
      <div className={scss.content}>
        <div>
          <span>內容</span>
        </div>
        <div>
          <InputSel
            disabled={disabled}
            showBaseline="invisible"
            textareaProps={{
              allowNewLineByUser: true,
              props: {
                className: classNames(scss.textarea, disabled && scss.disabled),
                minRows: 3,
                value: state_todo.content,
                onChange: (e) => changeState_todo('content', e.target.value),
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================
// ===================================================================

const configList_inpuSel = {
  info: {
    captionSize: '16',
    fontSize: '16',
    showBaseline: 'auto',
  },
} as const;

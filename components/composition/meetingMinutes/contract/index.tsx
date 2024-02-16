import { useState, useEffect, useMemo } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment from 'moment';

// component
import Table01, { Ttable } from 'components/global/gear/table/table01';
import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';

// ui
import {
  Wrapper,
  Wrapper_inpuSel_01,
  inputSelProps,
  WrappedTextarea,
} from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import EmployeeSelector, { TemployeeDto } from 'components/global/gear/modal/employeeSelector';

// type
import { TmeetingMinutesDto } from 'js/api/dtoTypes';

// ---------------------------------------------------------------------------

type TmeetingMinutes = TmeetingMinutesDto<{
  contract: true;
  chairmanEmployee: true;
  attendeesEmployee: true;
  minuteTakerEmployee: true;
}>;

type Tstate_meetingMinutes = Omit<
  TmeetingMinutes,
  | 'chairmanEmployeeId'
  | 'minuteTakerEmployeeId'
  | 'contractId'
  | 'contract'
  | 'chairmanEmployee'
  | 'minuteTakerEmployee'
> & {
  contract: TmeetingMinutes['contract'] | undefined;
  chairmanEmployee: TmeetingMinutes['chairmanEmployee'] | undefined;
  minuteTakerEmployee: TmeetingMinutes['minuteTakerEmployee'] | undefined;
};

// -------------

type Tquery = {
  contractId: string;
  meetingMinutesId: string | undefined;
};

type TimperativeHandle = {
  add: () => void;
  edit: () => void;
  toList: () => void;
  confirm: () => void;
  cancelEdit: () => void;
};

type Tstate = {
  isAdd: boolean;
  isEdit: boolean;
  isRead: boolean;
};

export type { TimperativeHandle, Tstate };

// ---------------------------------------------------------------------------

const MeetingMinutes_contract = forwardRef(MeetingMinutes_contract_component);
export default MeetingMinutes_contract;

function MeetingMinutes_contract_component(
  {
    onStateChange,
  }: {
    onStateChange?: (state: Tstate) => void;
  },
  ref: React.ForwardedRef<unknown>
) {
  //
  const router = useRouter();
  const { contractId, meetingMinutesId } = router.query as Tquery;

  // ------------------------------------------------------------------------
  const [disabled, setDisabled] = useState(true);
  // ------------------------------------------------------------------------
  const isAdd = !disabled && !meetingMinutesId;
  const isEdit = !disabled && !!meetingMinutesId;
  const isRead = disabled && !!meetingMinutesId;
  const isList = !isAdd && !isEdit && !isRead;

  // ------------------------------------------------------------------------

  useImperativeHandle(
    ref,
    (): TimperativeHandle => ({
      //
      toList: () => {
        router.push({
          query: {
            ...router.query,
            meetingMinutesId: undefined,
          },
        });
        setDisabled(true);
      },
      add: () => {
        router.push({
          query: {
            ...router.query,
            meetingMinutesId: undefined,
          },
        });
        setDisabled(false);
      },
      edit: () => {
        setDisabled(false);
      },
      confirm: () => {
        alert('test');
      },
      cancelEdit: () => {
        setDisabled(true);
      },
      //
    })
  );

  // ---------------------------------------------------------------------------

  const onRowClick = (meetingMinutesId: string) => {
    router.push({
      query: {
        ...router.query,
        meetingMinutesId,
        isAdd: undefined,
      },
    });
  };

  // ---------------------------------------------------------------------------

  useEffect(() => {
    onStateChange &&
      onStateChange({
        isAdd,
        isEdit,
        isRead,
      });
  }, [isAdd, isEdit, isRead]);

  // ---------------------------------------------------------------------------

  // 製表時間直接放createdAt

  return (
    <div>
      {isList && <List className="m-auto" stickyTop={40} onRowClick={onRowClick} />}
      {meetingMinutesId && <Edit disabled={disabled} />}
      {isAdd && <Edit disabled={disabled} />}
    </div>
  );
}
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================
// ===========================================================================

const List = ({
  data,
  className,
  stickyTop,
  onRowClick,
}: {
  data?: any[]; // 未來要送進memo建立control_table
  className?: string;
  stickyTop?: React.CSSProperties['top'];
  onRowClick: (meetingMinutesId: string) => void;
}) => {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  const { control_table } = useMemo(() => {
    const thead: Ttable['thead'] = {
      stickyTop: {
        top: stickyTop,
      },
      cellArr: [
        {
          children: '會議日期',
          width: 200,
          justifyContent: 'center',
        },
        {
          children: '會議名稱',
          flex: '1 0',
          justifyContent: 'center',
        },
      ],
    };

    const tbody: Ttable['tbody'] = {
      rowArr: [
        {
          onClick: () => {
            onRowClick('foo123');
          },
          cellArr: [
            {
              children: '2024年02月06日',
              width: 200,
              justifyContent: 'center',
            },
            {
              children: '第一次工程協調會議紀錄',
              flex: '1 0',
              justifyContent: 'center',
            },
          ],
        },
        ...foo,
      ],
    };

    const control_table: Ttable = {
      thead: thead,
      tbody: tbody,
      haveBorder: true,
    };

    return { control_table };
  }, []);

  return (
    <Wrapper_tab
      className={classNames(className)}
      childrenOption={{
        noBorderTop: true,
      }}
      stickyTop={{
        top: stickyTop,
      }}
    >
      <Table01 {...control_table} />
    </Wrapper_tab>
  );
};

// ============================================================================

const Edit = ({ disabled }: { disabled?: boolean }) => {
  type TonChangeKeys = keyof Omit<
    Tstate_meetingMinutes,
    'chairmanEmployee' | 'attendeesEmployee' | 'minuteTakerEmployee'
  >;

  type TselectorKeys = keyof Pick<
    Tstate_meetingMinutes,
    'chairmanEmployee' | 'attendeesEmployee' | 'minuteTakerEmployee'
  >;

  // ---------------------------------------------------------------------

  const [state, setState] = useState<Tstate_meetingMinutes>(employeeMeetingMinute());

  const [selectorKey, setSelectorKey] = useState<TselectorKeys>();

  // ---------------------------------------------------------------------

  const attendeesEmployeeNames = state.attendeesEmployee.map((v) => v.chName).join('、');
  const selectorLimit = selectorKey === 'attendeesEmployee' ? undefined : 1;
  const defaultEmpArr = selectorKey === 'attendeesEmployee' ? state.attendeesEmployee : undefined;

  // ---------------------------------------------------------------------

  const onChange = (key: TonChangeKeys, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const onSelectorClick = (key: TselectorKeys) => {
    setSelectorKey(key);
  };

  const onSelectorConfirm = !selectorKey
    ? null
    : (empArr: TemployeeDto[]) => {
        const key = selectorKey;

        if (key === 'attendeesEmployee') {
          setState((prev) => ({ ...prev, attendeesEmployee: empArr }));
        } else {
          setState((prev) => ({ ...prev, [key]: empArr[0] }));
        }

        setSelectorKey(undefined);
      };

  // ---------------------------------------------------------------------
  useEffect(() => {
    if (disabled) {
      setState(employeeMeetingMinute());
    }
  }, [disabled]);

  return (
    <>
      <Wrapper>
        <Wrapper_inpuSel_01>
          {/*  */}
          <InputSel
            {...inputSelProps}
            className="col-span-2"
            caption="會議名稱"
            showBaseline="auto"
            disabled={disabled}
            inputProps={{
              props: {
                value: state.name,
                onChange: (e) => {
                  onChange('name', e.target.value);
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="會議地點"
            showBaseline="auto"
            disabled={disabled}
            inputProps={{
              props: {
                value: state.location,
                onChange: (e) => {
                  onChange('location', e.target.value);
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="會議日期"
            showBaseline="auto"
            disabled={disabled}
            datePickerProps={{
              props: {
                value: !state.minuteDate ? null : moment(state.minuteDate),
                onChange: (m) => {
                  onChange('minuteDate', m?.toISOString() ?? '');
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="會議主席"
            showBaseline="auto"
            disabled={disabled}
            onClick={() => {
              onSelectorClick('chairmanEmployee');
            }}
            inputProps={{
              props: {
                value: state.chairmanEmployee?.chName ?? '',
              },
            }}
          />

          <InputSel
            {...inputSelProps}
            caption="記錄人員"
            showBaseline="auto"
            disabled={disabled}
            onClick={() => {
              onSelectorClick('minuteTakerEmployee');
            }}
            inputProps={{
              props: {
                value: state.minuteTakerEmployee?.chName ?? '',
              },
            }}
          />

          <InputSel
            {...inputSelProps}
            className="col-span-2"
            caption="與會人員"
            showBaseline="auto"
            disabled={disabled}
            onClick={() => {
              onSelectorClick('attendeesEmployee');
            }}
            textareaProps={{
              props: {
                value: attendeesEmployeeNames || '',
                readOnly: true,
              },
            }}
          />

          {/*  */}
          <WrappedTextarea
            className="col-span-2"
            disabled={disabled}
            inputSelProps={{
              caption: '會議記錄',
            }}
            textareaProps={{
              props: {
                value: state.content ?? '',
                onChange: (e) => {
                  onChange('content', e.target.value);
                },
              },
            }}
          />

          <InputSel
            {...inputSelProps}
            className="col-span-2"
            caption="工程編號"
            showBaseline="auto"
            disabled={true}
            inputProps={{
              props: {
                value: 'M-999999',
              },
            }}
          />

          <InputSel
            {...inputSelProps}
            caption="進場時間"
            showBaseline="auto"
            disabled={disabled}
            datePickerProps={{
              props: {
                value: !state.entryTime ? null : moment(state.entryTime),
                onChange: (m) => {
                  onChange('entryTime', m?.toISOString() ?? '');
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="消檢時間"
            showBaseline="auto"
            disabled={disabled}
            datePickerProps={{
              props: {
                value: !state.inspectionTime ? null : moment(state.inspectionTime),
                onChange: (m) => {
                  onChange('inspectionTime', m?.toISOString() ?? '');
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="使照時程"
            showBaseline="auto"
            disabled={disabled}
            datePickerProps={{
              props: {
                value: !state.timeline ? null : moment(state.timeline),
                onChange: (m) => {
                  onChange('timeline', m?.toISOString() ?? '');
                },
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="竣工時間"
            showBaseline="auto"
            disabled={disabled}
            datePickerProps={{
              props: {
                value: !state.completionTime ? null : moment(state.completionTime),
                onChange: (m) => {
                  onChange('completionTime', m?.toISOString() ?? '');
                },
              },
            }}
          />

          <InputSel
            {...inputSelProps}
            caption="製表日期"
            showBaseline="auto"
            disabled={true}
            inputProps={{
              props: {
                value: '999-99-99',
              },
            }}
          />
          <InputSel
            {...inputSelProps}
            caption="製表人"
            showBaseline="auto"
            disabled={true}
            inputProps={{
              props: {
                value: '製表人.chName',
              },
            }}
          />

          {/*  */}
        </Wrapper_inpuSel_01>
      </Wrapper>
      <EmployeeSelector
        showModal={!!onSelectorConfirm}
        onConfirm={(arr) => {
          onSelectorConfirm && onSelectorConfirm(arr);
        }}
        onCancel={() => {
          setSelectorKey(undefined);
        }}
        selLimit={selectorLimit}
        defaultEmpArr={defaultEmpArr}
      />
    </>
  );
};

// ============================================================================

const employeeMeetingMinute = (): Tstate_meetingMinutes => ({
  // 所屬合約
  contract: undefined,
  // 會議名稱
  name: '',
  // 地點
  location: '',
  // 主席
  chairmanEmployee: undefined,
  // 與會人員
  attendeesEmployee: [],
  // 會議時間 date
  minuteDate: '',
  // 記錄人
  minuteTakerEmployee: undefined,
  // 會議記錄內容
  content: '',
  // 進場時間 date
  entryTime: '',
  // 消檢時間 date
  inspectionTime: '',
  // 使照時程 date
  timeline: '',
  // 竣工時間 date
  completionTime: '',
  // 製表人
  formMaker: '',
});

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

const foo = [
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
  {
    cellArr: [
      {
        children: '2024年02月06日',
        width: 200,
        justifyContent: 'center',
      },
      {
        children: '第一次工程協調會議紀錄',
        flex: '1 0',
        justifyContent: 'center',
      },
    ],
  },
];

import { useState, useEffect, useMemo } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

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

// ---------------------------------------------------------------------------

type Tquery = {
  contractId: string;
  meetingMinutesId: string | undefined;
  // isAdd: 'true' | undefined;
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

  return (
    <div>
      {isList && <List className="m-auto" stickyTop={40} onRowClick={onRowClick} />}
      {meetingMinutesId && <Edit />}
      {isAdd && <Edit />}
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
  const { meetingMinutesId } = router.query as Tquery;

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
  return (
    <Wrapper>
      <Wrapper_inpuSel_01>
        <InputSel
          {...inputSelProps}
          //
          caption="會議名稱"
          showBaseline="auto"
          disabled={disabled}
          inputProps={{
            props: {
              // value: reciver?.name ?? '',
              // placeholder: '請選擇受文者',
            },
          }}
        />
      </Wrapper_inpuSel_01>
    </Wrapper>
  );
};

// ============================================================================

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

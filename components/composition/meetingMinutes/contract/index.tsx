import { useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

// component
import Table01, { Ttable } from 'components/global/gear/table/table01';
import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';

// ---------------------------------------------------------------------------

type Tquery = {
  contractId: string;
  meetingMinutesId: string;
};

// ---------------------------------------------------------------------------
export default function MeetingMinutes_contract({
  id,
}: {
  id?: string; // 未來接api時用的
}) {
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------

  return (
    <div>
      <List className="m-auto" stickyTop={40} />
      <div></div>
      <div></div>
      <div></div>
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
}: {
  data?: any[]; // 未來要送進memo建立control_table
  className?: string;
  stickyTop?: React.CSSProperties['top'];
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
            router.push({
              query: {
                ...router.query,
                meetingMinutesId: '123',
              },
            });
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

const Edit = () => {
  return (
    <div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
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

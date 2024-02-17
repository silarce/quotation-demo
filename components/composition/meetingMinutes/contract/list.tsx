import { useMemo } from 'react';
import classNames from 'classnames';

// component
import Table01, { Ttable } from 'components/global/gear/table/table01';
import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';

// type
import { TmeetingMinutesDto } from 'js/api/api_meetingMinutes';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ===========================================================================
type TmeetingMinutes = TmeetingMinutesDto<{
  contract: true;
  chairmanEmployee: true;
  attendeesEmployee: true;
  minuteTakerEmployee: true;
}>;

// ===========================================================================

export const MeetingMinuteList = ({
  meetingMinutesArr,
  className,
  stickyTop,
  onRowClick,
}: {
  meetingMinutesArr: TmeetingMinutes[];
  className?: string;
  stickyTop?: React.CSSProperties['top'];
  onRowClick: (meetingMinutesId: string) => void;
}) => {
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
      rowArr: meetingMinutesArr.map((item, index) => {
        const { id, createdAt, name } = item;

        return {
          onClick: () => {
            onRowClick(id);
          },
          cellArr: [
            {
              children: getTaiwanDateStr(createdAt) ?? '',
              width: 200,
              justifyContent: 'center',
            },
            {
              children: name,
              flex: '1 0',
              justifyContent: 'center',
            },
          ],
        };
      }),
    };
    // const tbody: Ttable['tbody'] = {
    //   rowArr: [
    //     {
    //       onClick: () => {
    //         onRowClick('foo123');
    //       },
    //       cellArr: [
    //         {
    //           children: '2024年02月06日',
    //           width: 200,
    //           justifyContent: 'center',
    //         },
    //         {
    //           children: '第一次工程協調會議紀錄',
    //           flex: '1 0',
    //           justifyContent: 'center',
    //         },
    //       ],
    //     },
    //     ...foo,
    //   ],
    // };

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
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// const foo = [
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
//   {
//     cellArr: [
//       {
//         children: '2024年02月06日',
//         width: 200,
//         justifyContent: 'center',
//       },
//       {
//         children: '第一次工程協調會議紀錄',
//         flex: '1 0',
//         justifyContent: 'center',
//       },
//     ],
//   },
// ];

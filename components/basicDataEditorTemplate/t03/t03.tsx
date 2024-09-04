import { useState } from 'react';
import classNames from 'classnames';

import { Tabs } from 'antd';

import { TemplateProps, Ttemplate_table } from 'components/basicDataEditorTemplate/types';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Row, { Cell } from 'components/global/gear/table/row';

import scss from './t03.module.scss';

// ===========================================================================

type Tt03 = React.FC<TemplateProps>;

// ===========================================================================
const T03: Tt03 = ({ style, titles, sections, tables }) => {
  const { tableA, tableB } = tables ?? {};

  return (
    <div>
      {/* <p>TITLE</p>

      <div className={scss.a}>
        <InputSel caption="CAPTION" inputProps={{}} />
        <InputSel caption="CAPTION" inputProps={{}} />
        <InputSel caption="CAPTION" inputProps={{}} />
        <InputSel caption="CAPTION" inputProps={{}} />
        <InputSel caption="CAPTION" inputProps={{}} />
        <InputSel caption="CAPTION" inputProps={{}} />
      </div>

      <br />
      <div></div> */}

      <div>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={tableA?.title} key="1">
            <Table tableProps={tableA} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={tableB?.title} key="2">
            <Table tableProps={tableB} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

// ===========================================================================

const Table = ({ tableProps }: { tableProps: Ttemplate_table[string] | undefined }) => {
  if (!tableProps) {
    return null;
  }

  const { columns, keyArr, rowArr } = tableProps;

  return (
    <div>
      <Row thead={true}>
        {keyArr.map((key) => {
          const { label, width, flex } = columns[key];
          const style = {
            width,
            flex,
          };

          return (
            <Cell key={key} style={style}>
              {label}
            </Cell>
          );
        })}
      </Row>

      {rowArr.map((row, index) => {
        return (
          <Row key={index}>
            {keyArr.map((key) => {
              const inputSelProps = row[key];
              const { width, flex } = columns[key];
              const style = {
                width,
                flex,
              };

              return (
                <Cell key={key} style={style}>
                  <InputSel {...inputSelProps} />
                </Cell>
              );
            })}
          </Row>
        );
      })}
    </div>
  );
};

// const TableB = ({ tableB }: { tableB: Ttemplate_table[string] | undefined }) => {
//   if (!tableB) {
//     return null;
//   }

//   const { columns, keyArr, rowArr } = tableB;

//   return (
//     <div>
//       <Row thead={true}>
//         {keyArr.map((key) => {
//           const { label, width, flex } = columns[key];
//           const style = {
//             width,
//             flex,
//           };

//           return (
//             <Cell key={key} style={style}>
//               {label}
//             </Cell>
//           );
//         })}
//       </Row>

//       {rowArr.map((row, index) => {
//         return (
//           <Row key={index}>
//             {keyArr.map((key) => {
//               const inputSelProps = row[key];
//               console.log(inputSelProps);
//               const { width, flex } = columns[key];
//               const style = {
//                 width,
//                 flex,
//               };

//               return (
//                 <Cell key={key} style={style}>
//                   <InputSel {...inputSelProps} />
//                 </Cell>
//               );
//             })}
//           </Row>
//         );
//       })}
//     </div>
//   );
// };

// const Table03 = () => {
//   return (
//     <div>
//       <Row thead={true}>
//         <Cell style={{ width: '200px' }}>I</Cell>
//         <Cell style={{ width: '200px' }}>II</Cell>
//         <Cell style={{ width: '200px' }}>III</Cell>
//         <Cell style={{ width: '200px' }}>IV</Cell>
//       </Row>
//       <Row>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//       </Row>
//       <Row>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//       </Row>
//       <Row>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//         <Cell style={{ width: '200px' }}>
//           <InputSel caption="CAPTION" inputProps={{}} />
//         </Cell>
//       </Row>
//     </div>
//   );
// };

// ===========================================================================

// ===========================================================================

export type { Tt03 };
export default T03;

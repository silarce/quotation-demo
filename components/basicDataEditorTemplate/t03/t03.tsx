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
const T03: Tt03 = ({ style, titles, sections, tables, tabs_table }) => {
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
          {tabs_table?.a?.map((tableName) => {
            const tableProps = tables?.[tableName];

            if (!tableProps) {
              return null;
            }

            return (
              <Tabs.TabPane tab={tableProps?.title} key={tableName}>
                <Table tableProps={tableProps} />
              </Tabs.TabPane>
            );
          })}
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

// ===========================================================================

// ===========================================================================

export type { Tt03 };
export default T03;

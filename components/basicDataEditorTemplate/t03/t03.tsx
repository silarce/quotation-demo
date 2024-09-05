import { useState } from 'react';
import classNames from 'classnames';

// antd
import { Tabs } from 'antd';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Row, { Cell } from 'components/global/gear/table/row';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// scss
import scss from './t03.module.scss';

// type
import { TemplateProps, Ttemplate_table } from 'components/basicDataEditorTemplate/types';
// ===========================================================================

type Tt03 = React.FC<TemplateProps>;

// ===========================================================================
const T03: Tt03 = ({ style, titles, sections, tables, tabs_table }) => {
  const { tableA, tableB } = tables ?? {};

  return (
    <div className={scss.t03}>
      <div>
        <MyButton_v2 px="px22" py="py4">
          搜尋
        </MyButton_v2>
      </div>
      {/*  */}
      <p className={scss.titleA}>{titles?.title01}</p>
      {/*  */}
      <div className={scss.sectionA}>
        {sections.a?.map((props, index) => {
          const { key, ...rest } = props;

          return <InputSel key={key || index} {...rest} />;
        })}
      </div>
      <div className={scss.sectionB}>
        {sections.b?.map((props, index) => {
          const { key, ...rest } = props;

          return <InputSel key={key || index} {...rest} />;
        })}
      </div>

      {/*  */}
      <div></div>
      {/*  */}
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
        const { cellDict, getData } = row;

        return (
          <Row
            key={index}
            className={classNames(scss.row)}
            onClick={() => {
              console.log(getData());
            }}
          >
            {keyArr.map((key) => {
              const inputSelProps = cellDict[key];
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

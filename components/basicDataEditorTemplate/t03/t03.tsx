import { useState } from 'react';
import classNames from 'classnames';

import { Tabs } from 'antd';

import { TemplateProps } from 'components/basicDataEditorTemplate/types';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import Row, { Cell } from 'components/global/gear/table/row';

import scss from './t03.module.scss';

// ===========================================================================

type Tt03 = React.FC<TemplateProps>;

// ===========================================================================
const T03: Tt03 = ({ style, titles, sections }) => {
  return (
    <div>
      <p>TITLE</p>

      <div className={scss.a}>
        <InputSel caption="CAPTION" inputProps={{}} />
        <InputSel caption="CAPTION" inputProps={{}} />
        <InputSel caption="CAPTION" inputProps={{}} />
        <InputSel caption="CAPTION" inputProps={{}} />
        <InputSel caption="CAPTION" inputProps={{}} />
        <InputSel caption="CAPTION" inputProps={{}} />
      </div>

      <br />

      {/* <div>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="table01" key="1">
            <Table01 />
          </Tabs.TabPane>
          <Tabs.TabPane tab="table02" key="2">
            <Table02 />
          </Tabs.TabPane>
          <Tabs.TabPane tab="table03" key="3">
            <Table03 />
          </Tabs.TabPane>
        </Tabs>
      </div> */}
    </div>
  );
};

// ===========================================================================

const Table01 = () => {
  return (
    <div>
      <Row thead={true}>
        <Cell style={{ width: '200px' }}>A</Cell>
        <Cell style={{ width: '200px' }}>B</Cell>
      </Row>
      <Row>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
      </Row>
    </div>
  );
};

const Table02 = () => {
  return (
    <div>
      <Row thead={true}>
        <Cell style={{ width: '200px' }}>甲</Cell>
        <Cell style={{ width: '200px' }}>乙</Cell>
        <Cell style={{ width: '200px' }}>丙</Cell>
      </Row>
      <Row>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
      </Row>
      <Row>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
      </Row>
    </div>
  );
};

const Table03 = () => {
  return (
    <div>
      <Row thead={true}>
        <Cell style={{ width: '200px' }}>I</Cell>
        <Cell style={{ width: '200px' }}>II</Cell>
        <Cell style={{ width: '200px' }}>III</Cell>
        <Cell style={{ width: '200px' }}>IV</Cell>
      </Row>
      <Row>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
      </Row>
      <Row>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
      </Row>
      <Row>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
        <Cell style={{ width: '200px' }}>
          <InputSel caption="CAPTION" inputProps={{}} />
        </Cell>
      </Row>
    </div>
  );
};

// ===========================================================================

// ===========================================================================

export type { Tt03 };
export default T03;

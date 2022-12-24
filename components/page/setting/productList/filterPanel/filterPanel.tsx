import { useState } from 'react';





// antd
import { Collapse, Checkbox } from 'antd';
const { Panel } = Collapse;

// css
import scss from "./filterPanel.module.scss"



// =============================================================================
export default function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false)

  const switchPanel = () => setIsOpen(!isOpen)

  // --------------------------------------------------------------------------
  return (
    <div className={scss.filterPanel}>
      <Collapse activeKey={+!isOpen}

        ghost>
        <Panel className={scss.panel} key={1}
          header={<PanelHeader switchPanel={switchPanel} />}
          showArrow={false}
        >




          <div className={scss.panelBody}>

            <div>
              <p className={scss.caption}>類別</p>
              <div className={scss.checkContainer}>
                <Checkbox className={scss.checkBox}
                  checked={false} onChange={() => { }} >
                  防火防煙捲系列
                </Checkbox>
                <Checkbox className={scss.checkBox}
                  checked={false} onChange={() => { }} >
                  防火防煙捲門系列
                </Checkbox>
                <Checkbox className={scss.checkBox}
                  checked={false} onChange={() => { }} >
                  防火系列
                </Checkbox>
                <Checkbox className={scss.checkBox}
                  checked={false} onChange={() => { }} >
                  防火防煙門系列
                </Checkbox>
                <Checkbox className={scss.checkBox}
                  checked={false} onChange={() => { }} >
                  防火防煙捲門系列
                </Checkbox>
                <Checkbox className={scss.checkBox}
                  checked={false} onChange={() => { }} >
                  防火防煙門系列
                </Checkbox>
                <Checkbox className={scss.checkBox}
                  checked={false} onChange={() => { }} >
                  防火防煙捲
                </Checkbox>


              </div>
            </div>


            <div>22222</div>
            <div>33333</div>


          </div>





        </Panel>
      </Collapse>
    </div>
  )
}

// ==============================================================================

const PanelHeader = (
  { switchPanel }:
    { switchPanel: () => void }
) => {

  return (
    <div className={scss.panelHeader}>
      <span>篩選內容</span>
      <button onClick={switchPanel}><span>收合</span></button>
    </div>
  )
}





















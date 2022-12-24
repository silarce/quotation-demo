import { useState } from 'react';





// antd
import { Collapse, Checkbox } from 'antd';
const { Panel } = Collapse;

// css
import scss from "./filterPanel.module.scss"



type TcheckOption = { label: string, value: string }

// =============================================================================
export default function FilterPanel(
  {
    prodClassOptions,
    doorTypeOptions,
    partOptions,
  }:
    {
      prodClassOptions: TcheckOption[]
      doorTypeOptions: TcheckOption[]
      partOptions: TcheckOption[]
    }
) {





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
                {prodClassOptions.map((option, index) => {
                  const { label, value } = option
                  return (
                    <Checkbox className={scss.checkBox} key={index}
                      checked={false} onChange={() => { console.log(value) }} >
                      {label}
                    </Checkbox>
                  )
                })}
              </div>
            </div>


            <div>
              <p className={scss.caption}>門型</p>
              <div className={scss.checkContainer}>
                {doorTypeOptions.map((option, index) => {
                  const { label, value } = option
                  return (
                    <Checkbox className={scss.checkBox} key={index}
                      checked={false} onChange={() => { console.log(value) }} >
                      {label}
                    </Checkbox>
                  )
                })}
              </div>
            </div>



            <div>
              <p className={scss.caption}>顯示條件</p>
              <div className={scss.checkContainer02}>
                {partOptions.map((option, index) => {
                  const { label, value } = option
                  return (
                    <Checkbox className={scss.checkBox} key={index}
                      checked={false} onChange={() => { console.log(value) }} >
                      {label}
                    </Checkbox>
                  )
                })}
              </div>
            </div>


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





















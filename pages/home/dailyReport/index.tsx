import { useState } from "react"
import classNames from "classnames"

import _ from "lodash"

// layer
import PageHeader02 from "components/PageHeader/PageHeader02/PageHeader02"
import SubLayer from "components/Layer/SubLayer/SubLayer"
// component
import TheCalendar from "components/page/home/dailyReport/TheCalendar"
import SetReportEmpModal from "components/page/home/dailyReport/SetReportEmpModal"
import ReportTable from "components/page/home/dailyReport/ReportTable"
// gear
import CheckButton from "components/global/gear/button/checkButton"

// fakeData
import { fakeEmployeeArr, TfakeEmployee } from "./_tempFakeData/fakeEmployeeArr"
import {
  TfakeDailyReport,
  fakeDailyReport as fakeDailyReportOri, generateData
} from "./_tempFakeData/fakeDailyReportArr"
import { TreportDetail, fakeReportDetailArr } from "./_tempFakeData/fakeReportDetailArr"

// css
import scss from "./dailyReport.module.scss"

// =====================================================================
const fakeDailyReport = generateData(fakeDailyReportOri, "2023-04-26", "2023-05-03")
// =====================================================================

export default function DailyReport() {
  const [reportEmpArr_preEdit, setReportEmpArr_preEdit] = useState<TfakeEmployee[]>()


  // ----------------------------------------------------------------------
  // SetReportEmpModal

  const editReportEmpArr = () => {
    setReportEmpArr_preEdit(fakeEmployeeArr)
  }
  const onConfirm = (employee: TfakeEmployee[]) => {
    console.log(employee)
  }
  const onCancel = () => {
    setReportEmpArr_preEdit(undefined)
  }
  const onSearch = (v: string) => {
    console.log(v)
  }
  // ----------------------------------------------------------------------
  const panelList = [
    {
      custom: <CheckButton
        checkLabel="已讀"
        uncheckLable="未讀"
        onClick={(isCheck) => { console.log(isCheck) }}
        defaultCheck={true}
      />
    }
  ]

  // ----------------------------------------------------------------------

  return (
    <>
      {/* <SubLayer bodyClassName={scss.subLayer}> */}
      <SubLayer bodyClassName={classNames(scss.subLayer, scss.plus)}>
        <PageHeader02 tag="日報表" panelList={panelList} />

        {/* <TheCalendar dataArr={fakeDailyReport}
          editReportEmpArr={editReportEmpArr}
        /> */}
        <ReportTable reportDetailArr={fakeReportDetailArr} />

      </SubLayer>

      <SetReportEmpModal
        visible={!!reportEmpArr_preEdit}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onSearch={onSearch}
        dataArr={reportEmpArr_preEdit ?? []}
      />
    </>
  )
}


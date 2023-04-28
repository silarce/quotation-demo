import { useState } from "react"
import classNames from "classnames"

import _ from "lodash"

// component
import TheCalendar from "components/page/home/dailyReport/TheCalendar"
import SetReportEmpModal from "components/page/home/dailyReport/SetReportEmpModal"

// layer
import PageHeader02 from "components/PageHeader/PageHeader02/PageHeader02"
import SubLayer from "components/Layer/SubLayer/SubLayer"

// fakeData
import { fakeEmployeeArr, TfakeEmployee } from "./_tempFakeData/fakeEmployeeArr"
import {
  TfakeDailyReport,
  fakeDailyReport as fakeDailyReportOri, generateData
} from "./_tempFakeData/fakeDailyReportArr"

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

  return (
    <>
      {/* <SubLayer bodyClassName={scss.subLayer}> */}
      <SubLayer bodyClassName={classNames(scss.subLayer, scss.plus)}>
        <PageHeader02 tag="日報表" />

        <TheCalendar dataArr={fakeDailyReport}
          editReportEmpArr={editReportEmpArr}
        />

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


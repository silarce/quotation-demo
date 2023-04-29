import { useState } from "react"
import classNames from "classnames"
import { useRouter } from "next/router"
import _ from "lodash"

// ui


// layer
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import SubLayer from "components/Layer/SubLayer/SubLayer"
// component
import TheCalendar from "components/page/home/dailyReport/TheCalendar"
import SetReportEmpModal from "components/page/home/dailyReport/SetReportEmpModal"
import ReportTable from "components/page/home/dailyReport/ReportTable"
import TagCarousel from "components/page/home/dailyReport/TagCarousel"
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
type Ttag = { name: string, date: string }
// =====================================================================
const fakeDailyReport = generateData(fakeDailyReportOri, "2023-04-26", "2023-05-03")
// =====================================================================

export default function DailyReport() {
  const router = useRouter()
  const isSubordinate = router.query.isSubordinate ? true : false


  const [reportEmpArr_preEdit, setReportEmpArr_preEdit] = useState<TfakeEmployee[]>()

  const [tagArr, setTagArr] = useState<Ttag[]>([])

  // ----------------------------------------------------------------------
  // TagCarousel
  const addTag = (employee: Ttag) => {
    setTagArr(arr => { arr.push(employee); return [...arr] })
  }
  const removeTag = (index: number) => {
    setTagArr(arr => { arr.splice(index, 1); return [...arr] })
  }
  console.log(tagArr)

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
  const panelList01: TpanelList = [
    {
      custom: <CheckButton
        checkLabel="已讀"
        uncheckLable="未讀"
        onClick={(isCheck) => { console.log(isCheck) }}
        defaultCheck={true}
      />
    }
  ]

  const panelList02: TpanelList = [
    {
      type: "redButton",
      label: "上傳",
      onClick: () => { },
    },
    {
      type: "myButton",
      label: "取消",
      onClick: () => { },
    },
  ]
  const panelList = isSubordinate ? panelList01 : panelList02

  // ----------------------------------------------------------------------
  const customeLeft =
    [
      <TagCarousel key="1"
        tagArr={tagArr}
        removeTag={removeTag} />
    ]
  // ----------------------------------------------------------------------

  return (
    <>
      {/* <SubLayer bodyClassName={scss.subLayer}> */}
      <SubLayer bodyClassName={classNames(scss.subLayer, scss.plus)}>
        <PageHeader02 tag="日報表" panelList={panelList}
          customeLeft={customeLeft}
        />

        <TheCalendar dataArr={fakeDailyReport}
          editReportEmpArr={editReportEmpArr}
          addTag={addTag}
        />
        {/* <ReportTable reportDetailArr={fakeReportDetailArr} isSubordinate={isSubordinate} /> */}

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

// ==========================================================







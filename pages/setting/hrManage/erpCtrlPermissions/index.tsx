// ERP操作權限
// ERP操作權限
// ERP操作權限

import {
  MouseEvent,
  useState, useEffect, useMemo
} from "react"
import Image from "next/image";
import { useRouter } from "next/router";

// layer
import SubLayer from "components/Layer/SubLayer/SubLayer";

// component
import Table from "components/page/setting/hrManage/table/table";
import SelectEmployeePanel from "components/page/setting/hrManage/modal/selectEmployeePanel"
import EmployeeSelector from "components/global/gear/modal/employeeSelector02";

// gear
import PageHeader02, { TsearchGroup, Toption, TpanelList } from "components/PageHeader/PageHeader02/PageHeader02";
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01";
import { setRootLoading, showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";

// icon
import iconPassword from 'public/image/icon/password.svg';

// api
import {
  TapiGetEmployeeParams, TemployeeDto,
  useEmployee, apiPostEmployeeErpUser, apiDeleteEmployeeErpUser,
} from "js/api/api_employee";
import { useDepartments } from "js/api/api_department";
import { apiPatchUserResetPassword } from "js/api/api_user";


// css
import scss from "./erpCtrlPermissions.module.scss"
import { AxiosError } from "axios";

// config
import { hrManageLinkArr } from "components/page/setting/hrManage/hrManageLinkArr";


// ==========================================================================
export default function ErpCtrlPermissions() {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // ------------------------------------------------------------------------

  const params: TapiGetEmployeeParams = {
    order: "ASC",
    page: 1,
    pageSize: 999,
    sort: "idNumber",
    filter: {
      user: {
        $notNull: true
      },
      // 收到空字串會壞掉
      "jobs.department.id": router.query.department || undefined,
      $or: {
        chName: {
          $contains: router.query.content,
        },
        idNumber: {
          $contains: router.query.content,
        },

      }
    },
    populate: ["jobs.department", "user"]
  }


  // 列表-送進table裡面
  let { data: employeeData01, update: updateEmployeeData01 } = useEmployee(params)
  const employeeList = employeeData01?.data || []
  const employeeData01Meta = employeeData01?.meta

  const updateList = async () => {
    setIsLoading(true)
    await updateEmployeeData01()
    setIsLoading(false)
  }

  // ____________________________________________

  const [empArr02SearchValue, setEmpArr02SearchValue] =
    useState<string | undefined | null>(null)

  // 新增操作人員用的
  const params_employeeArr_02 = (() => {
    const allNum = /^\d+$/.test(empArr02SearchValue ?? "n")
    const grade = allNum ? empArr02SearchValue : undefined
    return {
      pageSize: 999999,
      populate: ["jobs"],
      filter: {
        "$or": {
          idNumber: { $containsi: empArr02SearchValue },
          chName: { $containsi: empArr02SearchValue },
          "jobs.name": { $containsi: empArr02SearchValue },
          "jobs.grade": { $eq: grade },
        }
      }
    }
  })()

  const { data: employeeData02, update: updateEmployeeData02 }
    = useEmployee(params_employeeArr_02)
  const employeeArr_02 = employeeData02?.data ?? []
  // ____________________________________________

  // 部門列表
  const { data: departmentsData, update: updateDepartments } = useDepartments()
  // 用在搜尋bar的option
  const options_departments = useMemo(() => {
    if (!departmentsData?.data) return []
    const optionArr = departmentsData?.data.map((item) => {
      const { id, name } = item
      return {
        value: id,
        label: name
      }
    })

    optionArr.unshift({ value: "", label: "不拘" })

    return optionArr
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentsData])


  // ------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await Promise.all([updateEmployeeData01(), updateDepartments()])
        .then((valueArr) => valueArr)
        .catch(err => Promise.reject(err))
      setIsReady(true)
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isReady) return
    updateList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query])

  useEffect(() => {
    if (empArr02SearchValue === null) return;
    if (isLoading) return
    (async () => {
      try {
        showRootLoading(true)
        await updateEmployeeData02()
        setShowAddPanel(true)
      } catch (error) {
        myAlert.err({ title: "取得人員資料失敗" })
      }
      showRootLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empArr02SearchValue])


  // ------------------------------------------------------------------------
  // 新增操作人員

  const [showAddPanel, setShowAddPanel] = useState(false)

  const openAddPanel = async () => {
    if (isLoading) return
    try {
      showRootLoading(true)
      await updateEmployeeData02()
      setShowAddPanel(true)
    } catch (error) {
      myAlert.err({ title: "取得人員資料失敗" })
    }
    showRootLoading(false)
  }

  const onConfirm = async (employeeArr: TemployeeDto[]) => {
    if (isLoading) return

    const employeeIdArr = employeeArr.map((emp) => emp.id)
    showRootLoading(true)

    for (const id of employeeIdArr) {
      try {
        const res = await apiPostEmployeeErpUser(id)
        newPwTip({ title: "預設密碼", content: res.password })
        setShowAddPanel(false)
      }
      catch (error) {
        const err = error as AxiosError<{
          error: string
          message: string
          statusCode: number
        }>
        const { message, statusCode } = err.response?.data ?? {}
        myAlert.err({
          title: statusCode,
          content: message,
        })
      }
    }
    showRootLoading(false)
    await updateList()
  }

  const onCancel = () => {
    setShowAddPanel(false)
  }

  const searchEmployee = (v: string) => {
    if (!v) setEmpArr02SearchValue(undefined)
    setEmpArr02SearchValue(v)
  }

  // ------------------------------------------------------------------------
  // 刪除功能

  const [selIndex, setSelIndex] = useState<number>(-1)


  const selId = employeeList[selIndex]?.id
  const selIdNumber = employeeList[selIndex]?.idNumber
  const selChName = employeeList[selIndex]?.chName

  const openDelete = (e: MouseEvent, index: number) => {
    e.stopPropagation()
    if (isLoading) return
    setSelIndex(index)
  }

  const removeEmployee = async (employeeId: string) => {
    if (isLoading) return
    setRootLoading(true)
    try {
      await apiDeleteEmployeeErpUser(employeeId)
      setRootLoading(false)
    }
    catch {
      myAlert.err({ title: "移除失敗" })
    }
    setRootLoading(false)
    cancelDelete()
    await updateList()
  }

  const cancelDelete = () => {
    setSelIndex(-1)
  }

  // ------------------------------------------------------------------------

  // const resetPw = async (id: string) => {
  const resetPw = async (employee: TemployeeDto) => {
    const { user, chName, idNumber } = employee

    const onConfirm = async () => {
      try {
        if (isLoading) return
        setIsLoading(true)
        const res = await apiPatchUserResetPassword(user!.id)
        const { password, account, username } = res
        myAlert.success({
          props: {
            title: "密碼重置成功",
            content:
              <ResetPwContent account={account} username={chName} newPw={password} />
          }
        })
      }
      catch (error) {
        const err = error as AxiosError<{
          error: string
          message: string
          statusCode: number
        }>
        const { error: resSerror, message } = err.response?.data ?? {}
        myAlert.err({
          title: resSerror,
          content: message
        })
      }
      finally {
        setIsLoading(false)
      }
    }

    myAlert.confirm({
      title: `是否重設密碼`,
      // content: `id number: ${idNumber}`,
      content: <>
        <span>{`id number: ${idNumber}`}</span>
        <br />
        <span>{`名字: ${chName}`}</span></>,
      // content: `請確認是否刪除${chName}`,
      props: {
        onOk: onConfirm,
      }
    })
  }

  // ------------------------------------------------------------------------
  const searchTargetList: TsearchGroup["searchTargetList"] = [
    {
      options: options_departments,
      width: "104px",
      placeholder: "請選擇部門",
    },
    {
      width: "134px",
      placeholder: "請輸入搜尋內容",
    },
  ]

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch: (valueArr: (Toption | null | string)[]) => {
      const department = (valueArr[0] as Toption).value
      const content = valueArr[1] as string

      const query: {
        department?: string
        content?: string
      } = {}
      if (department) query.department = department
      if (content) query.content = content

      router.push({
        pathname: "/setting/hrManage/erpCtrlPermissions",
        query
      })
    }
  }

  const panelList: TpanelList = [
    { searchGroup },
    {
      type: "addButton",
      label: "新增操作人員",
      onClick: openAddPanel,
    }
  ]

  // ------------------------------------------------------------------------
  return (
    <SubLayer>
      <div className={scss.header}>
        <PageHeader02 linkList={hrManageLinkArr} panelList={panelList} />
      </div>

      <div >
        <div className={scss.main}>
          {isReady &&
            <Table
              employeeList={employeeList}
              onDelete={openDelete}
              onResetPw={resetPw}
              userCount={employeeData01Meta?.itemCount ?? ""}
            />
          }
        </div>
        {/* <LoadingCover01 isLoading={isLoading} /> */}
      </div>

      <EmployeeSelector
        showModal={showAddPanel}
        label="請選擇操作人員"
        // tip="可複選"
        employeeArr={employeeArr_02 || []}
        onConfirm={onConfirm}
        onCancel={onCancel}
        searchEmployee={searchEmployee}
        selLimit={1}
      />
      <TwoButtonModal
        visible={!!selId}
        text={`請確定要刪除「${selIdNumber}」「${selChName}」?`}
        onConfirm={() => removeEmployee(selId)}
        onCancel={cancelDelete}
      />
    </SubLayer>
  )
}

// ==================================================================

const newPwTip = (
  { title, content }:
    {
      title: string
      content: string
    }
) => {

  myAlert.info({
    title: title,
    content: content,
    props: {
      maskClosable: false,
      keyboard: false,
      icon: <CustomIcon />
    }
  })
}

const CustomIcon = () => {
  return (
    <div className="text-center">
      <Image src={iconPassword} alt=""
        className="w-12 h-12"
      />
    </div>
  )
}

const ResetPwContent = (
  { account, username, newPw }:
    {
      account: string
      username: string
      newPw: string
    }
) => {


  return (
    <div>
      <span className="block">{account}</span>
      <span className="block">{username}</span>
      <span className="block">新密碼 : {newPw}</span>
    </div>
  )

}





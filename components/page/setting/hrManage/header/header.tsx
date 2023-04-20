
import PageHeader02 from "components/PageHeader/PageHeader02/PageHeader02";



// ============================================================================
export default function Header() {
  return (
    <PageHeader02 linkList={linkArr} />
  )
}

// ============================================================================

const linkArr = [
  {
    label: "ERP操作權限",
    href: "/setting/hrManage/erpCtrlPermissions",
  },
  {
    label: "ERP功能權限",
    href: "/setting/hrManage/erpFuncPermissions",
  },
  {
    label: "人事權限管理",
    href: "/setting/hrManage",
  },
]









interface TengineerContactExport {
  id: string; // 工程聯絡單id
  contractNumber: string; // 合約編號
  projectName: string; // 工程名稱
  projectNumber: string; // 工程編號
  contractor: string; // 承包商(客戶名稱)
  contractorContactNumber: string; // 承包商公司電話
  contractorFaxNumber: string; // 承包商公司傳真
  contractorPrincipal: string; // 負責人
  constructionSiteContactNumber: string; // 工地連絡電話
  constructionSiteFaxNumber: string; // 工地傳真
  address: string; // 工程地點
  projectPrincipal: string; // 工地負責人
  projectContent: string; // 工程內容
  // annotations: string[];
  annotations: string; // JSON.stringify(string[])
  constructionSitePrincipalContactNumber: string;
  scheduledProgress: string; // 預定進度
  productDetails: {
    id: string; // quotation_productId
    productSpec: string; // 產品規格(api組for匯出)
    itemName: string; // 項目
    fullWidth: number; // 全寬(組產品規格用)
    height: number; // 門高(組產品規格用)
    boxB: number; // 捲箱高度(組產品規格用)
    doorModelName: string; // 門型
    materialName: string; // 材質
    guideRailThickness: number; // 厚度(門軌厚度)
    materialSurface: string; // 表面(當表面為烤漆或氟碳)
    guideRail: string; // 門軌
    closingType: string; // 開關方式
    horsepower: string; // 馬力數
    quantity: string; // 數量
    note: string;
    bounceDoorWidth: string;
  }[];
}

export type { TengineerContactExport };

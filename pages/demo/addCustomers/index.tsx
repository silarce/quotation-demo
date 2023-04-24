import React, { useState, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import _ from "lodash"

import { TpostCustomer, apiPostCustomers, customerTypesLookup } from 'js/api/api_customer';



type SheetData = {
  [key: string]: string;
};

function ExcelReader() {
  const [xlsxData, setXlsxData] = useState<SheetData[]>([]);


  // ------------------------------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files && e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target) return;

      // 讀取文件數據
      const binaryData = event.target.result;

      // 將二進制數據解析為工作簿對象
      const workbook = XLSX.read(binaryData, { type: 'binary' });

      // 將工作表中的數據轉換為JSON對象
      const sheetName = workbook.SheetNames[0];
      const sheetData: SheetData[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // 將JSON對象更新到狀態
      setXlsxData(sheetData);
      // console.log(sheetData)
    };

    file && reader.readAsBinaryString(file);
  };

  // ------------------------------------------------------------------------
  const formatData = () => {
    const dataArr = xlsxData.map((data) => {
      const {
        name, principal, taxDeductionCategory,
        taxId, phone, fax,
        county, district, address,
        invoiceCounty, invoiceDistrict, invoiceAddress,

        types: typesOri,
        contact1,
        contactPhone1,
        contact2,
        contactPhone2,
        contact3,
        contactPhone3,

        項次
      } = data


      const contacts: TpostCustomer["contacts"] = []
      if (contact1 || contactPhone1)
        contacts.push({ name: contact1 ?? "", phone: contactPhone1 ?? "", })
      if (contact2 || contactPhone2)
        contacts.push({ name: contact2 ?? "", phone: contactPhone2 ?? "", })
      if (contact3 || contactPhone3)
        contacts.push({ name: contact3 ?? "", phone: contactPhone3 ?? "", })


      const types = (() => {
        let typeOriCopy = typesOri
        typeOriCopy = typeOriCopy.replace("客戶", typesLookup["客戶"])
        typeOriCopy = typeOriCopy.replace("廠商", typesLookup["廠商"])

        return typeOriCopy.split("/") as (keyof typeof customerTypesLookup)[]
      })()

      return {
        name: name ?? "",
        principal: principal ?? "",
        types: types,
        taxDeductionCategory: taxDeductionCategory ?? "",
        taxId: taxId ?? "",
        phone: phone ?? "",
        fax: fax ?? "",
        contacts: contacts ?? "",
        county: county ?? "",
        district: district ?? "",
        address: address ?? "",
        invoiceCounty: invoiceCounty ?? "",
        invoiceDistrict: invoiceDistrict ?? "",
        invoiceAddress: invoiceAddress ?? "",

        項次,
      }
    }) //  map
    // console.log(dataArr)
    return dataArr
  }

  const previewData = () => {
    console.log(formatData())
  }


  // ------------------------------------------------------------------------

  const checkBody = () => {
    const dataArr = formatData()
    let isError = false

    console.log("總筆數", dataArr.length)

    for (const data of dataArr) {
      if (isError) return;

      const body: TpostCustomer = {
        ...emptyCustomer(),
        ...data,
      }

      try {
        const valuesArr = Object.values(body)
        const haveUndefined = valuesArr.includes(undefined)
        if (haveUndefined) { throw Error }

        console.log("項次", data.項次, "完成")
        console.log(body)
        console.log("body", body)
        console.log("---------------------------------------------------------")
      }
      catch (error) {
        isError = true
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log("項次", data.項次, "失敗")
        console.log("data", data)
        console.log("body", body)
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      }
    }
  }

  // ------------------------------------------------------------------------

  // 批次發api
  const batchReq = async () => {
    const dataArr = formatData()
    if (dataArr.length === 0) return

    let isError = false

    for (const data of dataArr) {
      if (isError) return;

      const body: TpostCustomer = {
        ...emptyCustomer(),
        ...data,
      }

      try {
        // await apiPostCustomers(body)
        console.log("項次", data.項次, "完成")
        console.log("data", data)
        console.log("body", body)
        console.log("----------------------------------------------------------")
      }
      catch (error) {
        isError = true
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log("項次", data.項次, "失敗")
        console.log("data", data)
        console.log("body", body)
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      }
    }
  }



  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <br />
      <br />
      <button onClick={previewData} className="border-2 border-[#000]">預覽資料</button>
      <br />
      <br />
      {/* <button onClick={apiTest} className=" bg-gray-400">批次發api測試</button> */}
      <button onClick={checkBody} className="border-2 border-[#000]">檢查body</button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <button onClick={batchReq} className=" text-red-500 border-2 border-[#000]">發出api請求</button>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}

export default ExcelReader;

// ==========================================================================

const typesLookup = {
  "營造": "construction",
  "事務所": "firm",
  "業主": "propertyOwner",
  "協力廠商": "contractor",

  "客戶": "propertyOwner",
  "廠商": "contractor",
}




const emptyCustomer = (): TpostCustomer => ({
  name: "",
  nickname: "",
  principal: "",
  taxDeductionCategory: "",
  taxId: "",
  phone: "",
  fax: "",
  county: "",
  district: "",
  address: "",
  invoiceCounty: "",
  invoiceDistrict: "",
  invoiceAddress: "",
  contacts: [],
  types: []
})


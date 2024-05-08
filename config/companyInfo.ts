// api只有總公司的資料，沒有台北分公司的資料
// 因此決定在這邊統一管理公司資訊

const companyInfo = {
  headOffice: {
    wholeAddress: '台中市霧峰區峰北路666號',
    tel: '04-2406-9939',
  },
  taipeiOffice: {
    wholeAddress: '台北市內湖路一段387巷5號2F之2',
    tel: '02-2658-1508',
  },
};

export { companyInfo };

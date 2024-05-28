// api只有總公司的資料，沒有台北分公司的資料
// 因此決定在這邊統一管理公司資訊

const companyInfo = {
  name: '三久建材工業股份有限公司',
  headOffice: {
    wholeAddress: '台中市霧峰區峰北路666號',
    tel: '04-2406-9939',
    tel2: '04-2406-9939(七線)',
    fax: '04-24069909',
  },
  taipeiOffice: {
    wholeAddress: '台北市內湖路一段387巷5號2樓之2',
    tel: '02-2658-1508',
    tel2: '02-2658-1508(三線)',
    fax: '02-26581507',
  },
};

export { companyInfo };

// 檢查是否為SST
const checkIsSST = (material: string) => {
  let isSST = false;

  if (material.startsWith('SST')) {
    isSST = true;
  } else if (material.includes('外SST')) {
    isSST = true;
  }

  return isSST;
};

// 檢查是否鍍鋅
const checkIsGalvanized = (material: string) => {
  let isGalvanized = false;

  if (material.includes('鍍鋅')) {
    isGalvanized = true;
  }

  return isGalvanized;
};

export { checkIsSST, checkIsGalvanized };

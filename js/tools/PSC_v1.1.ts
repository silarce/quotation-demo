// let reelData = ""; // 直徑
// const L = 5.16; // 報價單主產品設定的L，但這邊是cm
// let h = 2.3; // 報價單主產品設定的h，那編寫H但應該是h
// let B = 0;  // 報價單主產品設定的B
// let D = 0; // 報價單主產品設定的D
// const unitWeight = 22;
// const weight = L * h * 22;
// let horsepower = "";
// let bArray: number[] = [];








//  捲軸計算 //直徑
const calcReel = (
  L: number,
  weight: number
) => {
  let reelData: string = "資料錯誤"
  if (L < 4.0) {
    if (weight < 990 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 990 * 0.9 && weight < 1670 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 1670 * 0.9 && weight < 3600 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 4.0 && L < 5.2) {
    if (weight < 740 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 740 * 0.9 && weight < 1040 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 1040 * 0.9 && weight < 2000 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 5.2 && L < 5.4) {
    if (weight < 700 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 700 * 0.9 && weight < 1040 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 1040 * 0.9 && weight < 2000 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 5.4 && L < 5.6) {
    if (weight < 680 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 680 * 0.9 && weight < 1040 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 1040 * 0.9 && weight < 2000 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 5.6 && L < 5.8) {
    if (weight < 650 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 650 * 0.9 && weight < 1040 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 1040 * 0.9 && weight < 2000 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 5.8 && L < 6.0) {
    if (weight < 610 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 610 * 0.9 && weight < 1040 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 1040 * 0.9 && weight < 2000 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 6.0 && L < 6.2) {
    if (weight < 570 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 570 * 0.9 && weight < 1000 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 1000 * 0.9 && weight < 2000 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 6.2 && L < 6.4) {
    if (weight < 530 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 530 * 0.9 && weight < 960 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 960 * 0.9 && weight < 2000 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 6.4 && L < 6.6) {
    if (weight < 490 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 490 * 0.9 && weight < 930 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 930 * 0.9 && weight < 2000 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 6.6 && L < 6.8) {
    if (weight < 450 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 450 * 0.9 && weight < 900 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 900 * 0.9 && weight < 2000 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 6.8 && L < 7.0) {
    if (weight < 420 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 420 * 0.9 && weight < 860 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 860 * 0.9 && weight < 1950 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 7.0 && L < 7.2) {
    if (weight < 390 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 390 * 0.9 && weight < 800 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 800 * 0.9 && weight < 1880 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 7.2 && L < 7.4) {
    if (weight < 360 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 360 * 0.9 && weight < 750 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 750 * 0.9 && weight < 1820 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  } else if (L >= 7.4 && L < 7.6) {
    if (weight < 340 * 0.9) {
      reelData = "ø5";
    } else if (weight >= 340 * 0.9 && weight < 700 * 0.9) {
      reelData = "ø6";
    } else if (weight >= 700 * 0.9 && weight < 1760 * 0.9) {
      reelData = "ø8";
    } else {
      reelData = "資料錯誤";
    }
  }
  return reelData
}

//馬力計算
const calcHorsepower = (
  weight: number
) => {
  let horsepower: string = "資料錯誤"

  if (weight <= 270) {
    horsepower = "1/4 HP";
  } else if (weight > 270 && weight <= 370) {
    horsepower = "1/3 HP";
  } else if (weight > 370 && weight <= 470) {
    horsepower = "1/2 HP";
  } else if (weight > 470 && weight <= 560) {
    horsepower = "3/4 HP";
  } else if (weight > 560 && weight <= 950) {
    horsepower = "1 HP";
  } else if (weight > 950 && weight <= 1350) {
    horsepower = "1 1/2 HP";
  } else if (weight > 1350 && weight <= 1800) {
    horsepower = "2 HP";
  } else if (weight > 1800 && weight <= 2300) {
    horsepower = "3 HP";
  } else if (weight > 2300 && weight <= 3000) {
    horsepower = "5 HP";
  } else {
    horsepower = "資料錯誤";
  }
  return horsepower
}



const calcBAndD = (
  reelData: string,
  h: number,
) => {
  let bArray: number[] = []
  let B = 0
  let D = 0

  h = h * 1000;
  if (reelData == "ø5") {
    bArray = [3.5, 4, 4.5, 5, 5.5, 6];
    if (h + 350 < 1800) {
      B = 350;
      D = 560;
    } else if (h + 450 < 2900) {
      B = 400;
      D = 600;
    } else if (h + 450 < 4100) {
      B = 450;
      D = 650;
    } else if (h + 550 < 5500) {
      B = 500;
      D = 750;
    } else if (h + 600 < 7000) {
      B = 550;
      D = 800;
    } else if (h + 600 < 9500) {
      B = 600;
      D = 900;
    }
  } else if (reelData == "ø6") {
    bArray = [3.5, 4, 4.5, 5, 5.5, 6];
    if (h + 350 < 2000) {
      B = 350;
      D = 560;
    } else if (h + 450 < 3100) {
      B = 400;
      D = 600;
    } else if (h + 450 < 4500) {
      B = 450;
      D = 650;
    } else if (h + 550 < 6000) {
      B = 500;
      D = 750;
    } else if (h + 600 < 7500) {
      B = 550;
      D = 800;
    } else if (h + 600 < 9700) {
      B = 600;
      D = 900;
    }
  } else if (reelData == "ø8") {
    bArray = [4, 4.5, 5, 5.5, 6];
    if (h + 450 < 2300) {
      B = 400;
      D = 600;
    } else if (h + 450 < 3600) {
      B = 450;
      D = 650;
    } else if (h + 550 < 5100) {
      B = 500;
      D = 750;
    } else if (h + 600 < 6700) {
      B = 550;
      D = 800;
    } else if (h + 600 < 8400) {
      B = 600;
      D = 900;
    }
  } else if (reelData == "ø10") {
    bArray = [4, 4.5, 5, 5.5, 6];
    if (h + 450 < 1300) {
      B = 400;
      D = 600;
    } else if (h + 450 < 2600) {
      B = 450;
      D = 650;
    } else if (h + 550 < 4100) {
      B = 500;
      D = 750;
    } else if (h + 600 < 5700) {
      B = 550;
      D = 800;
    } else if (h + 600 < 7400) {
      B = 600;
      D = 900;
    }
  }

  return { B, D, bArray }

}
//B D 計算









// console.log(`面積：${(L * h) / 1000}`);
// console.log(`材數：${((L * h) / 1000) * 10.89}`);
// console.log(`重量：${weight}`);
// console.log(`捲軸：${reelData}`);
// console.log(`馬力：${horsepower}`);
// console.log(`B：${B / 100}`);
// console.log(`D：${D / 100}`);
// console.log(`B的陣列：${bArray}`);







export {
  calcReel,
  calcHorsepower,
  calcBAndD,
}
















  // //捲軸計算
  // if (L < 4.0) {
  //   if (weight < 990 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 990 * 0.9 && weight < 1670 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 1670 * 0.9 && weight < 3600 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 4.0 && L < 5.2) {
  //   if (weight < 740 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 740 * 0.9 && weight < 1040 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 1040 * 0.9 && weight < 2000 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 5.2 && L < 5.4) {
  //   if (weight < 700 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 700 * 0.9 && weight < 1040 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 1040 * 0.9 && weight < 2000 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 5.4 && L < 5.6) {
  //   if (weight < 680 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 680 * 0.9 && weight < 1040 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 1040 * 0.9 && weight < 2000 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 5.6 && L < 5.8) {
  //   if (weight < 650 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 650 * 0.9 && weight < 1040 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 1040 * 0.9 && weight < 2000 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 5.8 && L < 6.0) {
  //   if (weight < 610 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 610 * 0.9 && weight < 1040 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 1040 * 0.9 && weight < 2000 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 6.0 && L < 6.2) {
  //   if (weight < 570 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 570 * 0.9 && weight < 1000 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 1000 * 0.9 && weight < 2000 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 6.2 && L < 6.4) {
  //   if (weight < 530 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 530 * 0.9 && weight < 960 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 960 * 0.9 && weight < 2000 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 6.4 && L < 6.6) {
  //   if (weight < 490 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 490 * 0.9 && weight < 930 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 930 * 0.9 && weight < 2000 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 6.6 && L < 6.8) {
  //   if (weight < 450 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 450 * 0.9 && weight < 900 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 900 * 0.9 && weight < 2000 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 6.8 && L < 7.0) {
  //   if (weight < 420 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 420 * 0.9 && weight < 860 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 860 * 0.9 && weight < 1950 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 7.0 && L < 7.2) {
  //   if (weight < 390 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 390 * 0.9 && weight < 800 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 800 * 0.9 && weight < 1880 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 7.2 && L < 7.4) {
  //   if (weight < 360 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 360 * 0.9 && weight < 750 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 750 * 0.9 && weight < 1820 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // } else if (L >= 7.4 && L < 7.6) {
  //   if (weight < 340 * 0.9) {
  //     reelData = "ø5";
  //   } else if (weight >= 340 * 0.9 && weight < 700 * 0.9) {
  //     reelData = "ø6";
  //   } else if (weight >= 700 * 0.9 && weight < 1760 * 0.9) {
  //     reelData = "ø8";
  //   } else {
  //     reelData = "資料錯誤";
  //   }
  // }

  // //馬力計算
  // if (weight <= 270) {
  //   motor = "1/4hp";
  // } else if (weight > 270 && weight <= 370) {
  //   motor = "1/3hp";
  // } else if (weight > 370 && weight <= 470) {
  //   motor = "1/2hp";
  // } else if (weight > 470 && weight <= 560) {
  //   motor = "3/4hp";
  // } else if (weight > 560 && weight <= 950) {
  //   motor = "1hp";
  // } else if (weight > 950 && weight <= 1350) {
  //   motor = "1 1/2hp";
  // } else if (weight > 1350 && weight <= 1800) {
  //   motor = "2hp";
  // } else if (weight > 1800 && weight <= 2300) {
  //   motor = "3hp";
  // } else if (weight > 2300 && weight <= 3000) {
  //   motor = "5hp";
  // } else {
  //   motor = "資料錯誤";
  // }

  // //B D 計算
  // h = h * 1000;
  // if (reelData == "ø5") {
  //   bArray = [3.5, 4, 4.5, 5, 5.5, 6];
  //   if (h + 350 < 1800) {
  //     B = 350;
  //     D = 560;
  //   } else if (h + 450 < 2900) {
  //     B = 400;
  //     D = 600;
  //   } else if (h + 450 < 4100) {
  //     B = 450;
  //     D = 650;
  //   } else if (h + 550 < 5500) {
  //     B = 500;
  //     D = 750;
  //   } else if (h + 600 < 7000) {
  //     B = 550;
  //     D = 800;
  //   } else if (h + 600 < 9500) {
  //     B = 600;
  //     D = 900;
  //   }
  // } else if (reelData == "ø6") {
  //   bArray = [3.5, 4, 4.5, 5, 5.5, 6];

  //   if (h + 350 < 2000) {
  //     B = 350;
  //     D = 560;
  //   } else if (h + 450 < 3100) {
  //     B = 400;
  //     D = 600;
  //   } else if (h + 450 < 4500) {
  //     B = 450;
  //     D = 650;
  //   } else if (h + 550 < 6000) {
  //     B = 500;
  //     D = 750;
  //   } else if (h + 600 < 7500) {
  //     B = 550;
  //     D = 800;
  //   } else if (h + 600 < 9700) {
  //     B = 600;
  //     D = 900;
  //   }
  // } else if (reelData == "ø8") {
  //   bArray = [4, 4.5, 5, 5.5, 6];

  //   if (h + 450 < 2300) {
  //     B = 400;
  //     D = 600;
  //   } else if (h + 450 < 3600) {
  //     B = 450;
  //     D = 650;
  //   } else if (h + 550 < 5100) {
  //     B = 500;
  //     D = 750;
  //   } else if (h + 600 < 6700) {
  //     B = 550;
  //     D = 800;
  //   } else if (h + 600 < 8400) {
  //     B = 600;
  //     D = 900;
  //   }
  // } else if (reelData == "ø10") {
  //   bArray = [4, 4.5, 5, 5.5, 6];

  //   if (h + 450 < 1300) {
  //     B = 400;
  //     D = 600;
  //   } else if (h + 450 < 2600) {
  //     B = 450;
  //     D = 650;
  //   } else if (h + 550 < 4100) {
  //     B = 500;
  //     D = 750;
  //   } else if (h + 600 < 5700) {
  //     B = 550;
  //     D = 800;
  //   } else if (h + 600 < 7400) {
  //     B = 600;
  //     D = 900;
  //   }
  // }



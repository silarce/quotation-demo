export default function changeNumberMoneyToChinese(money: string | number) {
  // 接收數字或者字串數字
  if (typeof money === 'string') {
    if (money === '') {
      return '';
    }

    if (isNaN(parseFloat(money))) {
      throw Error(`引數有誤：${money}，請輸入數字或字串數字`);
    } else {
      // 去掉分隔符(,)
      money = money.replace(/,/g, '');
    }
  } else if (typeof money === 'number') {
    // 去掉分隔符(,)
    money = money.toString().replace(/,/g, '');
  } else {
    throw Error(`引數有誤：${money}，請輸入數字或字串數字`);
  }

  // 漢字的數字
  const cnNums = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
  // 基本單位
  const cnIntRadice = ['', '拾', '佰', '仟'];
  // 對應整數部分擴充套件單位
  const cnIntUnits = ['', '萬', '億', '兆'];
  // 對應小數部分單位
  const cnDecUnits = ['角', '分', '毫', '釐'];
  // 整數金額時後面跟的字元
  const cnInteger = '整';
  // 整型完以後的單位
  const cnIntLast = '元';
  // 金額整數部分
  let IntegerNum;
  // 金額小數部分
  let DecimalNum;
  // 輸出的中文金額字串
  let ChineseStr = '';
  // 正負值標記
  let Symbol = '';
  // 轉成浮點數
  money = parseFloat(money);

  // 如果是0直接返回結果
  // if (money === 0) {
  //   ChineseStr = cnNums[0] + cnIntLast + cnInteger
  //   return ChineseStr
  // }
  // 如果小於0，則將Symbol標記為負，並轉為正數
  if (money < 0) {
    money = -money;
    Symbol = '負 ';
  }

  // 轉換為字串
  money = money.toString();

  // 將整數部分和小數部分分別存入IntegerNum和DecimalNum
  if (money.indexOf('.') === -1) {
    IntegerNum = money;
    DecimalNum = '';
  } else {
    const moneyArr = money.split('.');
    IntegerNum = moneyArr[0];
    DecimalNum = moneyArr[1].substr(0, 4);
  }

  // 獲取整型部分轉換
  if (parseInt(IntegerNum, 10) > 0) {
    let zeroCount = 0;
    const IntLen = IntegerNum.length;

    for (let i = 0; i < IntLen; i++) {
      // 獲取整數的每一項
      const term = IntegerNum.substr(i, 1);
      // 剩餘待處理的數量
      const surplus = IntLen - i - 1;
      // 用於獲取整數部分的擴充套件單位
      // 剩餘數量除以4，比如12345，term為1時，expandUnit則為1，
      // cnIntUnits[expandUnit]對應得到的單位為萬
      const expandUnit = surplus / 4;
      // 用於獲取整數部分的基本單位
      // 剩餘數量取餘4，比如123，那麼第一遍遍歷term為1，surplus為2，baseUnit則為2，
      // 所以cnIntRadice[baseUnit]對應得到的基本單位為'佰'
      const baseUnit = surplus % 4;

      if (term === '0') {
        zeroCount++;
      } else {
        // 連續存在多個0的時候需要補'零'
        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }

        // 歸零
        zeroCount = 0;
        /* 
        cnNums是漢字的零到玖組成的陣列，term則是阿拉伯0-9，
        直接將阿拉伯數字作為下標獲取中文數字
        例如term是0則cnNums[parseInt(term)]取的就是'零'，9取的就是'玖'
        最後加上單位就轉換成功了！
        這裡只加十百千的單位
        */
        ChineseStr += cnNums[parseInt(term)] + cnIntRadice[baseUnit];
      }

      /*
        如果baseUnit為0，意味著當前項和下一項隔了一個節權位即隔了一個逗號
        擴充套件單位只有大單位進階才需要，判斷是否大單位進階，則通過zeroCount判斷
        baseUnit === 0即存在逗號，baseUnit === 0 && zeroCount < 4 意為大單位進階
      */
      if (baseUnit === 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[expandUnit];
      }
    }
    // ChineseStr += cnIntLast
  }

  // 小數部分轉換
  if (DecimalNum !== '') {
    const decLen = DecimalNum.length;

    for (let i = 0; i < decLen; i++) {
      // 同理，參考整數部分
      const term = DecimalNum.substr(i, 1);

      if (term !== '0') {
        ChineseStr += cnNums[Number(term)] + cnDecUnits[i];
      }
    }
  }

  ChineseStr = Symbol + ChineseStr;

  return ChineseStr;
}

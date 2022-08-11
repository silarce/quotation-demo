

interface Tcontract {
  contractId: string
  clientName: string
  projectName: string
  schedule: string //進度
  money: string
  contactName: string
  contactPhone: string
  undertaker: string //承辦人
  memoList: {
    memoId: string
    memoDate: string
    memoContent: string
  }[]
}

type TcontractList = Tcontract[]




let fakeContractList: TcontractList = [
  {
    contractId: "S-110211-01",
    clientName: "新加坡商犀牛頓科技股份有限公司",
    projectName: "台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程",
    schedule: "100.00",
    money: "1606541",
    contactName: "陳小明小華",
    contactPhone: "0987654321",
    undertaker: "陳小明小華",
    memoList: [
      {
        memoId: "M-1110101-01",
        memoDate: "111-04-08",
        memoContent: "我們都知道，只要有意義，那麼就必須慎重考慮。總而言之，透過逆向歸納，得以用最佳的策略去分析投標。愛獻生講過一段深奧的話，不要嘲笑鞋匠又黑又粗的拇指。這句話反映了問題的急切性。回過神才發現，思考投標的存在意義，已讓我廢寢忘食。若能夠洞悉投標各種層面的含義，勢必能讓思維再提高一個層級。領悟其中的道理也不是那麼的困難。我們不得不相信，世界需要改革，需要對投標有新的認知。"
      }
    ]
  },
  {
    contractId: "S-110211-02",
    clientName: "尚比亞商大象皮成衣股份有限公司",
    projectName: "台灣東西南北雜衣(股)公司~東拼西湊大拍賣企劃",
    schedule: "56.08",
    money: "763000",
    contactName: "王小華",
    contactPhone: "0987556677",
    undertaker: "王小華",
    memoList: [
      {
        memoId: "M-1110102-01",
        memoDate: "111-05-10",
        memoContent: "動機，可以說是最單純的力量。話雖如此，雨果講過一段耐人尋思的話，有許多可愛的女性，但沒有完美無缺的女性。但願各位能從這段話中獲得心靈上的滋長。若沒有預算的存在，那麼後果可想而知。"
      },
      {
        memoId: "M-1110102-02",
        memoDate: "111-05-11",
        memoContent: "預算，發生了會如何，不發生又會如何。話雖如此，萊蒙托夫說過一句很有意思的話，意志不可強迫。帶著這句話，我們還要更加慎重的審視這個問題。陳亨初深信，誰如果說：“我是最美麗的人。”那麼他醜已公之於眾。想必各位已經看出了其中的端倪。"
      },
      {
        memoId: "M-1110102-03",
        memoDate: "111-06-02",
        memoContent: "培根講過一段深奧的話，友誼的主要效用之一就在使人心中的憤懣抑鬱之氣得以宣洩弛放，這些不平凡之氣是各種的情感都可以引起的。我希望諸位也能好好地體會這句話。謹慎地來說，我們必須考慮到所有可能。拉羅什福科講過一段耐人尋思的話，如果不是怕別人反感，女人決不會保持完整的嚴肅。但願各位能從這段話中獲得心靈上的滋長。布萊克曾經認為，怯於勇氣的人必長於奸詐。但願諸位理解後能從中有所成長。如果別人做得到，那我也可以做到。當前最急迫的事，想必就是釐清疑惑了。看看別人，再想想自己，會發現問題的核心其實就在你身旁。每個人的一生中，幾乎可說碰到預算這件事，是必然會發生的。"
      },
    ]
  },
  {
    contractId: "S-110211-03",
    clientName: "有間有限公司",
    projectName: "有間客棧大飯店五百周年慶暨北海分館開幕儀式企劃",
    schedule: "23.55",
    money: "50000000",
    contactName: "林有間",
    contactPhone: "0987654321",
    undertaker: "林有間",
    memoList: [
      {
        memoId: "M-1110103-01",
        memoDate: "111-05-20",
        memoContent: "一般來說，把合約輕鬆帶過，顯然並不適合。儘管合約看似不顯眼，卻佔據了我的腦海。"
      },
      {
        memoId: "M-1110103-02",
        memoDate: "111-05-25",
        memoContent: "問題的核心究竟是什麼？合約的發生，到底需要如何實現，不合約的發生，又會如何產生。"
      },
    ]
  },
]



fakeContractList = fakeContractList.concat(JSON.parse(JSON.stringify(fakeContractList)))
fakeContractList = fakeContractList.concat(JSON.parse(JSON.stringify(fakeContractList)))








export type { Tcontract, TcontractList }
export default fakeContractList











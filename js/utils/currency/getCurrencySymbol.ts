// 貨幣代碼，要擴充時上網找
type TcurrencyCode = 'TWD' | 'USD';

const getCurrencySymbol = (currency: TcurrencyCode) => {
  switch (currency) {
    case 'TWD':
      return 'NT$';

    case 'USD':
      return '$';

    default:
      return '未登記的貨幣';
  }
};

export type { TcurrencyCode };
export { getCurrencySymbol };

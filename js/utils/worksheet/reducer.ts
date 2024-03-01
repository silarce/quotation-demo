import _ from 'lodash';

// type
import { TworkSheetDto, TquotationProductItemDto } from 'js/api/dtoTypes';

type TitemTokenList = {
  [key: string]: {
    originalItem: TquotationProductItemDto;
    [key: string]: TquotationProductItemDto;
  };
};

type TitemIdArrList = { [key: string]: { [key: string]: string[] } };

export type { TworkSheetDto, TquotationProductItemDto, TitemTokenList, TitemIdArrList };

// =============================================================
const workSheetReducer = ({ worksheet }: { worksheet: TworkSheetDto }) => {
  const contractProductItems = _.sortBy(worksheet.contractProductItems, 'createdAt');

  const itemTokenList: TitemTokenList = {};
  const itemIdArrList: TitemIdArrList = {};

  contractProductItems.forEach((item) => {
    const { productId, adjustedItem, adjustedItemId } = item;

    let theItem: typeof item;
    let theId: string;

    if (adjustedItem && adjustedItemId) {
      theItem = adjustedItem;
      theItem.adjustedItemId = adjustedItemId;
      theId = adjustedItemId;
    } else {
      theItem = item;
      theId = productId;
    }

    if (!itemTokenList[productId]) {
      itemTokenList[productId] = {
        originalItem: item,
        [productId]: item, //itemTokenList[productId][productId] 為原始資料
      };
    }

    itemTokenList[productId][theId] = theItem;

    //
    if (!itemIdArrList[productId]) {
      itemIdArrList[productId] = {
        [productId]: [], //itemIdArrList[productId][productId] 為原始資料代表的itemId陣列
      };
    }

    if (!itemIdArrList[productId][theId]) {
      itemIdArrList[productId][theId] = [];
    }

    itemIdArrList[productId][theId].push(item.id);

    //
  }); //  forEach close

  return {
    // 分堆好的item
    itemTokenList,
    // 分堆好的itemId
    itemIdArrList,
  };

  //
  //
  //
}; // workSheetReducer

export { workSheetReducer };

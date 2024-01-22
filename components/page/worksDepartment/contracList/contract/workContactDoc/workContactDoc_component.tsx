import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/router';
import _ from 'lodash';
import classNames from 'classnames';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// components

import Profile, {
  Tcontroll as Tcontroll_profile,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/profile';
import TextListEditor_v2, {
  TstringObj as Tcontroll_textListEditor,
} from 'components/page/domestic/quotation/quotationTotal/TextListEditor_v2';
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';

// api
import { TquotationProductDto, TquotationContractDto } from 'js/api/api_quotation';
import { useGetEngineeringContact } from 'js/api/api_engineering';

// hook
import { useProductList } from 'hooks/quotation/useProduct';

// =======================================================================

export default function WorkContactDoc_component({
  contract,
  engineeringContactId,
}: {
  contract: TquotationContractDto | undefined;
  engineeringContactId: string | undefined | null;
}) {
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  useEffect(() => {
    (async () => {
      try {
        await update_engineeringContact();
      } catch (error) {
        myAlert.err({ title: '取得工程聯絡單失敗', content: '請確認該合約是否已產生工程聯絡單' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineeringContactId]);

  // --------------------------------------------------------------

  const {
    paymentStatus,
    projectName,
    projectContent,
    zipCode,
    county,
    district,
    address,
    projectPrincipal,
    constructionSitePrincipalContactNumber,
    constructionSiteFaxNumber,
    constructionSiteContactNumber,
    projectNumber,
    contractor,
    contractorPrincipal,
    contractorContactNumber,
    contractorFaxNumber,

    annotations,
    contactInfo,
  } = engineeringContact ?? {};

  const contactPersonsArr: Tcontroll_profile['contactPersons']['arr'] = (contactInfo ?? []).map((item, index) => {
    return {
      contactPerson: {
        value: item.contactPerson,
      },
      contactPhone: {
        value: item.contactNumber,
      },
      onDelClick: () => {},
    };
  });

  const controll: Tcontroll_profile = {
    /**請款狀態 */
    paymentStatus: {
      value: paymentStatus ?? '',
    },
    projectName: {
      value: projectName ?? '',
    },
    /**工程內容 */
    projectContent: {
      value: projectContent ?? '',
    },

    projectPattern: {
      onCaptionClick: () => {
        alert('施工中。工程師筆記，要把工程聯絡單做成元件');
      },
      statusArr: [],
    },

    addressBarProps: {
      inputSelProps: {
        caption: '工程地點',
      },
      addressProps: {
        zipCode: {
          props: {
            value: zipCode ?? '',
          },
        },
        county: {
          props: {
            isDisabled: true,
            value: county ? { value: county, label: county } : null,
          },
        },
        district: {
          easyValue: district ?? null,
          props: {
            isDisabled: true,
            value: district ? { value: district, label: district } : null,
          },
        },
        address: {
          props: {
            disabled: true,
            value: address ?? '',
          },
        },
      },
    },
    //
    /**工程負責人 */
    projectPerson: {
      value: projectPrincipal ?? '',
    },
    /**工程負責人聯絡電話 */
    projectPersonNumber: {
      value: constructionSitePrincipalContactNumber ?? '',
    },
    projectFaxNumber: {
      value: constructionSiteFaxNumber ?? '',

      // disabled: true,
    },
    /**工地電話 */
    projectNumber: {
      value: constructionSiteContactNumber ?? '',
    },
    //
    //
    //
    /**工程編號 */
    engineeringNumber: {
      value: projectNumber ?? '',

      // disabled: true,
    },
    /**承包商 */
    contractor: {
      value: contractor ?? '',

      // disabled: true,
    },
    /**負責人 */
    principal: {
      value: contractorPrincipal ?? '',

      // disabled: true,
    },
    /**公司電話 */
    contactNumber: {
      value: contractorContactNumber ?? '',

      // disabled: true,
    },
    faxNumber: {
      value: contractorFaxNumber ?? '',
    },
    //
    contactPersons: {
      onAddClick: () => {},
      arr: contactPersonsArr,
    },
  };

  // --------------------------------------------------------------

  const { productArr, latestQuotationDiscount } = useMemo(() => {
    const list: { [key: string]: TquotationProductDto } = {};

    const subContractArr = contract?.subContracts ?? [];
    const orderedSubContracts = _.sortBy(subContractArr, 'version');

    orderedSubContracts.forEach((contract) => {
      const prodArr = contract.content.products;

      prodArr.forEach((prod) => {
        list[prod.rootProductId] = prod;
      });
    });

    const productArr = Object.values(list);
    const latestSubContract: TquotationContractDto | undefined = orderedSubContracts[orderedSubContracts.length - 1];

    const latestQuotationDiscount = latestSubContract?.content?.discount || '100';

    return { productArr, latestQuotationDiscount };
  }, [contract]);

  const {
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    changeProdKeyArr,
  } = useProductList({
    productArr: productArr,
    others: [],
    resetTrigger: productArr,
    quotationDiscount: Number(latestQuotationDiscount) || 100,
  });

  // --------------------------------------------------------------
  const control_anno: Tcontroll_textListEditor = {
    stringArr: annotations ?? [],
    editString: () => {},
    delString: () => {},
    addString: () => {},
    showSelector: () => {},
  };

  // --------------------------------------------------------------
  return (
    <div>
      <Profile controll={controll} disabled={true} />

      <Table_prod
        disabled={true}
        prodList={productList}
        prodCellConfig={prodCellConfig}
        // prodKeyArr={filteredProdKeyArr}
        prodKeyArr={prodKeyArr}
        changeProdKeyArr={changeProdKeyArr}
        addProd={() => {}}
        setTargetProd={() => {}}
        // panelBox="easyBox"
        panelBox="emptyBox"
        emptyBlockWidth="40px"
        rowHeight="h60"
        isShowDndBtn={false}
      />

      <div className={'mr-[50px] ml-[50px] mt-[40px] mb-[15px]'}>
        <TextListEditor_v2 label={'備註'} disabled={true} stringObj={control_anno} />
      </div>
    </div>
  );
}

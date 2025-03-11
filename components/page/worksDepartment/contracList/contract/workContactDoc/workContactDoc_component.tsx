// 工程聯絡單
// 工程聯絡單
// 工程聯絡單

import { useEffect, useState, useMemo, useImperativeHandle, forwardRef, useContext } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import classNames from 'classnames';

// component
import Profile, {
  Tcontroll as Tcontroll_profile,
  TprojectPatternStatus,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/profile';
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
import Table_others from 'components/page/domestic/quotation/quotation/product/table_others';
import ProjectPattern, {
  ThasPattern,
  TpatternReviewProcessGroup,
  TpatternReviewProcess,
  TpatternReviewStatus,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/projectPattern';
import PdfModal from './pdfModal_workContactDoc';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import WorkSheetSelector from 'components/global/gear/modal/workSheetSelector';
import TextListEditor_v2, {
  TstringObj as Tcontroll_textListEditor,
} from 'components/page/domestic/quotation/quotationTotal/TextListEditor_v2';

// api
import {
  TengineeringContactDto,
  TupdateEngineeringContactDto,
  TengineeringContactAttachmentType,
  useGetEngineeringContact,
  apiPatchEngineeringContact,
} from 'js/api/api_engineering';

import { TquotationProductDto, TquotationContractDto } from 'js/api/api_quotation';

// hook
import { useProductList } from 'hooks/quotation/useProduct';

// css
import scss from './workContactDoc.module.scss';

// type
import { TgetAnnotation } from 'js/api/api_workSheet';

import { doorModelDict } from 'js/utils/options/productOptions';

// ============================================================================
type Tquery = {
  contractId: string;
};

type Tprofile = {
  paymentStatus: string;
  projectName: string;
  projectContent: string;
  zipCode: string;
  county: string;
  district: string;
  address: string;
  projectPrincipal: string;
  constructionSitePrincipalContactNumber: string;
  constructionSiteFaxNumber: string;
  constructionSiteContactNumber: string;
  projectNumber: string;
  contractor: string;
  contractorPrincipal: string;
  contractorContactNumber: string;
  contractorFaxNumber: string;
};

type TonStateChange = (props: {
  disabled: boolean;
  isLoading: boolean;
  isShowPattern: boolean;
  contractNumber: string;
}) => void;

type TimperativeHandle = {
  reqPatch: () => Promise<void>;
  closePattern: () => void;
  setDisabled: (state: boolean) => void;
  openPdf: () => void;
};

type TshouldPatternList = {
  [key in TengineeringContactAttachmentType]: boolean;
};

export type { TimperativeHandle, TonStateChange };

// ============================================================================

const WorkContactDoc_component = forwardRef(PreWorkContactDoc_component);

// MARK:START

function PreWorkContactDoc_component(
  {
    contract,
    engineeringContactId,
    onStateChange,
    isOnlyControlContactInfo = false,
  }: {
    contract: TquotationContractDto | undefined;
    engineeringContactId: string | undefined | null;
    onStateChange: TonStateChange;
    isOnlyControlContactInfo?: boolean;
  },
  ref: React.ForwardedRef<unknown>
) {
  // ---------------------------------------------------------------------------

  const router = useRouter();
  const { contractId } = router.query as Tquery;

  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [showAnnoSelector, setShowAnnoSelector] = useState(false);
  const [isShowPattern, setIsShowPattern] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  const showPattern = () => {
    setDisabled(true);
    setIsShowPattern(true);
  };

  useImperativeHandle(
    ref,
    (): TimperativeHandle => ({
      reqPatch,
      closePattern: () => setIsShowPattern(false),
      setDisabled,
      openPdf: () => setPdfModalVisible(true),
    })
  );

  // ---------------------------------------------------------------------------

  /**data裡只會有一筆資料 */
  const { data: engineeringContact, update: update_engineeringContact } =
    useGetEngineeringContact(engineeringContactId);

  // ---------------------------------------------------------------------------

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

  const productArr_forPdf = useMemo(() => {
    doorModelDict;
    const arr = productArr.map((prod) => {
      const doorModelInfo = doorModelDict[prod.doorModelName as keyof typeof doorModelDict] as
        | (typeof doorModelDict)[keyof typeof doorModelDict]
        | undefined;

      let doorModelName = '';

      if (doorModelInfo) {
        doorModelName = doorModelInfo.value + '\n' + doorModelInfo.name;
      }

      return {
        ...prod,
        doorModelName,
      } as typeof prod;
    });

    return arr;
  }, [productArr]);

  const {
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    changeProdKeyArr,
    //
    othersKeyArr,
    othersList,
    othersCellConfig,
  } = useProductList({
    productArr: productArr,
    others: contract?.content.others ?? [],
    averageDiscount: null,
    resetTrigger: productArr,
    quotationDiscount: Number(latestQuotationDiscount) || 100,
    discount_fromData: Number(latestQuotationDiscount) || 100,
  });

  // ---------------------------------------------------------------------------

  const { profile, setProfile, profileChange } = useProfile();
  const { contactArr, setContactArr, onAddClick } = useContactArr();
  const { annoArr, setAnnoArr, onConfirm_anno } = useAnnoArr();
  const { shouldHasPattern, setShouldHasPattern, hasPattern, setHasPattern, onPatternChange, editShouldHasPattern } =
    useHasPattern();

  // ----------------------------------------------------------------------------
  // region API

  const reqPatch = async () => {
    if (!profile || !engineeringContact) {
      return;
    }

    const body: TupdateEngineeringContactDto = {
      ...profile,
      annotations: annoArr,
      contactInfo: contactArr,

      shouldHasColor: shouldHasPattern.color,
      shouldHasConstruction: shouldHasPattern.construction,
      shouldHasDetail: shouldHasPattern.detail,
      shouldHasFloor: shouldHasPattern.floor,
      shouldHasDesign: shouldHasPattern.design,
    };

    try {
      setIsLoading(true);
      await apiPatchEngineeringContact(engineeringContact.id, body);
      await update_engineeringContact();
      setDisabled(true);
    } catch (error) {
      myAlert.err({ title: '更新工程聯絡單失敗' });
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------------------
  // region FUNCTION

  const reset = () => {
    if (!engineeringContact) {
      return;
    }

    const {
      annotations,
      //
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
      contactInfo,
    } = engineeringContact;

    if (annotations) {
      setAnnoArr(annotations);
    }

    if (contactInfo) {
      setContactArr(contactInfo);
    }

    setProfile({
      paymentStatus,
      projectName,
      projectContent,
      zipCode: zipCode ?? '',
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
    });
  };

  // ----------------------------------------------------------------------------

  // region PROPS

  const control_anno: Tcontroll_textListEditor = {
    stringArr: annoArr,
    editString: (index, v) => {
      setAnnoArr((arr) => {
        const newAnnoArr = [...arr];
        newAnnoArr[index] = v;

        return newAnnoArr;
      });
    },
    delString: (index) => {
      setAnnoArr((arr) => {
        const newAnnoArr = [...arr];
        newAnnoArr.splice(index, 1);

        return newAnnoArr;
      });
    },
    addString: (v) => {
      setAnnoArr((arr) => {
        const newAnnoArr = [...arr];
        newAnnoArr.push(v);

        return newAnnoArr;
      });
    },
    showSelector: () => setShowAnnoSelector(true),
  };

  const contactPersonsArr: Tcontroll_profile['contactPersons']['arr'] = contactArr.map((item, index) => {
    return {
      contactPerson: {
        value: item.contactPerson,
        onChange: (v) => {
          setContactArr((arr) => {
            const newArr = [...arr];
            newArr[index].contactPerson = v;

            return newArr;
          });
        },
      },
      contactPhone: {
        value: item.contactNumber,
        onChange: (v) => {
          setContactArr((arr) => {
            const newArr = [...arr];
            newArr[index].contactNumber = v;

            return newArr;
          });
        },
      },
      onDelClick: () => {
        setContactArr((arr) => {
          const newArr = [...arr];
          newArr.splice(index, 1);

          return newArr;
        });
      },
    };
  });

  const controll: Tcontroll_profile = {
    /**請款狀態 */
    paymentStatus: {
      value: profile?.paymentStatus ?? '',
      onChange: (v) => {
        profileChange('paymentStatus', v);
      },
      disabled: isOnlyControlContactInfo,
    },
    projectName: {
      value: profile?.projectName ?? '',
      onChange: (v) => {
        profileChange('projectName', v);
      },
      disabled: isOnlyControlContactInfo,
    },
    /**工程內容 */
    projectContent: {
      value: profile?.projectContent ?? '',
      onChange: (v) => {
        profileChange('projectContent', v);
      },
      disabled: isOnlyControlContactInfo,
    },
    // 工程圖表
    projectPattern: {
      disabled: isOnlyControlContactInfo,
      onCaptionClick: showPattern,
      statusArr: [
        {
          label: '簽認圖',
          haveData: hasPattern.hasDetail,
          shouldHaveData: shouldHasPattern.detail,
          onCheck: (bool) => {
            editShouldHasPattern(bool, 'detail');
          },
          reviewStatus: checkStatus({
            review_status: engineeringContact?.detailStatus,
          }),
        },
        {
          label: '平面圖',
          haveData: hasPattern.hasFloor,
          shouldHaveData: shouldHasPattern.floor,
          onCheck: (bool) => {
            editShouldHasPattern(bool, 'floor');
          },
          reviewStatus: checkStatus({
            review_status: engineeringContact?.floorStatus,
          }),
        },
        {
          label: '設計圖',
          haveData: hasPattern.hasDesign,
          shouldHaveData: shouldHasPattern.design,
          onCheck: (bool) => {
            editShouldHasPattern(bool, 'design');
          },
          reviewStatus: checkStatus({
            review_status: engineeringContact?.designStatus,
          }),
        },
        {
          label: '施工圖',
          haveData: hasPattern.hasConstruction,
          shouldHaveData: shouldHasPattern.construction,
          onCheck: (bool) => {
            editShouldHasPattern(bool, 'construction');
          },
          reviewStatus: checkStatus({
            review_status: engineeringContact?.constructionStatus,
          }),
        },
        {
          label: '色卡',
          haveData: hasPattern.hasColor,
          shouldHaveData: shouldHasPattern.color,
          onCheck: (bool) => {
            editShouldHasPattern(bool, 'color');
          },
          reviewStatus: checkStatus({
            review_status: engineeringContact?.colorStatus,
          }),
        },
      ],
    },
    addressBarProps: {
      inputSelProps: {
        caption: '工程地點',
        disabled: isOnlyControlContactInfo,
      },
      addressProps: {
        zipCode: {
          props: {
            value: profile?.zipCode ?? '',
          },
        },
        county: {
          props: {
            isDisabled: disabled || isOnlyControlContactInfo,
            value: profile?.county ? { value: profile.county, label: profile.county } : null,
            onChange: (option) => {
              const value = option ? option.value : '';
              profileChange('county', value);
              profileChange('district', '');
              profileChange('zipCode', '');
            },
          },
        },
        district: {
          easyValue: profile?.district ?? null,
          props: {
            isDisabled: disabled || isOnlyControlContactInfo,
            value: profile?.district ? { value: profile.district, label: profile.district } : null,
            onChange: (option) => {
              if (!option) {
                return;
              }

              const value = option ? option.value : '';
              profileChange('district', value);
              profileChange('zipCode', option.zipCode ?? '');
            },
          },
        },
        address: {
          props: {
            disabled: disabled || isOnlyControlContactInfo,
            value: profile?.address ?? '',
            onChange: (e) => {
              profileChange('address', e.target.value);
            },
          },
        },
      },
    },
    //
    /**工程負責人 */
    projectPerson: {
      value: profile?.projectPrincipal ?? '',
      onChange: (v) => {
        profileChange('projectPrincipal', v);
      },
      disabled: isOnlyControlContactInfo,
    },
    /**工程負責人聯絡電話 */
    projectPersonNumber: {
      value: profile?.constructionSitePrincipalContactNumber ?? '',
      onChange: (v) => {
        profileChange('constructionSitePrincipalContactNumber', v);
      },
      disabled: isOnlyControlContactInfo,
    },
    projectFaxNumber: {
      value: profile?.constructionSiteFaxNumber ?? '',
      onChange: (v) => {
        profileChange('constructionSiteFaxNumber', v);
      },
      disabled: isOnlyControlContactInfo,
    },
    /**工地電話 */
    projectNumber: {
      value: profile?.constructionSiteContactNumber ?? '',
      onChange: (v) => {
        profileChange('constructionSiteContactNumber', v);
      },
      disabled: isOnlyControlContactInfo,
    },

    //
    //
    /**工程編號 */
    engineeringNumber: {
      value: profile?.projectNumber ?? '',
      onChange: (v) => {
        profileChange('projectNumber', v);
      },
      disabled: isOnlyControlContactInfo,
    },
    /**承包商 */
    contractor: {
      value: profile?.contractor ?? '',
      onChange: (v) => {
        profileChange('contractor', v);
      },
      disabled: isOnlyControlContactInfo,
    },
    /**負責人 */
    principal: {
      value: profile?.contractorPrincipal ?? '',
      onChange: (v) => {
        profileChange('contractorPrincipal', v);
      },
      disabled: isOnlyControlContactInfo,
    },
    /**公司電話 */
    contactNumber: {
      value: profile?.contractorContactNumber ?? '',
      onChange: (v) => {
        profileChange('contractorContactNumber', v);
      },
      disabled: isOnlyControlContactInfo,
    },
    faxNumber: {
      value: profile?.contractorFaxNumber ?? '',
      onChange: (v) => {
        profileChange('contractorFaxNumber', v);
      },
      disabled: isOnlyControlContactInfo,
    },
    //
    contactPersons: {
      onAddClick,
      arr: contactPersonsArr,
    },
  };

  // 把金額隱藏
  const filteredProdKeyArr = prodKeyArr.filter((key) => {
    if (key === 'price' || key === 'dualPrice' || key === 'unitPrice' || key === 'totalPrice') {
      return false;
    }

    return true;
  });

  const filteredOthersKeyArr = othersKeyArr.filter((key) => {
    if (key === 'unitPrice_locale' || key === 'totalPrice_locale') {
      return false;
    }

    return true;
  });

  // ----------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    onStateChange &&
      onStateChange({
        disabled,
        isLoading,
        isShowPattern,
        contractNumber: engineeringContact?.contractNumber ?? '',
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, isLoading, isShowPattern, engineeringContact?.contractNumber]);

  useEffect(() => {
    (async () => {
      try {
        await update_engineeringContact();
      } catch (error) {
        myAlert.err({ title: '取得工程聯絡單失敗', content: '請確認該合約是否已產生工程聯絡單' });
      }
    })();
  }, [contractId, engineeringContactId]);

  useEffect(() => {
    const { shouldHasColor, shouldHasConstruction, shouldHasDetail, shouldHasFloor, shouldHasDesign } =
      engineeringContact ?? {};

    setShouldHasPattern({
      floor: shouldHasFloor ?? false,
      detail: shouldHasDetail ?? false,
      color: shouldHasColor ?? false,
      construction: shouldHasConstruction ?? false,
      design: shouldHasDesign ?? false,
    });
  }, [engineeringContact]);

  useEffect(() => {
    if (!engineeringContact) {
      return;
    }

    reset();
  }, [engineeringContact]);

  useEffect(() => {
    if (disabled) {
      reset();
    }
  }, [disabled]);

  // ----------------------------------------------------------------------------

  // MARK:RENDER

  return (
    <div>
      <PdfModal
        visible={pdfModalVisible}
        onCancel={() => setPdfModalVisible(false)}
        engineeringContact={engineeringContact}
        productArr={productArr_forPdf}
        hasPattern={hasPattern}
      />

      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      <div>
        {/* 工程聯絡單 */}
        <div className={classNames(isShowPattern && 'hidden', 'px-12')}>
          <Profile controll={controll} disabled={disabled} />
          {/* <WorkProject /> */}

          <Table_prod
            disabled={true}
            prodList={productList}
            prodCellConfig={prodCellConfig}
            prodKeyArr={filteredProdKeyArr}
            changeProdKeyArr={changeProdKeyArr}
            addProd={() => {}}
            setTargetProd={() => {}}
            // panelBox="easyBox"
            panelBox="emptyBox"
            emptyBlockWidth="40px"
            rowHeight="h60"
            isShowDndBtn={false}
            discountRate={''} // 報價單總折數
            changeDiscountRate={(v) => {}}
            hiddenQtyZero={true}
          />
          <Table_others
            disabled={disabled}
            list={othersList}
            cellConfig={othersCellConfig}
            keyArr={filteredOthersKeyArr}
            changeKeyArr={() => {}}
            add={() => {}}
            isShowDndBtn={false}
            isDisplayInPage="worksDepartment"
          />
          {/* <Remark /> */}
          <div className={scss.textListContainer}>
            <TextListEditor_v2
              label={'備註'}
              disabled={disabled || isOnlyControlContactInfo}
              stringObj={control_anno}
            />
          </div>
        </div>
        {/* 工程圖表資料 */}
        <div className={classNames(!isShowPattern && 'hidden')}>
          <ProjectPattern
            engineeringContactId={engineeringContactId}
            onPatternChange={onPatternChange}
            onSubmitSuccess={update_engineeringContact}
            onReviewSuccess={update_engineeringContact}
            onDeleteSuccess={update_engineeringContact}
            shouldHasPattern={{
              shouldHasColor: !!engineeringContact?.shouldHasColor,
              shouldHasConstruction: !!engineeringContact?.shouldHasConstruction,
              shouldHasDetail: !!engineeringContact?.shouldHasDetail,
              shouldHasFloor: !!engineeringContact?.shouldHasFloor,
              shouldHasDesign: !!engineeringContact?.shouldHasDesign,
            }}
          />
        </div>
      </div>

      <WorkSheetSelector
        label="備註"
        tip="可複選、可不選(按確定即可)"
        showModal={showAnnoSelector}
        onConfirm={(vArr) => onConfirm_anno(vArr)}
        onCancel={() => setShowAnnoSelector(false)}
        apiFamily="annotation"
      />
    </div>
  );
}

// MARK: END

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

const checkStatus = ({
  review_status,
}: {
  review_status:
    | TengineeringContactDto['detailStatus']
    | TengineeringContactDto['floorStatus']
    | TengineeringContactDto['designStatus']
    | TengineeringContactDto['constructionStatus']
    | TengineeringContactDto['colorStatus']
    | undefined
    | null;
}) => {
  let dotColor: TprojectPatternStatus['reviewStatus']['dotColor'] = 'gray';

  review_status === '審核中' && (dotColor = 'red');
  review_status === '已核准' && (dotColor = 'green');

  return {
    label: review_status || '編輯中',
    dotColor,
  };
};

// ================================================================================

// region HOOK

const useProfile = () => {
  const [profile, setProfile] = useState<Tprofile>();

  const profileChange = (key: keyof Tprofile, v: string) => {
    setProfile((profile) => {
      if (!profile) {
        return;
      }

      const newProfile = { ...profile };
      newProfile[key] = v;

      return newProfile;
    });
  };

  return {
    profile,
    setProfile,
    profileChange,
  };
};

const useContactArr = () => {
  const [contactArr, setContactArr] = useState<{ contactPerson: string; contactNumber: string }[]>([]);

  const onAddClick = () => {
    setContactArr((arr) => {
      const newArr = [...arr];
      newArr.push({ contactPerson: '', contactNumber: '' });

      return newArr;
    });
  };

  return {
    contactArr,
    setContactArr,
    onAddClick,
  };
};

const useAnnoArr = () => {
  const [annoArr, setAnnoArr] = useState<string[]>([]);

  const onConfirm_anno = (v: TgetAnnotation['data']) => {
    const vArr = v.map((item) => item.description);

    if (!vArr[0]) {
      vArr[0] = '';
    }

    setAnnoArr((arr) => {
      const newAnnoArr = [...arr];
      newAnnoArr.push(...vArr);

      return newAnnoArr;
    });
  };

  return {
    annoArr,
    setAnnoArr,
    onConfirm_anno,
  };
};

const useHasPattern = () => {
  const [shouldHasPattern, setShouldHasPattern] = useState<TshouldPatternList>({
    floor: false,
    detail: false,
    color: false,
    construction: false,
    design: false,
  });

  const [hasPattern, setHasPattern] = useState<ThasPattern>({
    hasFloor: false,
    hasDetail: false,
    hasColor: false,
    hasConstruction: false,
    hasDesign: false,
  });

  const onPatternChange = (hasPattern: ThasPattern) => {
    setHasPattern(hasPattern);
  };

  const editShouldHasPattern = (bool: boolean, key: keyof TshouldPatternList) => {
    setShouldHasPattern((state) => {
      return {
        ...state,
        [key]: bool,
      };
    });
  };

  return {
    shouldHasPattern,
    setShouldHasPattern,
    hasPattern,
    setHasPattern,
    onPatternChange,
    editShouldHasPattern,
  };
};

// ================================================================================
export default WorkContactDoc_component;

// 工程聯絡單
// 工程聯絡單
// 工程聯絡單

import { useEffect, useState, useMemo, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import classNames from 'classnames';

// component
import Profile, {
  Tcontroll as Tcontroll_profile,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/profile';
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
import ProjectPattern, {
  ThasPattern,
  TpatternReviewProcessGroup,
  TpatternReviewProcess,
  TpatternReviewStatus,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/projectPattern';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import WorkSheetSelector from 'components/global/gear/modal/workSheetSelector';
import TextListEditor_v2, {
  TstringObj as Tcontroll_textListEditor,
} from 'components/page/domestic/quotation/quotationTotal/TextListEditor_v2';

// api
import {
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
};

type TshouldPatternList = {
  [key in TengineeringContactAttachmentType]: boolean;
};

export type { TimperativeHandle, TonStateChange };

// ============================================================================

const WorkContactDoc_component = forwardRef(PreWorkContactDoc_component);

// _________________________________________
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
  const router = useRouter();
  const { contractId } = router.query as Tquery;

  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [showAnnoSelector, setShowAnnoSelector] = useState(false);

  const [isShowPattern, setIsShowPattern] = useState(false);

  const showPattern = () => {
    setDisabled(true);
    setIsShowPattern(true);
  };

  useImperativeHandle(ref, () => ({
    reqPatch,
    closePattern: () => setIsShowPattern(false),
    setDisabled,
  }));

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

  // ---------------------------------------------------------------------------

  /**data裡只會有一筆資料 */
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
  }, [contractId, engineeringContactId]);

  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------

  const [shouldHasPattern, setShouldHasPattern] = useState<TshouldPatternList>({
    // signature: false,
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

  useEffect(() => {
    const {
      // shouldHasSignature,
      shouldHasColor,
      shouldHasConstruction,
      shouldHasDetail,
      shouldHasFloor,
      shouldHasDesign,
    } = engineeringContact ?? {};

    setShouldHasPattern({
      floor: shouldHasFloor ?? false,
      detail: shouldHasDetail ?? false,
      color: shouldHasColor ?? false,
      construction: shouldHasConstruction ?? false,
      design: shouldHasDesign ?? false,
    });
  }, [engineeringContact]);

  const patternReviewStatus: TpatternReviewStatus = useMemo(() => {
    const {
      reviewWorkerEmployee,
      reviewManagerEmployee,

      detailToWorkerAt = null,
      detailWorkerReviewedAt = null,
      detailToManagerAt = null,
      detailManagerReviewedAt = null,

      designToWorkerAt = null,
      designWorkerReviewedAt = null,
      designToManagerAt = null,
      designManagerReviewedAt = null,

      floorToWorkerAt = null,
      floorWorkerReviewedAt = null,
      floorToManagerAt = null,
      floorManagerReviewedAt = null,

      constructionToWorkerAt = null,
      constructionWorkerReviewedAt = null,
      constructionToManagerAt = null,
      constructionManagerReviewedAt = null,

      colorToWorkerAt = null,
      colorWorkerReviewedAt = null,
      colorToManagerAt = null,
      colorManagerReviewedAt = null,
    } = engineeringContact ?? {};

    return {
      salesName: contract?.content.reviewSalesEmployee?.chName ?? '',
      workerName: reviewWorkerEmployee?.chName ?? '',
      managerName: reviewManagerEmployee?.chName ?? '',
      pattern: {
        color: {
          colorToWorkerAt,
          colorWorkerReviewedAt,
          colorToManagerAt,
          colorManagerReviewedAt,
        },
        construction: {
          constructionToWorkerAt,
          constructionWorkerReviewedAt,
          constructionToManagerAt,
          constructionManagerReviewedAt,
        },
        detail: {
          detailToWorkerAt,
          detailWorkerReviewedAt,
          detailToManagerAt,
          detailManagerReviewedAt,
        },
        floor: {
          floorToWorkerAt,
          floorWorkerReviewedAt,
          floorToManagerAt,
          floorManagerReviewedAt,
        },
        design: {
          designToWorkerAt,
          designWorkerReviewedAt,
          designToManagerAt,
          designManagerReviewedAt,
        },
      },
    };
  }, [engineeringContact]);

  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------

  const [annoArr, setAnnoArr] = useState<string[]>([]);

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

  // ---------------------------------------------------------------------------
  const [contactArr, setContactArr] = useState<{ contactPerson: string; contactNumber: string }[]>([]);

  const onAddClick = () => {
    setContactArr((arr) => {
      const newArr = [...arr];
      newArr.push({ contactPerson: '', contactNumber: '' });

      return newArr;
    });
  };

  // ---------------------------------------------------------------------------

  const reSet = () => {
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

  useEffect(() => {
    if (!engineeringContact) {
      return;
    }

    reSet();
  }, [engineeringContact]);

  useEffect(() => {
    if (disabled) {
      reSet();
    }
  }, [disabled]);

  // ---------------------------------------------------------------------------

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
        },
        {
          label: '平面圖',
          haveData: hasPattern.hasFloor,
          shouldHaveData: shouldHasPattern.floor,
          onCheck: (bool) => {
            editShouldHasPattern(bool, 'floor');
          },
        },
        {
          label: '設計圖',
          haveData: hasPattern.hasDesign,
          shouldHaveData: shouldHasPattern.design,
          onCheck: (bool) => {
            editShouldHasPattern(bool, 'design');
          },
        },
        {
          label: '工程圖',
          haveData: hasPattern.hasConstruction,
          shouldHaveData: shouldHasPattern.construction,
          onCheck: (bool) => {
            editShouldHasPattern(bool, 'construction');
          },
        },
        {
          label: '色卡',
          haveData: hasPattern.hasColor,
          shouldHaveData: shouldHasPattern.color,
          onCheck: (bool) => {
            editShouldHasPattern(bool, 'color');
          },
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

  // ----------------------------------------------------------------------------

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

  // 把金額隱藏
  const filteredProdKeyArr = prodKeyArr.filter((key) => {
    if (key === 'price' || key === 'dualPrice' || key === 'unitPrice' || key === 'totalPrice') {
      return false;
    }

    return true;
  });

  // ----------------------------------------------------------------------------
  return (
    <div>
      <div>
        {/* 工程聯絡單 */}
        <div className={classNames(isShowPattern && 'hidden')}>
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
            patternReviewStatus={patternReviewStatus}
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

export default WorkContactDoc_component;

import { useMemo } from 'react';

// type
import type { TengineeringContactDto, TquotationProductItemDto } from 'js/api/dtoTypes';

// component
import { Tcontrol_profile } from 'components/page/worksDepartment/contracList/contract/workSheet/workSheetProfile';

const useControl_profile = (engineeringContact: TengineeringContactDto | undefined | null): Tcontrol_profile => {
  const control_profile = useMemo(() => {
    const {
      //
      projectName = '',
      projectContent = '',
      projectNumber = '',
      projectPrincipal = '',
      constructionSitePrincipalContactNumber = '',
      constructionSiteFaxNumber = '',
      constructionSiteContactNumber = '',
      contractor = '',
      contractorPrincipal = '',
      contractorContactNumber = '',
      contractorFaxNumber = '',
      county = '',
      district = '',
      address = '',
    } = engineeringContact ?? {};

    const control_profile: Tcontrol_profile = {
      projectName: {
        value: projectName,
      },
      projectContent: {
        value: projectContent,
      },
      // 有空時把key改成projectPhoneNumber
      projectNumber: {
        // value: profile.projectNumber,
        value: constructionSiteContactNumber,
      },
      projectFaxNumber: {
        value: constructionSiteFaxNumber,
      },
      projectPerson: {
        value: projectPrincipal,
      },
      projectPersonNumber: {
        value: constructionSitePrincipalContactNumber,
      },
      allAddress: {
        value: `${county}${district}${address}`,
      },
      engineeringNumber: {
        value: projectNumber,
      },
      contractor: {
        value: contractor,
      },
      principal: {
        value: contractorPrincipal,
      },
      contactNumber: {
        value: contractorContactNumber,
      },
      faxNumber: {
        value: contractorFaxNumber,
      },
    };

    return control_profile;
  }, [engineeringContact]);

  return control_profile;
};

export { useControl_profile };

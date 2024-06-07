// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import scss from './profile.module.scss';

// type
import type { TengineeringContactDto } from 'js/api/dtoTypes';

// ========================================================================

type TvalueList = {
  projectName: string;
  projectContent: string;

  constructionSiteContactNumber: string;
  constructionSiteFaxNumber: string;
  projectPrincipal: string;
  constructionSitePrincipalContactNumber: string;
  wholeAddress: string;

  projectNumber: string;
  contractor: string;
  contractorPrincipal: string;
  contractorContactNumber: string;
  contractorFaxNumber: string;

  contactInfo: {
    contactPerson: string;
    contactNumber: string;
  }[];
};

type Tprops = {
  valueList: TvalueList;
};

export type { Tprops as Tprops_profile };

// ========================================================================

const config: TinputSelProps = {
  disabled: true,
  showBaseline: 'invisible',
  captionStyle: {
    width: 100,
  },
};

const config2: TinputSelProps = {
  ...config,
  captionStyle: {
    ...config.captionStyle,
    width: 140,
  },
};

// region START
export default function Profile({ valueList }: Tprops) {
  const {
    projectName,
    projectContent,
    constructionSiteContactNumber,
    constructionSiteFaxNumber,
    projectPrincipal,
    constructionSitePrincipalContactNumber,
    wholeAddress,
    projectNumber,
    contractor,
    contractorPrincipal,
    contractorContactNumber,
    contractorFaxNumber,
    contactInfo,
  } = valueList;

  // region RENDER
  return (
    <div className={scss.container}>
      {/* // region left */}
      <div className={scss.left}>
        <InputSel
          {...config}
          caption="工程名稱"
          className="col-span-2"
          inputProps={{
            props: {
              value: projectName,
            },
          }}
        />
        <InputSel
          {...config}
          caption="工程內容"
          className="col-span-2"
          inputProps={{
            props: {
              value: projectContent,
            },
          }}
        />

        <hr className="col-span-2" />

        <InputSel
          {...config}
          caption="工地電話"
          inputProps={{
            props: {
              value: constructionSiteContactNumber,
            },
          }}
        />
        <InputSel
          {...config2}
          caption="工地傳真"
          inputProps={{
            props: {
              value: constructionSiteFaxNumber,
            },
          }}
        />
        <InputSel
          {...config}
          caption="工程負責人"
          inputProps={{
            props: {
              value: projectPrincipal,
            },
          }}
        />
        <InputSel
          {...config2}
          caption="工程負責人電話"
          inputProps={{
            props: {
              value: constructionSitePrincipalContactNumber,
            },
          }}
        />
        <InputSel
          {...config}
          caption="工程地點"
          inputProps={{
            props: {
              value: wholeAddress,
            },
          }}
        />
        <hr className="col-span-2" />

        {contactInfo.map((info, index) => {
          const indexNumber = String(index + 1).padStart(2, '0');

          return (
            <InputSel
              key={index}
              {...config}
              caption={`聯絡人${indexNumber}`}
              className="col-span-2"
              inputProps={{
                props: {
                  value: `${info.contactPerson} / ${info.contactNumber}`,
                },
              }}
            />
          );
        })}

        {/* left close */}
      </div>

      {/* // region right */}
      <div className={scss.right}>
        <InputSel
          {...config}
          caption="工程編號"
          inputProps={{
            props: {
              value: projectNumber,
            },
          }}
        />
        <InputSel
          {...config}
          caption="承包商"
          inputProps={{
            props: {
              value: contractor,
            },
          }}
        />
        <InputSel
          {...config}
          caption="負責人"
          inputProps={{
            props: {
              value: contractorPrincipal,
            },
          }}
        />
        <InputSel
          {...config}
          caption="公司電話"
          inputProps={{
            props: {
              value: contractorContactNumber,
            },
          }}
        />
        <InputSel
          {...config}
          caption="公司傳真"
          inputProps={{
            props: {
              value: contractorFaxNumber,
            },
          }}
        />
      </div>
    </div>
  );
}

// ========================================================================

const createValueList_profile_engineeringContact = ({
  engineeringContact,
}: {
  engineeringContact: TengineeringContactDto | undefined | null;
}): TvalueList => {
  const {
    projectName = '',
    projectContent = '',
    zipCode = '',
    county = '',
    district = '',
    address = '',
    projectPrincipal = '',
    constructionSitePrincipalContactNumber = '',
    constructionSiteFaxNumber = '',
    constructionSiteContactNumber = '',
    projectNumber = '',
    contractor = '',
    contractorPrincipal = '',
    contractorContactNumber = '',
    contractorFaxNumber = '',
    contactInfo,
  } = engineeringContact ?? {};

  const wholeAddress = `${zipCode} ${county}${district}${address}`;

  const list: TvalueList = {
    projectName,
    projectContent,

    constructionSiteContactNumber,
    constructionSiteFaxNumber,
    projectPrincipal,
    constructionSitePrincipalContactNumber,
    wholeAddress,

    projectNumber,
    contractor,
    contractorPrincipal,
    contractorContactNumber,
    contractorFaxNumber,

    contactInfo: contactInfo ?? [],
  };

  return list;
};

export { createValueList_profile_engineeringContact };

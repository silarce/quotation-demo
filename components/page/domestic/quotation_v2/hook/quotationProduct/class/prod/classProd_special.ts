// type
import { TstateProd } from '../../type';
import { TnodeConfig } from './config';
import {
  TdoorModelInfoDto,
  //
  TdoorGeneralSpecsDto,
  //
  TdoorComponentListDto,
  TdoorSlatDto,
  TdoorBottomBarDto,
  TdoorGuideRailDto,
  TdoorSidePlateDto,
  TdoorRollerDto,
  TdoorMotorDto,
  TdoorMotorAccessoriesDto,
  TdoorHeadBoxDto,
  TdoorMiddlePillarDto,
  TdoorBackBoneDto,

  //
  TdoorModel,
} from 'js/api/dtoTypes';

import { ClassProd_base, Interface_ClassProd_special } from './classProd_base';

class ClassProd_special extends ClassProd_base implements Interface_ClassProd_special {
  readonly doorModel = 'special';
  onFullWidthChange = undefined;

  // constructor(props: {
  //   stateProd: TstateProd;
  //   setStateProd: React.Dispatch<React.SetStateAction<TstateProd>>;
  //   nodeConfig: TnodeConfig;
  // }) {
  //   super(props);
  //   this.onFullWidthChange = undefined;
  //   // cloneDeep對效能的負擔太大了
  //   // this.state = _.cloneDeep(stateProd);
  //   // this.state = stateProd;
  //   // this.data = this.state.data_prod;
  //   // this.setState = setStateProd;
  //   // this.nodeConfig = customizeNodeConfig(nodeConfig);
  // } // constructor
}

export { ClassProd_special };

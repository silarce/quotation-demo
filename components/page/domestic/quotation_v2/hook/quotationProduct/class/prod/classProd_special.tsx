// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel, {
  TinputSelProps,
  inputLocaleStringSwitcher,
  InputSel_input_timeout,
} from 'components/global/gear/inputAndSel_v2/inputSel';
import {
  InputSel_prod,
  InputSel_prod_memo_select,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/InputSel_prod';

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

import { ClassProd_base, Interface_ClassProd_special, Tprops_constructor } from './classProd_base';

// ========================================================================

// 修改style與className時要注意避免修改影響寬度的樣式，避免與其他的row不對齊
// const customizeNodeConfig = ({ classProd, nodeConfig }: { classProd: ClassProd_special; nodeConfig: TnodeConfig }) => {
//   const { doorModelName } = nodeConfig;

//   const config: typeof nodeConfig = {
//     ...nodeConfig,

//     doorModelName: {
//       ...doorModelName,
//       createNode({ disabled }) {
//         const inputSelProps: TinputSelProps = {
//           disabled: false,
//           inputProps: {
//             props: {
//               value: classProd.doorModelName,
//               onChange: (e) => {
//                 classProd.doorModelName = e.target.value;
//               },
//               readOnly: disabled,
//             },
//           },
//         };

//         return <InputSel_prod {...inputSelProps} />;
//       },
//     },
//   };

//   // ----------------------------------------------------------------------

//   return config;
// };

// ========================================================================
class ClassProd_special extends ClassProd_base implements Interface_ClassProd_special {
  readonly doorModel = 'special';

  // constructor(props: Tprops_constructor) {
  //   super(props);
  // // const { nodeConfig } = props;
  // // this._nodeConfig = customizeNodeConfig({ classProd: this, nodeConfig });
  // }

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

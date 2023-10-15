import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

// layer
import PageHeader, { TpanelList } from 'components/page/worksDepartment/contracList/contract/gear/PageHeader';
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import WorkSheetProfile from 'components/page/worksDepartment/contracList/contract/workSheet/profile';

// gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import { OptionWithIcon01 } from 'components/global/gear/select/optionWithIcon';
import { SingleValueWithIcon01 } from 'components/global/gear/select/singleValueWithIcon';

// css
import scss from './workSheet_refer.module.scss';

// other
import { optionsCre_doorTrack_normal } from 'js/utils/options/doorTrackOptions';

const optionArr_doorTrack = optionsCre_doorTrack_normal();

export default function WorkSheet() {
  const [disabled, setDisabled] = useState(true);

  const { control, handleSubmit } = useForm({ defaultValues: fakeData });

  const onSubmit: SubmitHandler<TfakeData> = (data) => {
    alert(JSON.stringify(data));
    console.log(data);
  };

  // console.log(watch("projectName"))
  // console.log(register("projectName"))

  const panelList_allow: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
  ];

  const panelList_notAllow: TpanelList = [
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  const panelList = disabled ? panelList_allow : panelList_notAllow;

  return (
    <SubLayer className={scss.container}>
      <PageHeader panelList={panelList} />
      <form>
        <Controller
          name="projectName"
          control={control}
          render={({ field }) => {
            return <InputSel inputProps={field} label="test" width={300} />;
          }}
        />

        <Controller
          name="size"
          control={control}
          render={({ field }) => {
            return (
              <InputSel
                selectProps={{
                  ...field,
                  options: fooOptionArr,
                  selClassNames: {
                    singleValue: (state) => {
                      return scss.selSingleValue;
                    },
                  },
                }}
                label="test"
                width={300}
              />
            );
          }}
        />

        <InputSel
          label="foo"
          width="500px"
          checkProps={{
            propsList: {
              foo1: { value: false, label: '無' },
              foo2: { value: false, label: '鋁障感型' },
              foo3: { value: true, label: '氟烤' },
            },
            onChange: (v) => {
              console.log(v);
            },
            checkStyle: { width: '100px' },
          }}
        />
        <InputSel
          label="foo"
          width="500px"
          checkProps={{
            propsList: {
              foo1: { value: false, label: '無' },
              foo2: { value: false, label: 'a' },
              foo3: { value: true, label: '氟烤' },
            },
            onChange: (v) => {
              console.log(v);
            },
            checkStyle: { width: '100px' },
            isRadio: true,
          }}
        />

        <InputSel
          className={scss.sel}
          label="track"
          selectProps={{
            value: optionArr_doorTrack[0],
            options: optionArr_doorTrack,
            onChange: (v) => {
              console.log(v);
            },
            selClassNames: {
              singleValue: (state) => {
                return scss.selSingleValue;
              },
              option: (state) => {
                return scss.selSingleValue;
              },
            },
            customComponents: {
              Option: (props) =>
                OptionWithIcon01(props, {
                  showLabel: false,
                  className: scss.selSingleValue_custom,
                }),
              SingleValue: (props) =>
                SingleValueWithIcon01(props, {
                  showLabel: false,
                  className: scss.selSingleValue_custom,
                }),
            },
          }}
        />

        <button onClick={handleSubmit(onSubmit)}>test</button>

        {/* <WorkSheetProfile /> */}
      </form>
    </SubLayer>
  );
}

// ====================================================================

type TfakeData = {
  projectName: string;
  projectDesc: string;
  size: string;
};

const fakeData: TfakeData = {
  projectName: 'projectName',
  projectDesc: 'projectDesc',
  size: '',
};

const fooOptionArr = [
  { label: 'foo1', value: 'foo1' },
  { label: 'foo2', value: 'foo2' },
  { label: 'foo3', value: 'foo3' },
];

/** @jsxImportSource @emotion/react */

import styled from '@emotion/styled';
import { css, ClassNames } from '@emotion/react';
import theme01 from 'styles/_theme01.module.scss';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// ========================================================================

const inputSelProps_default: TinputSelProps = {
  wrapperStyle: { gap: '20px' },
  captionStyle: { width: '80px' },
  showBaseline: 'auto',
  captionSize: '18',
  captionColor: 'main',
  captionWeight: '400',
};

// ========================================================================

const Emo_Wrapper = styled.div`
  width: 845px;
  margin-top: 82px;
  margin-left: 62px;
`;

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <Emo_Wrapper>{children}</Emo_Wrapper>;
};

// ========================================================================

const Emo_Wrapper_inpuSel_01 = styled.div`
  display: grid;
  grid-template-columns: 350px 350px;
  justify-content: space-between;
  gap: 15px;
`;

const Wrapper_inpuSel_01 = ({ children }: { children: React.ReactNode }) => {
  return <Emo_Wrapper_inpuSel_01>{children}</Emo_Wrapper_inpuSel_01>;
};

// ========================================================================

const WrappedTextarea = ({
  //
  inputSelProps,
  disabled,
  mt,
}: {
  inputSelProps?: TinputSelProps;
  disabled?: boolean;
  mt?: React.CSSProperties['marginTop'];
}) => {
  return (
    <ClassNames>
      {({ css }) => {
        const css_textareaWrapper = css`
          margin-top: ${mt || '20px'};
        `;
        const css_inputSel_textarea = css`
          align-items: flex-start;
        `;
        const css_areatextCaption = css`
          transform: translateY(-6px);
        `;
        const css_textarea = css`
          padding: 3px 12px;
          font-size: 14px;
          border: solid 1px ${disabled ? 'transparent' : theme01.colors_border};
        `;

        return (
          <div className={css_textareaWrapper}>
            <InputSel
              {...inputSelProps_default}
              className={css_inputSel_textarea}
              captionClassName={css_areatextCaption}
              showBaseline="invisible"
              caption="備註"
              disabled={disabled}
              textareaProps={{
                allowNewLineByUser: true,
                props: {
                  className: css_textarea,
                  maxRows: 18,
                  minRows: disabled ? undefined : 18,
                },
              }}
              {...inputSelProps}
            />
          </div>
        );
      }}
    </ClassNames>
  );
};

// ========================================================================
// ========================================================================

export { Wrapper, Wrapper_inpuSel_01, WrappedTextarea };
export { inputSelProps_default as inputSelProps };

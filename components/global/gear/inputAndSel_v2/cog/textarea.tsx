import classNames from 'classnames';

// https://www.npmjs.com/package/react-textarea-autosize
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';
// css
import scss from '../inputSel.module.scss';

/*
TextareaAutosizeProps這個型別長這樣
interface TextareaAutosizeProps extends Omit<TextareaProps, 'style'> {
    maxRows?: number;
    minRows?: number;
    onHeightChange?: (height: number, meta: TextareaHeightChangeMeta) => void;
    cacheMeasurements?: boolean;
    style?: Style;
}
*/

export type TtextareaProps = {
  props?: TextareaAutosizeProps;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  allowNewLineByUser?: boolean;
};

// =====================================================================
export default function Textarea({
  wrapperClassName,
  wrapperStyle,
  props,
  allowNewLineByUser = false,
}: TtextareaProps) {
  return (
    <div className={classNames(scss.textareaBox, wrapperClassName)} style={wrapperStyle}>
      <TextareaAutosize
        autoComplete="off"
        onKeyDown={(e) => {
          if (!allowNewLineByUser) {
            if (e.code === 'Enter') {
              e.preventDefault();
            }

            if (e.code === 'NumpadEnter') {
              e.preventDefault();
            }
          }
        }}
        {...props}
      />
    </div>
  );
}

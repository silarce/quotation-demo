import { useMemo } from 'react';

// type
import type { TemplateModelProps, TemplateIngredients, Locale_tamplateDoc } from './modelType';

import type { TemplateProps } from './types';

const useTemplateProps_titles = ({
  //
  templateModelProps_titles,
  templateIngredients_titles,
  locale,
}: {
  templateModelProps_titles: TemplateModelProps['titles'];
  templateIngredients_titles: TemplateIngredients['titles'];
  locale: Locale_tamplateDoc | undefined;
}) => {
  const templateProps_titles: TemplateProps['titles'] = useMemo(() => {
    if (!templateModelProps_titles) {
      return {};
    }

    const templateProps_titles: TemplateProps['titles'] = {};

    const list: {
      [key: string]: string | null | undefined;
    } = {};

    Object.entries(templateModelProps_titles).forEach(([key, src]) => {
      let value = undefined;

      if (src === null) {
        value = null;
      } else {
        value = locale?.titles?.[key] ?? key;
      }

      list[key] = value;
    });

    Object.entries(templateIngredients_titles ?? {}).forEach(([key, propertyName]) => {
      templateProps_titles[key] = list[propertyName] ?? '';
    });

    return templateProps_titles;
  }, [templateModelProps_titles, templateIngredients_titles, locale]);

  return templateProps_titles;
};

export { useTemplateProps_titles };

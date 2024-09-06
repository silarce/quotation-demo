import { useMemo } from 'react';

// type
import type { TemplateModelProps, TemplateIngredients, Locale } from './modelType';

import type { TemplateProps } from './types';

import { parseLocale } from 'components/basicDataEditorTemplate/library';

const useTemplateProps_titles = ({
  //
  templateModelProps_titles,
  templateIngredients_titles,
  locale,
}: {
  templateModelProps_titles: TemplateModelProps['titles'];
  templateIngredients_titles: TemplateIngredients['titles'];
  locale: Locale | undefined;
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
      const title_locale = parseLocale(key, src, locale);

      list[key] = title_locale;
    });

    Object.entries(templateIngredients_titles ?? {}).forEach(([key, propertyName]) => {
      templateProps_titles[key] = list[propertyName] ?? '';
    });

    return templateProps_titles;
  }, [templateModelProps_titles, templateIngredients_titles, locale]);

  return templateProps_titles;
};

export { useTemplateProps_titles };

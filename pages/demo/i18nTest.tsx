import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './lab.module.scss';

// type
import type { TerpFeatureDto, TuserDto } from 'js/api/dtoTypes';

// import i18n from 'hooks/i18n';
import { useTranslation } from 'react-i18next';

// ======================================================================

export default function Lab00({
  isAdmin,

  userInfo,
  userGrade,
  userErpFeature,
}: {
  isAdmin: boolean;

  userGrade: number;
  userErpFeature: TerpFeatureDto[] | undefined;
  userInfo: TuserDto;
}) {
  const router = useRouter();

  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1 className="text-5xl">LAB</h1>
      <br />
      <h1 className="text-5xl">{t('hello')}</h1>
      <h1 className="text-5xl">{t('meow')}</h1>
      <br />

      <MyButton_v2 onClick={() => i18n.changeLanguage('zh-TW')}>中文</MyButton_v2>
      <br />
      <MyButton_v2 onClick={() => i18n.changeLanguage('en')}>EN</MyButton_v2>
    </div>
  );
}

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

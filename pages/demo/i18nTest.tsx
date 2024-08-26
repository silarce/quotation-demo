import React, { useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './lab.module.scss';

// type
import type { TerpFeatureDto, TuserDto } from 'js/api/dtoTypes';
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
  const { t, i18n } = useTranslation('common');

  const router = useRouter();

  return (
    <div>
      <h1 className="text-5xl">LAB</h1>
      <br />
      <br />
      <h1 className="text-5xl">{t('test')}</h1>

      <MyButton_v2 onClick={() => router.replace({}, {}, { locale: 'zh-TW' })}>中文</MyButton_v2>
      <br />
      <MyButton_v2 onClick={() => router.replace({}, {}, { locale: 'en' })}>EN</MyButton_v2>
    </div>
  );
}

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

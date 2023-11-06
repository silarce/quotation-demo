import React, { useState, useRef, Fragment } from 'react';
import moment from 'moment';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Decimal from 'decimal.js';

// antd
import Modal from 'antd/lib/modal/Modal';

import scss from './sheetPDF.module.scss';

export default function SheetPDF() {
  return (
    <Modal
      //
      visible={false}
      footer={null}
      closable={false}
      centered={true}
      destroyOnClose={true}
    >
      <div className={scss.container}>test</div>
    </Modal>
  );
}

import { useState, useEffect, useCallback } from 'react';

// ==================================================================

interface Tstate_demandForm {
  itemName: string; // 項目名稱
  doorModel: string; // 門型
  fullWidth: number; // L
  WG: number; // WG
  height: number; // h
  volume: number; // 才數
  motor: string;
  horsepower: string; // 馬力數
  voltage: string; // 電壓
  antiTyphoonBaseLock: string; // 防颱鎖固
  obstacleSensor: boolean; // 障感器
  infrared: boolean; // 紅外線
  remoteControl: boolean; // 遙控器
  smartSwitch: boolean; // 智慧開關
  antiTyphoonColumn: boolean; // 防颱中柱
  ul: boolean; // UL熔金體
  wheel: boolean; // 檔輪

  floor: string; // 樓層
  locationArea: string; // 區域
}

// ==================================================================
const useDemandForm = () => {};

const useDefaultState = () => {};

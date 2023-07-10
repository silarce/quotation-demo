interface Tsinature {
  manager: { value: string; label: string }; // 經理
  director: { value: string; label: string }; // 主管
  attn: { value: string; label: string }; // 經辦
}

const fakeSinature: Tsinature = {
  manager: { value: '王小明', label: '經理' }, // 經理
  director: { value: '李小華', label: '主管' }, // 主管
  attn: { value: '林小善', label: '經辦' }, // 經辦
};

export type { Tsinature };
export { fakeSinature };

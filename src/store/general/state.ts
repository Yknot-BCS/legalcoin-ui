export interface GeneralStateInterface {
  search: string;
  options: {
    label: string;
    groupLabel: boolean;
    group: string;
    disabled: boolean;
    id: string;
  }[];
}

export function state(): GeneralStateInterface {
  return {
    search: '',
    options: []
  };
}

export interface Usuario {
  id: number;
  first_name: string;
  affiliation_date: Date | string;
  avatar: string;
  budgets: Array<Budget>;
  corporate_email: string;
  csys_registration_number: number;
  groups: Array<any>;
  hourly_rate: number;
  is_cooperative_member: boolean;
  last_name: string;
  name_display: string;
  position_display: {
    code: number;
    description: string;
    id: number;
    position_display: string;
    salary_range: number;
    title: string;
  };
  start_date: Date | string;
  status: 'ativo' | 'inativo';
  status_display: string;
  user_id: number;
}
export interface Budget {
  id: number;
  has: string;
  budget_kind: string;
  budget_kind_display: string;
}

export type Step = 'login' | 'data-confirmation' | 'test-start' | 'test-active';

export interface UserData {
  username: string;
  name: string;
  subject: string;
}

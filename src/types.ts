export type Step = 'login' | 'data-confirmation' | 'test-start' | 'test-active' | 'admin-login' | 'admin-dashboard' | 'student-management' | 'exam-management' | 'question-management' | 'exam-results';

export interface UserData {
  username: string;
  name: string;
  subject: string;
  examId: string;
}

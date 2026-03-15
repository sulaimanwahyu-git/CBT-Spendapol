import { supabase } from '../lib/supabase';

export const getExams = async (subject: string) => {
  return await supabase
    .from('exams')
    .select('*')
    .eq('subject', subject)
    .eq('is_active', true);
};

export const getQuestions = async (examId: string) => {
  return await supabase
    .from('questions')
    .select('*')
    .eq('exam_id', examId);
};

export const submitAnswer = async (studentId: string, questionId: string, answer: string) => {
  return await supabase
    .from('student_answers')
    .insert({
      student_id: studentId,
      question_id: questionId,
      selected_answer: answer
    });
};

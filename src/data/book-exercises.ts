import rows from './book-exercises.json';
import type {BookExerciseSection} from './types';

export const bookExercises=rows as BookExerciseSection[];
export const exercisesForLesson=(lessonId:number)=>bookExercises.filter(section=>section.lessonId===lessonId);

// utils/generateWorkoutPlan.js

import { EXERCISES } from '../constants/exercises';

export const generateWorkoutPlan = (analysisResult, userData) => {
  const { landmarks } = analysisResult; // Array of landmark objects
  const { weight, height } = userData;

  // --- 1. Calculate Key Metrics 📊 ---

  const leftShoulder = landmarks.find(lm => lm.id === 11);
  const rightShoulder = landmarks.find(lm => lm.id === 12);
  const leftHip = landmarks.find(lm => lm.id === 23);
  const rightHip = landmarks.find(lm => lm.id === 24);

  let shoulderWidth = 0;
  let waistWidth = 0;
  let waistToShoulderRatio = 1; // Default

  if (leftShoulder && rightShoulder && leftShoulder.x > 0 && rightShoulder.x > 0) {
      shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
  }
  if (leftHip && rightHip && leftHip.x > 0 && rightHip.x > 0) {
      waistWidth = Math.abs(rightHip.x - leftHip.x);
  }
  if (shoulderWidth > 0 && waistWidth > 0) {
      waistToShoulderRatio = waistWidth / shoulderWidth;
  }

  const validWeight = typeof weight === 'number' && weight > 0 ? weight : 0;
  const validHeight = typeof height === 'number' && height > 0 ? height : 0;
  let bmi = 0;
  if (validHeight > 0 && validWeight > 0) {
      const heightInMeters = validHeight / 100;
      bmi = validWeight / (heightInMeters * heightInMeters);
  }

  console.log(`Calculated Metrics: BMI=${bmi.toFixed(1)}, WSR=${waistToShoulderRatio.toFixed(2)}`);

  // --- 2. The AI Decision Logic 🧠 ---

  let plan = {
    title: 'Your Personalized Workout',
    workout: [],
  };

  // --- MODIFIED WORKOUT LISTS ---

  if (bmi > 25) {
    // Goal: Fat Loss (Focus on higher reps, full body)
    plan.title = 'Fat Loss Plan';
    plan.workout = [
      { exercise: EXERCISES.find(e => e.id === 'squat'), sets: 3, reps: '15-20' },
      { exercise: EXERCISES.find(e => e.id === 'pushup'), sets: 3, reps: 'As many as possible' },
      { exercise: EXERCISES.find(e => e.id === 'bicep_curl'), sets: 3, reps: '12-15' }, // Added curls
    ];
  } else if (waistToShoulderRatio > 0.75) {
    // Goal: Build Upper Body (Focus on pushups, curls)
    plan.title = 'Upper Body Focus Plan';
    plan.workout = [
      { exercise: EXERCISES.find(e => e.id === 'pushup'), sets: 4, reps: '8-12' },
      { exercise: EXERCISES.find(e => e.id === 'bicep_curl'), sets: 4, reps: '8-12' },
      { exercise: EXERCISES.find(e => e.id === 'squat'), sets: 2, reps: '10-12' }, // Include some legs
    ];
  } else {
    // Goal: General Fitness (Balanced approach)
    plan.title = 'General Fitness Plan';
    plan.workout = [
      { exercise: EXERCISES.find(e => e.id === 'squat'), sets: 3, reps: '10-12' },
      { exercise: EXERCISES.find(e => e.id === 'pushup'), sets: 3, reps: '10-12' },
      { exercise: EXERCISES.find(e => e.id === 'bicep_curl'), sets: 3, reps: '10-12' },
    ];
  }

  return plan;
};
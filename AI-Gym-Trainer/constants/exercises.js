// constants/exercises.js

export const EXERCISES = [
  {
    id: 'pushup',
    name: 'Push-up',
    type: 'Strength',
    muscleGroup: 'Chest',
    description: 'A classic bodyweight exercise that builds upper body strength.',
    image: 'https://images.unsplash.com/photo-1682048682610-20a91f10b29c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
    
    // --- ADDED ---
    time: 5,
    difficulty: 'Moderate',
    targets: ['Chest', 'Shoulders', 'Triceps'],
    sets: 3,
    reps: '8-12',
    steps: [ 
      { num: 1, text: "Start in a high plank position with your hands slightly wider than your shoulders." },
      { num: 2, text: "Lower your body by bending your elbows, keeping your back straight and core engaged." },
      { num: 3, text: "Push back up to the starting position, extending your arms fully." }
    ],
    tip: "Keep your elbows tucked close to your body (not flared out) to protect your shoulders."
    // --- END ---
  },
  {
    id: 'squat',
    name: 'Bodyweight Squat',
    type: 'Strength',
    muscleGroup: 'Legs',
    description: 'A fundamental lower body exercise for strength and mobility.',
    image: 'https://images.pexels.com/photos/371049/pexels-photo-371049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    
    // --- ADDED ---
    time: 10,
    difficulty: 'Moderate',
    targets: ['Quads', 'Glutes', 'Core'],
    sets: 3,
    reps: '12-15',
    steps: [ 
      { num: 1, text: "Stand with feet shoulder-width apart, toes pointing slightly outward. Keep your chest up." },
      { num: 2, text: "Push your hips back and bend your knees as if sitting in a chair. Keep your back straight." },
      { num: 3, text: "Lower until your thighs are parallel to the floor, ensuring your knees stay behind your toes." },
      { num: 4, text: "Push through your heels to return to the starting position. Squeeze your glutes at the top." }
    ],
    tip: "Focus on keeping your chest up and your back straight throughout the entire movement."
    // --- END ---
  },
  {
    id: 'bicep_curl',
    name: 'Bicep Curl',
    type: 'Strength',
    muscleGroup: 'Arms',
    description: 'An isolation exercise that targets the biceps. Assumes dumbbells.',
    image: 'https://images.pexels.com/photos/5327466/pexels-photo-5327466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    
    // --- ADDED ---
    time: 5,
    difficulty: 'Easy',
    targets: ['Biceps'],
    sets: 3,
    reps: '10-12',
    steps: [ 
      { num: 1, text: "Stand or sit holding a dumbbell in each hand, palms facing forward, arms fully extended." },
      { num: 2, text: "Keeping your elbows tucked at your sides, curl the weights up toward your shoulders." },
      { num: 3, text: "Squeeze your biceps at the top of the movement for a second." },
      { num: 4, text: "Slowly lower the weights back down to the starting position with control." }
    ],
    tip: "Avoid using momentum. Do not swing your back; keep your upper body stable."
    // --- END ---
  },
];
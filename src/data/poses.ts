export interface YogaPose {
  name: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  image: string;
}

export const yogaPoses: YogaPose[] = [
  {
    name: "Easy Pose (Sukhasana)",
    category: "beginner",
    image: "https://pocketyoga.com/assets/images/full/Easy.png"
  },
  {
    name: "Box Pose (Neutral Spine)",
    category: "beginner",
    image: "https://pocketyoga.com/assets/images/full/BoxNeutral.png"
  },
  {
    name: "Mountain Pose with Arms at Sides (Tadasana)",
    category: "beginner",
    image: "https://pocketyoga.com/assets/images/full/MountainArmsSide.png"
  },
  {
    name: "Goddess Pose (Utkata Konasana)",
    category: "intermediate",
    image: "https://pocketyoga.com/assets/images/full/Goddess_R.png"
  },
  {
    name: "Bridge Pose (Setu Bandha Sarvangasana)",
    category: "intermediate",
    image: "https://pocketyoga.com/assets/images/full/Bridge.png"
  },
  {
    name: "Mountain Pose with Supported Backbend",
    category: "intermediate",
    image: "https://pocketyoga.com/assets/images/full/MountainBackbend.png"
  },
  {
    name: "Wheel Pose (Urdhva Dhanurasana)",
    category: "advanced",
    image: "https://pocketyoga.com/assets/images/full/Wheel.png"
  },
  {
    name: "Figure Four Pose",
    category: "advanced",
    image: "https://pocketyoga.com/assets/images/full/FigureFour_R.png"
  },
  {
    name: "Staff Pose (Dandasana)",
    category: "advanced",
    image: "https://pocketyoga.com/assets/images/full/Staff.png"
  }
]; 
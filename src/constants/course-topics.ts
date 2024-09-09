import { CardData, Tag } from "@/types/type";

export const courseContent = [
  {
    title: "Intro and Demo",
    duration: "4 lessons • 38 minutes",
    chapters: [
      { id: "ch1", name: "Chapter 1: Introduction" },
      { id: "ch2", name: "Chapter 2: Setup" },
      { id: "ch3", name: "Chapter 3: Overview" },
      { id: "ch4", name: "Chapter 4: Demo" },
    ],
  },
  {
    title: "Handle Error and User Authentication",
    duration: "4 lessons • 38 minutes",
    chapters: [
      { id: "ch5", name: "Chapter 1: Error Handling" },
      { id: "ch6", name: "Chapter 2: Authentication Basics" },
      { id: "ch7", name: "Chapter 3: Implementing JWT" },
      { id: "ch8", name: "Chapter 4: Securing Routes" },
    ],
  },
  {
    title: "Course Model and Course Creation 202",
    duration: "4 lessons • 38 minutes",
    chapters: [
      { id: "ch9", name: "Chapter 1: Course Model" },
      { id: "ch10", name: "Chapter 2: Course Creation" },
      { id: "ch11", name: "Chapter 3: Advanced Topics" },
      { id: "ch12", name: "Chapter 4: Deployment" },
    ],
  },
];

export const getCourseData = async () => {
  const tags: Tag[] = [
    "all",
    "react",
    "next.js",
    "tailwind css",
    "material-ui",
    "javascript",
    "typescript",
    "full stack",
    "ui design",
    "css",
    "frontend",
    "backend",
    "graphql",
    "node.js",
    "express",
    "mongodb",
    "docker",
    "devops",
    "agile",
  ];

  const cardsData: CardData<Tag>[] = [
    {
      id: "1",
      img: "https://images.unsplash.com/photo-1719937206590-6cb10b099e0f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Complete React Developer in 2023",
      description:
        "Learn React, Hooks, Redux, React Routing, Animations, and more.",
      chapters: 36,
      duration: "28",
      price: 99,
      enrolled: true,
      tags: ["react", "frontend"],
    },
    {
      id: "2",
      img: "https://images.unsplash.com/photo-1719937050446-a121748d4ba0?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Advanced JavaScript Concepts",
      description:
        "Deep dive into JavaScript concepts including closures, prototypes, and async programming.",
      chapters: 42,
      duration: "32",
      price: 129,
      enrolled: false,
      tags: ["javascript", "programming"],
    },
    {
      id: "3",
      img: "https://images.unsplash.com/photo-1725610588150-c4cd8b88affd?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "CSS Mastery: From Basics to Advanced",
      description:
        "Master CSS and responsive design techniques for modern web development.",
      chapters: 28,
      duration: "24",
      price: 79,
      enrolled: true,
      tags: ["css", "frontend"],
    },
    {
      id: "4",
      img: "https://images.unsplash.com/photo-1720048171731-15b3d9d5473f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Node.js: The Complete Guide",
      description:
        "Build scalable server-side applications with Node.js and Express.",
      chapters: 48,
      duration: "40",
      price: 149,
      enrolled: false,
      tags: ["nodejs", "backend"],
    },
    {
      id: "5",
      img: "https://images.unsplash.com/photo-1725603080015-7d16a86c45d9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Full Stack Web Development Bootcamp",
      description:
        "Become a full stack developer with React, Node.js, and MongoDB.",
      chapters: 60,
      duration: "50",
      price: 199,
      enrolled: false,
      tags: ["fullstack", "react", "nodejs"],
    },
  ];

  return { tags, cardsData };
};

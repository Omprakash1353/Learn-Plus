import { LiveCardData, Tag } from "@/types/type";
import { CoursePage } from "./_components/course-filter";

async function getServerData() {
  const tags: Tag[] = [
    "All",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Material-UI",
    "JavaScript",
    "TypeScript",
    "Full Stack",
    "UI Design",
    "CSS",
    "Frontend",
    "Backend",
    "GraphQL",
    "Node.js",
    "Express",
    "MongoDB",
    "Docker",
    "DevOps",
    "Agile",
  ];

  const cardsData: LiveCardData<Tag>[] = [
    {
      id: "1",
      img: "https://images.unsplash.com/photo-1724690416947-3cdc197ffab1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Build a Slack clone",
      watching: 22,
      tags: ["React", "Next.js"],
    },
    {
      id: "2",
      img: "https://images.unsplash.com/photo-1724690416953-c787bc34b56f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Learn Tailwind CSS",
      watching: 22,
      tags: ["Tailwind CSS", "UI Design"],
    },
    {
      id: "3",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?fit=crop&w=870&q=80",
      title: "Full Stack Development",
      watching: 22,
      tags: ["Full Stack", "JavaScript"],
    },
    {
      id: "4",
      img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?fit=crop&w=870&q=80",
      title: "Node.js and Express",
      watching: 22,
      tags: ["Node.js", "Backend", "JavaScript"],
    },
    {
      id: "5",
      img: "https://images.unsplash.com/photo-1587620931283-d295bafb726a?fit=crop&w=870&q=80",
      title: "GraphQL for Beginners",
      watching: 22,
      tags: ["GraphQL", "Frontend", "Backend"],
    },
    {
      id: "6",
      img: "https://images.unsplash.com/photo-1564767609342-620cb19b2357?fit=crop&w=870&q=80",
      title: "Introduction to Docker",
      watching: 22,
      tags: ["Docker", "DevOps"],
    },
    {
      id: "7",
      img: "https://images.unsplash.com/photo-1559526324-e88b9ff1d49a?fit=crop&w=870&q=80",
      title: "Mastering TypeScript",
      watching: 22,
      tags: ["TypeScript", "JavaScript", "Frontend"],
    },
  ];

  return { tags, cardsData };
}

export default async function HomePage() {
  const { tags, cardsData } = await getServerData();

  return <CoursePage tags={tags} cardsData={cardsData} />;
}
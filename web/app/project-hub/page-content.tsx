import AllProjects from "./components/AllProjects";
import FeaturedProjects from "./components/FeaturedProjects";
import Hero from "./components/Hero";
import ProjectCategories from "./components/ProjectCategories";
import DraggableMascot from "@/components/DraggableMascot";

export default function ProjectHubPageContent() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Hero Section */}
        <Hero />
        <ProjectCategories />

        {/* Featured Projects */}
        <FeaturedProjects />
        {/* Project Categories */}

        {/* All Projects */}
        <AllProjects />
      </div>

      {/* Draggable Mascot */}
      {/* <DraggableMascot
        width={140}
        height={140}
        initialPosition={{ x: 50, y: 100 }}
        className="opacity-80 hover:opacity-100 transition-opacity duration-300"
      /> */}
    </div>
  );
}

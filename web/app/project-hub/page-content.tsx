import AllProjects from "./components/AllProjects";
import FeaturedProjects from "./components/FeaturedProjects";
import Hero from "./components/Hero";
import ProjectCategories from "./components/ProjectCategories";

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
    </div>
  );
}

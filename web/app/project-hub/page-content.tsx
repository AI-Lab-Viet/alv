import AllProjects from "./components/AllProjects";
import FeaturedProjects from "./components/FeaturedProjects";
import Hero from "./components/Hero";

export default function ProjectHubPageContent() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Hero Section */}
        <Hero />

        {/* Featured Projects */}
        <FeaturedProjects />
        {/* Project Categories */}
        {/* <ProjectCategories /> */}

        {/* All Projects */}
        <AllProjects />
      </div>
    </div>
  );
}

import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectList = ({ projects, expandedProjectId, onExpand }) => {
  return (
    <div className="projects-container">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          expandedProjectId={expandedProjectId}
          onExpand={onExpand}
        />
      ))}
    </div>
  );
};

export default ProjectList;

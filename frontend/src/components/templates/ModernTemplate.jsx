// ==========================================
// src/components/templates/ModernTemplate.jsx
// ==========================================
// Modern dark-accent resume template - Asymmetric Editorial Luxe Edition
// Styled with elegant side columns, spacious typographies, and gold nodes

import SkillBadge from "../SkillBadge";

const ModernTemplate = ({ resume }) => {
  const { personal, about, skills, education, experience, projects, certifications, achievements, languages } = resume;

  const SidebarSection = ({ title, children }) => (
    <div className="mb-8 last:mb-0">
      <h3 className="font-display text-[12px] font-bold uppercase tracking-[0.25em] text-accent mb-4 pb-2 border-b border-[var(--color-border-subtle)]">
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const MainSection = ({ title, children }) => (
    <section className="mb-10 last:mb-0">
      <h2 className="font-display text-[14px] font-bold uppercase tracking-[0.2em] text-main mb-5 flex items-center gap-3">
        <span className="w-1.5 h-4 bg-accent rounded-sm flex-shrink-0" />
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );

  return (
    <div className="w-full min-h-[1123px] bg-[#0c0c0c] font-sans text-main text-[13.5px] leading-relaxed relative overflow-hidden bg-grid-metallic">
      {/* Decorative vertical metallic bar on left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-accent/50 via-accent/10 to-transparent" />

      {/* Elegant Modern Header */}
      <div className="border-b border-[var(--color-border-subtle)] px-14 py-10 relative">
        <div className="absolute right-14 top-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
        <h1 className="font-display text-4xl font-extrabold text-main mb-2 tracking-tight uppercase">
          {personal?.fullName || "Your Name"}
        </h1>
        {personal?.role && (
          <p className="font-display text-xs text-accent font-semibold tracking-[0.25em] uppercase mb-4">
            {personal.role}
          </p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-muted font-medium mt-3">
          {personal?.email && <span>📧 {personal.email}</span>}
          {personal?.phone && <span>📱 {personal.phone}</span>}
          {personal?.location && <span>📍 {personal.location}</span>}
          {personal?.linkedin && <span>🔗 LinkedIn</span>}
          {personal?.github && <span>⚡ GitHub</span>}
          {personal?.portfolio && <span>🌐 Portfolio</span>}
        </div>
      </div>

      {/* Asymmetric Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-10 px-14 py-10">
        
        {/* Left Column (Main details - 65% width) */}
        <div className="w-full lg:w-[65%] space-y-10">
          {/* Summary */}
          {about && (
            <MainSection title="Professional Profile">
              <p className="text-muted leading-relaxed font-light text-[14px]">
                {about}
              </p>
            </MainSection>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <MainSection title="Professional Experience">
              {experience.map((exp, i) => (
                <div key={i} className="relative pl-5 border-l border-accent/15 py-1 first:pt-0 last:pb-0">
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full border-2 border-accent bg-[#0c0c0c] z-10" />
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h4 className="font-bold text-main text-[14.5px] tracking-wide">{exp.role}</h4>
                    <span className="text-xs font-semibold text-accent/80 tracking-wider uppercase">{exp.company}</span>
                  </div>
                  <div className="text-[11px] text-muted font-semibold tracking-wider uppercase mb-2">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate} {exp.location && `• ${exp.location}`}
                  </div>
                  <p className="text-muted leading-relaxed font-light text-[13px] whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </MainSection>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <MainSection title="Key Projects">
              {projects.map((proj, i) => (
                <div key={i} className="relative pl-5 border-l border-accent/15 py-1 first:pt-0 last:pb-0">
                  <div className="absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full border-2 border-accent bg-[#0c0c0c] z-10" />
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1.5">
                    <h4 className="font-bold text-main text-[14.5px] flex items-center gap-2">
                      {proj.name}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-accent font-light hover:underline uppercase">
                          ↗ View
                        </a>
                      )}
                    </h4>
                    <span className="text-[10px] text-muted tracking-wider uppercase font-medium">{proj.date}</span>
                  </div>
                  {proj.technologies?.length > 0 && (
                    <p className="text-[11px] text-accent/60 font-semibold tracking-wider uppercase mb-2">
                      {proj.technologies.join(" • ")}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-muted leading-relaxed font-light text-[13px]">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </MainSection>
          )}
        </div>

        {/* Right Column (Sidebar details - 35% width) */}
        <div className="w-full lg:w-[35%] space-y-8 lg:border-l lg:border-[var(--color-border-subtle)] lg:pl-10">
          {/* Skills */}
          {skills?.length > 0 && (
            <SidebarSection title="Skills & Tech">
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((skill, i) => (
                  <SkillBadge key={i} skill={skill} color="indigo" />
                ))}
              </div>
            </SidebarSection>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <SidebarSection title="Education">
              {education.map((edu, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <h4 className="text-sm font-bold text-main leading-tight">{edu.degree}</h4>
                  <p className="text-xs text-accent font-medium mt-0.5">{edu.institution}</p>
                  <p className="text-[10.5px] text-muted tracking-wider uppercase font-semibold mt-1">{edu.startDate} – {edu.endDate}</p>
                  {edu.grade && <p className="text-[10.5px] text-accent/50 font-medium mt-0.5">GPA: {edu.grade}</p>}
                </div>
              ))}
            </SidebarSection>
          )}

          {/* Certifications */}
          {certifications?.length > 0 && (
            <SidebarSection title="Credentials">
              {certifications.map((cert, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <h4 className="text-xs font-bold text-main leading-snug">{cert.name}</h4>
                  <p className="text-[10.5px] text-muted mt-0.5">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </SidebarSection>
          )}

          {/* Achievements */}
          {achievements?.length > 0 && (
            <SidebarSection title="Achievements">
              <div className="space-y-2">
                {achievements.map((ach, i) => (
                  <p key={i} className="text-xs text-muted leading-relaxed font-light">
                    ✦ {ach}
                  </p>
                ))}
              </div>
            </SidebarSection>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <SidebarSection title="Languages">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {languages.map((lang, i) => (
                  <span key={i} className="text-xs text-muted font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                    {lang}
                  </span>
                ))}
              </div>
            </SidebarSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
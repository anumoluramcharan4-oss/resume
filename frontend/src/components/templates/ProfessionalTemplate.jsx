// ==========================================
// src/components/templates/ProfessionalTemplate.jsx
// ==========================================
// Classic professional two-column resume template - Executive Luxe Edition
// Styled with a premium split sidebar, clean vertical timelines, and linear skill meters

const ProfessionalTemplate = ({ resume }) => {
  const { personal, about, skills, education, experience, projects, certifications, achievements, languages } = resume;

  return (
    <div className="w-full min-h-[1123px] bg-[#0c0c0c] font-sans text-main text-[13.5px] flex leading-relaxed relative overflow-hidden bg-grid-metallic">
      {/* Decorative vertical separator line on side-grid */}
      <div className="absolute top-0 bottom-0 left-[32%] w-[1px] bg-[var(--color-border-subtle)]" />

      {/* Left Sidebar (32% width) */}
      <div className="w-[32%] bg-[#101010] text-main px-8 py-10 space-y-8 flex-shrink-0 z-10">
        {/* Name Block */}
        <div className="pb-6 border-b border-[var(--color-border-subtle)]">
          <h1 className="font-display text-2xl font-bold text-main leading-tight tracking-wide uppercase">
            {personal?.fullName || "Your Name"}
          </h1>
          {personal?.role && (
            <p className="font-display text-[10px] text-accent font-semibold tracking-[0.25em] uppercase mt-2">
              {personal.role}
            </p>
          )}
          <div className="w-10 h-[2px] bg-accent mt-4" />
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h2 className="font-display text-xs font-bold text-accent uppercase tracking-[0.2em]">
            Contact
          </h2>
          <div className="space-y-3 text-xs text-muted font-medium">
            {personal?.email && (
              <p className="flex items-center gap-2 hover:text-accent transition-colors">
                <span className="text-accent/60">✉</span>
                <span className="truncate">{personal.email}</span>
              </p>
            )}
            {personal?.phone && (
              <p className="flex items-center gap-2">
                <span className="text-accent/60">📱</span>
                <span>{personal.phone}</span>
              </p>
            )}
            {personal?.location && (
              <p className="flex items-center gap-2">
                <span className="text-accent/60">📍</span>
                <span>{personal.location}</span>
              </p>
            )}
            {personal?.linkedin && (
              <p className="flex items-center gap-2 hover:text-accent transition-colors">
                <span className="text-accent/60">🔗</span>
                <span className="truncate">LinkedIn</span>
              </p>
            )}
            {personal?.github && (
              <p className="flex items-center gap-2 hover:text-accent transition-colors">
                <span className="text-accent/60">⚡</span>
                <span className="truncate">GitHub</span>
              </p>
            )}
            {personal?.portfolio && (
              <p className="flex items-center gap-2 hover:text-accent transition-colors">
                <span className="text-accent/60">🌐</span>
                <span className="truncate">Portfolio</span>
              </p>
            )}
          </div>
        </div>

        {/* Skills (Executive Linear Progress Meters) */}
        {skills?.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-xs font-bold text-accent uppercase tracking-[0.2em]">
              Key Skills
            </h2>
            <div className="space-y-3.5">
              {skills.map((skill, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-main tracking-wide">{skill.name}</span>
                    <span className="text-[10px] text-accent font-semibold uppercase tracking-wider">
                      {skill.level || "intermediate"}
                    </span>
                  </div>
                  <div className="w-full bg-[var(--color-border-subtle)] rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-accent h-1 rounded-full group-hover:bg-accent/80 transition-colors"
                      style={{
                        width: skill.level === "expert" ? "100%" : skill.level === "advanced" ? "80%" : skill.level === "intermediate" ? "60%" : "35%"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <div className="space-y-4 pt-2">
            <h2 className="font-display text-xs font-bold text-accent uppercase tracking-[0.2em]">
              Languages
            </h2>
            <div className="space-y-2">
              {languages.map((lang, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted font-medium uppercase tracking-wider">{lang}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content Panel (68% width) */}
      <div className="flex-1 px-10 py-10 space-y-10 overflow-y-auto z-10">
        {/* Summary */}
        {about && (
          <section className="mb-2">
            <h2 className="font-display text-[14px] font-bold uppercase tracking-[0.2em] text-accent mb-4">
              Executive Summary
            </h2>
            <p className="text-muted leading-relaxed font-light text-[14px]">
              {about}
            </p>
          </section>
        )}

        {/* Experience Timeline */}
        {experience?.length > 0 && (
          <section>
            <h2 className="font-display text-[14px] font-bold uppercase tracking-[0.2em] text-accent mb-6">
              Professional Experience
            </h2>
            <div className="space-y-8 relative pl-1">
              {experience.map((exp, i) => (
                <div key={i} className="relative pl-6 border-l border-accent/15 py-1 first:pt-0 last:pb-0">
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full border-2 border-accent bg-[#0c0c0c] z-10" />
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="font-bold text-main text-[15px] tracking-wide">
                      {exp.role}
                    </h3>
                    <span className="text-xs font-semibold text-accent/80 tracking-wider uppercase">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted font-semibold tracking-wider uppercase mb-2.5">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </div>
                  <p className="text-muted leading-relaxed font-light text-[13.5px] whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Timeline */}
        {education?.length > 0 && (
          <section>
            <h2 className="font-display text-[14px] font-bold uppercase tracking-[0.2em] text-accent mb-6">
              Education
            </h2>
            <div className="space-y-6 relative pl-1">
              {education.map((edu, i) => (
                <div key={i} className="relative pl-6 border-l border-accent/15 py-1 first:pt-0 last:pb-0">
                  <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full border-2 border-accent bg-[#0c0c0c] z-10" />
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3 className="font-bold text-main text-[14.5px]">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <span className="text-xs font-semibold text-accent/80 tracking-wider uppercase">
                      {edu.institution} {edu.location && `• ${edu.location}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted font-semibold uppercase mb-2">
                    <span>{edu.startDate} – {edu.endDate}</span>
                    {edu.grade && <span className="text-accent/60">GPA: {edu.grade}</span>}
                  </div>
                  {edu.description && (
                    <p className="text-muted leading-relaxed font-light text-[13px]">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <section>
            <h2 className="font-display text-[14px] font-bold uppercase tracking-[0.2em] text-accent mb-6">
              Key Projects
            </h2>
            <div className="space-y-6 relative pl-1">
              {projects.map((proj, i) => (
                <div key={i} className="relative pl-6 border-l border-accent/15 py-1 first:pt-0 last:pb-0">
                  <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full border-2 border-accent bg-[#0c0c0c] z-10" />
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1.5">
                    <h3 className="font-bold text-main text-[14.5px] flex items-center gap-2">
                      {proj.name}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-accent hover:underline font-light uppercase tracking-wider">
                          ↗ Link
                        </a>
                      )}
                    </h3>
                    <span className="text-[10px] text-muted tracking-wider uppercase font-medium">{proj.date}</span>
                  </div>
                  {proj.technologies?.length > 0 && (
                    <p className="text-[11px] text-accent/60 font-semibold tracking-wider uppercase mb-2">
                      {proj.technologies.join(" • ")}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-muted leading-relaxed font-light text-[13.5px]">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <section>
            <h2 className="font-display text-[14px] font-bold uppercase tracking-[0.2em] text-accent mb-4">
              Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#121212]/50 border border-[var(--color-border-subtle)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-[13.5px] font-semibold text-main leading-tight">{cert.name}</h4>
                    <p className="text-[11px] text-muted font-medium mt-0.5">{cert.issuer} • {cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements?.length > 0 && (
          <section>
            <h2 className="font-display text-[14px] font-bold uppercase tracking-[0.2em] text-accent mb-4">
              Achievements
            </h2>
            <ul className="space-y-2">
              {achievements.map((ach, i) => (
                <li key={i} className="flex items-start gap-2.5 text-muted leading-relaxed font-light">
                  <span className="text-accent text-[10px] mt-1.5">✦</span>
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
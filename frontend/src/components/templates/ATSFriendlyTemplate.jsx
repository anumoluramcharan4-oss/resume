// ==========================================
// src/components/templates/ATSFriendlyTemplate.jsx
// ==========================================
// Standard single-column, linear layout optimized for ATS parsers.
// Black & white styling, clean typographic hierarchies.

import SkillBadge from "../SkillBadge";

const ATSFriendlyTemplate = ({ resume }) => {
  const { personal, about, skills, education, experience, projects, certifications, achievements, languages } = resume;

  const Section = ({ title, children }) => (
    <div className="mb-6 last:mb-0 pb-4 border-b border-gray-100 dark:border-neutral-800">
      <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>{title}</span>
      </h2>
      <div className="text-gray-700 dark:text-neutral-300">
        {children}
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-[1123px] bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 font-serif px-16 py-14 leading-relaxed selection:bg-gray-200">
      {/* Header (Centered Contact Info) */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase mb-1">
          {personal?.fullName || "Your Name"}
        </h1>
        {personal?.role && (
          <p className="text-xs font-semibold text-gray-600 dark:text-neutral-400 tracking-widest uppercase mb-3">
            {personal.role}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-neutral-400">
          {personal?.email && (
            <span className="flex items-center gap-1">
              <span>{personal.email}</span>
            </span>
          )}
          {personal?.phone && (
            <span className="flex items-center gap-1">
              <span>|</span>
              <span>{personal.phone}</span>
            </span>
          )}
          {personal?.location && (
            <span className="flex items-center gap-1">
              <span>|</span>
              <span>{personal.location}</span>
            </span>
          )}
          {personal?.linkedin && (
            <span className="flex items-center gap-1">
              <span>|</span>
              <span>{personal.linkedin}</span>
            </span>
          )}
          {personal?.github && (
            <span className="flex items-center gap-1">
              <span>|</span>
              <span>{personal.github}</span>
            </span>
          )}
          {personal?.portfolio && (
            <span className="flex items-center gap-1">
              <span>|</span>
              <span>{personal.portfolio}</span>
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {about && (
        <Section title="Professional Summary">
          <p className="text-xs leading-relaxed font-sans text-gray-700 dark:text-neutral-300">
            {about}
          </p>
        </Section>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <Section title="Core Competencies">
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.map((skill, i) => (
              <span 
                key={i} 
                className="text-[11px] font-sans font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 border border-gray-200 dark:border-neutral-700 uppercase"
              >
                {typeof skill === "string" ? skill : skill.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Work Experience */}
      {experience?.length > 0 && (
        <Section title="Professional Experience">
          <div className="space-y-4 font-sans">
            {experience.map((exp, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {exp.role} — <span className="font-semibold text-gray-700 dark:text-neutral-300">{exp.company}</span>
                  </span>
                  <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400 uppercase">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-[10px] text-gray-500 dark:text-neutral-500 uppercase font-semibold mb-1.5">{exp.location}</p>
                )}
                <p className="text-gray-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line text-xs">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <Section title="Technical Projects">
          <div className="space-y-4 font-sans">
            {projects.map((proj, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {proj.name} 
                    {proj.liveUrl && (
                      <span className="text-[10px] font-normal text-gray-500 dark:text-neutral-500 lowercase ml-2">
                        ({proj.liveUrl})
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400 uppercase">
                    {proj.date || proj.startDate}
                  </span>
                </div>
                {proj.technologies?.length > 0 && (
                  <p className="text-[11px] text-gray-600 dark:text-neutral-400 font-semibold uppercase tracking-wider mb-1.5">
                    Technologies: {proj.technologies.join(", ")}
                  </p>
                )}
                {proj.description && (
                  <p className="text-gray-700 dark:text-neutral-300 leading-relaxed text-xs">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <Section title="Education">
          <div className="space-y-3 font-sans">
            {education.map((edu, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </span>
                  <span className="text-[11px] font-medium text-gray-500 dark:text-neutral-400 uppercase">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-600 dark:text-neutral-400">
                  <span>{edu.institution}</span>
                  {edu.grade && <span className="font-semibold">GPA/Grade: {edu.grade}</span>}
                </div>
                {edu.description && (
                  <p className="text-gray-500 dark:text-neutral-500 mt-1 leading-relaxed text-[11px]">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <Section title="Licenses & Certifications">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-sans text-xs">
            {certifications.map((cert, i) => (
              <div key={i} className="p-2 border border-gray-100 dark:border-neutral-800 rounded">
                <h4 className="font-bold text-gray-950 dark:text-white leading-tight">{cert.name}</h4>
                <p className="text-[10px] text-gray-500 dark:text-neutral-400 font-medium mt-0.5">{cert.issuer} • {cert.date}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Achievements */}
      {achievements?.length > 0 && (
        <Section title="Honors & Achievements">
          <ul className="list-disc pl-4 space-y-1 font-sans text-xs">
            {achievements.map((ach, i) => (
              <li key={i} className="text-gray-700 dark:text-neutral-300">
                {typeof ach === "string" ? ach : (
                  <>
                    <strong className="text-gray-900 dark:text-white">{ach.title}</strong>
                    {ach.description && ` — ${ach.description}`}
                  </>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Languages */}
      {languages?.length > 0 && (
        <Section title="Languages">
          <div className="flex flex-wrap gap-4 font-sans text-xs pt-1">
            {languages.map((lang, i) => (
              <span key={i} className="text-gray-700 dark:text-neutral-300 font-medium">
                • {typeof lang === "string" ? lang : `${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ""}`}
              </span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default ATSFriendlyTemplate;

import React, { useEffect } from 'react';
import { getChapters } from '../config/constants';
import ChapterAccordion from './ChapterAccordion';
import { BookOpen, RefreshCw } from 'lucide-react';

export default function SubjectForm({ subjectName }) {
  const chapters = getChapters(subjectName);

  useEffect(() => {
    const handleOpenNext = (event) => {
      if (event.detail?.subjectName !== subjectName) return;

      const currentChapter = event.detail?.chapterName;
      const currentIndex = chapters.findIndex((ch) => ch === currentChapter);

      if (currentIndex === -1) return;

      const nextChapter = chapters[currentIndex + 1];
      if (!nextChapter) return;

      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('openChapterAccordion', {
            detail: { subjectName, chapterName: nextChapter },
          })
        );
      }, 380);
    };

    window.addEventListener('openNextChapterAccordion', handleOpenNext);
    return () => window.removeEventListener('openNextChapterAccordion', handleOpenNext);
  }, [subjectName, chapters]);

  const resetSubject = () => {
    if (window.confirm(`Are you sure you want to reset all progress for ${subjectName}? This cannot be undone.`)) {
      chapters.forEach(ch => {
        const storageKey = `trackpro_${subjectName}_${ch.replace(/\s+/g, '')}`;
        window.localStorage.removeItem(storageKey);
      });
      window.location.reload();
    }
  };

  return (
    <div className="glass-card mb-6 mb-8 pt-4">
      <div className="flex justify-between items-center mb-4 border-b pb-2" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <h2 className="flex items-center gap-2" style={{ fontSize: '1.5rem', margin: 0 }}>
          <BookOpen size={24} color="var(--accent-primary)" />
          {subjectName}
        </h2>
        <button
          className="btn btn-outline flex items-center gap-1"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          onClick={resetSubject}
          title={`Reset ${subjectName}`}
        >
          <RefreshCw size={14} /> Reset Subject
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {chapters.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No chapters added for this subject yet.</p>}
        {chapters.map((chapterName, idx) => (
          <ChapterAccordion
            key={idx}
            subjectName={subjectName}
            chapterName={chapterName}
          />
        ))}
      </div>
    </div>
  );
}
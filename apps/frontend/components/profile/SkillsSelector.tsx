'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api/client';

interface Skill {
  id: string;
  nameEn: string;
  nameAr?: string;
}

interface ProfileSkill {
  id: string;
  skill: Skill;
}

interface SkillsSelectorProps {
  selectedSkills: ProfileSkill[];
  onSkillsChange: (skills: ProfileSkill[]) => void;
  locale: string;
  disabled?: boolean;
}

export default function SkillsSelector({
  selectedSkills,
  onSkillsChange,
  locale,
  disabled = false,
}: SkillsSelectorProps) {
  const t = useTranslations('profile');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch skills based on search term
  useEffect(() => {
    const fetchSkills = async () => {
      if (searchTerm.length < 2) {
        setAvailableSkills([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await api.get<Skill[]>(`/skills?search=${searchTerm}&limit=10`);
        setAvailableSkills(response);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
        setAvailableSkills([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchSkills, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleAddSkill = (skill: Skill) => {
    // Check if skill is already selected
    if (selectedSkills.some((ps) => ps.skill.id === skill.id)) {
      return;
    }

    // Add skill to selected skills
    const newProfileSkill: ProfileSkill = {
      id: crypto.randomUUID(), // Temporary ID for UI
      skill,
    };

    onSkillsChange([...selectedSkills, newProfileSkill]);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (profileSkillId: string) => {
    onSkillsChange(selectedSkills.filter((ps) => ps.id !== profileSkillId));
  };

  const getSkillName = (skill: Skill) => {
    return locale === 'ar' && skill.nameAr ? skill.nameAr : skill.nameEn;
  };

  return (
    <div className="space-y-3">
      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSkills.map((profileSkill) => (
            <Badge
              key={profileSkill.id}
              variant="info"
              className="flex items-center gap-1 px-3 py-1"
            >
              {getSkillName(profileSkill.skill)}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(profileSkill.id)}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      {!disabled && (
        <div className="relative">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={t('searchSkills')}
            className="w-full"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && searchTerm.length >= 2 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {isSearching ? (
                <div className="px-4 py-2 text-gray-500">{t('searching')}</div>
              ) : availableSkills.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">{t('noSkillsFound')}</div>
              ) : (
                availableSkills.map((skill) => {
                  const isSelected = selectedSkills.some((ps) => ps.skill.id === skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      disabled={isSelected}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        isSelected ? 'text-gray-400 cursor-not-allowed' : ''
                      }`}
                    >
                      {getSkillName(skill)}
                      {isSelected && ' (Selected)'}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}

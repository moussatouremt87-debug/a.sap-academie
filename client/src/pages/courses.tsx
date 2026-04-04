'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { SEO } from '@/components/seo';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  Clock,
  Euro,
  GraduationCap,
  Zap,
  Award,
  Star,
} from 'lucide-react';
import clsx from 'clsx';

// Types
interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: number;
  price: number;
  badge?: 'Certifiant' | 'Nouveau' | 'Populaire';
  icon?: string;
}

type SAPModule = 'FI/CO' | 'MM' | 'SD' | 'PP' | 'HCM' | 'BASIS' | 'ABAP' | 'Analytics' | 'Tous';
type LevelFilter = 'Tous' | 'Débutant' | 'Intermédiaire' | 'Avancé';

// Constants
const SAP_MODULES: SAPModule[] = [
  'Tous',
  'FI/CO',
  'MM',
  'SD',
  'PP',
  'HCM',
  'BASIS',
  'ABAP',
  'Analytics',
];

const LEVELS: LevelFilter[] = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];

const BADGE_COLORS = {
  Certifiant: 'bg-blue-100 text-blue-800 border-blue-300',
  Nouveau: 'bg-green-100 text-green-800 border-green-300',
  Populaire: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

const BADGE_ICONS = {
  Certifiant: Award,
  Nouveau: Zap,
  Populaire: Star,
};

// Get category icon based on SAP module
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'FI/CO':
      return BookOpen;
    case 'MM':
      return BookOpen;
    case 'SD':
      return BookOpen;
    case 'PP':
      return BookOpen;
    case 'HCM':
      return GraduationCap;
    case 'BASIS':
      return BookOpen;
    case 'ABAP':
      return BookOpen;
    case 'Analytics':
      return BookOpen;
    default:
      return BookOpen;
  }
};

// Skeleton loader for course cards
const CourseCardSkeleton = () => (
  <Card className="h-full flex flex-col border-0 shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-6 rounded" />
      </div>
      <Skeleton className="h-5 w-3/4" />
    </CardHeader>
    <CardContent className="flex-1 flex flex-col gap-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="mt-auto space-y-3">
        <Skeleton className="h-5 w-20" />
        <div className="flex items-center gap-4 text-sm">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    </CardContent>
  </Card>
);

// Course card component
const CourseCard: React.FC<{ course: Course; onClick: () => void }> = ({
  course,
  onClick,
}) => {
  const CategoryIcon = getCategoryIcon(course.category);
  const BadgeIcon = course.badge ? BADGE_ICONS[course.badge] : null;

  return (
    <Card className="h-full flex flex-col border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {course.badge && (
              <Badge
                variant="outline"
                className={`text-xs font-semibold whitespace-nowrap ${
                  BADGE_COLORS[course.badge]
                } flex items-center gap-1`}
              >
                {BadgeIcon && <BadgeIcon className="w-3 h-3" />}
                {course.badge}
              </Badge>
            )}
          </div>
          <CategoryIcon className="w-5 h-5 text-[#0070F3]" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
          {course.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 pb-4">
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {course.description}
        </p>

        {/* Level Badge */}
        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant="secondary"
            className="text-xs bg-gray-100 text-gray-700 border-gray-200"
          >
            {course.level}
          </Badge>
        </div>

        {/* Duration and Price */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{course.duration}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Euro className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-900">
              {course.price.toFixed(0)}€
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onClick}
          className="w-full mt-4 bg-[#F4AB3A] hover:bg-[#E09A2A] text-gray-900 font-semibold"
        >
          Voir le programme
        </Button>
      </CardContent>
    </Card>
  );
};

// Filter tabs component
const FilterTabs: React.FC<{
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
  label: string;
}> = ({ items, selected, onSelect, label }) => (
  <div className="space-y-3">
    <p className="text-sm font-semibold text-gray-700">{label}</p>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Button
          key={item}
          onClick={() => onSelect(item)}
          variant={selected === item ? 'default' : 'outline'}
          className={clsx(
            'text-sm font-medium transition-colors',
            selected === item
              ? 'bg-[#0070F3] text-white border-[#0070F3]'
              : 'border-gray-300 text-gray-700 hover:border-[#0070F3] hover:text-[#0070F3]'
          )}
        >
          {item}
        </Button>
      ))}
    </div>
  </div>
);

// Main component
export const CoursesPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [selectedModule, setSelectedModule] = useState<SAPModule>('Tous');
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>('Tous');

  // Fetch courses
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const moduleMatch =
      selectedModule === 'Tous' || course.category === selectedModule;
    const levelMatch =
      selectedLevel === 'Tous' || course.level === selectedLevel;
    return moduleMatch && levelMatch;
  });

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <>
      <SEO
        title="Catalogue des Formations SAP | A.SAP Académie"
        description="Découvrez notre catalogue complet de formations SAP certifiantes. FI/CO, MM, SD, PP, HCM, BASIS, ABAP, Analytics. Formation en ligne et en présentiel."
        keywords="formation SAP, cours SAP, certification SAP, FI/CO, MM, SD, PP, HCM, BASIS, ABAP, Analytics, e-learning"
        url="/courses"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header section */}
        <div className="bg-gradient-to-r from-[#0070F3] to-[#0055CC] text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Catalogue des Formations
              </h1>
            </div>
            <p className="text-lg text-blue-100 max-w-2xl">
              Explorez nos formations SAP certifiantes, conçues pour tous les niveaux
              d'expertise. Acquérez les compétences essentielles pour progresser dans votre
              carrière SAP.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter section */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FilterTabs
                items={SAP_MODULES}
                selected={selectedModule}
                onSelect={(item) => setSelectedModule(item as SAPModule)}
                label="Module SAP"
              />
              <FilterTabs
                items={LEVELS}
                selected={selectedLevel}
                onSelect={(item) => setSelectedLevel(item as LevelFilter)}
                label="Niveau"
              />
            </div>

            {/* Active filters display */}
            {(selectedModule !== 'Tous' || selectedLevel !== 'Tous') && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Filtres actifs : {filteredCourses.length} cours trouvé(s)
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedModule !== 'Tous' && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100"
                      onClick={() => setSelectedModule('Tous')}
                    >
                      Module: {selectedModule} ✕
                    </Badge>
                  )}
                  {selectedLevel !== 'Tous' && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100"
                      onClick={() => setSelectedLevel('Tous')}
                    >
                      Niveau: {selectedLevel} ✕
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            /* Empty state */
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune formation trouvée
              </h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos critères de filtre pour découvrir nos formations.
              </p>
              <Button
                onClick={() => {
                  setSelectedModule('Tous');
                  setSelectedLevel('Tous');
                }}
                className="bg-[#0070F3] hover:bg-[#0055CC] text-white"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            /* Course grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleCourseClick(course.id)}
                />
              ))}
            </div>
          )}

          {/* Results summary */}
          {!isLoading && filteredCourses.length > 0 && (
            <div className="mt-8 text-center text-gray-600 text-sm">
              <p>
                Affichage de {filteredCourses.length} sur {courses.length} formations
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA section */}
        {filteredCourses.length > 0 && (
          <div className="bg-gradient-to-r from-[#0070F3] to-[#0055CC] text-white py-12 px-4 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Vous n'avez pas trouvé ce que vous cherchez ?
              </h2>
              <p className="text-lg text-blue-100 mb-6">
                Contactez notre équipe pédagogique pour des formations sur mesure ou
                pour plus d'informations.
              </p>
              <Button className="bg-[#F4AB3A] hover:bg-[#E09A2A] text-gray-900 font-semibold px-8 py-3 text-base">
                Nous contacter
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CoursesPage;

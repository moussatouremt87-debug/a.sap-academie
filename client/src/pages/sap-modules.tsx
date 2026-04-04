'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'wouter';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Button,
} from '@/components/ui/button';
import {
  Badge,
} from '@/components/ui/badge';
import {
  Input,
} from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowLeft,
  Code,
  Grid3x3,
} from 'lucide-react';
import { SAP_MODULES, SAP_TRANSACTIONS, SAP_GLOSSARY } from '@/data/sap-modules-db';

// ============================================================================
// MODULE CARD COMPONENT
// ============================================================================
interface ModuleCardProps {
  module: typeof SAP_MODULES[0];
  isExpanded: boolean;
  onToggle: () => void;
  onViewTransactions: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isExpanded,
  onToggle,
  onViewTransactions,
}) => {
  const IconComponent = module.icon;
  const subModulesCount = module.subModules?.length || 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant':
        return 'bg-green-100 text-green-800';
      case 'Intermédiaire':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avancé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModuleColor = (code: string) => {
    const colors: { [key: string]: string } = {
      FI: 'bg-blue-100 text-blue-800',
      CO: 'bg-purple-100 text-purple-800',
      MM: 'bg-orange-100 text-orange-800',
      SD: 'bg-green-100 text-green-800',
      PP: 'bg-pink-100 text-pink-800',
      HCM: 'bg-indigo-100 text-indigo-800',
      ABAP: 'bg-cyan-100 text-cyan-800',
      BASIS: 'bg-gray-100 text-gray-800',
    };
    return colors[code] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow h-full"
      onClick={onToggle}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <IconComponent className="w-6 h-6" />
              <Badge className={getModuleColor(module.code)}>
                {module.code}
              </Badge>
            </div>
            <CardTitle className="text-lg">{module.name}</CardTitle>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 flex-shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {module.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {module.lessons} leçons
          </Badge>
          <Badge className={`text-xs ${getDifficultyColor(module.difficulty)}`}>
            {module.difficulty}
          </Badge>
          {subModulesCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {subModulesCount} sous-modules
            </Badge>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Description complète</h4>
              <p className="text-sm text-gray-700">{module.longDescription}</p>
            </div>

            {subModulesCount > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Sous-modules</h4>
                <ul className="space-y-1">
                  {module.subModules?.map((subModule) => (
                    <li key={subModule.id} className="text-sm text-gray-700">
                      <span className="font-medium">{subModule.name}</span>
                      <span className="text-gray-500 ml-2">
                        ({subModule.lessons} leçons)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {module.keyTransactions && module.keyTransactions.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  Transactions clés (8 premières)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {module.keyTransactions.slice(0, 8).map((tcode) => (
                    <Badge key={tcode} variant="outline" className="text-xs font-mono">
                      {tcode}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle start course
                }}
              >
                Commencer la formation
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTransactions();
                }}
              >
                Voir les transactions
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================================================
// TRANSACTION CARD COMPONENT
// ============================================================================
interface TransactionCardProps {
  transaction: typeof SAP_TRANSACTIONS[0];
  isExpanded: boolean;
  onToggle: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  isExpanded,
  onToggle,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant':
        return 'bg-green-100 text-green-800';
      case 'Intermédiaire':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avancé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModuleColor = (code: string) => {
    const colors: { [key: string]: string } = {
      FI: 'bg-blue-100 text-blue-800',
      CO: 'bg-purple-100 text-purple-800',
      MM: 'bg-orange-100 text-orange-800',
      SD: 'bg-green-100 text-green-800',
      PP: 'bg-pink-100 text-pink-800',
      HCM: 'bg-indigo-100 text-indigo-800',
      ABAP: 'bg-cyan-100 text-cyan-800',
      BASIS: 'bg-gray-100 text-gray-800',
    };
    return colors[code] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onToggle}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-mono font-bold text-lg mb-2">
              {transaction.tcode}
            </div>
            <CardTitle className="text-base">{transaction.name}</CardTitle>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 flex-shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {transaction.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getModuleColor(transaction.module)}>
            {transaction.module}
          </Badge>
          <Badge className={`${getDifficultyColor(transaction.difficulty)}`}>
            {transaction.difficulty}
          </Badge>
          {transaction.category && (
            <Badge variant="secondary">{transaction.category}</Badge>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Description complète</h4>
              <p className="text-sm text-gray-700">{transaction.description}</p>
            </div>

            {transaction.usageExample && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Exemple d'utilisation</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {transaction.usageExample}
                </p>
              </div>
            )}

            {transaction.relatedTcodes && transaction.relatedTcodes.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Transactions associées</h4>
                <div className="flex flex-wrap gap-2">
                  {transaction.relatedTcodes.map((tcode) => (
                    <Badge
                      key={tcode}
                      variant="outline"
                      className="cursor-pointer text-xs font-mono hover:bg-gray-100"
                    >
                      {tcode}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {transaction.notes && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Notes</h4>
                <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                  {transaction.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================================================
// GLOSSARY CARD COMPONENT
// ============================================================================
interface GlossaryCardProps {
  entry: typeof SAP_GLOSSARY[0];
}

const GlossaryCard: React.FC<GlossaryCardProps> = ({ entry }) => {
  const getModuleColor = (code: string) => {
    const colors: { [key: string]: string } = {
      FI: 'bg-blue-100 text-blue-800',
      CO: 'bg-purple-100 text-purple-800',
      MM: 'bg-orange-100 text-orange-800',
      SD: 'bg-green-100 text-green-800',
      PP: 'bg-pink-100 text-pink-800',
      HCM: 'bg-indigo-100 text-indigo-800',
      ABAP: 'bg-cyan-100 text-cyan-800',
      BASIS: 'bg-gray-100 text-gray-800',
    };
    return colors[code] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{entry.term}</CardTitle>
          {entry.module && (
            <Badge className={getModuleColor(entry.module) + " flex-shrink-0"}>
              {entry.module}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700">{entry.definition}</p>

        {entry.example && (
          <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
            {entry.example}
          </p>
        )}

        {entry.relatedTerms && entry.relatedTerms.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Termes associés</p>
            <div className="flex flex-wrap gap-2">
              {entry.relatedTerms.map((term) => (
                <Badge
                  key={term}
                  variant="outline"
                  className="cursor-pointer text-xs hover:bg-gray-100"
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
const SapModulesPage: React.FC = () => {
  const [, navigate] = useRouter();
  const [activeTab, setActiveTab] = useState('modules');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedTcode, setExpandedTcode] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('Tous');
  const [difficultyFilter, setDifficultyFilter] = useState('Tous');
  const [glossarySearch, setGlossarySearch] = useState('');

  // ========================================================================
  // MODULES TAB LOGIC
  // ========================================================================
  const filteredModules = useMemo(() => {
    return SAP_MODULES.filter((module) => {
      const matchesSearch =
        module.name.toLowerCase().includes(search.toLowerCase()) ||
        module.code.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [search]);

  // ========================================================================
  // TRANSACTIONS TAB LOGIC
  // ========================================================================
  const filteredTransactions = useMemo(() => {
    return SAP_TRANSACTIONS.filter((tcode) => {
      const matchesSearch =
        tcode.tcode.toLowerCase().includes(search.toLowerCase()) ||
        tcode.name.toLowerCase().includes(search.toLowerCase());

      const matchesModule =
        moduleFilter === 'Tous' || tcode.module === moduleFilter;

      const matchesDifficulty =
        difficultyFilter === 'Tous' || tcode.difficulty === difficultyFilter;

      return matchesSearch && matchesModule && matchesDifficulty;
    });
  }, [search, moduleFilter, difficultyFilter]);

  // ========================================================================
  // GLOSSARY TAB LOGIC
  // ========================================================================
  const filteredGlossary = useMemo(() => {
    return SAP_GLOSSARY.filter((entry) => {
      const matchesSearch =
        entry.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        entry.definition.toLowerCase().includes(glossarySearch.toLowerCase());
      return matchesSearch;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [glossarySearch]);

  // Handle switching to transactions tab from module detail
  const handleViewTransactions = (moduleCode: string) => {
    setModuleFilter(moduleCode);
    setActiveTab('transactions');
  };

  // Calculate stats
  const totalModules = SAP_MODULES.length;
  const totalTransactions = SAP_TRANSACTIONS.length;
  const totalGlossary = SAP_GLOSSARY.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold">Référentiel SAP</h1>
            </div>
          </div>

          {/* STATS BAR */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-blue-600">{totalModules}</p>
                <p className="text-sm text-gray-600">Modules SAP</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-green-600">
                  {totalTransactions}
                </p>
                <p className="text-sm text-gray-600">Transactions (T-Codes)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-purple-600">
                  {totalGlossary}
                </p>
                <p className="text-sm text-gray-600">Termes du glossaire</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="glossaire">Glossaire</TabsTrigger>
          </TabsList>

          {/* TAB 1: MODULES */}
          <TabsContent value="modules" className="space-y-6">
            <div>
              <Input
                placeholder="Rechercher des modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isExpanded={expandedModule === module.id}
                  onToggle={() =>
                    setExpandedModule(
                      expandedModule === module.id ? null : module.id
                    )
                  }
                  onViewTransactions={() =>
                    handleViewTransactions(module.code)
                  }
                />
              ))}
            </div>

            {filteredModules.length === 0 && (
              <div className="text-center py-12">
                <Grid3x3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Aucun module trouvé</p>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: TRANSACTIONS */}
          <TabsContent value="transactions" className="space-y-6">
            {/* Search Bar */}
            <div>
              <Input
                placeholder="Rechercher par T-Code ou nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            {/* Module Filter */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Module</p>
              <div className="flex flex-wrap gap-2">
                {['Tous', 'FI', 'CO', 'MM', 'SD', 'PP', 'HCM', 'ABAP', 'BASIS'].map(
                  (module) => (
                    <Button
                      key={module}
                      variant={moduleFilter === module ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setModuleFilter(module)}
                    >
                      {module}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Niveau de difficulté</p>
              <div className="flex flex-wrap gap-2">
                {['Tous', 'Débutant', 'Intermédiaire', 'Avancé'].map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={
                      difficultyFilter === difficulty ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setDifficultyFilter(difficulty)}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tcode) => (
                  <TransactionCard
                    key={tcode.id}
                    transaction={tcode}
                    isExpanded={expandedTcode === tcode.id}
                    onToggle={() =>
                      setExpandedTcode(
                        expandedTcode === tcode.id ? null : tcode.id
                      )
                    }
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Code className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    Aucune transaction trouvée avec ces critères
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 3: GLOSSAIRE */}
          <TabsContent value="glossaire" className="space-y-6">
            <div>
              <Input
                placeholder="Rechercher dans le glossaire..."
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                className="max-w-md"
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGlossary.map((entry) => (
                <GlossaryCard key={entry.id} entry={entry} />
              ))}
            </div>

            {filteredGlossary.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Aucun terme trouvé</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SapModulesPage;

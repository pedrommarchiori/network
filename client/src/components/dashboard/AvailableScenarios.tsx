import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

interface ScenarioCategory {
  id: number;
  name: string;
  code: string;
  imageUrl: string;
  difficulty: "easy" | "medium" | "hard";
  practiceCount: number;
  scenarioCount: number;
}

interface AvailableScenariosProps {
  scenarios: ScenarioCategory[];
  isLoading?: boolean;
}

export function AvailableScenarios({ scenarios, isLoading = false }: AvailableScenariosProps) {
  const difficultyLabels = {
    easy: {
      label: "Nível Básico",
      className: "bg-blue-100 text-blue-800",
    },
    medium: {
      label: "Nível Intermediário",
      className: "bg-yellow-100 text-yellow-800",
    },
    hard: {
      label: "Nível Avançado",
      className: "bg-red-100 text-red-800",
    },
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Cenários Disponíveis</h2>
        <p className="text-sm text-gray-500 mb-4">
          Cenários possuem checklists e possibilidade de anexar vários exames
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative bg-white overflow-hidden shadow-sm rounded-lg">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="mt-3 h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Cenários Disponíveis</h2>
      <p className="text-sm text-gray-500 mb-4">
        Cenários possuem checklists e possibilidade de anexar vários exames
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="relative group bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
              <img
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                src={scenario.imageUrl}
                alt={scenario.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
              <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                {scenario.name.toUpperCase()}
              </div>
              <div className="absolute bottom-3 left-3 text-white font-bold">
                {scenario.practiceCount} Práticas realizadas
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    difficultyLabels[scenario.difficulty].className
                  }`}
                >
                  {difficultyLabels[scenario.difficulty].label}
                </span>
                <span className="text-xs text-gray-500">{scenario.scenarioCount} cenários</span>
              </div>
              <div className="mt-3">
                <Link href={`/practice/${scenario.code}`}>
                  <Button className="w-full" variant="default">
                    Ver cenários
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link href="/checklist-bank">
          <Button variant="outline" className="inline-flex items-center">
            Ver todos os cenários
            <svg
              className="ml-2 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}

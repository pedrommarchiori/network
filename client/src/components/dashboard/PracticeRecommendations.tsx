import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Recommendation {
  id: string | number;
  title: string;
  lastAttemptDate: string;
  bestScore: number;
  specialtyCode: string;
}

interface PracticeRecommendationsProps {
  recommendations: Recommendation[];
  isLoading?: boolean;
}

export function PracticeRecommendations({ recommendations, isLoading = false }: PracticeRecommendationsProps) {
  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Áreas para Aprimorar
        </h2>
        <Card>
          <div className="divide-y divide-gray-200">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-4 py-4 sm:px-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-1 bg-gray-200 rounded-full"></div>
                    <div className="ml-4">
                      <div className="h-4 w-48 bg-gray-200 rounded"></div>
                      <div className="h-3 w-32 bg-gray-100 rounded mt-2"></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="h-4 w-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Áreas para Aprimorar
        </h2>
        <Card className="p-6 text-center">
          <p className="text-gray-500">
            Você ainda não realizou práticas suficientes para recebermos recomendações personalizadas.
          </p>
          <Button className="mt-4">Explorar Práticas</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Áreas para Aprimorar
      </h2>
      <Card>
        <ul className="divide-y divide-gray-200">
          {recommendations.map((recommendation) => (
            <li key={recommendation.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-1 bg-red-500 rounded-full"></div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {recommendation.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        Última tentativa em {recommendation.lastAttemptDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-sm text-red-500 font-semibold">
                      <span>{recommendation.bestScore}</span>
                      <span className="text-xs text-gray-500 ml-1">Melhor nota</span>
                    </div>
                    <Link href={`/practice/${recommendation.specialtyCode}/${recommendation.id}`}>
                      <Button variant="outline" size="sm">
                        Praticar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface SpecialtyPerformance {
  specialtyName: string;
  attempts: number;
  userScore: number;
  averageScore: number;
}

interface CategoryPerformance {
  categoryName: string;
  percentage: number;
}

interface PerformanceAnalyticsProps {
  specialtyPerformance: SpecialtyPerformance[];
  categoryPerformance: CategoryPerformance[];
  isLoading?: boolean;
}

export function PerformanceAnalytics({
  specialtyPerformance,
  categoryPerformance,
  isLoading = false,
}: PerformanceAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Estatísticas</CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="px-4 py-0 sm:px-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between border-t border-gray-200 py-3">
                <Skeleton className="h-5 w-20" />
                <div className="flex items-center">
                  <Skeleton className="h-5 w-20 mr-4" />
                  <Skeleton className="h-5 w-10 mr-4" />
                  <Skeleton className="h-5 w-10" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Desempenho por Categoria</CardTitle>
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Statistics Section */}
      <Card>
        <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Estatísticas</CardTitle>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {specialtyPerformance.reduce((sum, item) => sum + item.attempts, 0)} práticas realizadas
          </span>
        </CardHeader>
        <CardContent className="px-4 py-0 sm:px-6 pb-4">
          {specialtyPerformance.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Nenhuma prática realizada ainda.
            </div>
          ) : (
            <>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={specialtyPerformance}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="specialtyName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Sua média" dataKey="userScore" fill="hsl(var(--primary))" />
                    <Bar name="Média geral" dataKey="averageScore" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {specialtyPerformance.map((specialty, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-t border-gray-200 py-3"
                >
                  <div className="text-sm text-gray-500">{specialty.specialtyName}</div>
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900 mr-4">
                      {specialty.attempts} {specialty.attempts === 1 ? "Tentativa" : "Tentativas"}
                    </div>
                    <div className="text-sm font-medium text-gray-900 mr-4">
                      {specialty.userScore.toFixed(1)}
                    </div>
                    <div className="text-sm font-medium text-primary-500">
                      {specialty.averageScore.toFixed(1)}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      {/* Performance by Category Section */}
      <Card>
        <CardHeader className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Desempenho por Categoria</CardTitle>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Todas
          </span>
        </CardHeader>
        <CardContent className="px-4 py-5 sm:p-6">
          {categoryPerformance.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Nenhuma prática realizada ainda.
            </div>
          ) : (
            <>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    outerRadius={90}
                    data={categoryPerformance}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="categoryName" />
                    <Radar
                      name="Desempenho"
                      dataKey="percentage"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 mt-4">
                {categoryPerformance.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {category.categoryName}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {category.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          category.percentage >= 90
                            ? "bg-green-400"
                            : category.percentage >= 75
                            ? "bg-cyan-400"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

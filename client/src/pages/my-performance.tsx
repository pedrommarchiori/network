import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyPerformance() {
  const [timeRange, setTimeRange] = useState("all");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  const { data: performanceData, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ["/api/users/me/performance"],
  });

  const { data: specialtyPerformance, isLoading: isLoadingSpecialtyPerf } = useQuery({
    queryKey: ["/api/users/me/specialty-performance"],
  });

  const { data: attempts, isLoading: isLoadingAttempts } = useQuery({
    queryKey: ["/api/attempts?userId=me"],
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: specialties, isLoading: isLoadingSpecialties } = useQuery({
    queryKey: ["/api/specialties"],
  });

  // Sample data for mockup
  const mockPerformanceOverTime = [
    { date: "Jan", score: 5.5 },
    { date: "Fev", score: 6.2 },
    { date: "Mar", score: 5.8 },
    { date: "Abr", score: 6.5 },
    { date: "Mai", score: 7.0 },
    { date: "Jun", score: 7.2 },
    { date: "Jul", score: 7.7 },
  ];

  const mockCategoryPerformance = [
    { category: "Anamnese", score: 85 },
    { category: "Apresentação", score: 100 },
    { category: "Conduta", score: 75 },
    { category: "Diagnóstico", score: 86 },
    { category: "Exame Físico", score: 90 },
    { category: "História Patológica", score: 40 },
  ];

  const mockSpecialtyPerformance = [
    { specialty: "Clínica", score: 7.8, attempts: 15 },
    { specialty: "Cirurgia", score: 6.9, attempts: 8 },
    { specialty: "GO - Obstetrícia", score: 8.2, attempts: 5 },
    { specialty: "GO - Ginecologia", score: 7.5, attempts: 7 },
    { specialty: "Pediatria", score: 8.0, attempts: 10 },
    { specialty: "Preventiva", score: 7.2, attempts: 6 },
  ];

  const mockRecentAttempts = [
    {
      id: 1,
      title: "Avaliação de Dor Torácica",
      specialty: "Clínica",
      date: new Date(2025, 4, 10),
      score: 8.5,
      timeSpent: 25,
    },
    {
      id: 2,
      title: "Apendicectomia",
      specialty: "Cirurgia",
      date: new Date(2025, 4, 8),
      score: 7.2,
      timeSpent: 40,
    },
    {
      id: 3,
      title: "Parto Normal",
      specialty: "GO - Obstetrícia",
      date: new Date(2025, 4, 5),
      score: 9.0,
      timeSpent: 35,
    },
    {
      id: 4,
      title: "Avaliação de Cefaleia",
      specialty: "Clínica",
      date: new Date(2025, 3, 29),
      score: 7.8,
      timeSpent: 20,
    },
    {
      id: 5,
      title: "Colecistectomia",
      specialty: "Cirurgia",
      date: new Date(2025, 3, 25),
      score: 6.5,
      timeSpent: 45,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 7) return "text-blue-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreChangeIcon = (score: number, prevScore: number) => {
    if (!prevScore) return null;
    
    const diff = score - prevScore;
    if (diff > 0) {
      return <ChevronUpIcon className="h-4 w-4 text-green-500" />;
    } else if (diff < 0) {
      return <ChevronDownIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Meu Desempenho</h1>
            <p className="text-sm text-gray-500 mt-1">
              Acompanhe seu progresso e identifique áreas para melhorar
            </p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Período</SelectLabel>
                  <SelectItem value="all">Todo período</SelectItem>
                  <SelectItem value="1month">Último mês</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="6months">Últimos 6 meses</SelectItem>
                  <SelectItem value="1year">Último ano</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Especialidade</SelectLabel>
                  <SelectItem value="all">Todas</SelectItem>
                  {(specialties || []).map((specialty: any) => (
                    <SelectItem key={specialty.id} value={specialty.id.toString()}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="categories">Por Categoria</TabsTrigger>
            <TabsTrigger value="specialties">Por Especialidade</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Progresso ao Longo do Tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingPerformance ? (
                    <div className="w-full h-80">
                      <Skeleton className="w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-full h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={mockPerformanceOverTime}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Desempenho por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingCategories ? (
                    <div className="w-full h-80">
                      <Skeleton className="w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-full h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          data={mockCategoryPerformance}
                          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="category" />
                          <Radar
                            name="Pontuação"
                            dataKey="score"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.6}
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingCategories ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i}>
                        <div className="flex justify-between mb-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mockCategoryPerformance.map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{category.category}</span>
                          <span className="text-sm font-medium">{category.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className={`h-4 rounded-full ${
                              category.score >= 90
                                ? "bg-green-500"
                                : category.score >= 75
                                ? "bg-blue-500"
                                : category.score >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${category.score}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {category.score >= 90
                            ? "Excelente domínio"
                            : category.score >= 75
                            ? "Bom domínio"
                            : category.score >= 60
                            ? "Precisa de atenção"
                            : "Requer estudo urgente"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Specialties Tab */}
          <TabsContent value="specialties">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Especialidade</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSpecialtyPerf ? (
                  <div className="w-full h-80">
                    <Skeleton className="w-full h-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-full h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={mockSpecialtyPerformance}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="specialty" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="score"
                            name="Nota"
                            fill="hsl(var(--primary))"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockSpecialtyPerformance.map((item, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <h3 className="text-lg font-medium mb-2">{item.specialty}</h3>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-gray-500">Nota média:</span>
                              <span className={`font-semibold ${getScoreColor(item.score)}`}>
                                {item.score.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Tentativas:</span>
                              <span className="font-semibold">{item.attempts}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Práticas</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAttempts ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="border-b border-gray-200 pb-4 mb-4">
                        <div className="flex justify-between mb-2">
                          <Skeleton className="h-5 w-64" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockRecentAttempts.map((attempt) => (
                      <div key={attempt.id} className="border-b border-gray-200 pb-4 mb-4 last:border-0">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium">{attempt.title}</h3>
                          <span className={`font-semibold ${getScoreColor(attempt.score)}`}>
                            {attempt.score.toFixed(1)}
                            {getScoreChangeIcon(attempt.score, attempt.score - 0.2)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>{format(attempt.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>{attempt.timeSpent} minutos</span>
                          </div>
                          <div>{attempt.specialty}</div>
                        </div>
                      </div>
                    ))}

                    {mockRecentAttempts.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Você ainda não realizou nenhuma prática.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

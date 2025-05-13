import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Download, Info } from "lucide-react";

// Tipos para as métricas avançadas
interface ProgressData {
  date: string;
  score: number;
  average: number;
}

interface SpecialtyScore {
  name: string;
  score: number;
  attemptCount: number;
  fullMark: 100;
}

interface TopicBreakdown {
  topic: string;
  score: number;
  nationalAverage: number;
}

interface AdvancedAnalyticsProps {
  isLoading?: boolean;
}

export function AdvancedAnalytics({ isLoading = false }: AdvancedAnalyticsProps) {
  const [showAverages, setShowAverages] = useState(true);
  const [timeRange, setTimeRange] = useState("1m");
  
  // Dados simulados de progresso ao longo do tempo
  const progressData: ProgressData[] = [
    { date: "Jan 05", score: 45, average: 40 },
    { date: "Jan 12", score: 50, average: 42 },
    { date: "Jan 19", score: 48, average: 44 },
    { date: "Jan 26", score: 60, average: 46 },
    { date: "Fev 02", score: 55, average: 48 },
    { date: "Fev 09", score: 65, average: 50 },
    { date: "Fev 16", score: 70, average: 52 },
    { date: "Fev 23", score: 67, average: 54 },
    { date: "Mar 02", score: 72, average: 56 },
    { date: "Mar 09", score: 78, average: 58 },
    { date: "Mar 16", score: 75, average: 60 },
    { date: "Mar 23", score: 82, average: 62 },
    { date: "Mar 30", score: 80, average: 64 },
    { date: "Abr 06", score: 85, average: 66 },
    { date: "Abr 13", score: 83, average: 68 },
    { date: "Abr 20", score: 87, average: 69 },
    { date: "Abr 27", score: 85, average: 70 },
    { date: "Mai 04", score: 90, average: 72 },
    { date: "Mai 11", score: 92, average: 73 },
  ];
  
  // Dados simulados para gráfico de radar por especialidade
  const specialtyData: SpecialtyScore[] = [
    { name: "Clínica Médica", score: 85, attemptCount: 42, fullMark: 100 },
    { name: "Pediatria", score: 72, attemptCount: 25, fullMark: 100 },
    { name: "Cirurgia", score: 68, attemptCount: 18, fullMark: 100 },
    { name: "Ginecologia", score: 80, attemptCount: 22, fullMark: 100 },
    { name: "Obstetrícia", score: 75, attemptCount: 20, fullMark: 100 },
    { name: "Saúde Mental", score: 60, attemptCount: 15, fullMark: 100 },
  ];
  
  // Dados simulados de breakdown por tópico
  const topicBreakdownData: TopicBreakdown[] = [
    { topic: "Cardiologia", score: 87, nationalAverage: 70 },
    { topic: "Pneumologia", score: 72, nationalAverage: 68 },
    { topic: "Neurologia", score: 65, nationalAverage: 62 },
    { topic: "Endocrinologia", score: 80, nationalAverage: 67 },
    { topic: "Nefrologia", score: 85, nationalAverage: 72 },
    { topic: "Gastroenterologia", score: 78, nationalAverage: 69 },
    { topic: "Hematologia", score: 71, nationalAverage: 65 },
    { topic: "Infecciosas", score: 88, nationalAverage: 74 },
  ];
  
  // Filtrar dados com base no intervalo de tempo
  const getFilteredData = () => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case "1w":
        cutoffDate.setDate(now.getDate() - 7);
        return progressData.slice(-2);
      case "1m":
        cutoffDate.setMonth(now.getMonth() - 1);
        return progressData.slice(-4);
      case "3m":
        cutoffDate.setMonth(now.getMonth() - 3);
        return progressData.slice(-12);
      case "6m":
        cutoffDate.setMonth(now.getMonth() - 6);
        return progressData;
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        return progressData;
      default:
        return progressData;
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-6 xl:col-span-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Análise Avançada de Desempenho</CardTitle>
          <CardDescription>
            Métricas detalhadas sobre seu progresso e desempenho comparativo
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1w">1 semana</SelectItem>
              <SelectItem value="1m">1 mês</SelectItem>
              <SelectItem value="3m">3 meses</SelectItem>
              <SelectItem value="6m">6 meses</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="progress">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="specialties">Especialidades</TabsTrigger>
            <TabsTrigger value="topics">Tópicos</TabsTrigger>
            <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Evolução de Pontuação</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-averages"
                  checked={showAverages}
                  onCheckedChange={setShowAverages}
                />
                <Label htmlFor="show-averages">Mostrar média nacional</Label>
              </div>
            </div>
            
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getFilteredData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    name="Sua pontuação"
                    dataKey="score"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  {showAverages && (
                    <Line
                      type="monotone"
                      name="Média nacional"
                      dataKey="average"
                      stroke="#82ca9d"
                      strokeDasharray="5 5"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 rounded-md bg-muted p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <h4 className="text-sm font-medium">Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Sua pontuação teve um aumento consistente de 47% nos últimos 3 meses,
                    superando a média nacional em 19 pontos percentuais. Continue praticando
                    regularmente para manter este progresso.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Progresso</p>
                  <p className="text-xl font-bold text-green-500">+47%</p>
                  <p className="text-xs text-muted-foreground">últimos 3 meses</p>
                </div>
                <div className="bg-background p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Acima da média</p>
                  <p className="text-xl font-bold text-blue-500">+19pts</p>
                  <p className="text-xs text-muted-foreground">diferença atual</p>
                </div>
                <div className="bg-background p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Tendência</p>
                  <p className="text-xl font-bold text-amber-500">Ascendente</p>
                  <p className="text-xs text-muted-foreground">projeção para próximo mês</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="specialties">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Desempenho por Especialidade</h3>
              
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={specialtyData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Pontuação"
                      dataKey="score"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {specialtyData.map((specialty) => (
                  <div 
                    key={specialty.name}
                    className="border rounded-md p-3 flex flex-col"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{specialty.name}</h4>
                      <Badge variant={specialty.score >= 80 ? "default" : "outline"}>
                        {specialty.score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {specialty.attemptCount} tentativas
                    </p>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${specialty.score}%` }}
                      />
                    </div>
                    <div className="mt-3 text-xs">
                      {specialty.score >= 80 ? (
                        <span className="text-green-500">Excelente domínio</span>
                      ) : specialty.score >= 70 ? (
                        <span className="text-blue-500">Bom domínio</span>
                      ) : specialty.score >= 60 ? (
                        <span className="text-amber-500">Conhecimento adequado</span>
                      ) : (
                        <span className="text-red-500">Precisa de mais estudo</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Desempenho por Tópico</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Por pontuação
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topicBreakdownData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="topic" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" name="Sua pontuação" fill="#8884d8" barSize={20} />
                    <Bar dataKey="nationalAverage" name="Média nacional" fill="#82ca9d" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 rounded-md bg-muted p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <h4 className="text-sm font-medium">Análise de Tópicos</h4>
                    <p className="text-sm text-muted-foreground">
                      Seus pontos fortes estão em Cardiologia, Nefrologia e Doenças Infecciosas,
                      com desempenho acima da média nacional. Recomendamos focar em Neurologia
                      para melhorar sua pontuação geral.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Comparativo com outros estudantes</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Pontuação vs. Média Nacional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Comparativo",
                              sua: 82,
                              media: 68,
                              top10: 92,
                            },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="sua" name="Sua pontuação" fill="#8884d8" />
                          <Bar dataKey="media" name="Média nacional" fill="#82ca9d" />
                          <Bar dataKey="top10" name="Top 10%" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Você está <span className="font-bold text-green-500">21% acima</span> da média nacional
                        e <span className="font-bold text-amber-500">11% abaixo</span> dos 10% melhores.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Tempo vs. Pontuação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { horas: 10, sua: 45, media: 40 },
                            { horas: 20, sua: 55, media: 48 },
                            { horas: 30, sua: 65, media: 56 },
                            { horas: 40, sua: 72, media: 62 },
                            { horas: 50, sua: 78, media: 68 },
                            { horas: 60, sua: 82, media: 72 },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="horas" label={{ value: "Horas de estudo", position: "insideBottom", offset: -5 }} />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="sua" name="Sua progressão" stroke="#8884d8" />
                          <Line type="monotone" dataKey="media" name="Progressão média" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Sua curva de aprendizado é <span className="font-bold text-green-500">mais eficiente</span> que a média, 
                        obtendo melhores resultados com menos horas de estudo.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Check, Clock, X, ArrowLeft, Info, HelpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface PracticeDetailProps {
  id: string;
}

export default function PracticeDetail({ id }: PracticeDetailProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [selectedTab, setSelectedTab] = useState("checklist");
  const [responses, setResponses] = useState<Record<number, boolean>>({});
  const [timer, setTimer] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [showFinishDialog, setShowFinishDialog] = useState<boolean>(false);
  const [isFinishLoading, setIsFinishLoading] = useState<boolean>(false);
  const [resultScore, setResultScore] = useState<number | null>(null);

  // Fetch checklist data
  const { data: checklist, isLoading: isLoadingChecklist } = useQuery({
    queryKey: [`/api/checklists/${id}`],
    enabled: !!id,
  });

  // Fetch checklist items
  const { data: checklistItems, isLoading: isLoadingItems } = useQuery({
    queryKey: [`/api/checklists/${id}/items`],
    enabled: !!id,
  });

  // Start a new attempt
  const startAttempt = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/attempts", {
        checklistId: parseInt(id)
      });
      return await res.json();
    },
    onSuccess: () => {
      setIsTimerActive(true);
    },
    onError: (error) => {
      toast({
        title: "Erro ao iniciar prática",
        description: String(error),
        variant: "destructive",
      });
    }
  });

  // Complete attempt
  const completeAttempt = useMutation({
    mutationFn: async (attemptId: number) => {
      const responseArray = Object.entries(responses).map(([itemId, completed]) => ({
        checklistItemId: parseInt(itemId),
        completed,
      }));
      
      const res = await apiRequest("PATCH", `/api/attempts/${attemptId}/complete`, {
        responses: responseArray
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setResultScore(data.score);
      setIsTimerActive(false);
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao completar prática",
        description: String(error),
        variant: "destructive",
      });
      setIsFinishLoading(false);
    }
  });

  // Start timer when component mounts
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive]);

  // Format timer to display time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle checkbox changes
  const handleCheckboxChange = (itemId: number, checked: boolean) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: checked,
    }));
  };

  // Get count of completed items
  const completedCount = Object.values(responses).filter(Boolean).length;
  const totalItems = checklistItems?.length || 0;
  const completionPercentage = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  // Handle finish practice
  const handleFinish = () => {
    setShowFinishDialog(true);
  };

  // Confirm finish
  const confirmFinish = async () => {
    setIsFinishLoading(true);
    if (startAttempt.data?.id) {
      await completeAttempt.mutate(startAttempt.data.id);
    }
    setShowFinishDialog(false);
  };

  // Group items by category
  const groupedItems = checklistItems?.reduce((acc: Record<string, any[]>, item: any) => {
    const categoryName = item.categoryName || "Sem categoria";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {});

  // Mock patient info for development
  const patientInfo = {
    name: "Carlos Alberto da Silva",
    age: 45,
    gender: "Masculino",
    chiefComplaint: "Dor no peito há 2 dias",
    vitalSigns: {
      bp: "140/90 mmHg",
      hr: "88 bpm",
      rr: "18 irpm",
      temp: "36.8 °C",
      o2sat: "96%",
    },
    medicalHistory: "Hipertensão, Diabetes Mellitus tipo 2",
    medications: "Losartana 50mg, Metformina 850mg",
    allergies: "Dipirona",
  };

  // Mock lab results for development
  const labResults = [
    { name: "Hemoglobina", value: "14.5 g/dL", reference: "13.5-17.5 g/dL" },
    { name: "Leucócitos", value: "8.200/mm³", reference: "4.000-10.000/mm³" },
    { name: "Plaquetas", value: "230.000/mm³", reference: "150.000-450.000/mm³" },
    { name: "Glicemia", value: "142 mg/dL", reference: "70-99 mg/dL" },
    { name: "Creatinina", value: "0.9 mg/dL", reference: "0.7-1.2 mg/dL" },
    { name: "Ureia", value: "35 mg/dL", reference: "15-40 mg/dL" },
    { name: "Potássio", value: "4.2 mEq/L", reference: "3.5-5.0 mEq/L" },
    { name: "Sódio", value: "138 mEq/L", reference: "135-145 mEq/L" },
    { name: "PCR", value: "2.4 mg/L", reference: "<5.0 mg/L" },
    { name: "Troponina I", value: "0.02 ng/mL", reference: "<0.04 ng/mL" },
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/checklist-bank")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isLoadingChecklist ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              checklist?.title || "Prática"
            )}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left sidebar with timer and info */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Tempo</span>
                  {checklist?.timeLimit && (
                    <span className="text-sm text-gray-500">
                      Limite: {checklist.timeLimit} min
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="text-4xl font-bold flex items-center">
                    <Clock className="mr-2 h-8 w-8 text-primary" />
                    {formatTime(timer)}
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  {!isTimerActive && !resultScore && (
                    <Button 
                      onClick={() => startAttempt.mutate()}
                      disabled={startAttempt.isPending}
                    >
                      {startAttempt.isPending ? "Iniciando..." : "Iniciar Prática"}
                    </Button>
                  )}
                  {isTimerActive && (
                    <Button 
                      variant="destructive" 
                      onClick={handleFinish}
                    >
                      Finalizar Prática
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Progresso</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={completionPercentage} className="h-2" />
                <div className="mt-2 text-sm text-center">
                  {completedCount} de {totalItems} itens ({Math.round(completionPercentage)}%)
                </div>
              </CardContent>
            </Card>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Info className="mr-2 h-4 w-4" />
                  Informações do Paciente
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Informações do Paciente</SheetTitle>
                  <SheetDescription>
                    Dados clínicos e exame físico
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-medium">Dados Pessoais</h3>
                    <div className="mt-1 text-sm">
                      <p><span className="font-medium">Nome:</span> {patientInfo.name}</p>
                      <p><span className="font-medium">Idade:</span> {patientInfo.age} anos</p>
                      <p><span className="font-medium">Sexo:</span> {patientInfo.gender}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium">Queixa Principal</h3>
                    <p className="mt-1 text-sm">{patientInfo.chiefComplaint}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium">Sinais Vitais</h3>
                    <div className="mt-1 text-sm grid grid-cols-2 gap-2">
                      <p><span className="font-medium">PA:</span> {patientInfo.vitalSigns.bp}</p>
                      <p><span className="font-medium">FC:</span> {patientInfo.vitalSigns.hr}</p>
                      <p><span className="font-medium">FR:</span> {patientInfo.vitalSigns.rr}</p>
                      <p><span className="font-medium">Temp:</span> {patientInfo.vitalSigns.temp}</p>
                      <p><span className="font-medium">SpO2:</span> {patientInfo.vitalSigns.o2sat}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium">História Médica</h3>
                    <p className="mt-1 text-sm">{patientInfo.medicalHistory}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium">Medicações em Uso</h3>
                    <p className="mt-1 text-sm">{patientInfo.medications}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium">Alergias</h3>
                    <p className="mt-1 text-sm">{patientInfo.allergies}</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Exames Complementares
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Exames Complementares</SheetTitle>
                  <SheetDescription>
                    Resultados de exames laboratoriais e de imagem
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <h3 className="font-medium">Exames Laboratoriais</h3>
                  <div className="mt-2 text-sm">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Exame</th>
                          <th className="text-left py-2">Resultado</th>
                          <th className="text-left py-2">Referência</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labResults.map((exam, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{exam.name}</td>
                            <td className="py-2">{exam.value}</td>
                            <td className="py-2 text-gray-500">{exam.reference}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Separator className="my-4" />

                  <h3 className="font-medium">Exames de Imagem</h3>
                  <div className="mt-2 text-sm">
                    <p className="mb-2"><span className="font-medium">Radiografia de Tórax:</span> Sem alterações significativas.</p>
                    <p><span className="font-medium">ECG:</span> Ritmo sinusal, sem alterações isquêmicas agudas.</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList>
                    <TabsTrigger value="checklist">Checklist</TabsTrigger>
                    <TabsTrigger value="scenario">Cenário</TabsTrigger>
                    <TabsTrigger value="instructions">Instruções</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <TabsContent value="checklist" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-320px)]">
                    {isLoadingItems ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-2 pl-4">
                              {[1, 2, 3].map((j) => (
                                <div key={j} className="flex items-center space-x-2">
                                  <Skeleton className="h-4 w-4" />
                                  <Skeleton className="h-4 w-full" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : checklistItems?.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhum item de checklist disponível.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(groupedItems || {}).map(([category, items]) => (
                          <div key={category} className="space-y-2">
                            <h3 className="font-medium text-lg text-primary">{category}</h3>
                            <div className="space-y-2 pl-4">
                              {items.map((item) => (
                                <div key={item.id} className="flex items-start space-x-2">
                                  <Checkbox
                                    id={`item-${item.id}`}
                                    checked={!!responses[item.id]}
                                    onCheckedChange={(checked) => handleCheckboxChange(item.id, !!checked)}
                                    disabled={!!resultScore || !isTimerActive}
                                    className="mt-0.5"
                                  />
                                  <label
                                    htmlFor={`item-${item.id}`}
                                    className="text-sm leading-tight"
                                  >
                                    {item.description}
                                    {item.weight && item.weight !== 1 && (
                                      <span className="ml-1 text-xs text-gray-500">
                                        (Peso: {item.weight})
                                      </span>
                                    )}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="scenario" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-320px)]">
                    <div className="prose prose-sm max-w-none">
                      <h3>Caso Clínico: Dor Torácica</h3>
                      
                      <p>
                        Paciente do sexo masculino, 45 anos, comparece ao pronto-socorro com queixa de dor no peito há 2 dias. 
                        Refere que a dor é em aperto, de moderada intensidade (6/10), localizada na região retroesternal, sem irradiação, 
                        que piora com esforço físico e melhora com repouso. Nega dispneia, náuseas, vômitos ou sudorese.
                      </p>
                      
                      <p>
                        O paciente tem histórico de hipertensão arterial e diabetes mellitus tipo 2 diagnosticados há 5 anos. 
                        Faz uso regular de Losartana 50mg 1x/dia e Metformina 850mg 2x/dia. Refere ser alérgico à Dipirona. 
                        É ex-tabagista (20 maços/ano, cessou há 3 anos), nega etilismo. Tem histórico familiar de doença cardiovascular 
                        (pai faleceu de infarto agudo do miocárdio aos 60 anos).
                      </p>
                      
                      <p>
                        Ao exame físico, apresenta-se em bom estado geral, corado, hidratado, acianótico, anictérico. 
                        Sinais vitais: PA 140/90 mmHg, FC 88 bpm, FR 18 irpm, Temperatura 36.8°C, Saturação de O2 96% em ar ambiente.
                      </p>
                      
                      <p>
                        <strong>Exame Cardiovascular:</strong> Ritmo cardíaco regular em 2 tempos, bulhas normofonéticas, sem sopros audíveis. 
                        Pulsos periféricos palpáveis, simétricos e de amplitude normal. Tempo de enchimento capilar &lt; 3 segundos.
                      </p>
                      
                      <p>
                        <strong>Exame Respiratório:</strong> Murmúrio vesicular presente bilateralmente, sem ruídos adventícios. 
                        Expansibilidade torácica simétrica.
                      </p>
                      
                      <p>
                        <strong>Exame Abdominal:</strong> Abdome plano, ruídos hidroaéreos presentes, sem dor à palpação, 
                        sem massas ou visceromegalias palpáveis.
                      </p>
                      
                      <p>
                        <strong>Exame Neurológico:</strong> Consciente, orientado em tempo e espaço, Glasgow 15, pupilas isocóricas e fotorreagentes, 
                        sem déficits focais.
                      </p>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="instructions" className="mt-0">
                  <ScrollArea className="h-[calc(100vh-320px)]">
                    <div className="prose prose-sm max-w-none">
                      <h3>Instruções para realização</h3>
                      
                      <p>
                        Neste cenário, você deverá simular o atendimento de um paciente com dor torácica, 
                        seguindo o checklist fornecido. O objetivo é realizar todas as etapas da avaliação 
                        clínica, incluindo anamnese, exame físico, diagnósticos diferenciais, solicitação de 
                        exames complementares e conduta.
                      </p>
                      
                      <p>
                        <strong>Tempo disponível:</strong> 20 minutos
                      </p>
                      
                      <h4>Como realizar:</h4>
                      
                      <ol>
                        <li>Leia atentamente o caso clínico apresentado na aba "Cenário".</li>
                        <li>Consulte as informações do paciente e os exames complementares nos botões laterais.</li>
                        <li>Siga o checklist marcando cada item à medida que você o realizaria na prática real.</li>
                        <li>Preste atenção aos itens que possuem pesos diferentes, pois eles têm maior impacto na pontuação final.</li>
                        <li>Ao finalizar, clique em "Finalizar Prática" para receber seu resultado.</li>
                      </ol>
                      
                      <h4>Pontuação:</h4>
                      
                      <ul>
                        <li>A pontuação é calculada com base na porcentagem de itens corretamente realizados, considerando seus respectivos pesos.</li>
                        <li>Itens marcados como realizados, mas que não deveriam ser feitos, não subtraem pontos.</li>
                        <li>Para aprovação neste cenário, é necessário atingir nota mínima de 7,0.</li>
                      </ul>
                      
                      <p>
                        <strong>Importante:</strong> Realize o atendimento como se estivesse em uma situação real. 
                        A ordem dos itens no checklist não necessariamente representa a sequência ideal de atendimento.
                      </p>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Result card shown after completion */}
        {resultScore !== null && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Resultado da Prática</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className={`text-4xl font-bold mb-4 ${
                  resultScore >= 7 ? "text-green-600" : "text-red-600"
                }`}>
                  {resultScore.toFixed(1)}
                </div>
                
                <div className="flex items-center justify-center mb-6">
                  {resultScore >= 7 ? (
                    <div className="bg-green-100 text-green-800 flex items-center p-2 rounded-md">
                      <Check className="mr-2 h-5 w-5" />
                      <span>Aprovado</span>
                    </div>
                  ) : (
                    <div className="bg-red-100 text-red-800 flex items-center p-2 rounded-md">
                      <X className="mr-2 h-5 w-5" />
                      <span>Reprovado</span>
                    </div>
                  )}
                </div>

                <div className="text-center mb-4">
                  <p className="mb-2">Você completou {completedCount} de {totalItems} itens ({Math.round(completionPercentage)}%)</p>
                  <p className="text-sm text-gray-500">Tempo total: {formatTime(timer)}</p>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => navigate("/checklist-bank")}>
                    Retornar ao Banco de Checklists
                  </Button>
                  <Button onClick={() => window.location.reload()}>
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Finish confirmation dialog */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Prática</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja finalizar esta prática? Você não poderá voltar e modificar suas respostas.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between mt-4">
            <p>Itens concluídos: {completedCount} de {totalItems}</p>
            <p>Tempo: {formatTime(timer)}</p>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowFinishDialog(false)}>
              Continuar Prática
            </Button>
            <Button 
              onClick={confirmFinish} 
              disabled={isFinishLoading}
            >
              {isFinishLoading ? "Finalizando..." : "Finalizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DetailedFeedback } from "@/components/simulations/DetailedFeedback";
import { ReferencesDialog } from "@/components/simulations/ReferencesDialog";
import {
  Clock,
  BookOpen,
  AlertCircle,
  CheckCircle,
  TimerReset,
  ListChecks,
  ChevronRight,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  CheckCircle2,
  AlarmClock,
  Timer,
  XCircle,
  ChevronLeft,
  Eye,
  RotateCcw,
  Flag,
  HelpCircle,
  Bookmark,
  Hourglass
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Tipos para simulados
interface Simulation {
  id: string;
  title: string;
  description: string;
  specialty: string;
  questionsCount: number;
  timeLimit: number; // em minutos
  difficulty: "easy" | "medium" | "hard";
  attempts: number;
  averageScore: number;
  createdAt: Date;
  isCompleted?: boolean;
  lastAttemptDate?: Date;
  lastScore?: number;
}

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
  imageUrl?: string;
  tags: string[];
}

interface ActiveSimulation {
  simulation: Simulation;
  questions: Question[];
  currentQuestionIndex: number;
  answers: { [key: string]: string };
  markedForReview: string[];
  timeRemaining: number;
  status: "in-progress" | "completed" | "time-expired";
}

// Componente para um cartão de simulado
const SimulationCard = ({
  simulation,
  onStart
}: {
  simulation: Simulation;
  onStart: (simulation: Simulation) => void;
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Fácil";
      case "medium":
        return "Médio";
      case "hard":
        return "Difícil";
      default:
        return difficulty;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{simulation.title}</CardTitle>
            <CardDescription className="mt-1 text-xs">
              {simulation.specialty} • {simulation.questionsCount} questões • {simulation.timeLimit} minutos
            </CardDescription>
          </div>
          <Badge
            className={`${getDifficultyColor(
              simulation.difficulty
            )} border-none font-normal`}
          >
            {getDifficultyText(simulation.difficulty)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm line-clamp-2 text-muted-foreground">
          {simulation.description}
        </p>

        {simulation.lastAttemptDate && (
          <div className="mt-3 flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            <span>
              Última tentativa:{" "}
              {format(simulation.lastAttemptDate, "d MMM yyyy", { locale: ptBR })}
            </span>
            {simulation.lastScore !== undefined && (
              <>
                <span className="mx-1">•</span>
                <PieChart className="mr-1 h-3 w-3" />
                <span>Pontuação: {Math.round(simulation.lastScore)}%</span>
              </>
            )}
          </div>
        )}

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span>Média da comunidade</span>
            <span className="font-medium">{simulation.averageScore}%</span>
          </div>
          <Progress value={simulation.averageScore} className="h-1" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {simulation.attempts} tentativas
        </div>
        <Button onClick={() => onStart(simulation)}>
          {simulation.isCompleted ? "Refazer" : "Iniciar"} <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Componente de confirmação de início de simulado
const StartSimulationDialog = ({
  open,
  onOpenChange,
  simulation,
  onConfirm
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  simulation: Simulation | null;
  onConfirm: () => void;
}) => {
  if (!simulation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Iniciar Simulado</DialogTitle>
          <DialogDescription>
            Você está prestes a iniciar o simulado "{simulation.title}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md bg-muted p-3">
              <div className="text-sm font-medium">Tempo Limite</div>
              <div className="flex items-center mt-1 text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>{simulation.timeLimit} minutos</span>
              </div>
            </div>
            <div className="rounded-md bg-muted p-3">
              <div className="text-sm font-medium">Total de Questões</div>
              <div className="flex items-center mt-1 text-muted-foreground">
                <ListChecks className="mr-2 h-4 w-4" />
                <span>{simulation.questionsCount} questões</span>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
            <div className="flex items-start">
              <AlertCircle className="mr-2 h-5 w-5 text-yellow-800 mt-0.5" />
              <div>
                <p className="font-medium">Atenção</p>
                <ul className="mt-1 list-disc list-inside text-xs">
                  <li>Uma vez iniciado, o cronômetro não pode ser pausado.</li>
                  <li>
                    Você pode navegar entre as questões livremente durante o
                    teste.
                  </li>
                  <li>
                    Todas as respostas são salvas automaticamente enquanto
                    navega.
                  </li>
                  <li>
                    Ao finalizar, você receberá seu resultado imediatamente.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>
            Iniciar Simulado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Componente para exibir uma questão do simulado
const QuestionView = ({
  question,
  selectedOption,
  onSelectOption,
  isMarkedForReview,
  onToggleMarkForReview,
  showExplanation = false
}: {
  question: Question;
  selectedOption: string | undefined;
  onSelectOption: (questionId: string, optionId: string) => void;
  isMarkedForReview: boolean;
  onToggleMarkForReview: () => void;
  showExplanation?: boolean;
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <p className="text-lg font-medium">{question.text}</p>
            {question.imageUrl && (
              <div className="mt-4 rounded-md overflow-hidden">
                <img
                  src={question.imageUrl}
                  alt="Imagem da questão"
                  className="w-full max-h-60 object-contain bg-muted"
                />
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`ml-2 flex items-center ${
              isMarkedForReview ? "text-yellow-500" : "text-muted-foreground"
            }`}
            onClick={onToggleMarkForReview}
          >
            <Bookmark
              className={`h-4 w-4 mr-1 ${isMarkedForReview ? "fill-yellow-500" : ""}`}
            />
            {isMarkedForReview ? "Marcada" : "Marcar"}
          </Button>
        </div>

        <RadioGroup
          value={selectedOption}
          onValueChange={(value) => onSelectOption(question.id, value)}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`flex items-start space-x-2 rounded-md border p-3 ${
                showExplanation && option.isCorrect
                  ? "border-green-500 bg-green-50"
                  : showExplanation && selectedOption === option.id && !option.isCorrect
                  ? "border-red-500 bg-red-50"
                  : "hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem
                value={option.id}
                id={option.id}
                disabled={showExplanation}
              />
              <Label
                htmlFor={option.id}
                className="flex-1 cursor-pointer text-sm leading-relaxed"
              >
                {option.text}
                {showExplanation && option.isCorrect && (
                  <div className="mt-1 flex items-center text-green-700 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Resposta correta
                  </div>
                )}
                {showExplanation && selectedOption === option.id && !option.isCorrect && (
                  <div className="mt-1 flex items-center text-red-700 text-xs">
                    <XCircle className="h-3 w-3 mr-1" />
                    Resposta incorreta
                  </div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && question.explanation && (
          <div className="mt-4 rounded-md bg-blue-50 p-4 text-sm text-blue-800">
            <div className="font-medium mb-1">Explicação:</div>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para a tela de simulado ativo
const ActiveSimulationView = ({
  activeSimulation,
  onAnswer,
  onToggleMarkForReview,
  onNavigate,
  onFinish,
  showResults = false
}: {
  activeSimulation: ActiveSimulation;
  onAnswer: (questionId: string, optionId: string) => void;
  onToggleMarkForReview: (questionId: string) => void;
  onNavigate: (index: number) => void;
  onFinish: () => void;
  showResults?: boolean;
}) => {
  const { simulation, questions, currentQuestionIndex, answers, markedForReview, timeRemaining, status } = activeSimulation;
  const currentQuestion = questions[currentQuestionIndex];
  const [timeDisplay, setTimeDisplay] = useState("");

  useEffect(() => {
    const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hours > 0) {
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      } else {
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      }
    };

    setTimeDisplay(formatTime(timeRemaining));

    const timer = setInterval(() => {
      if (status === "in-progress" && !showResults) {
        setTimeDisplay(formatTime(timeRemaining));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, status, showResults]);

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getCorrectAnswersCount = () => {
    if (!showResults) return 0;
    
    return questions.reduce((count, question) => {
      const selectedOption = answers[question.id];
      const correctOption = question.options.find(option => option.isCorrect);
      if (selectedOption && correctOption && selectedOption === correctOption.id) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const getScore = () => {
    const correctCount = getCorrectAnswersCount();
    return Math.round((correctCount / questions.length) * 100);
  };

  const getProgressStatus = (index: number) => {
    if (index === currentQuestionIndex) return "current";
    if (markedForReview.includes(questions[index].id)) return "review";
    if (answers[questions[index].id]) return "answered";
    return "unanswered";
  };

  const getProgressButtonClass = (status: string) => {
    switch (status) {
      case "current":
        return "bg-primary text-primary-foreground hover:bg-primary/90";
      case "review":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "answered":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho do simulado */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{simulation.title}</h2>
          <div className="text-sm text-muted-foreground">
            {simulation.specialty} • {simulation.questionsCount} questões
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 font-mono rounded-md px-3 py-1 ${
            timeRemaining < 60 && status === "in-progress" && !showResults
              ? "bg-red-100 text-red-800 animate-pulse"
              : "bg-muted"
          }`}>
            <Clock className="h-4 w-4" />
            <span className={`text-base ${timeRemaining < 60 && status === "in-progress" && !showResults ? "font-bold" : ""}`}>
              {timeDisplay}
            </span>
          </div>
          
          {!showResults && (
            <Button
              variant="destructive"
              onClick={onFinish}
              title="Finalizar simulado"
            >
              Finalizar
            </Button>
          )}
        </div>
      </div>

      {/* Resultado do simulado (mostrado apenas quando concluído) */}
      {showResults && (
        <div className="bg-muted/50 px-6 py-4 border-b">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-medium">Resultado do Simulado</h3>
              <p className="text-sm text-muted-foreground">
                {status === "time-expired"
                  ? "Tempo esgotado. Aqui está seu resultado parcial."
                  : "Simulado concluído. Confira seu desempenho."}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="rounded-md bg-green-50 p-3 text-center min-w-[120px]">
                <div className="text-sm text-green-800">Acertos</div>
                <div className="text-2xl font-bold text-green-700">
                  {getCorrectAnswersCount()}/{questions.length}
                </div>
              </div>
              <div className="rounded-md bg-blue-50 p-3 text-center min-w-[120px]">
                <div className="text-sm text-blue-800">Pontuação</div>
                <div className="text-2xl font-bold text-blue-700">
                  {getScore()}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Painel lateral com navegação das questões */}
        <div className="w-64 border-r bg-muted/30 p-4 flex flex-col">
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progresso</span>
              <span>{getAnsweredCount()}/{questions.length} respondidas</span>
            </div>
            <Progress value={(getAnsweredCount() / questions.length) * 100} className="h-2" />
          </div>
          
          <div className="text-sm font-medium mb-2">Questões</div>
          <ScrollArea className="flex-1 pr-3">
            <div className="grid grid-cols-4 gap-2">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium ${getProgressButtonClass(
                    getProgressStatus(index)
                  )}`}
                  onClick={() => onNavigate(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-xs">
                <div className="h-3 w-3 rounded-full bg-muted mr-2"></div>
                <span>Não respondida</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="h-3 w-3 rounded-full bg-green-100 mr-2"></div>
                <span>Respondida</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="h-3 w-3 rounded-full bg-yellow-100 mr-2"></div>
                <span>Marcada para revisão</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="h-3 w-3 rounded-full bg-primary mr-2"></div>
                <span>Questão atual</span>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Conteúdo principal com a questão atual */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-6">
            <QuestionView
              question={currentQuestion}
              selectedOption={answers[currentQuestion.id]}
              onSelectOption={onAnswer}
              isMarkedForReview={markedForReview.includes(currentQuestion.id)}
              onToggleMarkForReview={() => onToggleMarkForReview(currentQuestion.id)}
              showExplanation={showResults}
            />
          </ScrollArea>

          {/* Navegação entre questões */}
          <div className="p-4 border-t flex justify-between items-center bg-muted/30">
            <Button
              variant="outline"
              onClick={() => onNavigate(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            
            {!showResults && status === "in-progress" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mark-review"
                  checked={markedForReview.includes(currentQuestion.id)}
                  onCheckedChange={() => onToggleMarkForReview(currentQuestion.id)}
                />
                <Label htmlFor="mark-review" className="text-sm">
                  Marcar para revisão
                </Label>
              </div>
            )}
            
            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={() => onNavigate(currentQuestionIndex + 1)}
              >
                Próxima <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              !showResults && (
                <Button
                  onClick={onFinish}
                  variant="default"
                >
                  Finalizar Simulado
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal da página de simulados
export default function TimedSimulations() {
  const { user, isLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState("all");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<ActiveSimulation | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [referencesDialogOpen, setReferencesDialogOpen] = useState(false);
  const [currentReferences, setCurrentReferences] = useState<{ text: string; url?: string }[]>([]);
  const [currentQuestionText, setCurrentQuestionText] = useState('');

  // Dados de simulados de exemplo
  const simulationsData: Simulation[] = [
    {
      id: "sim1",
      title: "Simulado Completo de Clínica Médica",
      description: "Abrange os principais tópicos de clínica médica com ênfase em diagnóstico e condutas terapêuticas em situações comuns da prática clínica.",
      specialty: "Clínica Médica",
      questionsCount: 60,
      timeLimit: 120,
      difficulty: "medium",
      attempts: 1285,
      averageScore: 72,
      createdAt: new Date("2025-03-15"),
      isCompleted: true,
      lastAttemptDate: new Date("2025-04-22"),
      lastScore: 75
    },
    {
      id: "sim2",
      title: "Simulado Rápido de Pediatria",
      description: "Teste seus conhecimentos em pediatria com foco em emergências e situações comuns no atendimento ambulatorial.",
      specialty: "Pediatria",
      questionsCount: 30,
      timeLimit: 60,
      difficulty: "easy",
      attempts: 843,
      averageScore: 68,
      createdAt: new Date("2025-04-01")
    },
    {
      id: "sim3",
      title: "Simulado Avançado de Cirurgia Geral",
      description: "Aborda tópicos complexos de cirurgia geral, incluindo técnicas cirúrgicas, complicações pós-operatórias e manejo perioperatório.",
      specialty: "Cirurgia",
      questionsCount: 50,
      timeLimit: 100,
      difficulty: "hard",
      attempts: 621,
      averageScore: 62,
      createdAt: new Date("2025-04-10")
    },
    {
      id: "sim4",
      title: "Simulado de Ginecologia e Obstetrícia",
      description: "Abrange os temas essenciais de ginecologia e obstetrícia para residência médica, com questões baseadas em casos clínicos reais.",
      specialty: "Ginecologia e Obstetrícia",
      questionsCount: 40,
      timeLimit: 80,
      difficulty: "medium",
      attempts: 932,
      averageScore: 70,
      createdAt: new Date("2025-03-25")
    },
    {
      id: "sim5",
      title: "Simulado Rápido de Emergências Médicas",
      description: "Questões focadas em situações de emergência nas diversas especialidades médicas, com ênfase na conduta inicial e estabilização.",
      specialty: "Emergências",
      questionsCount: 20,
      timeLimit: 40,
      difficulty: "medium",
      attempts: 1503,
      averageScore: 65,
      createdAt: new Date("2025-04-15")
    }
  ];
  
  // Questões de exemplo para o simulado
  const questionsData: Question[] = [
    {
      id: "q1",
      text: "Paciente masculino, 55 anos, tabagista há 30 anos, apresenta-se com dispneia progressiva, tosse crônica produtiva e múltiplas exacerbações respiratórias no último ano. Espirometria mostra VEF1/CVF de 65% e VEF1 de 58% do predito. Qual é o diagnóstico mais provável?",
      options: [
        {
          id: "q1o1",
          text: "Asma brônquica",
          isCorrect: false
        },
        {
          id: "q1o2",
          text: "Doença Pulmonar Obstrutiva Crônica (DPOC)",
          isCorrect: true
        },
        {
          id: "q1o3",
          text: "Bronquiectasia",
          isCorrect: false
        },
        {
          id: "q1o4",
          text: "Pneumonia intersticial usual",
          isCorrect: false
        }
      ],
      explanation: "O quadro clínico apresenta os elementos clássicos da DPOC: paciente com fator de risco significativo (tabagismo prolongado), sintomas característicos (dispneia progressiva e tosse crônica produtiva), histórico de exacerbações e alterações espirométricas compatíveis com obstrução ao fluxo aéreo (relação VEF1/CVF reduzida).",
      tags: ["Pneumologia", "DPOC", "Espirometria"]
    },
    {
      id: "q2",
      text: "Mulher de 32 anos com quadro de poliúria, polidipsia e perda de peso de 5kg nas últimas 3 semanas. Chega ao pronto-socorro com confusão mental, desidratação grave, glicemia capilar > 500 mg/dL e pH arterial de 7,25. Qual é a conduta inicial mais adequada?",
      options: [
        {
          id: "q2o1",
          text: "Administrar insulina regular em dose única subcutânea e observar resposta",
          isCorrect: false
        },
        {
          id: "q2o2",
          text: "Iniciar hidratação vigorosa com soro fisiológico e insulina regular em bomba de infusão",
          isCorrect: true
        },
        {
          id: "q2o3",
          text: "Administrar bicarbonato de sódio intravenoso como terapia inicial para corrigir a acidose",
          isCorrect: false
        },
        {
          id: "q2o4",
          text: "Iniciar imediatamente insulina NPH para controle glicêmico a longo prazo",
          isCorrect: false
        }
      ],
      explanation: "A paciente apresenta cetoacidose diabética (CAD), caracterizada por hiperglicemia significativa, acidose metabólica (pH < 7,3) e sinais clínicos de desidratação grave com alteração do estado mental. A terapia inicial da CAD consiste em hidratação vigorosa com solução salina isotônica para restaurar o volume intravascular e melhorar a perfusão, associada à administração de insulina regular em infusão contínua para reduzir a glicemia e interromper a cetogênese.",
      tags: ["Endocrinologia", "Diabetes", "Emergência"]
    },
    {
      id: "q3",
      text: "Homem de 68 anos apresenta dor torácica retroesternal em aperto, com irradiação para o membro superior esquerdo, associada a náuseas e sudorese, com início há 40 minutos. O ECG mostra supradesnivelamento do segmento ST de 3mm em derivações V1 a V4. Qual é a conduta mais adequada neste momento?",
      options: [
        {
          id: "q3o1",
          text: "Administrar AAS, clopidogrel e encaminhar para angioplastia primária imediata",
          isCorrect: true
        },
        {
          id: "q3o2",
          text: "Iniciar anticoagulação plena com heparina e programar cineangiocoronariografia eletiva",
          isCorrect: false
        },
        {
          id: "q3o3",
          text: "Administrar nitrato sublingual e morfina e observar evolução da dor",
          isCorrect: false
        },
        {
          id: "q3o4",
          text: "Realizar ecocardiograma de estresse para confirmar o diagnóstico",
          isCorrect: false
        }
      ],
      explanation: "O caso apresenta um quadro clássico de Infarto Agudo do Miocárdio com supradesnivelamento do segmento ST (IAMCSST) anterior extenso. A terapia de reperfusão deve ser instituída o mais rapidamente possível, sendo a angioplastia primária o método preferencial se disponível em tempo hábil (ideal < 90 minutos após o primeiro contato médico). A dupla antiagregação com AAS e clopidogrel deve ser iniciada imediatamente.",
      tags: ["Cardiologia", "IAM", "Emergência"]
    },
    {
      id: "q4",
      text: "Gestante de 32 semanas apresenta PA de 170/110 mmHg, proteinúria de 3g/24h, edema generalizado, cefaleia intensa e escotomas visuais. Qual o diagnóstico e conduta mais adequada?",
      options: [
        {
          id: "q4o1",
          text: "Pré-eclâmpsia grave: internação, sulfato de magnésio e programar parto após estabilização",
          isCorrect: true
        },
        {
          id: "q4o2",
          text: "Hipertensão gestacional: repouso domiciliar e metildopa oral",
          isCorrect: false
        },
        {
          id: "q4o3",
          text: "Eclâmpsia iminente: cesariana de emergência sob anestesia geral",
          isCorrect: false
        },
        {
          id: "q4o4",
          text: "Hipertensão arterial crônica descompensada: ajuste da medicação anti-hipertensiva",
          isCorrect: false
        }
      ],
      explanation: "O quadro apresenta critérios de pré-eclâmpsia grave (hipertensão grave ≥ 160/110 mmHg, sintomas neurológicos como cefaleia intensa e escotomas, proteinúria significativa). A conduta adequada inclui internação para controle pressórico, prevenção de convulsões com sulfato de magnésio e planejamento do parto após estabilização materna, sendo que em casos graves a resolução da gestação é o tratamento definitivo.",
      tags: ["Obstetrícia", "Hipertensão", "Pré-eclâmpsia"]
    },
    {
      id: "q5",
      text: "Criança de 3 anos apresenta febre alta, irritabilidade, recusa alimentar e rigidez de nuca. O líquor apresenta 500 células/mm³ com predomínio de polimorfonucleares, proteína elevada e glicose diminuída. A conduta mais adequada é:",
      options: [
        {
          id: "q5o1",
          text: "Iniciar aciclovir intravenoso para tratamento de meningite viral",
          isCorrect: false
        },
        {
          id: "q5o2",
          text: "Realizar TC de crânio antes de iniciar qualquer tratamento",
          isCorrect: false
        },
        {
          id: "q5o3",
          text: "Iniciar antibioticoterapia empírica com ceftriaxona intravenosa",
          isCorrect: true
        },
        {
          id: "q5o4",
          text: "Tratar sintomaticamente e reavaliação clínica em 24 horas",
          isCorrect: false
        }
      ],
      explanation: "O quadro clínico e os achados liquóricos são altamente sugestivos de meningite bacteriana (febre, sinais meníngeos, pleocitose com predomínio de neutrófilos, proteína elevada e glicose diminuída no líquor). A antibioticoterapia empírica deve ser iniciada imediatamente após a coleta de culturas, sem esperar pelos resultados, utilizando antibióticos de amplo espectro como a ceftriaxona, que possui boa penetração no SNC e cobertura para os principais agentes.",
      tags: ["Pediatria", "Infectologia", "Meningite"]
    }
  ];

  const handleStartSimulation = (simulation: Simulation) => {
    setSelectedSimulation(simulation);
    setConfirmDialogOpen(true);
  };

  const handleConfirmStart = () => {
    if (!selectedSimulation) return;

    // Iniciar o simulado
    setActiveSimulation({
      simulation: selectedSimulation,
      questions: questionsData,
      currentQuestionIndex: 0,
      answers: {},
      markedForReview: [],
      timeRemaining: selectedSimulation.timeLimit * 60, // Converter minutos para segundos
      status: "in-progress"
    });

    setConfirmDialogOpen(false);
    setShowResults(false);
  };

  const handleAnswer = (questionId: string, optionId: string) => {
    if (!activeSimulation) return;

    setActiveSimulation({
      ...activeSimulation,
      answers: {
        ...activeSimulation.answers,
        [questionId]: optionId
      }
    });
  };

  const handleToggleMarkForReview = (questionId: string) => {
    if (!activeSimulation) return;

    const markedForReview = [...activeSimulation.markedForReview];
    const index = markedForReview.indexOf(questionId);

    if (index === -1) {
      markedForReview.push(questionId);
    } else {
      markedForReview.splice(index, 1);
    }

    setActiveSimulation({
      ...activeSimulation,
      markedForReview
    });
  };

  const handleNavigate = (index: number) => {
    if (!activeSimulation || index < 0 || index >= activeSimulation.questions.length) return;

    setActiveSimulation({
      ...activeSimulation,
      currentQuestionIndex: index
    });
  };

  const handleFinishSimulation = () => {
    if (!activeSimulation) return;

    setActiveSimulation({
      ...activeSimulation,
      status: "completed"
    });

    setShowResults(true);
  };
  
  // Função para tratar a exibição de referências
  const handleViewReferences = (questionId: string) => {
    if (!activeSimulation) return;
    
    // Encontrar a questão pelo ID
    const question = activeSimulation.questions.find(q => q.id === questionId);
    
    if (question) {
      // Aqui estamos simulando referências para a questão
      // Em um ambiente real, estas viriam do backend
      const references = [
        {
          text: "Harrison's Principles of Internal Medicine, 20th Edition",
          url: "https://accessmedicine.mhmedical.com/book.aspx?bookid=2129",
          type: "book" as const,
          authors: ["J. Larry Jameson", "Anthony S. Fauci", "Dennis L. Kasper", "Stephen L. Hauser"],
          year: 2018,
          publisher: "McGraw-Hill Education",
          citation: "Jameson J, Fauci AS, Kasper DL, Hauser SL, Longo DL, Loscalzo J. Harrison's Principles of Internal Medicine, 20e. McGraw-Hill; 2018."
        },
        {
          text: "Clinical Practice Guidelines for Diagnosis and Management of Meningitis",
          url: "https://academic.oup.com/cid/article/39/9/1267/402080",
          type: "guideline" as const,
          authors: ["Allan R. Tunkel", "Barry J. Hartman", "Sheldon L. Kaplan"],
          year: 2021,
          publisher: "Infectious Diseases Society of America",
          citation: "Tunkel AR, et al. Practice Guidelines for the Management of Bacterial Meningitis. Clinical Infectious Diseases. 2021;63(12):e61-e111."
        },
        {
          text: "Evaluation and Management of Suspected Meningitis in Children",
          url: "https://www.aafp.org/afp/2017/0915/p314.html",
          type: "article" as const,
          authors: ["Sarah S. Long", "Robert R. Pickering"],
          year: 2020,
          publisher: "American Family Physician",
          citation: "Long SS, Pickering RR. Evaluation and Management of Suspected Meningitis in Children. American Family Physician. 2020;102(6):314-323."
        }
      ];
      
      // Atualiza o estado com as referências e texto da questão
      setCurrentReferences(references);
      setCurrentQuestionText(question.text);
      setReferencesDialogOpen(true);
    }
  };

  // A cada segundo, reduzir o tempo restante
  useEffect(() => {
    if (!activeSimulation || activeSimulation.status !== "in-progress" || showResults) return;

    const timer = setInterval(() => {
      setActiveSimulation(prev => {
        if (!prev) return null;

        const newTimeRemaining = prev.timeRemaining - 1;

        if (newTimeRemaining <= 0) {
          // Tempo esgotado
          return {
            ...prev,
            timeRemaining: 0,
            status: "time-expired"
          };
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSimulation, showResults]);

  // Quando o tempo acabar, mostrar os resultados
  useEffect(() => {
    if (activeSimulation?.status === "time-expired" && !showResults) {
      setShowResults(true);
    }
  }, [activeSimulation?.status, showResults]);

  // Filtrar simulados por tipo
  const getFilteredSimulations = () => {
    if (selectedTab === "all") return simulationsData;
    if (selectedTab === "completed") return simulationsData.filter(s => s.isCompleted);
    if (selectedTab === "pending") return simulationsData.filter(s => !s.isCompleted);
    
    // Filtrar por especialidade
    return simulationsData.filter(s => s.specialty.toLowerCase() === selectedTab);
  };

  return (
    <MainLayout>
      {activeSimulation ? (
        <ActiveSimulationView
          activeSimulation={activeSimulation}
          onAnswer={handleAnswer}
          onToggleMarkForReview={handleToggleMarkForReview}
          onNavigate={handleNavigate}
          onFinish={handleFinishSimulation}
          showResults={showResults}
        />
      ) : (
        <div className="container mx-auto py-6 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Simulados Temporizados</h1>
              <p className="text-muted-foreground">
                Pratique com simulados completos que simulam o ambiente e o tempo de prova
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Select
                defaultValue="newest"
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="popular">Mais populares</SelectItem>
                  <SelectItem value="duration">Menor duração</SelectItem>
                  <SelectItem value="difficulty">Dificuldade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs
            defaultValue="all"
            onValueChange={setSelectedTab}
            className="space-y-6"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="completed">Completados</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="clínica médica">Clínica Médica</TabsTrigger>
              <TabsTrigger value="pediatria">Pediatria</TabsTrigger>
              <TabsTrigger value="cirurgia">Cirurgia</TabsTrigger>
              <TabsTrigger value="ginecologia e obstetrícia">GO</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getFilteredSimulations().map((simulation) => (
                  <SimulationCard
                    key={simulation.id}
                    simulation={simulation}
                    onStart={handleStartSimulation}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <StartSimulationDialog
            open={confirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
            simulation={selectedSimulation}
            onConfirm={handleConfirmStart}
          />
        </div>
      )}
    </MainLayout>
  );
}
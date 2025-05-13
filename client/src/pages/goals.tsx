import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { 
  TargetIcon, 
  CalendarIcon, 
  PlusIcon,
  CheckSquareIcon,
  ClockIcon,
  BellIcon,
  TrophyIcon,
  BookOpenIcon,
  BrainCircuitIcon,
  ActivityIcon,
  BarChart3Icon,
  Clock4Icon,
  XIcon,
  EditIcon,
  CalendarRangeIcon,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

// Tipos para as metas
interface Goal {
  id: number;
  title: string;
  description: string;
  category: "study" | "practice" | "review" | "exam";
  startDate: Date;
  dueDate: Date;
  progress: number;
  isComplete: boolean;
  isPublic: boolean;
  reminderEnabled: boolean;
  relatedSpecialties: string[];
  milestones: Milestone[];
}

interface Milestone {
  id: number;
  title: string;
  isComplete: boolean;
}

// Componente para exibir a meta
const GoalCard = ({ goal, onEdit, onDelete }: { goal: Goal; onEdit: (id: number) => void; onDelete: (id: number) => void }) => {
  const daysLeft = Math.max(0, Math.ceil((goal.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const isLate = goal.dueDate < new Date() && !goal.isComplete;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "study":
        return <BookOpenIcon className="h-5 w-5" />;
      case "practice":
        return <BrainCircuitIcon className="h-5 w-5" />;
      case "review":
        return <ActivityIcon className="h-5 w-5" />;
      case "exam":
        return <BarChart3Icon className="h-5 w-5" />;
      default:
        return <TargetIcon className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "study":
        return "bg-blue-100 text-blue-700";
      case "practice":
        return "bg-green-100 text-green-700";
      case "review":
        return "bg-purple-100 text-purple-700";
      case "exam":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className={isLate ? "border-red-300" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${getCategoryColor(goal.category)}`}>
              {getCategoryIcon(goal.category)}
            </div>
            <div>
              <CardTitle className="text-xl">{goal.title}</CardTitle>
              <CardDescription>{goal.description}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(goal.id)}>
              <EditIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onDelete(goal.id)}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {goal.relatedSpecialties.map((specialty, index) => (
            <Badge key={index} variant="outline">{specialty}</Badge>
          ))}
          {goal.reminderEnabled && (
            <Badge variant="outline" className="flex items-center">
              <BellIcon className="h-3 w-3 mr-1" />
              Lembretes
            </Badge>
          )}
          {goal.isPublic && (
            <Badge variant="outline" className="flex items-center">
              <TrophyIcon className="h-3 w-3 mr-1" />
              Pública
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progresso</span>
              <span>{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          {goal.milestones.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Etapas</h4>
              <div className="space-y-1">
                {goal.milestones.map((milestone) => (
                  <div 
                    key={milestone.id} 
                    className="flex items-center text-sm"
                  >
                    <CheckSquareIcon 
                      className={`h-4 w-4 mr-2 ${milestone.isComplete ? "text-green-500" : "text-gray-400"}`} 
                    />
                    <span className={milestone.isComplete ? "line-through text-gray-500" : ""}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>Prazo: {format(goal.dueDate, "dd/MM/yyyy")}</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span className={isLate ? "text-red-500 font-medium" : ""}>
            {goal.isComplete 
              ? "Concluído" 
              : isLate 
                ? "Atrasado" 
                : `${daysLeft} dias restantes`}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

// Componente para adicionar ou editar uma meta
const GoalForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingGoal 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (goal: Omit<Goal, "id" | "progress" | "isComplete">) => void; 
  editingGoal?: Goal 
}) => {
  const [startDate, setStartDate] = useState<Date>(editingGoal?.startDate || new Date());
  const [dueDate, setDueDate] = useState<Date>(editingGoal?.dueDate || new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [milestones, setMilestones] = useState<Omit<Milestone, "id">[]>(
    editingGoal?.milestones.map(m => ({ title: m.title, isComplete: m.isComplete })) || []
  );
  const [milestoneInput, setMilestoneInput] = useState("");
  
  const handleAddMilestone = () => {
    if (milestoneInput.trim()) {
      setMilestones([...milestones, { title: milestoneInput, isComplete: false }]);
      setMilestoneInput("");
    }
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const newGoal = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as "study" | "practice" | "review" | "exam",
      startDate,
      dueDate,
      isPublic: formData.get("isPublic") === "on",
      reminderEnabled: formData.get("reminderEnabled") === "on",
      relatedSpecialties: formData.get("specialties")?.toString().split(",").map(s => s.trim()) || [],
      milestones: milestones.map((m, index) => ({ ...m, id: index })),
    };
    
    onSave(newGoal);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Editar Meta" : "Nova Meta"}</DialogTitle>
            <DialogDescription>
              {editingGoal 
                ? "Modifique os detalhes da sua meta existente." 
                : "Crie uma nova meta para ajudar a organizar seus estudos."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingGoal?.title}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingGoal?.description}
                className="col-span-3"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <Select name="category" defaultValue={editingGoal?.category || "study"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study">Estudo</SelectItem>
                  <SelectItem value="practice">Prática</SelectItem>
                  <SelectItem value="review">Revisão</SelectItem>
                  <SelectItem value="exam">Simulado/Prova</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialties" className="text-right">
                Especialidades
              </Label>
              <Input
                id="specialties"
                name="specialties"
                defaultValue={editingGoal?.relatedSpecialties.join(", ")}
                className="col-span-3"
                placeholder="Ex: Clínica Médica, Pediatria (separadas por vírgula)"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Data de Início
              </Label>
              <div className="col-span-3 relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(startDate, "PPP", { locale: pt })}
                </Button>
                {showStartDatePicker && (
                  <div className="absolute z-10 mt-1 bg-background border rounded-md shadow-md p-3">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date: Date | undefined) => {
                        if (date) {
                          setStartDate(date);
                          setShowStartDatePicker(false);
                        }
                      }}
                      disabled={(date: Date) => date > dueDate}
                      initialFocus
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Data Limite
              </Label>
              <div className="col-span-3 relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setShowDueDatePicker(!showDueDatePicker)}
                >
                  <CalendarRangeIcon className="mr-2 h-4 w-4" />
                  {format(dueDate, "PPP", { locale: pt })}
                </Button>
                {showDueDatePicker && (
                  <div className="absolute z-10 mt-1 bg-background border rounded-md shadow-md p-3">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date: Date | undefined) => {
                        if (date) {
                          setDueDate(date);
                          setShowDueDatePicker(false);
                        }
                      }}
                      disabled={(date: Date) => date < startDate}
                      initialFocus
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Etapas
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={milestoneInput}
                    onChange={(e) => setMilestoneInput(e.target.value)}
                    placeholder="Adicionar etapa"
                  />
                  <Button type="button" size="sm" onClick={handleAddMilestone}>
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span>{milestone.title}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveMilestone(index)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isPublic" className="text-right">
                Meta Pública
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="isPublic" name="isPublic" defaultChecked={editingGoal?.isPublic} />
                <Label htmlFor="isPublic" className="text-sm text-muted-foreground">
                  Compartilhar com outros estudantes
                </Label>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reminderEnabled" className="text-right">
                Lembretes
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch id="reminderEnabled" name="reminderEnabled" defaultChecked={editingGoal?.reminderEnabled} />
                <Label htmlFor="reminderEnabled" className="text-sm text-muted-foreground">
                  Receber lembretes sobre esta meta
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Página principal de metas
export default function Goals() {
  const { user, isLoading } = useAuth();
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  
  // Dados de exemplo para as metas
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Completar todos os casos de Pediatria",
      description: "Revisar todos os cenários clínicos pediátricos disponíveis na plataforma",
      category: "practice",
      startDate: new Date(2025, 4, 1),
      dueDate: new Date(2025, 5, 15),
      progress: 75,
      isComplete: false,
      isPublic: true,
      reminderEnabled: true,
      relatedSpecialties: ["Pediatria"],
      milestones: [
        { id: 1, title: "Completar casos básicos", isComplete: true },
        { id: 2, title: "Completar casos intermediários", isComplete: true },
        { id: 3, title: "Completar casos avançados", isComplete: false },
      ]
    },
    {
      id: 2,
      title: "Revisão completa de Clínica Médica",
      description: "Revisar todos os tópicos importantes para a residência",
      category: "review",
      startDate: new Date(2025, 3, 15),
      dueDate: new Date(2025, 4, 1),
      progress: 100,
      isComplete: true,
      isPublic: false,
      reminderEnabled: false,
      relatedSpecialties: ["Clínica Médica"],
      milestones: [
        { id: 1, title: "Revisar cardiologia", isComplete: true },
        { id: 2, title: "Revisar pneumologia", isComplete: true },
        { id: 3, title: "Revisar gastroenterologia", isComplete: true },
        { id: 4, title: "Revisar nefrologia", isComplete: true },
      ]
    },
    {
      id: 3,
      title: "Simulado Geral de Residência",
      description: "Realizar simulado completo com questões de todas as especialidades",
      category: "exam",
      startDate: new Date(2025, 5, 1),
      dueDate: new Date(2025, 6, 30),
      progress: 30,
      isComplete: false,
      isPublic: true,
      reminderEnabled: true,
      relatedSpecialties: ["Geral", "Multidisciplinar"],
      milestones: [
        { id: 1, title: "Completar bloco 1 (Clínica)", isComplete: true },
        { id: 2, title: "Completar bloco 2 (Cirurgia)", isComplete: false },
        { id: 3, title: "Completar bloco 3 (Pediatria)", isComplete: false },
        { id: 4, title: "Completar bloco 4 (GO)", isComplete: false },
      ]
    },
  ]);
  
  const handleEditGoal = (id: number) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      setEditingGoal(goal);
      setShowGoalForm(true);
    }
  };
  
  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  const handleSaveGoal = (goalData: Omit<Goal, "id" | "progress" | "isComplete">) => {
    if (editingGoal) {
      // Atualizar meta existente
      setGoals(goals.map(goal => 
        goal.id === editingGoal.id 
          ? { 
              ...goal, 
              ...goalData,
              // Mantém o progresso atual e status de conclusão
              progress: goal.progress, 
              isComplete: goal.isComplete 
            } 
          : goal
      ));
    } else {
      // Criar nova meta
      const newGoal: Goal = {
        id: Math.max(0, ...goals.map(g => g.id)) + 1,
        ...goalData,
        progress: 0,
        isComplete: false,
      };
      setGoals([...goals, newGoal]);
    }
    setEditingGoal(undefined);
  };
  
  // Estatísticas resumidas
  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.isComplete).length,
    inProgress: goals.filter(g => !g.isComplete).length,
    overdue: goals.filter(g => g.dueDate < new Date() && !g.isComplete).length,
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Minhas Metas</h1>
            <p className="text-muted-foreground">Acompanhe e gerencie seus objetivos de estudo</p>
          </div>
          <Button 
            onClick={() => {
              setEditingGoal(undefined);
              setShowGoalForm(true);
            }}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nova Meta
          </Button>
        </div>
        
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total de Metas</p>
                <h2 className="text-3xl font-bold">{stats.total}</h2>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TargetIcon className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Concluídas</p>
                <h2 className="text-3xl font-bold">{stats.completed}</h2>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckSquareIcon className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Em Andamento</p>
                <h2 className="text-3xl font-bold">{stats.inProgress}</h2>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock4Icon className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Atrasadas</p>
                <h2 className="text-3xl font-bold">{stats.overdue}</h2>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Clock4Icon className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center">
              <ActivityIcon className="h-4 w-4 mr-2" />
              Todas
            </Button>
            <Button variant="outline" className="flex items-center">
              <CheckSquareIcon className="h-4 w-4 mr-2" />
              Concluídas
            </Button>
            <Button variant="outline" className="flex items-center">
              <Clock4Icon className="h-4 w-4 mr-2" />
              Em Andamento
            </Button>
            <Button variant="outline" className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Recomendadas
            </Button>
          </div>
          
          <Select defaultValue="dueDate">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Data de Vencimento</SelectItem>
              <SelectItem value="progress">Progresso</SelectItem>
              <SelectItem value="startDate">Data de Início</SelectItem>
              <SelectItem value="title">Título</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Lista de metas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onEdit={handleEditGoal} 
              onDelete={handleDeleteGoal} 
            />
          ))}
        </div>
        
        {/* Modal de criação/edição de meta */}
        <GoalForm 
          isOpen={showGoalForm} 
          onClose={() => setShowGoalForm(false)} 
          onSave={handleSaveGoal}
          editingGoal={editingGoal}
        />
      </div>
    </MainLayout>
  );
}
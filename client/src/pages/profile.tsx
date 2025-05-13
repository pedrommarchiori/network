import { useAuth } from "@/hooks/useAuth";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  UserIcon, 
  TrophyIcon, 
  TargetIcon, 
  BarChartIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  ClipboardCheckIcon, 
  SettingsIcon,
  PenLine,
  CheckCircle,
  RadioIcon
} from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

interface GoalProps {
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  completed: boolean;
}

const Goal = ({ title, description, progress, dueDate, completed }: GoalProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <TargetIcon className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
        <Badge variant={completed ? "default" : "outline"} className={completed ? "bg-green-500 hover:bg-green-600" : ""}>
          {completed ? "Concluído" : "Em andamento"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>Data limite: {dueDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CertificateProps {
  title: string;
  issuedOn: string;
  issuedBy: string;
  isVerified: boolean;
}

const Certificate = ({ title, issuedOn, issuedBy, isVerified }: CertificateProps) => {
  return (
    <Card className="mb-4 overflow-hidden">
      <div className="flex border-b border-border">
        <div className="bg-primary/10 p-4 flex items-center justify-center">
          <RadioIcon className="h-8 w-8 text-primary" />
        </div>
        <div className="p-4 flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">Emitido por: {issuedBy}</p>
          <p className="text-xs text-muted-foreground">Data: {issuedOn}</p>
        </div>
        <div className="p-4 flex items-center">
          {isVerified ? (
            <Badge variant="default" className="flex items-center bg-green-500 hover:bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verificado
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center">
              Não verificado
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default function Profile() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const userGoals = [
    {
      title: "Completar todos os casos de Pediatria",
      description: "Finalizar todos os cenários da especialidade de Pediatria",
      progress: 75,
      dueDate: "15/06/2025",
      completed: false,
    },
    {
      title: "Revisão completa de Clínica Médica",
      description: "Revisar todos os checklists de Clínica Médica",
      progress: 100,
      dueDate: "01/05/2025",
      completed: true,
    },
    {
      title: "Simulado Geral de Residência",
      description: "Completar o simulado com todas as especialidades",
      progress: 30,
      dueDate: "30/07/2025",
      completed: false,
    },
  ];

  const userCertificates = [
    {
      title: "Especialista em Emergências Médicas",
      issuedOn: "10/03/2025",
      issuedBy: "SanusXPRO Academy",
      isVerified: true,
    },
    {
      title: "Proficiência em Diagnóstico Clínico",
      issuedOn: "22/01/2025",
      issuedBy: "Associação Médica Brasileira",
      isVerified: true,
    },
    {
      title: "Fundamentos de Pediatria Moderna",
      issuedOn: "05/04/2025",
      issuedBy: "SanusXPRO Academy",
      isVerified: false,
    },
  ];

  const profileSummary = {
    totalAttempts: 187,
    scenariosCompleted: 53,
    averageScore: 78,
    rank: 34,
    studyTime: 78, // em horas
    lastActivity: "10/05/2025",
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Perfil do usuário */}
          <Card className="col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" /> 
                  Dados Pessoais
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <PenLine className="h-4 w-4 mr-1" />
                  )}
                  {isEditing ? "Salvar" : "Editar"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                {isLoading ? (
                  <Skeleton className="h-32 w-32 rounded-full" />
                ) : (
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "Usuário"} />
                    <AvatarFallback className="text-2xl">
                      {user?.firstName ? user.firstName[0] : "U"}
                      {user?.lastName ? user.lastName[0] : ""}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                {isLoading ? (
                  <Skeleton className="h-7 w-48 mt-4" />
                ) : (
                  <h2 className="text-xl font-bold mt-4">
                    {user?.firstName} {user?.lastName}
                  </h2>
                )}
                
                {isLoading ? (
                  <Skeleton className="h-5 w-32 mt-1" />
                ) : (
                  <p className="text-muted-foreground">
                    {user?.email || "Usuário"}
                  </p>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input 
                        id="firstName" 
                        defaultValue={user?.firstName || ""} 
                        placeholder="Nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input 
                        id="lastName" 
                        defaultValue={user?.lastName || ""} 
                        placeholder="Sobrenome"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      defaultValue={user?.email || ""} 
                      placeholder="Email"
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Especialidade</Label>
                    <Input 
                      id="specialty" 
                      defaultValue="Clínica Médica" 
                      placeholder="Especialidade"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="graduation">Ano de Formatura</Label>
                    <Input 
                      id="graduation" 
                      defaultValue="2023" 
                      placeholder="Ano de Formatura"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Especialidade</span>
                    <span className="font-medium">Clínica Médica</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Ano de Formatura</span>
                    <span className="font-medium">2023</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground">Membro desde</span>
                    <span className="font-medium">Janeiro 2025</span>
                  </div>
                  
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-muted-foreground">Plano</span>
                    <Badge>Premium</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Estatísticas e Metas */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChartIcon className="h-5 w-5 mr-2" /> 
                  Resumo de Desempenho
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-muted-foreground text-sm">Cenários Completados</div>
                    <div className="text-2xl font-bold mt-1">{profileSummary.scenariosCompleted}</div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-muted-foreground text-sm">Total de Tentativas</div>
                    <div className="text-2xl font-bold mt-1">{profileSummary.totalAttempts}</div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-muted-foreground text-sm">Média de Pontuação</div>
                    <div className="text-2xl font-bold mt-1">{profileSummary.averageScore}%</div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-muted-foreground text-sm">Classificação Geral</div>
                    <div className="text-2xl font-bold mt-1">#{profileSummary.rank}</div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-muted-foreground text-sm">Tempo de Estudo</div>
                    <div className="text-2xl font-bold mt-1">{profileSummary.studyTime}h</div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="text-muted-foreground text-sm">Última Atividade</div>
                    <div className="text-2xl font-bold mt-1">{profileSummary.lastActivity}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="goals">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="goals" className="flex items-center">
                  <TargetIcon className="h-4 w-4 mr-2" /> Metas
                </TabsTrigger>
                <TabsTrigger value="certificates" className="flex items-center">
                  <TrophyIcon className="h-4 w-4 mr-2" /> Certificados
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center">
                  <SettingsIcon className="h-4 w-4 mr-2" /> Configurações
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="goals">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Minhas Metas</CardTitle>
                      <Button size="sm">Nova Meta</Button>
                    </div>
                    <CardDescription>
                      Acompanhe seu progresso em direção aos objetivos de estudo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userGoals.map((goal, index) => (
                      <Goal key={index} {...goal} />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="certificates">
                <Card>
                  <CardHeader>
                    <CardTitle>Meus Certificados</CardTitle>
                    <CardDescription>
                      Certificados de conclusão obtidos na plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userCertificates.map((cert, index) => (
                      <Certificate key={index} {...cert} />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações da Conta</CardTitle>
                    <CardDescription>
                      Gerencie suas preferências de notificação e privacidade
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Notificações por Email</h3>
                          <p className="text-sm text-muted-foreground">Receba atualizações sobre novos cenários e conteúdos</p>
                        </div>
                        <Button variant="outline">Ativar</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Lembrete de Estudo</h3>
                          <p className="text-sm text-muted-foreground">Lembretes diários para continuar os estudos</p>
                        </div>
                        <Button variant="outline">Ativar</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Privacidade do Perfil</h3>
                          <p className="text-sm text-muted-foreground">Escolha quem pode ver suas estatísticas e progresso</p>
                        </div>
                        <Button variant="outline">Configurar</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Sincronização com Calendário</h3>
                          <p className="text-sm text-muted-foreground">Sincronize suas metas com seu calendário</p>
                        </div>
                        <Button variant="outline">Conectar</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Exportar Dados</h3>
                          <p className="text-sm text-muted-foreground">Baixe seus dados de progresso e desempenho</p>
                        </div>
                        <Button variant="outline">Exportar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
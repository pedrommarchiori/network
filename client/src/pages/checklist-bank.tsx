import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChecklistBank() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const { data: specialties, isLoading: isLoadingSpecialties } = useQuery({
    queryKey: ["/api/specialties"],
  });

  const { data: scenarios, isLoading: isLoadingScenarios } = useQuery({
    queryKey: [
      `/api/scenarios${selectedSpecialty !== "all" ? `?specialtyId=${selectedSpecialty}` : ""}`,
    ],
  });

  // Default images for specialty cards
  const specialtyImages = {
    clinical: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    surgery: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
    obstetrics: "https://images.unsplash.com/photo-1558960214-f4283a743867?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    gynecology: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    pediatrics: "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    preventive: "https://images.unsplash.com/photo-1581056771107-24247a210aca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
  };

  // Sample data (would be replaced with API data)
  const mockSpecialties = [
    { id: 1, name: "Clínica", code: "clinical" },
    { id: 2, name: "Cirurgia", code: "surgery" },
    { id: 3, name: "GO - Obstetrícia", code: "obstetrics" },
    { id: 4, name: "GO - Ginecologia", code: "gynecology" },
    { id: 5, name: "Pediatria", code: "pediatrics" },
    { id: 6, name: "Preventiva", code: "preventive" },
  ];

  const mockScenarios = [
    {
      id: 1,
      title: "Avaliação de Dor Torácica",
      specialty: { id: 1, name: "Clínica", code: "clinical" },
      difficulty: "medium",
      imageUrl: "https://images.unsplash.com/photo-1559000357-f6b52ddfcbba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Cenário com paciente apresentando dor torácica aguda. Avalie as causas cardiovasculares, respiratórias e gastroesofágicas."
    },
    {
      id: 2,
      title: "Apendicectomia",
      specialty: { id: 2, name: "Cirurgia", code: "surgery" },
      difficulty: "hard",
      imageUrl: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Cenário cirúrgico de apendicite aguda. Procedimento completo de apendicectomia com técnica aberta."
    },
    {
      id: 3,
      title: "Parto Normal",
      specialty: { id: 3, name: "GO - Obstetrícia", code: "obstetrics" },
      difficulty: "medium",
      imageUrl: "https://images.unsplash.com/photo-1632053001332-2368e0e849e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Cenário de parto vaginal eutócico. Conduza o trabalho de parto e parto de uma gestante sem complicações."
    },
    {
      id: 4,
      title: "Avaliação de Cefaleia",
      specialty: { id: 1, name: "Clínica", code: "clinical" },
      difficulty: "easy",
      imageUrl: "https://images.unsplash.com/photo-1600880292630-ee8a00403024?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Cenário com paciente apresentando cefaleia crônica. Avalie o diagnóstico diferencial entre migrânea, cefaleia tensional e cefaleia em salvas."
    },
    {
      id: 5,
      title: "Colecistectomia",
      specialty: { id: 2, name: "Cirurgia", code: "surgery" },
      difficulty: "hard",
      imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Cenário cirúrgico de colecistite. Procedimento de colecistectomia por videolaparoscopia."
    },
    {
      id: 6,
      title: "Puericultura",
      specialty: { id: 5, name: "Pediatria", code: "pediatrics" },
      difficulty: "medium",
      imageUrl: "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      description: "Consulta de puericultura para lactente de 6 meses. Avalie desenvolvimento, cuidados e vacinação."
    },
  ];

  const displayedSpecialties = specialties || mockSpecialties;
  const displayedScenarios = scenarios || mockScenarios;

  const filteredScenarios = displayedScenarios.filter((scenario) => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === "all" || 
                            scenario.specialty.id.toString() === selectedSpecialty;
    
    const matchesDifficulty = selectedDifficulty === "all" || 
                             scenario.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSpecialty && matchesDifficulty;
  });

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

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Banco de Checklists</h1>
            <p className="text-sm text-gray-500 mt-1">
              Explore os cenários disponíveis para praticar habilidades clínicas
            </p>
          </div>
        </div>

        <Tabs defaultValue="all" className="mt-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <TabsList className="mb-4 md:mb-0">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="completed">Completados</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar cenários..."
                  className="pl-8 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Especialidades</SelectLabel>
                    <SelectItem value="all">Todas</SelectItem>
                    {displayedSpecialties.map((specialty) => (
                      <SelectItem key={specialty.id} value={specialty.id.toString()}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Dificuldade</SelectLabel>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="easy">Básico</SelectItem>
                    <SelectItem value="medium">Intermediário</SelectItem>
                    <SelectItem value="hard">Avançado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            {isLoadingScenarios ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/3 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-10 w-full mt-4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredScenarios.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">
                  Nenhum cenário encontrado com os filtros selecionados.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredScenarios.map((scenario) => (
                  <Card key={scenario.id} className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <img
                        src={scenario.imageUrl || specialtyImages[scenario.specialty.code as keyof typeof specialtyImages]}
                        alt={scenario.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            difficultyLabels[scenario.difficulty as keyof typeof difficultyLabels].className
                          }`}
                        >
                          {difficultyLabels[scenario.difficulty as keyof typeof difficultyLabels].label}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{scenario.title}</CardTitle>
                      <span className="text-xs text-gray-500">{scenario.specialty.name}</span>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {scenario.description || "Descrição não disponível"}
                      </p>
                      <Link href={`/practice/${scenario.specialty.code}/${scenario.id}`}>
                        <Button className="w-full">Iniciar Prática</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="p-6 text-center">
              <p className="text-gray-500">
                Você ainda não adicionou cenários aos favoritos.
              </p>
              <Button variant="outline" className="mt-4">
                Explorar Cenários
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card className="p-6 text-center">
              <p className="text-gray-500">
                Você ainda não completou nenhum cenário.
              </p>
              <Button variant="outline" className="mt-4">
                Explorar Cenários
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

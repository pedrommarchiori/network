import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface WelcomeHeaderProps {
  userName?: string;
  lastActivity?: Date;
  isLoading?: boolean;
}

export function WelcomeHeader({ userName, lastActivity, isLoading = false }: WelcomeHeaderProps) {
  const formattedDate = lastActivity
    ? format(lastActivity, "dd/MM/yyyy", { locale: ptBR })
    : null;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-2">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="mt-4 flex md:mt-0">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Olá, {userName || "Estudante"}!
          </h1>
          {formattedDate && (
            <p className="text-sm text-gray-500 mt-1">Última atividade em {formattedDate}</p>
          )}
        </div>
        <div className="mt-4 flex md:mt-0">
          <Link href="/practice/new">
            <Button className="ml-3 inline-flex items-center">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Iniciar Nova Prática
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

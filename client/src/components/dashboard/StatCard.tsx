import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string | number;
    positive: boolean;
  };
  iconBgColor?: string;
  cardClassName?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  iconBgColor = "bg-primary-100",
  cardClassName,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", cardClassName)}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", iconBgColor)}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{value}</div>
              {trend && (
                <div
                  className={cn(
                    "ml-2 flex items-baseline text-sm font-semibold",
                    trend.positive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.positive ? (
                    <TrendingUp className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                  )}
                  <span className="sr-only">
                    {trend.positive ? "Aumentou em" : "Diminuiu em"}
                  </span>
                  {trend.value}
                </div>
              )}
            </dd>
          </div>
        </div>
      </div>
    </Card>
  );
}

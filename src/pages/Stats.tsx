import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BillionaireData {
  country: string;
  count: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: BillionaireData;
  }>;
}

const Stats: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const billionairesData: BillionaireData[] = [
    { country: "🇺🇸 USA", count: 735 },
    { country: "🇨🇳 China", count: 495 },
    { country: "🇮🇳 India", count: 169 },
    { country: "🇩🇪 Germany", count: 126 },
    { country: "🇷🇺 Russia", count: 105 },
    { country: "🇭🇰 Hong Kong", count: 68 },
    { country: "🇬🇧 UK", count: 64 },
    { country: "🇨🇭 Switzerland", count: 62 },
    { country: "🇨🇦 Canada", count: 59 },
    { country: "🇮🇹 Italy", count: 56 },
    { country: "🇧🇷 Brazil", count: 51 },
    { country: "🇫🇷 France", count: 43 },
    { country: "🇸🇬 Singapore", count: 41 },
    { country: "🇸🇪 Sweden", count: 39 },
    { country: "🇦🇺 Australia", count: 37 },
  ];

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="text-lg font-bold">{payload[0].payload.country}</p>
          <p className="text-emerald-600 font-mono text-lg">
            {payload[0].value.toLocaleString()} Billionaires
          </p>
        </div>
      );
    }
    return null;
  };

  if (!mounted) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4">
      <Card className="w-full h-[800px]">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Countries with Most Billionaires 2024
          </CardTitle>
          <p className="text-gray-500 text-center text-sm mt-2">
            Number of Billionaires by Country
          </p>
        </CardHeader>
        <CardContent className="h-[700px]">
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={billionairesData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                fontSize={12} 
                tickFormatter={(value: number) => value.toLocaleString()} 
              />
              <YAxis 
                type="category" 
                dataKey="country" 
                width={100}
                fontSize={14}
                tick={{ fill: '#374151' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="url(#colorGradient)"
                radius={[0, 4, 4, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 text-sm text-gray-500 text-center">
            Source: Forbes World's Billionaires List 2024
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;

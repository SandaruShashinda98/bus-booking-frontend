import { Card, CardContent } from "@/components/ui/card";

const Stats = () => {
  const gdpData = [
    { country: "USA", flag: "🇺🇸", gdp: 25.46 },
    { country: "China", flag: "🇨🇳", gdp: 17.96 },
    { country: "Germany", flag: "🇩🇪", gdp: 4.12 },
    { country: "Japan", flag: "🇯🇵", gdp: 4.04 },
    { country: "India", flag: "🇮🇳", gdp: 3.58 },
    { country: "UK", flag: "🇬🇧", gdp: 2.94 },
    { country: "France", flag: "🇫🇷", gdp: 2.82 },
    { country: "Italy", flag: "🇮🇹", gdp: 2.19 },
    { country: "Brazil", flag: "🇧🇷", gdp: 2.09 },
    { country: "Canada", flag: "🇨🇦", gdp: 2.02 },
    { country: "Russia", flag: "🇷🇺", gdp: 1.91 },
    { country: "Mexico", flag: "🇲🇽", gdp: 1.67 },
  ];
  const maxCount = Math.max(...gdpData.map((item) => item.gdp));

  return (
    <Card className="w-full h-full bg-gradient-to-br from-white to-emerald-50 relative">
      <CardContent className="p-6 pb-2 h-full flex flex-col justify-between">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Top 12 Economies by GDP (2023)
          </h2>
          <p className="text-gray-500 text-center text-sm">
            Values in Trillion
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 gap-2 my-2">
          {gdpData.map((item, index) => (
            <div
              key={item.country}
              className="group relative hover:transform hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 font-bold text-sm text-emerald-600">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex items-center gap-2 w-36">
                  <span className="text-lg">{item.flag}</span>
                  <span className="font-semibold text-gray-700 text-sm truncate">
                    {item.country}
                  </span>
                </div>

                <div className="relative flex-1 h-7 flex items-center bg-emerald-50 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-sm transition-all duration-500 group-hover:opacity-90"
                    style={{
                      width: `${(item.gdp / maxCount) * 100}%`,
                    }}
                  />
                  <div className="absolute right-0 pr-3 flex items-baseline">
                    <span className="font-mono font-bold text-sm text-emerald-900">
                      {item.gdp.toLocaleString()} T
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <img
            src="/src/assets/orbitus.png"
            alt="Company Logo"
            className="w-16 h-16 object-contain"
          />

          <div className="ml-2">
            <div className="mt-2 text-xs text-gray-500 text-center">
              Source: International Monetary Fund World Economic Outlook
            </div>

            <div className="flex mx-auto">
              <p className="text-sm">
                Orbitus: Bringing world insights to your fingertips.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Stats;

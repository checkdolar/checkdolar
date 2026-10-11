import CurrencyConverter from "@/components/CurrencyConverter";

export const metadata = {
  title: "Convertidor de monedas",
  description:
    "Convertí entre pesos argentinos, dólares, monedas internacionales y criptomonedas con cotizaciones actualizadas.",
};

export default function ConvertidorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="section-title">Convertidor de monedas</h1>
        <p className="mt-1 text-sm text-violet-300">
          Convertí entre pesos, dólares, monedas internacionales y las
          principales criptomonedas. El resultado se actualiza automáticamente
          al modificar el importe o las monedas.
        </p>
      </div>

      <CurrencyConverter />

      <p className="text-xs text-violet-500">
        Para ARS se utiliza el dólar oficial informado por DolarApi.com; para
        el resto de las monedas y criptomonedas se toma como pivote el dólar
        estadounidense.
      </p>
    </div>
  );
}

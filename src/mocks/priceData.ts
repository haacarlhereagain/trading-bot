import { PriceEntity } from "../shared";
import { waitRandom } from "./waitRandom";

export const generatePriceData = async (startTime: number): Promise<PriceEntity[]> => {
    await waitRandom();

    const priceData: PriceEntity[] = [];
    const currentTime = Math.floor(Date.now() / 1000); // Текущее время в UNIX timestamp
    const interval = 30 * 60; // Шаг 15 минут в секундах
    
    for (let timestamp = startTime; timestamp <= currentTime; timestamp += interval) {
      const price = 100 + Math.sin((timestamp - startTime) / 1000) * 5 + Math.random() * 2; // Генерация цен
      priceData.push({ timestamp, price });
    }
    
    return priceData;
}
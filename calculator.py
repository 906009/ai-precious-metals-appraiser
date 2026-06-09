from typing import Optional

# Локальная тарифная сетка СКС Ломбард
TARIFF_GRID = {
    "gold_prices": {"375": 3000, "585": 4000, "750": 5750}, # цена за грамм металла
    "type_coefficients": { # коэффициенты по типам изделий
        "Кольцо": 1.0, "Серьги": 1.05, "Браслет": 0.95, 
        "Кулон": 1.0, "Цепь": 1.1, "Колье": 1.15
    },
    "condition_coefficients": { # коэффициенты состояния
        "Как новое": 1.0, "Среднее": 0.85, "Плохое": 0.6
    },
    "default_weights": { # Базовый вес, закрепленный за типом украшения
        "Кольцо": 3.0,
        "Серьги": 5.0,
        "Браслет": 8.0,
        "Кулон": 2.0,
        "Цепь": 10.0,
        "Колье": 15.0
    }
}

def calculate_jewelry_cost(
    purity: str, 
    item_type: str, 
    condition: str, 
    weight: Optional[float], 
    has_inserts: bool, 
    ai_defects: bool, 
    ai_damaged_inserts: bool
):
    # Если вес не указан, берем закрепленный за данным типом базовый вес
    base_weight = weight if weight is not None else TARIFF_GRID["default_weights"].get(item_type, 4.0)
    
    if purity == "Невозможно определить":
        price_per_gram = min(TARIFF_GRID["gold_prices"].values())
    else:
        price_per_gram = TARIFF_GRID["gold_prices"].get(purity, 3500)
        
    type_coeff = TARIFF_GRID["type_coefficients"].get(item_type, 1.0)
    cond_coeff = TARIFF_GRID["condition_coefficients"].get(condition, 1.0)
    
    # Расчет базовой стоимости
    estimated_value = base_weight * price_per_gram * type_coeff * cond_coeff
    
    # Корректировка на наличие вставок:
    # При оценке золота вес камней высчитываем из общего веса
    if has_inserts:
        estimated_value *= 0.95
    
    # Корректировки на основе ИИ (Дефекты снижают стоимость)
    if ai_defects:
        estimated_value *= 0.9
    if ai_damaged_inserts:
        estimated_value *= 0.85

    # Определение вероятности принятия в залог (со значительными дефектами вероятность падает)
    if ai_defects or ai_damaged_inserts or condition == "Плохое":
        probability = "Низкая вероятность"
    elif condition == "Среднее":
        probability = "Средняя вероятность"
    else:
        probability = "Высокая вероятность"
        
    return {
        "loan_amount": round(estimated_value * 0.8),    # Сумма займа (80% от оценки)
        "buyout_amount": round(estimated_value * 0.95), # Сумма выкупа (95% от оценки)
        "probability": probability
    }
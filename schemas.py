from pydantic import BaseModel, Field
from typing import Optional, List

# Данные анкеты от клиента
class EstimateRequest(BaseModel):
    item_type: str = Field(..., description="Кольцо/Серьги/Браслет/Кулон/Цепь/Колье")
    purity: str = Field(..., description="375/585/750/Невозможно определить")
    has_inserts: bool
    condition: str = Field(..., description="Как новое/Среднее/Плохое")
    weight: Optional[float] = None

# Структура ответа ИИ
class AIAnalysisResult(BaseModel):
    is_jewelry: bool = Field(..., description="Действительно ли на фото золотое ювелирное украшение")
    detected_type: str = Field(..., description="Кольцо/Серьги/Браслет/Кулон/Цепь/Колье")
    has_inserts: bool = Field(..., description="Наличие вставок (true/false)")
    condition_assessment: str = Field(..., description="Как новое/Среднее/Плохое")
    has_visual_defects: bool = Field(..., description="Наличие визуальных дефектов (true/false)")
    damaged_inserts: bool = Field(..., description="Повреждения вставок (true/false)")
    defect_description: str = Field(..., description="Описание выявленных дефектов")
    estimated_weight: Optional[float] = Field(None, description="Примерный вес изделия в граммах, оцененный по фото")
    other_visual_features: Optional[str] = Field(None, description="Иные визуальные характеристики")

# Финальный ответ для фронтенда
class EstimateResponse(BaseModel):
    loan_amount: int
    buyout_amount: int
    used_weight: float
    probability: str
    ai_report: AIAnalysisResult
    warning_message: str = Field(
        default=(
            "Расчет является предварительным и выполнен на основании фотографий и предоставленных данных. "
            "Окончательная оценка изделия определяется специалистом после очного осмотра в подразделении компании."
        ),
        description="Обязательное предупреждение клиента перед отображением результата"
    )

# Схема для отправки лида в Битрикс24
class LeadCreateRequest(BaseModel):
    name: str = Field(..., description="ФИО клиента")
    phone: str = Field(..., description="Номер телефона")
    branch_id: Optional[str] = Field(None, description="Выбранный филиал")
    client_data: EstimateRequest
    ai_results: AIAnalysisResult
    calculation: dict
    photos_base64: Optional[List[str]] = Field(None, description="Оригинальные фотографии в base64 для переноса в Битрикс24")
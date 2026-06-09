import os
import base64
import json
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mistralai.client import Mistral
import httpx

from schemas import AIAnalysisResult, EstimateResponse, LeadCreateRequest
from calculator import calculate_jewelry_cost

app = FastAPI(title="СКС Ломбард - AI Бэкенд Оценки Ювелирных Изделий")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Настройка клиента Mistral AI
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "eWnwnZji4TdU0fUrFM3VM9lm0bAJIibA")
mistral_client = Mistral(api_key=MISTRAL_API_KEY)

BITRIX24_WEBHOOK_URL = os.getenv("BITRIX24_WEBHOOK_URL")

# ID кастомных полей в Битрикс24
UF_ITEM_TYPE = os.getenv("B24_UF_ITEM_TYPE", "UF_CRM_ITEM_TYPE")
UF_HAS_INSERTS = os.getenv("B24_UF_HAS_INSERTS", "UF_CRM_HAS_INSERTS")
UF_DEFECTS = os.getenv("B24_UF_DEFECTS", "UF_CRM_DEFECTS")
UF_CONDITION = os.getenv("B24_UF_CONDITION", "UF_CRM_CONDITION")
UF_PROBABILITY = os.getenv("B24_UF_PROBABILITY", "UF_CRM_PROBABILITY")
UF_LOAN_AMOUNT = os.getenv("B24_UF_LOAN_AMOUNT", "UF_CRM_LOAN_AMOUNT")
UF_BUYOUT_AMOUNT = os.getenv("B24_UF_BUYOUT_AMOUNT", "UF_CRM_BUYOUT_AMOUNT")
UF_PHOTOS = os.getenv("B24_UF_PHOTOS", "UF_CRM_PHOTOS")

@app.post("/api/v1/estimate", response_model=EstimateResponse)
async def estimate_jewelry(
    item_type: str = Form(...),
    purity: str = Form(...),
    has_inserts: str = Form(...),
    condition: str = Form(...),
    weight: Optional[float] = Form(None),
    photos: list[UploadFile] = File(...)
):
    print("\n" + "="*40)
    print("--- ВХОДЯЩИЙ ЗАПРОС ОЦЕНКИ ---")
    print(f"item_type (тип): {item_type} (тип данных: {type(item_type)})")
    print(f"purity (проба): {purity} (тип данных: {type(purity)})")
    print(f"has_inserts (вставки): {has_inserts} (тип данных: {type(has_inserts)})")
    print(f"condition (состояние): {condition} (тип данных: {type(condition)})")
    print(f"weight (вес): {weight}")
    print(f"Количество полученных фото: {len(photos)}")
    for i, p in enumerate(photos):
        print(f"  Фото {i+1}: filename={p.filename}, content_type={p.content_type}")
    print("="*40 + "\n")
    
    # Конвертация has_inserts в bool
    has_inserts_bool = has_inserts.lower() == "true"
    
    # Валидация
    valid_purities = ["375", "585", "750", "Невозможно определить"]
    if purity not in valid_purities:
        raise HTTPException(status_code=400, detail=f"Недопустимая проба металла. Разрешены только: {', '.join(valid_purities)}.")
        
    valid_types = ["Кольцо", "Серьги", "Браслет", "Кулон", "Цепь", "Колье"]
    if item_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Недопустимый тип изделия. Допустимы только: {', '.join(valid_types)}.")

    if len(photos) < 1 or len(photos) > 2:
        raise HTTPException(status_code=400, detail="Необходимо загрузить от 1 до 2 фотографий.")

    # Подготовка контента для клиента Mistral
    content = [{"type": "text", "text": "Проанализируй эти изображения ювелирного изделия и верни структурированный JSON через вызов инструмента."}]
    
    for photo in photos:
        bytes_data = await photo.read()
        base64_image = base64.b64encode(bytes_data).decode("utf-8")
        media_type = photo.content_type or "image/jpeg"
        data_url = f"data:{media_type};base64,{base64_image}"
        
        content.append({
            "type": "image_url",
            "image_url": data_url
        })

    system_prompt = (
        "Ты — эксперт-товаровед в ювелирном ломбарде СКС Ломбард. Твоя задача — проанализировать фотографии изделия. "
        "Ты должен определить: действительно ли на фото золотое ювелирное украшение (is_jewelry: true/false), "
        "тип изделия (Кольцо/Серьги/Браслет/Кулон/Цепь/Колье), наличие вставок (true/false), "
        "состояние изделия (Как новое/Среднее/Плохое), наличие визуальных дефектов (царапины, потертости, деформация) (true/false), "
        "повреждения вставок (true/false), детальное описание выявленных дефектов, а также "
        "иные визуальные характеристики изделия (например, цвет золота, плетение, форма, огранка камня и т.д.). "
        "Используй инструмент 'respond_with_analysis' для ответа."
    )

    tools = [{
        "type": "function",
        "function": {
            "name": "respond_with_analysis",
            "description": "Форматирует результаты анализа ювелирного изделия",
            "parameters": AIAnalysisResult.model_json_schema()
        }
    }]

    try:
        # Запрос к Mistral AI
        response = mistral_client.chat.complete(
            model="mistral-medium-3-5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": content}
            ],
            tools=tools,
            tool_choice="any" # Форс вызова инструмента
        )

        print(f"DEBUG: Mistral Response: {response}")

        assistant_message = response.choices[0].message
        if not assistant_message.tool_calls:
            print(f"DEBUG: No tool_calls in response. Content: {assistant_message.content}")
            raise HTTPException(status_code=500, detail="Модель не вызвала инструмент для структурированного ответа.")

        # Парсим аргументы инструмента
        tool_call = assistant_message.tool_calls[0]
        # Mistral возвращает строку в формате JSON в .function.arguments
        args = tool_call.function.arguments
        if isinstance(args, str):
            ai_data_dict = json.loads(args)
        else:
            ai_data_dict = args
            
        ai_data = AIAnalysisResult(**ai_data_dict)

    except Exception as e:
        import traceback
        print(f"CRITICAL ERROR in estimate_jewelry: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Ошибка анализа Mistral AI: {str(e)}")

    # Антифрод
    if not ai_data.is_jewelry:
        raise HTTPException(
            status_code=400, 
            detail="ИИ определил, что объект на изображении не является золотым ювелирным украшением."
        )

    # Проверка совпадения типа изделия
    if item_type.lower() != ai_data.detected_type.lower():
        raise HTTPException(
            status_code=400,
            detail=f"Несовпадение типа изделия. Вы указали '{item_type}', а нейросеть определила '{ai_data.detected_type}'. Пожалуйста, проверьте тип изделия и попробуйте снова."
        )

    # Расчет стоимости
    calc_results = calculate_jewelry_cost(
        purity=purity,
        item_type=ai_data.detected_type if ai_data.is_jewelry else item_type,
        condition=ai_data.condition_assessment,
        weight=weight,
        has_inserts=has_inserts_bool,
        ai_defects=ai_data.has_visual_defects,
        ai_damaged_inserts=ai_data.damaged_inserts
    )

    return EstimateResponse(
        loan_amount=calc_results["loan_amount"],
        buyout_amount=calc_results["buyout_amount"],
        probability=calc_results["probability"],
        ai_report=ai_data
    )

@app.post("/api/v1/create-lead")
async def create_lead_in_bitrix24(payload: LeadCreateRequest):
    if not BITRIX24_WEBHOOK_URL:
        return {"status": "mock_success", "message": "Лид сохранен локально"}

    bitrix_payload = {
        "fields": {
            "TITLE": f"ИИ Оценка: {payload.ai_results.detected_type} - {payload.phone}",
            "NAME": payload.name,
            "PHONE": [{"VALUE": payload.phone, "VALUE_TYPE": "WORK"}],
            "OPPORTUNITY": payload.calculation.get("buyout_amount", 0),  
            "COMMENTS": (
                f"Предварительная сумма займа: {payload.calculation.get('loan_amount', 0)} руб.\n"
                f"Оценка состояния: {payload.ai_results.condition_assessment}\n"
                f"Выявленные дефекты: {payload.ai_results.defect_description}\n"
                f"Вероятность принятия: {payload.calculation.get('probability', 'Неизвестно')}\n"
                f"Иные визуальные характеристики: {payload.ai_results.other_visual_features}\n"
                f"Выбранный филиал: {payload.branch_id}"
            ),
            UF_ITEM_TYPE: payload.ai_results.detected_type,
            UF_HAS_INSERTS: "Да" if payload.ai_results.has_inserts else "Нет",
            UF_DEFECTS: payload.ai_results.defect_description,
            UF_CONDITION: payload.ai_results.condition_assessment,
            UF_PROBABILITY: payload.calculation.get("probability", "Неизвестно"),
            UF_LOAN_AMOUNT: payload.calculation.get("loan_amount", 0),
            UF_BUYOUT_AMOUNT: payload.calculation.get("buyout_amount", 0),
        }
    }

    if payload.photos_base64:
        file_payloads = []
        for idx, b64 in enumerate(payload.photos_base64):
            clean_b64 = b64.split(",")[-1] if "," in b64 else b64
            file_payloads.append([f"photo_{idx+1}.jpg", clean_b64])
        
        if len(file_payloads) == 1:
            bitrix_payload["fields"][UF_PHOTOS] = file_payloads[0]
        else:
            bitrix_payload["fields"][UF_PHOTOS] = file_payloads

    async with httpx.AsyncClient() as client:
        response = await client.post(BITRIX24_WEBHOOK_URL, json=bitrix_payload)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Ошибка интеграции с Битрикс24")
            
    return {"status": "success"}

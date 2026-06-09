"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const PRODUCT_TYPES = ["Кольцо", "Серьги", "Браслет", "Кулон", "Цепь", "Колье"];
const PURITIES = ["375", "585", "750", "Невозможно определить"];
const CONDITIONS = ["Как новое", "Среднее", "Плохое"];
const BRANCHES = [
  {
    id: "1",
    title: "Уфа, ул. Первомайская, 26",
    coords: [54.817240, 56.074980],
    note: "с 09:00 до 21:00"
  },
  {
    id: "2",
    title: "Уфа, ул. Первомайская, 40",
    coords: [54.8147630, 56.0838575],
    note: "с 09:00 до 21:00"
  },
  {
    id: "3",
    title: "Уфа, ул. ​Кольцевая, 58",
    coords: [54,8211703, 56.0838329],
    note: "с 09:00 до 20:00"
  },
  {
    id: "4",
    title: "Уфа, ул. Первомайская, 56",
    coords: [54.8119689, 56.0930264],
    note: "с 09:00 до 21:00"
  },
  {
    id: "5",
    title: "Уфа, ул. Первомайская, 98",
    coords: [54.806722, 56.111834],
    note: "с 09:00 до 21:00"
  },
  {
    id: "6",
    title: "Уфа, ул. Машиностроителей, 19",
    coords: [54.8087116, 56.1148767],
    note: "с 09:00 до 21:00"
  },
  {
    id: "7",
    title: "Уфа, ул. Кольцевая, 177",
    coords: [54.8117148, 56.1191549],
    note: "с 09:00 до 20:00"
  },
  {
    id: "8",
    title: "Уфа, ул. Сергея Вострецова, 13",
    coords: [54.8044025, 56.1248015],
    note: "с 09:00 до 21:00"
  },
  {
    id: "9",
    title: "Уфа, ул. Вологодская улица, 38",
    coords: [54.8117861, 56.1280759],
    note: "с 09:00 до 20:00"
  },
  {
    id: "10",
    title: "Уфа, Коммунаров, 61",
    coords: [54.8166384, 56.1235151],
    note: "с 09:00 до 20:00"
  },
  {
    id: "11",
    title: "Уфа, ул. Ферина, 8",
    coords: [54.784572, 56.130491],
    note: "с 09:00 до 21:00"
  },
  {
    id: "12",
    title: "Уфа, ул. ​Транспортная улица, 46/1",
    coords: [54.780634, 56.118234],
    note: "с 09:00 до 22:00"
  },
  {
    id: "13",
    title: "Уфа, ул. Гвардейская улица, 44",
    coords: [54.770618, 56.228811],
    note: "с 09:00 до 20:00"
  },
  {
    id: "14",
    title: "Уфа, Юрия Гагарина, 47",
    coords: [54.772358, 56.077394],
    note: "с 09:00 до 21:00"
  },
  {
    id: "15",
    title: "Уфа, Юрия Гагарина, 39/3",
    coords: [54.769969, 56.075190],
    note: "с 09:00 до 21:00"
  },
  {
    id: "16",
    title: "Уфа, ул. Юрия Гагарина, 31",
    coords: [54.767555, 56.069756],
    note: "с 09:00 до 21:00"
  },
  {
    id: "17",
    title: "Уфа, ул. Баязита Бикбая, 33",
    coords: [54.765175, 56.064885],
    note: "с 09:00 до 21:00"
  },
  {
    id: "18",
    title: "Уфа, ул. ​Гафури, 25",
    coords: [54.726992, 55.928341],
    note: "с 09:00 до 21:00"
  },
  {
    id: "19",
    title: "Уфа, ул. Красина, 21",
    coords: [54.733876, 55.934020],
    note: "с 09:00 до 19:30"
  },
  {
    id: "20",
    title: "Уфа, ул. ​Революционная, 52",
    coords: [54.734199, 55.958819],
    note: "с 09:00 до 21:00"
  },
  {
    id: "21",
    title: "Уфа, ул. Цюрупы, 104",
    coords: [54.736069, 55.958894],
    note: "с 09:00 до 21:00"
  },
  {
    id: "22",
    title: "Уфа, ул. Айская улица, 70",
    coords: [54.732245, 55.979548],
    note: "с 09:00 до 21:00"
  },
  {
    id: "23",
    title: "Уфа, Бульвар Хадии Давлетшиной, 11а",
    coords: [54.736075, 55.992004],
    note: "с 09:00 до 20:00"
  },
  {
    id: "24",
    title: "Уфа, ул. Бессонова, 3",
    coords: [54.741854, 55.989482],
    note: "с 09:00 до 22:00"
  },
  {
    id: "25",
    title: "Уфа, пр-т. Октября, 18/1",
    coords: [54.746281, 55.994428],
    note: "с 09:00 до 21:00"
  },
  {
    id: "26",
    title: "Уфа, пр-т. Октября, 23/2",
    coords: [54.747719, 55.991135],
    note: "с 09:00 до 21:00"
  },
  {
    id: "27",
    title: "Уфа, ул. Рихарда Зорге, 18",
    coords: [54.751118, 55.987884],
    note: "с 09:00 до 21:00"
  },
  {
    id: "28",
    title: "Уфа, пр-т. Октября, 52",
    coords: [54.754821, 56.004910],
    note: "с 09:00 до 21:00"
  },
  {
    id: "29",
    title: "Уфа, ул. Рихарда Зорге, 45/2",
    coords: [54.761829, 55.999825],
    note: "с 09:00 до 20:00"
  },
  {
    id: "30",
    title: "Уфа, пр-т. Октября, 68/1",
    coords: [54.759855, 56.011906],
    note: "с 09:00 до 21:00"
  },
  {
    id: "31",
    title: "Уфа, ул. Октября, 78",
    coords: [54.762992, 56.015092],
    note: "с 09:00 до 21:00"
  },
  {
    id: "32",
    title: "Уфа, ул. Менделеева, 207",
    coords: [54.743132, 56.025628],
    note: "с 09:00 до 21:00"
  },
  {
    id: "33",
    title: "Уфа, ул. Менделеева, 229/1",
    coords: [54.753165, 56.029539],
    note: "с 09:00 до 21:00"
  },
  {
    id: "34",
    title: "Уфа, пр-т. Октября, 134/1",
    coords: [54.777405, 56.031550],
    note: "с 09:00 до 21:00"
  },
  {
    id: "35",
    title: "Уфа, ул. Октября, 160",
    coords: [54.787955, 56.035852],
    note: "с 09:00 до 21:00"
  },
  {
    id: "36",
    title: "Уфа, ул. Октября, 162Б",
    coords: [54.789039, 56.036035],
    note: "с 09:00 до 21:00"
  },
  {
    id: "37",
    title: "Уфа, пр-т. Октября, 123",
    coords: [54.789787, 56.034951],
    note: "с 09:00 до 21:00"
  },
  {
    id: "38",
    title: "Уфа, ул. Российская, 11",
    coords: [54.790957, 56.042558],
    note: "с 09:00 до 21:00"
  },
  {
    id: "39",
    title: "Уфа, ул. Менделеева, 175/2",
    coords: [54.719653, 56.006488],
    note: "с 09:00 до 21:00"
  },
  {
    id: "40",
    title: "Уфа, ул. Менделеева, 141",
    coords: [54.713938, 55.997368],
    note: "с 09:00 до 21:00"
  },
  {
    id: "41",
    title: "Уфа, ул. Менделеева, 137",
    coords: [54.713473, 55.994257],
    note: "с 09:00 до 21:00"
  },
  {
    id: "42",
    title: "Уфа, ул. Степана Кувыкина, 29",
    coords: [54.706990, 55.997980],
    note: "с 09:00 до 21:00"
  },
  {
    id: "43",
    title: "Уфа, ул. ​Рабкоров, 7",
    coords: [54.703203, 56.001939],
    note: "с 09:00 до 20:00"
  },
  {
    id: "44",
    title: "Уфа, ул. Степана Кувыкина, 1г",
    coords: [54.698355, 55.991929],
    note: "с 09:00 до 21:00"
  },
  {
    id: "45",
    title: "Уфа, ул. Софьи Перовской, 23",
    coords: [54.695682, 55.998194],
    note: "с 09:00 до 21:00"
  },
  {
    id: "46",
    title: "Уфа, ул. Евгения Столярова, 2",
    coords: [54.700029, 55.858955],
    note: "с 10:00 до 20:00"
  },
  {
    id: "47",
    title: "Уфа, Правды, 12",
    coords: [54.703697, 55.836768],
    note: "с 09:00 до 21:00"
  },
  {
    id: "48",
    title: "Уфа, ул. Правды, 20",
    coords: [54.703078, 55.831865],
    note: "с 09:00 до 21:00"
  },
  {
    id: "49",
    title: "Уфа, ул. Ухтомского, 16",
    coords: [54.706302, 55.829301],
    note: "с 09:00 до 21:00"
  },
  {
    id: "50",
    title: "Уфа, ул. Правды, 12",
    coords: [54.789409, 55.949003],
    note: "с 09:00 до 21:00"
  },
  {
    id: "51",
    title: "Уфа, ул. Ахметова, 299",
    coords: [54.789836, 55.879447],
    note: "с 09:00 до 20:00"
  },
  {
    id: "52",
    title: "Уфа, Проезд Мебельщиков, 8в",
    coords: [54.798854, 55.874158],
    note: "с 09:00 до 21:00"
  },
  {
    id: "53",
    title: "Уфа, ​Советская улица, 20г",
    coords: [54.623861, 56.108122],
    note: "с 09:00 до 20:00"
  }
];

function YandexMap({ selectedBranch, onSelect }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ymaps) {
      window.ymaps.ready(() => {
        if (!mapInstance.current && mapRef.current) {
          const map = new window.ymaps.Map(mapRef.current, {
            center: [54.735147, 55.958727],
            zoom: 11,
            controls: ["zoomControl"]
          });

          BRANCHES.forEach((branch) => {
            const placemark = new window.ymaps.Placemark(
              branch.coords,
              {
                balloonContentHeader: branch.title,
                balloonContentBody: branch.note,
                hintContent: branch.title
              },
              {
                preset: "islands#redDotIcon"
              }
            );

            placemark.events.add("click", () => {
              if (onSelectRef.current) {
                onSelectRef.current(branch.title);
              }
            });

            map.geoObjects.add(placemark);
          });

          mapInstance.current = map;
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current && selectedBranch) {
      const branch = BRANCHES.find((b) => b.title === selectedBranch);
      if (branch) {
        mapInstance.current.setCenter(branch.coords, 15, {
          checkZoomRange: true,
          duration: 500
        });
      }
    }
  }, [selectedBranch]);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[#e8e8e8] shadow-sm mb-4">
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
}

const DISCLAIMER =
  "Внимание! Расчет является предварительным и выполнен на основании фотографий и предоставленных данных. Окончательная оценка изделия определяется специалистом после очного осмотра в подразделении компании.";

const initialForm = {
  type: "",
  purity: "",
  inserts: "",
  condition: "",
  weight: ""
};

const initialLead = {
  name: "",
  phone: "",
  branch: ""
};

function formatMoney(value) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const normalized = digits.startsWith("7")
    ? digits
    : digits.startsWith("8")
      ? `7${digits.slice(1)}`
      : `7${digits}`;

  const parts = normalized.slice(1).split("");
  let result = "+7";

  if (parts.length > 0) {
    result += ` (${parts.slice(0, 3).join("")}`;
  }
  if (parts.length >= 3) {
    result += ")";
  }
  if (parts.length > 3) {
    result += ` ${parts.slice(3, 6).join("")}`;
  }
  if (parts.length > 6) {
    result += `-${parts.slice(6, 8).join("")}`;
  }
  if (parts.length > 8) {
    result += `-${parts.slice(8, 10).join("")}`;
  }

  return result;
}

function SpinnerPanel() {
  const messages = [
    "ИИ анализирует фотографии, проверяет дефекты и рассчитывает стоимость по тарифной сетке...",
    "Сопоставляем пробу, визуальное состояние и ориентир по оценке золота...",
    "Готовим предварительную сумму займа и сумму выкупа для клиента..."
  ];
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [messages.length]);

  return (
    <section className="panel-border animate-rise-in mx-auto flex min-h-[66vh] w-full max-w-4xl flex-col items-center justify-center rounded-[2rem] bg-white px-6 py-12 text-center shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
      <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[rgba(213,0,0,0.16)] bg-[rgba(213,0,0,0.05)] animate-pulse-ring" />
        <div className="absolute inset-4 rounded-full border-[5px] border-[#ececec] border-t-[#d50000]" />
        <div className="h-5 w-5 rounded-full bg-[#d50000]" />
      </div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.36em] text-[#d50000]">
        СКС Ломбард AI
      </p>
      <h2 className="text-balance mb-4 text-3xl font-semibold text-[#161616] md:text-4xl">
        Выполняется предварительная оценка
      </h2>
      <p className="text-balance max-w-2xl text-base leading-7 text-[#555] md:text-lg">
        {messages[messageIndex]}
      </p>
    </section>
  );
}

function ProbabilityBadge({ value }) {
  const tones = {
    "Высокая вероятность": "border-emerald-300 bg-emerald-50 text-emerald-700",
    "Средняя вероятность": "border-amber-300 bg-amber-50 text-amber-700",
    "Низкая вероятность": "border-rose-300 bg-rose-50 text-rose-700"
  };

  return (
    <span
      className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${tones[value] ?? "border-stone-300 bg-stone-50 text-stone-700"}`}
    >
      {value}
    </span>
  );
}

function StepPill({ index, title, active, complete }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-full border px-3 py-2 transition ${
        active ? "border-[#d50000] bg-[#fff5f5]" : "border-[#e7e7e7] bg-white"
      }`}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
          complete
            ? "bg-[#161616] text-white"
            : active
              ? "bg-[#d50000] text-white"
              : "bg-[#f4f4f4] text-[#555]"
        }`}
      >
        {index}
      </div>
      <span className="hidden text-sm text-[#444] sm:block">{title}</span>
    </div>
  );
}

function PhotoCard({ photo, onRemove }) {
  return (
    <div className="overflow-hidden rounded-sm border border-[#ececec] bg-white shadow-sm">
      <img alt={photo.file.name} className="h-36 w-full object-cover" src={photo.preview} />
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <p className="truncate text-sm text-[#444]">{photo.file.name}</p>
        <button
          className="rounded-sm border border-[#f1c9c9] px-3 py-1 text-xs font-semibold text-[#b91c1c] transition hover:bg-[#fff5f5]"
          onClick={() => onRemove(photo.id)}
          type="button"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [activeAction, setActiveAction] = useState("branch");
  const [form, setForm] = useState(initialForm);
  const [photos, setPhotos] = useState([]);
  const [result, setResult] = useState(null);
  const [lead, setLead] = useState(initialLead);
  const [estimateError, setEstimateError] = useState("");
  const [leadStatus, setLeadStatus] = useState({ type: "", message: "" });
  const [isSubmittingEstimate, setIsSubmittingEstimate] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    };
  }, [photos]);

  const requiredFieldsValid = useMemo(() => {
    return Boolean(form.type && form.purity && form.inserts && form.condition);
  }, [form]);

  const canEstimate = requiredFieldsValid && photos.length >= 1 && photos.length <= 2;
  const leadPhoneValid = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(lead.phone);
  const canSubmitLead =
    lead.name.trim() && leadPhoneValid && (activeAction === "callback" || lead.branch);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateLead(field, value) {
    setLead((current) => ({ ...current, [field]: value }));
  }

  function addFiles(fileList) {
    const nextFiles = Array.from(fileList || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (nextFiles.length === 0) {
      return;
    }

    setEstimateError("");
    setPhotos((current) => {
      const merged = [...current];

      nextFiles.forEach((file) => {
        if (merged.length < 2) {
          merged.push({
            id: `${file.name}-${file.size}-${file.lastModified}`,
            file,
            preview: URL.createObjectURL(file)
          });
        }
      });

      return merged;
    });
  }

  function removePhoto(id) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) {
        URL.revokeObjectURL(target.preview);
      }
      return current.filter((photo) => photo.id !== id);
    });
  }

  async function handleEstimateSubmit(event) {
    event.preventDefault();

    if (!canEstimate) {
      return;
    }

    const payload = new FormData();
    payload.append("item_type", form.type); 
    payload.append("purity", form.purity);
    payload.append("has_inserts", form.inserts === "yes" ? "true" : "false"); 
    payload.append("condition", form.condition);
    if (form.weight.trim()) {
      payload.append("weight", form.weight.trim());
    }
    photos.forEach((photo) => payload.append("photos", photo.file));

    setEstimateError("");
    setLeadStatus({ type: "", message: "" });
    setIsSubmittingEstimate(true);
    setStep(2);

    try {
      const response = await fetch("http://localhost:8000/api/v1/estimate", {
        method: "POST",
        body: payload
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.detail?.includes("не является золотым")) {
           throw new Error("Изображение не содержит ювелирных изделий. Пожалуйста, загрузите другое фото.");
        }
        throw new Error(data.error || data.detail || "Не удалось выполнить предварительную оценку.");
      }

      setResult(data);
      setShowDisclaimer(true);
    } catch (error) {
      setStep(1);
      setEstimateError(error.message);
    } finally {
      setIsSubmittingEstimate(false);
    }
  }

  async function handleLeadSubmit(event) {
    event.preventDefault();

    if (!result || !canSubmitLead) {
      return;
    }

    setIsSubmittingLead(true);
    setLeadStatus({ type: "", message: "" });

    try {
      const photoPromises = photos.map(photo => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(photo.file);
        });
      });
      const photosBase64 = await Promise.all(photoPromises);

      const response = await fetch("http://localhost:8000/api/v1/create-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: lead.name.trim(),
          phone: lead.phone,
          branch_id: activeAction === "branch" ? lead.branch : null,
          client_data: {
            item_type: form.type,
            purity: form.purity,
            has_inserts: form.inserts === "yes",
            condition: form.condition,
            weight: form.weight.trim() ? parseFloat(form.weight.trim()) : null
          },
          ai_results: result.ai_report,
          calculation: {
            loan_amount: result.loan_amount,
            buyout_amount: result.buyout_amount,
            probability: result.probability
          },
          photos_base64: photosBase64
        })
      });

      if (!response.ok) {
        throw new Error("Не удалось отправить заявку.");
      }

      setLeadStatus({
        type: "success",
        message:
          activeAction === "branch"
            ? "Запись в подразделение зафиксирована."
            : "Запрос на обратный звонок отправлен."
      });
    } catch (error) {
      setLeadStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmittingLead(false);
    }
  }

  function handleDisclaimerClose() {
    setShowDisclaimer(false);
    setStep(4);
  }

  const stepTitles = ["Анкета", "Анализ", "Дисклеймер", "Результат", "Заявка"];

  return (
    <main className="min-h-screen bg-[#f6f6f6] px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-7xl">
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-[#e8e8e8] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.06)]">
          <div className="border-b border-[#efefef] bg-[#ffffff] px-5 py-3 text-white md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center">
                  <img src="/logo_sks.svg" alt="СКС Ломбард" className="h-10 w-auto" />
                </div>
              </div>
              <div className="flex flex-col text-sm md:items-end">
                <span className="font-semibold text-black">8 (800) 550-85-65</span>
                <span className="text-black/70">Предварительная онлайн-оценка золота</span>
              </div>
            </div>
          </div>

          <div className="relative px-5 py-8 md:px-8 md:py-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-[#d50000]" />
            <div className="flex flex-col">
              <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight text-[#161616] md:text-6xl">
                AI-Оценщик ювелирных изделий
              </h1>
            </div>
          </div>
        </section>

        <section className="mb-6 flex flex-wrap gap-3">
          {stepTitles.map((title, index) => {
            const visualStep = index + 1;
            const active =
              (visualStep === 3 && showDisclaimer) ||
              (!showDisclaimer &&
                ((step === 4 || step === 5) ? visualStep >= 4 : visualStep === step));
            const complete =
              (!showDisclaimer && step > visualStep && visualStep !== 3) ||
              (showDisclaimer && visualStep < 3);

            return (
              <StepPill
                key={title}
                active={active}
                complete={complete}
                index={visualStep}
                title={title}
              />
            );
          })}
        </section>

        {step === 2 ? (
          <SpinnerPanel />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <section className="rounded-[2rem] border border-[#e8e8e8] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)] md:p-8">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#d50000]">
                    Шаг 1
                  </p>
                  <h2 className="text-3xl font-semibold text-[#161616]">
                    Введите параметры изделия
                  </h2>
                </div>
                <div className="hidden rounded-full bg-[#fff5f5] px-4 py-2 text-xs font-semibold text-[#d50000] md:block">
                  Для расчета нужны данные и фото
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleEstimateSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#444]">Тип изделия</span>
                    <select
                      className="w-full rounded-sm border border-[#e6e6e6] bg-white px-4 py-3 text-[#161616] outline-none transition focus:border-[#d50000]"
                      onChange={(event) => updateForm("type", event.target.value)}
                      value={form.type}
                    >
                      <option value="">Выберите тип</option>
                      {PRODUCT_TYPES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#444]">Состояние изделия</span>
                    <select
                      className="w-full rounded-sm border border-[#e6e6e6] bg-white px-4 py-3 text-[#161616] outline-none transition focus:border-[#d50000]"
                      onChange={(event) => updateForm("condition", event.target.value)}
                      value={form.condition}
                    >
                      <option value="">Выберите состояние</option>
                      {CONDITIONS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-3">
                    <span className="text-sm font-semibold text-[#444]">Проба металла</span>
                    <div className="flex flex-wrap gap-3">
                      {PURITIES.map((item) => (
                        <button
                          key={item}
                          className={`rounded-sm border px-4 py-2 text-sm font-semibold transition ${
                            form.purity === item
                              ? "border-[#d50000] bg-[#fff5f5] text-[#d50000]"
                              : "border-[#e5e5e5] bg-white text-[#444] hover:border-[#d50000]"
                          }`}
                          onClick={() => updateForm("purity", item)}
                          type="button"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-sm font-semibold text-[#444]">Наличие вставок</span>
                    <div className="flex gap-3">
                      {[
                        { value: "yes", label: "Да" },
                        { value: "no", label: "Нет" }
                      ].map((item) => (
                        <button
                          key={item.value}
                          className={`rounded-sm border px-4 py-2 text-sm font-semibold transition ${
                            form.inserts === item.value
                              ? "border-[#161616] bg-[#161616] text-white"
                              : "border-[#e5e5e5] bg-white text-[#444] hover:border-[#161616]"
                          }`}
                          onClick={() => updateForm("inserts", item.value)}
                          type="button"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[#444]">Вес изделия, грамм</span>
                  <input
                    className="w-full rounded-sm border border-[#e6e6e6] bg-white px-4 py-3 text-[#161616] outline-none transition focus:border-[#d50000]"
                    inputMode="decimal"
                    min="0"
                    onChange={(event) => updateForm("weight", event.target.value)}
                    placeholder="Необязательное поле, если вес пока неизвестен"
                    step="0.01"
                    type="number"
                    value={form.weight}
                  />
                </label>

                <div className="rounded-[1.5rem] border border-[#ededed] bg-[#fafafa] p-4 text-sm leading-6 text-[#555]">
                  Предварительная оценка помогает сориентировать клиента до визита.
                  Окончательная сумма определяется после очного осмотра специалистом.
                </div>

                {estimateError ? (
                  <div className="rounded-[1.4rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {estimateError}
                  </div>
                ) : null}

                <button
                  className={`w-full rounded-[1.4rem] px-5 py-4 text-base font-semibold text-white transition ${
                    canEstimate
                      ? "bg-[#d50000] shadow-[0_18px_32px_rgba(213,0,0,0.22)] hover:-translate-y-0.5"
                      : "cursor-not-allowed bg-[#b8b8b8]"
                  }`}
                  disabled={!canEstimate || isSubmittingEstimate}
                  type="submit"
                >
                  {isSubmittingEstimate ? "Выполняем расчет..." : "Рассчитать стоимость"}
                </button>
              </form>
            </section>

            <section className="rounded-[2rem] border border-[#e8e8e8] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)] md:p-8">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#d50000]">
                    Фото изделия
                  </p>
                  <h2 className="text-3xl font-semibold text-[#161616]">
                    Загрузите 1-2 фотографии
                  </h2>
                </div>
                <div className="rounded-sm border border-[#ededed] bg-[#fafafa] px-3 py-2 text-xs font-semibold text-[#777]">
                  JPG / PNG / WEBP
                </div>
              </div>

              <div
                className="flex min-h-72 flex-col items-center justify-center rounded-[1.8rem] border-2 border-dashed border-[#d8d8d8] bg-[#fafafa] px-6 py-8 text-center transition hover:border-[#d50000]"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  addFiles(event.dataTransfer.files);
                }}
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0f0] text-xl font-bold text-[#d50000]">
                  01
                </div>
                <p className="mb-2 text-lg font-semibold text-[#161616]">
                  Перетащите фотографии украшения сюда
                </p>
                <p className="mb-6 max-w-md text-sm leading-6 text-[#666]">
                  Поддерживается от 1 до 2 изображений. Желательны четкие
                  ракурсы пробы, общей формы и заметных дефектов.
                </p>

                <input
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(event) => addFiles(event.target.files)}
                  ref={fileInputRef}
                  type="file"
                />

                <button
                  className="rounded-full border border-[#161616] px-5 py-3 text-sm font-semibold text-[#161616] transition hover:bg-[#161616] hover:text-white"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  Выбрать файлы
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 text-sm">
                <p className="text-[#666]">
                  Загружено: <span className="font-semibold text-[#161616]">{photos.length}/2</span>
                </p>
                <p className="text-[#666]">Минимум 1 фотография</p>
              </div>

              {photos.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {photos.map((photo) => (
                    <PhotoCard key={photo.id} onRemove={removePhoto} photo={photo} />
                  ))}
                </div>
              ) : null}
            </section>
          </div>
        )}

        {result && step >= 4 ? (
          <section className="animate-rise-in mt-6 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="rounded-[2rem] border border-[#e8e8e8] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] md:p-8">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#d50000]">
                    Шаг 4
                  </p>
                  <h2 className="text-3xl font-semibold text-[#161616]">
                    Предварительный результат оценки
                  </h2>
                </div>
                <ProbabilityBadge value={result.probability} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <article className="rounded-[1.8rem] border border-[#f0d0d0] bg-[#fff7f7] p-5">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#a33]">
                    Предварительная сумма займа
                  </p>
                  <p className="text-4xl font-semibold text-[#d50000] md:text-5xl">
                    {formatMoney(result.loan_amount)} ₽
                  </p>
                </article>

                <article className="rounded-[1.8rem] border border-[#ededed] bg-[#fafafa] p-5">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#666]">
                    Предварительная сумма выкупа
                  </p>
                  <p className="text-4xl font-semibold text-[#161616] md:text-5xl">
                    {formatMoney(result.buyout_amount)} ₽
                  </p>
                </article>
              </div>

              <div className="mt-6 rounded-[1.8rem] border border-[#ededed] bg-white p-5">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#666]">
                  Вероятность принятия в залог
                </p>
                <ProbabilityBadge value={result.probability} />
              </div>

              {result.ai_report && (result.ai_report.defect_description || result.ai_report.other_visual_features) ? (
                <div className="mt-6 rounded-[1.8rem] border border-[#e0e7ff] bg-[#f5f7ff] p-5">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#4f46e5]">
                    Оценка ИИ
                  </p>
                  <div className="space-y-3">
                    {result.ai_report.defect_description && result.ai_report.defect_description !== "Нет" && result.ai_report.defect_description !== "нет" ? (
                      <div>
                        <span className="font-semibold text-[#1e1b4b]">Дефекты: </span>
                        <span className="text-[#312e81]">{result.ai_report.defect_description}</span>
                      </div>
                    ) : null}
                    {result.ai_report.other_visual_features && result.ai_report.other_visual_features !== "Нет" && result.ai_report.other_visual_features !== "нет" ? (
                      <div>
                        <span className="font-semibold text-[#1e1b4b]">Визуальные характеристики: </span>
                        <span className="text-[#312e81]">{result.ai_report.other_visual_features}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 rounded-[1.8rem] border border-[#f0d0d0] bg-[#fff7f7] px-5 py-4 text-sm leading-6 text-[#5a2a2a]">
                {result.warning_message || DISCLAIMER}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#e8e8e8] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] md:p-8">
              <div className="mb-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.34em] text-[#d50000]">
                  Шаг 5
                </p>
                <h2 className="text-3xl font-semibold text-[#161616]">
                  Оформление следующего действия
                </h2>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  className={`rounded-[1.4rem] px-4 py-4 text-sm font-semibold transition ${
                    activeAction === "branch"
                      ? "bg-[#d50000] text-white shadow-[0_16px_30px_rgba(213,0,0,0.2)]"
                      : "border border-[#e5e5e5] bg-white text-[#222]"
                  }`}
                  onClick={() => setActiveAction("branch")}
                  type="button"
                >
                  Выбрать подразделение
                </button>
                <button
                  className={`rounded-[1.4rem] px-4 py-4 text-sm font-semibold transition ${
                    activeAction === "callback"
                      ? "bg-[#161616] text-white shadow-[0_16px_30px_rgba(22,22,22,0.18)]"
                      : "border border-[#e5e5e5] bg-white text-[#222]"
                  }`}
                  onClick={() => setActiveAction("callback")}
                  type="button"
                >
                  Заказать обратный звонок
                </button>
              </div>

              {activeAction === "branch" ? (
                <div className="mb-6 space-y-4">
                  <YandexMap 
                    onSelect={(title) => updateLead("branch", title)} 
                    selectedBranch={lead.branch} 
                  />
                  
                  <div className="max-h-[320px] overflow-y-auto pr-2">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {BRANCHES.map((branch) => (
                        <button
                          key={branch.id}
                          className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                            lead.branch === branch.title
                              ? "border-[#d50000] bg-[#fff7f7]"
                              : "border-[#e8e8e8] bg-white hover:border-[#d50000]"
                          }`}
                          onClick={() => updateLead("branch", branch.title)}
                          type="button"
                        >
                          <div className="mb-1 flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-[#161616]">
                              {branch.title}
                            </span>
                          </div>
                          <p className="text-xs leading-5 text-[#666]">{branch.note}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {lead.branch ? (
                    <div className="rounded-[1.4rem] border border-[#f0d0d0] bg-[#fff7f7] px-4 py-3 text-sm text-[#8b2f2f]">
                      Выбрано подразделение: {lead.branch}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mb-6 rounded-[1.5rem] border border-[#ededed] bg-[#fafafa] p-4 text-sm leading-6 text-[#666]">
                  Запрос на обратный звонок оформляется сразу после ввода контактных
                  данных. Отделение выбирать не требуется.
                </div>
              )}

              <form className="space-y-4" onSubmit={handleLeadSubmit}>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[#444]">ФИО</span>
                  <input
                    className="w-full rounded-sm border border-[#e6e6e6] bg-white px-4 py-3 text-[#161616] outline-none transition focus:border-[#d50000]"
                    onChange={(event) => updateLead("name", event.target.value)}
                    placeholder="Введите имя и фамилию"
                    type="text"
                    value={lead.name}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[#444]">Номер телефона</span>
                  <input
                    className="w-full rounded-sm border border-[#e6e6e6] bg-white px-4 py-3 text-[#161616] outline-none transition focus:border-[#d50000]"
                    inputMode="tel"
                    onChange={(event) => updateLead("phone", formatPhone(event.target.value))}
                    placeholder="+7 (999) 999-99-99"
                    type="tel"
                    value={lead.phone}
                  />
                </label>

                {leadStatus.message ? (
                  <div
                    className={`rounded-[1.4rem] px-4 py-3 text-sm ${
                      leadStatus.type === "success"
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border border-rose-200 bg-rose-50 text-rose-700"
                    }`}
                  >
                    {leadStatus.message}
                  </div>
                ) : null}

                <button
                  className={`w-full rounded-[1.4rem] px-5 py-4 text-base font-semibold text-white transition ${
                    canSubmitLead
                      ? "bg-[#161616] hover:-translate-y-0.5"
                      : "cursor-not-allowed bg-[#b8b8b8]"
                  }`}
                  disabled={!canSubmitLead || isSubmittingLead}
                  type="submit"
                >
                  {isSubmittingLead
                    ? "Отправляем..."
                    : activeAction === "branch"
                      ? "Подтвердить запись"
                      : "Жду звонка"}
                </button>
              </form>
            </div>
          </section>
        ) : null}

        {showDisclaimer ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(14,14,14,0.62)] p-4 backdrop-blur-sm">
            <div className="animate-rise-in w-full max-w-2xl rounded-sm border border-[#f0d0d0] bg-white p-6 shadow-[0_35px_90px_rgba(0,0,0,0.28)] md:p-8">
              <div className="mb-4 inline-flex rounded-sm bg-[#fff5f5] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#d50000]">
                Шаг 3
              </div>
              <h3 className="mb-4 text-3xl font-semibold text-[#161616]">
                Важное уведомление
              </h3>
              <p className="text-lg leading-8 text-[#444]">{DISCLAIMER}</p>
              <button
                className="mt-8 w-full rounded-[1.4rem] bg-[#d50000] px-5 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5"
                onClick={handleDisclaimerClose}
                type="button"
              >
                Понятно / Посмотреть результат
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
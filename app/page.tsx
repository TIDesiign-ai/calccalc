"use client";

import { useMemo, useState, useRef } from "react";

type InputKey =
  | "mathRequired"
  | "careerRequired"
  | "mathElective"
  | "socialElective"
  | "careerElective"
  | "artElective"
  | "languageElective"
  | "vocationalRequired"
  | "vocationalElective"
  | "vocationalCore"
  | "developmentRequired"
  | "developmentElective"
  | "comprehensive";

type Inputs = Record<InputKey, string>;
type RowKind = "requirement" | "earned" | "enrolled" | "shortage";
type Field = { key: string; label: string; group: string; inputKey?: InputKey; derived?: boolean };

const INPUT_FIELDS: { key: InputKey; label: string; group: string }[] = [
  { key: "mathRequired", label: "基礎数理 必修", group: "基礎科目" },
  { key: "careerRequired", label: "基礎キャリア 必修", group: "基礎科目" },
  { key: "mathElective", label: "基礎数理 選択", group: "基礎科目" },
  { key: "socialElective", label: "基礎現社 選択", group: "基礎科目" },
  { key: "careerElective", label: "基礎キャリア 選択", group: "基礎科目" },
  { key: "artElective", label: "基礎アート 選択", group: "基礎科目" },
  { key: "languageElective", label: "基礎語学 選択", group: "基礎科目" },
  { key: "vocationalRequired", label: "職業専門 必修", group: "職業専門科目" },
  { key: "vocationalElective", label: "職業専門 選択", group: "職業専門科目" },
  { key: "vocationalCore", label: "職業専門 コア科目", group: "職業専門科目" },
  { key: "developmentRequired", label: "展開科目 必修", group: "展開科目" },
  { key: "developmentElective", label: "展開科目 選択", group: "展開科目" },
  { key: "comprehensive", label: "総合科目", group: "総合科目" },
];

const FIELDS: Field[] = [
  { key: "mathRequired", label: "基礎数理 必修", group: "基礎科目", inputKey: "mathRequired" },
  { key: "careerRequired", label: "基礎キャリア 必修", group: "基礎科目", inputKey: "careerRequired" },
  { key: "basicRequiredTotal", label: "基礎科目 必修合計", group: "基礎科目", derived: true },
  { key: "mathElective", label: "基礎数理 選択", group: "基礎科目", inputKey: "mathElective" },
  { key: "socialElective", label: "基礎現社 選択", group: "基礎科目", inputKey: "socialElective" },
  { key: "careerElective", label: "基礎キャリア 選択", group: "基礎科目", inputKey: "careerElective" },
  { key: "artElective", label: "基礎アート 選択", group: "基礎科目", inputKey: "artElective" },
  { key: "languageElective", label: "基礎語学 選択", group: "基礎科目", inputKey: "languageElective" },
  { key: "basicElectiveTotal", label: "基礎科目 選択合計", group: "基礎科目", derived: true },
  { key: "basicTotal", label: "基礎科目 合計", group: "基礎科目", derived: true },
  { key: "vocationalRequired", label: "職業専門 必修", group: "職業専門科目", inputKey: "vocationalRequired" },
  { key: "vocationalElective", label: "職業専門 選択", group: "職業専門科目", inputKey: "vocationalElective" },
  { key: "vocationalCore", label: "職業専門 コア科目", group: "職業専門科目", inputKey: "vocationalCore" },
  { key: "vocationalTotal", label: "職業専門科目 合計", group: "職業専門科目", derived: true },
  { key: "developmentRequired", label: "展開科目 必修", group: "展開科目", inputKey: "developmentRequired" },
  { key: "developmentElective", label: "展開科目 選択", group: "展開科目", inputKey: "developmentElective" },
  { key: "developmentTotal", label: "展開科目 合計", group: "展開科目", derived: true },
  { key: "comprehensive", label: "総合科目", group: "総合科目", inputKey: "comprehensive" },
  { key: "graduationTotal", label: "卒業要件合計", group: "合計", derived: true },
  { key: "grandTotal", label: "総合計", group: "合計", derived: true },
];

const INITIAL_INPUTS: Inputs = {
  mathRequired: "",
  careerRequired: "",
  mathElective: "",
  socialElective: "",
  careerElective: "",
  artElective: "",
  languageElective: "",
  vocationalRequired: "",
  vocationalElective: "",
  vocationalCore: "",
  developmentRequired: "",
  developmentElective: "",
  comprehensive: "",
};

const ROWS: { kind: RowKind; label: string }[] = [
  { kind: "requirement", label: "卒業要件" },
  { kind: "earned", label: "修得単位" },
  { kind: "shortage", label: "不足単位" },
  { kind: "enrolled", label: "履修単位" },
];

function num(value: string | undefined): number {
  if (value == null || value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}


function getCellValue(kind: RowKind, key: string, required: Inputs, earned: Inputs, enrolled: Inputs): string {
  const source = kind === "requirement" ? required : kind === "earned" ? earned : enrolled;
  const shortageValue = (inputKey: InputKey) => {
    if (required[inputKey].trim() === "" && earned[inputKey].trim() === "") return "";
    return String(Math.max(0, num(required[inputKey]) - num(earned[inputKey])));
  };
  const value = (inputKey: InputKey) => kind === "shortage" ? shortageValue(inputKey) : source[inputKey];
  const sum = (keys: InputKey[]) => {
    const values = keys.map(value);
    if (!values.some((item) => item.trim() !== "")) return "";
    return String(values.reduce((total, item) => total + num(item), 0));
  };

  switch (key) {
    case "mathRequired": return value("mathRequired");
    case "careerRequired": return value("careerRequired");
    case "mathElective": return value("mathElective");
    case "socialElective": return value("socialElective");
    case "careerElective": return value("careerElective");
    case "artElective": return value("artElective");
    case "languageElective": return value("languageElective");
    case "vocationalRequired": return value("vocationalRequired");
    case "vocationalElective": return value("vocationalElective");
    case "vocationalCore": return value("vocationalCore");
    case "developmentRequired": return value("developmentRequired");
    case "developmentElective": return value("developmentElective");
    case "comprehensive": return value("comprehensive");
    case "basicRequiredTotal": return sum(["mathRequired", "careerRequired"]);
    case "basicElectiveTotal": return sum(["mathElective", "socialElective", "careerElective", "artElective", "languageElective"]);
    case "basicTotal": {
      const mandatory = getCellValue(kind, "basicRequiredTotal", required, earned, enrolled);
      const elective = getCellValue(kind, "basicElectiveTotal", required, earned, enrolled);
      if (mandatory === "" && elective === "") return "";
      return String(num(mandatory) + num(elective));
    }
    case "vocationalTotal": return sum(["vocationalRequired", "vocationalElective", "vocationalCore"]);
    case "developmentTotal": return sum(["developmentRequired", "developmentElective"]);
    case "graduationTotal": {
      const parts = ["basicTotal", "vocationalTotal", "developmentTotal", "comprehensive"];
      const values = parts.map((part) => getCellValue(kind, part, required, earned, enrolled));
      if (!values.some((item) => item.trim() !== "")) return "";
      return String(values.reduce((total, item) => total + num(item), 0));
    }
    case "grandTotal":
      return kind === "earned" || kind === "enrolled"
        ? getCellValue(kind, "graduationTotal", required, earned, enrolled)
        : "";
    default: return "";
  }
}

function normalizeCell(value: string): string {
  return value.replace(/\u00a0/g, " ").replace(/[\s\u3000]+/g, "").trim();
}

function parseCreditNumber(value: string): string {
  const cleaned = value.replace(/[\s\u3000,]/g, "").trim();
  if (!cleaned || cleaned === "—" || cleaned === "-" || cleaned === "－") return "";
  const match = cleaned.match(/-?\d+(?:\.\d+)?/);
  return match ? match[0] : "";
}

const COLUMN_TO_KEY: Record<number, InputKey> = {
  1: "mathRequired",
  2: "careerRequired",
  4: "mathElective",
  5: "socialElective",
  6: "careerElective",
  7: "artElective",
  8: "languageElective",
  13: "vocationalRequired",
  14: "vocationalElective",
  15: "vocationalCore",
  19: "developmentRequired",
  20: "developmentElective",
  24: "comprehensive",
};

function detectRowKind(label: string): "requirement" | "earned" | "enrolled" | "shortage" | null {
  const text = normalizeCell(label);
  if (text.includes("卒業要件")) return "requirement";
  if (text.includes("修得単位")) return "earned";
  if (text.includes("履修単位")) return "enrolled";
  if (text.includes("不足単位")) return "shortage";
  return null;
}

function parsePastedGradeTable(source: string): { required: Inputs; earned: Inputs; enrolled: Inputs; rowsFound: number; cellsFound: number } {
  const required: Inputs = { ...INITIAL_INPUTS };
  const earned: Inputs = { ...INITIAL_INPUTS };
  const enrolled: Inputs = { ...INITIAL_INPUTS };
  let rowsFound = 0;
  let cellsFound = 0;

  const applyRow = (cells: string[]) => {
    const kind = detectRowKind(cells[0] ?? "");
    if (!kind) return;
    rowsFound += 1;
    if (kind === "shortage") return; // 不足単位は要件と修得単位から再計算
    const target = kind === "requirement" ? required : kind === "earned" ? earned : enrolled;
    for (const [indexText, key] of Object.entries(COLUMN_TO_KEY)) {
      const index = Number(indexText);
      if (index >= cells.length) continue;
      const value = parseCreditNumber(cells[index] ?? "");
      target[key] = value;
      if (value !== "") cellsFound += 1;
    }
  };

  const trimmed = source.trim();
  if (!trimmed) return { required, earned, enrolled, rowsFound, cellsFound };

  // HTMLソース専用。貼り付けたHTMLをDOMとして解析するだけで、画面には描画しない。
  if (!/<table[\s>]/i.test(trimmed) && !/<!doctype\s+html|<html[\s>]/i.test(trimmed)) {
    return { required, earned, enrolled, rowsFound, cellsFound };
  }

  const doc = new DOMParser().parseFromString(trimmed, "text/html");
  const tables = Array.from(doc.querySelectorAll("table"));
  const table = tables.find((candidate) => {
    const text = normalizeCell(candidate.textContent ?? "");
    return candidate.id === "ctlTaniShukei_tblShukei" ||
      (["卒業要件", "修得単位", "履修単位"].every((label) => text.includes(label)) && text.includes("基礎数理"));
  });

  if (!table) return { required, earned, enrolled, rowsFound, cellsFound };

  for (const row of Array.from(table.querySelectorAll("tr"))) {
    const cells = Array.from(row.querySelectorAll(":scope > td, :scope > th")).map((cell) => cell.textContent ?? "");
    if (cells.length > 1) applyRow(cells);
  }
  return { required, earned, enrolled, rowsFound, cellsFound };
}

const inputStyle: React.CSSProperties = {
  width: 76,
  minWidth: 76,
  boxSizing: "border-box",
  padding: "8px 7px",
  border: "1px solid #d5deec",
  borderRadius: 7,
  color: "#172033",
  background: "#fff",
  fontSize: 13,
  textAlign: "right",
};

const buttonStyle: React.CSSProperties = {
  border: "1px solid #d6deeb",
  borderRadius: 10,
  padding: "11px 16px",
  background: "#fff",
  color: "#26344d",
  fontWeight: 650,
  cursor: "pointer",
};

export default function Home() {
  const [required, setRequired] = useState<Inputs>({ ...INITIAL_INPUTS });
  const [earned, setEarned] = useState<Inputs>({ ...INITIAL_INPUTS });
  const [enrolled, setEnrolled] = useState<Inputs>({ ...INITIAL_INPUTS });
  const [gradeFileName, setGradeFileName] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalRequired = num(getCellValue("requirement", "graduationTotal", required, earned, enrolled));
  const totalEarned = num(getCellValue("earned", "graduationTotal", required, earned, enrolled));
  const totalEnrolled = num(getCellValue("enrolled", "graduationTotal", required, earned, enrolled));
  const remaining = Math.max(0, totalRequired - totalEarned - totalEnrolled);
  const progress = totalRequired > 0 ? Math.min(100, (totalEarned / totalRequired) * 100) : 0;

  const categoryProgress = useMemo(() => {
    const groups = [
      { label: "基礎科目 合計", key: "basicTotal" },
      { label: "職業専門科目 合計", key: "vocationalTotal" },
      { label: "展開科目 合計", key: "developmentTotal" },
      { label: "総合科目", key: "comprehensive" },
    ];
    return groups.map((group) => ({
      ...group,
      required: num(getCellValue("requirement", group.key, required, earned, enrolled)),
      earned: num(getCellValue("earned", group.key, required, earned, enrolled)),
      enrolled: num(getCellValue("enrolled", group.key, required, earned, enrolled)),
    })).filter((group) => group.required > 0);
  }, [required, earned, enrolled]);

  function updateInput(kind: "requirement" | "earned" | "enrolled", key: InputKey, value: string) {
    const setter = kind === "requirement" ? setRequired : kind === "earned" ? setEarned : setEnrolled;
    setter((current) => ({ ...current, [key]: value }));
  }

  function clearForm() {
    setRequired({ ...INITIAL_INPUTS });
    setEarned({ ...INITIAL_INPUTS });
    setEnrolled({ ...INITIAL_INPUTS });
  }

  async function importGradeFile(file?: File) {
    if (!file) {
      setImportMessage("ファイルが選択されていません。");
      return;
    }

    setGradeFileName(file.name);
    setImportMessage(`読み込み開始：${file.name}（${file.size} bytes）`);

    try {
      const source = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("ファイル内容をテキストとして取得できませんでした。"));
          }
        };

        reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました。"));
        reader.readAsText(file);
      });

      setImportMessage(
        `ファイル読み込み成功：${source.length}文字。成績表を解析しています...`
      );

      let html = source;

      // MHT/MHTMLの場合は、HTML本文を含む可能性があることを通知する。
      if (/\.mhtml?$/i.test(file.name)) {
        setImportMessage(
          `MHTファイルは読み込めました（${source.length}文字）が、MIME形式の解析は未対応です。HTML形式で保存したファイルも試してください。`
        );
        return;
      }

      const parsed = parsePastedGradeTable(html);

      if (parsed.rowsFound < 2 || parsed.cellsFound === 0) {
        const doc = new DOMParser().parseFromString(source, "text/html");
        const tableCount = doc.querySelectorAll("table").length;
        const hasTargetTable =
          doc.querySelector("#ctlTaniShukei_tblShukei") !== null;

        setImportMessage(
          `解析失敗：${source.length}文字 / テーブル数 ${tableCount} / ` +
          `対象テーブル ${hasTargetTable ? "あり" : "なし"} / ` +
          `検出行 ${parsed.rowsFound} / 単位データ ${parsed.cellsFound}`
        );
        return;
      }

      setRequired(parsed.required);
      setEarned(parsed.earned);
      setEnrolled(parsed.enrolled);

      setImportMessage(
        `読み込み完了：${file.name} から ${parsed.rowsFound}行・${parsed.cellsFound}個の単位データを取り込みました。`
      );
    } catch (error) {
      console.error("成績表ファイルの読み込みエラー:", error);
      setImportMessage(
        `読み込みエラー：${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  function exportJson() {
    const payload = { required, earned, enrolled };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "gradpath-input.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importJson(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { required: Inputs; earned: Inputs; enrolled: Inputs };
        const isValid = [parsed.required, parsed.earned, parsed.enrolled].every((item) =>
          item && typeof item === "object" && INPUT_FIELDS.every((field) => typeof item[field.key] === "string"),
        );
        if (!isValid) throw new Error("Invalid file");
        setRequired(parsed.required);
        setEarned(parsed.earned);
        setEnrolled(parsed.enrolled);
      } catch {
        window.alert("JSONファイルを読み込めませんでした。");
      }
    };
    reader.readAsText(file);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f6fb", color: "#172033", fontFamily: "Arial, 'Noto Sans JP', sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #e3e8f0", padding: "18px max(4%, calc((100% - 1180px) / 2))", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 21, fontWeight: 800 }}>成績表<span style={{ color: "#3563e9" }}>DI</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="/grades" style={{ color: "#3563e9", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>科目別成績を見る →</a>
          <div style={{ fontSize: 12, color: "#758198" }}>Degree Inspector</div>
        </div>
      </header>

      <div style={{ width: "min(1180px, 94%)", margin: "0 auto", padding: "34px 0 48px" }}>
        <section style={{ marginBottom: 26 }}>
          <div style={{ color: "#3563e9", fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>DEGREE INSPECTOR</div>
          <h1 style={{ fontSize: "clamp(27px, 4vw, 40px)", lineHeight: 1.35, margin: "10px 0" }}>卒業までの道のりを、<br />ひと目でわかるように。</h1>
          <p style={{ color: "#718096", lineHeight: 1.8, fontSize: 14, marginBottom: 0 }}>成績表のHTMLファイルを選ぶだけ。卒業要件・修得単位・履修単位を自動で読み取り、卒業までの単位状況を確認できます。</p>
        </section>

        <section style={{ background: "#fff", border: "1px solid #dbe4f4", borderRadius: 16, padding: 20, marginBottom: 22 }}>
          <div style={{ color: "#3563e9", fontSize: 11, fontWeight: 800 }}>STEP 01</div>
          <h2 style={{ fontSize: 20, margin: "5px 0 8px" }}>成績表をインポート</h2>
          <p style={{ color: "#718096", fontSize: 13, lineHeight: 1.8, marginTop: 0 }}>Active Academyの成績表をHTMLファイル（.html / .htm）として保存し、ここから選択してください。ファイルはブラウザ内で解析し、サーバーには送信しません。</p>
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              minHeight: 150,
              border: "2px dashed #b8c8e8",
              borderRadius: 12,
              padding: 20,
              background: "#f8faff",
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            <span style={{ fontSize: 28 }} aria-hidden="true">
              ⇧
            </span>

            <strong style={{ fontSize: 15, color: "#26344d" }}>
              成績表のHTMLファイルを選択
            </strong>

            <span style={{ fontSize: 12, color: "#718096" }}>
              {gradeFileName || ".html / .htm / .mht 対応"}
            </span>

            <div
              style={{
                padding: "10px 16px",
                border: "1px solid #d6deeb",
                borderRadius: 10,
                background: "#fff",
                color: "#26344d",
                fontWeight: 650,
                pointerEvents: "none",
              }}
            >
              ファイルを選ぶ
            </div>

            <input
              type="file"
              accept=".html,.htm,.mht,.mhtml"
              onChange={(event) => {
                const input = event.currentTarget;
                const file = input.files?.[0];

                if (!file) {
                  setImportMessage("ファイルを取得できませんでした。");
                  return;
                }

                setImportMessage(
                  `イベント発火：${file.name}（${file.size} bytes）`
                );

                input.value = "";
                void importGradeFile(file);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
                zIndex: 10,
              }}
            />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 12 }}>
            <span style={{ fontSize: 12, color: "#718096" }}>※ ファイル全体から成績表テーブルを自動検出します。</span>
          </div>
          {importMessage && <p role="status" style={{ margin: "12px 0 0", fontSize: 13, lineHeight: 1.7, color: importMessage.startsWith("読み込み完了") ? "#167447" : "#b45309" }}>{importMessage}</p>}
        </section>

        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20, marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
            <div><div style={{ color: "#3563e9", fontSize: 11, fontWeight: 800 }}>STEP 02</div><h2 style={{ fontSize: 20, margin: "5px 0 0" }}>単位データを確認・修正</h2></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button onClick={clearForm} style={buttonStyle}>すべてクリア</button>
              <button onClick={exportJson} style={buttonStyle}>JSONを書き出す ↓</button>
<<<<<<< HEAD
              <label
                style={{
                  ...buttonStyle,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                JSON入力テスト
                <input
                  type="file"
                  accept="*/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];

                    window.alert(
                      file
                        ? `JSON側の入力は動作：${file.name}`
                        : "ファイルが取得できません"
                    );

                    event.currentTarget.value = "";
                  }}
                />
              </label>
=======
              <label style={{ ...buttonStyle, display: "inline-flex", alignItems: "center" }}>JSONを読み込む<input type="file" accept="application/json,.json" onChange={(event) => { importJson(event.target.files?.[0]); event.currentTarget.value = ""; }} style={{ display: "none" }} /></label>
>>>>>>> 1cdddc42ccedf0f06e386f31b69235b74d14ea73
            </div>
          </div>
          <p style={{ color: "#718096", fontSize: 12, lineHeight: 1.8, marginTop: 0 }}>白い入力欄に数値を入力してください。合計列・不足単位は自動計算されるため、入力は不要です。表は横にスクロールできます。</p>

          <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 10 }}>
            <table style={{ borderCollapse: "separate", borderSpacing: 0, minWidth: 1740, width: "100%", fontSize: 12 }}>
              <thead>
                <tr>
                  <th rowSpan={2} style={{ position: "sticky", left: 0, zIndex: 3, background: "#f2f5fa", borderBottom: "1px solid #dce3ee", borderRight: "1px solid #e2e8f0", padding: "12px 14px", textAlign: "left", minWidth: 94 }}>分野区分</th>
                  <th colSpan={10} style={groupHeaderStyle}>基礎科目</th>
                  <th colSpan={4} style={groupHeaderStyle}>職業専門科目</th>
                  <th colSpan={3} style={groupHeaderStyle}>展開科目</th>
                  <th colSpan={1} style={groupHeaderStyle}>総合科目</th>
                  <th colSpan={2} style={{ ...groupHeaderStyle, background: "#e9efff" }}>合計</th>
                </tr>
                <tr>
                  {FIELDS.map((field) => <th key={field.key} style={{ ...fieldHeaderStyle, background: field.group === "合計" ? "#f1f4ff" : "#fafbfe" }}>{field.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.kind}>
                    <th style={{ position: "sticky", left: 0, zIndex: 2, background: row.kind === "requirement" ? "#edf2ff" : row.kind === "shortage" ? "#fff6e8" : "#fff", borderBottom: "1px solid #e6eaf1", borderRight: "1px solid #e6eaf1", padding: "12px 14px", textAlign: "left", whiteSpace: "nowrap" }}>{row.label}</th>
                    {FIELDS.map((field) => {
                      const cell = getCellValue(row.kind, field.key, required, earned, enrolled);
                      const isEditable = !!field.inputKey && row.kind !== "shortage";
                      const inputSet = row.kind === "requirement" ? required : row.kind === "earned" ? earned : enrolled;
                      const autoBackground = row.kind === "shortage" ? "#fff8ed" : field.derived ? "#f5f7fb" : "#fff";
                      return <td key={field.key} style={{ borderBottom: "1px solid #e6eaf1", borderRight: "1px solid #f0f2f6", padding: 6, textAlign: "center", background: autoBackground }}>
                        {isEditable && field.inputKey ? (
                          <input aria-label={`${row.label} ${field.label}`} type="number" min="0" step="0.5" inputMode="decimal" value={inputSet[field.inputKey]} onChange={(event) => updateInput(row.kind as "requirement" | "earned" | "enrolled", field.inputKey!, event.target.value)} placeholder="—" style={inputStyle} />
                        ) : (
                          <span style={{ display: "inline-block", minWidth: 55, padding: "8px 4px", fontWeight: field.derived || row.kind === "shortage" ? 700 : 400, color: row.kind === "shortage" && num(cell) > 0 ? "#a85b00" : "#26344d" }}>{cell === "" ? "—" : cell}</span>
                        )}
                      </td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 12, color: "#758198", fontSize: 11, lineHeight: 1.7 }}>※ 不足単位は「卒業要件 − 修得単位」で計算します。履修中の単位は不足単位から差し引かず、卒業までに追加で必要な目安にのみ反映します。</div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 22 }}>
          {[
            { label: "卒業要件", value: totalRequired, bg: "#eaf0ff" },
            { label: "修得済み", value: totalEarned, bg: "#e8f8ef" },
            { label: "履修中", value: totalEnrolled, bg: "#fff4df" },
            { label: "履修中を含む不足", value: remaining, bg: "#f0edff" },
          ].map((item) => <article key={item.label} style={{ background: item.bg, border: "1px solid #e2e8f0", borderRadius: 14, padding: 19 }}><div style={{ color: "#718096", fontSize: 12, marginBottom: 10 }}>{item.label}</div><strong style={{ fontSize: 29 }}>{item.value}<span style={{ fontSize: 12, marginLeft: 5 }}>単位</span></strong></article>)}
        </section>

        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 22, marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}><h2 style={{ fontSize: 20, margin: 0 }}>取得状況</h2><strong style={{ color: "#3563e9" }}>{progress.toFixed(1)}%</strong></div>
          <div style={{ height: 10, background: "#edf0f5", borderRadius: 20, overflow: "hidden", marginBottom: 24 }}><div style={{ width: `${progress}%`, height: "100%", background: "#3563e9", borderRadius: 20, transition: "width .2s" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 22 }}>
            {categoryProgress.map((category) => {
              const ratio = category.required > 0 ? Math.min(100, category.earned / category.required * 100) : 0;
              return <div key={category.key}><div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8, fontSize: 12 }}><span>{category.label}</span><span style={{ whiteSpace: "nowrap", color: "#718096" }}><strong style={{ color: "#172033" }}>{category.earned}</strong> / {category.required}</span></div><div style={{ height: 6, background: "#edf0f5", borderRadius: 10, overflow: "hidden" }}><div style={{ width: `${ratio}%`, height: "100%", background: "#5a80e5", borderRadius: 10 }} /></div>{category.enrolled > 0 && <div style={{ fontSize: 11, color: "#a66b12", marginTop: 6 }}>履修中：{category.enrolled}単位</div>}</div>;
            })}
          </div>
        </section>

        <footer style={{ textAlign: "center", color: "#8993a3", fontSize: 11, lineHeight: 1.8 }}>成績表DI — 卒業要件の確認を支援するシミュレーターです。<br />正式な卒業判定は学校の規定を確認してください。</footer>
      </div>
    </main>
  );
}

const groupHeaderStyle: React.CSSProperties = {
  background: "#f2f5fa",
  borderBottom: "1px solid #dce3ee",
  padding: "10px 8px",
  textAlign: "center",
  fontSize: 12,
  fontWeight: 750,
  color: "#44516a",
};

const fieldHeaderStyle: React.CSSProperties = {
  borderBottom: "1px solid #dce3ee",
  borderRight: "1px solid #edf0f5",
  padding: "10px 8px",
  textAlign: "center",
  verticalAlign: "bottom",
  whiteSpace: "normal",
  minWidth: 115,
  maxWidth: 135,
  lineHeight: 1.5,
  color: "#44516a",
  fontWeight: 650,
};

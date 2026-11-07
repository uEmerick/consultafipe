"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import fipeIcon from "./iconFipeVeloz.png";
import styles from "./page.module.css";

const API_URL = "/api/fipe";

type Option = {
  code: string;
  name: string;
};

type VehicleDetails = {
  brand: string;
  model: string;
  modelYear: number;
  price: string;
  fuel: string;
  fuelAcronym: string;
  codeFipe: string;
  referenceMonth: string;
};

async function fetchApi<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Não foi possível carregar os dados (erro ${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export default function Home() {
  const [brands, setBrands] = useState<Option[]>([]);
  const [models, setModels] = useState<Option[]>([]);
  const [years, setYears] = useState<Option[]>([]);
  const [brandCode, setBrandCode] = useState("");
  const [modelCode, setModelCode] = useState("");
  const [yearCode, setYearCode] = useState("");
  const [details, setDetails] = useState<VehicleDetails | null>(null);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [searching, setSearching] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetchApi<Option[]>(`${API_URL}/brands`, controller.signal)
      .then(setBrands)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setCatalogError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingBrands(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!brandCode) return;

    const controller = new AbortController();
    setLoadingModels(true);
    setCatalogError("");

    fetchApi<Option[]>(
      `${API_URL}/brands/${encodeURIComponent(brandCode)}/models`,
      controller.signal,
    )
      .then(setModels)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setCatalogError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingModels(false);
      });

    return () => controller.abort();
  }, [brandCode]);

  useEffect(() => {
    if (!brandCode || !modelCode) return;

    const controller = new AbortController();
    setLoadingYears(true);
    setCatalogError("");

    fetchApi<Option[]>(
      `${API_URL}/brands/${encodeURIComponent(brandCode)}/models/${encodeURIComponent(modelCode)}/years`,
      controller.signal,
    )
      .then(setYears)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setCatalogError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingYears(false);
      });

    return () => controller.abort();
  }, [brandCode, modelCode]);

  async function handleSearch() {
    if (!brandCode || !modelCode || !yearCode) return;

    setSearching(true);
    setSearchError("");
    setDetails(null);

    try {
      const vehicle = await fetchApi<VehicleDetails>(
        `${API_URL}/brands/${encodeURIComponent(brandCode)}/models/${encodeURIComponent(modelCode)}/years/${encodeURIComponent(yearCode)}`,
      );
      setDetails(vehicle);
    } catch (error) {
      setSearchError(
        error instanceof Error ? error.message : "Não foi possível consultar este veículo.",
      );
    } finally {
      setSearching(false);
    }
  }

  function handleBrandChange(value: string) {
    setBrandCode(value);
    setModelCode("");
    setYearCode("");
    setModels([]);
    setYears([]);
    setDetails(null);
    setSearchError("");
  }

  function handleModelChange(value: string) {
    setModelCode(value);
    setYearCode("");
    setYears([]);
    setDetails(null);
    setSearchError("");
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="#" aria-label="FipeVeloz início">
          <Image className={styles.brandIcon} src={fipeIcon} alt="" width={40} height={40} priority />
          <span className={styles.brandName}>fipe<span>veloz</span></span>
        </a>
        <nav className={styles.nav} aria-label="Navegação principal">
          <a className={styles.navActive} href="#consulta">Consultar veículo</a>
          <a href="#sobre">Sobre a FIPE</a>
        </nav>
        <a className={styles.headerLink} href="https://veiculos.fipe.org.br/" target="_blank" rel="noreferrer">
          Site oficial <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className={styles.hero} id="consulta">
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}><span /> CONSULTA DE VEÍCULOS</div>
            <h1>Descubra quanto<br />vale o seu <em>carro.</em></h1>
            <p>Consulte o valor de referência atualizado pela Tabela FIPE. É rápido, simples e gratuito.</p>
            <div className={styles.trustLine}>
              <span className={styles.trustIcon} aria-hidden="true">✓</span>
              Dados oficiais da Fundação Instituto de Pesquisas Econômicas
            </div>
          </div>
          <div className={styles.heroArtwork} aria-hidden="true">
            <div className={styles.artCircle} />
            <div className={styles.artLabel}><span>FIPE</span><small>VALOR DE REFERÊNCIA</small></div>
            <svg className={styles.carIllustration} viewBox="0 0 580 270" fill="none">
              <path d="m61 177 20-58c5-14 17-24 32-27l67-14 46-47c10-10 23-16 37-16h91c20 0 39 9 52 24l34 42 73 18c16 4 28 17 31 33l8 45v28H61v-28Z" fill="#F4F1E9" />
              <path d="m194 95 43-44a39 39 0 0 1 27-11h88c14 0 27 6 36 17l31 38H194Z" fill="#BBD4C5" />
              <path d="M61 177h511M181 95h238M88 149h38m394 0h37" stroke="#1D4938" strokeWidth="8" strokeLinecap="round" />
              <path d="m105 177 13-38c3-10 12-17 23-17h359c10 0 19 7 22 17l11 38" stroke="#1D4938" strokeWidth="8" />
              <circle cx="158" cy="199" r="32" fill="#193D30" />
              <circle cx="158" cy="199" r="14" fill="#E8E4DA" />
              <circle cx="477" cy="199" r="32" fill="#193D30" />
              <circle cx="477" cy="199" r="14" fill="#E8E4DA" />
              <path d="M237 60h1m47 0h1m47 0h1m47 0h1" stroke="#1D4938" strokeWidth="5" strokeLinecap="round" />
            </svg>
            <div className={styles.artNote}><span className={styles.noteDot} /> Preciso e atualizado</div>
          </div>
        </section>

        <section className={styles.lookupSection} aria-labelledby="lookup-title">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionKicker}>PESQUISA FIPE</span>
              <h2 id="lookup-title">Encontre seu veículo</h2>
            </div>
            <span className={styles.stepCount}>3 etapas simples</span>
          </div>

          <div className={styles.formCard}>
            <div className={styles.stepRail} aria-hidden="true">
              <span className={styles.stepActive}>1</span><i /><span className={modelCode ? styles.stepActive : ""}>2</span><i /><span className={yearCode ? styles.stepActive : ""}>3</span>
            </div>
            <div className={styles.selectGrid}>
              <label className={styles.field}>
                <span className={styles.fieldNumber}>01</span>
                <span className={styles.fieldLabel}>Marca</span>
                <span className={styles.selectWrap}>
                  <select value={brandCode} onChange={(event) => handleBrandChange(event.target.value)} disabled={loadingBrands}>
                    <option value="">{loadingBrands ? "Carregando marcas..." : "Selecione a marca"}</option>
                    {brands.map((brand) => <option value={brand.code} key={brand.code}>{brand.name}</option>)}
                  </select>
                  <span className={styles.chevron} aria-hidden="true">⌄</span>
                </span>
              </label>

              <label className={styles.field}>
                <span className={styles.fieldNumber}>02</span>
                <span className={styles.fieldLabel}>Modelo</span>
                <span className={styles.selectWrap}>
                  <select value={modelCode} onChange={(event) => handleModelChange(event.target.value)} disabled={!brandCode || loadingModels}>
                    <option value="">{loadingModels ? "Carregando modelos..." : "Selecione o modelo"}</option>
                    {models.map((model) => <option value={model.code} key={model.code}>{model.name}</option>)}
                  </select>
                  <span className={styles.chevron} aria-hidden="true">⌄</span>
                </span>
              </label>

              <label className={styles.field}>
                <span className={styles.fieldNumber}>03</span>
                <span className={styles.fieldLabel}>Ano / versão</span>
                <span className={styles.selectWrap}>
                  <select value={yearCode} onChange={(event) => { setYearCode(event.target.value); setDetails(null); setSearchError(""); }} disabled={!modelCode || loadingYears}>
                    <option value="">{loadingYears ? "Carregando anos..." : "Selecione o ano"}</option>
                    {years.map((year) => <option value={year.code} key={year.code}>{year.name}</option>)}
                  </select>
                  <span className={styles.chevron} aria-hidden="true">⌄</span>
                </span>
              </label>
            </div>

            {catalogError && <p className={styles.errorMessage} role="alert">{catalogError}</p>}

            <div className={styles.formFooter}>
              <p><span className={styles.lockIcon} aria-hidden="true">⌑</span> Consulta gratuita, sem cadastro</p>
              <button className={styles.searchButton} onClick={handleSearch} disabled={!brandCode || !modelCode || !yearCode || searching}>
                {searching ? "Consultando..." : "Consultar preço"}
                {!searching && <span aria-hidden="true">↗</span>}
              </button>
            </div>
          </div>

          {searchError && <p className={styles.errorMessage} role="alert">{searchError}</p>}

          {details && (
            <section className={styles.resultCard} aria-live="polite" aria-label="Resultado da consulta">
              <div className={styles.resultTop}>
                <span className={styles.resultBadge}><span /> RESULTADO DA CONSULTA</span>
                <span className={styles.reference}>{details.referenceMonth}</span>
              </div>
              <div className={styles.resultMain}>
                <div>
                  <p className={styles.vehicleName}>{details.brand} {details.model}</p>
                  <p className={styles.vehicleMeta}>{details.modelYear} · {details.fuel}{details.fuelAcronym ? ` (${details.fuelAcronym})` : ""}</p>
                </div>
                <div className={styles.priceBlock}>
                  <span>VALOR FIPE</span>
                  <strong>{details.price}</strong>
                </div>
              </div>
              <div className={styles.resultBottom}>
                <span>Código FIPE <strong>{details.codeFipe}</strong></span>
                <span>Referência <strong>{details.referenceMonth}</strong></span>
              </div>
            </section>
          )}
        </section>

        <section className={styles.infoStrip} id="sobre">
          <div className={styles.infoIcon} aria-hidden="true">i</div>
          <div>
            <h3>O que é a Tabela FIPE?</h3>
            <p>Uma referência nacional de preços médios de veículos, calculada pela Fundação Instituto de Pesquisas Econômicas. O valor pode variar conforme região, conservação e mercado.</p>
          </div>
          <a href="https://veiculos.fipe.org.br/" target="_blank" rel="noreferrer">Saiba mais <span aria-hidden="true">↗</span></a>
        </section>
      </main>

      <footer className={styles.footer}>
        <a className={styles.brand} href="#" aria-label="FipeVeloz início">
          <Image className={styles.brandIcon} src={fipeIcon} alt="" width={40} height={40} />
          <span className={styles.brandName}>fipe<span>veloz</span></span>
        </a>
        <p>Informações de referência fornecidas pela Tabela FIPE.</p>
        <span className={styles.footerCopy}>© 2026 FipeVeloz</span>
      </footer>
    </div>
  );
}

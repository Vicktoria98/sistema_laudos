import { useState, useCallback, useRef } from "react";

const TESTES_DB = {
  AOL: { nome:"AOL – Atenção Online (A/C/D)", area:"Atenção", publico:["infantil","adolescente","adulto"], plataforma:"Vetor VOL", online:true, sessoes:0.5, qualitativo:false, descricao:"1ª bateria online de atenção aprovada pelo CFP. Avalia atenção alternada, concentrada e dividida com registro de tempo e precisão.", indices:["Atenção Alternada – Acertos","Atenção Concentrada – Acertos","Atenção Dividida – Acertos","Erros totais","Omissões"], normas:{ranges:[{max:24,label:"Muito Abaixo",cor:"#922b21"},{max:39,label:"Abaixo",cor:"#935116"},{max:59,label:"Médio",cor:"#1e6641"},{max:74,label:"Acima",cor:"#1a4f7a"},{max:999,label:"Muito Acima",cor:"#4a235a"}]}},
  BPA2: { nome:"BPA-2 – Bateria Psicológica para Avaliação da Atenção", area:"Atenção", publico:["infantil","adolescente","adulto"], plataforma:"Vetor VOL (correção gratuita)", online:true, sessoes:1, qualitativo:false, descricao:"Amostra de 155 mil participantes. Normas para crianças (6-14a) e idosos (80+). Correção automática gratuita na VOL. Alta robustez normativa.", indices:["Atenção Concentrada – Acertos","Atenção Alternada – Acertos","Atenção Dividida – Acertos","Erros","Omissões"], normas:{ranges:[{max:24,label:"Inferior",cor:"#922b21"},{max:39,label:"Abaixo da Média",cor:"#935116"},{max:59,label:"Médio",cor:"#1e6641"},{max:74,label:"Acima da Média",cor:"#1a4f7a"},{max:999,label:"Superior",cor:"#4a235a"}]}},
  TAVIS3: { nome:"TAVIS-3 – Teste de Atenção Visual", area:"Atenção", publico:["infantil","adolescente","adulto"], plataforma:"Informatizado (licença)", online:true, sessoes:1, qualitativo:false, descricao:"Avalia 4 componentes atencionais. Aprovado SATEPSI. Muito usado em investigação de TDAH e diagnóstico diferencial.", indices:["Atenção Seletiva – Percentil","Atenção Alternada – Percentil","Atenção Dividida – Percentil","Atenção Sustentada – Percentil"], normas:{ranges:[{max:24,label:"Muito Abaixo",cor:"#922b21"},{max:39,label:"Abaixo",cor:"#935116"},{max:59,label:"Médio",cor:"#1e6641"},{max:74,label:"Acima",cor:"#1a4f7a"},{max:999,label:"Muito Acima",cor:"#4a235a"}]}},
  NEUPSILIN: { nome:"NEUPSILIN – Avaliação Neuropsicológica Breve", area:"Neuropsicologia", publico:["adulto"], plataforma:"Vetor (presencial + correção VOL)", online:false, sessoes:1, qualitativo:false, descricao:"Avalia 8 funções cognitivas em uma sessão: orientação, atenção, percepção, memória, linguagem, aritmética, praxias e funções executivas.", indices:["Orientação","Atenção","Percepção","Memória de Trabalho","Linguagem","Habilidades Aritméticas","Praxias","Funções Executivas","Escore Total"], normas:{ranges:[{max:1,label:"Comprometido",cor:"#922b21"},{max:999,label:"Preservado",cor:"#1e6641"}]}},
  RAVLT: { nome:"RAVLT – Aprendizagem Auditivo-Verbal de Rey", area:"Memória", publico:["adolescente","adulto"], plataforma:"AvalPsico (correção online) / Vetor", online:true, sessoes:1, qualitativo:false, descricao:"Avalia memória episódica verbal, curva de aprendizagem e reconhecimento. Aprovado SATEPSI. Essencial para diagnóstico diferencial.", indices:["A1","A2","A3","A4","A5","Lista B","A6 – Evocação imediata","A7 – Recordação tardia","Reconhecimento","Intrusões"], normas:{ranges:[{max:24,label:"Muito Abaixo",cor:"#922b21"},{max:39,label:"Abaixo",cor:"#935116"},{max:59,label:"Médio",cor:"#1e6641"},{max:74,label:"Acima",cor:"#1a4f7a"},{max:999,label:"Muito Acima",cor:"#4a235a"}]}},
  REY: { nome:"Figuras Complexas de Rey", area:"Memória Visual", publico:["infantil","adolescente","adulto"], plataforma:"Presencial (Vetor / Hogrefe)", online:false, sessoes:1, qualitativo:false, descricao:"Avalia memória visual, organização visoespacial e planejamento. Enriquece laudos com dados visoespaciais.", indices:["Cópia – Escore","Memória Imediata – Escore","Memória Tardia – Escore"], normas:{ranges:[{max:24,label:"Muito Abaixo",cor:"#922b21"},{max:39,label:"Abaixo",cor:"#935116"},{max:59,label:"Médio",cor:"#1e6641"},{max:74,label:"Acima",cor:"#1a4f7a"},{max:999,label:"Muito Acima",cor:"#4a235a"}]}},
  WISC5: { nome:"WISC-V – Escala Wechsler de Inteligência para Crianças", area:"Inteligência", publico:["infantil","adolescente"], plataforma:"Pearson (presencial)", online:false, sessoes:2, qualitativo:false, descricao:"Padrão ouro para avaliação cognitiva infantil (6-16a). QI Total e 5 índices primários. Essencial para DI, TDAH, TEA e dificuldades de aprendizagem.", indices:["QI Total","ICV – Compreensão Verbal","IVE – Visual-Espacial","IMO – Memória de Trabalho","IVP – Velocidade de Processamento","IFT – Fluência"], normas:{ranges:[{max:69,label:"Muito Inferior",cor:"#922b21"},{max:79,label:"Limítrofe",cor:"#935116"},{max:89,label:"Médio Inferior",cor:"#7d6608"},{max:109,label:"Médio",cor:"#1e6641"},{max:119,label:"Médio Superior",cor:"#1a4f7a"},{max:129,label:"Superior",cor:"#4a235a"},{max:999,label:"Muito Superior",cor:"#2d0b52"}]}},
  WAIS4: { nome:"WAIS-IV – Escala Wechsler de Inteligência para Adultos", area:"Inteligência", publico:["adulto"], plataforma:"Pearson (presencial)", online:false, sessoes:2, qualitativo:false, descricao:"Padrão ouro para avaliação cognitiva adulta (16-90a). QI Total e 4 índices.", indices:["QI Total","ICV – Compreensão Verbal","IOP – Organização Perceptual","IMO – Memória de Trabalho","IVP – Velocidade de Processamento"], normas:{ranges:[{max:69,label:"Extremamente Baixo",cor:"#922b21"},{max:79,label:"Limítrofe",cor:"#935116"},{max:89,label:"Médio Baixo",cor:"#7d6608"},{max:109,label:"Médio",cor:"#1e6641"},{max:119,label:"Médio Alto",cor:"#1a4f7a"},{max:129,label:"Superior",cor:"#4a235a"},{max:999,label:"Muito Superior",cor:"#2d0b52"}]}},
  G38: { nome:"G-38 – Teste de Inteligência Geral", area:"Inteligência", publico:["adolescente","adulto"], plataforma:"Vetor VOL", online:true, sessoes:0.5, qualitativo:false, descricao:"Raciocínio analógico online. Triagem cognitiva rápida, correção automática na VOL.", indices:["Escore Bruto","Percentil"], normas:{ranges:[{max:24,label:"Inferior",cor:"#922b21"},{max:39,label:"Abaixo da Média",cor:"#935116"},{max:59,label:"Médio",cor:"#1e6641"},{max:74,label:"Acima da Média",cor:"#1a4f7a"},{max:999,label:"Superior",cor:"#4a235a"}]}},
  TONI4: { nome:"TONI-4 – Inteligência Não Verbal", area:"Inteligência", publico:["infantil","adolescente","adulto"], plataforma:"Hogrefe (presencial)", online:false, sessoes:1, qualitativo:false, descricao:"Avalia inteligência livre de linguagem. Ideal para TEA, afasias, surdos, barreiras de linguagem.", indices:["QI Equivalente","Percentil"], normas:{ranges:[{max:69,label:"Muito Inferior",cor:"#922b21"},{max:79,label:"Inferior",cor:"#935116"},{max:89,label:"Médio Inferior",cor:"#7d6608"},{max:109,label:"Médio",cor:"#1e6641"},{max:119,label:"Médio Superior",cor:"#1a4f7a"},{max:999,label:"Superior",cor:"#4a235a"}]}},
  BRIEF2: { nome:"BRIEF-2 – Funções Executivas no Cotidiano", area:"Funções Executivas", publico:["infantil","adolescente"], plataforma:"Hogrefe (papel + correção HTS)", online:true, sessoes:0.5, qualitativo:false, descricao:"Questionário para pais e professores. Avalia funções executivas no cotidiano. Correção digital HTS.", indices:["Inibição","Flexibilidade","Controle Emocional","Iniciativa","Memória de Trabalho","Planejamento","Monitoramento","IRC – Regulação Comportamental","IM – Metacognitivo","EGE – Escore Global Executivo"], normas:{ranges:[{max:59,label:"Dentro do Esperado",cor:"#1e6641"},{max:64,label:"Limítrofe",cor:"#7d6608"},{max:999,label:"Elevado",cor:"#922b21"}]}},
  FDT: { nome:"FDT – Five Digit Test", area:"Funções Executivas", publico:["infantil","adolescente","adulto"], plataforma:"TEA Edições / Vetor", online:false, sessoes:0.5, qualitativo:false, descricao:"Avalia velocidade de processamento, inibição e flexibilidade cognitiva. Alternativa ao Stroop com normas brasileiras. Rápido (~5 min).", indices:["Leitura – Tempo (s)","Contagem – Tempo (s)","Escolha – Tempo (s)","Alternância – Tempo (s)","Índice de Interferência","Índice de Flexibilidade"], normas:{ranges:[{max:24,label:"Muito Abaixo",cor:"#922b21"},{max:39,label:"Abaixo",cor:"#935116"},{max:59,label:"Médio",cor:"#1e6641"},{max:74,label:"Acima",cor:"#1a4f7a"},{max:999,label:"Muito Acima",cor:"#4a235a"}]}},
  BAI: { nome:"BAI – Inventário de Ansiedade de Beck", area:"Ansiedade", publico:["adolescente","adulto"], plataforma:"Pearson / online", online:true, sessoes:0.3, qualitativo:false, descricao:"21 itens. Padrão ouro para rastreio de ansiedade. Aprovado SATEPSI.", indices:["Escore Total BAI"], normas:{ranges:[{max:10,label:"Mínimo",cor:"#1e6641"},{max:19,label:"Leve",cor:"#7d6608"},{max:30,label:"Moderado",cor:"#935116"},{max:999,label:"Grave",cor:"#922b21"}]}},
  BDI2: { nome:"BDI-II – Inventário de Depressão de Beck", area:"Depressão", publico:["adolescente","adulto"], plataforma:"Pearson / online", online:true, sessoes:0.3, qualitativo:false, descricao:"21 itens. Rastreio de depressão. Aprovado SATEPSI. Permite monitoramento longitudinal.", indices:["Escore Total BDI-II"], normas:{ranges:[{max:13,label:"Mínimo",cor:"#1e6641"},{max:19,label:"Leve",cor:"#7d6608"},{max:28,label:"Moderado",cor:"#935116"},{max:999,label:"Grave",cor:"#922b21"}]}},
  BHS: { nome:"BHS – Escala de Desesperança de Beck", area:"Risco", publico:["adolescente","adulto"], plataforma:"Pearson / online", online:true, sessoes:0.2, qualitativo:false, descricao:"Rastreia desesperança — preditor de risco de suicídio. Importante em triagens de risco.", indices:["Escore Total BHS"], normas:{ranges:[{max:3,label:"Mínimo",cor:"#1e6641"},{max:8,label:"Leve",cor:"#7d6608"},{max:14,label:"Moderado",cor:"#935116"},{max:999,label:"Grave",cor:"#922b21"}]}},
  STAXI2: { nome:"STAXI-2 – Inventário de Raiva Estado-Traço", area:"Raiva / Regulação Emocional", publico:["adolescente","adulto"], plataforma:"Vetor VOL", online:true, sessoes:0.3, qualitativo:false, descricao:"Avalia raiva como estado e traço, expressão e controle. Aprovado SATEPSI. Útil em agressividade, TAB, TOD, PTSD.", indices:["Raiva-Estado","Raiva-Traço","Expressão Externa","Expressão Interna","Controle Externo","Controle Interno","Índice de Expressão de Raiva"], normas:{ranges:[{max:44,label:"Baixo",cor:"#1a4f7a"},{max:55,label:"Médio",cor:"#1e6641"},{max:64,label:"Acima da Média",cor:"#7d6608"},{max:999,label:"Alto",cor:"#922b21"}]}},
  HUMOR_A: { nome:"HUMOR-A – Escala Multidimensional de Depressão", area:"Depressão", publico:["adulto"], plataforma:"Hogrefe", online:true, sessoes:0.3, qualitativo:false, descricao:"7 subescalas: Depressão, Desamparo, Desesperança, Isolamento Social, Autoeficácia, Autoconceito e Autoestima. 3-10 min.", indices:["Depressão","Desamparo","Desesperança","Isolamento Social","Autoeficácia","Autoconceito","Autoestima"], normas:{ranges:[{max:44,label:"Abaixo da Média",cor:"#1a4f7a"},{max:55,label:"Médio",cor:"#1e6641"},{max:65,label:"Acima da Média",cor:"#7d6608"},{max:999,label:"Clinicamente Elevado",cor:"#922b21"}]}},
  NEOPI_R: { nome:"NEO PI-R – Inventário de Personalidade (Big Five)", area:"Personalidade", publico:["adolescente","adulto"], plataforma:"Vetor VOL", online:true, sessoes:0.5, qualitativo:false, descricao:"Modelo Big Five com 5 domínios e 30 facetas. Aprovado SATEPSI. Aplicação e correção online pela VOL.", indices:["Neuroticismo (N)","Extroversão (E)","Abertura (O)","Amabilidade (A)","Conscienciosidade (C)"], normas:{ranges:[{max:34,label:"Muito Baixo",cor:"#1a4f7a"},{max:44,label:"Baixo",cor:"#2a6496"},{max:55,label:"Médio",cor:"#1e6641"},{max:64,label:"Alto",cor:"#7d6608"},{max:999,label:"Muito Alto",cor:"#922b21"}]}},
  MMPI2: { nome:"MMPI-2 – Inventário Multifásico de Personalidade de Minnesota", area:"Psicopatologia", publico:["adulto"], plataforma:"Hogrefe", online:false, sessoes:1, qualitativo:false, descricao:"Instrumento de avaliação clínica mais amplamente estudado no mundo. Avalia amplo espectro de psicopatologia. 18-74 anos.", indices:["Hipocondria (Hs)","Depressão (D)","Histeria (Hy)","Desvio Psicopático (Pd)","Paranoia (Pa)","Psicastenia (Pt)","Esquizofrenia (Sc)","Hipomania (Ma)","Introversão Social (Si)"], normas:{ranges:[{max:44,label:"Abaixo da Média",cor:"#1a4f7a"},{max:59,label:"Médio",cor:"#1e6641"},{max:64,label:"Elevado Moderado",cor:"#7d6608"},{max:999,label:"Clinicamente Elevado",cor:"#922b21"}]}},
  SKIP: { nome:"SKIP – Rorschach Sistema Kohn", area:"Personalidade / Psicopatologia", publico:["adolescente","adulto"], plataforma:"Vetor VOL (correção online)", online:true, sessoes:1, qualitativo:true, descricao:"Sistema informatizado para Rorschach com correção online VOL. Indicadores psicopatológicos validados.", indices:["DEPI – Índice de Depressão","PTI – Índice de Transtorno de Personalidade","S-CON – Índice de Suicídio","HVI – Hipervigilância","OBS – Estilo Obsessivo","Controle e Estresse","Relações Interpessoais","Autopercepção"], normas:{qualitativo:true}},
  HTP: { nome:"HTP – Casa-Árvore-Pessoa", area:"Personalidade", publico:["infantil","adolescente","adulto"], plataforma:"Presencial (aprovado CFP)", online:false, sessoes:1, qualitativo:true, descricao:"Técnica projetiva gráfica aprovada SATEPSI. Acessa dinâmica emocional, autoimagem e relações interpessoais.", indices:["Análise qualitativa"], normas:{qualitativo:true}},
  PFISTER: { nome:"Pirâmides Coloridas de Pfister", area:"Personalidade / Afeto", publico:["infantil","adolescente","adulto"], plataforma:"AvalPsico / Hogrefe", online:true, sessoes:0.5, qualitativo:true, descricao:"Avalia dinâmica afetiva por escolhas cromáticas. Projetivo com correção semi-objetiva. Aprovado CFP.", indices:["Fórmula Cromática","Síndromes Cromáticas","Índice de Ansiedade","Índice de Agressividade","Índice de Labilidade"], normas:{qualitativo:true}},
  PALOGRAFICO: { nome:"Palográfico – Avaliação Grafomotora da Personalidade", area:"Personalidade", publico:["adolescente","adulto"], plataforma:"Vetor VOL (correção online)", online:true, sessoes:0.5, qualitativo:true, descricao:"Traços de personalidade por análise grafomotora. Correção online via VOL. Aprovado SATEPSI.", indices:["Tamanho","Pressão","Inclinação","Forma","Continuidade","Velocidade","Direção","Ordem"], normas:{qualitativo:true}},
  CBCL: { nome:"CBCL – Child Behavior Checklist (6-18a)", area:"Comportamento", publico:["infantil","adolescente"], plataforma:"ASEBA (online)", online:true, sessoes:0.5, qualitativo:false, descricao:"Respondido pelos pais. 8 síndromes + internalização/externalização. Padrão internacional.", indices:["Internalização – T","Externalização – T","Total de Problemas – T","Ansiedade/Depressão","Isolamento","Queixas Somáticas","Problemas Sociais","Problemas de Pensamento","Problemas de Atenção","Comportamento Agressivo"], normas:{ranges:[{max:59,label:"Normal",cor:"#1e6641"},{max:63,label:"Limítrofe",cor:"#7d6608"},{max:999,label:"Clínico",cor:"#922b21"}]}},
  SNAP4: { nome:"SNAP-IV – Escala de Avaliação de TDAH", area:"TDAH", publico:["infantil","adolescente"], plataforma:"Domínio público / online", online:true, sessoes:0.3, qualitativo:false, descricao:"Rastreio de TDAH por critérios DSM. Versões para pais e professores. Gratuita e amplamente validada.", indices:["Desatenção – Pais (média)","Hiperatividade/Impulsividade – Pais (média)","Desatenção – Professores (média)","Hiperatividade/Impulsividade – Professores (média)"], normas:{ranges:[{max:1.49,label:"Abaixo do Ponto de Corte",cor:"#1e6641"},{max:999,label:"Acima do Ponto de Corte (≥ 1,5)",cor:"#922b21"}]}},
  TDE2: { nome:"TDE-II – Teste de Desempenho Escolar", area:"Aprendizagem", publico:["infantil","adolescente"], plataforma:"Vetor (presencial)", online:false, sessoes:1, qualitativo:false, descricao:"Avalia leitura, escrita e aritmética escolares. Essencial para diagnóstico de dislexia, disgrafia, discalculia.", indices:["Leitura – Escore","Escrita – Escore","Aritmética – Escore","Escore Total TDE-II"], normas:{ranges:[{max:1,label:"Inferior",cor:"#922b21"},{max:2,label:"Abaixo da Média",cor:"#935116"},{max:3,label:"Médio",cor:"#1e6641"},{max:4,label:"Acima da Média",cor:"#1a4f7a"},{max:999,label:"Superior",cor:"#4a235a"}]}},
  CONFIAS: { nome:"CONFIAS – Consciência Fonológica Sequencial", area:"Linguagem / Aprendizagem", publico:["infantil"], plataforma:"Hogrefe (presencial)", online:false, sessoes:1, qualitativo:false, descricao:"Avalia consciência fonológica em nível de sílaba e fonema. Essencial em investigação de dislexia.", indices:["Consciência Silábica – Escore","Consciência Fonêmica – Escore","Escore Total CONFIAS"], normas:{ranges:[{max:24,label:"Inferior",cor:"#922b21"},{max:39,label:"Abaixo",cor:"#935116"},{max:59,label:"Médio",cor:"#1e6641"},{max:74,label:"Acima",cor:"#1a4f7a"},{max:999,label:"Superior",cor:"#4a235a"}]}},
};

function classificar(key, valor) {
  const t = TESTES_DB[key];
  if (!t || t.qualitativo || !t.normas?.ranges) return null;
  const n = parseFloat(valor);
  if (isNaN(n)) return null;
  return t.normas.ranges.find(r => n <= r.max) || t.normas.ranges[t.normas.ranges.length - 1];
}

function calcularIdade(dataNasc) {
  if (!dataNasc) return "";
  const hoje = new Date(), nasc = new Date(dataNasc);
  let a = hoje.getFullYear() - nasc.getFullYear();
  if (hoje.getMonth() < nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) a--;
  return a;
}

function publicoPaciente(dataNasc) {
  const idade = calcularIdade(dataNasc);
  if (idade === "") return ["infantil","adolescente","adulto"];
  if (idade <= 12) return ["infantil"];
  if (idade <= 17) return ["infantil","adolescente"];
  return ["adolescente","adulto"];
}

async function callClaude(messages, system = "") {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages }),
  });
  const d = await r.json();
  return d.content?.map(b => b.text || "").join("\n") || "";
}

// ── Identidade visual: branco, serif, linhas finas, sem versalete ────────────
const F = "'Calibri', 'Segoe UI', sans-serif";

const S = {
  app: { fontFamily: F, background: "#ffffff", minHeight: "100vh", color: "#1a1a1a" },

  // Header limpo — logo + nome à direita como no laudo
  header: {
    borderBottom: "1.5px solid #1a1a1a",
    padding: "20px 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#ffffff",
  },
  headerLogo: { fontSize: 13, color: "#444", letterSpacing: 0.3 },
  headerNome: { textAlign: "right" },
  headerNomeTexto: { fontSize: 14, fontWeight: "bold", color: "#1a1a1a" },
  headerCrp: { fontSize: 12, color: "#555", marginTop: 2 },

  // Nav estilo separador discreto
  nav: { display: "flex", borderBottom: "1px solid #ccc", background: "#fff", overflowX: "auto" },
  navBtn: a => ({
    padding: "12px 24px", border: "none", background: "transparent",
    color: a ? "#1a1a1a" : "#888",
    fontFamily: F, fontSize: 13,
    fontWeight: a ? "bold" : "normal",
    borderBottom: a ? "2px solid #1a1a1a" : "2px solid transparent",
    cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.2,
  }),

  main: { maxWidth: 860, margin: "0 auto", padding: "40px 48px" },

  // Seção com título simples — sem versalete
  secTitle: {
    fontSize: 15, fontWeight: "bold", color: "#1a1a1a",
    marginBottom: 6, paddingBottom: 8,
    borderBottom: "1px solid #d5d5d5",
  },

  // Subsection title (como "Desenvolvimento neuropsicomotor" no laudo)
  subTitle: {
    fontSize: 13, fontWeight: "bold", color: "#1a1a1a",
    marginBottom: 6, marginTop: 16,
    borderBottom: "1px solid #ebebeb", paddingBottom: 4,
  },

  card: {
    background: "#ffffff", marginBottom: 28,
    border: "none", borderTop: "1.5px solid #1a1a1a",
    paddingTop: 20,
  },

  label: { fontSize: 11, color: "#777", marginBottom: 4, display: "block", letterSpacing: 0.3 },

  input: {
    width: "100%", padding: "7px 10px",
    border: "1px solid #ccc", borderRadius: 2,
    fontFamily: F, fontSize: 13, color: "#1a1a1a",
    background: "#fff", boxSizing: "border-box",
  },
  textarea: {
    width: "100%", padding: "8px 10px",
    border: "1px solid #ccc", borderRadius: 2,
    fontFamily: F, fontSize: 13, color: "#1a1a1a",
    background: "#fff", resize: "vertical", boxSizing: "border-box",
  },
  select: {
    width: "100%", padding: "7px 10px",
    border: "1px solid #ccc", borderRadius: 2,
    fontFamily: F, fontSize: 13, color: "#1a1a1a",
    background: "#fff", boxSizing: "border-box",
  },

  // Botão: discreto, borda fina
  btn: {
    padding: "8px 20px", border: "1px solid #1a1a1a", borderRadius: 2,
    background: "#fff", color: "#1a1a1a",
    fontFamily: F, fontSize: 13, cursor: "pointer", letterSpacing: 0.3,
  },
  btnSolid: {
    padding: "8px 20px", border: "1px solid #1a1a1a", borderRadius: 2,
    background: "#1a1a1a", color: "#fff",
    fontFamily: F, fontSize: 13, cursor: "pointer", letterSpacing: 0.3,
  },

  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 },
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 14 },

  // Caixa IA — fundo discretíssimo
  aiBox: {
    background: "#f9f9f7", border: "1px solid #ddd", borderLeft: "3px solid #1a1a1a",
    padding: 16, marginTop: 14, fontSize: 13, lineHeight: 1.85, fontFamily: F,
  },

  // Classificação normativa — badge limpo
  badge: cor => ({
    background: cor + "18", color: cor, border: `1px solid ${cor}55`,
    borderRadius: 2, padding: "2px 9px", fontSize: 11, fontWeight: "bold",
    display: "inline-block", letterSpacing: 0.2,
  }),

  // Chip de tag
  chip: ({ border: "1px solid #ccc", borderRadius: 2, padding: "1px 8px", fontSize: 11, color: "#555", display: "inline-block" }),

  // Sessão no cronograma
  sessRow: { display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid #ebebeb" },
  sessNum: {
    width: 26, height: 26, borderRadius: "50%", border: "1.5px solid #1a1a1a",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: "bold", flexShrink: 0, color: "#1a1a1a",
  },

  // Rodapé de instrumento
  instDesc: { fontSize: 12, color: "#666", fontStyle: "italic", marginBottom: 12, lineHeight: 1.6, fontFamily: F },
  obsLabel: { fontSize: 11, fontWeight: "bold", color: "#1a1a1a", marginBottom: 4, display: "block", fontFamily: F },
};

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [aba, setAba] = useState(0);
  const abas = ["Paciente & Demanda", "Bateria & Sessões", "Resultados", "Laudo Final", "Documentos"];

  // Logo em base64 — MV Maria Vicktória
  const LOGO_URL = "/mnt/user-data/uploads/LOGO_ANTIGA__2_.png";

  const [pac, setPac] = useState({ nome:"", dataNasc:"", sexo:"", escolaridade:"", contatoResp:"" });
  const [dem, setDem] = useState({ pedidoMedico:"", hipoteseMedica:"", queixaPrincipal:"", plano:"INMET", maxSessoes:8 });
  const [anamnese, setAnamnese] = useState("");
  const [anotacoes, setAnotacoes] = useState("");
  const [loadingA, setLoadingA] = useState(false);
  const [sugestao, setSugestao] = useState(null);
  const [loadingS, setLoadingS] = useState(false);
  const [bateria, setBateria] = useState([]);
  const [cronograma, setCronograma] = useState([]);
  const [resultados, setResultados] = useState({});
  const [impressao, setImpressao] = useState("");
  const [laudo, setLaudo] = useState("");
  const [loadingL, setLoadingL] = useState(false);
  const [filtroArea, setFiltroArea] = useState("Todas");

  // Documentos
  const [docAtivo, setDocAtivo] = useState("escola");
  const [docTexto, setDocTexto] = useState({});
  const [loadingDoc, setLoadingDoc] = useState(false);

  const idade = calcularIdade(pac.dataNasc);
  const publico = publicoPaciente(pac.dataNasc);
  const areas = ["Todas", ...new Set(Object.values(TESTES_DB).map(t => t.area))];

  function setR(key, campo, sub, val) {
    setResultados(prev => ({ ...prev, [key]: { ...(prev[key]||{}), [campo]: { ...(prev[key]?.[campo]||{}), [sub]: val } } }));
  }
  function toggleTeste(key) { setBateria(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]); }

  async function gerarAnamnese() {
    setLoadingA(true);
    try {
      const txt = await callClaude([{ role:"user", content:
        `Você é psicóloga clínica experiente em avaliação psicológica. Elabore um roteiro de anamnese clínica detalhado e específico para este caso, organizado por domínios, com perguntas voltadas para o diagnóstico diferencial da hipótese apresentada.

Paciente: ${pac.nome||"não informado"}, ${idade||"?"} anos, ${pac.sexo||"não informado"}, escolaridade: ${pac.escolaridade||"não informada"}
Pedido médico: ${dem.pedidoMedico||"não informado"}
Hipótese médica: ${dem.hipoteseMedica||"não informada"}
Queixa principal: ${dem.queixaPrincipal||"não informada"}

Organize em 7 domínios com 4-5 perguntas cada: 1) Histórico do desenvolvimento neuropsicomotor e linguagem 2) Caracterização da queixa atual (onset, curso, intensidade, prejuízo funcional) 3) Histórico escolar e acadêmico 4) Dinâmica familiar e vínculos 5) Histórico clínico e psiquiátrico (medicações, tratamentos anteriores) 6) Aspectos sociemocionais e funcionamento interpessoal 7) Perguntas específicas para o diagnóstico diferencial da hipótese informada.`
      }], "Responda em português brasileiro. Seja objetiva, clínica e específica para o caso.");
      setAnamnese(txt);
    } catch { setAnamnese("Erro. Verifique sua conexão."); }
    setLoadingA(false);
  }

  async function sugerirBateria() {
    setLoadingS(true);
    try {
      const lista = Object.entries(TESTES_DB).map(([k,v]) =>
        `${k}|${v.nome}|${v.area}|publico:${v.publico.join(",")}|online:${v.online}|plataforma:${v.plataforma}|sessoes:${v.sessoes}|${v.descricao.slice(0,100)}`
      ).join("\n");
      const txt = await callClaude([{ role:"user", content:
        `Você é psicóloga especializada em avaliação. Monte uma bateria estratégica para laudo inquestionável, priorizando instrumentos online e eficientes dado o limite de sessões.

Paciente: ${idade} anos | ${pac.sexo} | Escolaridade: ${pac.escolaridade}
Pedido médico: ${dem.pedidoMedico}
Hipótese: ${dem.hipoteseMedica}
Queixa: ${dem.queixaPrincipal}
Limite: ${dem.maxSessoes} sessões totais (incluindo anamnese e devolutiva)

Instrumentos disponíveis:
${lista}

Responda APENAS com JSON válido (sem markdown):
{"testes":["KEY1","KEY2"],"justificativa":"Explicar a lógica da bateria: por que cada instrumento, como se complementam, quais convergências serão buscadas para o diagnóstico diferencial.","alertas":"Ressalvas clínicas ou metodológicas importantes."}`
      }], "Responda APENAS JSON válido sem markdown.");
      const parsed = JSON.parse(txt.replace(/```json|```/g,"").trim());
      setSugestao(parsed);
      setBateria(parsed.testes.filter(k => TESTES_DB[k]));
    } catch { setSugestao({ testes:[], justificativa:"Erro. Tente novamente.", alertas:"" }); }
    setLoadingS(false);
  }

  function gerarCronograma() {
    const max = parseInt(dem.maxSessoes)||8;
    const sessoes = [{ num:1, tipo:"Anamnese", testes:[], desc:"Entrevista inicial, anamnese completa, rapport e coleta de histórico clínico detalhado" }];
    const pendentes = bateria.filter(k => TESTES_DB[k]);
    let i = 2;
    while (pendentes.length > 0 && i <= max - 1) {
      const grupo = []; let carga = 0;
      while (pendentes.length > 0) {
        const key = pendentes[0]; const c = TESTES_DB[key]?.sessoes||1;
        if (carga + c <= 1.2) { grupo.push(pendentes.shift()); carga += c; } else break;
      }
      if (grupo.length === 0 && pendentes.length > 0) grupo.push(pendentes.shift());
      sessoes.push({ num:i, tipo:"Avaliação", testes:grupo, desc:grupo.map(k => TESTES_DB[k]?.nome||k).join(" + ") });
      i++;
    }
    sessoes.push({ num:sessoes.length+1, tipo:"Devolutiva", testes:[], desc:"Apresentação dos resultados, hipótese diagnóstica, orientações e entrega do laudo." });
    setCronograma(sessoes);
  }

  async function gerarLaudo() {
    setLoadingL(true);
    try {
      let resumo = "";
      bateria.forEach(key => {
        const t = TESTES_DB[key]; if (!t) return;
        resumo += `\n\n== ${t.nome} (${t.area}) ==\n`;
        t.indices.forEach(ind => {
          const r = resultados[key]?.[ind];
          if (r?.valor) { const cls = classificar(key, r.valor); resumo += `  • ${ind}: ${r.valor}${cls ? ` → ${cls.label}` : ""}\n`; }
        });
        const obs = resultados[key]?.["_obs"]?.valor;
        if (obs) resumo += `  [Observação clínica: ${obs}]\n`;
      });
      const txt = await callClaude([{ role:"user", content:
        `Você é psicóloga clínica de alta experiência redigindo um laudo neuropsicológico. Redija uma síntese interpretativa clínica completa, tecnicamente robusta e com análise integrada que torne o laudo inquestionável.

Paciente: ${pac.nome}, ${idade} anos, ${pac.sexo}, escolaridade: ${pac.escolaridade}
Encaminhamento: ${dem.pedidoMedico}
Hipótese médica: ${dem.hipoteseMedica}
Queixa principal: ${dem.queixaPrincipal}
Anotações da anamnese: ${anotacoes||"não registradas"}

Resultados dos instrumentos:${resumo}

Impressão clínica da psicóloga:
${impressao}

Estruture em 6 seções:
1. Apresentação clínica — paciente, contexto do encaminhamento e queixa com linguagem técnica e humanizada.
2. Instrumentos utilizados — lista com justificativa metodológica de cada escolha.
3. Análise integrada por domínio — integre resultados buscando convergências que sustentam hipóteses e divergências que merecem cautela. Cada parágrafo deve amarrar dados de múltiplos instrumentos.
4. Impressão diagnóstica — articule achados com critérios do DSM-5-TR/CID-11. Seja precisa e diferencial.
5. Considerações clínicas — funcionamento global além dos escores, recursos, vulnerabilidades, contexto.
6. Recomendações — específicas e baseadas nos achados, com encaminhamentos pertinentes.

Tom: técnico, clínico, fundamentado. Nunca genérico. O laudo deve ser defensável clinicamente e refletir raciocínio artesanal.`
      }], "Você é psicóloga clínica experiente. Redija em português brasileiro formal. Seja técnica, precisa e cirúrgica. Nunca genérica.");
      setLaudo(txt);
    } catch { setLaudo("Erro. Verifique sua conexão."); }
    setLoadingL(false);
  }

  // ── ABAS ────────────────────────────────────────────────────────────────────
  const Aba0 = () => (
    <div>
      <div style={S.card}>
        <div style={S.secTitle}>Dados do paciente</div>
        <div style={S.row2}>
          <div>
            <label style={S.label}>Nome completo</label>
            <input style={S.input} defaultValue={pac.nome} onBlur={e => setPac(p => ({...p, nome:e.target.value}))} placeholder="Nome do paciente" />
          </div>
          <div>
            <label style={S.label}>Data de nascimento{idade !== "" && <span style={{color:"#1a1a1a",fontWeight:"bold"}}> — {idade} anos</span>}</label>
            <input style={S.input} type="date" defaultValue={pac.dataNasc} onChange={e => setPac(p => ({...p, dataNasc:e.target.value}))} />
          </div>
        </div>
        <div style={S.row3}>
          <div>
            <label style={S.label}>Sexo</label>
            <select style={S.select} value={pac.sexo} onChange={e => setPac(p => ({...p, sexo:e.target.value}))}>
              <option value="">—</option><option>Feminino</option><option>Masculino</option><option>Outro</option>
            </select>
          </div>
          <div>
            <label style={S.label}>Escolaridade</label>
            <select style={S.select} value={pac.escolaridade} onChange={e => setPac(p => ({...p, escolaridade:e.target.value}))}>
              <option value="">—</option>
              <option>Educação Infantil</option><option>Fund. I (1º-5º)</option>
              <option>Fund. II (6º-9º)</option><option>Ensino Médio</option>
              <option>Superior Incompleto</option><option>Superior Completo</option><option>Pós-graduação</option>
            </select>
          </div>
          <div>
            <label style={S.label}>Plano / convênio</label>
            <select style={S.select} value={dem.plano} onChange={e => setDem(d => ({...d, plano:e.target.value}))}>
              <option value="INMET">INMET</option><option value="Particular">Particular</option><option value="Outro">Outro</option>
            </select>
          </div>
        </div>
        <div style={S.row2}>
          <div>
            <label style={S.label}>Máx. sessões pelo plano</label>
            <input style={S.input} type="number" min={3} max={20} defaultValue={dem.maxSessoes} onBlur={e => setDem(d => ({...d, maxSessoes:e.target.value}))} />
          </div>
          <div>
            <label style={S.label}>Contato / responsável</label>
            <input style={S.input} defaultValue={pac.contatoResp} onBlur={e => setPac(p => ({...p, contatoResp:e.target.value}))} placeholder="Nome e telefone" />
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.secTitle}>Demanda e encaminhamento</div>
        <div style={{marginBottom:14}}>
          <label style={S.label}>Pedido médico — transcreva o que está no documento</label>
          <textarea style={{...S.textarea, minHeight:64}} defaultValue={dem.pedidoMedico} onBlur={e => setDem(d => ({...d, pedidoMedico:e.target.value}))} placeholder="Ex: Solicito avaliação neuropsicológica para investigação de TDAH. Paciente apresenta dificuldade de atenção e hiperatividade desde os 6 anos." />
        </div>
        <div style={{marginBottom:14}}>
          <label style={S.label}>Hipótese médica / CID suspeito</label>
          <input style={S.input} defaultValue={dem.hipoteseMedica} onBlur={e => setDem(d => ({...d, hipoteseMedica:e.target.value}))} placeholder="Ex: F90.0 – TDAH, F84.0 – TEA, F32.1 – Depressão moderada" />
        </div>
        <div>
          <label style={S.label}>Queixa principal — fala do paciente ou responsável</label>
          <textarea style={{...S.textarea, minHeight:64}} defaultValue={dem.queixaPrincipal} onBlur={e => setDem(d => ({...d, queixaPrincipal:e.target.value}))} placeholder="O que trazem como queixa com as próprias palavras deles..." />
        </div>
      </div>

      <div style={S.card}>
        <div style={S.secTitle}>Roteiro de anamnese</div>
        <p style={{fontSize:13, color:"#666", marginBottom:14, lineHeight:1.7, fontFamily:F}}>A IA gera perguntas específicas para o diagnóstico diferencial da hipótese informada, organizadas por domínios clínicos.</p>
        <button style={S.btnSolid} onClick={gerarAnamnese} disabled={loadingA}>
          {loadingA ? "Gerando roteiro..." : "Gerar roteiro de anamnese"}
        </button>
        {anamnese && (
          <div style={S.aiBox}>
            <div style={{whiteSpace:"pre-wrap", fontSize:13, lineHeight:1.9, fontFamily:F}}>{anamnese}</div>
          </div>
        )}
        {anamnese && (
          <div style={{marginTop:18}}>
            <div style={S.subTitle}>Anotações da sessão de anamnese</div>
            <textarea style={{...S.textarea, minHeight:110, background:"#fafaf8"}}
              defaultValue={anotacoes} onBlur={e => setAnotacoes(e.target.value)}
              placeholder="Registre os dados relevantes coletados — histórico desenvolvimental, eventos marcantes, observações comportamentais durante a entrevista, contexto familiar..." />
          </div>
        )}
      </div>
    </div>
  );

  const Aba1 = () => {
    const compativeis = Object.entries(TESTES_DB).filter(([_,v]) => v.publico.some(p => publico.includes(p)));
    const filtrados = filtroArea === "Todas" ? compativeis : compativeis.filter(([_,v]) => v.area === filtroArea);
    return (
      <div>
        <div style={S.card}>
          <div style={S.secTitle}>Sugestão inteligente de bateria</div>
          <p style={{fontSize:13, color:"#666", marginBottom:14, lineHeight:1.7, fontFamily:F}}>A IA analisa a hipótese, faixa etária e limite de sessões para montar uma bateria estratégica — priorizando instrumentos online e convergências que tornam o laudo clinicamente inquestionável.</p>
          <button style={S.btnSolid} onClick={sugerirBateria} disabled={loadingS}>
            {loadingS ? "Analisando caso..." : "Sugerir bateria para este caso"}
          </button>
          {sugestao?.justificativa && (
            <div style={S.aiBox}>
              <div style={{fontWeight:"bold", fontSize:13, marginBottom:6, fontFamily:F}}>Lógica da bateria</div>
              <p style={{margin:0, fontSize:13, lineHeight:1.85, fontFamily:F}}>{sugestao.justificativa}</p>
              {sugestao.alertas && (
                <div style={{marginTop:12, paddingTop:10, borderTop:"1px solid #ddd", fontSize:12, color:"#555", fontStyle:"italic", fontFamily:F}}>
                  Ressalvas: {sugestao.alertas}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={S.card}>
          <div style={S.secTitle}>Selecionar instrumentos</div>
          <div style={{display:"flex", gap:6, flexWrap:"wrap", marginBottom:18}}>
            {areas.map(a => (
              <button key={a} onClick={() => setFiltroArea(a)}
                style={{...S.btn, padding:"4px 12px", fontSize:11.5, fontWeight: filtroArea===a ? "bold":"normal", borderColor: filtroArea===a ? "#1a1a1a":"#ccc"}}>
                {a}
              </button>
            ))}
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
            {filtrados.map(([key, t]) => {
              const sug = sugestao?.testes?.includes(key);
              const sel = bateria.includes(key);
              return (
                <div key={key} onClick={() => toggleTeste(key)} style={{
                  padding:"12px 14px", borderRadius:2, cursor:"pointer",
                  border: sel ? "1.5px solid #1a1a1a" : "1px solid #d5d5d5",
                  background: sel ? "#f9f9f7" : "#fff",
                }}>
                  <div style={{display:"flex", justifyContent:"space-between", gap:8}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:"bold", fontSize:12, color:"#1a1a1a", lineHeight:1.3, fontFamily:F}}>{t.nome}</div>
                      <div style={{fontSize:11, color:"#777", marginTop:2, fontFamily:F}}>{t.area} · {t.sessoes===0.3?"~15 min":t.sessoes===0.5?"~30 min":t.sessoes===1?"1 sessão":`${t.sessoes} sessões`}</div>
                      <div style={{fontSize:11, color:"#888", marginTop:3, lineHeight:1.4, fontFamily:F}}>{t.descricao.slice(0,85)}...</div>
                      <div style={{fontSize:10, color:"#aaa", marginTop:2, fontFamily:F}}>{t.plataforma}</div>
                    </div>
                    <div style={{display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end", flexShrink:0}}>
                      {sug && <span style={{fontSize:10, color:"#1e6641", fontWeight:"bold", border:"1px solid #1e664144", borderRadius:2, padding:"1px 7px"}}>✓ sugerido</span>}
                      {t.online && <span style={{fontSize:10, color:"#555", border:"1px solid #ccc", borderRadius:2, padding:"1px 7px"}}>online</span>}
                      {sel && <span style={{fontSize:10, color:"#1a1a1a", fontWeight:"bold"}}>✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={S.card}>
          <div style={S.secTitle}>Cronograma de sessões</div>
          {bateria.length === 0 ? (
            <p style={{fontSize:13, color:"#999", fontFamily:F}}>Selecione os instrumentos acima.</p>
          ) : (
            <>
              <div style={{display:"flex", gap:12, alignItems:"center", marginBottom:16, flexWrap:"wrap"}}>
                <span style={{fontSize:13, color:"#555", fontFamily:F}}>Plano: <strong>{dem.plano}</strong> · Limite: <strong>{dem.maxSessoes}</strong> sessões · Instrumentos: <strong>{bateria.length}</strong></span>
                <button style={S.btn} onClick={gerarCronograma}>Gerar cronograma</button>
              </div>
              {cronograma.length > 0 && (
                <div>
                  {cronograma.map(s => (
                    <div key={s.num} style={S.sessRow}>
                      <div style={S.sessNum}>{s.num}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:"bold", fontSize:13, fontFamily:F, color: s.tipo==="Devolutiva" ? "#1e6641" : "#1a1a1a"}}>{s.tipo}</div>
                        <div style={{fontSize:12.5, color:"#555", marginTop:2, lineHeight:1.6, fontFamily:F}}>{s.desc}</div>
                        {s.testes.length > 0 && (
                          <div style={{marginTop:5, display:"flex", flexWrap:"wrap", gap:4}}>
                            {s.testes.map(k => (
                              <span key={k} style={{border:"1px solid #ccc", borderRadius:2, padding:"1px 7px", fontSize:10.5, color:"#444", fontFamily:F}}>
                                {TESTES_DB[k]?.online ? "⬤ " : "○ "}{k}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:12, padding:"10px 14px", borderLeft:`3px solid ${cronograma.length<=dem.maxSessoes ? "#1e6641":"#922b21"}`, background:"#fafaf8", fontSize:13, fontFamily:F, color: cronograma.length<=dem.maxSessoes ? "#1e6641":"#922b21"}}>
                    {cronograma.length<=dem.maxSessoes ? `${cronograma.length} sessões — dentro do limite do plano.` : `${cronograma.length} sessões — acima do limite de ${dem.maxSessoes}. Revise a bateria.`}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const Aba2 = () => {
    if (bateria.length === 0) return <div style={S.card}><p style={{color:"#999", fontSize:13, fontFamily:F}}>Selecione os instrumentos na aba anterior.</p></div>;
    return (
      <div>
        <div style={{...S.aiBox, marginBottom:24, borderLeft:"3px solid #1a1a1a"}}>
          <p style={{margin:0, fontSize:13, lineHeight:1.8, fontFamily:F}}>
            <strong>Sobre as observações clínicas:</strong> preencha os escores e registre nos campos de observação a <em>qualidade</em> das respostas — comportamento durante a tarefa, estratégias utilizadas, ansiedade visível, esforço, resistência. Esses registros são o que diferencia uma análise clínica artesanal de uma leitura mecânica de escores.
          </p>
        </div>
        {bateria.map(key => {
          const t = TESTES_DB[key]; if (!t) return null;
          return (
            <div key={key} style={S.card}>
              <div style={S.secTitle}>{t.nome}</div>
              <div style={S.instDesc}>{t.descricao} <span style={{color:"#888"}}>— {t.plataforma}{t.online ? " · online" : ""}</span></div>

              {t.qualitativo ? (
                <p style={{fontSize:13, color:"#888", fontStyle:"italic", marginBottom:10, fontFamily:F}}>Instrumento qualitativo — registre sua análise no campo de observação clínica abaixo.</p>
              ) : (
                <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(185px, 1fr))", gap:10, marginBottom:14}}>
                  {t.indices.map(ind => {
                    const val = resultados[key]?.[ind]?.valor || "";
                    const cls = val ? classificar(key, val) : null;
                    return (
                      <div key={ind} style={{padding:"10px 12px", border:"1px solid #e0e0e0", borderRadius:2, background:"#fafaf8"}}>
                        <label style={S.label}>{ind}</label>
                        <input style={{...S.input, marginBottom:5}} type="number" value={val}
                          onChange={e => setR(key, ind, "valor", e.target.value)} placeholder="Escore" />
                        {cls && <div style={S.badge(cls.cor)}>{cls.label}</div>}
                      </div>
                    );
                  })}
                </div>
              )}

              <label style={S.obsLabel}>Observação clínica — {t.nome.split("–")[0].trim()}</label>
              <textarea style={{...S.textarea, minHeight:90, borderLeft:"2px solid #1a1a1a", background:"#fafaf8"}}
                placeholder={t.qualitativo
                  ? "Descreva sua análise qualitativa: elementos significativos, hipóteses projetivas, como se articula com a demanda..."
                  : "Como foi a performance qualitativa? Estratégias utilizadas? Ansiedade visível? Resistência? Algo inesperado que merece destaque clínico?"}
                value={resultados[key]?.["_obs"]?.valor || ""}
                onChange={e => setR(key, "_obs", "valor", e.target.value)}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const Aba3 = () => (
    <div>
      <div style={S.card}>
        <div style={S.secTitle}>Raciocínio clínico integrativo</div>
        <p style={{fontSize:13, color:"#666", marginBottom:14, lineHeight:1.8, fontFamily:F}}>
          Este é o espaço do pensamento artesanal. Escreva o que os dados te dizem — convergências, contradições, nuances que os escores não capturam. A IA vai usar este registro para redigir uma síntese que reflita o seu raciocínio clínico.
        </p>
        <textarea style={{...S.textarea, minHeight:170, borderLeft:"2px solid #1a1a1a", background:"#fafaf8", fontSize:13.5, lineHeight:2}}
          value={impressao} onChange={e => setImpressao(e.target.value)}
          placeholder={"Ex: Os dados convergem para... A performance abaixo do esperado em memória de trabalho, aliada à queixa escolar e ao SNAP-IV acima do ponto de corte, sustenta a hipótese de... Chama atenção que apesar do QI Total na média, o perfil intraindividual mostra dispersão significativa entre... Como diagnóstico diferencial é necessário considerar..."}
        />
      </div>

      <div style={S.card}>
        <div style={S.secTitle}>Síntese interpretativa clínica</div>
        <p style={{fontSize:13, color:"#666", marginBottom:14, lineHeight:1.8, fontFamily:F}}>A IA integra todos os resultados, as observações clínicas e o seu raciocínio para redigir uma síntese estruturada, amarrada à hipótese diagnóstica. O texto é editável.</p>
        <button style={S.btnSolid} onClick={gerarLaudo} disabled={loadingL}>
          {loadingL ? "Redigindo síntese..." : "Gerar síntese interpretativa"}
        </button>

        {laudo && (
          <div style={{marginTop:20}}>
            <textarea style={{...S.textarea, minHeight:500, fontSize:13.5, lineHeight:2, background:"#fafaf8"}}
              value={laudo} onChange={e => setLaudo(e.target.value)} />
            <div style={{marginTop:12, display:"flex", gap:10, flexWrap:"wrap"}}>
              <button style={S.btnSolid} onClick={() => { navigator.clipboard.writeText(laudo); alert("Copiado. Cole no seu template Word e revise."); }}>
                Copiar para Word
              </button>
              <button style={S.btn} onClick={() => setLaudo("")}>Regerar</button>
            </div>
            <div style={{marginTop:14, ...S.aiBox, borderLeft:"3px solid #1a1a1a"}}>
              <p style={{margin:0, fontSize:12, color:"#666", lineHeight:1.8, fontFamily:F}}>
                <strong>Para um laudo inquestionável:</strong> verifique se a impressão diagnóstica articula os achados com os critérios do DSM-5-TR/CID-11, se as convergências entre instrumentos estão explícitas no texto, e se as ressalvas metodológicas estão registradas. Sua assinatura é o que valida tudo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  async function gerarDoc(tipo) {
    setLoadingDoc(true);
    const prompts = {
      escola: `Você é psicóloga neuropsicóloga. Redija um documento formal de recomendações para a escola com base nos dados abaixo. O documento deve ser profissional, empático com a escola e orientador — não punitivo. Inclua: introdução identificando o paciente e o objetivo, recomendações pedagógicas específicas baseadas nos achados, sugestões de adaptações de avaliação e ambiente, e encerramento solicitando colaboração. Tom: técnico mas acessível para educadores.

Paciente: ${pac.nome}, ${idade} anos, ${pac.sexo}, escolaridade: ${pac.escolaridade}
Hipótese: ${dem.hipoteseMedica}
Queixa: ${dem.queixaPrincipal}
Síntese do laudo: ${laudo.slice(0,600)}`,

      wpp_documentos: `Você é psicóloga neuropsicóloga. Redija uma mensagem de WhatsApp profissional, calorosa e clara para a família do paciente solicitando documentos necessários para a avaliação. A mensagem deve: ser acolhedora e explicar brevemente o motivo de cada documento, listar os documentos necessários de forma clara, indicar prazo sugerido e disponibilidade para dúvidas. Tom: próximo, cuidadoso, profissional — sem ser fria nem informal demais.

Paciente: ${pac.nome}, ${idade} anos
Responsável: ${pac.contatoResp||"responsável"}
Hipótese: ${dem.hipoteseMedica}

Documentos geralmente necessários: relatório escolar, relatório médico/psiquiátrico se houver, exames anteriores, histórico de tratamentos.`,

      wpp_relatorio_prof: `Você é psicóloga neuropsicóloga. Redija uma mensagem de WhatsApp para a família solicitando que entrem em contato com o profissional de saúde que acompanha o paciente (médico, fonoaudiólogo, terapeuta etc.) para pedir um breve relato clínico das observações dele sobre o paciente. A mensagem deve: ser acolhedora, explicar que isso vai enriquecer o laudo e beneficiar o paciente, ser direta sobre o que pedir ao profissional, e passar segurança e organização. Tom: próximo, cuidadoso e profissional.

Paciente: ${pac.nome}, ${idade} anos
Responsável: ${pac.contatoResp||"responsável"}
Profissional a ser contatado: médico / especialista que acompanha`,

      declaracao: `Você é psicóloga neuropsicóloga. Redija uma declaração de comparecimento formal e elegante atestando que o paciente esteve presente em sessão de avaliação psicológica. Inclua: identificação do paciente, data e horário (deixar em branco para preencher), finalidade (avaliação neuropsicológica), dados da psicóloga. Tom: formal, objetivo, uma página.

Paciente: ${pac.nome}, ${idade} anos
Responsável: ${pac.contatoResp||""}
Psicóloga: Maria Vicktória de Souza — CRP 02/28.384
Local: Avenida Souza Filho, 911 · Centro · Petrolina – PE`,

      devolutiva: `Você é psicóloga neuropsicóloga. Elabore um roteiro estruturado para a sessão de devolutiva com a família do paciente. Inclua: como abrir a sessão acolhendo a família, como apresentar os resultados de forma acessível (sem jargão), como apresentar a hipótese diagnóstica com sensibilidade, como apresentar as recomendações, como responder perguntas difíceis, e como encerrar a sessão fortalecendo o vínculo. Tom: clínico e humano.

Paciente: ${pac.nome}, ${idade} anos
Hipótese: ${dem.hipoteseMedica}
Pontos principais do laudo: ${laudo.slice(0,400)}`,
    };

    try {
      const txt = await callClaude([{ role:"user", content: prompts[tipo] }],
        "Você é psicóloga clínica neuropsicóloga experiente. Responda em português brasileiro. Seja profissional, calorosa e precisa.");
      setDocTexto(prev => ({...prev, [tipo]: txt}));
    } catch { setDocTexto(prev => ({...prev, [tipo]: "Erro. Verifique sua conexão."})); }
    setLoadingDoc(false);
  }

  const DOCS = [
    { key:"escola", label:"Recomendações para a escola", icon:"🏫", desc:"Documento formal com adaptações pedagógicas baseadas nos achados da avaliação." },
    { key:"wpp_documentos", label:"WhatsApp — Solicitar documentos", icon:"📋", desc:"Mensagem profissional e acolhedora solicitando documentos necessários à família." },
    { key:"wpp_relatorio_prof", label:"WhatsApp — Solicitar relatório do profissional", icon:"👨‍⚕️", desc:"Mensagem para a família pedir relato clínico ao médico ou terapeuta que acompanha." },
    { key:"declaracao", label:"Declaração de comparecimento", icon:"📄", desc:"Declaração formal para o paciente apresentar no trabalho ou escola." },
    { key:"devolutiva", label:"Roteiro de devolutiva", icon:"🗣", desc:"Guia estruturado para conduzir a sessão de devolutiva com a família." },
  ];

  const cabecalhoDoc = (titulo) => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARIA VICKTÓRIA DE SOUZA
Psicóloga · Especialista em Neuropsicologia · CRP 02/28.384
Avenida Souza Filho, 911 · Centro · Petrolina – PE · 56.302-370
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${titulo}
Petrolina – PE, ${new Date().toLocaleDateString("pt-BR", {day:"numeric",month:"long",year:"numeric"})}

`;

  const Aba4 = () => (
    <div>
      <div style={S.card}>
        <div style={S.secTitle}>Documentos e comunicações</div>
        <p style={{fontSize:13, color:"#666", marginBottom:18, lineHeight:1.8, fontFamily:F}}>
          Gere documentos profissionais com a sua identidade visual e mensagens prontas para WhatsApp — tudo baseado nos dados do paciente já preenchidos.
        </p>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24}}>
          {DOCS.map(d => (
            <div key={d.key} onClick={() => setDocAtivo(d.key)} style={{
              padding:"12px 14px", border: docAtivo===d.key ? "1.5px solid #1a1a1a" : "1px solid #d5d5d5",
              borderRadius:2, cursor:"pointer", background: docAtivo===d.key ? "#f9f9f7" : "#fff",
            }}>
              <div style={{fontSize:13, fontWeight:"bold", fontFamily:F, marginBottom:4}}>{d.icon} {d.label}</div>
              <div style={{fontSize:11.5, color:"#777", fontFamily:F, lineHeight:1.5}}>{d.desc}</div>
            </div>
          ))}
        </div>

        {DOCS.filter(d => d.key === docAtivo).map(d => (
          <div key={d.key}>
            <div style={S.subTitle}>{d.icon} {d.label}</div>
            <button style={S.btnSolid} onClick={() => gerarDoc(d.key)} disabled={loadingDoc}>
              {loadingDoc ? "Gerando..." : `Gerar ${d.label.toLowerCase()}`}
            </button>

            {docTexto[d.key] && (
              <div style={{marginTop:16}}>
                {(d.key === "escola" || d.key === "declaracao") && (
                  <div style={{...S.aiBox, borderLeft:"3px solid #1a1a1a", marginBottom:12, fontSize:12, color:"#555", fontFamily:F}}>
                    <strong>Cabeçalho que será incluído no documento impresso:</strong>
                    <pre style={{margin:"8px 0 0", fontFamily:F, fontSize:11, color:"#777", whiteSpace:"pre-wrap"}}>{cabecalhoDoc(d.label)}</pre>
                  </div>
                )}
                <textarea style={{...S.textarea, minHeight:300, fontSize:13, lineHeight:1.9, background:"#fafaf8"}}
                  value={docTexto[d.key]} onChange={e => setDocTexto(prev => ({...prev, [d.key]: e.target.value}))} />
                <div style={{marginTop:10, display:"flex", gap:10, flexWrap:"wrap"}}>
                  <button style={S.btnSolid} onClick={() => {
                    const texto = d.key === "escola" || d.key === "declaracao"
                      ? cabecalhoDoc(d.label) + docTexto[d.key]
                      : docTexto[d.key];
                    navigator.clipboard.writeText(texto);
                    alert(d.key.startsWith("wpp") ? "Copiado! Cole direto no WhatsApp." : "Copiado! Cole no Word para imprimir.");
                  }}>
                    {d.key.startsWith("wpp") ? "Copiar para WhatsApp" : "Copiar para imprimir"}
                  </button>
                  <button style={S.btn} onClick={() => setDocTexto(prev => ({...prev, [d.key]: ""}))}>Regerar</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={S.headerLogo}>
          Sistema de Avaliação Psicológica
        </div>
        <div style={S.headerNome}>
          <div style={S.headerNomeTexto}>Maria Vicktória de Souza</div>
          <div style={S.headerCrp}>Psicóloga · Especialista em Neuropsicologia · CRP 02/28.384</div>
        </div>
      </div>

      <nav style={S.nav}>
        {abas.map((a, i) => (
          <button key={i} style={S.navBtn(aba === i)} onClick={() => setAba(i)}>{a}</button>
        ))}
      </nav>

      <main style={S.main}>
        {aba === 0 && <Aba0 />}
        {aba === 1 && <Aba1 />}
        {aba === 2 && <Aba2 />}
        {aba === 3 && <Aba3 />}
        {aba === 4 && <Aba4 />}
      </main>

      <div style={{ borderTop:"1px solid #ddd", padding:"16px 48px", display:"flex", justifyContent:"space-between", background:"#fff" }}>
        <span style={{fontSize:11, color:"#aaa", fontFamily:F}}>Sistema de Laudos Psicológicos · Vetor VOL · Hogrefe · SATEPSI/CFP</span>
        <span style={{fontSize:11, color:"#aaa", fontFamily:F}}>Petrolina – PE</span>
      </div>
    </div>
  );
}

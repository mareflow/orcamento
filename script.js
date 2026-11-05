/**
 * MARÉ FLOW — INTERACTION & SIMULATOR SCRIPT (ORÇAMENTOS)
 * Conversão, Simulador Interativo com Seleção de Veículos e Calculadora ROI
 * Referência visual oficial: https://www.mareflow.com.br/
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const menuBtn = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav-links-wrap');
  const hero = document.querySelector('.hero');

  // 1. Mobile Menu Toggle
  function closeMenu() {
    if (!menuBtn || !navigation) return;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menu');
    navigation.classList.remove('open');
  }

  if (menuBtn && navigation) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isExpanded));
      menuBtn.setAttribute('aria-label', isExpanded ? 'Abrir menu' : 'Fechar menu');
      navigation.classList.toggle('open', !isExpanded);
    });

    navigation.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navigation.classList.contains('open')) {
        closeMenu();
        menuBtn.focus();
      }
    });

    document.addEventListener('click', e => {
      if (
        navigation.classList.contains('open') &&
        !navigation.contains(e.target) &&
        !menuBtn.contains(e.target)
      ) {
        closeMenu();
      }
    });

    window.matchMedia('(min-width: 881px)').addEventListener('change', closeMenu);
  }

  // 2. Dynamic Year & Local File Fallback for Login
  const yearEl = document.querySelector('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href="crm.html"]').forEach(link => {
      link.href = 'https://orcamento.mareflow.com.br/crm.html';
    });
  }

  // 3. Ambient Glow tracking in Hero
  if (hero && finePointer.matches) {
    hero.addEventListener('pointermove', e => {
      if (reducedMotion.matches) return;
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hero.style.setProperty('--mx', `${x}px`);
      hero.style.setProperty('--my', `${y}px`);
    });
  }

  // ==========================================================================
  // 4. MOCKUP ILUSTRATIVO DO HERO (DIRECIONAMENTO PARA DEMONSTRAÇÃO REAL)
  // Ao clicar em qualquer ponto do card de exemplo, rola suavemente para o
  // simulador interativo oficial na seção #demonstracao
  // ==========================================================================
  const heroShowcaseCard = document.querySelector('#hero-showcase-card');
  if (heroShowcaseCard) {
    heroShowcaseCard.addEventListener('click', (e) => {
      // Se o clique já foi em um link ou botão, o navegador ou o href já lida;
      // Caso contrário, rola suavemente até a seção de demonstração
      const demoSec = document.querySelector('#demonstracao');
      if (demoSec) {
        demoSec.scrollIntoView({ behavior: 'smooth' });
      }
    });

    heroShowcaseCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const demoSec = document.querySelector('#demonstracao');
        if (demoSec) {
          demoSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // ==========================================================================
  // 4.5. PROVA SOCIAL — MARQUEE INFINITO COM ARRASTO & PAUSA INTERATIVA
  // "fica correndo pra esquerda sem parar... quando você põe o mouse ou clica,
  // ele para, mexe e interage com o movimento"
  // ==========================================================================
  const marqueeWrapper = document.querySelector('#partners-marquee');
  const marqueeTrack = document.querySelector('.partners-marquee-track');

  if (marqueeWrapper && marqueeTrack) {
    let currentX = 0;
    let isHovered = false;
    let isPointerDown = false;
    let startPointerX = 0;
    let startTrackX = 0;
    let lastTime = performance.now();
    const baseSpeed = 36; // 36px/s: velocidade lenta, suave e contínua

    function getHalfWidth() {
      return marqueeTrack.scrollWidth / 2;
    }

    let halfWidth = getHalfWidth();
    window.addEventListener('resize', () => {
      halfWidth = getHalfWidth();
    });
    window.addEventListener('load', () => {
      halfWidth = getHalfWidth();
    });

    // Desativa animação CSS pura para assumir o controle suave e interativo via RAF
    marqueeTrack.style.animation = 'none';

    function marqueeLoop(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isHovered && !isPointerDown && !reducedMotion.matches) {
        currentX -= baseSpeed * dt;
        if (halfWidth > 0 && Math.abs(currentX) >= halfWidth) {
          currentX += halfWidth;
        }
        marqueeTrack.style.transform = `translate3d(${currentX}px, 0, 0)`;
      }

      requestAnimationFrame(marqueeLoop);
    }
    requestAnimationFrame(marqueeLoop);

    // Pausa ao passar o mouse
    marqueeWrapper.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    marqueeWrapper.addEventListener('mouseleave', () => {
      isHovered = false;
      if (isPointerDown) {
        isPointerDown = false;
        marqueeWrapper.classList.remove('is-dragging');
      }
    });

    // Interação de arrasto com mouse ou toque
    marqueeWrapper.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      isPointerDown = true;
      startPointerX = e.clientX;
      startTrackX = currentX;
      marqueeWrapper.classList.add('is-dragging');
      try {
        marqueeWrapper.setPointerCapture(e.pointerId);
      } catch (err) {}
    });

    marqueeWrapper.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;
      const deltaX = e.clientX - startPointerX;
      currentX = startTrackX + deltaX;

      if (halfWidth > 0) {
        while (currentX > 0) {
          currentX -= halfWidth;
        }
        while (currentX < -halfWidth) {
          currentX += halfWidth;
        }
      }
      marqueeTrack.style.transform = `translate3d(${currentX}px, 0, 0)`;
    });

    function endMarqueeDrag(e) {
      if (!isPointerDown) return;
      isPointerDown = false;
      marqueeWrapper.classList.remove('is-dragging');
      try {
        if (marqueeWrapper.hasPointerCapture(e.pointerId)) {
          marqueeWrapper.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}
    }

    marqueeWrapper.addEventListener('pointerup', endMarqueeDrag);
    marqueeWrapper.addEventListener('pointercancel', endMarqueeDrag);

    // Evita arrastar a imagem nativamente
    marqueeWrapper.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', e => e.preventDefault());
    });
  }

  // ==========================================================================
  // 5. JORNADA INTERATIVA EM 3 ETAPAS (COCKPITS AO VIVO DO APP ORÇAMENTOS)
  // "conseguia interagir dentro da imagem... colocar a opção de qual a marca
  // do veículo, mexer ali para mostrar a próxima etapa... todos no mesmo tamanho"
  // ==========================================================================
  const wfCards = document.querySelectorAll('.wf-step-card');
  const wfStepperSteps = document.querySelectorAll('.wf-stepper-step');
  const wfFill1 = document.querySelector('#wf-stepper-fill-1');
  const wfFill2 = document.querySelector('#wf-stepper-fill-2');

  const VEHICLE_DATA = {
    Fiat: {
      brand: 'Fiat',
      model: 'Cronos',
      spec: '1.3 Firefly Flex (Câmbio CVT) • 2022 a 2026',
      service: 'Troca de Óleo de Câmbio',
      oldPrice: 'R$ 1.490,00',
      newPrice: 'R$ 1.290,00',
      discount: 'ECONOMIZE R$ 200,00 PAGANDO À VISTA',
      tag: 'à vista',
      inclusions: [
        'Fluido 100% Sintético homologado para transmissão CVT',
        'Mão de Obra com Diálise Computadorizada 100%',
        'Scanner Diagnóstico Eletrônico Cortesia',
        'Garantia Total de Serviço por Escrito'
      ]
    },
    Hyundai: {
      brand: 'Hyundai',
      model: 'Creta',
      spec: '1.6 / 2.0 16V Flex (Câmbio AT6) • 2017 a 2021',
      service: 'Troca de Óleo de Câmbio',
      oldPrice: 'R$ 1.550,00',
      newPrice: 'R$ 1.350,00',
      discount: 'ECONOMIZE R$ 200,00 PAGANDO À VISTA',
      tag: 'à vista',
      inclusions: [
        'Fluido 100% Sintético selecionado para a transmissão',
        'Mão de Obra com Diálise Computadorizada 100%',
        'Scanner Diagnóstico Eletrônico Cortesia',
        'Garantia Total de Serviço por Escrito'
      ]
    },
    Chevrolet: {
      brand: 'Chevrolet',
      model: 'Onix',
      spec: '1.0 Turbo Flex (Câmbio AT6) • 2020 a 2026',
      service: 'Troca de Óleo de Câmbio',
      oldPrice: 'R$ 1.450,00',
      newPrice: 'R$ 1.250,00',
      discount: 'ECONOMIZE R$ 200,00 PAGANDO À VISTA',
      tag: 'à vista',
      inclusions: [
        'Fluido Dexron VI 100% Sintético de alta performance',
        'Mão de Obra com Diálise Computadorizada 100%',
        'Scanner Diagnóstico Eletrônico Cortesia',
        'Garantia Total de Serviço por Escrito'
      ]
    },
    Honda: {
      brand: 'Honda',
      model: 'Civic',
      spec: '2.0 16V i-VTEC (Câmbio CVT) • 2017 a 2021',
      service: 'Troca de Óleo de Câmbio',
      oldPrice: 'R$ 1.590,00',
      newPrice: 'R$ 1.390,00',
      discount: 'ECONOMIZE R$ 200,00 PAGANDO À VISTA',
      tag: 'à vista',
      inclusions: [
        'Fluido HCF-2 original 100% Sintético para CVT',
        'Mão de Obra com Diálise Computadorizada 100%',
        'Scanner Diagnóstico Eletrônico Cortesia',
        'Garantia Total de Serviço por Escrito'
      ]
    },
    Jeep: {
      brand: 'Jeep',
      model: 'Renegade',
      spec: '1.8 16V Flex (Câmbio AT6) • 2016 a 2021',
      service: 'Troca de Óleo de Câmbio',
      oldPrice: 'R$ 1.580,00',
      newPrice: 'R$ 1.380,00',
      discount: 'ECONOMIZE R$ 200,00 PAGANDO À VISTA',
      tag: 'à vista',
      inclusions: [
        'Fluido Mopar / Aisin 100% Sintético para transmissão AT6',
        'Mão de Obra com Diálise Computadorizada 100%',
        'Scanner Diagnóstico Eletrônico Cortesia',
        'Garantia Total de Serviço por Escrito'
      ]
    },
    Toyota: {
      brand: 'Toyota',
      model: 'Corolla',
      spec: '2.0 Dynamic Force (Câmbio CVT Direct Shift) • 2020 a 2025',
      service: 'Troca de Óleo de Câmbio',
      oldPrice: 'R$ 1.620,00',
      newPrice: 'R$ 1.420,00',
      discount: 'ECONOMIZE R$ 200,00 PAGANDO À VISTA',
      tag: 'à vista',
      inclusions: [
        'Fluido Toyota CVT FE 100% Sintético genuíno',
        'Mão de Obra com Diálise Computadorizada 100%',
        'Scanner Diagnóstico Eletrônico Cortesia',
        'Garantia Total de Serviço por Escrito'
      ]
    },
    Volkswagen: {
      brand: 'Volkswagen',
      model: 'T-Cross',
      spec: '1.0 200 TSI Flex (Câmbio AT6 Tiptronic) • 2019 a 2025',
      service: 'Troca de Óleo de Câmbio',
      oldPrice: 'R$ 1.690,00',
      newPrice: 'R$ 1.450,00',
      discount: 'ECONOMIZE R$ 240,00 PAGANDO À VISTA',
      tag: 'à vista',
      inclusions: [
        'Fluido G 055 540 A2 100% Sintético para transmissão AT6',
        'Mão de Obra com Diálise Computadorizada 100%',
        'Scanner Diagnóstico Eletrônico Cortesia',
        'Garantia Total de Serviço por Escrito'
      ]
    }
  };

  let activeBrandKey = 'Fiat';

  function setActiveStep(index) {
    const idx = parseInt(index, 10);
    if (isNaN(idx)) return;

    wfCards.forEach((c, i) => {
      c.classList.toggle('active', i === idx);
    });

    wfStepperSteps.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
    });

    if (wfFill1) {
      wfFill1.style.width = idx >= 1 ? '100%' : '50%';
    }
    if (wfFill2) {
      wfFill2.style.width = idx >= 2 ? '100%' : '0%';
    }
  }

  function updateVehicleWorkflow(brandKey, autoAdvance = true) {
    const car = VEHICLE_DATA[brandKey];
    if (!car) return;
    activeBrandKey = brandKey;

    // Atualiza Card 1
    const triggerLabel = document.querySelector('#wf-live-selected-brand');
    if (triggerLabel) triggerLabel.textContent = car.brand;

    const brandOptions = document.querySelectorAll('.wf-app-options-dropdown .wf-app-opt[data-brand]');
    brandOptions.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-brand') === brandKey);
    });

    const nextTopBtn = document.querySelector('#wf-live-btn-next-s1');
    if (nextTopBtn) {
      nextTopBtn.classList.remove('disabled');
      nextTopBtn.classList.add('active-ready');
    }

    // Atualiza Card 2
    const s2CarName = document.querySelector('#wf-s2-car-name');
    const s2CarSpec = document.querySelector('#wf-s2-car-spec');
    const s2CarService = document.querySelector('#wf-s2-car-service');
    if (s2CarName) s2CarName.textContent = `${car.brand} ${car.model}`;
    if (s2CarSpec) s2CarSpec.textContent = car.spec;
    if (s2CarService) s2CarService.textContent = car.service;

    // Atualiza Card 3
    const s3MakeName = document.querySelector('#wf-s3-make-name');
    const s3ModelName = document.querySelector('#wf-s3-model-name');
    const s3SpecText = document.querySelector('#wf-s3-spec-text');
    const s3Discount = document.querySelector('#wf-s3-discount-badge');
    const s3OldVal = document.querySelector('#wf-s3-old-val');
    const s3NewVal = document.querySelector('#wf-s3-new-val');
    const s3PriceTag = document.querySelector('#wf-s3-price-tag');
    const s3IncludedList = document.querySelector('#wf-s3-included-list');
    const s3WhatsappBtn = document.querySelector('#wf-btn-whatsapp-quote');

    if (s3MakeName) s3MakeName.textContent = car.brand.toUpperCase();
    if (s3ModelName) s3ModelName.textContent = car.model;
    if (s3SpecText) s3SpecText.textContent = car.spec;
    if (s3Discount) s3Discount.textContent = car.discount;
    if (s3OldVal) s3OldVal.textContent = car.oldPrice;
    if (s3NewVal) s3NewVal.textContent = car.newPrice;
    if (s3PriceTag) s3PriceTag.textContent = car.tag;

    if (s3IncludedList && car.inclusions) {
      s3IncludedList.innerHTML = car.inclusions.map(inc => `
        <li>
          <svg class="svg-icon svg-icon-xs" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          ${inc}
        </li>
      `).join('');
    }

    if (s3WhatsappBtn) {
      const msg = encodeURIComponent(`Olá, vi a cotação no app do ${car.brand} ${car.model} por ${car.newPrice} à vista e gostaria de agendar.`);
      s3WhatsappBtn.href = `https://wa.me/5548999997766?text=${msg}`;
    }

    // Avanço visual automático para Etapa 2 ao selecionar a marca
    if (autoAdvance) {
      setTimeout(() => {
        setActiveStep(1);
        if (window.innerWidth < 992) {
          const card2 = document.querySelector('.wf-step-card[data-step-index="1"]');
          if (card2) card2.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 450);
    }
  }

  // Interatividade Card 1 — Seleção da Marca
  const brandOptions = document.querySelectorAll('.wf-app-options-dropdown .wf-app-opt[data-brand]');
  brandOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const brand = opt.getAttribute('data-brand');
      if (brand) {
        updateVehicleWorkflow(brand, true);
      }
    });
  });

  const nextTopBtn = document.querySelector('#wf-live-btn-next-s1');
  if (nextTopBtn) {
    nextTopBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setActiveStep(1);
    });
  }

  // Interatividade Card 2 — Voltar e Liberar Orçamento com IA
  const s2BackBtn = document.querySelector('#wf-s2-btn-back');
  if (s2BackBtn) {
    s2BackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setActiveStep(0);
    });
  }

  const revealBtn = document.querySelector('#wf-btn-reveal-price');
  if (revealBtn) {
    revealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const txtEl = revealBtn.querySelector('.wf-app-reveal-txt');
      const subEl = revealBtn.querySelector('.wf-app-reveal-sub');
      const originalTxt = txtEl ? txtEl.textContent : '';
      const originalSub = subEl ? subEl.textContent : '';

      if (txtEl) txtEl.textContent = 'CALCULANDO COM IA...';
      if (subEl) subEl.textContent = 'Aplicando desconto oficial travado';

      setTimeout(() => {
        if (txtEl) txtEl.textContent = originalTxt;
        if (subEl) subEl.textContent = originalSub;

        setActiveStep(2);

        const priceCard = document.querySelector('#wf-s3-price-card');
        if (priceCard) {
          priceCard.classList.remove('wf-price-pulse');
          void priceCard.offsetWidth; // Force reflow
          priceCard.classList.add('wf-price-pulse');
        }

        if (window.innerWidth < 992) {
          const card3 = document.querySelector('.wf-step-card[data-step-index="2"]');
          if (card3) card3.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 350);
    });
  }

  // Clique nos cards em área neutra (evita interferir nos cliques internos do app cockpit)
  wfCards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.wf-card-nav-action') || e.target.closest('.wf-live-app-frame')) return;
      setActiveStep(idx);
    });
  });

  // Clique no stepper superior
  wfStepperSteps.forEach((step) => {
    step.addEventListener('click', () => {
      const idx = step.getAttribute('data-step-index');
      setActiveStep(idx);
    });
  });

  // Botões de navegação no rodapé de cada card
  const wfNavButtons = document.querySelectorAll('.wf-card-nav-action[data-goto]');
  wfNavButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = btn.getAttribute('data-goto');
      setActiveStep(target);

      if (window.innerWidth < 992) {
        const targetCard = document.querySelector(`.wf-step-card[data-step-index="${target}"]`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });

  // Inicializa com Fiat e Passo 1 ativo caso os cards antigos existam
  if (wfCards.length > 0) {
    updateVehicleWorkflow('Fiat', false);
    setActiveStep(0);
  }


  // ==========================================================================
  // 6. MINI QUESTIONÁRIO INTERATIVO & DIAGNÓSTICO (WHATSAPP & ORÇAMENTOS)
  // ==========================================================================
  // Recarregar simulador dentro do smartphone interativo
  const phoneReloadBtn = document.querySelector('#phone-iframe-reload');
  const appLiveIframe = document.querySelector('#app-live-iframe');
  if (phoneReloadBtn && appLiveIframe) {
    phoneReloadBtn.addEventListener('click', () => {
      appLiveIframe.src = 'https://orcamento.mareflow.com.br/simulador.html';
    });
  }

  // Alternar visualização de exemplos sob demanda no mobile (evita página longa)
  const mobileToggleBtns = document.querySelectorAll('.mobile-toggle-btn');
  const mobileCloseBtns = document.querySelectorAll('.mobile-close-example-btn');

  mobileToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetClass = btn.dataset.target;
      const targetEl = document.querySelector(`.${targetClass}`);
      if (!targetEl) return;

      const isExpanded = btn.classList.contains('active');

      if (isExpanded) {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        targetEl.classList.remove('mobile-expanded');
      } else {
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        targetEl.classList.add('mobile-expanded');
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 120);
      }
    });
  });

  mobileCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetClass = btn.dataset.target;
      const targetEl = document.querySelector(`.${targetClass}`);
      const toggleBtn = document.querySelector(`.mobile-toggle-btn[data-target="${targetClass}"]`);

      if (targetEl) targetEl.classList.remove('mobile-expanded');
      if (toggleBtn) {
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }

      const togglesContainer = document.querySelector('.mobile-demo-toggles');
      if (togglesContainer) {
        togglesContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  const diagSteps = document.querySelectorAll('.diag-step');
  const diagPills = document.querySelectorAll('.diag-step-pill');
  const diagProgressBar = document.querySelector('#diag-progress-bar');
  const diagStepTag = document.querySelector('#diag-step-tag');
  const diagBtnPrev = document.querySelector('#diag-btn-prev');
  const diagBtnNext = document.querySelector('#diag-btn-next');
  const diagHint = document.querySelector('#diag-selection-hint');
  const diagQuizBody = document.querySelector('#diag-quiz-body');
  const diagLoadingScreen = document.querySelector('#diag-loading-screen');
  const diagResultScreen = document.querySelector('#diag-result-screen');
  const diagBtnRestart = document.querySelector('#diag-btn-restart');
  const diagOptionCards = document.querySelectorAll('.diag-option-card');

  // Elementos do resultado dinâmico
  const diagResultTitle = document.querySelector('#diag-result-title');
  const diagResultSummary = document.querySelector('#diag-result-summary');
  const diagCtaWa = document.querySelector('#diag-cta-wa');
  const diagScoreValue = document.querySelector('#diag-score-value');
  const diagScoreStatus = document.querySelector('#diag-score-status');

  let currentDiagStep = 1;
  const userAnswers = {
    1: null,
    2: null,
    3: null
  };

  const stepLabels = {
    1: 'Etapa 1 de 3: Atendimento no WhatsApp',
    2: 'Etapa 2 de 3: Elaboração do Orçamento',
    3: 'Etapa 3 de 3: Fechamento & Conversão'
  };

  function updateDiagStepView(step) {
    currentDiagStep = step;

    // Atualizar visibilidade dos steps
    diagSteps.forEach(el => {
      const s = parseInt(el.dataset.step, 10);
      el.classList.toggle('active', s === step);
    });

    // Atualizar pills superiores
    diagPills.forEach(pill => {
      const s = parseInt(pill.dataset.step, 10);
      pill.classList.toggle('active', s === step);
      pill.classList.toggle('completed', s < step);
    });

    // Atualizar barra de progresso
    if (diagProgressBar) {
      const pct = (step / 3) * 100;
      diagProgressBar.style.width = `${pct}%`;
    }

    // Atualizar rótulo de texto
    if (diagStepTag && stepLabels[step]) {
      diagStepTag.textContent = stepLabels[step];
    }

    // Botão Voltar
    if (diagBtnPrev) {
      diagBtnPrev.style.display = step > 1 ? 'inline-flex' : 'none';
    }

    // Botão Avançar / Concluir
    if (diagBtnNext) {
      const isAnswered = !!userAnswers[step];
      diagBtnNext.disabled = !isAnswered;

      const nextSpan = diagBtnNext.querySelector('span');
      if (nextSpan) {
        nextSpan.textContent = step === 3 ? 'Ver Diagnóstico da Oficina' : 'Avançar';
      }
    }

    // Dica de navegação
    if (diagHint) {
      if (userAnswers[step]) {
        diagHint.textContent = 'Opção selecionada. Clique em avançar para continuar.';
      } else {
        diagHint.textContent = 'Selecione uma opção acima para avançar';
      }
    }

    // No mobile, reposicionar suavemente no topo do cockpit ao trocar de etapa
    if (window.innerWidth <= 880 && step > 1) {
      const cockpit = document.querySelector('.diag-cockpit');
      if (cockpit) {
        cockpit.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function handleOptionSelect(card) {
    const step = parseInt(card.dataset.step, 10);
    const value = card.dataset.value;

    // Desmarcar irmãos do mesmo step
    const stepCards = document.querySelectorAll(`.diag-option-card[data-step="${step}"]`);
    stepCards.forEach(c => {
      c.classList.remove('selected');
      c.setAttribute('aria-checked', 'false');
    });

    // Marcar card clicado
    card.classList.add('selected');
    card.setAttribute('aria-checked', 'true');
    userAnswers[step] = value;

    // Habilitar botão Avançar
    if (diagBtnNext) {
      diagBtnNext.disabled = false;
    }
    if (diagHint) {
      diagHint.textContent = 'Opção selecionada! Avançando...';
    }

    // Auto-avanço suave após 300ms para uma experiência rápida e moderna
    setTimeout(() => {
      if (step < 3) {
        updateDiagStepView(step + 1);
      } else {
        showDiagnosticsResult();
      }
    }, 320);
  }

  // Eventos de clique nas opções
  diagOptionCards.forEach(card => {
    card.addEventListener('click', () => {
      handleOptionSelect(card);
    });
  });

  // Evento no botão Avançar
  if (diagBtnNext) {
    diagBtnNext.addEventListener('click', () => {
      if (!userAnswers[currentDiagStep]) return;

      if (currentDiagStep < 3) {
        updateDiagStepView(currentDiagStep + 1);
      } else {
        showDiagnosticsResult();
      }
    });
  }

  // Evento no botão Voltar
  if (diagBtnPrev) {
    diagBtnPrev.addEventListener('click', () => {
      if (currentDiagStep > 1) {
        updateDiagStepView(currentDiagStep - 1);
      }
    });
  }

  // Gerar o diagnóstico personalizado
  function showDiagnosticsResult() {
    if (diagQuizBody) diagQuizBody.style.display = 'none';
    if (diagLoadingScreen) diagLoadingScreen.style.display = 'flex';

    // Rolar suavemente para o início do diagnóstico para melhor foco
    const diagSection = document.querySelector('#diagnostico');
    if (diagSection) {
      diagSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Simular processamento inteligente (~650ms)
    setTimeout(() => {
      if (diagLoadingScreen) diagLoadingScreen.style.display = 'none';
      if (diagResultScreen) diagResultScreen.style.display = 'block';

      // Calcular índice de agilidade da oficina (entre 68 e 88 pontos)
      let score = 72;
      let scoreStatus = 'Alto Potencial de Aceleração';
      
      const a1 = userAnswers[1];
      const a2 = userAnswers[2];
      const a3 = userAnswers[3];

      if (a1 === 'audios_correria') score += 6;
      if (a1 === 'recepcao_interrompe') score += 8;
      if (a2 === 'pdf_demorado') score += 10;
      if (a2 === 'texto_solto') score += 5;
      if (a3 === 'preso_balcao') score += 6;
      if (a3 === 'pede_desconto') score += 4;
      
      score = Math.min(92, Math.max(68, score));
      if (score >= 82) {
        scoreStatus = 'Excelente Oportunidade de Escala';
      } else if (score >= 75) {
        scoreStatus = 'Alto Potencial de Aceleração';
      } else {
        scoreStatus = 'Grande Ganho de Tempo com Automação';
      }

      if (diagScoreValue) diagScoreValue.textContent = `${score} / 100`;
      if (diagScoreStatus) diagScoreStatus.textContent = scoreStatus;

      // Diagnóstico em tom parceiro, construtivo e objetivo
      let resultTitle = 'Mais velocidade no WhatsApp e fechamento imediato';
      let resultSummary = 'Cotações prontas em 15 segundos liberam o pátio e aceleram as aprovações.';
      let waMessageFocus = 'agilizar respostas e orçamentos no WhatsApp';

      if (a1 === 'demora_horas' || a3 === 'fechou_concorrente') {
        resultTitle = 'Resposta em 15 segundos para fechar antes da concorrência';
        resultSummary = 'O motorista fecha com a oficina que responde primeiro com proposta clara.';
        waMessageFocus = 'responder orçamentos em 15 segundos no WhatsApp e acelerar o fechamento de serviços';
      } else if (a2 === 'preco_cabeca' || a3 === 'pede_desconto') {
        resultTitle = 'Proposta profissional que valoriza peças e mão de obra';
        resultSummary = 'Propostas visuais com marcas homologadas e garantia aumentam as aprovações.';
        waMessageFocus = 'enviar propostas visuais profissionais e valorizar meus orçamentos no WhatsApp';
      } else if (a1 === 'pesquisa_demorada' || a3 === 'preso_balcao') {
        resultTitle = 'Fim da pesquisa demorada no balcão da oficina';
        resultSummary = 'Peças, fluidos e mão de obra calculados na hora por modelo de veículo.';
        waMessageFocus = 'economizar tempo de balcão e automatizar o cálculo de peças e mão de obra';
      }

      if (diagResultTitle) diagResultTitle.textContent = resultTitle;
      if (diagResultSummary) diagResultSummary.textContent = resultSummary;

      // Link dinâmico do WhatsApp com mensagem contextualizada
      if (diagCtaWa) {
        const textEncoded = encodeURIComponent(
          `Olá! Fiz o diagnóstico da minha oficina no site. Meu objetivo principal é ${waMessageFocus} com o App Orçamentos. Gostaria de ver uma demonstração!`
        );
        diagCtaWa.href = `https://wa.me/5548992233575?text=${textEncoded}`;
      }
    }, 650);
  }

  // Refazer Questionário
  if (diagBtnRestart) {
    diagBtnRestart.addEventListener('click', () => {
      // Limpar seleções
      userAnswers[1] = null;
      userAnswers[2] = null;
      userAnswers[3] = null;

      diagOptionCards.forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      });

      if (diagResultScreen) diagResultScreen.style.display = 'none';
      if (diagQuizBody) diagQuizBody.style.display = 'block';

      updateDiagStepView(1);

      const diagSection = document.querySelector('#diagnostico');
      if (diagSection) {
        diagSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Inicializar na etapa 1
  updateDiagStepView(1);

  // Efeito de rolagem para o cabeçalho fixo
  const siteHeader = document.querySelector('.header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ==========================================================================
  // 7. MAGNETIC BUTTONS & CLICK RIPPLES
  // ==========================================================================
  const magneticElements = document.querySelectorAll('.magnetic');
  if (finePointer.matches) {
    magneticElements.forEach(el => {
      el.addEventListener('pointermove', e => {
        if (reducedMotion.matches) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.22;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });

      ['pointerleave', 'pointercancel', 'blur'].forEach(ev => {
        el.addEventListener(ev, () => {
          el.style.transform = '';
        });
      });
    });
  }

  const rippleButtons = document.querySelectorAll('.button, .nav-cta, .sim-whatsapp-btn');
  rippleButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      if (reducedMotion.matches) return;
      btn.querySelectorAll('.click-ripple').forEach(r => r.remove());
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'click-ripple';
      ripple.setAttribute('aria-hidden', 'true');
      const clickX = e.clientX ? e.clientX - rect.left : rect.width / 2;
      const clickY = e.clientY ? e.clientY - rect.top : rect.height / 2;
      ripple.style.left = `${clickX}px`;
      ripple.style.top = `${clickY}px`;
      btn.append(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ==========================================================================
  // 7.5. FAQ INTERATIVO ACCORDION (EXPANDE / RECOLHE AO CLICAR NA PERGUNTA)
  // ==========================================================================
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    const headerBtn = card.querySelector('.faq-card-header');
    if (!headerBtn) return;

    headerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isAlreadyActive = card.classList.contains('active');
      card.classList.toggle('active', !isAlreadyActive);
      headerBtn.setAttribute('aria-expanded', !isAlreadyActive);
    });
  });

  // 7.6. FAQ VER MAIS DÚVIDAS NO MOBILE (+ Ver mais dúvidas / - Ver menos dúvidas)
  const faqSection = document.querySelector('#faq');
  const faqMoreBtn = document.querySelector('#faq-more-btn');
  const faqMoreText = document.querySelector('#faq-more-text');
  const faqMoreSymbol = document.querySelector('#faq-more-symbol');

  if (faqSection && faqMoreBtn) {
    faqMoreBtn.addEventListener('click', () => {
      const isExpanded = faqSection.classList.contains('faq-expanded');

      if (!isExpanded) {
        faqSection.classList.add('faq-expanded');
        faqMoreBtn.setAttribute('aria-expanded', 'true');
        if (faqMoreText) faqMoreText.textContent = 'Ver menos dúvidas';
        if (faqMoreSymbol) faqMoreSymbol.textContent = '−';
      } else {
        faqSection.classList.remove('faq-expanded');
        faqMoreBtn.setAttribute('aria-expanded', 'false');
        if (faqMoreText) faqMoreText.textContent = 'Ver mais dúvidas';
        if (faqMoreSymbol) faqMoreSymbol.textContent = '+';
        // Rolagem suave para o início da seção de dúvidas ao recolher
        faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ==========================================================================
  // 8. INTERSECTION OBSERVER REVEAL
  // ==========================================================================
  if ('IntersectionObserver' in window) {
    const revealTargets = [
      '.section-heading',
      '.comparison-card',
      '.journey-step-item',
      '.smartphone-device',
      '.whatsapp-mockup-card',
      '.diag-cockpit',
      '.diag-impact-card',
      '.diag-benefit-card',
      '.client-access-card',
      '.faq-card',
      '.cta-card'
    ];

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px 40px 0px'
      }
    );

    revealTargets.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, idx) => {
        if (!reducedMotion.matches) {
          el.style.setProperty('--enter-delay', `${(idx % 3) * 65}ms`);
          el.classList.add('enter');
        } else {
          el.classList.add('is-visible');
        }
        observer.observe(el);
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {

  // Init values
  let autoMinPrice = 1500000;
  let autoMaxPrice = 10000000;
  let autoDiffPrice = autoMaxPrice - autoMinPrice;
  const timeMinFee = 6;
  const timeMaxFee = 120;
  const timeDiffFee = timeMaxFee - timeMinFee;

  // Edit input fields
  const inputValues = document.querySelectorAll('.calculate__input');
  inputValues[0].value = Number(inputValues[0].value).toLocaleString('ru-RU');
  inputValues[1].value = Number(inputValues[1].value).toLocaleString('ru-RU') + ' ₽';

  // Get values
  const priceAuto = document.getElementById('price-auto');
  const feeAuto = document.getElementById('price-fee');
  const timeAuto = document.getElementById('time');
  const feeTag = document.querySelector('.calculate__tag_sm');
  const inputTags = document.querySelectorAll('.calculate__tag');

  // Edit text <p> fields
  const textValues = document.querySelectorAll('.calculate__value');
  textValues.forEach(el => el.textContent = Number(el.textContent).toLocaleString('ru-RU'));
  const subtitles = document.querySelectorAll('.calculate__subtitle');
  const roubleSymbols = document.querySelectorAll('.calculate__rouble');

  // Form alert form values
  const submitBtn = document.getElementById('submit-btn');
  const leasingForm = document.getElementById('leasing-form');
  const submitSpinner = document.querySelector('.calculate__spinner');
  const buttonValue = document.querySelector('.calculate__button-value');

  const disableFields = () => {
    submitBtn.disabled = true;
    inputValues.forEach(elem => elem.disabled = true);
    rangeInputs.forEach(elem => elem.disabled = true);
    inputTags.forEach(elem => elem.classList.add('disabled'));
    textValues.forEach(elem => elem.classList.add('disabled'));
    subtitles.forEach(elem => elem.classList.add('disabled'));
    roubleSymbols.forEach(elem => elem.classList.add('disabled'));
  }

  const enableFields = () => {
    submitBtn.disabled = false; 
    inputValues.forEach(elem => elem.disabled = false);
    rangeInputs.forEach(elem => elem.disabled = false);
    inputTags.forEach(elem => elem.classList.remove('disabled'));
    textValues.forEach(elem => elem.classList.remove('disabled'));
    subtitles.forEach(elem => elem.classList.remove('disabled'));
    roubleSymbols.forEach(elem => elem.classList.remove('disabled'));
  }

  const waiting = () => {
    buttonValue.textContent = '';
    disableFields();
    submitSpinner.classList.add('calculate__spinner_loading')
    setTimeout(() => {  
      submitSpinner.classList.remove('calculate__spinner_loading'); 
      enableFields();
      buttonValue.textContent = 'Оставить заявку';
    }, 1000)
  }

  const getForm = (form) => {
    let finalObj = Object.fromEntries(new FormData(form))
    finalObj.total = textValues[0].textContent + ' ₽';
    finalObj.mountly = textValues[1].textContent + ' ₽';
    let alertContent = JSON.stringify(finalObj);
    setTimeout(() => alert(alertContent), 1000);
    waiting();
  }
  leasingForm.addEventListener('submit',(e) => {e.preventDefault(); getForm(leasingForm)})

  // Get range inputs
  const rangeInputs = document.querySelectorAll('.calculate__range');
  const priceAutoRange = document.getElementById('auto-range');
  const priceFeeRange = document.getElementById('fee-range');
  const priceTimeRange = document.getElementById('time-range');

  // Calculate formulas
  const monthlyPay = () => {
    return ( priceAuto.value.replaceAll(' ','') - feeAuto.value.split(' ₽')[0].replaceAll(' ','') ) * 
    ( 0.05 * Math.pow((1 + 0.05), Number(timeAuto.value)) ) / 
    ( Math.pow((1 + 0.05), Number(timeAuto.value)) - 1 );
  }
  const calculateTotalSum = () => {
    return Number(feeAuto.value.split(' ₽')[0].replaceAll(' ','')) + Number(timeAuto.value) * Math.ceil(monthlyPay()).toFixed();
  }

  // Set color for range input
  const setFillRangeInputColor = (input, percent) => {
    const rangeColor = 'linear-gradient(90deg, rgb(255, 149, 20)' + percent + '%, rgb(225, 225, 225)' + percent + '%)';
    input.style.background = rangeColor;
  }

  // Update min and max values for fee range input
  const updateMinMaxFee = () => {
    priceFeeRange.min = (Number(priceAuto.value.replaceAll(' ', ''))*0.1).toFixed();
    priceFeeRange.max = (Number(priceAuto.value.replaceAll(' ', ''))*0.6).toFixed();
  }

  // Input functions
  const setCarCost = (e) => {
    e.currentTarget.myParam.value = Number(e.target.value).toLocaleString('ru-RU');
    const newFeeAuto = Number((priceAutoRange.value.replaceAll(' ', '') * feeTag.textContent.replaceAll('%', '') * 0.01).toFixed(0));
    priceFeeRange.value = newFeeAuto;
    const percent = (((+(e.currentTarget.value) - autoMinPrice)*100)/autoDiffPrice).toFixed();
    setFillRangeInputColor(e.currentTarget, percent);
    updateMinMaxFee();
    updateTextValues();
  }
  const setFee = (e) => {
    const percent = ((parseInt(e.currentTarget.value.replaceAll(' ', '').split('₽')[0], 10) * 100 / Number(priceAuto.value.replaceAll(' ', ''))).toFixed(0) - 10) * 2;
    setFillRangeInputColor(e.currentTarget, percent);
    e.currentTarget.myParam.value = Number(e.target.value).toLocaleString('ru-RU', { maximumFractionDigits: 0});
    feeTag.textContent = (parseInt(feeAuto.value.replaceAll(' ', '').split('₽')[0], 10) * 100 / Number(priceAuto.value.replaceAll(' ', ''))).toFixed(0) + '%';    
    e.currentTarget.myParam.value += ' ₽';
    updateTextValues();
  }
  const setTime = (e) => {
    timeAuto.value = e.currentTarget.value;
    const percent = ((parseInt(timeAuto.value - timeMinFee) * 100) / timeDiffFee);
    setFillRangeInputColor(e.currentTarget, percent);
    updateTextValues();
  }

  // Update text <p> fields
  const updateTextValues = () => {
    textValues[0].textContent = Number(calculateTotalSum()).toLocaleString('ru-RU');
    textValues[1].textContent = Math.ceil(Number(monthlyPay())).toLocaleString('ru-RU');
  }

  const inputRegex = /[^0-9]/;
  const setInput = (e) => {
    if (e.key == 'Backspace') {
      return;
    }
    if (e.key.match(inputRegex)) {
      e.preventDefault();
    } else return;
  }

  const focusOut = (e) => {
    updateMinMaxFee();
    if (Number(e.target.value.replaceAll(' ', '')) < autoMinPrice) {
      e.target.value = Number(autoMinPrice).toLocaleString('ru-RU');
      priceAutoRange.value = e.currentTarget.value.replaceAll(' ', '')
      const percent = (((e.target.value.replaceAll(' ', '') - autoMinPrice)*100)/autoDiffPrice).toFixed();
      setFillRangeInputColor(priceAutoRange, Number(percent));
      updateTextValues();
    } else if (Number(e.target.value.replaceAll(' ', '')) > autoMaxPrice) {
      e.target.value = Number(autoMaxPrice).toLocaleString('ru-RU');
      priceAutoRange.value = e.currentTarget.value.replaceAll(' ', '')
      const percent = (((e.target.value.replaceAll(' ', '') - autoMinPrice)*100)/autoDiffPrice).toFixed();
      setFillRangeInputColor(priceAutoRange, Number(percent));
      updateTextValues();
    } else {
      e.target.value = Number(e.target.value.replaceAll(' ', '')).toLocaleString('ru-RU');
      priceAutoRange.value = e.currentTarget.value.replaceAll(' ', '')
      const percent = (((e.target.value.replaceAll(' ', '') - autoMinPrice)*100)/autoDiffPrice).toFixed();
      setFillRangeInputColor(priceAutoRange, Number(percent));
      updateTextValues();
    }
    const feePercent = ((parseInt(feeAuto.value.replaceAll(' ', '').split('₽')[0], 10) * 100 / Number(priceAuto.value.replaceAll(' ', ''))).toFixed(0) - 10) * 2;
    setFillRangeInputColor(priceFeeRange, feePercent);
    const newFeeAuto = Number((priceAutoRange.value.replaceAll(' ', '') * feeTag.textContent.replaceAll('%', '') * 0.01).toFixed(0));
    priceFeeRange.value = newFeeAuto;
    feeAuto.value = Number((Number(e.target.value.replaceAll(' ', '')) * feeTag.textContent.replace('%', '') / 100).toFixed()).toLocaleString('ru-RU') + ' ₽';
  }
  const focusInInput = (e) => {
    e.target.value = Number(e.target.value.replaceAll(' ', '').replace('₽',''));
  }
  const focusOutFee = (e) => {
    updateMinMaxFee();
    if (Number(e.target.value.replaceAll(' ', '').replace('₽','')) < priceFeeRange.min) {
      e.target.value = Number(priceFeeRange.min).toLocaleString('ru-RU') + ' ₽';
      updateTextValues();
    } else if (Number(e.target.value.replaceAll(' ', '').replace('₽','')) > priceFeeRange.max) {
      e.target.value = Number(priceFeeRange.max).toLocaleString('ru-RU') + ' ₽';
      updateTextValues();
    } else {
      e.target.value = Number(e.target.value.replaceAll(' ', '')).toLocaleString('ru-RU') + ' ₽';
      updateTextValues();
    }
    feeTag.textContent = (parseInt(feeAuto.value.replaceAll(' ', '').split('₽')[0], 10) * 100 / Number(priceAuto.value.replaceAll(' ', ''))).toFixed(0) + '%';
    const feePercent = ((parseInt(feeAuto.value.replaceAll(' ', '').split('₽')[0], 10) * 100 / Number(priceAuto.value.replaceAll(' ', ''))).toFixed(0) - 10) * 2;
    setFillRangeInputColor(priceFeeRange, feePercent);
    const newFeeAuto = Number((priceAutoRange.value.replaceAll(' ', '') * feeTag.textContent.replaceAll('%', '') * 0.01).toFixed(0));
    priceFeeRange.value = newFeeAuto;
  }

  // Set input listeners
  priceAuto.addEventListener('keydown', setInput);
  priceAuto.addEventListener('focusin', focusInInput);
  priceAuto.addEventListener('focusout', focusOut);
  feeAuto.addEventListener('keydown', setInput);
  feeAuto.addEventListener('focusin', focusInInput);
  feeAuto.addEventListener('focusout', focusOutFee);
  timeAuto.addEventListener('keydown', setInput);
  
  priceAutoRange.addEventListener('input', setCarCost);
  priceAutoRange.myParam = priceAuto;
  priceFeeRange.addEventListener('input', setFee);
  priceFeeRange.myParam = feeAuto;
  priceTimeRange.addEventListener('input', setTime);
  priceTimeRange.myParam = timeAuto;

  // Set window size
  let windowSize = 0;
  let screenType = 'desktop';

  const windowResize = () => {
    windowSize = window.innerWidth
    if (windowSize > 1120) {
      screenType = 'desktop';
      subtitles[0].textContent = 'Стоимость автомобиля';
    }
    else if (windowSize < 600) {
      screenType = 'mobile';
      subtitles[0].textContent = 'Желаемая сумма кредита';
    } else if (windowSize < 769) {
      screenType = 'tablet';
      subtitles[0].textContent = 'Стоимость автомобиля';
    }
    else {
      screenType = 'laptop';
      subtitles[0].textContent = 'Стоимость автомобиля';
    }
  }
  window.addEventListener("resize", windowResize);

  // Set init range input color
  const initialization = () => {
    const feePercent = ((parseInt(feeAuto.value.replaceAll(' ', '').split('₽')[0], 10) * 100 / Number(priceAuto.value.replaceAll(' ', ''))).toFixed(0) - 10) * 2;
    setFillRangeInputColor(priceFeeRange, feePercent);
    const autoPercent = (((+(priceAutoRange.value) - autoMinPrice) * 100) / autoDiffPrice).toFixed();
    setFillRangeInputColor(priceAutoRange, autoPercent);
    const timePercent = ((parseInt(timeAuto.value - timeMinFee) * 100) / timeDiffFee);
    setFillRangeInputColor(priceTimeRange, timePercent);
    windowResize();
  }

  initialization();

});
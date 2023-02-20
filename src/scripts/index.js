document.addEventListener('DOMContentLoaded', () => {

  // Init values
  const autoMinPrice = 1500000;
  const autoMaxPrice = 10000000;
  const autoDiffPrice = autoMaxPrice - autoMinPrice;
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

  // Edit text <p> fields
  const textValues = document.querySelectorAll('.calculate__value');
  textValues.forEach(el => el.textContent = Number(el.textContent).toLocaleString('ru-RU'));

  // Form alert form values
  const leasingForm = document.getElementById('leasing-form');
  const getForm = (form) => {
    let alertContent = JSON.stringify(Object.fromEntries(new FormData(form)));
    alert(alertContent)
  }
  leasingForm.addEventListener('submit',(e) => {e.preventDefault(); getForm(leasingForm)})

  // Get range inputs 
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
    const rangeColor = 'linear-gradient(90deg, rgb(255, 149, 20)' + percent + '%, rgb(0,0,0,0)' + percent + '%)';
    input.style.background = rangeColor;
  }

  // Input functions
  const setCarCost = (e) => {
    let percent = (((+(e.currentTarget.value) - autoMinPrice)*100)/autoDiffPrice).toFixed();
    setFillRangeInputColor(e.currentTarget, percent);
    e.currentTarget.myParam.value = Number(e.target.value).toLocaleString('ru-RU');
    const newFeeAuto = Number((priceAutoRange.value.replaceAll(' ', '') * feeTag.textContent.replaceAll('%', '') * 0.01).toFixed(0));
    feeAuto.value = newFeeAuto.toLocaleString('ru-RU') + ' ₽';
    // min and max values for an initial fee
    priceFeeRange.min = Number(priceAuto.value.replaceAll(' ', ''))*0.1;
    priceFeeRange.max = Number(priceAuto.value.replaceAll(' ', ''))*0.6;
    priceFeeRange.value = newFeeAuto;
    textValues[0].textContent = Number(calculateTotalSum()).toLocaleString('ru-RU');
    textValues[1].textContent = Math.ceil(Number(monthlyPay())).toLocaleString('ru-RU');
  }
  const setFee = (e) => {
    let percent = ((parseInt(e.currentTarget.value.replaceAll(' ', '').split('₽')[0], 10) * 100 / Number(priceAuto.value.replaceAll(' ', ''))).toFixed(0) - 10) * 2;
    setFillRangeInputColor(e.currentTarget, percent);
    e.currentTarget.myParam.value = Number(e.target.value).toLocaleString('ru-RU', { maximumFractionDigits: 0});
    feeTag.textContent = (parseInt(feeAuto.value.replaceAll(' ', '').split('₽')[0], 10) * 100 / Number(priceAuto.value.replaceAll(' ', ''))).toFixed(0) + '%';    
    e.currentTarget.myParam.value += ' ₽';
    textValues[0].textContent = Number(calculateTotalSum()).toLocaleString('ru-RU');
    textValues[1].textContent = Math.ceil(Number(monthlyPay())).toLocaleString('ru-RU');
  }
  const setTime = (e) => {
    timeAuto.value = e.currentTarget.value;
    let percent = ((parseInt(timeAuto.value - timeMinFee) * 100) / timeDiffFee);
    setFillRangeInputColor(e.currentTarget, percent);
    textValues[0].textContent = Number(calculateTotalSum()).toLocaleString('ru-RU');
    textValues[1].textContent = Math.ceil(Number(monthlyPay())).toLocaleString('ru-RU');
  }

  // Set input listeners
  priceAutoRange.addEventListener('input', setCarCost);
  priceAutoRange.myParam = priceAuto;
  priceFeeRange.addEventListener('input', setFee);
  priceFeeRange.myParam = feeAuto;
  priceFeeRange.isFeeRange = true;
  priceTimeRange.addEventListener('input', setTime);
  priceTimeRange.myParam = timeAuto;
  priceTimeRange.isTimeRange = true;

  // Set init range input color
  const initialization = () => {
    const feePercent = ((parseInt(feeAuto.value.replaceAll(' ', '').split('₽')[0], 10) * 100 / Number(priceAuto.value.replaceAll(' ', ''))).toFixed(0) - 10) * 2;
    setFillRangeInputColor(priceFeeRange, feePercent);
    const autoPercent = (((+(priceAutoRange.value) - autoMinPrice) * 100) / autoDiffPrice).toFixed();
    setFillRangeInputColor(priceAutoRange, autoPercent);
    const timePercent = ((parseInt(timeAuto.value - timeMinFee) * 100) / timeDiffFee);
    setFillRangeInputColor(priceTimeRange, timePercent);
  }

  initialization();
});
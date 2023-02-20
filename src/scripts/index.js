document.addEventListener('DOMContentLoaded', () => {

  // Edit input fields
  const inputValues = document.querySelectorAll('.calculate__input');
  inputValues[0].value = Number(inputValues[0].value).toLocaleString('ru-RU');
  inputValues[1].value = Number(inputValues[1].value).toLocaleString('ru-RU') + ' ₽';

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
});
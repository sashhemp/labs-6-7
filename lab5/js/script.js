//авто переход по текстовым полям
const inputs = document.querySelectorAll('input[type="text"]');
inputs.forEach((input, index) => {
  input.addEventListener('input', function() {
    // Если длина значения равна максимальной длине, переводим фокус на следующее поле
    if (this.value.length === this.maxLength) {
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  });
});

//кнопка сбросв полей
document.getElementById('reset').addEventListener('click', function() {
  document.getElementById('input1').value = '';
  document.getElementById('input2').value = '';  
  document.getElementById('input3').value = '';
  document.getElementById('input4').value = '';

  //Удаляем все динамически добавленные поля
  const inputGroups = document.querySelectorAll('.new-form-group');
  inputGroups.forEach(group => group.remove());
});

const modal = document.getElementById('Modal');
const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const input3 = document.getElementById("input3");
const colorSelect = document.getElementById("color-select");
const modalText = document.getElementById("modalText");

//кнопка вывода модального окна
document.getElementById('display').onclick = function() {
  const text1 = input1.value;
  const text2 = input2.value;
  const text3 = input3.value;
  const selectedColor = colorSelect.value;

  //формирование текста для модального окна
  modalText.innerHTML = `${text1} ${text2} ${text3}`;
  modalText.style.color = selectedColor; 

  modal.style.display = "block";
}

function closeModal() {
    modal.style.display = 'none';
}

//3акрытие модального окна при клике на крестик
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    closeModal();
}

//закрыть мод окно при щелчке в любом месте
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}

//кнопка вставки текстового поля, заполненного текстом из 3 поля и даты
document.getElementById('generate').addEventListener('click', function() {
  const textInput3 = document.getElementById('input3').value;
  const input1 = document.getElementById('input1');

  const today = new Date();
  const formattedDate = today.toLocaleDateString();

  let inputGroup = document.createElement('div');
  inputGroup.className = 'new-form-group';

  let newLabel = document.createElement('label');
  newLabel.textContent = 'Result:';
  let newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.size = 20;
  newInput.value = `${textInput3} ${formattedDate}`;
  newInput.style.marginLeft = '6px';

  inputGroup.appendChild(newLabel);
  inputGroup.appendChild(newInput);
  input1.insertAdjacentElement('afterend', inputGroup);
});
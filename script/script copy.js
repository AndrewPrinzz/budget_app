'use strict';

let start = document.getElementById('start'),
  reset = document.getElementById('cancel'),
  allInput = document.querySelectorAll('.data input[type="text"]'),
  btnPlus = document.getElementsByTagName('button'),
  incomePlus = btnPlus[0],
  expensesPlus = btnPlus[1],
  additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
  depositCheck = document.getElementById('deposit-check'),
  budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
  budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
  expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
  accumulatedMonthValue = document.getElementsByClassName('accumulated_month-value')[0],
  additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
  additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
  incomePeriodValue = document.getElementsByClassName('income_period-value')[0],
  targetMonthValue = document.getElementsByClassName('target_month-value')[0],
  salaryAmount = document.querySelector('.salary-amount'),
  incomeTitle = document.querySelector('.income-title'),
  expensesTitle = document.querySelector('.expenses-title'),
  expensesItems = document.querySelectorAll('.expenses-items'),
  additionalExpress = document.querySelector('.additionanl_expenses'),
  periodSelect = document.querySelector('.period-select'),
  additionalExpensesItem = document.querySelector('.additional_expenses-item'),
  targetAmount = document.querySelector('.target-amount'),
  incomeItem = document.querySelectorAll('.income-items'),
  periodAmount = document.querySelector('.period-amount'),
  incomeAmount = document.querySelector('.income-amount'),
  depositBank = document.querySelector('.deposit-bank'),
  depositPercent = document.querySelector('.deposit-percent'),
  depositAmount = document.querySelector('.deposit-amount'),
  btns = document.querySelectorAll('.btn_plus'),
  incomeExpenses = document.querySelectorAll('.result-total[placeholder="Наименования"]');
const AppData = function () {
  this.budget = 0;
  this.budgetDay = 0;
  this.budgetMonth = 0;
  //доп доходы
  this.income = {};
  //
  this.incomeMonth = 0;
  //перечислить доп доходы
  this.addIncome = [];
  //содержит доп.расходы
  this.expenses = {};
  //массив с возможными расходами
  this.addExpenses = [];
  //
  this.expensesMonth = 0;
  //депозит
  this.deposit = false;
  //процент депозита
  this.percentDeposit = 0;
  //сколько человек денег заложил
  this.moneyDeposit = 0;


};

AppData.prototype.start = function () {
  if (salaryAmount.value === '') {
    start.setAttribute('disable', '');
  }
  // if (salaryAmount.value === '') {
  //   alert('Ошибка, поле "Месячный доход" должно быть заполнено');
  //   return;
  // }
  this.budget = +salaryAmount.value;
  this.getExpenses();
  this.getIncome();
  this.blockButton();
  this.getExpensesMonth();
  this.getInfoDeposit();
  this.getBudget();
  // appData.asking();    
  this.getAddExpenses();
  this.getAddIncome();
  this.showResult();

  localStorage.setItem('budgetMonthValue', this.budget);
  localStorage.setItem('budgetDayValue', this.budgetDay);
  localStorage.setItem('expensesMonthValue', this.expensesMonth);
  localStorage.setItem('additionalIncomeValue', this.addIncome.join(', '));
  localStorage.setItem('additionalExpensesValue', this.addExpenses.join(', '));
  localStorage.setItem('targetMonthValue', Math.ceil(this.getTargetMonth()));
  localStorage.setItem('incomePeriodValue', this.calcPeriod());
  //Вешаю блок в кеш
  localStorage.setItem('blockAll', 'blockAll');
};

AppData.prototype.reset = function () {
  let inputTextAll = document.querySelectorAll('input[type=text]');

  inputTextAll.forEach(function (item) {
    item = item.removeAttribute('disabled');
  });

  inputTextAll.forEach(function (item) {
    item.value = '';
  });


  periodSelect.value = '1';
  periodAmount.textContent = periodSelect.value;


  let incomeChilds = document.querySelector('.income');
  if (incomeItem.length === 3) {
    incomeChilds.removeChild(incomeItem[2]);
    incomeChilds.removeChild(incomeItem[1]);
    incomePlus.style.display = 'block';
  } else if (incomeItem.length === 2) {
    incomeChilds.removeChild(incomeItem[1]);
  }

  let expensesChilds = document.querySelector('.expenses');
  if (expensesItems.length === 3) {
    expensesChilds.removeChild(expensesItems[2]);
    expensesChilds.removeChild(expensesItems[1]);
    expensesPlus.style.display = 'block';
  } else if (expensesItems.length === 2) {
    expensesChilds.removeChild(expensesItems[1]);
  }

  this.budget = 0;
  this.budgetMonth = 0;
  this.income = {};
  this.incomeMonth = 0;
  this.addIncome = [];
  this.expenses = {};
  this.addExpenses = [];
  this.expensesMonth = 0;
  this.deposit = false;
  this.percentDeposit = 0;
  this.moneyDeposit = 0;
  this.budgetDay = 0;

  localStorage.setItem('budgetMonthValue', this.budget);
  localStorage.setItem('budgetDayValue', this.budgetDay);
  localStorage.setItem('expensesMonthValue', this.expensesMonth);
  localStorage.setItem('additionalIncomeValue', this.addIncome);
  localStorage.setItem('additionalExpensesValue', this.addExpenses);
  localStorage.setItem('targetMonthValue', 0);
  localStorage.setItem('incomePeriodValue', "Срок");
  localStorage.setItem('blockAll', '0');
  reset.style.display = 'none';
  start.style.display = 'block';
};
AppData.prototype.getInfoDeposit = function () {
  if (this.deposit) {
    this.percentDeposit = depositPercent.value;
    this.moneyDeposit = depositAmount.value;
  }
};
AppData.prototype.blockButton = function () {
  allInput.forEach(function (item, i, array) {
    item.setAttribute('disabled', 'disabled');
  });
  start.style.display = 'none';
  reset.style.display = 'block';
};
//блок кнопки
//Вывод результатов вычисления
AppData.prototype.showResult = function () {
  const _this = this;
  //Бюджет на месяц
  budgetMonthValue.value = this.budget;
  //Бюджет на день
  budgetDayValue.value = this.budgetDay;
  //расходы за месяц
  expensesMonthValue.value = this.expensesMonth;
  //возможные доходы
  additionalIncomeValue.value = this.addIncome.join(', ');
  //возможные расходы
  additionalExpensesValue.value = this.addExpenses.join(', ');
  //накопления за период
  incomePeriodValue.value = this.calcPeriod();
  //срок достижения в месяцах
  targetMonthValue.value = Math.ceil(this.getTargetMonth());
  
  //здесь писать
  //incomePeriodValue.addEventListener('click', incomePeriodValue.value = appData.calcPeriod());
  

  periodSelect.addEventListener('change', function () {
    incomePeriodValue.value = _this.calcPeriod();
  });
  
  /*
  let toJson = JSON.stringify(this);
  localStorage.setItem("toJson", toJson);
  JSON.parse(localStorage.getItem("toJson"));
  console.log('JSON.parse(localStorage.getItem("toJson")): ', JSON.parse(localStorage.getItem("toJson")));
  console.log(toJson);*/
};
AppData.prototype.getExpenses = function () {
  const _this = this;
  expensesItems.forEach(function (item) {
    let itemExpenses = item.querySelector('.expenses-title').value;
    let cashExpenses = item.querySelector('.expenses-amount').value;
    if (itemExpenses !== '' && cashExpenses !== '') {
      //записываем ключ = значение
      _this.expenses[itemExpenses] = cashExpenses;
    }
  });
};
//сделать так же как в getExpenses
AppData.prototype.getIncome = function () {
  const _this = this;
  incomeItem.forEach(function (item) {
    let itemIncome = item.querySelector('.income-title').value;
    let cashIncome = item.querySelector('.income-amount').value;
    if (itemIncome !== '' && cashIncome !== '') {
      //записываем ключ = значение
      _this.income[itemIncome] = cashIncome;
    }
  });
  for (let key in appData.income) {
    _this.incomeMonth += +_this.income[key];
  }
};
//добавляем вывод возможных расходов
AppData.prototype.getAddExpenses = function () {
  let addExpenses = additionalExpensesItem.value.split(',');
  const _this = this;
  addExpenses.forEach(function (item) {
    console.log();
    item = item.trim();
    if (item !== '') {
      _this.addExpenses.push(item);
    }
  });
};
//возможные доходы

AppData.prototype.getAddIncome = function () {
  const _this = this;
  additionalIncomeItem.forEach(function (item) {
    let itemValue = item.value.trim();
    if (itemValue !== '') {
      _this.addIncome.push(itemValue);
      console.log(itemValue);
    }
  });
};
//метод где мы спрашиваем пользователя
AppData.prototype.getExpensesMonth = function () {
  const _this = this;
  for (let key in _this.expenses) {
    _this.expensesMonth += +_this.expenses[key];
  }
};
AppData.prototype.getBudget = function () {
  this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + (this.moneyDeposit * this.percentDeposit)/12;
  this.budgetDay = Math.floor(this.budgetMonth / 30);
};
AppData.prototype.getTargetMonth = function () {
  return targetAmount.value / appData.budgetMonth;
};
AppData.prototype.calcPeriod = function () {
  return this.budgetMonth * periodSelect.value;
};
AppData.prototype.eventListeners = function () {
  //настраиваем вызов функции start. Ее мы вызываем по нажатию кнопки рассчитать
  const _this = this;
  start.addEventListener('click', this.start.bind(this));
  reset.addEventListener('click', this.reset);
  //console.log('Расходы в месяц: ' + appData.expensesMonth);
  expensesPlus.addEventListener('click', this.addExpensesBlock);
  incomePlus.addEventListener('click', this.addIncomeBlock);
  let period = document.querySelector('.period');
  //динамическое изменение периода расчета
  periodSelect.addEventListener('click', function () {
    document.querySelector('.period-amount').textContent = this.value;
  });
  //блокирование кнопки рассчитать пока не заполнено поле
  start.setAttribute('disabled', '');
  salaryAmount.addEventListener('change', function () {
    if (salaryAmount.value !== '') {
      start.removeAttribute('disabled', '');
    } else {
      start.setAttribute('disabled', '');
    }
  });
  document.addEventListener('click', function () {
    if (depositCheck.checked === true) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      appData.deposit = 'true';
      depositBank.addEventListener('change', function () {
        let selectIndex = this.options[this.selectedIndex].value;
        if (selectIndex === 'other') {
          depositPercent.style.display = 'inline-block';
          depositPercent.value = '';
        } else {
          depositPercent.style.display = 'none';
          depositPercent.value = selectIndex;
        }
        console.log(selectIndex);
      });
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositAmount.value = '';
      appData.deposit = 'false';
    }
  });
  btns.forEach((element) => {
    element.addEventListener('click', () => {
      //узнаю детей элемента
      let childElement = element.parentNode.childNodes;
      console.log(childElement);
      //вытаскиваю клонируемый элемент
      let parentElem = childElement[3].cloneNode(true);
      parentElem.childNodes[1].value = "";
      parentElem.childNodes[3].value = "";
      //клонирую элемент
      element.insertAdjacentElement('beforebegin', parentElem);
      //если длина NodeList детей 9, то скрываю кнопку
      if (childElement.length === 9) {
        element.style.display = 'none';
      }
    });
  });
};
AppData.prototype.getCookie = function () {
  //Бюджет на месяц
  budgetMonthValue.value = localStorage.getItem('budgetMonthValue');
  //Бюджет на день
  budgetDayValue.value = localStorage.getItem('budgetDayValue');
  //расходы за месяц
  expensesMonthValue.value = localStorage.getItem('expensesMonthValue');
  //возможные доходы
  additionalIncomeValue.value = localStorage.getItem('additionalIncomeValue');
  //возможные расходы
  additionalExpensesValue.value = localStorage.getItem('additionalExpensesValue');
  //срок достижения в месяцах
  incomePeriodValue.value = localStorage.getItem('incomePeriodValue');
  //накопления за период
  targetMonthValue.value = localStorage.getItem('targetMonthValue');

  //блок всего
  document.addEventListener("DOMContentLoaded", (item) => {
    if (localStorage.getItem("blockAll") === "blockAll") {
      console.log("Заблокировано");
      console.log(reset);
      reset.style.display = 'block';
      start.style.display = 'none';
      allInput.forEach(function (item, i, array) {
        item.setAttribute('disabled', 'disabled');
      });
    } else {
      console.log("Разблокировано");
    }
  });
};


const appData = new AppData();

appData.eventListeners();
appData.getCookie();
// appData.setCookie();

const checked = document.getElementById('checked');

/* оставляю его открытым */
  let checkbox = document.querySelector('#checkboxed');

if (localStorage.getItem("isChecked") === "true") {
  depositCheck.checked = true;
}


depositCheck.addEventListener('click', function () {
  if (depositCheck.checked === true) {
    localStorage.setItem('isChecked', true);
  } else {
    localStorage.setItem('isChecked', false);
  }
});


/*
AppData.prototype.showResult = function () {
  const _this = this;
  //Бюджет на месяц
  localStorage.setItem('budgetMonthValue', this.budget);
  budgetMonthValue.value = this.budgetMonth;
  //Бюджет на день
  localStorage.setItem('budgetDayValue', this.budgetDay);
  budgetDayValue.value = this.budgetDay;
  //расходы за месяц
  localStorage.setItem('expensesMonthValue', this.expensesMonth);
  expensesMonthValue.value = this.expensesMonth;
  //возможные доходы
  localStorage.setItem('additionalIncomeValue', this.addIncome.join(', '));
  additionalIncomeValue.value = this.addIncome.join(', ');
  //возможные расходы
  localStorage.setItem('additionalExpensesValue', this.addExpenses.join(', '));
  additionalExpensesValue.value = this.addExpenses.join(', ');
  //накопления за период
  localStorage.setItem('targetMonthValue', Math.ceil(this.getTargetMonth()));
  targetMonthValue.value = Math.ceil(this.getTargetMonth());

  //здесь писать
  //incomePeriodValue.addEventListener('click', incomePeriodValue.value = appData.calcPeriod());    
  incomePeriodValue.value = this.calcPeriod();
  periodSelect.addEventListener('change', function () {
    incomePeriodValue.value = _this.calcPeriod();
  });


  let toJson = JSON.stringify(this);
  localStorage.setItem("toJson", toJson);
  JSON.parse(localStorage.getItem("toJson"));
  console.log('JSON.parse(localStorage.getItem("toJson")): ', JSON.parse(localStorage.getItem("toJson")));
  console.log(toJson);
};

*/
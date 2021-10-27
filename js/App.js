const $ = (selector) => document.querySelector(selector);
const date = new Date();

function App() {
  this.currentDate = {
    year: 0,
    month: 0,
    day: 0,
  };

  this.init = () => {
    renderCalendar();
    initEventListener();
    modalEventListener();
  };

  const todoTemplate = (todoName) => {
    return `
    <li class="todo-item">
      <input type="checkbox" style="width: 18px; height: 18px" />
      <span class="todo-name">${todoName}</span>
      <i class="fas fa-edit"></i>
      <i class="fas fa-trash"></i>
    </li>`;
  };

  const renderCalendar = () => {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    this.currentDate.year = currentYear;
    this.currentDate.month = currentMonth;

    $(".select-month").innerText = `${currentYear}년 ${
      currentMonth + 1 < 10 ? "0" + (currentMonth + 1) : currentMonth + 1
    }월`;

    const prevLast = new Date(currentYear, currentMonth, 0);
    const thisLast = new Date(currentYear, currentMonth + 1, 0);

    const prevLastDate = prevLast.getDate();
    const prevLastDay = prevLast.getDay();

    const thisLastDate = thisLast.getDate();
    const thisLastDay = thisLast.getDay();

    const prevDates = [];
    const thisDates = [...Array(thisLastDate + 1).keys()].slice(1);
    const nextDates = [];

    if (prevLastDay !== 6) {
      for (let i = 0; i < prevLastDay + 1; i++) {
        prevDates.unshift(prevLastDate - i);
      }
    }

    for (let i = 1; i < 7 - thisLastDay; i++) {
      nextDates.push(i);
    }

    const dates = prevDates.concat(thisDates, nextDates);
    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(thisLastDate);

    dates.forEach((date, i) => {
      const condition =
        i >= firstDateIndex && i < lastDateIndex + 1
          ? "current-days"
          : "different-days";
      dates[
        i
      ] = `<div class="date-sel ${condition}"><span>${date}</span></div>`;
    });

    $(".container-date-sel").innerHTML = dates.join("");
  };

  const initEventListener = () => {
    $(".todo-save-btn").addEventListener("click", addTodo);
    $("#todo-name").addEventListener("keypress", (e) => {
      if (e.key === "Enter") addTodo();
    });

    $(".prev-month-btn").addEventListener("click", () => {
      date.setMonth(date.getMonth() - 1);
      renderCalendar();
      modalEventListener();
    });

    $(".next-month-btn").addEventListener("click", () => {
      date.setMonth(date.getMonth() + 1);
      renderCalendar();
      modalEventListener();
    });
  };

  const addTodo = () => {
    if ($("#todo-name").value === "") {
      alert("할 일을 적어주세요.");
      return;
    }
    const todoName = $("#todo-name").value;
    $(".todo-list").innerHTML = todoTemplate(todoName);
    $("#todo-name").value = "";
  };

  // 모달 입력 창 닫기
  const modalClose = () => {
    $(".container-modal").classList.remove("show");
  };

  // 모달 입력 창 띄우기
  const modalShow = () => {
    $(".container-modal").classList.add("show");
  };

  const modalEventListener = () => {
    const currentDays = document.querySelectorAll(".current-days");
    for (let i = 0; i < currentDays.length; i++) {
      currentDays[i].addEventListener("click", () => {
        modalShow(),
          ($(".modal-title").innerText = `${this.currentDate.year}년 ${
            this.currentDate.month + 1
          }월 ${currentDays[i].innerText}일 스케줄`);
      });
    }

    $(".overlay").addEventListener("click", modalClose);
  };
}

const app = new App();
app.init();

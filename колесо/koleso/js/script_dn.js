// надписи и цвета на секторах
const prizes = [
  {
    text: "Сертифікат 500 грн",
    color: "#e32433",  
  }, 
  { 
    text: "Сертифікат 1000 грн",
    color: "#fff",
    cls: "white small"
  },
  { 
    text: "Сертифікат 2000 грн",
    color: "#3291cb",
  },
  {
    text: "Телевізор",
    color: "#ff6600",
    cls: "small"
  },
  {
    text: "Знижка 5%",
    color: "#91c534",
  },
  {
    text: "Знижка 10%",
    color: "#ffa800",
    cls: "small"
  },
  {
    text: "Знижка 25%",
    color: "#e32433",
  },
  {
    text: "Подарунок 300 грн",
    color: "#464344",
  },
  {
    text: "Подарунок 600 грн",
    color: "#3090cc",
  },
  {
    text: "Подарунок 900 грн",
    color: "#ffa800",
  },
  {
    text: "Подарунок 1200 грн",
    color: "#91c534",
    cls: "small"
  }, 
  {
    text: "Подарунок 1500 грн",
    color: "#ffa800",
  },
];

// создаём переменные для быстрого доступа ко всем объектам на странице — блоку в целом, колесу, кнопке и язычку
const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");

// на сколько секторов нарезаем круг
const prizeSlice = 360 / prizes.length;
// на какое расстояние смещаем сектора друг относительно друга
const prizeOffset = Math.floor(180 / prizes.length);
// прописываем CSS-классы, которые будем добавлять и убирать из стилей
const spinClass = "is-spinning";
const selectedClass = "selected";
// получаем все значения параметров стилей у секторов
const spinnerStyles = window.getComputedStyle(spinner);

// переменная для анимации
let tickerAnim;
// угол вращения
let rotation = 0;
// текущий сектор
let currentSlice = 0;
// переменная для текстовых подписей
let prizeNodes;

// расставляем текст по секторам
const createPrizeNodes = () => {
  // обрабатываем каждую подпись
  prizes.forEach(({ text, color, reaction, cls }, i) => {
	  //alert(reaction);
    // каждой из них назначаем свой угол поворота
    const rotation = ((prizeSlice * i) * -1) - prizeOffset;
    // добавляем код с размещением текста на страницу в конец блока spinner
    spinner.insertAdjacentHTML(
      "beforeend",
      // текст при этом уже оформлен нужными стилями
      `<li class="prize ${cls}" data-reaction=${reaction} style="--rotate: ${rotation}deg">
        <span class="text">${text}</span>
      </li>`
    );
  });
};

// рисуем разноцветные секторы
const createConicGradient = () => {
  // устанавливаем нужное значение стиля у элемента spinner
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from -90deg,
      ${prizes
        // получаем цвет текущего сектора
        .map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`)
        .reverse()
      }
    );`
  );
};

// создаём функцию, которая нарисует колесо в сборе
const setupWheel = () => {
  // сначала секторы
  createConicGradient();
  // потом текст
  createPrizeNodes();
  // а потом мы получим список всех призов на странице, чтобы работать с ними как с объектами
  prizeNodes = wheel.querySelectorAll(".prize");
};

// определяем количество оборотов, которое сделает наше колесо
const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// функция запуска вращения с плавной остановкой
const runTickerAnimation = () => {
  // взяли код анимации отсюда: https://css-tricks.com/get-value-of-css-rotation-through-javascript/
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];  
  let radrad = Math.atan2(b, a);
   
  
  if (rad < 0) rad += (2 * Math.PI);
  
  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  // анимация язычка, когда его задевает колесо при вращении
  // если появился новый сектор
  if (currentSlice !== slice) {
    // убираем анимацию язычка
    ticker.style.animation = "none";
    // и через 10 миллисекунд отменяем это, чтобы он вернулся в первоначальное положение
    setTimeout(() => ticker.style.animation = null, 10);
    // после того, как язычок прошёл сектор - делаем его текущим 
    currentSlice = slice;
  }
  // запускаем анимацию
  tickerAnim = requestAnimationFrame(runTickerAnimation);
};

// функция выбора призового сектора
const selectPrize = () => {
  const selected = Math.floor(rotation / prizeSlice);
  prizeNodes[selected].classList.add(selectedClass);
  console.info(selected);
  console.info(prizes[selected]);
  console.info(prizeNodes[selected]);
  console.info(prizeNodes[selected].querySelector(".text").innerText );
  
  $("input[name=order1c_code]").val('');
  
};





// отслеживаем нажатие на кнопку
trigger.addEventListener("click", () => {
	
	if(!$("input[name=order1c_code]").val()){
		alert("Введіть номер реалізації");
		return;
	} 
	
	
	
// делаем её недоступной для нажатия  &filter_name=' +  

console.info(prizes);

trigger.disabled = true;
	$.ajax({
        url: 'index.php?route=information/koleso_dn/start&order1c_code=' + encodeURIComponent($("input[name=order1c_code]").val()),
        type: 'get',
        dataType: 'json',
        success: function(json) {
			if (json['rand_item'] || json['rand_item'] == 0) {
				
					//alert(json['rand_item']);
				 
				 
					var need_item_rotation = 0;
					var item_step = 30;
					
					console.info("spinertia 1="+((item_step*json['rand_item'])+1)  );
					console.info("spinertia 2="+((item_step*json['rand_item'])+28)); 
  
				 
				 
				
				  // задаём начальное вращение колеса
				  rotation = Math.floor(Math.random() * 360 + spinertia(10, 4000)); 
				  rotation = (360*2) + spinertia(((item_step*json['rand_item'])+1), ((item_step*json['rand_item'])+28) ); 
				  console.info(rotation);
				  // убираем прошлый приз
				  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
				  // добавляем колесу класс is-spinning, с помощью которого реализуем нужную отрисовку
				  wheel.classList.add(spinClass);
				  // через CSS говорим секторам, как им повернуться
				  spinner.style.setProperty("--rotate", rotation);
				  // возвращаем язычок в горизонтальную позицию
				  ticker.style.animation = "none";
				  // запускаем анимацию вращение
				  runTickerAnimation();
				  
				  //alert(json['rand_item2']);
				  
			}
        }
    });
	
	 
 
	
  

});

// отслеживаем, когда закончилась анимация вращения колеса
spinner.addEventListener("transitionend", () => {
  // останавливаем отрисовку вращения
  cancelAnimationFrame(tickerAnim);
  // получаем текущее значение поворота колеса
  rotation %= 360;
  // выбираем приз
  selectPrize();
  // убираем класс, который отвечает за вращение
  wheel.classList.remove(spinClass);
  // отправляем в CSS новое положение поворота колеса
  spinner.style.setProperty("--rotate", rotation);
  // делаем кнопку снова активной
  trigger.disabled = false;
});

// подготавливаем всё к первому запуску
setupWheel();
const nameEmployee = document.querySelector('.name__employee');
const infoEmployee = document.querySelector('.info__employee');

function toggleInfoEmployee() {
    toggle = infoEmployee.style.display = "none" ? infoEmployee.style.display = "block" : infoEmployee.style.display = "none"
    return toggle;
}

nameEmployee.addEventListener('click', toggleInfoEmployee);
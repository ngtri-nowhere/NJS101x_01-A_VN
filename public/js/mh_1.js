// điêm danh
const diemDanhOn = document.querySelector('.diem__danhOn');
const btnDiemDanh = document.querySelector('#diemDanh');
const submitDiemDanh = document.querySelector('#submitdiemDanh');
const startWork = document.querySelector('.batdau__lamviec');




function toggleDiemDanh() {
    diemDanhOn.style.display = "block"
    startWork.style.display = "none"
    nghiConLai.style.display = "none"
}
function toggleSubmit() {
    startWork.style.display = "block"
    diemDanhOn.style.display = "none"
}

btnDiemDanh.addEventListener('click', toggleDiemDanh); // hiện data employee


// kết thúc 
const ketThuc = document.querySelector('#ketThuc');
const ketThucOn = document.querySelector('.ket__thucOn');

function toggleKetThuc() {
    ketThucOn.style.display = "block";
    startWork.style.display = "none";
    diemDanhOn.style.display = "none";
}

ketThuc.addEventListener('click', toggleKetThuc); // show ketthuc 

// nghĩ phép

const nghiPhep = document.querySelector('#nghiPhep');
const nghiPhepOn = document.querySelector('.nghi_phepOn');
const submitNghiPhep = document.querySelector('#submitNghiPhep');
const nghiConLai = document.querySelector('.nghi_phepConLai');

function toggleNghiPhep() {
    nghiPhepOn.style.display = "block";
}

function toggleSubmitNghiPhep() {
    nghiPhepOn.style.display = "none";
    nghiConLai.style.display = "block";
}

nghiPhep.addEventListener('click', toggleNghiPhep);







document.addEventListener('DOMContentLoaded', function () {    
    const btn1 = document.querySelector('.benefit_outcome');
    btn1.addEventListener('click', function () {
        const plusIcon = document.querySelector('.tab-benefits-plus-icon');
        const minusIcon = document.querySelector('.tab-benefits-minus-icon');
        const tabDetails = document.querySelector('.tab-benefits-detail');
        if (minusIcon.style.display === 'none') {
            minusIcon.style.display = 'block';
            plusIcon.style.display = 'none';
            tabDetails.style.display = 'block';
        }else{
            minusIcon.style.display = 'none';
            plusIcon.style.display = 'block';
            tabDetails.style.display = 'none';
        }
    });
    const btn2 = document.querySelector('.how_to_use');
    btn2.addEventListener('click', function () {
        const plusIcon = document.querySelector('.tab-howtouse-plus-icon');
        const minusIcon = document.querySelector('.tab-howtouse-minus-icon');
        const tabDetails = document.querySelector('.tab-howtouse-detail');
        if (minusIcon.style.display === 'none') {
            minusIcon.style.display = 'block';
            plusIcon.style.display = 'none';
            tabDetails.style.display = 'block';
        }else{
            minusIcon.style.display = 'none';
            plusIcon.style.display = 'block';
            tabDetails.style.display = 'none';
        }
    });
    const btn3 = document.querySelector('.key_ingredients');
    btn3.addEventListener('click', function () {
        const plusIcon = document.querySelector('.tab-keying-plus-icon');
        const minusIcon = document.querySelector('.tab-keying-minus-icon');
        const tabDetails = document.querySelector('.tab-keying-detail');
        if (minusIcon.style.display === 'none') {
            minusIcon.style.display = 'block';
            plusIcon.style.display = 'none';
            tabDetails.style.display = 'block';
        }else{
            minusIcon.style.display = 'none';
            plusIcon.style.display = 'block';
            tabDetails.style.display = 'none';
        }
    });
});